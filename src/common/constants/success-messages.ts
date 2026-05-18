import { log } from "console";

export const SUCCESS_MESSAGES = {
  usuario: {
    registrado: 'Usuario registrado exitosamente',
    logeado: 'Inicio de sesión exitoso',
    documentoDuplicado: 'El documento ya está registrado',
    iniciadoSesion: 'Inicio de sesión exitoso',
    direccion: 'Dirección registrada exitosamente',
    credencialesInvalidas: 'Credenciales inválidas',
  },
  direccion: {
    noEncontrada: (id: string) => `Dirección '${id}' no encontrada`,
  },
  servicio: {
    noEncontrado: (id: string) => `Servicio '${id}' no encontrado`,
  },
} as const;