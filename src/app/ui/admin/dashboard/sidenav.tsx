'use client'
//import Link from 'next/link';
import NavLinks from './nav-links';
//import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightStartOnRectangleIcon ,UserCircleIcon } from '@heroicons/react/24/outline';
import {useRouter} from "next/navigation";


export default function SideNav() {
  const router = useRouter();
  return (
    <div className="flex h-full flex-col bg-white text-indigo-900 p-3 rounded-[12px] w-60  ">
        {/* Perfil */}
        <div className="flex flex-col items-center mb-7">
            <UserCircleIcon className="h-30 w-30 text-[#5E52FF]" />
            <span className="mt-2 text-sm font-medium text-[#5E52FF]">Mi perfil</span>
        </div>

        <hr className="border-indigo-200 mb-4" />

            {/* Aquí va NavLinks */}
            <NavLinks />

        <hr className="border-indigo-200 mb-4" />

        <div className="w-full h-full flex flex-col justify-between items-center ">
            <div></div>
            <button
                onClick={() => router.push('/auth/login')}
                className="flex items-center gap-2 text-sm text-indigo-700 hover:text-white transition-all"
                >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5"/>
                Cerrar sesión
            </button>
        </div>
    </div>

  );
}