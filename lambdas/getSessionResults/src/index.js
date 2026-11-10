const { getLivenessResults } = require('./services/rekognition');
const { buildResponse, parseBody, isPreflight } = require('./utils/response');

// Lambda 2: obtiene el resultado de la prueba de vida.
// Request:  POST { "sessionId": "uuid" }
// Response: { "status": "SUCCEEDED", "confidence": 99.1, "referenceImageBase64": "..." }
exports.handler = async (event) => {
    if (isPreflight(event)) return buildResponse(200, { message: 'Preflight check' });

    let body;
    try {
        body = parseBody(event);
    } catch (error) {
        console.error('Error parsing body:', error);
        return buildResponse(400, { message: 'El body no es un JSON válido' });
    }

    if (!body.sessionId) {
        return buildResponse(400, { message: 'Se requiere el sessionId' });
    }

    try {
        const result = await getLivenessResults(body.sessionId);
        console.log('Resultado liveness:', result.status, result.confidence);
        return buildResponse(200, result);
    } catch (error) {
        console.log('Error:', error);
        if (error.name === 'SessionNotFoundException') {
            return buildResponse(404, { message: 'La sesión no existe o ya expiró' });
        }
        return buildResponse(500, { message: 'Error al obtener el resultado' });
    }
};
