import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'fakedata', 'mockDrivers.json');

export async function POST(req: NextRequest) {
  try {
    const nuevoChofer = await req.json();

    // Leer archivo actual
    const data = await fs.readFile(filePath, 'utf-8');
    const choferes = JSON.parse(data);

    // Agregar nuevo chofer
    choferes.push(nuevoChofer);

    // Guardar nuevamente
    await fs.writeFile(filePath, JSON.stringify(choferes, null, 2), 'utf-8');

    return NextResponse.json({ ok: true, message: 'Chofer guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar chofer:', error);
    return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
