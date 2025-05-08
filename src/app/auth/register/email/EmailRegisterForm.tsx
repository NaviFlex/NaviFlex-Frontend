'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../../../ui/auth/login/login.module.css'

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
        <>
        <div
        className={styles.container_principale}
        
        >
        <div className={styles.container_secondary}>
            <div className={styles.container_send_email }>
            <form
                onSubmit={handleSubmit}
                className=" flex flex-col items-start bg-indigo-400 bg-opacity-90 p-10 rounded-2xl w-[375px] space-y-6 shadow-xl m-10"
            >

                <div className="flex flex-col items-start w-[260px]">
                    <h1 className="text-3xl mb-3  mt-5 font-semibold text-white text-center">Ingresa tu e-mail</h1>
                    <p className="text-white  text-sm text-start">Te enviaremos un mensaje para confirmarlo.</p>

                    {error && <p className="text-red-100 text-sm text-center">{error}</p>}

                </div>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-15 transition duration-300  rounded-lg border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                />

                <div className="flex flex-col justify-center items-center w-full gap-4">
                    <button
                        type="submit"
                        disabled={!email.trim() || loading}
                        className={`w-65 font-medium py-2 h-[44px] text-sm rounded-[12px] transition duration-500 ${
                            email.trim() && !loading
                                ? 'bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {loading ? 'Enviando...' : 'Enviar e-mail de confirmación'}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push('/auth/login')}
                        className="w-65 bg-indigo-600 h-[44px] text-white text-sm  py-2 rounded-[12px] hover:bg-indigo-700 transition duration-500  cursor-pointer"
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
