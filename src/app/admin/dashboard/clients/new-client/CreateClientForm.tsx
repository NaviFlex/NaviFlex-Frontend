'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ErrorOverlay from "@/app/ui/auth/login/ErrorOverlay";
import { useUser } from '@/hooks/useUser'
import { AreaType } from '@/types/admin/areaType';
import { get_all_areas_by_admin_id } from '@/services/admin/areas/adminAreasService';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select'

export default function CreateClientForm() {
    const router = useRouter()
    const user = useUser();
    const [areas, setAreas] = useState<AreaType[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

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

    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [form, setForm] = useState({
        nombre: '',
        direccion: '',
        zona: '',
        tipoDocumento: '',
        numeroDocumento: '',
        realizoPedido: 'false',
        rol: 'cliente'
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const camposCompletos = Object.values(form).every((val) => val.trim() !== '')
    const handleCancel = () => router.back()

    return (
        <>
            <ErrorOverlay
                message={successMessage}
                show={showSuccess}
                type="success"
                onClose={() => setShowSuccess(false)}
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
                        <Select onValueChange={(value) => setForm({ ...form, tipoDocumento: value })}>
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
                            name="numeroDocumento"
                            value={form.numeroDocumento}
                            onChange={handleChange}
                            inputMode="numeric"
                            pattern="\d*"
                            className="w-full px-4 py-2 rounded-[10px] bg-white border-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-white hover:scale-103 transition-transform duration-300 ease-in-out"
                        />
                    </div>
                    
                    
                    
                    {[
                        { label: 'Nombres y Apellidos', name: 'nombre' },
                        { label: 'Dirección', name: 'direccion'},
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


                    <div className="flex justify-center w-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.5803405273693!2d-77.0427931!3d-12.0463738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8c2f68efb2b%3A0x63f52fb8a7f9fbd3!2sPlaza%20Mayor%20de%20Lima!5e0!3m2!1ses-419!2spe!4v1700000000000"
                            width="250"
                            height="250"
                            allowFullScreen
                            loading="lazy"
                            className="rounded-lg shadow-lg w-full h-full"
                        ></iframe>
                    </div>



                    <div>
                        <label className="block text-sm mb-1">Zona</label>
                        <select
                            name="zona"
                            value={form.zona}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-full bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <option value="">Seleccionar</option>
                            <option value="Norte">Norte</option>
                            <option value="Centro">Centro</option>
                            <option value="Sur">Sur</option>
                        </select>
                    </div>



                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-white text-[#7284FB] px-6 py-2 rounded-full hover:bg-gray-100 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!camposCompletos}
                            onClick={async () => {
                                try {
                                    const response = await fetch('/api/admin/clients/register-clients', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            ...form,
                                            realizoPedido: form.realizoPedido === 'true',
                                        }),
                                    });

                                    const result = await response.json();

                                    if (result.ok) {
                                        setSuccessMessage('El cliente se ha registrado exitosamente');
                                        setShowSuccess(true);
                                        setTimeout(() => {
                                            setShowSuccess(false);
                                            router.push("/admin/dashboard/clients");
                                        }, 3000);
                                    } else {
                                        console.error(result.error || 'Ocurrió un error al guardar el cliente');
                                    }
                                } catch (error) {
                                    console.error('Error de red al guardar cliente:', error);
                                }
                            }}
                            className={`px-6 py-2 rounded-full transition ${
                                camposCompletos
                                    ? 'bg-[#5a6ffb] text-white hover:bg-[#405dfb]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Registrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>)
}
