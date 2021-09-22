'use strict';

const { token, moderator_channel, vent_channels } = require('./config.json');
const animals = require("./animals.json");

// const request = require("request");

const Discord = require('discord.js');

const client = new Discord.Client();

const reactions = [':white_check_mark:', ':redcross:']

const helptxt = `Welcome to #support-vent :grin:
This channel is a safe space to talk about issues or problems, seek advice and vent. 
These issues do not need to be related to the Society in any way. 
As a privacy measure this channel is only viewable by those with the Support-Vent role.
It is especially important for venters and supporters to follow the server's code of conduct in this channel, which can be found here: <https://tiny.cc/warwickesportsrules>

**Importantly**
-Please keep debate of political or religious opinions at the door. Discussion of politics and religion is allowed only if it is central to your issue - this is not a place for debate, but for constructive advice and support.
-Some vents may contain content of intimate or distressing nature. Please be respectful with all messages in this channel and keep humour to a minimum. Every vent has a person behind it.
-This channel is a safe and non-judgemental place where all are welcome. We will work to maintain this environment.

**Be aware**
While people may be willing to share their experience, knowledge or understanding to help with deep issues that are brought up, we are not trained medical professionals. This channel is so we can help, give advice, signpost and show support for each other. 
To find more appropriate places to seek further help, why not try using the command !contacts with our support bot.

**Finally**
Those who want to vent should not wish harm upon others, and those who reply should talk with tact and respect, regardless of the issue. 
If you are unsure on whether something is appropriate for this channel, don't hesitate to DM Faunic (Equal Opportunities Officer) or Wollom (Community Exec) before posting.

**Commands**
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
                await message.reply(helptxt);
            } else {
                await message.reply("Unknown command. Type !help");
            }
        }

    } catch(error) {
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