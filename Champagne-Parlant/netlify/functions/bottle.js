// netlify/functions/bottle.js
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

exports.handler = async (event) => {
  // Réponse simple pour tester GET (ex: /fonction/bottle)
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Fonction bottle.js opérationnelle' })
    };
  }

  // Vérifier la clé API DeepSeek
  if (!DEEPSEEK_API_KEY) {
    console.error('❌ Clé DeepSeek manquante');
    return {
      statusCode: 200, // 200 pour que le frontend reçoive une réponse
      body: JSON.stringify({ reply: "🔧 La bouteille n'a pas encore reçu sa clé API. Contactez le propriétaire." })
    };
  }

  try {
    const { messages, language } = JSON.parse(event.body);
    console.log(`📩 Message reçu (${messages.length} échanges, langue ${language})`);

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 250
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ DeepSeek error ${response.status}: ${errorText}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: `🍾 Je suis désolé, je n'arrive pas à penser clairement. (Erreur ${response.status})` })
      };
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    console.log(`✅ Réponse générée (${reply.length} caractères)`);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error(`❌ Erreur fonction bottle.js : ${error.message}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: "🍾 Pardon, un petit bouchon technique. Réessayez dans quelques secondes." })
    };
  }
};
