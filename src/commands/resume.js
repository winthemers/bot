
const { i18n }                                = require("../i18n/i18n.js");



module.exports = {
  run : async (client, message, args, utils) =>  {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(i18n("command.resume.errorNotQueue")).catch(console.error);
    if (!utils.canModifyQueue(message.member)) return i18n("error.notChannel");

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel
        .send(i18n("command.resume.resultNotPlaying", message.author ))
        .catch(console.error);
    }

    return message.reply(i18n("command.resume.errorPlaying")).catch(console.error);
  },

  name: i18n("command.resume.name"),
  description: i18n("command.resume.description"),
  aliases: i18n("command.resume.aliases"),
  usage: i18n("command.resume.usage"),
};
