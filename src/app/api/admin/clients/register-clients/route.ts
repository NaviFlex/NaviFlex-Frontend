import path from "path";
import {NextRequest, NextResponse} from "next/server";
import fs from "fs/promises";

const filePath = path.join(process.cwd(), 'fakedata', 'clients.json');

export async function POST(req: NextRequest){
    try {
        const newClient = await req.json();

        const data = await fs.readFile(filePath, 'utf-8');
        const clients = JSON.parse(data);

        clients.push(newClient);

        await fs.writeFile(filePath, JSON.stringify(clients, null, 2), 'utf-8');

        return NextResponse.json({ ok: true, message: 'Cliente guardado correctamente' });
    }
    catch (error) {
        console.error('Error al guardar cliente:', error);
        return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 });
    }
}