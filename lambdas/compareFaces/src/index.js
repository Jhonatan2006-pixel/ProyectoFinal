const { compareFaces } = require('./services/rekognition');
const { buildResponse, parseBody, isPreflight } = require('./utils/response');

// Lambda 3: compara dos rostros.
// Request:  POST { "sourceImage": "<base64 foto de perfil>", "targetImage": "<base64 foto de la prueba de vida>" }
// Response: { "coincide": true, "similitud": 99.5 }
exports.handler = async (event) => {
    if (isPreflight(event)) return buildResponse(200, { message: 'Preflight check' });

    let body;
    try {
        body = parseBody(event);
    } catch (error) {
        return buildResponse(400, { message: 'El body no es un JSON válido' });
    }

    const { sourceImage, targetImage } = body;
    if (!sourceImage || !targetImage) {
        return buildResponse(400, { message: 'Se requieren las dos fotos para comparar' });
    }

    try {
        const resultado = await compareFaces(sourceImage, targetImage);
        console.log('Resultado:', resultado);
        return buildResponse(200, resultado);
    } catch (error) {
        console.log('Error:', error);
        // Rekognition responde InvalidParameterException cuando no encuentra un rostro.
        if (error.name === 'InvalidParameterException') {
            return buildResponse(400, { message: 'No se detectó un rostro en alguna de las fotos' });
        }
        return buildResponse(500, { message: 'Error al comparar los rostros' });
    }
};
