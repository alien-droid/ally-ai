import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

export type AllyKey = {
  allyName: string;
  model: string;
  userId: string;
};

export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorClient: Pinecone;

  public constructor() {
    this.history = Redis.fromEnv();
    this.vectorClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }

  // public async init() {
  //     if (this.vectorClient instanceof Pinecone) {
  //         this.vectorClient = new Pinecone({
  //             apiKey: process.env.PINECONE_API_KEY!,
  //         })
  //     }
  // }

  public async vectorSearch(recentChatHistory: string, allyFileName: string) {
    const pineconeClient = <Pinecone>this.vectorClient;
    const pineconeIndex = pineconeClient.index(
      process.env.PINECONE_INDEX || "",
      "https://allly-ljl9tg2.svc.aped-4627-b74a.pinecone.io"
    );

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_AI_KEY }),
      { pineconeIndex }
    );

    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, { fileName: allyFileName })
      .catch((err) => {
        console.log("Failed to get vector search results", err);
      });
    return similarDocs;
  }

  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  private generateRedisKey(allyKey: AllyKey): string {
    return `${allyKey.userId}-${allyKey.model}-${allyKey.allyName}`;
  }

  public async writeToHistory(text: string, allyKey: AllyKey) {
    if (!allyKey || typeof allyKey.userId == "undefined") {
      console.log("Ally key not found");
      return "";
    }
    const key = this.generateRedisKey(allyKey);
    const result = await this.history.zadd(key, {
      member: text,
      score: Date.now(),
    });
    return result;
  }

  public async getFromHistory(allyKey: AllyKey): Promise<string> {
    if (!allyKey || typeof allyKey.userId == "undefined") {
      console.log("Ally key not found");
      return "";
    }

    const key = this.generateRedisKey(allyKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });
    result = result.slice(-30).reverse();
    const recentChats = result.reverse().join("\n");
    return recentChats;
  }

  public async seedChatHistory(
    seedContent: string,
    delimiter: string = "\n",
    allyKey: AllyKey
  ) {
    const key = this.generateRedisKey(allyKey);
    if (await this.history.exists(key)) {
      console.log("History already exists");
      return;
    }

    const content = seedContent.split(delimiter);
    let counter = 0;
    for (const chat of content) {
      await this.history.zadd(key, { score: counter, member: chat });
      counter++;
    }
  }
}
