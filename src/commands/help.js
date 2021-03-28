const { ReactionCollector } = require('discord.js-collector');
const { MessageEmbed }      = require("discord.js");
const i18n                  = require("../i18n/i18n.js").i18n;
const config                = require('../config.json');

module.exports = {
    run : async (client, message, args, utils) => {
        const loading     = utils.getEmoji(message.guild, 'loading');

        if (args[0]) {
            let command = client.commands.get(args[0]) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(args[0]));

            if (!command) { return }

            await message.channel.send(
                new MessageEmbed()
                .setTitle( i18n("command.help.title") )
                .addField(command.usage == '' ? `${config.prefix}${command.name}` : `${config.prefix}${command.name} ${command.usage}`, command.description)
                .addFields(
                    { name: i18n("command.aliases"), value: command.aliases != '' ? (typeof command.aliases == 'object' ? command.aliases.join(', ') :  i18n("none")) : i18n("none"), inline: true },
                    { name:  i18n("command.cooldown"), value: command.cooldown, inline: true },
                    { name:  i18n("command.permission"), value: command.permission == '' ? command.devOnly ?  i18n("command.developer") :  i18n("command.anyone") : command.permission, inline: true}
                )
                .setColor(10181046)
                .setFooter( i18n("command.help.requestUser", message.author.username), message.author.avatarURL() )
            )
            return
        }

        let commandList   = [];

        const infoMessage = await message.channel.send(`${loading} Carregando lista de comandos`);

        client.commands.forEach(command => {
            commandList.push(
                new MessageEmbed()
                .setTitle( i18n("command.help.title") )
                .addField(command.usage == '' ? `${config.prefix}${command.name}` : `${config.prefix}${command.name} ${command.usage}`, command.description)
                .addFields(
                    { name: i18n("command.aliases"), value: command.aliases != '' ? (typeof command.aliases == 'object' ? command.aliases.join(', ') :  i18n("none")) : i18n("none"), inline: true },
                    { name:  i18n("command.cooldown"), value: command.cooldown, inline: true },
                    { name:  i18n("command.permission"), value: command.permission == '' ? command.devOnly ?  i18n("command.developer") :  i18n("command.anyone") : command.permission, inline: true}
                )
                .setColor(10181046)
                .setFooter( i18n("command.help.requestUser", message.author.username), message.author.avatarURL() )
            )});

        ReactionCollector.paginator({
            botMessage: infoMessage,
            reactions: {
                '⏪': async (_reaction, _collector, botMessage, pages) => {
                    pages.index--;
                    if (pages.index <= 0) pages.index = 0;
                    await botMessage.edit({ embed: pages[pages.index] });
                },
                '⏹️': async (_reaction, collector, _botMessage, _pages) => {
                    collector.stop();
                },
                '⏩': async (_reaction, _collector, botMessage, pages) => {
                    pages.index++;
                    if (pages.index >= pages.length) pages.index = pages.length - 1;
                    await botMessage.edit({ embed: pages[pages.index] });
                }
            },
            user: message.author,
            pages: commandList,
            collectorOptions: {
                time: 60000
            }
        }).then( () => {
            infoMessage.edit('', { timeout: 500 });
            message.delete({ timeout: 500 });
        });

    },

    name: i18n("command.help.name"),
    description:  i18n("command.help.description"),
    aliases:  i18n("command.help.aliases"),
    usage: i18n("command.help.usage"),
    devOnly: false,
    permission: '',
    cooldown: 0,
    args: false
}