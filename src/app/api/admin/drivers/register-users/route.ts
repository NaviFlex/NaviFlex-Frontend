import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'fakedata', 'users.json');

export async function POST(req: NextRequest) {
  try {
    const newDriver = await req.json();

    // Leer archivo actual
    const data = await fs.readFile(filePath, 'utf-8');
    const drivers = JSON.parse(data);

    // Agregar nuevo chofer
    drivers.push(newDriver);
    
    // Guardar nuevamente
    await fs.writeFile(filePath, JSON.stringify(drivers, null, 2), 'utf-8');

    return NextResponse.json({ ok: true, message: 'Chofer guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar chofer:', error);
    return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
