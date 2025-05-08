'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyCodeForm() {
    const [code, setCode] = useState(['', '', '', '', '', ''])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const inputsRef = useRef<HTMLInputElement[]>([])
    const router = useRouter()

    const handleChange = (index: number, value: string) => {
        const clean = value.replace(/\D/g, '').slice(0, 1)
        const newCode = [...code]
        newCode[index] = clean
        setCode(newCode)

        if (clean && index < 5) {
            inputsRef.current[index + 1]?.focus()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const fullCode = code.map(c => c.trim()).join('').replace(/\D/g, '')
        console.log('📤 Código a enviar:', fullCode)

        if (fullCode.length !== 6) {
            setError('El código debe tener 6 dígitos.')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/register/verify', {
                method: 'POST',
                body: JSON.stringify({ code: fullCode }),
                headers: { 'Content-Type': 'application/json' },
            })

            if (!res.ok) {
                setError('Código incorrecto.')
                return
            }

            router.push('/auth/register/form')
        } catch {
            setError('Error de red o servidor.')
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
                <h1 className="text-2xl font-semibold text-white text-center">Ingresa el código</h1>
                <p className="text-white text-sm text-center">
                    Te llegó un código de verificación en el correo ingresado anteriormente.
                </p>

                {error && <p className="text-red-100 text-sm text-center">{error}</p>}

                <div className="flex justify-center gap-3">
                    {code.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => {
                                if (el) inputsRef.current[i] = el
                            }}
                            type="tel"
                            maxLength={1}
                            inputMode="numeric"
                            className="w-10 h-12 text-center text-xl rounded-lg border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading || code.join('').length < 6}
                    className={`w-full font-medium py-2 rounded-xl transition duration-200 ${
                        code.join('').length === 6 && !loading
                            ? 'bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {loading ? 'Verificando...' : 'Confirmar código'}
                </button>

                <button
                    type="button"
                    onClick={() => router.push('/auth/register/email')}
                    className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                    Volver
                </button>
            </form>
        </div>
    )
}
