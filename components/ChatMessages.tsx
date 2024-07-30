"use client";

import { Ally } from "@prisma/client";
import React, { useState, useEffect, useRef, ElementRef } from "react";
import { ChatMessage, ChatMessageProps } from "./ChatMessage";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
  ally: Ally;
}

const ChatMessages = ({
  messages = [],
  isLoading,
  ally,
}: ChatMessagesProps) => {
  const [fLoading, setfLoading] = useState(messages.length > 0 ? false : true);
  const scrollRef = useRef<ElementRef<"div">>(null); // dummy element to scroll automatically towards the end of messages

  // dummy fake loading that resembles the bot is loading...
  useEffect(() => {
    const timeout = setTimeout(() => {
      setfLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        src={ally.src}
        content={`Hello, I am ${ally.name}, ${ally.description}`}
        role="system"
        isLoading={fLoading}
      />
      {messages.map((message, index) => (
        <ChatMessage
          role={message.role}
          src={ally.src}
          content={message.content}
          key={index}
        />
      ))}
      {isLoading && (
        <div>
          <ChatMessage src={ally.src} isLoading role="system" />
        </div>
      )}
      <div ref={scrollRef} /> 
    </div>
  );
};

export default ChatMessages;
