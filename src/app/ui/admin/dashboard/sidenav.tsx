'use client'
//import Link from 'next/link';
import NavLinks from './nav-links';
import { useEffect, useState } from 'react'

//import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightStartOnRectangleIcon ,UserCircleIcon } from '@heroicons/react/24/outline';
import {useRouter} from "next/navigation";


export default function SideNav() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const dataUser = localStorage.getItem('userData')
    if (dataUser) {
      setUserData(JSON.parse(dataUser))
    }
  }, [])

  return (
    <div className="flex h-full flex-col bg-white text-indigo-900 p-3 rounded-[12px] w-60  ">
        {/* Perfil */}
        <div className="flex gap-3 items-center mb-5">
            <UserCircleIcon className="h-25 w-25 text-[#5E52FF]" />
            <div className="flex flex-col items-start w-35 ">
            <span className="mt-2 text-[15px] font-bold text-[#5E52FF]">
            {userData?.admin_data?.company_name || 'Empresa'}
          </span>
          <span className="mt-1 text-sm font-medium text-[#000000FF]">
            {userData?.full_name || 'Nombre'}
          </span>
          <span className="text-[10px] font-medium text-[#000000FF]">
            {userData?.email || 'Correo'}
          </span>

            </div>
        </div>

        <hr className="border-t-2 border-indigo-200 mb-4" />

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