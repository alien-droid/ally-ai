'use client'

import React, { ChangeEvent, FormEvent } from 'react'
import {ChatRequestOptions} from 'ai'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { SendHorizonal } from 'lucide-react';

interface ChatFormProps {
    input: string;
    handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>, chatRquestOptions?: ChatRequestOptions | undefined) => void;
    isLoading: boolean;
}

const ChatForm = ({input, handleInputChange, onSubmit, isLoading} :ChatFormProps) => {
  return (
    <form onSubmit={onSubmit} className='border-t border-black py-4 flex items-center gap-x-2'>
        <Input disabled={isLoading} value={input} onChange={handleInputChange} placeholder='Type a message' className='rounded-lg bg-primary/15 border-black'/>
        <Button variant={`ghost`} disabled={isLoading}><SendHorizonal className='h-5 w-5'/></Button>
    </form>
  )
}

export default ChatForm
