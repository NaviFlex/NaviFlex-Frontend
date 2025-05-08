'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EmailRegisterForm() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.trim()) {
            setError('El e-mail es obligatorio.')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/register/email', {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: { 'Content-Type': 'application/json' },
            })

            if (!res.ok) {
                setError('Error al enviar el correo.')
                return
            }

            router.push('/auth/register/verify')
        } catch (err) {
            setError('Error del servidor.')
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
                className="bg-indigo-400 bg-opacity-90 p-10 rounded-2xl w-[320px] space-y-6 shadow-xl"
            >
                <h1 className="text-2xl font-semibold text-white text-center">Ingresa tu e-mail</h1>
                <p className="text-white text-sm text-center">Te enviaremos un mensaje para confirmarlo.</p>

                {error && <p className="text-red-100 text-sm text-center">{error}</p>}

                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                />

                <button
                    type="submit"
                    disabled={!email.trim() || loading}
                    className={`w-full font-medium py-2 rounded-xl transition duration-200 ${
                        email.trim() && !loading
                            ? 'bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {loading ? 'Enviando...' : 'Enviar e-mail de confirmación'}
                </button>

                <button
                    type="button"
                    onClick={() => router.push('/auth/login')}
                    className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                    Volver
                </button>
            </form>
        </div>
    )
}
