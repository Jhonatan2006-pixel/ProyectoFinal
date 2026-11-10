import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Amplify } from 'aws-amplify';

import { AppModule } from './app/app.module';
import { AWS_CONFIG } from './app/config/aws-config';

// Configuramos Amplify ANTES de arrancar Angular.
// Solo usamos el Identity Pool de Cognito con acceso de invitado
// (allowGuestAccess): el usuario no necesita usuario/contraseña de AWS,
// Cognito le entrega credenciales temporales con permiso únicamente para
// iniciar la transmisión de la prueba de vida.
Amplify.configure({
  Auth: {
    Cognito: {
      identityPoolId: AWS_CONFIG.identityPoolId,
      allowGuestAccess: true,
    },
  },
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
