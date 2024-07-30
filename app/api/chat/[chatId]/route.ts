import { StreamingTextResponse, LangChainAdapter, ReplicateStream } from "ai";

import { currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import db from "@/lib/db";
import { Replicate } from "@langchain/community/llms/replicate";

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await req.json();
    const user = await currentUser();

    if (!user || !user.id || !user.firstName)
      return new NextResponse("Unauthorized", { status: 401 });

    const identifier = req.url + "-" + user.id;
    const { success } = await rateLimit(identifier); // rate limit the user requests

    if (!success) {
      return new NextResponse("Too many requests", { status: 429 });
    }
    // saving the messages to the database
    const ally = await db.ally.update({
      where: { id: params.chatId },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    });

    if (!ally) {
      return new NextResponse("Ally Character not found", { status: 404 });
    }

    const name = ally.id;
    const allyFileName = name + ".txt";

    const allyKey = {
      allyName: name,
      userId: user.id,
      model: "llama2-13b",
    };

    const memoryManager = await MemoryManager.getInstance();
    const records = await memoryManager.getFromHistory(allyKey);

    if (records.length === 0) {
      await memoryManager.seedChatHistory(ally.seed, "\n\n", allyKey);
    }

    await memoryManager.writeToHistory("User: " + prompt + "\n", allyKey);
    const recentChatHistory = await memoryManager.getFromHistory(allyKey);

    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      allyFileName
    );

    let relevantHistory = "";
    if (!!similarDocs && similarDocs.length != 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
    }

    const model = new Replicate({
      model:
        "meta/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
      input: { max_tokens: 2048 },
      apiKey: process.env.REPLICATE_API_TOKEN,
    });
    model.verbose = true;
    const response = await model
      .invoke(
        `
            ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}: prefix.

            ${ally.instructions}

            Below are the relevant details about ${name}'s past and the conversation you are in.
            ${relevantHistory}

            ${recentChatHistory}\n${name}
        `
      )
      .catch(console.error);
    if (!response) {
      console.error("Error generating plain sentences");
      return new NextResponse("Error generating response", { status: 500 });
    }
    const cleaned = response.replaceAll(",", "");
    const chunks = cleaned.split("\n");
    const resp = chunks[chunks.length - 1];
    console.log(resp);

    var Readable = require("stream").Readable;
    let stream = new Readable();
    stream.push(resp);
    stream.push(null);

    if (resp.length > 1) {
      await memoryManager.writeToHistory("" + resp.trim(), allyKey);
      // save the message to db
      await db.ally.update({
        where: { id: params.chatId },
        data: {
          messages: {
            create: {
              content: resp.trim(),
              role: "system",
              userId: user.id,
            },
          },
        },
      });
    }
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log("[CHAT POST], error: " + error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
