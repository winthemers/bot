const config                                  = require('../config.json');
const { i18n }                                = require("../i18n/i18n.js");
const { ReactionCollector, MessageCollector } = require('discord.js-collector');
const { MessageEmbed }                        = require("discord.js");
const fs                                      = require('fs');

module.exports = {
    run : async (client, message, args, utils) => {
        const loading     = utils.getEmoji(message.guild, 'loading');

        if (args[0]) {
            const setting = config[args[0]];

            if (!setting) { return }

            const embed = {

                    "title": i18n(`command.config.${args[0]}.name`),
                    "description": i18n(`command.config.${args[0]}.desc`),
                    "color": 10290634,
                    "fields": [
                        {
                        "name": i18n("command.config.currentValue"),
                        "value": `${setting || "Vazio"}`
                        }
                    ]
           }

            const embedMsg = await message.channel.send( { embed: embed } );
            const botMessage = await message.channel.send(i18n("command.config.changeQuestion"));

            if (await ReactionCollector.yesNoQuestion({ botMessage, user: message.author,reactions: { '✅': () => { return true; }, '❌': () => { return true; } } })) {
                const questionMsg = await message.channel.send( i18n("command.config.typeValuePrompt") );
                MessageCollector.question({
                    botMessage: questionMsg,
                    user: message.author.id,
                    onMessage: async (botMessage, msg) => { // Every message sent by user will trigger this function.

                        await questionMsg.delete({ timeout: 500 })

                        config[args[0]] = msg.content;
                        fs.writeFile('./src/config.json', JSON.stringify(config), (err) => {
                            message.channel.send(err || i18n("command.config.restarting"))
                        });
                    }
                });
            }
            else {
                // false
            }
        }

        let configList   = [];

        const infoMessage = await message.channel.send(`${loading} Carregando lista de comandos`);
        // console.log()
        Object.keys(config).forEach(name => {
            let value = config[name]

            configList.push(
                new MessageEmbed()
                .setTitle( i18n(`command.config.title`) )
                .addField( i18n(`command.config.configName`), i18n(`command.config.${name}.name`))
                .addField( i18n(`command.config.configDescription`), i18n(`command.config.${name}.desc`))
                .addField( i18n(`command.config.currentValue`), value)
                .setColor(10181046)
            )
            console.log(value, name)
        });

        ReactionCollector.paginator({
            botMessage: infoMessage,
            reactions: {
                '⏪': async (_reaction, _collector, botMessage, pages) => {
                    pages.index--;
                    if (pages.index <= 0) pages.index = 0;
                    await botMessage.edit({ embed: pages[pages.index] });
                },
                '👌': async (_reaction, collector, _botMessage, _pages) => {
                    collector.stop();
                    const questionMsg = await message.channel.send( i18n("command.config.typeValuePrompt") );
                    MessageCollector.question({
                        botMessage: questionMsg,
                        user: message.author.id,
                        onMessage: async (botMessage, msg) => { // Every message sent by user will trigger this function.

                            await questionMsg.delete({ timeout: 500 })

                            config[Object.keys(config)[_pages.index]] = msg.content;
                            fs.writeFile('./src/config.json', JSON.stringify(config), (err) => {
                                message.channel.send(err || i18n("command.config.restarting"))
                            });
                        }
                    });
                },
                '⏩': async (_reaction, _collector, botMessage, pages) => {
                    pages.index++;
                    if (pages.index >= pages.length) pages.index = pages.length - 1;
                    await botMessage.edit({ embed: pages[pages.index] });
                }
            },
            user: message.author,
            pages: configList,
            collectorOptions: {
                time: 60000
            }
        }).then( () => {
            infoMessage.edit('', { timeout: 500 });
            message.delete({ timeout: 500 });
        });

    },



    name: i18n("command.config.name"),
    description: i18n("command.config.description"),
    aliases: i18n("command.config.aliases"),
    usage: i18n("command.config.usage"),
    devOnly: false,
    permission: 'ADMINISTRATOR',
    cooldown: 5,
    args: false
}