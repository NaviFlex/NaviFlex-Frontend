'use client'

import { UserIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { useEffect, useState } from 'react'
import { Presalesman } from '@/types/admin/presalesmans/getPresalesmansType'
import { getPresalesmansByAdminId } from '@/services/admin/presalesmans/adminPresalesmansService'
import { ApiResponse } from '@/types/shared/api_response';




export default function ListSalesman() {
    const router = useRouter()
    const user = useUser();
    const [presalesmans, setPresalesmans] = useState<Presalesman[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!user?.profileId) return;

        const fetchPresalesmans = async () => {
            try {
                const response: ApiResponse<Presalesman[]> = await getPresalesmansByAdminId(user.profileId);
                setPresalesmans(response.data || []);

            } catch (err) {
                console.error('Error al obtener prevendedores:', err);
                setError('No se pudo obtener la lista de prevendedores.');
            } finally {
                setLoading(false);
            }
        };
        fetchPresalesmans();
    }, [user?.profileId]);

    if (loading) return <p className="p-4">Cargando prevendedores...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;


    return (
        <div className="w-full h-full rounded-[12px] bg-white">
            <div className="bg-white rounded-2xl shadow-lg w-full h-full min-h-[80vh] p-6 relative">
                <h1 className="text-xl font-semibold text-[#5E52FF] mb-2">Listado de prevendedores</h1>
                <hr className="border-[#5E52FF] border-1 mb-6" />

                <div className="grid grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))] gap-2">
                {presalesmans.map((presalesman) => (
                        <div
                            key={presalesman.id}
                            className="flex flex-col items-center bg-[#5E52FF] text-white rounded-xl p-4 shadow-md w-full max-w-[200px] mx-auto"
                        >
                            <UserIcon className="h-16 w-16 text-white mb-2" />
                            <div className="font-semibold text-sm mb-3">{presalesman.full_name}</div>
                            <hr className="border-[#ffffff]  mb-2 w-full mb-5" />
                            <button
                                onClick={() => router.push(`/admin/dashboard/salesman/${presalesman.id}`)}
                                className="bg-white text-[#5E52FF] text-sm font-medium px-4 py-1 rounded-[10px] hover:bg-gray-100 transition cursor-pointer shadow-md"
                            >
                                Ver detalle
                            </button>
                        </div>
                    ))}
                </div>

 

                <PlusCircleIcon 
                    onClick={() => router.push('/admin/dashboard/salesman/new-salesman')}
                    aria-label="Agregar nuevo prevendedor"
                    className="absolute bottom-6 right-6 text-[#5E52FF] w-15 h-15 cursor-pointer hover:scale-105 transition-transform"
                    />




            </div>
        </div>
    )
}
