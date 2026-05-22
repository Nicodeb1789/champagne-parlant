// netlify/functions/bottle.js
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

exports.handler = async (event) => {
    // Vérification que la clé API est configurée
    if (!DEEPSEEK_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Configuration API manquante' })
        };
    }
    
    try {
        const { messages, language } = JSON.parse(event.body);
        
        // Appel à DeepSeek
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                temperature: 0.7,
                max_tokens: 250,
                stream: false
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'Erreur API DeepSeek');
        }
        
        const reply = data.choices[0].message.content;
        
        return {
            statusCode: 200,
            body: JSON.stringify({ reply })
        };
        
    } catch (error) {
        console.error('Erreur:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};