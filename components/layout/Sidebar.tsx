'use client'
import {MonitorPlay, BarChart4} from 'lucide-react';
import Link from 'next/link'
import {usePathname} from 'next/navigation';

const Sidebar = () => {
    const pathname = usePathname()

    const sidebarRoutes = [
        {icon: <MonitorPlay />, label: 'Cursos', path: '/instructor/courses'},
        {icon: <BarChart4 />, label: 'Performance', path: '/instructor/performance'}
    ]
    return (
        <div className='max-sm:hidden flex flex-col w-64 border-r shadow-md px-3 my-4 gap-4 text-sm font-medium'>
            {sidebarRoutes.map((route) => (
                <Link href={route.path} key={route.path}
                className={`flex items-center gap-4 p-3 rounded-lg hover:bg-[#ebebff] ${pathname.startsWith(route.path) && "bg-[#0e60cc] hover:bg-[#0e60cc]/80"}`}
                >
                   {route.icon} {route.label}</Link>
            ))}
        </div>
    )
}

export default Sidebar;