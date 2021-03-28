const move = require("array-move");

const { i18n }                                = require("../i18n/i18n.js");



module.exports = {
  run : async (client, message, args, utils) =>  {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(i18n("command.move.errorNotQueue")).catch(console.error);
    if (!utils.canModifyQueue(message.member)) return;

    let song = queue.songs[args[0] - 1];

    queue.songs = move(queue.songs, args[0] - 1, args[1] == 1 ? 1 : args[1] - 1);
    queue.textChannel.send(
      i18n("command.move.result", {
        author: message.author,
        title: song.title,
        index: args[1] == 1 ? 1 : args[1]
      })
    );
  },

  name: i18n("command.move.name"),
  description: i18n("command.move.description"),
  aliases: i18n("command.move.aliases"),
  cooldown: 3,
  args: true
};
