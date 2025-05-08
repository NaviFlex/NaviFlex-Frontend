'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {

    const [form, setForm] = useState({
        nombres: '',
        apellidos: '',
        empresa: '',
        tipoDocumento: '',
        numeroDocumento: '',
        contrasena: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target

        if (name === 'numeroDocumento') {
            const soloNumeros = value.replace(/\D/g, '')
            setForm((prev) => ({ ...prev, [name]: soloNumeros }))
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }


    const camposCompletos =
        form.nombres.trim() &&
        form.apellidos.trim() &&
        form.empresa.trim() &&
        form.tipoDocumento.trim() &&
        form.numeroDocumento.trim() &&
        form.contrasena.trim()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')


        if (!camposCompletos) {
            setError('Por favor completa todos los campos')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/register/finalize', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: { 'Content-Type': 'application/json' },
            })

            if (!res.ok) {
                setError('No se pudo completar el registro')
                return
            }

            router.push('/admin/dashboard/drivers')
        } catch {
            setError('Error de red o servidor')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/bg-map.jpg')" }}
        >
            <form
                onSubmit={handleSubmit}
                className="bg-indigo-400 bg-opacity-90 p-10 rounded-2xl w-[550px] space-y-4 shadow-xl"
            >
                <h1 className="text-2xl font-semibold text-white text-center">Completa tu registro!</h1>

                {error && <p className="text-red-100 text-sm text-center">{error}</p>}

                {[
                    { label: 'Nombres', name: 'nombres' },
                    { label: 'Apellidos', name: 'apellidos' },
                    { label: 'Empresa', name: 'empresa' },
                ].map((field) => (
                    <div key={field.name}>
                        <label className="block text-white text-sm mb-1">{field.label}</label>
                        <input
                            name={field.name}
                            value={form[field.name as keyof typeof form]}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                    </div>
                ))}
                <div>
                    <label className="block text-white text-sm mb-1">Tipo de documento</label>
                    <select
                        name="tipoDocumento"
                        value={form.tipoDocumento}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="DNI">DNI</option>
                        <option value="Carné de Extranjería">Carné de Extranjería</option>
                        <option value="Pasaporte">Pasaporte</option>
                    </select>
                </div>
                <div>
                    <label className="block text-white text-sm mb-1">N° Documento</label>
                    <input
                        type="text"
                        name="numeroDocumento"
                        value={form.numeroDocumento}
                        onChange={handleChange}
                        inputMode="numeric"
                        pattern="\d*"
                        className="w-full px-4 py-2 rounded-xl border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                </div>
                <div>
                    <label className="block text-white text-sm mb-1">Contraseña</label>
                    <input
                        type="password"
                        name="contrasena"
                        value={form.contrasena}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!camposCompletos || loading}
                    className={`w-full font-medium py-2 rounded-xl transition duration-200 ${
                        camposCompletos && !loading
                            ? 'bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {loading ? 'Registrando...' : 'Finalizar registro'}
                </button>

                <button
                    type="button"
                    onClick={() => router.push('/auth/register/verify')}
                    className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                    Volver
                </button>
            </form>
        </div>
    )
}