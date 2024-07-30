"use client";
import { Ally, Message } from "@prisma/client";
import React, { FormEvent, useState } from "react";
import ChatHeader from "./ChatHeader";
import { useRouter } from "next/navigation";
import { useCompletion } from "ai/react";
import ChatForm from "./ChatForm";
import ChatMessages from "./ChatMessages";
import { ChatMessageProps } from "./ChatMessage";

interface ChatClientProps {
  data: Ally & {
    messages: Message[];
    _count: { messages: number };
  };
}

const ChatClient = ({ data }: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(data.messages);
  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${data.id}`,
      streamMode: 'text',
      onFinish: (prompt, completion) => {
        console.log(`completion : ${completion}`);
        const sysMessage: ChatMessageProps = {
          content: completion,
          role: "system",
        };
        setMessages((current) => [...current, sysMessage]);
        setInput("");
        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      content: input,
      role: "user",
    };
    setMessages((current) => [...current, userMessage]);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader data={data} />
      <ChatMessages ally={data} isLoading={isLoading} messages={messages} />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ChatClient;
