'use client'

type Driver = {
    id: string
    nombre: string
    placa: string
}

const mockDrivers: Driver[] = [
    { id: '1', nombre: 'Chofer 1', placa: 'XFD-0DC' },
    { id: '2', nombre: 'Chofer 2', placa: 'TRZ-891' },
    { id: '3', nombre: 'Chofer 3', placa: 'BGY-145' },
]

export default function ListDrivers() {
    return (
        <div className="w-full h-full rounded-[12px] bg-white">
            <div className="bg-white rounded-2xl shadow-lg w-full h-full  min-h-[80vh] p-6 relative">
                <h1 className="text-xl font-semibold text-[#7284FB] mb-2">
                    Listado de choferes/unidades
                </h1>
                <hr className="border-[#7284FB] mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {mockDrivers.map((driver) => (
                        <div
                            key={driver.id}
                            className="flex flex-col items-center bg-[#7284FB] text-white rounded-xl p-4 shadow-md w-full max-w-[200px] mx-auto"
                        >
                            <div className="text-4xl mb-2">👤</div>

                            <div className="font-semibold text-sm">{driver.nombre}</div>
                            <div className="text-xs mt-1 mb-2">Placa de Und: {driver.placa}</div>

                            <button className="bg-white text-[#7284FB] text-sm font-medium px-4 py-1 rounded-full hover:bg-gray-100 transition">
                                Ver detalle
                            </button>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-6 right-6">
                    <button className="bg-[#7284FB] hover:bg-[#5a6ffb] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-2xl">
                        +
                    </button>
                </div>
            </div>
        </div>
    )
}
