import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild, ViewEncapsulation,
} from '@angular/core';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';

import { AWS_CONFIG } from '../../config/aws-config';
import { TEXTOS_LIVENESS_ES } from './textos-liveness-es';

/**
 * Componente Angular que "envuelve" al componente FaceLivenessDetector de
 * AWS Amplify.
 *
 * ¿Por qué hay React dentro de Angular? Amazon solo publica el componente
 * de prueba de vida para React. React puede dibujarse dentro de cualquier
 * elemento HTML, así que creamos un <div> en Angular y le pedimos a React
 * que dibuje ahí el FaceLivenessDetector. Para el resto de la app esto es
 * un componente Angular normal con @Input y @Output.
 */
@Component({
  selector: 'app-liveness',
  standalone: true,
  template: `<div #contenedor class="liveness-contenedor"></div>`,
  styles: [`.liveness-contenedor { width: 100%; }`],
  encapsulation: ViewEncapsulation.None,
})
export class LivenessComponent implements AfterViewInit, OnDestroy {
  /** sessionId que devolvió la Lambda getSessionId. */
  @Input({ required: true }) sessionId!: string;

  /** Se emite cuando el video ya se envió y Rekognition terminó de analizarlo. */
  @Output() completado = new EventEmitter<void>();
  /** Se emite si el usuario presiona "Cancelar". */
  @Output() cancelado = new EventEmitter<void>();
  /** Se emite si ocurre un error (cámara, conexión, tiempo agotado...). */
  @Output() fallo = new EventEmitter<string>();

  @ViewChild('contenedor', { static: true }) contenedor!: ElementRef<HTMLDivElement>;

  private root?: Root;

  ngAfterViewInit(): void {
    // 1. React toma control del <div>.
    this.root = createRoot(this.contenedor.nativeElement);

    // 2. Dibujamos el FaceLivenessDetector con sus propiedades.
    this.root.render(
      createElement(FaceLivenessDetector, {
        sessionId: this.sessionId,
        region: AWS_CONFIG.region,
        displayText: TEXTOS_LIVENESS_ES,
        onAnalysisComplete: async () => this.completado.emit(),
        onUserCancel: () => this.cancelado.emit(),
        onError: (error) => {
          console.error('Error de liveness', error);
          this.fallo.emit(error.error?.message || String(error.state));
        },
      }),
    );
  }

  ngOnDestroy(): void {
    // Al salir de la pantalla, React libera la cámara y el componente.
    this.root?.unmount();
  }
}
