import { Component, inject, signal } from '@angular/core';
import { NavController } from '@ionic/angular/lazy';

import { AWS_CONFIG } from '../../config/aws-config';
import { RekognitionApiService } from '../../services/rekognition-api.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { base64AUrl } from '../../utils/imagen';

/** Estados por los que pasa la pantalla de login. */
type Estado = 'listo' | 'creando-sesion' | 'liveness' | 'verificando' | 'error';

/** Un paso del proceso que se muestra en la lista con su ícono. */
interface Paso {
  texto: string;
  estado: 'pendiente' | 'en-curso' | 'ok' | 'fallo';
  detalle?: string;
}

/**
 * Login biométrico. Aquí se usan las 3 Lambdas en orden:
 *   1) getSessionId      -> crea la sesión de prueba de vida
 *   2) (Amplify graba el rostro y lo envía a Rekognition)
 *      getSessionResults -> ¿es una persona real? + foto de referencia
 *   3) compareFaces      -> ¿es la misma persona que se registró?
 */
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: false,
})
export class LoginPage {
  private api = inject(RekognitionApiService);
  private usuarioService = inject(UsuarioService);
  private navCtrl = inject(NavController);

  readonly estado = signal<Estado>('listo');
  readonly sessionId = signal<string>('');
  readonly mensajeError = signal<string>('');
  readonly pasos = signal<Paso[]>([]);
  readonly usuario = signal<Usuario | null>(null);
  readonly base64AUrl = base64AUrl;

  async ionViewWillEnter() {
    const usuario = await this.usuarioService.obtener();
    if (!usuario) {
      // Sin registro no hay con qué comparar: lo mandamos a registrarse.
      this.navCtrl.navigateRoot('/registro');
      return;
    }
    this.usuario.set(usuario);
    this.reiniciar();
  }

  ionViewWillLeave() {
    // Al salir quitamos el componente de liveness para liberar la cámara.
    if (this.estado() === 'liveness') this.estado.set('listo');
  }

  reiniciar() {
    this.estado.set('listo');
    this.mensajeError.set('');
    this.pasos.set([
      { texto: 'Crear sesión de prueba de vida (getSessionId)', estado: 'pendiente' },
      { texto: 'Prueba de vida con la cámara (Face Liveness)', estado: 'pendiente' },
      { texto: 'Obtener resultado (getSessionResults)', estado: 'pendiente' },
      { texto: 'Comparar con su foto (compareFaces)', estado: 'pendiente' },
    ]);
  }

  /** PASO 1: pedir a la Lambda getSessionId una sesión nueva. */
  async iniciar() {
    this.reiniciar();
    this.estado.set('creando-sesion');
    this.marcarPaso(0, 'en-curso');
    try {
      const sessionId = await this.api.crearSesion();
      this.sessionId.set(sessionId);
      this.marcarPaso(0, 'ok', sessionId);
      this.marcarPaso(1, 'en-curso');
      // Al cambiar a 'liveness' aparece el componente de Amplify en pantalla.
      this.estado.set('liveness');
    } catch (error) {
      this.fallar(0, 'No se pudo crear la sesión. Revise su conexión a internet.', error);
    }
  }

  /** PASOS 2 y 3: Amplify terminó; consultamos el resultado y comparamos. */
  async onLivenessCompletado() {
    this.marcarPaso(1, 'ok');
    this.estado.set('verificando');
    const usuario = this.usuario()!;

    // --- getSessionResults ---
    this.marcarPaso(2, 'en-curso');
    let resultado;
    try {
      resultado = await this.api.obtenerResultado(this.sessionId());
    } catch (error) {
      this.fallar(2, 'No se pudo obtener el resultado de la prueba de vida.', error);
      return;
    }

    const confianza = Number(resultado.confidence) || 0;
    const esPersonaReal =
      resultado.status === 'SUCCEEDED' && confianza >= AWS_CONFIG.confianzaMinimaLiveness;

    if (!esPersonaReal || !resultado.referenceImageBase64) {
      this.fallar(
        2,
        `No se pudo confirmar que es una persona real (confianza ${confianza.toFixed(1)}%).`,
      );
      return;
    }
    this.marcarPaso(2, 'ok', `Persona real · confianza ${confianza.toFixed(1)}%`);

    // --- compareFaces ---
    this.marcarPaso(3, 'en-curso');
    try {
      const comparacion = await this.api.compararRostros(usuario.foto, resultado.referenceImageBase64);
      if (!comparacion.coincide) {
        this.fallar(3, 'El rostro no coincide con la foto registrada.');
        return;
      }
      this.marcarPaso(3, 'ok', `Similitud ${comparacion.similitud}%`);

      // ¡Éxito! Guardamos los datos y vamos a la pantalla de bienvenida.
      this.usuarioService.sesion.set({
        sessionId: this.sessionId(),
        confianzaLiveness: confianza,
        similitud: comparacion.similitud,
        fotoLiveness: resultado.referenceImageBase64,
        fecha: new Date().toISOString(),
      });
      setTimeout(() => this.navCtrl.navigateRoot('/bienvenida'), 800);
    } catch (error) {
      this.fallar(3, 'No se pudo comparar los rostros.', error);
    }
  }

  onLivenessCancelado() {
    this.reiniciar();
  }

  onLivenessFallo(mensaje: string) {
    this.fallar(1, `La prueba de vida falló: ${mensaje}`);
  }

  private marcarPaso(indice: number, estado: Paso['estado'], detalle?: string) {
    this.pasos.update(pasos =>
      pasos.map((p, i) => (i === indice ? { ...p, estado, detalle: detalle ?? p.detalle } : p)),
    );
  }

  private fallar(indice: number, mensaje: string, error?: unknown) {
    if (error) console.error(mensaje, error);
    this.marcarPaso(indice, 'fallo');
    this.mensajeError.set(mensaje);
    this.estado.set('error');
  }
}
