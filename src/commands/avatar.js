const { i18n }         = require("../i18n/i18n.js");
const { MessageEmbed } = require('discord.js');

module.exports = {
    run : async (client, message, args, utils) => {
        const embed = new MessageEmbed();

        let user = message.mentions.members.first();
        let userid = args[0];
        if (!user && !userid) return;

        let isError = false;
        if (!user) {
            isError = false;
            user = await message.guild.members.fetch(userid).catch((_) => {
                isError = true;
            });
        }

        if (isError) return message.channel.send( i18n("command.avatar.userNotFound") );

        if (user) {
            embed.setTitle( i18n("command.avatar.avatar", user.user.tag) );
            embed.setColor(0xf45000);
            embed.setImage(user.user.displayAvatarURL({ dynamic: true, size: 2048 }));
            message.channel.send( { embed } );
        }
    },



    name: i18n("command.avatar.name"),
    description: i18n("command.avatar.description"),
    aliases: i18n("command.avatar.aliases"),
    usage: '',
    devOnly: false,
    permission: '',
    cooldown: 5,
    args: true
}
