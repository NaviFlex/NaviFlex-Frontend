'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateSalesmanForm() {
    const router = useRouter()

    const [form, setForm] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        contrasena: '',
        tipoDocumento: '',
        numeroDocumento: '',
        zonaAsignada: '',
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target

        if (name === 'numeroDocumento') {
            setForm((prev) => ({ ...prev, [name]: value.replace(/\D/g, '') }))
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }

    const camposCompletos = Object.values(form).every((val) => val.trim() !== '')
    const handleCancel = () => router.back()

    return (
        <div className="min-h-screen bg-[#7284FB] flex justify-center p-6">
            <div className="bg-white rounded-2xl w-full max-w-5xl min-h-[80vh] p-6">
                <h1 className="text-xl font-semibold text-[#7284FB] mb-2">
                    Registro de prevendedor
                </h1>
                <hr className="border-[#7284FB] mb-6" />

                <div className="bg-[#7284FB] rounded-xl p-6 w-full max-w-md mx-auto space-y-4 text-white">
                    {[
                        { label: 'Nombre', name: 'nombre' },
                        { label: 'Apellidos', name: 'apellidos' },
                        { label: 'Correo', name: 'correo', type: 'email' },
                        { label: 'Contraseña', name: 'contrasena', type: 'password' },
                    ].map(({ label, name, type = 'text' }) => (
                        <div key={name}>
                            <label className="block text-sm mb-1">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={form[name as keyof typeof form]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>
                    ))}

                    {/* Tipo de documento */}
                    <div>
                        <label className="block text-sm mb-1">Tipo de documento</label>
                        <select
                            name="tipoDocumento"
                            value={form.tipoDocumento}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <option value="">Seleccionar</option>
                            <option value="DNI">DNI</option>
                            <option value="Carné de Extranjería">Carné de Extranjería</option>
                            <option value="Pasaporte">Pasaporte</option>
                        </select>
                    </div>

                    {/* N° Documento */}
                    <div>
                        <label className="block text-sm mb-1">N° Documento</label>
                        <input
                            type="text"
                            name="numeroDocumento"
                            value={form.numeroDocumento}
                            onChange={handleChange}
                            inputMode="numeric"
                            pattern="\d*"
                            className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                    </div>

                    {/* Zona Asignada */}
                    <div>
                        <label className="block text-sm mb-1">Zona Asignada</label>
                        <select
                            name="zonaAsignada"
                            value={form.zonaAsignada}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <option value="">Seleccionar</option>
                            <option value="Norte">Norte</option>
                            <option value="Centro">Centro</option>
                            <option value="Sur">Sur</option>
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-white text-[#7284FB] px-6 py-2 rounded-full hover:bg-gray-100 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!camposCompletos}
                            className={`px-6 py-2 rounded-full transition ${
                                camposCompletos
                                    ? 'bg-[#5a6ffb] text-white hover:bg-[#405dfb]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Registrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}