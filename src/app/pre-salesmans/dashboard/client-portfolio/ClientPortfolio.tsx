'use client';

import React, { useState } from 'react';
import clients from '../../../../../fakedata/clients.json';
import { UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';


type Client = {
    id: string;
    nombre: string;
    direccion: string;
    zona: string;
    tipoDocumento: string;
    numeroDocumento: string;
    realizoPedido: boolean;
    rol: string;
};

const mockClientsData: Client[] = clients
    .filter((c: any) => c.rol === 'cliente' && c.zona === 'Florencia de Mora')
    .map((c: any) => ({
        id: c.id ?? '',
        nombre: c.nombre ?? '',
        direccion: c.direccion ?? '',
        zona: c.zona ?? '',
        tipoDocumento: c.tipoDocumento ?? '',
        numeroDocumento: c.numeroDocumento ?? '',
        realizoPedido: c.realizoPedido ?? false,
        rol: c.rol ?? ''
    }));

export default function ClientPortfolio() {
    const [search, setSearch] = useState("");
    const [clients, setClients] = useState<Client[]>(mockClientsData);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toLocaleDateString();

    const handleConfirm = async (id: string, clientName: string) => {
        try {
            const response = await fetch('/api/presalesman/confirm-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Error al confirmar el pedido');
            }

            const data = await response.json();

            // Actualiza el estado local para reflejar el cambio en UI
            setClients(prevClients =>
                prevClients.map(client =>
                    client.id === id ? { ...client, realizoPedido: true } : client
                )
            );

            toast.success(`El pedido de ${clientName} fue confirmado exitosamente.`,{
                duration: 4000
            });
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al confirmar el pedido.');
        }
    };

    const filteredClients = clients.filter(client =>
        client.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full h-full rounded-[12px] bg-white p-4">
            <h1 className="text-xl font-bold text-center text-[#5E52FF] mb-4">Clientes gestionados</h1>

            <div className="flex items-center mb-1 border rounded px-2 bg-[#5E52FF]">
                <MagnifyingGlassIcon className="w-5 h-5 text-white ml-2" />
                <Input
                    type="text"
                    placeholder="Buscar cliente"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-0 focus:ring-0 text-white bg-transparent placeholder-white"
                />
            </div>
            <hr className="border-indigo-200 mb-4" />

            <div className="space-y-3 p-1">
                {filteredClients.map((client) => (
                    <div
                        key={client.id}
                        className="flex items-center justify-between bg-[#5E52FF] rounded-lg p-2 text-white"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="bg-transparent rounded-full p-1">
                                <UserIcon className="h-12 w-12 text-white" />
                            </div>
                            <span className="text-lg">
                                {client.nombre}
                                {client.realizoPedido && (
                                    <span className="ml-2 text-green-300 text-sm">(Confirmado)</span>
                                )}
                            </span>
                        </div>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button 
                                    className="bg-[#7284FB] text-white hover:bg-blue-500 cursor-pointer"
                                    disabled={client.realizoPedido}
                                >
                                    Confirmar pedido
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-[#7284FB] border-none rounded-[10px]">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-center text-white mb-5">
                                        ¿Deseas confirmar el pedido de {client.nombre}, para el día {tomorrowFormatted}?
                                    </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex justify-center md:justify-center items-center w-full space-x-2">
                                    <AlertDialogCancel className="text-[#5E52FF] cursor-pointer">
                                        Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleConfirm(client.id, client.nombre)}
                                        className= "bg-[#5E52FF] cursor-pointer" 
                                        disabled= {client.realizoPedido}
                                    >
                                        Confirmar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}
            </div>
        </div>
    );
}
