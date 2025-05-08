'use client'

import { useState } from 'react'

export default function LoginForm() {
    const [usuario, setUsuario] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const camposCompletos = usuario.trim() !== '' && contrasena.trim() !== ''

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!camposCompletos) {
            setError('Todos los campos son obligatorios.')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ usuario, contrasena }),
                headers: { 'Content-Type': 'application/json' },
            })

            if (!res.ok) {
                setError('Credenciales incorrectas')
                return
            }

            window.location.href = '/admin/home'
        } catch (err) {
            setError('Error del servidor. Intenta nuevamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="flex min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/bg-map.jpg')" }}
        >
            <div className="flex flex-1 items-center justify-end pr-24">
                <form
                    onSubmit={handleSubmit}
                    className="bg-indigo-400 bg-opacity-90 p-10 rounded-2xl w-[320px] space-y-6 shadow-xl"
                >
                    <h1 className="text-3xl font-semibold text-white text-center">NaviFlex</h1>

                    {error && <p className="text-red-100 text-sm text-center">{error}</p>}

                    <div>
                        <label className="block text-white text-sm mb-1">Usuario</label>
                        <input
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="w-full px-4 py-2 rounded-2xl border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            className="w-full px-4 py-2 rounded-2xl border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!camposCompletos || loading}
                        className={`w-full font-medium py-2 rounded-2xl transition ${
                            camposCompletos && !loading
                                ? 'bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>

                    <p className="text-sm text-center text-white mt-4">
                        ¿Aún no tienes una cuenta?{' '}
                        <a href="/auth/register" className="underline font-medium hover:text-yellow-200 transition">
                            Regístrate
                        </a>
                    </p>
                </form>
            </div>
        </div>
    )
}
