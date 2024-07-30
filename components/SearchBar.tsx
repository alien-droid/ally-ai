'use client'
import { Search } from 'lucide-react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Input } from './ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@uidotdev/usehooks'
import qs from 'query-string'

const SearchBar = () => {

    const router = useRouter()
    const searchParams = useSearchParams()

    const category = searchParams.get('category')
    const name = searchParams.get('name')

    const [value, setValue] = useState(name || '')

    const debouncedValue = useDebounce(value, 500) // delay between value changes, avoid refiring of urls.

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    useEffect(() => {
        const query = {
            name: debouncedValue,
            category: category,
        }
        const url = qs.stringifyUrl({ url: window.location.href, query }, { skipNull: true, skipEmptyString: true }) // parsing objects as query params in url.
        router.push(url)
    }, [debouncedValue, category, router])


    return (
        <div className='relative'>
            <Search className='absolute h-4 w-4 top-3 left-4 text-muted-foreground' />
            <Input className='pl-10 bg-secondary/10 border border-b-2 border-black' placeholder='Search ...' value={value} onChange={onChange}/>
        </div>
    )
}

export default SearchBar
