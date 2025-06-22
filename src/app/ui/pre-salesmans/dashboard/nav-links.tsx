'use client'
import {
    UsersIcon ,
    MapIcon,
  } from '@heroicons/react/24/outline';
  
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const links = [
  {
    name: 'Cartera de clientes',
    href: '/pre-salesmans/dashboard/client-portfolio',
    icon: UsersIcon ,
  },
  {
    name: 'Jornada diaria',
    href: '/pre-salesmans/dashboard/daily-working-hours',
    icon: MapIcon,
  },

]


export default function NavLinks({ onClickLink }: { onClickLink?: () => void }) {
  const pathname =usePathname()
  return (
    <div>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <div key={link.name}>
            <Link
              href={link.href}
              onClick={onClickLink}
              className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md 
                p-2 text-sm text-[#5E52FF] font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
                transition transform duration-150 ease-in-out active:scale-107

                ${pathname === link.href ? 'bg-indigo-400 text-white text-lg scale-107' : ''}
              `}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
            <hr className=" border-t-1 border-[#5E52FF] opacity-50" />
          </div>
        );
      })}
      
    </div>
  );
}