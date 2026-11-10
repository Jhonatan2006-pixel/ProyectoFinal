import { Component, inject, signal } from '@angular/core';
import { AlertController } from '@ionic/angular/lazy';

import { Usuario, UsuarioService } from '../services/usuario.service';
import { base64AUrl } from '../utils/imagen';

/**
 * Pantalla de inicio.
 * - Si no hay usuario registrado: invita a registrarse.
 * - Si lo hay: muestra su foto y el botón para iniciar sesión con el rostro.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  private usuarioService = inject(UsuarioService);
  private alertCtrl = inject(AlertController);

  readonly usuario = signal<Usuario | null>(null);
  readonly cargando = signal(true);
  readonly base64AUrl = base64AUrl;

  // Ionic llama a este método cada vez que la pantalla se va a mostrar.
  async ionViewWillEnter() {
    this.usuario.set(await this.usuarioService.obtener());
    this.cargando.set(false);
  }

  async eliminarRegistro() {
    const alerta = await this.alertCtrl.create({
      header: 'Eliminar registro',
      message: '¿Seguro que desea borrar su foto de perfil de este teléfono?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.usuarioService.eliminar();
            this.usuario.set(null);
          },
        },
      ],
    });
    await alerta.present();
  }
}
