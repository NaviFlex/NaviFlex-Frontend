'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../ui/auth/login/login.module.css'
import ErrorOverlay from '@/app/ui/auth/login/ErrorOverlay';

export default function RegisterForm() {

    const [form, setForm] = useState({
        nombres: '',
        apellidos: '',
        empresa: '',
        tipoDocumento: '',
        numeroDocumento: '',
        contrasena: '',
        correo:'josue12345@gmail.com',
        rol: 'admin'
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

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

            setSuccessMessage('Te has registrado exitosamente');
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                router.push("/admin/dashboard/drivers")
            }, 3000);


            
        } catch {
            setError('Error de red o servidor')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
                      <ErrorOverlay
                        message={successMessage}
                        show={showSuccess}
                        type="success"
                        onClose={() => setShowSuccess(false)}
                    />
            <div
                className={styles.container_principale}
        
                 >
            <div className={styles.container_secondary}>
                 <div className={styles.container_register_admin }>
                    <form
                            onSubmit={handleSubmit}
                            className="bg-indigo-400 bg-opacity-90 p-5 rounded-2xl w-[550px]  overflow-y-auto space-y-4 shadow-xl"
                        >
                            <h1 className="text-3xl font-semibold text-white text-center">Completa tu registro!</h1>

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
                                        className="w-full h-[35px] px-4 py-2 rounded-lg border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                                    />
                                </div>
                            ))}
                            <div className="flex gap-4 justify-between  items-center">

                                <div>
                                    <label className="block text-white text-sm mb-1">Tipo de documento</label>
                                    <select
                                        name="tipoDocumento"
                                        value={form.tipoDocumento}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-white bg-white text-gray-800 shadow-sm hover:shadow-md focus:shadow-lg focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition duration-500"
                                        >
                                        <option value="">Seleccionar</option>
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
                                        className="w-full h-[35px] px-4 py-2 rounded-lg border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                                        />
                                </div>
                                    </div>
                            <div>
                                <label className="block text-white text-sm mb-1">Contraseña</label>
                                <input
                                    type="password"
                                    name="contrasena"
                                    value={form.contrasena}
                                    onChange={handleChange}
                                    className="w-full h-[35px] px-4 py-2 rounded-lg border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                                />
                            </div>

                            <div className="flex flex-col justify-center items-center w-full gap-2 mt-10">


                                    <button
                                        type="submit"
                                        disabled={!camposCompletos || loading}
                                        className={`w-65 h-[44px] font-medium py-2 rounded-xl transition duration-200 ${
                                            camposCompletos && !loading
                                            ? 'bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white cursor-pointer'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                        >
                                        {loading ? 'Registrando...' : 'Finalizar registro'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => router.push('/auth/register/verify')}
                                        className="w-65 h-[44px] bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition duration-500  cursor-pointer"
                                        >
                                        Volver
                                    </button>
                                </div>
                    </form>
            </div>
        

        </div>
    </div>
    
</>
    )
}