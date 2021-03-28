
const { i18n }                                = require("../i18n/i18n.js");



module.exports = {

  run : async (client, message, args, utils) =>  {

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(i18n("command.skipto.errorNotQueue")).catch(console.error);
    if (!utils.canModifyQueue(message.member)) return i18n("common.errorNotChannel");
    if (args[0] > queue.songs.length)
      return message
        .reply(i18("command.skipto.errorNotValid", queue.songs.length ))
        .catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }

    queue.connection.dispatcher.end();
    queue.textChannel
      .send(i18("command.skipto.result", message.author, args[0] - 1 ))
      .catch(console.error);
  },

  name: i18n("command.skipto.name"),
  description: i18n("command.skipto.description"),
  aliases: i18n("command.skipto.aliases"),
  usage: i18n("command.skipto.usage"),
  args: true
};
