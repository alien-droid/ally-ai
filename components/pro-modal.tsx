"use client";

import { useProModal } from "@/hooks/useProModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import axios from "axios";

export const ProModal = () => {
  const proModal = useProModal();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // to prevent hydration warnings
  useEffect(() => {
    setIsMounted(true);
  }, [])

  const { toast } = useToast();
  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stripe')
      window.location.href = response.data.url
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null; // render nothing until component is mounted to prevent hydration warning
  }

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.close}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">Upgrade to Pro!</DialogTitle>
          <DialogDescription className="text-center space-y-2">
            Create your
            <span className="text-black font-medium mx-1 underline">
              Custom AI
            </span>
            Allies.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-between">
          <p className="text-2xl font-semibold">
            $9<span className="text-sm font-normal">.99 / mo</span>
          </p>
          <Button variant="premium" disabled={loading} onClick={onSubscribe}>Subscribe</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
