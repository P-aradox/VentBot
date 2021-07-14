'use strict';

const { prefix, token, webhook_id, webhook_token } = require('./config.json');

// const request = require("request");

const Discord = require('discord.js');

const client = new Discord.Client();
const webhookClient = new Discord.WebhookClient(webhook_id, webhook_token);

let index = 0;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
    try {
        console.log(message.content);
        if(!message.content.startsWith(prefix)) return;
        
        let ventMessage = message.content.slice(prefix.length+1);
        let embed = new Discord.MessageEmbed({
            author:'VentBot',
            color:'#36fa00', 
            title: ventMessage,
            footer: {
                text: `#${index}`
              },
            timestamp: Date.now()
        });
        
        await webhookClient.send('',{
            embeds: [embed],
        });
        index++
    } catch(error) {
        console.log(error);
    }
});


// Log our bot in using the token from https://discord.com/developers/applications
client.login(token);