// pages/api/asignar-cartera.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { choferId, clientsIds } = await request.json();

    if (!choferId || !clientsIds || !Array.isArray(clientsIds)) {
        return NextResponse.json({ message: 'Datos incompletos' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'fakedata', 'routes.json');
    let existingRoutes = [];

    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        existingRoutes = JSON.parse(fileData);
    } catch (error) {
        console.warn('No se encontró routes.json, creando uno nuevo.');
    }

    const newRoute = {
        id: existingRoutes.length + 1,
        choferId,
        clientesConfirmados: clientsIds.map(id => parseInt(id))
    };


    fs.writeFileSync(filePath, JSON.stringify(existingRoutes, null, 2));

    return NextResponse.json({ message: 'Cartera guardada exitosamente', route: newRoute });
}
