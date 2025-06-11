'use client'

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'
import ErrorOverlay from "@/app/ui/auth/login/ErrorOverlay";
import { useUser } from '@/hooks/useUser'
import { AreaType } from '@/types/admin/areaType';
import { get_all_areas_by_admin_id } from '@/services/admin/areas/adminAreasService';
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import Image from 'next/image'


import {Popover,PopoverTrigger,PopoverContent,} from '@/components/ui/popover'
import {Command,CommandInput,CommandEmpty,CommandItem,CommandGroup} from '@/components/ui/command'
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from '@/components/ui/select'

import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Library } from '@react-google-maps/api';
import { createClient } from '@/services/admin/clients/clientsService';


const containerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '12px',
    marginTop: '10px'
  };

  
const centerDefault = {
    lat: -12.0463738,
    lng: -77.0427931
  };

  const googleMapsLibraries: Library[] = ['places'];

  

export default function CreateClientForm() {
    const router = useRouter()
    const user = useUser();
    const [areas, setAreas] = useState<AreaType[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const [loading, setLoading] = useState(true);

    const [markerPosition, setMarkerPosition] = useState(centerDefault);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

    const [center, setCenter] = useState(centerDefault);
    const [isDragging, setIsDragging] = useState(false);
    

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: googleMapsLibraries,
      });
      

    const [form, setForm] = useState({
        full_name: '',
        address: '',
        document_type: '',
        document_number: '',
        area_description_name: '',
        latitude: '',
        longitude: '',
    })

    ///////////////////////////////
 
    const [zona, setZona] = useState(form.area_description_name || '')
    const [open, setOpen] = useState(false)
    const zonaOptions = areas.map((a) => a.description.toUpperCase())
    
    const handleSelectZona = (value: string) => {
      const upperValue = value.toUpperCase()
      setZona(upperValue)
      setForm((prev) => ({ ...prev, area_description_name: upperValue }))
      setOpen(false)
    }
/////////////////////////////////////
const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = (autocompleteRef.current as unknown as google.maps.places.Autocomplete).getPlace();
      if (place.geometry) {
        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();
        setForm((prev) => ({
          ...prev,
          address: place.formatted_address || '',
          latitude: lat?.toString() || '',
          longitude: lng?.toString() || '',
        }));
        setMarkerPosition({ lat: lat || 0, lng: lng || 0 });
        if (mapRef) {
          mapRef.panTo({ lat: lat || 0, lng: lng || 0 });
        }
      }
    }
  };
  


  /////////////////////////////

    const documentoValido =
        (form.document_type === 'DNI' && form.document_number.length === 8) ||
        (form.document_type === 'Carné de Extranjería' && form.document_number.length === 9) ||
        (form.document_type === 'Pasaporte' && form.document_number.length >= 6)

///////////////////////////////////
    const camposCompletos = Object.values(form).every((val) => val.trim() !== '')
    const handleCancel = () => router.back()

    /////////////////////////////////////////////////
    useEffect(() => {
        const fetchAreas = async () => {
            if (!user?.profileId) return;

            try {
                const response = await get_all_areas_by_admin_id(user.profileId.toString());
                if (response.status_code === 200) {
                    setAreas(response.data || []);
                } else {
                    if(response.status_code === 404) {
                        setErrorMessage('No se encontraron áreas');
                        setAreas( []);
                    }
                }
            } catch (error) {
                console.error('Error al obtener áreas:', error);
                setErrorMessage('Error al obtener áreas');
            } finally {
                setLoading(false);
            }
        };

        fetchAreas();
    }, [user?.profileId]);

/////////////////////////

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name === 'document_number') {
            setForm((prev) => ({ ...prev, [name]: value.replace(/\D/g, '') }))
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }
/////////////////////

const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    //impimir el formulario
    console.log('Formulario enviado:', form)

    try{
        const result = await createClient({...form, administrator_id: user?.profileId})
        if (result.status_code === 201) {
            setSuccessMessage('Cliente creado exitosamente')
            setShowMessage(true)
            setForm({
                full_name: '',
                address: '',
                document_type: '',
                document_number: '',
                area_description_name: '',
                latitude: '',
                longitude: '',
            })
            setZona('')
            setMarkerPosition(centerDefault)
            setCenter(centerDefault)

            setTimeout(() => {
                setShowMessage(false)
                router.push('/admin/dashboard/clients')
            }, 3000)
        }
        if( result.status_code === 400) {
            setErrorMessage(result.message || 'Error al crear el cliente')
            setShowMessage(true)
            
            setTimeout(() => {
                setShowMessage(false)
            }, 3000)
        }
        else {
            setErrorMessage(result.message || 'Error al crear el cliente')
            setShowMessage(true)
            setTimeout(() => {
                setShowMessage(false)
            }, 3000)
        }

    }
    catch (error) {
        console.error('Error al crear el cliente:', error)
        setErrorMessage('Error al crear el cliente')
        setShowMessage(true)
        setTimeout(() => {
            setShowMessage(false)
        }, 3000)
    }
} 
    

//////////////////////////////////
    return (
        <>
            <ErrorOverlay
                message= {errorMessage ? errorMessage : successMessage}
                show={showMessage}
                type= {successMessage ? 'success' : 'error'}
                onClose={() => setShowMessage(false)}
            />
        <div className="h-full w-full bg-white rounded-[12px]  flex justify-center ">
            <div className="bg-white rounded-2xl w-full  min-h-[80vh] p-6">
                <h1 className="text-[25px] font-semibold mb-3 text-[#5E52FF]">
                    Registro de clientes
                </h1>
                <hr className="border-[#5E52FF] border-1 mb-6" />

                <div className="bg-[#5E52FF] rounded-xl p-6 w-full max-w-[550px] mx-auto space-y-4 text-white overflow-y-auto max-h-[75vh] custom-scroll">
                    
                <div>
                        <label className="block text-sm mb-1">Tipo de documento</label>
                        <Select onValueChange={(value) => setForm({ ...form, document_type: value })}>
                            <SelectTrigger className="w-full bg-white text-[#5E52FF]">
                                <SelectValue placeholder="Tipo de documento" />
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
                            name="document_number"
                            value={form.document_number}
                            onChange={handleChange}
                            inputMode="numeric"
                            pattern="\d*"
                            disabled={!form.document_type || form.document_type === ''}
                            className="w-full px-4 py-2 rounded-[10px] bg-white border-none text-black focus:outline-none focus:ring-2 focus:ring-white hover:scale-103 transition-transform duration-300 ease-in-out"
                        />
                        { !documentoValido && form.document_number && (
                            <p className="text-red-500 text-sm mt-1">
                                El número de documento no es válido.
                            </p>
                        ) }
                    </div>
                    
                    
                    
                    {[
                        { label: 'Nombres y Apellidos', name: 'full_name' }
                    ].map(({ label, name}) => (
                        <div key={name}>
                            <label className="block text-sm mb-1">{label}</label>
                            <input
                                name={name}
                                value={form[name as keyof typeof form]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-[10px] bg-white border-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-white hover:scale-103 transition-transform duration-300 ease-in-out"
                            />
                        </div>
                    ))}



                {isLoaded && (
                <>
                    <label className="block text-sm mb-1">Direccion</label>

                    <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={handlePlaceChanged}
                    options={{
                        componentRestrictions: { country: 'pe' },
                      }}
                    
                    >
                    <input
                        placeholder="Buscar dirección..."
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full px-4 py-2 rounded-[10px] bg-white border-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-white hover:scale-103 transition-transform duration-300 ease-in-out"
                    />





                    </Autocomplete>

                    <GoogleMap
                                mapContainerStyle={containerStyle}
                        center={center}
                        zoom={15}
                        onLoad={(map) => setMapRef(map)}
                        onDrag={() => setIsDragging(true)}
                        onIdle={() => {
                            setIsDragging(false);
                            if (mapRef) {
                            const newCenter = mapRef.getCenter();
                            const lat = newCenter?.lat();
                            const lng = newCenter?.lng();
                            if (lat && lng) {
                                setCenter({ lat, lng });
                                setForm((prev) => ({
                                ...prev,
                                latitude: lat.toString(),
                                longitude: lng.toString(),
                                }));
                            }
                            }
                        }}
                        >
                        </GoogleMap>

                </>
                )}

                <div className="relative w-full h-0">
                <div className="absolute left-1/2 top-[-150px] transform -translate-x-1/2">
                    {isDragging ? (
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <Image src="/pasador-de-ubicacion.png" alt="Descripción" width={40} height={40} />

                    )}
                </div>
                </div>

        








                    <div>
                        <label className="block text-sm mb-1">Zona</label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between bg-white text-[#5E52FF] rounded-[12px]"
                                >
                                    {zona || "Seleccionar o escribir zona"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent   className="w-[--radix-popover-trigger-width] bg-white text-[#5E52FF] rounded-[12px] p-0"                            >
                            <Command>
                                <CommandInput
                                placeholder="Buscar zona..."
                                className="text-[#5E52FF]"
                                onValueChange={(input) => setZona(input.toUpperCase())}
                                value={zona}
                                />
                                <CommandEmpty>
                                <button
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-[#f0f0ff]"
                                    onClick={() => handleSelectZona(zona)}
                                >
                                    Crear nueva zona: <span className="font-medium">{zona}</span>
                                </button>
                                </CommandEmpty>
                                <CommandGroup>
                                {zonaOptions.map((item) => (
                                    <CommandItem key={item} value={item} onSelect={handleSelectZona}>
                                    <Check
                                        className={cn("mr-2 h-4 w-4", zona === item ? "opacity-100" : "opacity-0")}
                                    />
                                    {item}
                                    </CommandItem>
                                ))}
                                </CommandGroup>
                            </Command>
                            </PopoverContent>
                        </Popover>
                        </div>






                    <div className="flex justify-between pt-4 max-w-[300px] mx-auto">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-white text-[#5E52FF] font-semibold px-6 py-2 rounded-[12px] hover:bg-gray-100 hover:scale-103 transition-transform duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmitForm} 
                          disabled={!camposCompletos }
                            className="bg-[#7284FB] text-white font-semibold px-6 py-2 rounded-[12px] hover:bg-[#4E44D4] transition-transform duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
