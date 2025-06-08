import { NextResponse } from "next/server";

export async function POST() {
  const backendUrl = `${process.env.BACKEND_URL}/routes/obtain_daily_jordanian_route`;

  const requestBody = {
    driver_id: 1,
    date: "2025-06-07"
  };

  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcnViZWFhXzFAZ21haWwuY29tIiwiZXhwIjoxNzQ5MzU2ODE1fQ.0kz--95bASnH68kzPA4-gHNhF7b5ojIi7ec9G04RfUE"//localStorage.getItem("token");

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

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al obtener ruta de la jornada:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
