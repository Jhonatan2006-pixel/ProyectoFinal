import { Component, inject, signal } from '@angular/core';
import { NavController } from '@ionic/angular/lazy';

import { Usuario, UsuarioService } from '../../services/usuario.service';
import { base64AUrl } from '../../utils/imagen';

/**
 * Pantalla que se muestra cuando el rostro fue reconocido.
 * Muestra la foto registrada junto a la foto de la prueba de vida y los
 * porcentajes que devolvió Rekognition.
 */
@Component({
  selector: 'app-bienvenida',
  templateUrl: 'bienvenida.page.html',
  styleUrls: ['bienvenida.page.scss'],
  standalone: false,
})
export class BienvenidaPage {
  private usuarioService = inject(UsuarioService);
  private navCtrl = inject(NavController);

  readonly usuario = signal<Usuario | null>(null);
  readonly sesion = this.usuarioService.sesion;
  readonly base64AUrl = base64AUrl;

  async ionViewWillEnter() {
    // Si alguien entra aquí sin haber pasado por el login, lo regresamos.
    if (!this.sesion()) {
      this.navCtrl.navigateRoot('/home');
      return;
    }
    this.usuario.set(await this.usuarioService.obtener());
  }

  cerrarSesion() {
    this.usuarioService.sesion.set(null);
    this.navCtrl.navigateRoot('/home');
  }
}
