'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import users from '../../../../../../../fakedata/users.json'

export default function EditSalesmanForm() {
    const router = useRouter()
    const { id } = useParams()

    const driver = users.find((u) => u.id === id && u.rol === 'prevendedor')

    const initialForm = {
        nombre: driver?.nombre || '',
        apellidos: driver?.apellidos || '',
        correo: driver?.correo || '',
        contrasena: driver?.contrasena || '',
        tipoDocumento: driver?.tipoDocumento || '',
        numeroDocumento: driver?.numeroDocumento || '',
    }

    const [form, setForm] = useState(initialForm)
    const [isModified, setIsModified] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        const modified = Object.keys(initialForm).some(
            (key) => form[key as keyof typeof form] !== initialForm[key as keyof typeof initialForm]
        )
        setIsModified(modified)
    }, [form, initialForm])

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/admin/presalesmans/register-users?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            const result = await response.json()

            if (result.ok) {
                alert('Datos actualizados correctamente')
                router.push(`/admin/dashboard/salesman/${id}`)
            } else {
                alert('Error al actualizar: ' + result.error)
            }
        } catch (error) {
            console.error('Error en la actualización:', error)
            alert('Error de red al intentar actualizar')
        }
    }

    return (
        <div className="p-6 bg-white rounded-2xl min-h-[80vh]">
            <h1 className="text-xl font-semibold text-[#7284FB] mb-4">
                Editar información del chofer {driver?.nombre}
            </h1>

            <div className="bg-[#7284FB] p-6 rounded-xl text-white space-y-4 max-w-md mx-auto">
                {[
                    { label: 'Nombre', name: 'nombre' },
                    { label: 'Apellidos', name: 'apellidos' },
                    { label: 'Correo', name: 'correo' },
                    { label: 'Contraseña', name: 'contrasena', type: 'password' },
                ].map(({ label, name, type = 'text' }) => (
                    <div key={name}>
                        <label className="block text-sm mb-1">{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={form[name as keyof typeof form]}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800"
                        />
                    </div>
                ))}

                <div>
                    <label className="block text-sm mb-1">Tipo de documento</label>
                    <select
                        name="tipoDocumento"
                        value={form.tipoDocumento}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800"
                    >
                        <option value="">Seleccionar</option>
                        <option value="DNI">DNI</option>
                        <option value="Carné de Extranjería">Carné de Extranjería</option>
                        <option value="Pasaporte">Pasaporte</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm mb-1">N° Documento</label>
                    <input
                        type="text"
                        name="numeroDocumento"
                        value={form.numeroDocumento}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800"
                    />
                </div>

                <div className="flex justify-between pt-4">
                    <button
                        type="button"
                        onClick={() => router.push(`/admin/dashboard/salesman/${id}`)}
                        className="bg-white text-[#7284FB] px-6 py-2 rounded-full hover:bg-gray-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!isModified}
                        className={`px-6 py-2 rounded-full transition ${
                            isModified
                                ? 'bg-[#5a6ffb] text-white hover:bg-[#405dfb] cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}
