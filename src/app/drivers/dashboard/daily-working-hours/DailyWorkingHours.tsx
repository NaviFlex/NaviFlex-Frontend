'use client';

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { obtainRouteFromDayByDriverId } from '@/services/driver/routesManagement';
import { ApiResponse } from "@/types/shared/api_response";
import { UserIcon, TruckIcon } from '@heroicons/react/24/solid';
import {SpinnerComponent} from '@/components/ui/spinner';

export default function DriverAssignedOrders() {

    const user = useUser();
    
  

    const [loading, setLoading] = useState(true);
    const [ordersData, setOrdersData] = useState<any[]>([]);
    const [hasRoute, setHasRoute] = useState(true);
    const [userData, setUserData] = useState<any>(null);    

    useEffect(() => {

        const fetchInitialData = async () => {
            setLoading(true);

            const localData = localStorage.getItem('userData');
            setUserData(localData ? JSON.parse(localData) : null);

            try{
                const response_route_original = await obtainRouteFromDayByDriverId(user?.profileId || 0);
                setOrdersData(response_route_original.data.coordinates);

                setLoading(false);

            } catch (err: ApiResponse <any>){
                if (err?.response?.status === 404) {
                    setHasRoute(false);
                    setLoading(false);
                  } else {
                    setHasRoute(false);
                    setLoading(false);
                  }
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
            <SpinnerComponent />
        ):(

            <div className="w-full h-auto p-4 bg-white flex flex-col gap-4 rounded-[12px]">
                { hasRoute ? (
                                        <div className=" relative w-full h-full">
                                        {/* Header */}
                                    <div className="flex w-full justify-center items-center gap-3 border-b pb-2">
                                    <div className="text-[#5E52FF]">
                                        <TruckIcon className="h-16 w-16 text-[#5E52FF] mb-2" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[#5E52FF]">Chofer</h2>
                                        <p className="text-sm text-black font-medium">{userData.full_name} {userData.last_names}</p>
                                        <p className="text-sm text-gray-600">Unidad: {userData.driver_data.badge_number}</p>
                                    </div>
                                    </div>
                            
                                    {/* Subtítulo */}
                                    <h3 className="text-[#5E52FF] font-semibold mt-2 mb-2">Pedidos asignados:</h3>
                            
                                    {/* Tarjetas en fila (responsive) */}
                                    <div className="flex flex-wrap justify-start max-sm:justify-center gap-4">
            
                                    {ordersData.map((order, index) => (
                                        <div
                                        key={index}
                                        className="w-[380px] bg-[#5E52FF] rounded-xl p-4 text-white flex items-center gap-4"
                                        >
                                        <UserIcon className="h-16 w-16 text-white mb-2" />
                                        <div className="text-sm">
                                            <h4 className="font-semibold text-base">{order.client_name}</h4>
                                            <p><strong>Dirección:</strong> {order.client_address}</p>
                                            <p><strong>N° de Orden: </strong> {order.order_code}</p>
                                        </div>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                ):(
                    <div className="flex flex-col justify-center items-center h-full text-center text-[#5E52FF] p-6">
                        <h2 className="text-xl font-semibold mb-2">Aún no tienes una ruta asignada</h2>
                        <p className="text-sm text-gray-600">Tu administrador te asignará una ruta en breve. ¡Gracias por tu paciencia!</p>
                    </div>
                )
                }
            </div>

            
        )
      }
      
      </>
    );
  }
  