'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../../../ui/auth/login/login.module.css'
import ErrorOverlay from '@/app/ui/auth/login/ErrorOverlay';
 

export default function VerifyCodeForm() {
    const [code, setCode] = useState(['', '', '', '', '', ''])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const inputsRef = useRef<HTMLInputElement[]>([])
    const router = useRouter()

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);


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

        const fullCode = code.map(c => c.trim()).join('').replace(/\D/g, '')
   

        if (fullCode.length !== 6) {
            setErrorMessage('El código debe tener 6 dígitos.')
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
                setErrorMessage('Código incorrecto.')
                setShowError(true);
                setTimeout(() => setShowError(false), 3000);
                return
            }

            router.push('/auth/register/form')
        } catch {
            setError('Error de red o servidor.')
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
        } finally {
            setLoading(false)
        }
    }

    const handleResendCode = async () => {
        try {

      
          setSuccessMessage('Se ha reenviado un nuevo código a tu correo.');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } catch {
            setErrorMessage('No se pudo reenviar el código.');
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      };
      

    return (
        <>

            <ErrorOverlay
                message={errorMessage}
                show={showError}
                type='error'
                onClose={() => setShowError(false)}
            />
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
            <div className={styles.container_send_email }>
            <form
                onSubmit={handleSubmit}
                className="bg-indigo-400 bg-opacity-90 p-10 rounded-2xl w-[390px] space-y-6 shadow-xl m-10"
            >
                <div className="flex flex-col items-start w-[270px] gap-3">

                    <h1 className="text-2xl font-semibold text-white text-start">Ingresa el código que te enviamos por e-mail</h1>
                    <p className="text-white text-sm text-start">
                        Te llegó un código de verificación en el correo ingresado anteriormente.

                    </p>
                </div>


                <div className="flex justify-center gap-3 mt-10 mb-10 pr-10 pl-10">
                    {code.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => {
                                if (el) inputsRef.current[i] = el
                            }}
                            type="tel"
                            maxLength={1}
                            inputMode="numeric"
                            className="w-10 h-12 text-center text-xl rounded-lg border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                        />
                    ))}
                </div>

                    <div className="flex flex-col justify-center items-center w-full gap-4">

                        <button
                            type="submit"
                            disabled={loading || code.join('').length < 6}
                            className={`w-65 h-[44px] text-sm font-medium  py-2 rounded-[12px] transition duration-500  cursor-pointer ${
                                code.join('').length === 6 && !loading
                                    ? 'bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            >
                            {loading ? 'Verificando...' : 'Confirmar código'}
                        </button>

                        <button
                            type="button"
                            onClick={handleResendCode}
                            className="w-65 h-[44px] text-sm bg-[#5E52FF] font-medium text-white py-2 rounded-[12px] hover:bg-indigo-700 transition duration-500  cursor-pointer"
                        >
                            Reenviar codigo
                        </button>
                    </div>
            </form>
            </div>
        

        </div>
    </div>
    </>
    )
}
