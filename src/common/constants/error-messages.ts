export const ERROR_MESSAGES = {
  usuario: {
    noEncontrado: (id: string) => `Usuario '${id}' no encontrado`,
    documentoDuplicado: 'El documento ya está registrado',
    correoDuplicado: 'El correo ya está registrado',
    telefonoDuplicado: 'El teléfono ya está registrado',
    credencialesInvalidas: 'Credenciales inválidas',
  },
  direccion: {
    noEncontrada: (id: string) => `Dirección '${id}' no encontrada`,
  },
  servicio: {
    noEncontrado: (id: string) => `Servicio '${id}' no encontrado`,
  },
} as const;