
const { i18n }                                = require("../i18n/i18n.js");



module.exports = {
  run : async (client, message, args, utils) =>  {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(i18n("skip.errorNotQueue")).catch(console.error);
    if (!utils.canModifyQueue(message.member)) return i18n("common.errorNotChannel");

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(i18n("command.skip.result", message.author)).catch(console.error);
  },

  name: i18n("command.skip.name"),
  description: i18n("command.skip.description"),
  aliases: i18n("command.skip.aliases"),
  usage: i18n("command.skip.usage")
};
