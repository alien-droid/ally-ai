"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Menu, Sparkles } from "lucide-react";
import { Noto_Sans } from "next/font/google";
import Link from "next/link";
import { Button } from "./ui/button";
import MobileSide from "./mSidebar";
import { useProModal } from "@/hooks/useProModal";

const font = Noto_Sans({
  weight: "600",
  subsets: ["latin"],
});

const Navbar = ({ isPro }: { isPro: boolean }) => {
  const proModal = useProModal();

  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary">
      <div className="flex items-center">
        <MobileSide isPro={isPro}/>
        <Link href={"/"}>
          <h1
            className={cn(
              "hidden md:block text-xl md:text-3xl font-bold text-primary",
              font.className
            )}
          >
            ally.ai
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        {!isPro && (
          <Button variant="premium" onClick={proModal.open}>
            Upgrade
            <Sparkles className="h-4 w-4 ml-2 text-white fill-white" />
          </Button>
        )}

        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
