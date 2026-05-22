// netlify/functions/elevenlabs.js
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

exports.handler = async (event) => {
    if (!ELEVENLABS_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Clé ElevenLabs manquante' })
        };
    }
    
    try {
        const { text, voiceId } = JSON.parse(event.body);
        
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`ElevenLabs error: ${response.status}`);
        }
        
        const audioBuffer = await response.arrayBuffer();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Access-Control-Allow-Origin': '*'
            },
            body: Buffer.from(audioBuffer).toString('base64'),
            isBase64Encoded: true
        };
        
    } catch (error) {
        console.error('ElevenLabs error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};