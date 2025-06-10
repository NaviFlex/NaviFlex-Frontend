import { NextResponse } from "next/server";

export async function POST() {
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/routes/obtain_daily_jordanian_route`;

  const requestBody = {
    driver_id: 1,
    date: "2025-06-07"
  };

  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcnViZWFhXzFAZ21haWwuY29tIiwidXNlcl9pZCI6Miwicm9sZSI6ImFkbWluIiwicHJvZmlsZV9pZCI6MiwiZXhwIjoxNzQ5NTIyNzQxfQ.8OJeJKxhPIPKT8PITnuLsb97H8w8-6tmu_3D-BOClHo"//localStorage.getItem("token");

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // 👈 Token aquí
      },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      console.error("Error al obtener ruta de la jornada:", res.statusText);
      return NextResponse.json({ error: "Error al obtener ruta" }, { status: res.status });
    }

    console.log("Ruta obtenida exitosamente:", res);

    const data = await res.json();

    console.log("Datos de la ruta:", data);

    return NextResponse.json(data);
  } catch (error) {
    
    console.error("Error al obtener ruta de la jornada:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
