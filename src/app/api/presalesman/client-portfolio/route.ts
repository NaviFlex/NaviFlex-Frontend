

import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const filePath = path.join(process.cwd(), 'fakedata', 'clients.json');

export async function GET() {
    try {
        const data = await fetch(filePath);
        const clients = await data.json();

        return NextResponse.json({ ok: true, clients });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 });
    }
}


export async function PUT(req: Request) {
    try {
        const updatedClient = await req.json();
        
        const data = await fetch(filePath);
        const clients = await data.json();

        const index = clients.findIndex((client: any) => client.id === updatedClient.id);
        if (index === -1) {
            return NextResponse.json({ ok: false, error: 'Cliente no encontrado' }, { status: 404 });
        }

        clients[index] = updatedClient;

        await fs.promises.writeFile(filePath, JSON.stringify(clients, null, 2), 'utf-8');

        return NextResponse.json({ ok: true, message: 'Cliente actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 });
    }
}