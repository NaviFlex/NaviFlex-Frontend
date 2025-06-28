'use client'
import {
  TruckIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const links = [
  {
    name: 'Choferes',
    href: '/admin/dashboard/drivers',
    icon: TruckIcon,
  },
  {
    name: 'Prevendedor',
    href: '/admin/dashboard/salesman',
    icon: UsersIcon,
  },
  {
    name: 'Clientes',
    href: '/admin/dashboard/clients',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Incidencias',
    href: '/admin/dashboard/incidents',
    icon: ClipboardDocumentListIcon,
  },
]


export default function NavLinks() {
  const pathname =usePathname()
  return (
    <div>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <div key={link.name}>
            <Link
              href={link.href}
              className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md 
                p-2 text-sm text-[#5E52FF] font-medium hover:bg-[#5E52FF] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3
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