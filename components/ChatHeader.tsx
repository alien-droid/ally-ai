"use client";
import { Ally, Message } from "@prisma/client";
import axios from "axios";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  Edit,
  MessageSquare,
  MoreVertical,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AllyAvatar from "./Ally-Avatar";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "./ui/use-toast";

interface ChatHeaderProps {
  data: Ally & {
    messages: Message[];
    _count: { messages: number };
  };
}

const ChatHeader = ({ data }: ChatHeaderProps) => {
  const router = useRouter();
  const user = useUser();
  const { toast } = useToast();

  const onDelete = async () => {
    try {
      await axios.delete(`/api/ally/${data.id}`);
      
      toast({
        description: "Ally deleted successfully",
      })
      router.refresh();
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    }
  };

  return (
    <div className="flex w-full justify-between items-center border-b border-black pb-4">
      <div className="flex gap-x-2 items-center">
        <Button variant={`ghost`} size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <AllyAvatar imageUrl={data.src} />
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="text-md text-gray-700 font-semibold">{data.name}</p>
            <div className="flex items-center text-muted-foreground text-sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              <p className="text-gray-700">{data._count.messages}</p>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            Created By : @{data.userName}
          </p>
        </div>
      </div>
      {user?.user?.id === data.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="secondary">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/ally/${data.id}`)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ChatHeader;
