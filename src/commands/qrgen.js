const i18n = require("../i18n/i18n.js").i18n;
const { MessageAttachment, MessageEmbed } = require('discord.js');
const config = require('../config.json');
const QRCode = require('qrcode');
const fs = require('fs');

module.exports = {
    run : async (client, message, args, utils) => {
        const loading = utils.getEmoji(message.guild, "loading")
        const done  = utils.getEmoji(message.guild, "checked");

        const loadMessage = await message.channel.send( `${loading} Calculando QRCode para ${args[0]}...` )

        for (let i = 0; i < args.length; i++) {

            let fileName = utils.removeHttp( utils.linkToFileName( args[i] ) );

            QRCode.toFile(`src/commands/cache/${fileName}.svg`, args[i], {type: 'svg'}, () => {

                loadMessage.edit(`${done} QRCode calculado \n${loading} Gerando arquivos`)

                QRCode.toFile(`src/commands/cache/${fileName}.png`, args[i], {type: 'png', width: 256}, () => {
                    const embed = new MessageEmbed()
                        .setTitle(`${done} QRCode gerado com sucesso`)
                        .setColor(8359053)
                        // .setFooter( `Imanebot`, message.client.user.displayAvatarURL() )
                        .attachFiles(`src/commands/cache/${fileName}.png`)
                        .setImage(`attachment://${fileName}.png`)
                        .addFields([
                            { "name": "Destino", "value": `${args[i]}` },
                            { "name": "Prévia",  "value": "⬇️", "inline": true },
                            { "name": "Tipo",    "value": "SVG", "inline": true }
                        ])
                        .setAuthor( message.author.username, message.author.avatarURL() );

                        message.channel.send(embed)
                        message.channel.send(new MessageAttachment(`src/commands/cache/${fileName}.svg`)).then( () => {
                            fs.unlinkSync(`src/commands/cache/${fileName}.svg`);
                            fs.unlinkSync(`src/commands/cache/${fileName}.png`);
                        });


                    if (loadMessage) {
                        loadMessage.delete({timeout: 500})
                        message.delete({timeout:500})
                    }

                });
            });
        };
    },



    name: i18n("command.qrcode.name"),
    description: i18n("command.qrcode.description"),
    aliases: i18n("command.qrcode.aliases"),
    usage: i18n("command.qrcode.usage"),
    devOnly: false,
    permission: '',
    cooldown: 10,
    args: true
}