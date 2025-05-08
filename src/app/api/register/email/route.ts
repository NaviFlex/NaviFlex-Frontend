import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { email } = await req.json()
    console.log(`Simulando envío de código a: ${email}`)
    return NextResponse.json({ ok: true })
}
