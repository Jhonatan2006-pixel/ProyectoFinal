import { Component, inject, signal } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular/lazy';
import { Camera, CameraDirection } from '@capacitor/camera';

import { UsuarioService } from '../../services/usuario.service';
import { base64AUrl, fotoABase64 } from '../../utils/imagen';

/**
 * Registro del usuario: nombre + foto de perfil tomada con la cámara frontal.
 * Esta foto es la que después se compara con la de la prueba de vida.
 */
@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  standalone: false,
})
export class RegistroPage {
  private usuarioService = inject(UsuarioService);
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);

  nombre = '';
  readonly foto = signal<string | null>(null);   // Base64 de la foto
  readonly guardando = signal(false);
  readonly base64AUrl = base64AUrl;

  /** Abre la cámara del teléfono (plugin @capacitor/camera). */
  async tomarFoto() {
    try {
      const resultado = await Camera.takePhoto({
        cameraDirection: CameraDirection.Front,
        quality: 85,
        correctOrientation: true,
      });
      if (!resultado.webPath) return;
      this.foto.set(await fotoABase64(resultado.webPath));
    } catch (error) {
      // El usuario cerró la cámara sin tomar la foto.
      console.log('Cámara cancelada', error);
    }
  }

  async guardar() {
    const foto = this.foto();
    if (!this.nombre.trim() || !foto) {
      this.mostrarMensaje('Escriba su nombre y tome una foto.', 'warning');
      return;
    }
    this.guardando.set(true);
    await this.usuarioService.guardar(this.nombre.trim(), foto);
    this.guardando.set(false);
    this.mostrarMensaje('¡Registro guardado!', 'success');
    this.navCtrl.navigateRoot('/home');
  }

  private async mostrarMensaje(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, color, duration: 2000, position: 'top' });
    await toast.present();
  }
}
