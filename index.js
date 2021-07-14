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
        
        let confession = message.content.slice("!confession".length+1);
        let embed = new Discord.MessageEmbed().setTitle(confession).setColor('#0099ff');
        
        await webhookClient.send(`Confession #${index}`, {
            embeds: [embed],
        });
        index++
    } catch(error) {
        console.log(error);
    }
});


// Log our bot in using the token from https://discord.com/developers/applications
client.login(token);