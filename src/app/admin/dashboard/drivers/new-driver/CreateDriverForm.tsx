'use client'

import ErrorOverlay from '@/app/ui/auth/login/ErrorOverlay'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {registerDriver} from '@/services/admin/drivers/adminDriversService'
import { useUser } from '@/hooks/useUser'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"


export default function CreateDriverForm() {
    const router = useRouter()
    const [successMessage, setSuccessMessage] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const user = useUser();
    

    const [form, setForm] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        tipoDocumento: '',
        numeroDocumento: '',
        placa: '',
    })

    const [messageType, setMessageType] = useState<'success' | 'error'>('success')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name === 'numeroDocumento') {
            setForm((prev) => ({ ...prev, [name]: value.replace(/\D/g, '') }))
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }
    
    const placaValida = /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(form.placa.toUpperCase())
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)
    const documentoValido =
        (form.tipoDocumento === 'DNI' && form.numeroDocumento.length === 8) ||
        (form.tipoDocumento === 'Carné de Extranjería' && form.numeroDocumento.length === 9) ||
        (form.tipoDocumento === 'Pasaporte' && form.numeroDocumento.length >= 6)

    const camposCompletos =
        Object.values(form).every((val) => val.trim() !== '') &&
        form.contrasena === form.confirmarContrasena &&
        isEmailValid &&
        documentoValido &&
        placaValida
    

    const handleCancel = () => router.back()

    return (
        <>
            <ErrorOverlay 
            message={successMessage} 
            show={showSuccess} 
            type={messageType}
            onClose={() => setShowSuccess(false)}
            />

            <div className="w-full h-full rounded-[12px] bg-white">
                <div className="bg-white rounded-2xl w-full h-full min-h-[80vh] p-6 overflow-y-auto">
                    <h1 className="text-xl font-semibold text-[#5E52FF] mb-2">Registro de choferes</h1>
                    <hr className="border-[#5E52FF] border-1 mb-6" />

                    <div className="bg-[#5E52FF] rounded-xl p-6 w-full max-w-md mx-auto space-y-4 text-white">
                        {[{ label: 'Nombre', name: 'nombre' }, { label: 'Apellidos', name: 'apellidos' }, { label: 'Correo', name: 'correo', type: 'email' }, { label: 'Contraseña', name: 'contrasena', type: 'password' }, { label: 'Confirmar contraseña', name: 'confirmarContrasena', type: 'password' }, { label: 'Placa de Unidad', name: 'placa' }].map(({ label, name, type = 'text' }) => (
                            <div key={name} className="text-bold">
                                <label className="block text-sm mb-1 font-normal">{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={form[name as keyof typeof form]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-[10px] bg-white border-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-white hover:scale-103 transition-transform duration-300 ease-in-out"
                                />
                                {name === 'correo' && form.correo && !isEmailValid && (
                                    <p className="text-red-200 text-xs mt-1">Correo no válido</p>
                                )}
                                {name === 'confirmarContrasena' && form.confirmarContrasena && form.contrasena !== form.confirmarContrasena && (
                                    <p className="text-red-200 text-xs mt-1">Las contraseñas no coinciden</p>
                                )}
                                {name === 'placa' && form.placa && !placaValida && (
                                    <p className="text-red-200 text-xs mt-1">Placa inválida. Debe tener el formato XXX-XXX</p>
                                )}

                            </div>
                        ))}

                        <div>
                             <label className="block text-sm mb-1">Tipo de documento</label>
                            <Select
                                onValueChange={(value) =>
                                setForm((prev) => ({ ...prev, tipoDocumento: value }))
                                }
                                value={form.tipoDocumento}
                            >
                                <SelectTrigger className="w-full bg-white rounded-[10px] text-[#5E52FF] focus:ring-2 focus:ring-white">
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-[#5E52FF]">
                                    <SelectItem value="DNI">DNI</SelectItem>
                                    <SelectItem value="Carné de Extranjería">Carné de Extranjería</SelectItem>
                                    <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                </SelectContent>
                            </Select>
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
                                disabled={!form.tipoDocumento || form.tipoDocumento === ''}
                                className="w-full px-4 py-2 rounded-[12px] bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-60"
                            />
                            {form.numeroDocumento && !documentoValido && (
                                <p className="text-red-200 text-xs mt-1">Número de documento inválido para el tipo seleccionado</p>
                            )}
                        </div>

                        <div className="flex justify-center pt-4 gap-6">
                            <button type="button" onClick={handleCancel} className="w-35 h-[44px] text-sm bg-white text-[#5E52FF] px-6 py-2 rounded-[12px] hover:bg-gray-100 transition duration-500 cursor-pointer">
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={!camposCompletos}

                                
                                onClick={async () => {
                                    const payload = {
                                        email: form.correo,
                                        full_name: form.nombre,
                                        last_names: form.apellidos,
                                        document_number: form.numeroDocumento,
                                        type_document: form.tipoDocumento,
                                        password: form.contrasena,
                                        badge_number: form.placa,
                                        administrator_id: user?.profileId // Reemplaza con el ID real si lo obtienes dinámicamente
                                    }
                                
                                    try {
                                        const result = await registerDriver(payload)
                                      
                                        if (result.status_code === 400 || result.status_code === 404) {
                                          setMessageType('error')
                                          setSuccessMessage(result.message)
                                          setShowSuccess(true)
                                          setTimeout(() => {
                                            setShowSuccess(false);
                                        }, 3000);
                                      
                                        } else if (result.status_code === 201 ) {
                                          setMessageType('success')
                                          setSuccessMessage(result.message || 'El chofer se ha registrado exitosamente')
                                          setShowSuccess(true)
                                          setTimeout(() => {
                                            setShowSuccess(false)
                                            router.push('/admin/dashboard/drivers')
                                          }, 3000)
                                      
                                        } else {
                                          setMessageType('error')
                                          setSuccessMessage(result.message || 'Ocurrió un error inesperado')
                                          setShowSuccess(true)
                                        }
                                      } catch (error) {
                                        console.error('Error de red al guardar chofer:', error)
                                        setMessageType('error')
                                        setSuccessMessage('Error de red al intentar registrar el chofer')
                                        setShowSuccess(true)
                                      }
                                      
                                }}
                                





                                className={`w-35 h-[44px] px-6 py-2 rounded-[12px] transition ${
                                    camposCompletos ? 'bg-[#5a6ffb] text-white hover:bg-[#405dfb] transition duration-500 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Registrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
