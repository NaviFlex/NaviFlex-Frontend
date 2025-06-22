'use client';

import { UserIcon } from '@heroicons/react/24/solid';
import { useUser } from "@/hooks/useUser";
import { obtainRouteFromDayByPresalesmanId} from '@/services/presalesman/daily-working/routeManagement'
import { ApiResponse } from "@/types/shared/api_response";
import { useEffect, useState } from "react";
import { SpinnerComponent } from '@/components/ui/spinner';


export default function DailyWorkingHours() {
    
    const user = useUser();
    const [loading, setLoading] = useState(true);
    const [ordersData, setOrdersData] = useState<any[]>([])
    const [ hasRoute, setHasRoute] = useState(true);
    const [ jordanianData, setJordanianData] = useState<any>(null);


    useEffect(() => {

        const fetchInitialData = async () => {
            setLoading(true);

            try {
                const response_route_original = await obtainRouteFromDayByPresalesmanId(user?.profileId || 0);
              
                if (response_route_original.status_code === 200) {
                  setOrdersData(response_route_original.data.coordinates || []);
                  setJordanianData(response_route_original.data);
                  setHasRoute(true);
                } else if (response_route_original.status_code === 404) {
                  setHasRoute(false);
                  setOrdersData([]);
                  setJordanianData(null);
                } else {
                  console.error('Otro error no manejado:', response_route_original);
                  setHasRoute(false);
                  setOrdersData([]);
                  setJordanianData(null);
                }
              
                setLoading(false);
              
              } catch (err) {
                console.error('Error de red o excepción en fetch:', err);
                setHasRoute(false);
                setOrdersData([]);
                setJordanianData(null);
                setLoading(false);
              }
              

        // Aquí podrías hacer una llamada a la API para obtener los pedidos asignados
        // Por ejemplo: fetchAssignedOrders().then(setAssignedOrders);
        }
        fetchInitialData();
    }, [user?.profileId])
    
    

    return (
        <>
        
        {
            loading? (
                <SpinnerComponent/>
            ):(
                        <div className={`w-full ${hasRoute ? 'h-auto' : 'h-full'} p-4 bg-white flex flex-col gap-4 rounded-[12px]`}>
                        {
                        hasRoute ? (
                            <div className="w-full h-full rounded-[12px] bg-white p-4">
                                <div className="bg-[#7284FB] rounded-t-[12px] p-4 text-center text-white">
                                <h1 className="text-lg font-bold">
                                    Jornada: {jordanianData?.date && new Date(jordanianData.date).toLocaleDateString('es-PE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </h1>

                                </div>

                                <div className="mt-4 text-center">
                                    <h2 className="text-[#5E52FF] text-lg font-semibold">
                                        Los siguientes clientes fueron asignados a: {jordanianData?.driver_name || 'Chofer Desconocido'}
                                    </h2>
                                    <hr className="my-2 border-[#5E52FF]" />
                                </div>

                                <div className="space-y-3">
                                    {Array.isArray(ordersData) && ordersData.map((client) => (
                                        <div
                                            key={client.order_id}
                                            className="flex items-center justify-between bg-[#5E52FF] rounded-lg p-2 text-white"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div className="bg-transparent text-white-600 rounded-full p-1">
                                                    <UserIcon className="h-8 w-8" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{client?.client_name}</p>
                                                    <p className="text-sm">N° de Orden: {client?.order_code}</p>
                                                </div>
                                            </div>
                                            <span className="bg-white text-[#5E52FF] rounded-full px-3 py-1 text-sm font-medium">
                                                {client?.order_status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ):(
                            <div className="flex flex-col justify-center items-center h-full text-center text-[#5E52FF] p-6">
                             <h2 className="text-xl font-semibold mb-2">Aún no esta programada la ruta</h2>
                             <p className="text-sm text-gray-600">Tu administrador generara la jornada en breve. ¡Gracias por tu paciencia!</p>
                            </div>
                        )
                    }
                </div>

            )
        }
        
        </>
    );
}