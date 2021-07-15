'use strict';

const { prefix, token, webhook_id, webhook_token, moderator_channel, vent_channels } = require('./config.json');

// const request = require("request");

const Discord = require('discord.js');

const client = new Discord.Client();
const webhookClient = new Discord.WebhookClient(webhook_id, webhook_token);

const reactions = [':white_check_mark:', ':redcross:']

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

        client.channels.fetch(moderator_channel).then((channel) => {
            channel.send(embed=embed).then((sent) => {
                sent.react('✅');
                sent.react('❌');
            });
        }).catch(console.error);

    } catch(error) {
        // Discord.WebhookClient.send(error);
        console.log(error);
    }
});

client.on('messageReactionAdd', (data) => {

    const { message, users, _emoji, me } = data;

    if(!me && message.channel.id == moderator_channel && _emoji.name == '✅') {

        for(let vent_channel of vent_channels) {

            client.channels.fetch(vent_channel).then((channel) => {

                const { title } = message.embeds[0];

                let embed = new Discord.MessageEmbed({
                    author:'VentBot',
                    color:'#36fa00', 
                    title: title,
                    footer: {
                        text: `#${index}`
                      },
                    timestamp: Date.now()
                });

                channel.send(embed=embed);

            }).catch(console.error);
            
        }

        index++

    }
})

// Log our bot in using the token from https://discord.com/developers/applications
client.login(token);