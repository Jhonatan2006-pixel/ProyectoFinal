const { RekognitionClient, CreateFaceLivenessSessionCommand } = require('@aws-sdk/client-rekognition');

// Face Liveness está disponible en us-east-1 (Norte de Virginia).
// El cliente se crea una sola vez y se reutiliza entre invocaciones.
const rekognitionClient = new RekognitionClient({ region: 'us-east-1' });

// Crea una sesión nueva de prueba de vida y devuelve su identificador (UUID).
const createLivenessSession = async () => {
    const command = new CreateFaceLivenessSessionCommand({});
    const response = await rekognitionClient.send(command);
    return response.SessionId;
};

module.exports = { createLivenessSession };
