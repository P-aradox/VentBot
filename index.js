'use strict';

const { token, webhook_id, webhook_token, moderator_channel, vent_channels } = require('./config.json');
const animals = require("./animals.json");

// const request = require("request");

const Discord = require('discord.js');

const client = new Discord.Client();
const webhookClient = new Discord.WebhookClient(webhook_id, webhook_token);

const reactions = [':white_check_mark:', ':redcross:']

const commands = `
!vent <message>         Send a message to the vent channel. This will be approved by Warwick Esports admins first.
!animal                 Provides a random animal for you to use to sign your messages with
!contacts               List of useful mental health links
`


let index = 0;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

    
});

client.on('message', async (message) => {
    try {
        console.log(message.content);
        if(message.author.id !== client.user.id) {
            if(message.content.startsWith("!vent")) {
            
                let ventMessage = message.content.slice("!vent".length+1);
                let embed = new Discord.MessageEmbed({
                    author:'VentBot',
                    color:'#36fa00', 
                    title: ventMessage,
                    // footer: {
                    //     text: `#${index}`
                    // },
                    timestamp: Date.now()
                });

                client.channels.fetch(moderator_channel).then((channel) => {
                    channel.send(embed=embed).then((sent) => {
                        sent.react('✅');
                        sent.react('❌');
                    });
                }).catch(console.error);

                await message.reply(`Your vent has been sent and is waiting for approval.`);

            } else if(message.content == "!animal") {

                var animal = animals[Math.floor(Math.random()*animals.length)];
                
                await message.reply(`Your animal is ${animal}. You can use this to sign your messages if you would like.`);

            } else if (message.content == "!contacts") {
                await message.reply(`If you feel at immediate risk of harm or require immediate emotional, psychological or mental health support please see the numbers on this page: https://warwick.ac.uk/services/wss/students/emergency_contacts/`)
            } else if (message.content == "!help") {
                await message.reply(commands);
            } else {
                await message.reply("Unknown command. Type !help");
            }
        }

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
                    // footer: {
                    //     text: `#${index}`
                    //   },
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