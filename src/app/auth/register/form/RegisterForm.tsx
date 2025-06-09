'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../ui/auth/login/login.module.css'
import ErrorOverlay from '@/app/ui/auth/login/ErrorOverlay';
import { registerAdminService } from '@/services/admin/iam/registerAdminService';


export default function RegisterForm() {

    const router = useRouter();

    useEffect(() => {
      const verified = sessionStorage.getItem('email_verified');
      console.log('verified', verified);
      if (verified !== 'true') {
        router.replace('/auth/register/verify'); // redirige si no pasó verificación
      }
    }, []);


    

    const [form, setForm] = useState({
        nombres: '',
        apellidos: '',
        empresa: '',
        tipoDocumento: '',
        numeroDocumento: '',
        contrasena: '',
        confirmarContrasena: '',
        correo:'',
    })


    useEffect(() => {
        if (form.confirmarContrasena && form.contrasena !== form.confirmarContrasena) {
          setErrorConfirmacion('Las contraseñas no coinciden');
        } else {
          setErrorConfirmacion('');
        }
    }, [form.contrasena, form.confirmarContrasena]);

      
    const [errorConfirmacion, setErrorConfirmacion] = useState('');




    useEffect(() => {
        const tipoDocumento = form.tipoDocumento;
        const numeroDocumento = form.numeroDocumento;
      
        let valido = true;
      
        if (!numeroDocumento) {
          setErrorDocumento('');
          return;
        }
      
        switch (tipoDocumento) {
          case 'DNI':
            valido = numeroDocumento.length === 8;
            break;
          case 'Carné de Extranjería':
            valido = numeroDocumento.length === 9;
            break;
          case 'Pasaporte':
            valido = numeroDocumento.length >= 7 && numeroDocumento.length <= 12;
            break;
        }
      
        if (!valido) {
          setErrorDocumento('Número inválido para el tipo seleccionado');
        } else {
          setErrorDocumento('');
        }
      }, [form.tipoDocumento, form.numeroDocumento]); // ✅ correcto, warning eliminado
      
      
    const [errorDocumento, setErrorDocumento] = useState('');


    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)



    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        const { name, value } = e.target;
      
        if (name === 'numeroDocumento') {
          const soloNumeros = value.replace(/\D/g, '');
          setForm((prev) => ({ ...prev, [name]: soloNumeros }));
        } else if (name === 'empresa') {
          setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
        } else {
          setForm((prev) => ({ ...prev, [name]: value }));
        }
      };
      


    const camposCompletos =
        form.nombres.trim() &&
        form.apellidos.trim() &&
        form.empresa.trim() &&
        form.tipoDocumento.trim() &&
        form.numeroDocumento.trim() &&
        form.contrasena.trim() &&
        form.confirmarContrasena.trim() &&
        form.contrasena === form.confirmarContrasena


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')


        if (!camposCompletos) {
            setError('Por favor completa todos los campos')
            return
        }

        
        //obtener el correo del localStorage
        const email = localStorage.getItem('emailRegister');
        
        if (!email) {
            setError('Correo electrónico no encontrado. Por favor, verifica tu registro.');
            router.push('/auth/register/email');
            return;
        }


        setLoading(true)
        
        try {
            const res = await registerAdminService({
                full_name: form.nombres,
                last_names: form.apellidos,
                document_number: form.numeroDocumento,
                type_document: form.tipoDocumento,
                email: email,
                password: form.contrasena,
                company_name: form.empresa,
            })

            if( res.status_code !== 201) {
                if (res.status_code === 422) {
                    setError('El formato del número de documento es incorrecto')
                } else if (res.status_code === 400) {
                    setError(res.detail)
                } else if (res.status_code === 404) {
                    setError(res.detail)
                }else {
                    setError('Error al registrar administrador')
                }
                return
            }



            setSuccessMessage('Te has registrado exitosamente');
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                router.push("/auth/login");
            }, 3000);


            setLoading(false)
        } catch {
            setError('Error de red o servidor')
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
                                        disabled={!form.tipoDocumento}
                                        className="w-full h-[35px] px-4 py-2 rounded-lg border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                                        />
                                        {errorDocumento && (
                                            <p className="text-red-100 text-xs mt-1">{errorDocumento}</p>
                                            )}

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
                            <div>
                            <label className="block text-white text-sm mb-1">Confirmar contraseña</label>
                            <input
                                type="password"
                                name="confirmarContrasena"
                                value={form.confirmarContrasena}
                                onChange={handleChange}
                                className="w-full h-[35px] px-4 py-2 rounded-lg border border-white bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
                            />
                              {errorConfirmacion && (
                                    <p className="text-red-100 text-xs mt-1">{errorConfirmacion}</p>
                                )}
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