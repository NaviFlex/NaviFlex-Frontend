import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { code } = await req.json()

    console.log('Código recibido en el servidor:', code)

    if (String(code).trim() === '653124') {
        return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Código incorrecto' }, { status: 400 })
}
