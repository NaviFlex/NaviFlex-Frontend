import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { LoginPayload } from '@/types/auth';
const filePath = path.join(process.cwd(), 'fakedata', 'users.json');

export async function POST(req: NextRequest) {

  const { username, password }: LoginPayload = await req.json();

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const usuarios = data.trim() ? JSON.parse(data) : [];

    const user = usuarios.find(
      (u: any) => u.correo === usuario && u.contrasena === contrasena
    );

    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    return NextResponse.json({ ok: true, rol: user.rol });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
