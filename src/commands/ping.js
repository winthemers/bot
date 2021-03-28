const i18n = require("../i18n/i18n.js").i18n;

module.exports = {
    run : async (client, message, args, utils) => {
        message.channel.send(`🏓 Pong! ${Date.now() - message.createdTimestamp}ms`);
    },



    name: i18n("command.ping.name"),
    description: i18n("command.ping.description"),
    aliases: i18n("command.ping.aliases"),
    usage: i18n("command.ping.usage"),
    devOnly: true,
    permission: '',
    cooldown: 0,
    args: false
}