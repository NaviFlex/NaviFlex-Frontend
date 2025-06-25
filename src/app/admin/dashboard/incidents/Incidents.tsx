'use client'

import { Button } from '@/components/ui/button'

const mockIncidents = [
  {
    client: 'Juan Pérez',
    type: 'Pedido no recibido',
    time: '10:35 AM',
    registeredBy: 'Chofer 01'
  },
  {
    client: 'María López',
    type: 'Cliente no disponible',
    time: '11:20 AM',
    registeredBy: 'Prevendedor 02'
  },
  {
    client: 'Carlos Ruiz',
    type: 'Rechazo de producto',
    time: '12:15 PM',
    registeredBy: 'Chofer 03'
  },
  {
    client: 'Ana Torres',
    type: 'Dirección incorrecta',
    time: '13:00 PM',
    registeredBy: 'Prevendedor 01'
  },
]

export default function Incidents() {
  const today = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  return (
    <div className="p-4 md:p-6 w-full bg-white rounded-md shadow h-full overflow-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
        <h2 className="text-lg md:text-xl font-bold text-[#5E52FF]">Listado de incidentes</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span className="text-sm font-semibold text-[#5E52FF]">{today}</span>
          <Button className="bg-[#7284FB] text-white hover:bg-blue-500 text-sm">Rutas de la jornada</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b border-[#5E52FF] text-[#5E52FF]">
            <tr>
              <th className="px-2 md:px-4 py-2">Nombre del cliente</th>
              <th className="px-2 md:px-4 py-2">Tipo de incidente</th>
              <th className="px-2 md:px-4 py-2">Hora</th>
              <th className="px-2 md:px-4 py-2">Registrado por</th>
            </tr>
          </thead>
          <tbody>
            {mockIncidents.map((incident, i) => (
              <tr key={i} className="border-b hover:bg-[#f4f4ff]">
                <td className="px-2 md:px-4 py-2">{incident.client}</td>
                <td className="px-2 md:px-4 py-2">{incident.type}</td>
                <td className="px-2 md:px-4 py-2">{incident.time}</td>
                <td className="px-2 md:px-4 py-2">{incident.registeredBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
