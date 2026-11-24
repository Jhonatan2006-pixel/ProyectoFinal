# FaceAuth Davinci: inicio de sesión con reconocimiento facial

Proyecto final del curso **Desarrollo Móvil**, Universidad Da Vinci de Guatemala, Campus Central Huehuetenango.

- **Estudiante:** Jhónatan Josué Méndez Velásquez · Carnet 202401982
- **Ingeniero:** Rigoberto González Arizandieta

FaceAuth Davinci es una aplicación móvil **híbrida** (Ionic + Angular + Capacitor) para iniciar sesión solo con el rostro, sin contraseña. La app comprueba dos cosas:

1. **Que es una persona real**, no una foto ni un video. Para eso usa la prueba de vida *Amazon Rekognition Face Liveness*.
2. **Que es la misma persona que se registró.** Para eso usa *Amazon Rekognition CompareFaces*.

## Estructura del repositorio

```
ProyectoFinal/
├── app/        FRONTEND: aplicación móvil híbrida (Ionic 9 + Angular 22 + Capacitor 8)
│   ├── src/        código de la aplicación
│   └── android/    proyecto Android generado por Capacitor (de aquí sale el APK)
│
└── lambdas/    BACKEND: 3 funciones AWS Lambda (Node.js 24.x) que usan Amazon Rekognition
    ├── getSessionId/        crea la sesión de prueba de vida
    ├── getSessionResults/   devuelve el resultado: ¿persona real? + foto de referencia
    └── compareFaces/        compara la foto registrada con la de la prueba de vida
```

## Backend (serverless en AWS)

El backend del proyecto es la carpeta `lambdas/`. No hay un servidor tradicional, como Express, que deba estar encendido. Cada función corre en **AWS Lambda** solo cuando la aplicación la llama, por medio de una **Function URL** HTTPS. Esta forma de trabajar se llama *serverless*.

| Lambda | URL (método POST) | Recibe | Devuelve |
|---|---|---|---|
| getSessionId | https://35sk5prnnc5tnaqavixq2zhdc40kybed.lambda-url.us-east-1.on.aws/ | nada | `{ "sessionId": "..." }` |
| getSessionResults | https://hqsfj2tcmazhcugomxqrkxfa6i0klpyb.lambda-url.us-east-1.on.aws/ | `{ "sessionId": "..." }` | `{ "status", "confidence", "referenceImageBase64" }` |
| compareFaces | https://tqy3lspw56qtfovx43p3mtjlfa0wvyog.lambda-url.us-east-1.on.aws/ | `{ "sourceImage", "targetImage" }` (Base64) | `{ "coincide", "similitud" }` |

Ejemplo de prueba:

```bash
curl -X POST https://35sk5prnnc5tnaqavixq2zhdc40kybed.lambda-url.us-east-1.on.aws/ \
     -H "Content-Type: application/json" -d "{}"
```

Otros servicios de AWS que usa el proyecto (región `us-east-1`):

- **IAM:** el rol `rol-lambdas-reconocimiento-facial` da a las Lambdas permiso para usar Rekognition y escribir logs.
- **Amazon Cognito Identity Pool:** el grupo `liveness-identity-pool` da al celular credenciales temporales de invitado. Ese rol solo tiene el permiso `rekognition:StartFaceLivenessSession`, para enviar el video de la prueba de vida.

### Desplegar una Lambda

```bash
cd lambdas/getSessionId/src
npm install
# Comprimir el CONTENIDO de src (index.js, services, utils, node_modules) en un .zip
# y subirlo en la consola de Lambda: Código fuente → Actualizar → Archivo .zip
```

## Frontend (aplicación móvil)

| Archivo | Qué hace |
|---|---|
| `src/app/config/aws-config.ts` | Región, ID del Identity Pool y las 3 URLs de las Lambdas |
| `src/main.ts` | Configura AWS Amplify con Cognito (acceso de invitado) |
| `src/app/services/rekognition-api.service.ts` | Llamadas HTTP a las 3 Lambdas |
| `src/app/services/usuario.service.ts` | Guarda el nombre y la foto del registro en el celular |
| `src/app/components/liveness/` | Prueba de vida: el `FaceLivenessDetector` de Amplify (React) dentro de Angular |
| `src/app/pages/registro/` | Foto de registro con la cámara frontal (`@capacitor/camera`) |
| `src/app/pages/login/` | Flujo completo: getSessionId → prueba de vida → getSessionResults → compareFaces |
| `src/app/pages/bienvenida/` | Acceso concedido: ambas fotos, confianza y similitud |

### Ejecutar y compilar

```bash
cd app
npm install
npm start                    # versión web en el navegador (sin cámara real)

npm run build                # compila a www/
npx cap sync android         # copia www/ al proyecto Android
cd android
./gradlew assembleDebug      # APK de prueba
./gradlew assembleRelease    # APK firmado (necesita android/keystore.properties, que no se sube)
```

> La ruta del proyecto tiene una "ó", así que `android/gradle.properties` incluye `android.overridePathCheck=true`. Gradle 8.14 necesita Java 21.

## Flujo del inicio de sesión

1. **Registro:** el usuario se toma una foto, que se guarda en el celular.
2. **getSessionId:** se crea una sesión de prueba de vida.
3. **Prueba de vida:** el óvalo con luces de colores envía el video directo a Rekognition.
4. **getSessionResults:** se pide el resultado. Se exige `SUCCEEDED` y una confianza de al menos 80 %.
5. **compareFaces:** se compara con la foto del registro. Se exige una similitud de al menos 85 %.
6. **Bienvenida:** acceso concedido.
