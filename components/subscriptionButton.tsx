"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { useToast } from "./ui/use-toast";
import axios from "axios";

const SubscriptionButton = ({ isPro = false }: { isPro: boolean }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      size="sm"
      variant={isPro ? "default" : "premium"}
      disabled={loading}
      onClick={onSubscribe}
    >
      {isPro ? "Manage Subscription" : "Upgrade"}
      {!isPro && <Sparkles className="h-4 w-4 ml-2 fill-white" />}
    </Button>
  );
};

export default SubscriptionButton;
