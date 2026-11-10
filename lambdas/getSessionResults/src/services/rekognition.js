const { RekognitionClient, GetFaceLivenessSessionResultsCommand } = require('@aws-sdk/client-rekognition');

const rekognitionClient = new RekognitionClient({ region: 'us-east-1' });

// Consulta el resultado de una sesión de prueba de vida.
// Devuelve: estado (SUCCEEDED, FAILED, EXPIRED...), confianza (0-100)
// y la imagen de referencia (la mejor foto del rostro) en Base64.
const getLivenessResults = async (sessionId) => {
    const command = new GetFaceLivenessSessionResultsCommand({ SessionId: sessionId });
    const response = await rekognitionClient.send(command);

    const referenceImageBytes = response.ReferenceImage?.Bytes ?? null;

    return {
        status: response.Status ?? 'DESCONOCIDO',
        confidence: response.Confidence ?? 0,
        referenceImageBase64: referenceImageBytes
            ? Buffer.from(referenceImageBytes).toString('base64')
            : null
    };
};

module.exports = { getLivenessResults };
