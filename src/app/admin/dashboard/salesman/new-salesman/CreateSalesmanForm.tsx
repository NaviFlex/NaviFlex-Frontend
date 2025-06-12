'use client'

import ErrorOverlay from '@/app/ui/auth/login/ErrorOverlay'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUser } from '@/hooks/useUser'
import { AreaType } from '@/types/admin/areaType'
import { get_areas_presalesman_id_isNone_by_admin_id } from '@/services/admin/areas/adminAreasService'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { ChevronsUpDown, Check } from 'lucide-react'
import { createPresalesman } from '@/services/admin/presalesmans/adminPresalesmansService'


export default function CreateSalesmanForm() {
    const router = useRouter()
    const user = useUser()
    const [areas, setAreas] = useState<AreaType[]>([]) // Assuming you will fetch areas based on admin_id
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [showMessage, setShowMessage] = useState(false)

    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);


    const [form, setForm] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        tipoDocumento: '',
        numeroDocumento: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name === 'numeroDocumento') {
            setForm((prev) => ({ ...prev, [name]: value.replace(/\D/g, '') }))
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)
    const documentoValido =
        (form.tipoDocumento === 'DNI' && form.numeroDocumento.length === 8) ||
        (form.tipoDocumento === 'Carné de Extranjería' && form.numeroDocumento.length === 9) ||
        (form.tipoDocumento === 'Pasaporte' && form.numeroDocumento.length >= 6)


    const camposCompletos = Object.values(form).every((val) => val.trim() !== '')
    const handleCancel = () => router.back()

    ////////////////////////////////////////////////
    const toggleArea = (id: number) => {
        setSelectedAreas((prev) =>
          prev.includes(id) ? prev.filter((areaId) => areaId !== id) : [...prev, id]
        );
      };
    ////////////////////////////////////////////////      


    useEffect(()=>{
        
        const fetchAreas = async () => {
            
            if (!user?.profileId) {
                return
            }
    
            try{
                const response = await get_areas_presalesman_id_isNone_by_admin_id(user.profileId)
                
                if (response.status_code === 200) {
                    setAreas(response.data || []);
                } else {
                    if(response.status_code === 404) {
                        setErrorMessage('No se encontraron áreas');
                        setAreas( []);
                    }
                }
    
            }catch (error) {
                console.error('Error al obtener áreas:', error);
                setErrorMessage('Error al obtener áreas');
            } 
        };

        fetchAreas()

    }, [user?.profileId])

    return (
        <>
            <ErrorOverlay
                message= {errorMessage ? errorMessage : successMessage}
                show={showMessage}
                type= {successMessage ? 'success' : 'error'}
                onClose={() => setShowMessage(false)}
            />


            <div className="w-full h-full rounded-[12px] bg-white">
                <div className="bg-white rounded-2xl w-full h-full min-h-[80vh] p-6 overflow-y-auto">
                    <h1 className="text-xl font-semibold text-[#5E52FF] mb-2">Registro de prevendedor</h1>
                    <hr className="border-[#5E52FF] border-1 mb-6" />

                    <div className="bg-[#5E52FF] rounded-xl p-6 w-full max-w-md mx-auto space-y-4 text-white">
                        {[{ label: 'Nombre', name: 'nombre' }, { label: 'Apellidos', name: 'apellidos' }, { label: 'Correo', name: 'correo', type: 'email' }, { label: 'Contraseña', name: 'contrasena', type: 'password' }, { label: 'Confirmar contraseña', name: 'confirmarContrasena', type: 'password' }].map(({ label, name, type = 'text' }) => (
                            <div key={name}>
                                <label className="block text-sm mb-1">{label}</label>
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

                        <div>
                            <label className="block text-sm mb-1">Áreas asignadas</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between bg-white text-[#5E52FF] rounded-[12px]"
                                >
                                    {selectedAreas.length > 0
                                    ? `${selectedAreas.length} seleccionadas`
                                    : 'Seleccionar áreas'}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] bg-white text-[#5E52FF] rounded-[12px] p-0">
                                <Command>
                                    <CommandInput placeholder="Buscar área..." className="text-[#5E52FF]" />
                                    <CommandGroup>
                                    {areas.map((area) => (
                                        <CommandItem
                                        key={area.id}
                                        value={area.description}
                                        onSelect={() => toggleArea(area.id)}
                                        className="flex items-center justify-between"
                                        >
                                        {area.description}
                                        {selectedAreas.includes(area.id) && (
                                            <Check className="h-4 w-4 text-green-500" />
                                        )}
                                        </CommandItem>
                                    ))}
                                    </CommandGroup>
                                </Command>
                                </PopoverContent>
                            </Popover>
                            </div>


                        <div className="flex justify-between pt-4 max-w-[300px] mx-auto">
                            <button type="button" onClick={handleCancel} className="bg-white text-[#5E52FF] font-semibold px-6 py-2 rounded-[12px] hover:bg-gray-100 hover:scale-103 transition-transform duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
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
                                        administrator_id: user?.profileId || 0, // Asegúrate de que este ID sea correcto
                                        areas_id: selectedAreas // Aquí pasamos las áreas seleccionadas
                                    }

                                    try {
                                        const result = await createPresalesman(payload)

                                        if (result.status_code === 201) {
                                            setSuccessMessage('Prevendedor registrado exitosamente')
                                            setShowMessage(true)
                                            setForm({
                                                nombre: '',
                                                apellidos: '',
                                                correo: '',
                                                contrasena: '',
                                                confirmarContrasena: '',
                                                tipoDocumento: '',
                                                numeroDocumento: ''
                                            })
                                            setSelectedAreas([])

                                            setTimeout(() => {
                                                router.push('/admin/dashboard/salesman')
                                            }, 3000)
                                        }else{
                                            if(result.status_code === 400) {
                                                setErrorMessage(result.message || 'Error al registrar prevendedor')
                                                setShowMessage(true)

                                                setTimeout(() => {
                                                    setShowMessage(false)
                                                }, 3000)
                                            } else if (result.status_code === 409) {
                                                setErrorMessage('El correo electrónico ya está en uso')
                                                setShowMessage(true)
                                                setTimeout(() => {
                                                    setShowMessage(false)
                                                }, 3000)
                                            } else {
                                                setErrorMessage('Error inesperado. Intente nuevamente.')
                                                setShowMessage(true)
                                                setTimeout(() => {
                                                    setShowMessage(false)
                                                }, 3000)
                                            }
                                        }
                                    } catch (error) {
                                        console.error('Error al registrar prevendedor:', error)
                                        setErrorMessage('Error al registrar prevendedor')
                                        setShowMessage(true)
                                        setTimeout(() => {
                                            setShowMessage(false)
                                        }, 3000)
                                    }
                                }}
                                className={ 'bg-[#7284FB] text-white font-semibold px-6 py-2 rounded-[12px] hover:bg-[#4E44D4] transition-transform duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'}
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
