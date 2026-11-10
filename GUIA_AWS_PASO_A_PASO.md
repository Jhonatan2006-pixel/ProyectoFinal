# Guía AWS paso a paso (para hacer en la consola)

**Cómo tomar las capturas:** `Win + Shift + S` → recorta la pantalla → abre la notificación → **Guardar** en
`Desarrollo movil\Capturas proyecto final\` con el nombre indicado (ej. `01-region.png`).
Captura la **pantalla completa del navegador** (que se vea la barra de AWS arriba), no solo un pedacito.

> Si tu consola está en español, los botones dicen lo que pongo entre paréntesis.

Los ZIP de las Lambdas ya están listos en:
- `ProyectoFinal\lambdas\getSessionId\getSessionId.zip`
- `ProyectoFinal\lambdas\getSessionResults\getSessionResults.zip`
- `ProyectoFinal\lambdas\compareFaces\compareFaces.zip`

---

## PASO 1 — Elegir la región

1. Entra a https://console.aws.amazon.com e inicia sesión.
2. Arriba a la derecha, junto a tu nombre, abre el selector de región y elige
   **US East (N. Virginia) us-east-1**.
   *(Face Liveness solo existe en algunas regiones; usamos esta para todo.)*

📸 `01-region.png` → con el menú de regiones abierto y N. Virginia seleccionada.

---

## PASO 2 — Crear el rol de IAM para las Lambdas

Un **rol** es una "identidad" que se le asigna a la Lambda para decir qué puede hacer en AWS.

1. En el buscador de arriba escribe **IAM** y entra.
2. Menú izquierdo → **Roles** → botón **Create role** (Crear rol).
   📸 `02-iam-roles.png`
3. *Trusted entity type*: **AWS service**. *Use case*: **Lambda**. → **Next**.
   📸 `03-rol-caso-uso-lambda.png`
4. En *Add permissions* busca y marca estas 2 políticas:
   - `AWSLambdaBasicExecutionRole` (permite escribir logs en CloudWatch)
   - `AmazonRekognitionFullAccess` (permite usar Rekognition)
   → **Next**.
   📸 `04-rol-permisos.png` (busca una, márcala, busca la otra; toma la captura cuando se vean las 2 en "Selected")
5. *Role name*: `rol-lambdas-reconocimiento-facial` → baja → **Create role**.
   📸 `05-rol-nombre-revision.png` (antes de crear, donde se ve el nombre y las 2 políticas)
   📸 `06-rol-creado.png` (mensaje verde de creado)

---

## PASO 3 — Crear la Lambda `getSessionId`

1. Buscador → **Lambda** → **Create function** (Crear función).
2. Opción **Author from scratch**.
   - *Function name*: `getSessionId`
   - *Runtime*: **Node.js 24.x**
   - *Architecture*: **x86_64**
   - Abre **Change default execution role** → **Use an existing role** → elige `rol-lambdas-reconocimiento-facial`.
   📸 `07-lambda1-crear.png` (que se vea todo el formulario lleno)
3. **Create function**.
4. En la pestaña **Code**, a la derecha: **Upload from** → **.zip file** → **Upload** → elige
   `getSessionId.zip` → **Save**.
   📸 `08-lambda1-subir-zip.png` (la ventanita de subir con el zip elegido)
   📸 `09-lambda1-codigo.png` (el editor mostrando `index.js` y las carpetas `services`, `utils`, `node_modules` a la izquierda)
5. Pestaña **Configuration** → **General configuration** → **Edit**:
   - *Memory*: `256` MB
   - *Timeout*: `0 min 30 sec`
   → **Save**.
   📸 `10-lambda1-config-general.png`
6. Pestaña **Configuration** → **Function URL** (menú izquierdo) → **Create function URL**:
   - *Auth type*: **NONE**
   - **NO** marques *Configure cross-origin resource sharing (CORS)* (el código ya maneja CORS)
   → **Save**.
   📸 `11-lambda1-function-url-crear.png` (el formulario antes de guardar)
   📸 `12-lambda1-function-url-lista.png` (ya creada, que se vea la URL `https://....lambda-url.us-east-1.on.aws/`)
7. Copia esa URL a un bloc de notas: **URL 1 (getSessionId)**.

---

## PASO 4 — Crear la Lambda `getSessionResults`

Exactamente igual que el Paso 3, pero:
- *Function name*: `getSessionResults`
- ZIP: `getSessionResults.zip`

📸 `13-lambda2-crear.png`, `14-lambda2-codigo.png`, `15-lambda2-config-general.png`, `16-lambda2-function-url.png`

Copia la URL: **URL 2 (getSessionResults)**.

---

## PASO 5 — Crear la Lambda `compareFaces`

Igual que el Paso 3, pero:
- *Function name*: `compareFaces`
- ZIP: `compareFaces.zip`

📸 `17-lambda3-crear.png`, `18-lambda3-codigo.png`, `19-lambda3-config-general.png`, `20-lambda3-function-url.png`

Copia la URL: **URL 3 (compareFaces)**.

📸 `21-lambdas-lista.png` → ve a **Lambda → Functions** y captura la lista donde salen las 3 funciones.

---

## PASO 6 — Crear el Identity Pool de Cognito

El componente de prueba de vida (Amplify) envía el video **directamente desde el teléfono** a Rekognition.
Para eso el teléfono necesita credenciales temporales de AWS → las da **Cognito Identity Pool** como "invitado".

1. Buscador → **Cognito** → menú izquierdo **Identity pools** → **Create identity pool**.
   📸 `22-cognito-identity-pools.png`
2. *Configure identity pool trust*: en **User access** marca **Guest access** (Acceso de invitado). → **Next**.
   📸 `23-cognito-guest-access.png`
3. *Configure permissions* → *Guest role*: **Create a new IAM role** → nombre:
   `rol-cognito-invitado-liveness` → **Next**.
   📸 `24-cognito-rol-invitado.png`
4. *Configure properties* → *Identity pool name*: `liveness-identity-pool`. Deja lo demás igual → **Next**.
   📸 `25-cognito-nombre.png`
5. *Review and create* → **Create identity pool**.
   📸 `26-cognito-creado.png` → que se vea el **Identity pool ID** (`us-east-1:xxxxxxxx-xxxx-...`).
6. Copia el **Identity pool ID** al bloc de notas.

---

## PASO 7 — Darle permiso de Liveness al rol de invitado

1. Ve a **IAM → Roles** → busca y abre `rol-cognito-invitado-liveness`.
   📸 `27-rol-invitado.png`
2. **Add permissions** → **Create inline policy** → pestaña **JSON** → borra todo y pega:

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
3. **Next** → *Policy name*: `permiso-start-face-liveness` → **Create policy**.
   📸 `29-politica-creada.png` (el rol mostrando la política en la lista de permisos)

---

## PASO 8 — Mandarme los datos

Pégame en el chat:
- URL 1 (getSessionId)
- URL 2 (getSessionResults)
- URL 3 (compareFaces)
- Identity pool ID

Con eso yo configuro la app, pruebo las 3 URLs y genero el APK.
