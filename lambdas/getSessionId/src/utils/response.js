// Encabezados que acompañan TODAS las respuestas.
// Los Access-Control-* (CORS) permiten que la app (que corre en un WebView
// con origen https://localhost) pueda llamar a la Lambda sin que el
// navegador bloquee la respuesta.
const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Arma la respuesta en el formato que espera la Function URL:
// { statusCode, headers, body } con el body convertido a texto JSON.
const buildResponse = (statusCode, body) => ({
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body)
});

// Lee el body de la petición HTTP. La Function URL lo entrega como texto
// (y a veces codificado en Base64), así que aquí lo convertimos a objeto.
const parseBody = (event) => {
    if (!event || !event.body) return {};
    const raw = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body;
    return JSON.parse(raw);
};

// Devuelve true si la petición es el "preflight" OPTIONS que manda el
// navegador antes de un POST con JSON.
const isPreflight = (event) =>
    (event?.requestContext?.http?.method || event?.httpMethod) === 'OPTIONS';

module.exports = { buildResponse, parseBody, isPreflight };
