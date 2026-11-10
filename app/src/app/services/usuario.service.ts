import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

/** Datos del usuario registrado en el teléfono. */
export interface Usuario {
  nombre: string;
  foto: string;          // Foto de perfil en Base64 (JPEG, sin el prefijo data:)
  fechaRegistro: string;
}

/** Datos del último inicio de sesión exitoso (para la pantalla de bienvenida). */
export interface SesionIniciada {
  sessionId: string;
  confianzaLiveness: number;
  similitud: number;
  fotoLiveness: string;  // Imagen de referencia que devolvió la prueba de vida
  fecha: string;
}

const CLAVE_USUARIO = 'usuario_registrado';

/**
 * Guarda y lee el usuario registrado usando @capacitor/preferences
 * (almacenamiento local y persistente del teléfono).
 */
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  /** Último login exitoso. Vive en memoria mientras la app está abierta. */
  readonly sesion = signal<SesionIniciada | null>(null);

  async guardar(nombre: string, foto: string): Promise<void> {
    const usuario: Usuario = { nombre, foto, fechaRegistro: new Date().toISOString() };
    await Preferences.set({ key: CLAVE_USUARIO, value: JSON.stringify(usuario) });
  }

  async obtener(): Promise<Usuario | null> {
    const { value } = await Preferences.get({ key: CLAVE_USUARIO });
    return value ? (JSON.parse(value) as Usuario) : null;
  }

  async eliminar(): Promise<void> {
    await Preferences.remove({ key: CLAVE_USUARIO });
    this.sesion.set(null);
  }
}
