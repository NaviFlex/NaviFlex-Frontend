'use client'
import { toast } from 'sonner';

import { useRouter } from 'next/navigation'
import clients from '../../../../../fakedata/clients.json'
import users from '../../../../../fakedata/users.json'
import { useState } from 'react'
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
  
type Client = {
    id: string
    nombre: string
    documento: string
    direccion: string
    zona: string
    realizoPedido: boolean
}

type Prevendedor = {
    id: string
    nombre: string
    zona: string
}

type Chofer = {
    id: string
    nombre: string
}

const mockClients: Client[] = clients
    .filter((u: any) => u.rol === 'cliente')
    .map((u: any) => ({
        id: u.id.toString(),
        nombre: u.nombre ?? '',
        documento: u.numeroDocumento ?? '',
        direccion: u.direccion ?? '',
        zona: u.zona ?? '',
        realizoPedido: u.realizoPedido ?? false,
    }))

const prevendedores: Prevendedor[] = users
    .filter((u: any) => u.rol === 'prevendedor')
    .map((u: any) => ({
        id: u.id.toString(),
        nombre: u.nombre ?? '',
        zona: u.zonaAsignada ?? '',
    }))

const choferes: Chofer[] = users
    .filter((u: any) => u.rol === 'chofer')
    .map((u: any) => ({
        id: u.id.toString(),
        nombre: u.nombre ?? '',
    }))

console.log('Choferes:', choferes)

export default function ListClients() {
    const router = useRouter()

    const today = new Date()
    today.setDate(today.getDate() + 1)
    const formattedToday = today.toLocaleDateString()

    const [showOnlyPedidos, setShowOnlyPedidos] = useState(false)
    const [groupByPrevendedor, setGroupByPrevendedor] = useState(false)
    const [selectedChofer, setSelectedChofer] = useState<{ [key: string]: string }>({})

    const handleAsignatedDriver = async (choferId: string, clientsIds: string[]) => {
        try {
            const response = await fetch('/api/admin/clients/assign-driver-orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ choferId, clientsIds })
            })
            if (!response.ok) throw new Error('Error al asignar cartera' )
                
                toast.success(`La cartera fue asignada exitosamente!`,{
                    duration: 4000
                });

        } catch (error) {
            console.error(error)
            alert('Ocurrió un error al asignar la cartera')
        }
    }

    let filteredClients = mockClients
    if (showOnlyPedidos) {
        filteredClients = filteredClients.filter((client) => client.realizoPedido)
    }

    const groupedClients = prevendedores.map((prev) => ({
        prevendedor: prev,
        clients: mockClients.filter((c) => c.zona === prev.zona && (!showOnlyPedidos || c.realizoPedido)),
    }))

    return (
        <div className="w-full h-full rounded-[12px] bg-white">
            <div className="bg-white rounded-2xl shadow-lg w-full min-h-[80vh] p-6 relative">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold text-[#7284FB]">Listado de clientes</h1>
                    <span className="text-[#7284FB] font-semibold">{formattedToday}</span>
                </div>
                <hr className="border-[#7284FB] mb-6" />

                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        className={`px-4 py-2 rounded-full text-sm transition border ${
                            showOnlyPedidos
                                ? 'bg-[#7284FB] text-white'
                                : 'bg-white text-[#7284FB] border-[#7284FB] border-2'
                        }`}
                        onClick={() => setShowOnlyPedidos(!showOnlyPedidos)}
                    >
                        Pedidos activos para hoy
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full text-sm transition border ${
                            groupByPrevendedor
                                ? 'bg-[#7284FB] text-white'
                                : 'bg-white text-[#7284FB] border-[#7284FB] border-2'
                        }`}
                        onClick={() => setGroupByPrevendedor(!groupByPrevendedor)}
                    >
                        Agrupar por prevendedor
                    </button>
                </div>

                {!groupByPrevendedor ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[#7284FB]">
                            <thead>
                                <tr className="border-b border-[#7284FB]">
                                    <th className="py-2 px-4">Nombre del cliente</th>
                                    <th className="py-2 px-4">N° documento</th>
                                    <th className="py-2 px-4">Dirección</th>
                                    <th className="py-2 px-4">Zona</th>
                                    <th className="py-2 px-4">¿Realizó pedido?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="border-b border-[#7284FB]">
                                        <td className="py-2 px-4">{client.nombre}</td>
                                        <td className="py-2 px-4">{client.documento}</td>
                                        <td className="py-2 px-4">{client.direccion}</td>
                                        <td className="py-2 px-4">{client.zona}</td>
                                        <td className="py-2 px-4">{client.realizoPedido ? 'Sí' : 'No'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    groupedClients.map((group) => (
                        <div key={group.prevendedor.id} className="mb-6">
                            <div className="flex justify-between items-center mb-2 bg-[#7284FB] text-white rounded px-4 py-2">
                                <span className="font-semibold">{group.prevendedor.nombre}</span>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="bg-white text-[#7284FB] px-3 py-1 rounded text-sm">
                                            Asignar cartera a Chofer
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-[#7284FB] border-none rounded-[10px]">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-center text-white mb-3">
                                                Asignar cartera de {group.prevendedor.nombre} al chofer:
                                            </AlertDialogTitle>
                                            <Select
                                                onValueChange={(value) =>
                                                    setSelectedChofer((prev) => ({
                                                        ...prev,
                                                        [group.prevendedor.id]: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="w-full bg-white text-[#7284FB]">
                                                    <SelectValue placeholder="Selecciona un chofer" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white text-[#7284FB] mb-6">
                                                    {choferes.map((chofer) => (
                                                        <SelectItem key={chofer.id} value={chofer.id}>
                                                            {chofer.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex justify-center md:justify-center items-center w-full space-x-2 mt-5">
                                            <AlertDialogCancel className="text-[#5E52FF] cursor-pointer">
                                                Cancelar
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-[#5E52FF] cursor-pointer"
                                                onClick={() =>
                                                    handleAsignatedDriver(
                                                        selectedChofer[group.prevendedor.id],
                                                        group.clients
                                                            .filter((c) => c.realizoPedido)
                                                            .map((c) => c.id)
                                                    )
                                                }
                                            >
                                                Aceptar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <table className="w-full text-left text-[#7284FB] mb-4">
                                <thead>
                                    <tr className="border-b border-[#7284FB]">
                                        <th className="py-2 px-4">Nombre del cliente</th>
                                        <th className="py-2 px-4">N° documento</th>
                                        <th className="py-2 px-4">Dirección</th>
                                        <th className="py-2 px-4">Zona</th>
                                        <th className="py-2 px-4">¿Realizó pedido?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.clients.map((client) => (
                                        <tr key={client.id} className="border-b border-[#7284FB]">
                                            <td className="py-2 px-4">{client.nombre}</td>
                                            <td className="py-2 px-4">{client.documento}</td>
                                            <td className="py-2 px-4">{client.direccion}</td>
                                            <td className="py-2 px-4">{client.zona}</td>
                                            <td className="py-2 px-4">{client.realizoPedido ? 'Sí' : 'No'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
