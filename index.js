const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const express = require('express');

// Servidor web básico para o Render não desligar o bot
const app = express();
app.get('/', (req, res) => res.send('Bot do Emanuel está online!'));
app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor web rodando.');
});

// Configuração do Bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
    {
        name: 'criador',
        description: 'Descubra quem é o criador do bot.',
    },
    {
        name: 'niveldeaura',
        description: 'Mede o seu nível de aura.',
    },
    {
        name: 'eusoulegal',
        description: 'Descubra se você é legal.',
    }
];

client.once('ready', async () => {
    console.log(`Bot logado como ${client.user.tag}!`);
    
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
        console.log('Registrando comandos...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'criador') {
        await interaction.reply('Ah, o criador do bot? Ele é um cara bem legal! Segue ele no youtube? https://www.youtube.com/@Emanuel_Ratao');
    }

    if (interaction.commandName === 'niveldeaura') {
        // Gera um número de 0 a 10.000.000
        const aura = Math.floor(Math.random() * 10000001);
        await interaction.reply(`Analisando, voce tem ${aura}% de aura!`);
    }

    if (interaction.commandName === 'eusoulegal') {
        // 50% de chance para cada resposta
        const isLegal = Math.random() < 0.5;
        if (isLegal) {
            await interaction.reply('Sim, muito!!');
        } else {
            await interaction.reply('Não. KKKKKKKKKKKKKKKKKKKKKKKKKKK!');
        }
    }
});

// Conecta o bot usando o Token que você vai colocar no Render
client.login(process.env.TOKEN);
