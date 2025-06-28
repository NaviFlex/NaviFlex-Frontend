'use client'
import NavLinks from './nav-links';
import { ArrowRightStartOnRectangleIcon ,UserCircleIcon } from '@heroicons/react/24/outline';
import {useRouter} from "next/navigation";
import { useEffect, useState } from 'react';

export default function SideNav({ onCloseMobile }: { onCloseMobile?: () => void }) {
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
                <span className="mt-2 text-[15px]  font-bold text-[#5E52FF]">Prevendedor</span>
                <span className="mt-1 text-sm font-medium text-[#000000FF]">{userData?.full_name}</span>
                <span className=" text-[10px] font-medium text-[#000000FF]">{userData?.email}</span>
            </div>
        </div>

        <hr className="border-indigo-200 mb-4" />

            {/* Aquí va NavLinks */}
            <NavLinks onClickLink={onCloseMobile}  />

        <hr className="border-indigo-200 mb-4" />

        <div className="w-full h-full flex flex-col justify-between items-center mb-5 ">
            <div className=""></div>
            <button
            onClick={() => {
              // 1. Borrar cookie (expirarla manualmente)
              document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

              // 2. (Opcional) Limpiar también datos del localStorage si aún usas algo ahí
              localStorage.removeItem('userData');

              // 3. Redirigir al login
              router.push('/auth/login');
            }}
            className="flex items-center gap-2 text-sm text-[#5E52FF] hover:text-[#5E52FF] transition-all cursor-pointer   "
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
    </div>

  );
}