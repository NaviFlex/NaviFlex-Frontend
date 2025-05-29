'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ErrorOverlay from "@/app/ui/auth/login/ErrorOverlay";

export default function CreateClientForm() {
    const router = useRouter()

    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [form, setForm] = useState({
        nombre: '',
        direccion: '',
        zona: '',
        tipoDocumento: '',
        numeroDocumento: '',
        realizoPedido: 'false',
        rol: 'cliente'
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const camposCompletos = Object.values(form).every((val) => val.trim() !== '')
    const handleCancel = () => router.back()

    return (
        <>
            <ErrorOverlay
                message={successMessage}
                show={showSuccess}
                type="success"
                onClose={() => setShowSuccess(false)}
            />
        <div className="min-h-screen bg-[#7284FB] flex justify-center p-6">
            <div className="bg-white rounded-2xl w-full max-w-5xl min-h-[80vh] p-6">
                <h1 className="text-xl font-semibold text-[#7284FB] mb-2">
                    Registro de clientes
                </h1>
                <hr className="border-[#7284FB] mb-6" />

                <div className="bg-[#7284FB] rounded-xl p-6 w-full max-w-md mx-auto space-y-4 text-white">
                    {[
                        { label: 'Nombres y Apellidos', name: 'nombre' },
                        { label: 'Dirección', name: 'direccion'},
                    ].map(({ label, name}) => (
                        <div key={name}>
                            <label className="block text-sm mb-1">{label}</label>
                            <input
                                name={name}
                                value={form[name as keyof typeof form]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>
                    ))}

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
                        <label className="block text-sm mb-1">Zona</label>
                        <select
                            name="zona"
                            value={form.zona}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <option value="">Seleccionar</option>
                            <option value="Norte">Norte</option>
                            <option value="Centro">Centro</option>
                            <option value="Sur">Sur</option>
                        </select>
                    </div>

                    <div className="flex justify-center">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.5803405273693!2d-77.0427931!3d-12.0463738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8c2f68efb2b%3A0x63f52fb8a7f9fbd3!2sPlaza%20Mayor%20de%20Lima!5e0!3m2!1ses-419!2spe!4v1700000000000"
                            width="250"
                            height="250"
                            allowFullScreen
                            loading="lazy"
                            className="rounded-lg"
                        ></iframe>
                    </div>

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
                            onClick={async () => {
                                try {
                                    const response = await fetch('/api/admin/clients/register-clients', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            ...form,
                                            realizoPedido: form.realizoPedido === 'true',
                                        }),
                                    });

                                    const result = await response.json();

                                    if (result.ok) {
                                        setSuccessMessage('El cliente se ha registrado exitosamente');
                                        setShowSuccess(true);
                                        setTimeout(() => {
                                            setShowSuccess(false);
                                            router.push("/admin/dashboard/clients");
                                        }, 3000);
                                    } else {
                                        console.error(result.error || 'Ocurrió un error al guardar el cliente');
                                    }
                                } catch (error) {
                                    console.error('Error de red al guardar cliente:', error);
                                }
                            }}
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
        </>)
}
