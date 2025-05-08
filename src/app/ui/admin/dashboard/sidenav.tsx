//import Link from 'next/link';
import NavLinks from './nav-links';
//import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightStartOnRectangleIcon ,UserCircleIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-indigo-300 text-indigo-900 p-4 rounded-r-2xl w-60">
        {/* Perfil */}
        <div className="flex flex-col items-center mb-6">
            <UserCircleIcon className="h-24 w-24 text-white" />
            <span className="mt-2 text-sm font-medium text-white">Mi perfil</span>
        </div>

        <hr className="border-indigo-200 mb-4" />

            {/* Aquí va NavLinks */}
            <NavLinks />

        <hr className="border-indigo-200 my-4 mt-auto" />

        {/* Cerrar sesión */}
        <button className="flex items-center gap-2 text-sm text-indigo-700 hover:text-white transition-all">
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            Cerrar sesión
        </button>
    </div>

  );
}