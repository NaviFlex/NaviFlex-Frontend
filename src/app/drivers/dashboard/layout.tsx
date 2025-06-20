'use client';

import { useState } from 'react';
import SideNav from '../../ui/drivers/dashboard/sidenav';
import { MenuIcon, XIcon } from 'lucide-react'; // o usa heroicons si prefieres

export default function DashboardDriversLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-full relative">
      {/* Botón de menú solo visible en móviles */}
      <div className="md:hidden p-2 bg-[#5E52FF] text-white flex justify-between items-center">
        <span className="font-semibold">Menú</span>
        <button onClick={() => setIsOpen(true)}>
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

  
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0000009c] bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}



      <div className="relative h-full md:flex md:flex-row md:overflow-hidden">

        {/* Menú lateral */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 p-3 rounded-[12px] mr-4 transition-transform duration-300 md:relative md:translate-x-0 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Botón de cerrar solo en móvil */}
          <div className="flex justify-end md:hidden">
            <button onClick={() => setIsOpen(false)}>
              <XIcon className="w-6 h-6 text-[#5E52FF]" />
            </button>
          </div>
          <SideNav onCloseMobile={() => setIsOpen(false)} />
        </div>

        <div className="w-full h-full flex-grow md:overflow-y-auto mf-[10px]">
          {children}
        </div>
      </div>
    </div>
  );
}
