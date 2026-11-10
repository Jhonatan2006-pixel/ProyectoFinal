/**
 * Configuración de AWS usada por toda la aplicación.
 *
 * - region: región donde están las Lambdas y donde corre Face Liveness.
 * - identityPoolId: Identity Pool de Amazon Cognito. Le da al celular
 *   credenciales temporales (como "invitado") para que el componente de
 *   Amplify pueda enviar el video de la prueba de vida a Rekognition.
 * - lambdas: las 3 URLs HTTPS (Function URL) de las Lambdas.
 */
export const AWS_CONFIG = {
  region: 'us-east-1',
  identityPoolId: 'us-east-1:REEMPLAZAR-CON-TU-IDENTITY-POOL-ID',
  lambdas: {
    getSessionId: 'https://REEMPLAZAR.lambda-url.us-east-1.on.aws/',
    getSessionResults: 'https://REEMPLAZAR.lambda-url.us-east-1.on.aws/',
    compareFaces: 'https://REEMPLAZAR.lambda-url.us-east-1.on.aws/',
  },
  /** Confianza mínima (0-100) para aceptar que es una persona real. */
  confianzaMinimaLiveness: 80,
};
