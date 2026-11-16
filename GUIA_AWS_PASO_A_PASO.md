# Guía AWS paso a paso (para hacer en la consola)

**Cómo tomar las capturas:** `Win + Shift + S` → recorta la pantalla → abre la notificación → **Guardar** en
`Desarrollo movil\Capturas proyecto final\` con el nombre indicado (ej. `01-region.png`).
Captura la **pantalla completa del navegador** (que se vea la barra negra de AWS arriba), no solo un pedacito.

> Los botones están escritos como aparecen en la consola **en español**; entre paréntesis va el nombre en inglés
> por si alguno aparece así.

Los ZIP de las Lambdas ya están listos en:
- `ProyectoFinal\lambdas\getSessionId\getSessionId.zip`
- `ProyectoFinal\lambdas\getSessionResults\getSessionResults.zip`
- `ProyectoFinal\lambdas\compareFaces\compareFaces.zip`

---

## PASO 0 — Preparar la cuenta nueva (solo una vez)

### 0.1 Proteger la cuenta con MFA (verificación en dos pasos)
La cuenta con la que te registraste es el **usuario raíz**: puede hacer TODO, incluso borrar la cuenta.
Por eso se protege con un segundo factor (un código en el celular).

1. Instala en tu celular **Google Authenticator** o **Microsoft Authenticator**.
2. En la consola, arriba a la derecha, clic en el nombre de tu cuenta → **Credenciales de seguridad** (Security credentials).
3. Sección **Autenticación multifactor (MFA)** → **Asignar dispositivo MFA** (Assign MFA device).
4. Nombre: `celular-jhonatan` → tipo **Aplicación de autenticación** (Authenticator app) → **Siguiente**.
5. **Mostrar código QR** → escanéalo con la app → escribe **dos códigos seguidos** que te dé la app → **Agregar MFA**.
   📸 `00a-mfa-activado.png` (la lista de MFA mostrando tu dispositivo)

### 0.2 Alerta de gastos (para que nunca te cobren sin saberlo)
1. Buscador de arriba → **Billing and Cost Management** (Administración de facturación y costos).
2. Menú izquierdo → **Presupuestos** (Budgets) → **Crear presupuesto** (Create budget).
3. Elige **Usar una plantilla (simplificado)** → plantilla **Presupuesto de costos mensual** (Monthly cost budget).
4. *Nombre*: `alerta-proyecto-final` · *Importe presupuestado*: `5` USD · *Correo*: tu correo → **Crear presupuesto**.
   📸 `00b-presupuesto-creado.png`

### 0.3 Ver tus créditos y tu plan
1. En **Administración de facturación y costos** → menú izquierdo → **Créditos**.
   📸 `00c-creditos.png` (que se vea el saldo de créditos)

> Las cuentas nuevas empiezan en el **Plan gratuito** con créditos. Para este proyecto alcanza de sobra
> (todo cuesta centavos). Si en algún paso AWS dice que un servicio "no está disponible en el plan gratuito",
> mándame la captura y vemos si hay que actualizar el plan.

---

## PASO 1 — Elegir la región

1. Arriba a la derecha, junto a tu nombre, abre el selector de región y elige
   **EE. UU. Este (Norte de Virginia) us-east-1**.
   *(Face Liveness solo existe en algunas regiones; usamos esta para TODO el proyecto.)*

📸 `01-region.png` → con el menú de regiones abierto y Norte de Virginia seleccionada.

> ⚠️ Revisa que siga diciendo **Norte de Virginia** cada vez que entres a Lambda o Cognito.

---

## PASO 2 — Crear el rol de IAM para las Lambdas

Un **rol** es una "identidad" que se le asigna a la Lambda para decir qué puede hacer en AWS.

1. En el buscador de arriba escribe **IAM** y entra.
2. Menú izquierdo → **Roles** → botón **Crear rol** (Create role).
   📸 `02-iam-roles.png`
3. *Tipo de entidad de confianza*: **Servicio de AWS**. *Caso de uso*: **Lambda**. → **Siguiente**.
   📸 `03-rol-caso-uso-lambda.png`
4. En *Agregar permisos* busca y marca estas 2 políticas:
   - `AWSLambdaBasicExecutionRole` (permite escribir logs en CloudWatch)
   - `AmazonRekognitionFullAccess` (permite usar Rekognition)
   → **Siguiente**.
   📸 `04-rol-permisos.png` (toma la captura cuando ya estén las 2 marcadas)
5. *Nombre del rol*: `rol-lambdas-reconocimiento-facial` → baja → **Crear rol**.
   📸 `05-rol-nombre-revision.png` (antes de crear: que se vea el nombre y las 2 políticas)
   📸 `06-rol-creado.png` (mensaje verde de creado)

---

## PASO 3 — Crear la Lambda `getSessionId`

1. Buscador → **Lambda** → **Crear una función** (Create function).
2. Opción **Crear desde cero** (Author from scratch).
   - *Nombre de la función*: `getSessionId`
   - *Tiempo de ejecución* (Runtime): **Node.js 24.x**
   - *Arquitectura*: **x86_64**
   - Abre **Cambiar el rol de ejecución predeterminado** → **Usar un rol existente** → elige `rol-lambdas-reconocimiento-facial`.
   📸 `07-lambda1-crear.png` (que se vea todo el formulario lleno)
3. **Crear una función**.
4. En la pestaña **Código**, a la derecha: **Cargar desde** (Upload from) → **archivo .zip** → **Cargar** → elige
   `getSessionId.zip` → **Guardar**.
   📸 `08-lambda1-subir-zip.png` (la ventanita de subir con el zip elegido)
   📸 `09-lambda1-codigo.png` (el editor mostrando `index.js` y las carpetas `services`, `utils`, `node_modules` a la izquierda)
5. Pestaña **Configuración** → **Configuración general** → **Editar**:
   - *Memoria*: `256` MB
   - *Tiempo de espera* (Timeout): `0 min 30 s`
   → **Guardar**.
   📸 `10-lambda1-config-general.png`
6. Pestaña **Configuración** → **URL de la función** (Function URL, menú izquierdo) → **Crear URL de función**:
   - *Tipo de autenticación*: **NONE**
   - **NO** marques *Configurar el uso compartido de recursos entre orígenes (CORS)* (el código ya maneja CORS)
   → **Guardar**.
   📸 `11-lambda1-function-url-crear.png` (el formulario antes de guardar)
   📸 `12-lambda1-function-url-lista.png` (ya creada, que se vea la URL `https://....lambda-url.us-east-1.on.aws/`)
7. Copia esa URL a un bloc de notas: **URL 1 (getSessionId)**.

---

## PASO 4 — Crear la Lambda `getSessionResults`

Exactamente igual que el Paso 3, pero:
- *Nombre de la función*: `getSessionResults`
- ZIP: `getSessionResults.zip`

📸 `13-lambda2-crear.png`, `14-lambda2-codigo.png`, `15-lambda2-config-general.png`, `16-lambda2-function-url.png`

Copia la URL: **URL 2 (getSessionResults)**.

---

## PASO 5 — Crear la Lambda `compareFaces`

Igual que el Paso 3, pero:
- *Nombre de la función*: `compareFaces`
- ZIP: `compareFaces.zip`

📸 `17-lambda3-crear.png`, `18-lambda3-codigo.png`, `19-lambda3-config-general.png`, `20-lambda3-function-url.png`

Copia la URL: **URL 3 (compareFaces)**.

📸 `21-lambdas-lista.png` → ve a **Lambda → Funciones** y captura la lista donde salen las 3 funciones.

---

## PASO 6 — Crear el grupo de identidades de Cognito (Identity Pool)

El componente de prueba de vida (Amplify) envía el video **directamente desde el teléfono** a Rekognition.
Para eso el teléfono necesita credenciales temporales de AWS → las da **Cognito** como "invitado".

1. Buscador → **Cognito** → menú izquierdo **Grupos de identidades** (Identity pools) → **Crear grupo de identidades**.
   📸 `22-cognito-identity-pools.png`
2. *Configurar la confianza*: en **Acceso de usuario** marca **Acceso de invitado** (Guest access). → **Siguiente**.
   📸 `23-cognito-guest-access.png`
3. *Configurar permisos* → *Rol de invitado*: **Crear un nuevo rol de IAM** → nombre:
   `rol-cognito-invitado-liveness` → **Siguiente**.
   📸 `24-cognito-rol-invitado.png`
4. *Configurar propiedades* → *Nombre del grupo de identidades*: `liveness-identity-pool`. Deja lo demás igual → **Siguiente**.
   📸 `25-cognito-nombre.png`
5. *Revisar y crear* → **Crear grupo de identidades**.
   📸 `26-cognito-creado.png` → que se vea el **ID del grupo de identidades** (`us-east-1:xxxxxxxx-xxxx-...`).
6. Copia ese ID al bloc de notas.

---

## PASO 7 — Darle permiso de Liveness al rol de invitado

1. Ve a **IAM → Roles** → busca y abre `rol-cognito-invitado-liveness`.
   📸 `27-rol-invitado.png`
2. **Agregar permisos** → **Crear política insertada** (Create inline policy) → pestaña **JSON** → borra todo y pega:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "rekognition:StartFaceLivenessSession",
      "Resource": "*"
    }
  ]
}
```
   📸 `28-politica-json.png`
3. **Siguiente** → *Nombre de la política*: `permiso-start-face-liveness` → **Crear política**.
   📸 `29-politica-creada.png` (el rol mostrando la política en la lista de permisos)

---

## PASO 8 — Mandarme los datos

Pégame en el chat:
- URL 1 (getSessionId)
- URL 2 (getSessionResults)
- URL 3 (compareFaces)
- ID del grupo de identidades

Con eso yo configuro la app, pruebo las 3 URLs y genero el APK.
