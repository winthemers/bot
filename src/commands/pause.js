
const { i18n }                                = require("../i18n/i18n.js");



module.exports = {
  run : async (client, message, args, utils) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(i18n("command.pause.errorNotQueue")).catch(console.error);
    if (!utils.canModifyQueue(message.member)) return i18n("error.notChannel");

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel
        .send(i18("pause", message.author))
        .catch(console.error);
    }
  },

  name: i18n("command.pause.name"),
  description: i18n("command.pause.description"),
  aliases: i18n("command.pause.aliases"),
  usage: i18n("command.pause.usage"),
  cooldown: 5,
  permission: ''
};
