"use client";
import React from "react";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import AllyAvatar from "./Ally-Avatar";
import { ScaleLoader } from "react-spinners";
import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { CopyIcon } from "lucide-react";

export interface ChatMessageProps {
  role: "system" | "user";
  content?: string;
  isLoading?: boolean;
  src?: string;
}

export const ChatMessage = ({ role, content, isLoading, src }: ChatMessageProps) => {
  const { toast } = useToast();
  const user = useUser()

  const onCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast({
      description: "Message copied to clipboard",
      duration: 3000,
    });
  };
  return (
    <div
      className={cn(
        "group flex items-start gap-x-3 py-4 w-full",
        role === "user" && "justify-end"
      )}
    >
      {role !== "user" && src && <AllyAvatar imageUrl={src} />}
      <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
        {isLoading ? (
          <ScaleLoader height={15} width={5} color="black" />
        ) : (
          content
        )}
      </div>
      {role === "user" && (
          <Avatar className='h-12 w-12'>
            <AvatarImage src={user?.user?.imageUrl} />
          </Avatar>
      )}
      {role !== "user" && !isLoading && (
          <Button onClick={onCopy} className="opacity-0 group-hover:opacity-100 transition" size="icon" variant="ghost">
            <CopyIcon className="h-4 w-4" />
          </Button>
          )}
    </div>
  );
};


