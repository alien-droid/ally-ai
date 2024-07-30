"use client";
import React, { useEffect, useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

interface ImageUplaodProps {
  value: string;
  onChange: (src: string) => void;
  disabled?: boolean;
}

const ImageUplaod = ({ value, onChange, disabled }: ImageUplaodProps) => {
  // .. avoid unneccessary rendering during server-side
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        uploadPreset="ally-ai-preset"
        onSuccess={(result: any) => {
          onChange(result.info.secure_url);
        }}
      >
        <div className="flex flex-col border-dashed p-2 border-black border-2 rounded-lg transition hover:bg-primary/10 space-y-2 items-center justify-center">
          <div className="relative h-40 w-40">
            <Image
              fill
              alt="Uplaod"
              src={value || "/image-holder.svg"}
              className="object-cover rounded-lg"
            ></Image>
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};

export default ImageUplaod;
