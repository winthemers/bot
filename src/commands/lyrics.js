const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

const { i18n }                                = require("../i18n/i18n.js");



module.exports = {
  run : async (client, message, args, utils) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(i18n("command.lyrics.errorNotQueue")).catch(console.error);

    let lyrics = null;
    const title = queue.songs[0].title;
    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = i18n("command.lyrics.lyricsNotFound", { title: title });
    } catch (error) {
      lyrics = i18n("command.lyrics.lyricsNotFound", { title: title });
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle(i18n("command.lyrics.title", title))
      .setDescription(lyrics)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  },


  name: i18n("command.lyrics.name"),
  description: i18n("command.lyrics.description"),
  aliases: i18n("command.lyrics.aliases"),
  cooldown: 3
};
