'use client'

import { UserIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { getDriversByAdminId } from '@/services/admin/drivers/adminDriversService'
import { useEffect, useState } from 'react'
import { ApiResponse } from '@/types/shared/api_response'
import { Driver } from '@/types/admin/drivers/getDriversType'


export default function ListDrivers() {
    const router = useRouter()
    const user = useUser();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      if (!user?.profileId) return;
  
      const fetchDrivers = async () => {
        try {
          const response: ApiResponse<Driver[]> = await getDriversByAdminId(user.profileId);
          setDrivers(response.data || []);
        } catch (err: any) {
          console.error('Error al obtener conductores:', err);
          setError('No se pudo obtener la lista de choferes.');
        } finally {
          setLoading(false);
        }
      };
      fetchDrivers();
    }, [user?.profileId]);

    if (loading) return <p className="p-4">Cargando choferes...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div className="w-full h-full rounded-[12px] bg-white">
            <div className="bg-white rounded-2xl shadow-lg w-full h-full min-h-[80vh] p-6 relative">
                <h1 className="text-xl font-semibold text-[#5E52FF] mb-2">
                    Listado de choferes/unidades
                </h1>
                <hr className="border-[#5E52FF] border-1 mb-6" />

                <div className="grid grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))] gap-2">
                    {drivers.map((driver) => (
                        <div
                            key={driver.id}
                            className="flex flex-col items-center bg-[#5E52FF] text-white rounded-xl p-4 shadow-md w-full max-w-[200px] mx-auto"
                        >
                            <div className="text-4xl mb-2">
                                <UserIcon className="h-15 w-15 text-white" />
                            </div>

                            <div className="font-semibold text-sm mb-2">{driver.full_name}</div>
                            <hr className="border-[#ffffff]  mb-2 w-full" />
                            <div className="text-xs mt-1 mb-4">Placa de Und: {driver.badge_number}</div>


                            <button
                                onClick={() => router.push(`/admin/dashboard/drivers/${driver.id}`)}
                                className="bg-white text-[#5E52FF] text-sm font-medium px-4 py-1 rounded-[10px] hover:bg-gray-100 transition cursor-pointer shadow-md"
                            >
                                Ver detalle
                            </button>
                        </div>
                    ))}
                </div>

                <PlusCircleIcon 
                    onClick={() => router.push('/admin/dashboard/drivers/new-driver')}
                    aria-label="Agregar nuevo chofer"
                    className="absolute bottom-6 right-6 text-[#5E52FF] w-15 h-15 cursor-pointer hover:scale-105 transition-transform"
                    />

                    
              
            </div>
        </div>
    )
}
