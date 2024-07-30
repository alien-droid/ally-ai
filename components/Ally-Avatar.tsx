import { Avatar, AvatarImage } from './ui/avatar';
import React from 'react'

interface AvatarProps {
    imageUrl: string;
}

const AllyAvatar = ({imageUrl} : AvatarProps) => {
  return (
    <Avatar className='h-12 w-12'>
        <AvatarImage src={imageUrl}/>
    </Avatar>
  )
}

export default AllyAvatar
