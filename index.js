// Evento: Responder quando for marcado (Inteligência Artificial - Gemini)
client.on('messageCreate', async message => {
    // Ignora mensagens de outros bots
    if (message.author.bot) return;

    // Verifica se o bot foi mencionado
    if (message.mentions.has(client.user)) {
        
        // Tira a menção da mensagem para enviar só o texto para a IA
        const textoDoUsuario = message.content.replace(`<@${client.user.id}>`, '').trim();
        
        if (textoDoUsuario.length === 0) {
            return message.reply("Opa! Você me marcou, mas não disse nada. O que você quer?");
        }

        // Informa que está pensando
        await message.channel.sendTyping();

        try {
            const apiKey = "AQ.Ab8RN6IE_qzuy3L1dMxS9vbkrz8kULTJX432m4YMMTk7WkvLEg";
            
            // URL oficial da API do Gemini (Google AI Studio) usando o modelo Gemini 1.5 Flash
            const urlDaAPI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`; 

            const respostaDaAPI = await fetch(urlDaAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: textoDoUsuario }]
                    }]
                })
            });

            const dados = await respostaDaAPI.json();
            
            // Busca o texto da resposta dentro da estrutura do Gemini
            let textoDaIA = "Desculpe, deu um erro ao tentar processar a resposta.";
            if (dados.candidates && dados.candidates.length > 0) {
                textoDaIA = dados.candidates[0].content.parts[0].text;
            }
            
            await message.reply(textoDaIA);

        } catch (erro) {
            console.error(erro);
            await message.reply("Eita, meus circuitos deram um curto-circuito tentando falar com o Google Gemini! Tente de novo.");
        }
    }
});

// Mantém o login no final
client.login(process.env.TOKEN);
