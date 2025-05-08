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
    href: '/admin/clientes',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Incidencias',
    href: '/admin/incidencias',
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
          <Link
            key={link.name}
            href={link.href}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 
              p-2 text-sm mb-3 font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
              ${pathname === link.href ? 'bg-indigo-400 text-white' : ''}
              `}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}