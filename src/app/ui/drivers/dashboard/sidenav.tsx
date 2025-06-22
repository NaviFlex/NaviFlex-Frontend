'use client'
import NavLinks from './nav-links';
import { ArrowRightStartOnRectangleIcon ,UserCircleIcon } from '@heroicons/react/24/outline';
import {useRouter} from "next/navigation";
import { useState, useEffect } from 'react';
// ✅ LÍMPIALO: sin animaciones ni clases condicionales
export default function SideNav({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const localData = localStorage.getItem('userData');
    if (localData) {
      setUserData(JSON.parse(localData));
    }
  }, []);

  return (
    <div className="flex h-full flex-col bg-white text-indigo-900 p-3 rounded-[12px] w-full md:w-60">
      {/* Perfil */}
      <div className="flex gap-3 items-center mb-5">
        <UserCircleIcon className="h-25 w-25 text-[#5E52FF]" />
        <div className="flex flex-col items-start w-35">
          <span className="mt-2 text-[15px] font-bold text-[#5E52FF]">Chofer</span>
          <span className="mt-1 text-sm font-medium text-[#000000FF]">
            {userData?.full_name} {userData?.last_names}
          </span>
          <span className="text-[10px] font-medium text-[#000000FF]">{userData?.email}</span>
        </div>
      </div>

      <hr className="border-indigo-200 mb-4" />
      <NavLinks onClickLink={onCloseMobile} />
      <hr className="border-indigo-200 mb-4" />

      <div className="w-full h-full flex flex-col justify-between items-center pb-4">
      <div className="d"></div>
        <button
          onClick={() => {
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            localStorage.removeItem('userData');
            router.push('/auth/login');
          }}
          className="flex items-center gap-2 text-sm text-indigo-700 hover:text-white transition-all"
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
