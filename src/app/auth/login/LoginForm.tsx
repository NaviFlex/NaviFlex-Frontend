'use client'
import { useState } from 'react'
import styles from '../../ui/auth/login/login.module.css'
import ErrorOverlay from '@/app/ui/auth/login/ErrorOverlay';


export default function LoginForm() {
    const [usuario, setUsuario] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const camposCompletos = usuario.trim() !== '' && contrasena.trim() !== ''

    const [showError, setShowError] = useState(false);


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
            });
      
            if (!res.ok) {
              setError('Credenciales incorrectas');
              setShowError(true);
              setTimeout(() => setShowError(false), 3000);
              return;
            }
      
            window.location.href = '/admin/home';
          } catch (err) {
            setError('Error del servidor. Intenta nuevamente.');
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
          } finally {
            setLoading(false);
          }
    }

    return (
        <>
            <ErrorOverlay
                message={error}
                show={showError}
                onClose={() => setShowError(false)}
            />

        <div
            className={styles.container_principale}
            
            >
            <div className={styles.container_secondary}>
                <div className={styles.container_form }>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-indigo-400 bg-opacity-90 pt-10 pb-6 pr-6 pl-6 rounded-2xl w-[350px] space-y-6 shadow-xl "
                        >
                        <h1 className="text-5xl font-bold text-white text-center mb-[14px] sm:mb-12">NaviFlex</h1>

                        <div>
                            <label className="block text-white text-sm mb-1">Usuario</label>
                            <input
                                type="text"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                                />
                        </div>

                        <div>
                            <label className="block text-white text-sm mb-1">Contraseña</label>
                            <input
                                type="password"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                                />
                        </div>

                        <div className="flex justify-center mt-10 mb-10">
                            <button
                                    type="submit"
                                    disabled={!camposCompletos || loading}
                                    className={`w-32 font-medium py-2 rounded-[12px] transition duration-500	mx-auto  ${
                                        camposCompletos && !loading
                                        ? 'bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white cursor-pointer'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    >
                                    {loading ? 'Ingresando...' : 'Ingresar'}
                            </button>
                        </div>

                        <p className="text-sm text-center text-white mt-4">
                            ¿Aún no tienes una cuenta?{' '}
                            <a href="/auth/register/email" className="underline font-medium hover:text-yellow-200 transition duration-500">
                                Regístrate
                            </a>
                        </p>
                    </form>
                </div>
        

            </div>
        </div>
        
    </>
    )
}




