const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");


const { i18n }                                = require("../i18n/i18n.js");



module.exports = {
  name: "np",
  description: i18n("nowplaying.description"),
  run : async (client, message, args, utils) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(i18n("nowplaying.errorNotQueue")).catch(console.error);

    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;

    let nowPlaying = new MessageEmbed()
      .setTitle(i18n("command.nowplaying.embedTitle"))
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("#F8AA2A")
      .setAuthor(message.client.user.username);

    if (song.duration > 0) {
      nowPlaying.addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) +
          "[" +
          createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
          "]" +
          (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        false
      );
      nowPlaying.setFooter(
        i18("command.nowplaying.timeRemaining", new Date(left * 1000).toISOString().substr(11, 8))
      );
    }

    return message.channel.send(nowPlaying);
  },


  name: i18n("command.nowPlaying.name"),
  description: i18n("command.nowPlaying.description"),
  aliases: i18n("command.nowPlaying.aliases"),
  cooldown: 3,
};
