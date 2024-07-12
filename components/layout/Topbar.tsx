"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Menu, Search } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const Topbar = () => {
    const {isSignedIn} = useAuth()

    const topRoutes = [
        {label: 'Instrutor', path: '/instructor/courses'},
        {label: 'Aprendendo', path: '/learning'},
    ]

    return (
        <div className='flex justify-between items-center p-4'>
            <Link href='/'>
         <div className='flex items-center'>
          <Image src='/logo2.png' height={100} width={200} alt='logo' />
          <h1 className='text-2xl font-bold '>
           Educa<span className='text-[#0e60cc]'>Online</span>
         </h1>
         </div>
            </Link>

            <div className='max-md:hidden w-[400px] rounded-full flex '>
                <input className='flex-grow bg-[#e8f0ff] rounded-l-full border-none outline-none text-sm pl-4 py-3'
                placeholder='Pesquisar por Cursos...'
                />
                <button
                className='bg-[#0e60cc] rounded-r-full border-none outline-none cursor-pointer px-4 py-3 hover:bg[#0e60cc]/80'
                >
                    <Search className='h-4 w-4' />
                </button>
            </div>

            <div className='flex gap-6 items-center'>
                <div className='max-sm:hidden flex gap-6'>
                    {topRoutes.map((route) => (
                        <Link href={route.path} key={route.path}
                        className='text-sm font-medium hover:text-[#0e60cc]'>{route.label}</Link>
                    ))}
                </div>
                {isSignedIn ? (
                <UserButton afterSignOutUrl="/sign-in" /> 
                ) : ( 
                <Link href='/sign-in'>
                    <Button>
                        Cadastrar
                    </Button>
                </Link>)}
            </div>
        </div>
    )
}

export default Topbar;