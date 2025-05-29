'use client'

import { useRouter } from 'next/navigation'
import clients from '../../../../../fakedata/clients.json'

type Client = {
    id: string;
    nombre: string;
    documento: string;
    direccion: string;
    zona: string;
    realizoPedido: boolean;
}

const mockClients: Client[] = clients
    .filter((u: any) => u.rol === 'cliente' )
    .map((u: any) => ({
      id: u.id ?? '',
      nombre: u.nombre ?? '',
      documento: u.numeroDocumento ?? '',
      direccion: u.direccion ?? '',
      zona: u.zona ?? '',
      realizoPedido: u.realizoPedido ?? '',
    })
    )

export default function ListClients() {
    const router = useRouter()
    const today = new Date().toLocaleDateString('es-PE')

    return (
        <div className="w-full h-full rounded-[12px] bg-white">
            <div className="bg-white rounded-2xl shadow-lg w-full h-full min-h-[80vh] p-6 relative">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold text-[#7284FB]">Listado de clientes</h1>
                    <span className="text-[#7284FB] font-semibold">{today}</span>
                </div>
                <hr className="border-[#7284FB] mb-6" />

                <div className="flex flex-wrap gap-2 mb-4">
                    <button className="bg-[#7284FB] hover:bg-[#5a6ffb] text-white px-4 py-2 rounded-full text-sm transition">
                        Agrupar por prevendedor
                    </button>
                    <button className="bg-[#7284FB] hover:bg-[#5a6ffb] text-white px-4 py-2 rounded-full text-sm transition">
                        Asignar clientes a chofer
                    </button>
                    <button className="bg-[#7284FB] hover:bg-[#5a6ffb] text-white px-4 py-2 rounded-full text-sm transition">
                        Pedidos activos para hoy
                    </button>
                </div>

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
                        {mockClients.map((client) => (
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

                <div className="absolute bottom-6 right-6">
                    <button
                        onClick={() => router.push('/admin/dashboard/clients/new-client')}
                        className="bg-[#7284FB] hover:bg-[#5a6ffb] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-2xl"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    )
}
