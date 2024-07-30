import ChatClient from "@/components/ChatClient";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

const page = async ({ params }: ChatPageProps) => {
  const { userId } = auth();
  if (!userId) {
    return auth().redirectToSignIn();
  }

  const ally = await db.ally.findUnique({
    where: { id: params.chatId },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  if (!ally) {
    return redirect("/");
  }

  return (
      <ChatClient data={ally} />
  );
};

export default page;
