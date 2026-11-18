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
  identityPoolId: 'us-east-1:da8af38e-bc31-435f-9bde-0cc8b3ef7125',
  lambdas: {
    getSessionId: 'https://35sk5prnnc5tnaqavixq2zhdc40kybed.lambda-url.us-east-1.on.aws/',
    getSessionResults: 'https://hqsfj2tcmazhcugomxqrkxfa6i0klpyb.lambda-url.us-east-1.on.aws/',
    compareFaces: 'https://tqy3lspw56qtfovx43p3mtjlfa0wvyog.lambda-url.us-east-1.on.aws/',
  },
  /** Confianza mínima (0-100) para aceptar que es una persona real. */
  confianzaMinimaLiveness: 80,
};
