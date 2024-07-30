'use client'
import { useProModal } from '@/hooks/useProModal'
import { Home, Plus, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Sidebar = ({isPro}: {isPro: boolean}) => {

  const router = useRouter()
  const proModal = useProModal()

  const routes = [
    {
      icon: Home,
      href: "/",
      label: 'Home',
      pro: false
    },
    {
      icon: Plus,
      href: "/ally/add",
      label: 'Add',
      pro: true
    },
    {
      icon: Settings,
      href: "/settings",
      label: 'Settings',
      pro: false
    }
  ]

  const onNavigate = (url: string, pro: boolean) => {
    if (pro && !isPro) {
      return proModal.open()
    }
    return router.push(url)
  }

  return (
    <div className='flex flex-col space-y-4 h-full text-primary bg-secondary border-r-2 border-t-2 border-black rounded-sm'>
      <div className='p-3 justify-center flex flex-1 mx-4'>
        <div className='space-y-2'>{
          routes.map((route) => (
            <div key={route.href} onClick={() => onNavigate(route.href, route.pro)} className='text-xs group flex p-3 -full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition border-black border-b-2'>
              <div className='flex flex-col flex-1 gap-y-2 items-center'>
                <route.icon className='h-6 w-6 ' />
                {route.label}
              </div>
            </div>
          ))
        }</div>
      </div>
    </div>
  )
}

export default Sidebar
