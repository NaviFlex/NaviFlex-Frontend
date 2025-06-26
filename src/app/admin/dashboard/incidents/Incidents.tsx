'use client'

import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react'
import {getChangesRouteByAdminIdAndCurrentDay} from '@/services/admin/changesRouting/changesRoutesManagementService'



export default function Incidents() {

  const [incidentsData, setIncidentsData] = useState<any[]>([])

    const user = useUser()
    useEffect(() => {

      if (!user?.profileId) return
    
      const fetchData = async () => {
        try {
          const response= await getChangesRouteByAdminIdAndCurrentDay(user.profileId)
          
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

  const today = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  return (
    <div className="p-4 md:p-6 w-full bg-white rounded-md shadow h-full overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[25px] md:text-xl font-bold text-[#5E52FF]">Listado de incidentes</h2>
        <span className="text-[25px] font-bold text-[#5E52FF]">{today}</span>
      </div>

      <hr className="border-[#5E52FF] border-1 mb-6" />


      <div className="flex justify-end sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
          <Button className="bg-[#7284FB] text-white hover:bg-blue-500 text-sm cursor-pointer">Rutas de la jornada</Button>
        </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b-[4px] border-[#5E52FF] text-[#5E52FF]">
            <tr>
              <th className="px-2 text-[15px]  md:px-4 py-2">Nombre del cliente</th>
              <th className="px-2 text-[15px] md:px-4 py-2">Tipo de incidente</th>
              <th className="px-2 text-[15px] md:px-4 py-2">Hora</th>
              <th className="px-2 text-[15px] md:px-4 py-2">Registrado por</th>
            </tr>
          </thead>
          <tbody>
            {incidentsData.map((incident, i) => (
              <tr key={i} className="border-b hover:bg-[#f4f4ff]">
                <td className="px-2 text-[#5E52FF] md:px-4 py-2">{incident.restrictions.client_name}</td>
                <td className="px-2 text-[#5E52FF] md:px-4 py-2">{incident.restrictions.type_incidents}</td>
                <td className="px-2 text-[#5E52FF] md:px-4 py-2">{incident.created_at}</td>
                <td className="px-2 text-[#5E52FF] md:px-4 py-2">{incident.restrictions.reportBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
