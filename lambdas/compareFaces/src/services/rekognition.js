const { RekognitionClient, CompareFacesCommand } = require('@aws-sdk/client-rekognition');

const rekognitionClient = new RekognitionClient({ region: 'us-east-1' });

// Porcentaje mínimo de parecido para considerar que es la misma persona.
const SIMILITUD_MINIMA = 85;

// Compara dos fotos (en Base64) y dice si son la misma persona.
const compareFaces = async (sourceImage, targetImage) => {
    const command = new CompareFacesCommand({
        SourceImage: { Bytes: Buffer.from(sourceImage, 'base64') },
        TargetImage: { Bytes: Buffer.from(targetImage, 'base64') },
        SimilarityThreshold: SIMILITUD_MINIMA
    });
    const response = await rekognitionClient.send(command);

    // FaceMatches solo trae los rostros que superaron la similitud mínima.
    const mejor = (response.FaceMatches || [])[0];

    return {
        coincide: !!mejor,
        similitud: mejor ? Number(mejor.Similarity.toFixed(2)) : 0
    };
};

module.exports = { compareFaces };
