
const { i18n }                                = require("../i18n/i18n.js");


const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;

module.exports = {
  run : async (client, message, args, utils) =>  {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.channel.send(i18n("command.remove.errorNotQueue")).catch(console.error);
    if (!utils.canModifyQueue(message.member)) return i18n("error.notChannel");

    const arguments = args.join("");
    const songs = arguments.split(",").map((arg) => parseInt(arg));
    let removed = [];

    if (pattern.test(arguments)) {
      queue.songs = queue.songs.filter((item, index) => {
        if (songs.find((songIndex) => songIndex - 1 === index)) removed.push(item);
        else return true;
      });

      queue.textChannel.send(
        `${message.author} ❌ Removeu **${removed.map((song) => song.title).join("\n")}** da playlist.`
      );
    } else if (!isNaN(args[0]) && args[0] >= 1 && args[0] <= queue.songs.length) {
      return queue.textChannel.send(
        `${message.author} ❌ Removeu **${queue.songs.splice(args[0] - 1, 1)[0].title}** da playlist.`
      );
    } else {
      return message.reply(i18nmf("remove.usageReply", { prefix: message.client.prefix }));
    }
  },

  name: i18n("command.remove.name"),
  description: i18n("command.remove.description"),
  aliases: i18n("command.remove.aliases"),
  usage: i18n("command.remove.usage"),
  args: true
};
