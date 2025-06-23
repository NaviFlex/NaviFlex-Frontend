'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getClientsByAdminId } from '@/services/admin/clients/clientsService';
import { useUser } from '@/hooks/useUser';
import { ApiResponse } from '@/types/shared/api_response';
import { ClientByAdministratorType } from '@/types/admin/clients/clientType';
import { Driver } from '@/types/admin/drivers/getDriversType';
import { getDriversAvailableByAdminId } from '@/services/admin/drivers/adminDriversService';
import { creeateRouteByDriverAndPresalesman, verifyRoutesByPresalesmansIds } from '@/services/admin/routing/routingManagementService';

export default function ListClients() {
  const router = useRouter()
  const user = useUser()

  const today = new Date()
  today.setDate(today.getDate() + 1)
  const formattedToday = today.toLocaleDateString()

  const [showOnlyPedidos, setShowOnlyPedidos] = useState(false)
  const [groupByPrevendedor, setGroupByPrevendedor] = useState(false)
  const [selectedChofer, setSelectedChofer] = useState<{ [key: number]: number }>({})
  const [clientData, setClientData] = useState<ClientByAdministratorType>()

  const [driversData, setDriversData] = useState<Driver[]>([])

  const [presalesmanRoutesStatus, setPresalesmanRoutesStatus] = useState<{ [key: number]: string }>({})



  useEffect(() => {
    if (!user?.profileId) return
  
    const fetchData = async () => {
      try {
        // Obtener clientes y choferes disponibles
        const response: ApiResponse<ClientByAdministratorType> = await getClientsByAdminId(user.profileId)
        const responseDrivers: ApiResponse<Driver[]> = await getDriversAvailableByAdminId(user.profileId)
        setClientData(response.data)
        setDriversData(responseDrivers.data || [])
  
        // Obtener los presalesman_id únicos desde los datos de clientes
        const presalesmanIds = Object.values(response.data || {})
          .flat()
          .map((c) => c.presalesman_id)
          .filter((id): id is number => typeof id === "number") // Garantiza solo números
          .filter((id, index, self) => self.indexOf(id) === index); // Elimina duplicados
      
  
        // Llamar al endpoint para verificar si ya tienen rutas asignadas
        const responseVerifyRutesPresalesmans = await verifyRoutesByPresalesmansIds(presalesmanIds)
       
   
        if (responseVerifyRutesPresalesmans.status_code === 200 && responseVerifyRutesPresalesmans.data) {
          const statusMap = responseVerifyRutesPresalesmans.data.reduce((acc, { presalesman_id, route_status }) => {
            acc[presalesman_id] = route_status
            return acc
          }, {} as { [key: number]: string })
          setPresalesmanRoutesStatus(statusMap)


          console.log('📝 Estado de las rutas de los prevendedores:', statusMap)
        }
      } catch (error) {
        console.error("❌ Error cargando datos de clientes o rutas:", error)
      }
    }
  
    fetchData()
  }, [user?.profileId])
  

  const handleAsignatedDriver = async (choferId: string, presalesman_id: string) => {
    try {
      const response = await creeateRouteByDriverAndPresalesman(parseInt(choferId), parseInt(presalesman_id))
        if (response.status_code === 201) {
            toast.success(response.message || 'Cartera asignada correctamente')
            setSelectedChofer((prev) => ({ ...prev, [presalesman_id]: choferId }))
            // eliminarl el chofer para que no aparezca en el select
            setDriversData((prev) => prev.filter(driver => driver.id !== parseInt(choferId)))
            // recargar la lista de clientes
            
            

        } else {
            toast.error(response.message || 'Ocurrió un error al asignar la cartera')
        }

        setPresalesmanRoutesStatus((prev) => ({
          ...prev,
          [parseInt(presalesman_id)]: 'ASSIGNED'
        }))
        
      
    } catch (error) {
      console.error(error)
    }
  }

  const allClients = clientData
    ? Object.values(clientData).flat()
    : []

  const filteredAll = allClients.filter(c => !showOnlyPedidos || c.order_confirmed)

  return (
    <div className="w-full h-full rounded-[12px] bg-white flex flex-col">
      <div className="bg-white rounded-2xl shadow-lg w-full h-full p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[25px] font-semibold text-[#5E52FF]">Listado de clientes</h1>
          <span className="text-[#5E52FF] text-[20px] font-semibold">{formattedToday}</span>
        </div>
        <hr className="border-[#5E52FF] border-1 mb-6" />

        <div className="flex flex-wrap gap-2 items-center justify-center mb-4 w-full bg-[#5E52FF] p-4 rounded-[10px] border-none sticky top-0 z-10">
          <button
            className={`cursor-pointer px-2 py-2 w-[170px] text-sm font-semibold transition rounded-[10px] border-none ${showOnlyPedidos ? 'bg-[#7284FB] text-white' : 'bg-white text-[#7284FB] border-[#7284FB] border-2'}`}
            onClick={() => setShowOnlyPedidos(!showOnlyPedidos)}
          >
            Pedidos <br /> activos para hoy
          </button>
          <button
            className={`cursor-pointer px-2 py-2 w-[170px] text-sm font-semibold transition rounded-[10px] border-none ${groupByPrevendedor ? 'bg-[#7284FB] text-white' : 'bg-white text-[#7284FB] border-[#7284FB] border-2'}`}
            onClick={() => setGroupByPrevendedor(!groupByPrevendedor)}
          >
            Agrupar por <br /> prevendedor
          </button>
        </div>

        <div className="overflow-y-auto flex-grow custom-scroll pr-2">
          {!groupByPrevendedor ? (
            filteredAll.length > 0 ? (
              <table className="w-full text-left text-[#5E52FF]">
                <thead>
                  <tr className="border-b border-[#5E52FF]">
                    <th className="py-2 px-4">Nombre del cliente</th>
                    <th className="py-2 px-4">N Documento</th>
                    <th className="py-2 px-4">Direccion</th>
                    <th className="py-2 px-4">Zona</th>
                    <th className="py-2 px-4">¿Realizó pedido?</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAll.map((client) => (
                    <tr key={client.id} className="border-b border-[#5E52FF]">
                      <td className="py-2 px-4">{client.full_name}</td>
                        <td className="py-2 px-4">{client.document_number}</td>
                        <td className="py-2 px-4">{client.address}</td>
                      <td className="py-2 px-4">{client.area_name}</td>
                      <td className="py-2 px-4">{client.order_confirmed ? 'Sí' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center italic text-gray-500 mt-8">No hay pedidos activos para hoy</p>
            )
          ) : (
            clientData && Object.entries(clientData).map(([prevName, clients]) => {
              const filtered = clients.filter(c => !showOnlyPedidos || c.order_confirmed)
              const presalesmanId = filtered[0]?.presalesman_id
              const alreadyAssigned = presalesmanRoutesStatus[presalesmanId] === 'PENDING' || presalesmanRoutesStatus[presalesmanId] === 'ASSIGNED'
            
              return (
                <div key={prevName} className="mb-6">
                  <div className="flex justify-between items-center mb-2 bg-[#5E52FF] text-white rounded px-4 py-2">
                    <span className="font-semibold">{prevName}</span>
                    {showOnlyPedidos && filtered.length > 0 && (
                        <div>
                          {alreadyAssigned ? (
                            <p className="text-sm italic text-white px-3 py-1 bg-[#5E52FF] rounded">
                              Ya se programó la ruta
                            </p>
                          ) : (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button
                                  className="bg-white text-[#5E52FF] px-3 py-1 rounded text-sm cursor-pointer hover:bg-[#f0f0ff]"
                                >
                                  Asignar cartera a Chofer
                                </button>
                              </AlertDialogTrigger>

                              <AlertDialogContent className="bg-[#7284FB] border-none rounded-[10px]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-center text-white mb-3">
                                    Asignar para el día {formattedToday}, la cartera de {prevName} al chofer:
                                  </AlertDialogTitle>
                                  <Select onValueChange={(value) => setSelectedChofer((prev) => ({ ...prev, [prevName]: value }))}>
                                    <SelectTrigger className="w-full bg-white text-[#7284FB]">
                                      <SelectValue placeholder="Selecciona un chofer" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-[#7284FB] mb-6">
                                      {driversData.map((driver) => (
                                        <SelectItem key={driver.id} value={driver.id}>
                                          {driver.full_name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex justify-center w-full space-x-2 mt-5">
                                  <AlertDialogCancel className="text-[#5E52FF] cursor-pointer">Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-[#5E52FF] cursor-pointer"
                                    onClick={() => {
                                      const choferId = selectedChofer[prevName]
                                      const presalesmanId = filtered[0]?.presalesman_id

                                      if (!choferId || !presalesmanId) {
                                        toast.error("Faltan datos para asignar la cartera.")
                                        return
                                      }

                                      handleAsignatedDriver(choferId, presalesmanId.toString())
                                    }}
                                  >
                                    Aceptar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      )}


                  </div>
                  {filtered.length > 0 ? (
                    <table className="w-full text-left text-[#7284FB] mb-4">
                      <thead>
                        <tr className="border-b border-[#7284FB]">
                          <th className="py-2 px-4">Nombre del cliente</th>
                          <th className="py-2 px-4">N Documento</th>
                          <th className="py-2 px-4">Direccion</th>
                          <th className="py-2 px-4">Zona</th>
                          <th className="py-2 px-4">¿Realizó pedido?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((client) => (
                          <tr key={client.id} className="border-b border-[#7284FB]">
                            <td className="py-2 px-4">{client.full_name}</td>
                            <td className="py-2 px-4">{client.document_number}</td>
                            <td className="py-2 px-4">{client.address}</td>
                            <td className="py-2 px-4">{client.area_name}</td>
                            <td className="py-2 px-4">{client.order_confirmed ? 'Sí' : 'No'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="italic text-gray-500 px-4">Este prevendedor no tiene pedidos activos para hoy.</p>
                  )}
                </div>
              )
            })
          )}
        </div>

        <PlusCircleIcon
          onClick={() => router.push('/admin/dashboard/clients/new-client')}
          aria-label="Agregar nuevo cliente"
          className="absolute bottom-10 right-10 text-[#5E52FF] w-15 h-15 cursor-pointer hover:scale-105 transition-transform"
        />
      </div>
    </div>
  )
}
