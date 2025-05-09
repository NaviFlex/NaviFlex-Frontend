'use client'

import { UserIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

type Salesman = {
    id: string
    nombre: string
}

const mockSalesmen: Salesman[] = [
    { id: '1', nombre: 'Prevendedor 1' },
    { id: '2', nombre: 'Prevendedor 2' },
    { id: '3', nombre: 'Prevendedor 3' },
]

export default function ListSalesman() {
    const router = useRouter()

    return (
        <div className="w-full h-full rounded-[12px] bg-white">
            <div className="bg-white rounded-2xl shadow-lg w-full h-full min-h-[80vh] p-6 relative">
                <h1 className="text-xl font-semibold text-[#7284FB] mb-2">Listado de prevendedores</h1>
                <hr className="border-[#7284FB] mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4">
                {mockSalesmen.map((salesman) => (
                        <div
                            key={salesman.id}
                            className="flex flex-col items-center bg-[#7284FB] text-white rounded-xl p-4 shadow-md w-full max-w-[200px] mx-auto"
                        >
                            <UserIcon className="h-16 w-16 text-white mb-2" />
                            <div className="font-semibold text-sm">{salesman.nombre}</div>
                            <hr className="border-white w-4/5 my-2" />
                            <button className="bg-white text-[#7284FB] text-sm font-medium px-4 py-1 rounded-full hover:bg-gray-100 transition">
                                Ver detalle
                            </button>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-6 right-6">
                    <button
                        onClick={() => router.push('/admin/dashboard/salesman/new-salesman')}
                        className="bg-[#7284FB] hover:bg-[#5a6ffb] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-2xl"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    )
}
