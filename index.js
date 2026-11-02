const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const express = require('express');

// Servidor web para o Render manter online 24h
const app = express();
app.get('/', (req, res) => res.send('Bot do Emanuel está online!'));
app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor web rodando.');
});

// Configuração do Bot
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

// Lista de Comandos
const commands = [
    { name: 'criador', description: 'Descubra quem é o criador do bot.' },
    { name: 'niveldeaura', description: 'Mede o seu nível de aura.' },
    { name: 'eusoulegal', description: 'Descubra se você é legal.' },
    {
        name: 'limpar',
        description: 'Limpa mensagens do chat (Apenas Admins).',
        options: [{ name: 'quantidade', type: 4, description: 'Quantidade de mensagens (1 a 100)', required: true }],
    },
    {
        name: 'banir',
        description: 'Bane um membro infrator (Apenas Admins).',
        options: [
            { name: 'usuario', type: 6, description: 'Usuário a ser banido', required: true },
            { name: 'motivo', type: 3, description: 'Motivo do banimento', required: false }
        ],
    },
    {
        name: 'embed',
        description: 'Cria uma mensagem bonita em formato de Embed.',
        options: [
            { name: 'titulo', type: 3, description: 'Título do Embed', required: true },
            { name: 'descricao', type: 3, description: 'Texto do Embed', required: true },
            { name: 'cor', type: 3, description: 'Cor em HEX (Ex: #FF0000 para vermelho)', required: false }
        ],
    }
];

client.once('ready', async () => {
    console.log(`Bot logado como ${client.user.tag}!`);
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
        console.log('Registrando comandos...');
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
});

// Evento: Responder aos Comandos /
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName, options } = interaction;

    if (commandName === 'criador') {
        await interaction.reply('Ah, o criador do bot? Ele é um cara bem legal! Segue ele no youtube? https://www.youtube.com/@Emanuel_Ratao');
    }

    if (commandName === 'niveldeaura') {
        const aura = Math.floor(Math.random() * 10000001);
        await interaction.reply(`Analisando, você tem ${aura}% de aura!`);
    }

    if (commandName === 'eusoulegal') {
        const isLegal = Math.random() < 0.5;
        if (isLegal) {
            await interaction.reply('Sim, muito!!');
        } else {
            await interaction.reply('Não. KKKKKKKKKKKKKKKKKKKKKKKKKKK!');
        }
    }

    if (commandName === 'limpar') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: 'Você não tem permissão para apagar mensagens!', ephemeral: true });
        }
        const quantidade = options.getInteger('quantidade');
        if (quantidade < 1 || quantidade > 100) {
            return interaction.reply({ content: 'Escolha um número entre 1 e 100.', ephemeral: true });
        }
        await interaction.channel.bulkDelete(quantidade, true);
        await interaction.reply({ content: `Foram apagadas ${quantidade} mensagens!`, ephemeral: true });
    }

    if (commandName === 'banir') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: 'Você não tem permissão para banir!', ephemeral: true });
        }
        const usuario = options.getUser('usuario');
        const motivo = options.getString('motivo') || 'Nenhum motivo informado.';
        const membro = await interaction.guild.members.fetch(usuario.id).catch(() => null);

        if (membro) {
            await membro.ban({ reason: motivo });
            await interaction.reply(`O usuário **${usuario.tag}** foi banido pelo martelo do RatManny! Motivo: ${motivo}`);
        } else {
            await interaction.reply({ content: 'Não consegui encontrar esse usuário no servidor.', ephemeral: true });
        }
    }

    if (commandName === 'embed') {
        const titulo = options.getString('titulo');
        const descricao = options.getString('descricao');
        const cor = options.getString('cor') || '#0099ff'; 

        const geradorEmbed = new EmbedBuilder()
            .setColor(cor)
            .setTitle(titulo)
            .setDescription(descricao)
            .setFooter({ text: 'CRIADO POR EMANUEL RATÃO' });

        await interaction.reply({ embeds: [geradorEmbed] });
    }
});

// Liga o bot
client.login(process.env.TOKEN);
