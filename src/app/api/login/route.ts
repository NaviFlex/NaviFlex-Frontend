import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { usuario, contrasena } = await req.json()

    if (usuario === 'admin' && contrasena === 'admin123') {
        return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
