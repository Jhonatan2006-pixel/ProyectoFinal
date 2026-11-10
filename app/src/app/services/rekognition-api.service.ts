import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { AWS_CONFIG } from '../config/aws-config';

/** Respuesta de la Lambda getSessionResults. */
export interface ResultadoLiveness {
  status: string;               // SUCCEEDED, FAILED, EXPIRED...
  confidence: number;           // 0 a 100
  referenceImageBase64: string | null;
}

/** Respuesta de la Lambda compareFaces. */
export interface ResultadoComparacion {
  coincide: boolean;
  similitud: number;            // 0 a 100
}

/**
 * Servicio que se comunica con las 3 Lambdas de AWS por HTTPS (POST).
 */
@Injectable({ providedIn: 'root' })
export class RekognitionApiService {
  private http = inject(HttpClient);

  /** Lambda 1: crea una sesión de prueba de vida y devuelve su sessionId. */
  async crearSesion(): Promise<string> {
    const respuesta = await firstValueFrom(
      this.http.post<{ sessionId: string }>(AWS_CONFIG.lambdas.getSessionId, {}),
    );
    return respuesta.sessionId;
  }

  /** Lambda 2: consulta el resultado de la prueba de vida. */
  obtenerResultado(sessionId: string): Promise<ResultadoLiveness> {
    return firstValueFrom(
      this.http.post<ResultadoLiveness>(AWS_CONFIG.lambdas.getSessionResults, { sessionId }),
    );
  }

  /** Lambda 3: compara la foto de perfil (source) con la de la prueba de vida (target). */
  compararRostros(sourceImage: string, targetImage: string): Promise<ResultadoComparacion> {
    return firstValueFrom(
      this.http.post<ResultadoComparacion>(AWS_CONFIG.lambdas.compareFaces, { sourceImage, targetImage }),
    );
  }
}
