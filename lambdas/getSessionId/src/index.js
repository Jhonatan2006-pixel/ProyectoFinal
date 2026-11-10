const { createLivenessSession } = require('./services/rekognition');
const { buildResponse, isPreflight } = require('./utils/response');

// Lambda 1: crea la sesión de Face Liveness.
// Request:  POST (sin body)
// Response: { "sessionId": "uuid" }
exports.handler = async (event) => {
    if (isPreflight(event)) return buildResponse(200, { message: 'Preflight check' });

    try {
        const sessionId = await createLivenessSession();
        console.log('SessionId:', sessionId);
        return buildResponse(200, { sessionId });
    } catch (error) {
        console.log('Error:', error);
        return buildResponse(500, { message: 'Error al obtener el sessionId' });
    }
};
