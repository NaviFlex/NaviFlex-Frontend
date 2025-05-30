import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

function generateRandomOrderNumber(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { id } = body;

    if (!id) {
        return NextResponse.json({ message: 'Missing client ID' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'fakedata', 'clients.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const clients = JSON.parse(fileData);

    const clientIndex = clients.findIndex((c: any) => c.id === id);

    if (clientIndex === -1) {
        return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    // Marcar como confirmado y asignar número de orden random
    clients[clientIndex].realizoPedido = true;
    clients[clientIndex].numeroOrden = generateRandomOrderNumber();

    fs.writeFileSync(filePath, JSON.stringify(clients, null, 2));

    return NextResponse.json({
        message: 'Pedido confirmado',
        client: clients[clientIndex],
    });
}
