'use client'

import { useRouter, useParams } from 'next/navigation'
import users from '../../../../../../fakedata/users.json'
import { PencilIcon, UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function DriverInfo() {
    const router = useRouter()
    const params = useParams()
    const { id } = params

    const driver = users.find((u) => u.id === id && u.rol === 'chofer')

    const [showEmail, setShowEmail] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    if (!driver) {
        return <div className="text-center mt-10">Chofer no encontrado</div>
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/admin/drivers/register-users?id=${id}`, {
                method: 'DELETE',
            })

            const result = await response.json()

            if (result.ok) {
                alert('Usuario eliminado correctamente')
                router.push('/admin/dashboard/drivers')
            } else {
                alert(`Error al eliminar: ${result.error}`)
            }
        } catch (error) {
            console.error('Error de red al eliminar usuario:', error)
        }
    }

    return (
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-5xl min-h-[80vh] p-6 flex flex-col">
            <h1 className="text-xl font-semibold text-[#7284FB] mb-2">
                Detalle de {driver.nombre} {driver.apellidos}
            </h1>
            <hr className="border-[#7284FB] mb-6" />

            <div className="bg-[#7284FB] text-white rounded-xl p-6 relative flex flex-col md:flex-row items-center gap-6">
                <button
                    onClick={() => router.push(`/admin/dashboard/drivers/${id}/edit`)}
                    className="absolute top-4 right-4 hover:scale-110 transition"
                >
                    <PencilIcon className="w-6 h-6 text-white" />
                </button>

                <div className="flex flex-col items-center ml-5 mr-10">
                    <div className="bg-white text-[#7284FB] rounded-full w-20 h-20 flex items-center justify-center mb-2">
                        <UserIcon className="h-10 w-10" />
                    </div>
                    <div className="font-semibold text-lg">
                        {driver.nombre} {driver.apellidos}
                    </div>
                    <button
                        className="mt-4 bg-[#5a6ffb] hover:bg-[#405dfb] px-4 py-1 rounded-full text-sm"
                        onClick={() => setShowConfirm(true)}
                    >
                        Desactivar usuario
                    </button>
                </div>

                <div className="flex-1 space-y-4">
                    <h2 className="text-md font-semibold">Datos personales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm">Nombres</label>
                            <div className="bg-white text-gray-800 rounded-full px-4 py-2 mt-1">
                                {driver.nombre}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm">Apellidos</label>
                            <div className="bg-white text-gray-800 rounded-full px-4 py-2 mt-1">
                                {driver.apellidos || 'No registrado'}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm">Tipo de documento</label>
                            <div className="bg-white text-gray-800 rounded-full px-4 py-2 mt-1">
                                {driver.tipoDocumento || 'No registrado'}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm">N° Documento</label>
                            <div className="bg-white text-gray-800 rounded-full px-4 py-2 mt-1">
                                {driver.numeroDocumento || 'No registrado'}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm">Placa de Unidad</label>
                            <div className="bg-white text-gray-800 rounded-full px-4 py-2 mt-1">
                                {driver.placa || 'No registrado'}
                            </div>
                        </div>
                    </div>

                    <h2 className="text-md font-semibold mt-4">Datos de acceso a sistema</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm">Correo</label>
                            <div className="bg-white text-gray-800 rounded-full px-4 py-2 mt-1 flex items-center justify-between">
                                <span className="truncate">
                                    {showEmail ? driver.correo : '***********'}
                                </span>
                                <button
                                    onClick={() => setShowEmail(!showEmail)}
                                    className="ml-2 hover:scale-110 transition"
                                >
                                    {showEmail ? (
                                        <EyeSlashIcon className="h-5 w-5 text-[#7284FB]" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-[#7284FB]" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm">Contraseña</label>
                            <div className="bg-white text-gray-800 rounded-full px-4 py-2 mt-1 flex items-center justify-between">
                                <span className="truncate">
                                    {showPassword ? driver.contrasena : '***********'}
                                </span>
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="ml-2 hover:scale-110 transition"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-[#7284FB]" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-[#7284FB]" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-80 text-center space-y-4">
                        <h2 className="text-lg font-semibold text-[#7284FB]">
                            ¿Estás seguro de desactivar la cuenta de {driver.nombre}?
                        </h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-[#5a6ffb] text-white px-4 py-2 rounded-full hover:bg-[#405dfb]"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center mt-6">
                <button
                    onClick={() => router.push('/admin/dashboard/drivers')}
                    className="bg-[#5a6ffb] hover:bg-[#405dfb] text-white px-6 py-2 rounded-full"
                >
                    Regresar
                </button>
            </div>
        </div>
    )
}
