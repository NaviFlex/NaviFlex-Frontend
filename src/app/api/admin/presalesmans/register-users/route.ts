import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'fakedata', 'users.json');

export async function POST(req: NextRequest) {
  try {
    const newPresalesman = await req.json();

    // Leer archivo actual
    const data = await fs.readFile(filePath, 'utf-8');
    const presalesmans = JSON.parse(data);

    // Agregar nuevo chofer
    presalesmans.push(newPresalesman);

    // Guardar nuevamente
    await fs.writeFile(filePath, JSON.stringify(presalesmans, null, 2), 'utf-8');

    return NextResponse.json({ ok: true, message: 'Prevendedor guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar chofer:', error);
    return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID es requerido' }, { status: 400 })
    }

    const updates = await req.json()

    const data = await fs.readFile(filePath, 'utf-8')
    const salesman = JSON.parse(data)

    const userIndex = salesman.findIndex((u: any) => u.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ ok: false, error: 'Usuario no encontrado' }, { status: 404 })
    }

    salesman[userIndex] = { ...salesman[userIndex], ...updates }

    await fs.writeFile(filePath, JSON.stringify(salesman, null, 2), 'utf-8')

    return NextResponse.json({ ok: true, message: 'Usuario actualizado correctamente' })
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID es requerido' }, { status: 400 })
    }

    const data = await fs.readFile(filePath, 'utf-8')
    let salesman = JSON.parse(data)

    const initialLength = salesman.length
    salesman = salesman.filter((u: any) => u.id !== id)

    if (salesman.length === initialLength) {
      return NextResponse.json({ ok: false, error: 'Usuario no encontrado' }, { status: 404 })
    }

    await fs.writeFile(filePath, JSON.stringify(salesman, null, 2), 'utf-8')

    return NextResponse.json({ ok: true, message: 'Usuario eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}