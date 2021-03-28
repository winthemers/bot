
const { i18n }                                = require("../i18n/i18n.js");



module.exports = {
  run : async (client, message, args, utils) =>  {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(i18n("command.shuffle.errorNotQueue")).catch(console.error);
    if (!utils.canModifyQueue(message.member)) return i18n("error.notChannel");

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    queue.textChannel.send(i18n('command.shuffle.result', message.author)).catch(console.error);
  },

  name: i18n("command.shuffle.name"),
  description: i18n("command.shuffle.description"),
  aliases: i18n("command.shuffle.aliases"),
  usage: i18n("command.shuffle.usage"),
};
