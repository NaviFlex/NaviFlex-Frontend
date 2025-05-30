'use client'

import ErrorOverlay from '@/app/ui/auth/login/ErrorOverlay'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { buildPayload } from '@/utils/buildPayload'

export default function CreateSalesmanForm() {
    const router = useRouter()
    const [successMessage, setSuccessMessage] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)

    const [form, setForm] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        contrasena: '',
        tipoDocumento: '',
        numeroDocumento: '',
        zonaAsignada: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <>
            <ErrorOverlay message={successMessage} show={showSuccess} type="success" onClose={() => setShowSuccess(false)} />
            <div className="w-full h-full rounded-[12px] bg-white">
                <div className="bg-white rounded-2xl w-full h-full min-h-[80vh] p-6 overflow-y-auto">
                    <h1 className="text-xl font-semibold text-[#7284FB] mb-2">Registro de prevendedor</h1>
                    <hr className="border-[#7284FB] mb-6" />

                    <div className="bg-[#7284FB] rounded-xl p-6 w-full max-w-md mx-auto space-y-4 text-white">
                        {[{ label: 'Nombre', name: 'nombre' }, { label: 'Apellidos', name: 'apellidos' }, { label: 'Correo', name: 'correo', type: 'email' }, { label: 'Contraseña', name: 'contrasena', type: 'password' }].map(({ label, name, type = 'text' }) => (
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

                        <div>
                            <label className="block text-sm mb-1">Tipo de documento</label>
                            <select name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange} className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white">
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
                                inputMode="numeric"
                                pattern="\d*"
                                className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Zona Asignada</label>
                            <select name="zonaAsignada" value={form.zonaAsignada} onChange={handleChange} className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white">
                                <option value="">Seleccionar</option>
                                <option value="Norte">Norte</option>
                                <option value="Centro">Centro</option>
                                <option value="Sur">Sur</option>
                            </select>
                        </div>

                        <div className="flex justify-center pt-4 gap-6">
                            <button type="button" onClick={handleCancel} className="w-35 h-[44px] text-sm bg-white text-[#7284FB] px-6 py-2 rounded-[12px] hover:bg-gray-100 transition duration-500 cursor-pointer">
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={!camposCompletos}
                                onClick={async () => {
                                    const payload = buildPayload(form, 'prevendedor')

                                    try {
                                        const response = await fetch('/api/admin/presalesmans/register-users', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(payload),
                                        })

                                        const result = await response.json()

                                        if (result.ok) {
                                            setSuccessMessage('El prevendedor se ha registrado exitosamente')
                                            setShowSuccess(true)
                                            setTimeout(() => {
                                                setShowSuccess(false)
                                                router.push('/admin/dashboard/salesman')
                                            }, 3000)
                                        } else {
                                            console.error(result.error || 'Ocurrió un error al guardar el prevendedor')
                                        }
                                    } catch (error) {
                                        console.error('Error de red al guardar prevendedor:', error)
                                    }
                                }}
                                className={`w-35 h-[44px] px-6 py-2 rounded-[12px] transition ${
                                    camposCompletos ? 'bg-[#5a6ffb] text-white hover:bg-[#405dfb] transition duration-500 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Registrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
