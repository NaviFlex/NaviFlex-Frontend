export function buildPayload(form: any, role: 'chofer' | 'prevendedor') {
    if (role === 'chofer') {
        return {
            nombre: form.nombre,
            apellidos: form.apellidos,
            correo: form.correo,
            contrasena: form.contrasena,
            tipoDocumento: form.tipoDocumento,
            numeroDocumento: form.numeroDocumento,
            placa: form.placa,
            rol: 'chofer',
        }
    }

    if (role === 'prevendedor') {
        return {
            nombre: form.nombre,
            apellidos: form.apellidos,
            correo: form.correo,
            contrasena: form.contrasena,
            tipoDocumento: form.tipoDocumento,
            numeroDocumento: form.numeroDocumento,
            zonaAsignada: form.zonaAsignada,
            rol: 'prevendedor',
        }
    }

    throw new Error('Rol no soportado')
}
