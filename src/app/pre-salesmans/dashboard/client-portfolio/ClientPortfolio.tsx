'use client'

import { useEffect, useState } from 'react'
import { UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { useUser } from '@/hooks/useUser'
import { getClientPortfolio } from '@/services/presalesman/client-portfolio/clientPortfolio'
import { ApiResponse } from '@/types/shared/api_response'
import { ClientByAreaType } from '@/types/admin/clients/clientType'
import ErrorOverlay from '@/app/ui/auth/login/ErrorOverlay'
import {createOrderFromNextDay} from '@/services/presalesman/client-portfolio/clientPortfolio'


export default function ClientPortfolio() {
  const user = useUser()
  const [clientsPortfolio, setClientsPortfolio] = useState<ClientByAreaType>()
  const [successMessage, setSuccessMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [search, setSearch] = useState('')

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowFormatted = tomorrow.toLocaleDateString()

  useEffect(() => {
    if (!user?.profileId) return

    const fetchClientPortfolio = async () => {
      try {
        const response: ApiResponse<ClientByAreaType> = await getClientPortfolio(user.profileId)
        setClientsPortfolio(response.data)
      } catch (err) {
        console.error('Error de red al obtener la cartera de clientes:', err)
        setMessageType('error')
        setSuccessMessage('Error de red al obtener la cartera de clientes')
        setShowSuccess(true)
      }
    }

    fetchClientPortfolio()
  }, [user?.profileId])

  

  return (
    <>
      <ErrorOverlay
        message={successMessage}
        show={showSuccess}
        type={messageType}
        onClose={() => setShowSuccess(false)}
      />

      <div className="w-full h-auto rounded-[12px] bg-white p-4">
        <h1 className="text-xl font-bold text-center text-[#5E52FF] mb-4">Clientes gestionados</h1>

        <div className="flex items-center mb-1 border rounded px-2 bg-[#5E52FF]">
          <MagnifyingGlassIcon className="w-5 h-5 text-white ml-2" />
          <Input
            type="text"
            placeholder="Buscar cliente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus:ring-0 text-white bg-transparent placeholder-white"
          />
        </div>

        <hr className="border-indigo-200 mb-4" />

        <div className="space-y-6 p-1">
          {clientsPortfolio &&
            Object.entries(clientsPortfolio)
              .map(([area, clients]) => {
                const filteredClients = clients.filter((client) =>
                  client.full_name.toLowerCase().includes(search.toLowerCase())
                )
                if (filteredClients.length === 0) return null

                return (
                  <div key={area}>
                    <h2 className="text-lg font-semibold text-[#5E52FF] mb-2">{area}</h2>
                    <div className="space-y-3">
                      {filteredClients.map((client) => (
                        <div
                          key={client.id}
                          className="flex items-center justify-between bg-[#5E52FF] rounded-lg p-2 text-white"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="bg-transparent rounded-full p-1">
                              <UserIcon className="h-12 w-12 text-white" />
                            </div>
                            <span className="text-lg">
                              {client.full_name}
                              {client.order_confirmed && (
                                <span className="ml-2 text-green-300 text-sm">(Confirmado)</span>
                              )}
                            </span>
                          </div>

                          {!client.order_confirmed && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button className="bg-[#7284FB] text-white hover:bg-blue-500 cursor-pointer">
                                  Confirmar pedido
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-[#7284FB] border-none rounded-[10px]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-center text-white mb-5">
                                    ¿Deseas confirmar el pedido de {client.full_name}, para el día {tomorrowFormatted}?
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex justify-center w-full space-x-2">
                                  <AlertDialogCancel className="text-[#5E52FF] cursor-pointer">
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={async () => {
                                        try {
                                          const result = await createOrderFromNextDay(client.id, user?.profileId)
                                      
                                          if (result.status_code === 201) {
                                            // ✅ Mostrar notificación
                                            setMessageType('success')
                                            setSuccessMessage(result.message || 'Pedido confirmado exitosamente')
                                            setShowSuccess(true)
                                            setTimeout(() => setShowSuccess(false), 3000)
                                      
                                            // ✅ Actualizar el estado local sin volver a llamar a la API
                                            setClientsPortfolio((prev) => {
                                              if (!prev) return prev
                                              const updated = { ...prev }
                                              updated[area] = updated[area].map((c) =>
                                                c.id === client.id ? { ...c, order_confirmed: true } : c
                                              )
                                              return updated
                                            })
                                          } else {
                                            setMessageType('error')
                                            setSuccessMessage('Error al confirmar el pedido')
                                            setShowSuccess(true)
                                            setTimeout(() => setShowSuccess(false), 3000)
                                          }
                                        } catch (error) {
                                          console.error('Error al confirmar pedido:', error)
                                          setMessageType('error')
                                          setSuccessMessage('Error de red al intentar confirmar el pedido')
                                          setShowSuccess(true)
                                          setTimeout(() => setShowSuccess(false), 3000)
                                        }
                                      }}
                                      
                                    className="bg-[#5E52FF] cursor-pointer"
                                  >
                                    Confirmar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
        </div>
      </div>
    </>
  )
}
