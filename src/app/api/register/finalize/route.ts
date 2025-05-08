import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const data = await req.json()

        console.log('📥 Registro recibido:', data)

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('❌ Error en registro:', error)
        return NextResponse.json({ error: 'Error al procesar el registro' }, { status: 500 })
    }
}
