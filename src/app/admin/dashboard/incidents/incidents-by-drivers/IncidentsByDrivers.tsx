"use client";


import { getChangesRouteByDriversCurrentDay } from '@/services/admin/changesRouting/changesRoutesManagementService';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';

export default function IncidentsByDrivers() {

    const [incidentsData, setIncidentsData] = useState<any[]>([])
    const user = useUser()
    useEffect(() => {

      if (!user?.profileId) return
    
      const fetchData = async () => {
        try {
          const response= await getChangesRouteByDriversCurrentDay(user.profileId)
          
          if (Array.isArray(response.data)) {
            setIncidentsData(response.data)
          } else {
            setIncidentsData([]) // o puedes no hacer nada, según tu lógica
          }
          
  
  
          }
         catch (error) {
          console.error("❌ Error cargando datos de clientes o rutas:", error)
        }
      }
    
      fetchData()
    }, [user?.profileId])

  return (
    <div className="p-4 md:p-6 w-full bg-white rounded-md shadow h-full overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[25px] md:text-xl font-bold text-[#5E52FF]">Listado de incidentes por conductor</h2>
        <span className="text-[25px] font-bold text-[#5E52FF]">{new Date().toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}</span>
      </div>

      <hr className="border-[#292929FF] border-1 mb-6" />
      {incidentsData.map((incident, i) => (
            <div key={i} className="mb-6">
                <div className="flex flex-wrap gap-2 items-center justify-start mb-4 w-full bg-[#5E52FF] p-4 rounded-[10px] border-none sticky top-0 z-10">
                    <span className="text-white text-[20px] font-bold">{incident.driver_name} {incident.driver_lastname}</span>
                </div>

                <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="border-b-[4px] border-[#5E52FF] text-[#5E52FF]">
                    <tr>
                        <th className="px-2 text-[15px] md:px-4 py-2">Nombre del cliente</th>
                        <th className="px-2 text-[15px] md:px-4 py-2">Tipo de incidente</th>
                        <th className="px-2 text-[15px] md:px-4 py-2">Hora</th>
                    </tr>
                    </thead>
                    <tbody>
                    {incident.route_changes.map((item, j) => (
                        <tr key={j} className="border-b hover:bg-[#f4f4ff]">
                        <td className="px-2 text-[#5E52FF] md:px-4 py-2">{item.restrictions.client_name}</td>
                        <td className="px-2 text-[#5E52FF] md:px-4 py-2">{item.restrictions.type_incidents}</td>
                        <td className="px-2 text-[#5E52FF] md:px-4 py-2">{item.created_at}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            ))}

      
     
    </div>
  );
}