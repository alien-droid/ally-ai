'use client'
import { Category } from '@prisma/client'
import React from 'react'
import { Button } from './ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { cn } from '@/lib/utils'

interface CategoriesProps {
    categories: Category[]
}

const Categories = ({ categories }: CategoriesProps) => {

    const router = useRouter()
    const searchParams = useSearchParams()

    const categoryId = searchParams.get('categoryId')
    
    const onClick = (id: string | undefined) => {
        const query = {categoryId: id}
        const url = qs.stringifyUrl({
            url: window.location.href,
            query
        }, {skipNull: true})
        router.push(url)
    }

    return (
        <div className='w-full space-x-4 flex p-1 overflow-x-auto'>
            <Button 
            className={cn('flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-white text-black hover:bg-primary/20 transition border-black border', !categoryId? 'bg-primary/20' : 'bg-white')} onClick={() => onClick(undefined)}>
                Newest
            </Button>
            {categories.map(category => (
                <Button key={category.id} className={cn('flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-white text-black hover:bg-primary/20 transition border-black border', category.id === categoryId ? 'bg-primary/20' : 'bg-white')} onClick={() => onClick(category.id)}>
                    {category.name}
                </Button>
            ))}
        </div>
    )
}

export default Categories
