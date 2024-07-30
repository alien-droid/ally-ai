"use client";
import { Ally } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { Card, CardFooter, CardHeader } from "./ui/card";
import Link from "next/link";
import { MessageSquareCode } from "lucide-react";

interface AllyProps {
  data: (Ally & { _count: { messages: number } })[];
}

const Allies = ({ data }: AllyProps) => {
  if (data.length === 0) {
    return (
      <div className="pt-10 flex flex-col justify-center items-center space-y-4">
        <div className="relative w-60 h-60">
          <Image alt="Empty" src={"/empty-plx.svg"} fill />
        </div>
        <p className="text-sm text-muted-foreground">No Allies found.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pb-10">
      {data.map((item) => (
        <Card
          key={item.id}
          className="rounded-xl border-black cursor-pointer hover:bg-primary/15 transition border-2"
        >
          <Link href={`/chat/${item.id}`}>
            <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
              <div className="relative w-28 h-28">
                <Image
                  alt={item.name}
                  src={item.src}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <p className="font-bold">{item.name}</p>
              <p className="text-xs">{item.description}</p>
            </CardHeader>
            <CardFooter className="flex items-center text-xs text-muted-foreground justify-between">
              <p className="lowercase">@{item.userName}</p>
              <div className="flex items-center">
                <MessageSquareCode className="w-4 h-4 mr-1" />
                <p className="text-sm">{item._count.messages}</p>
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default Allies;
