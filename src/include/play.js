const ytdl = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader").default;
const { STAY_TIME} =require("../config.json");
const { i18n } = require("../i18n/i18n.js");

module.exports = {
  async play(song, message, utils) {
    const { SOUNDCLOUD_CLIENT_ID } = require("../config.json");

    let config;

    try {
      config = require("../config.json");
    } catch (error) {
      config = null;
    }

    const PRUNING = config ? config.PRUNING : process.env.PRUNING;

    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      setTimeout(function () {
        if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
        queue.channel.leave();
        queue.textChannel.send(i18n("command.play.leaveChannel"));
      }, STAY_TIME * 1000);
      queue.textChannel.send(i18n("command.play.queueEnded")).catch(console.error);
      return message.client.queue.delete(message.guild.id);
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdl(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("soundcloud.com")) {
        try {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID);
        } catch (error) {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID);
          streamType = "unknown";
        }
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(
        i18n("command.play.queueError")
      );
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
      var playingMessage = await queue.textChannel.send(
        i18n("command.play.startedPlaying", song.title, song.url)
      );
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔇");
      await playingMessage.react("🔉");
      await playingMessage.react("🔊");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!utils.canModifyQueue(member)) return i18n("error.notChannel");
          queue.connection.dispatcher.end();
          queue.textChannel.send(i18n("command.play.skipSong",  user)).catch(console.error);
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!utils.canModifyQueue(member)) return i18n("error.notChannel");
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send(i18n("command.play.pauseSong", user )).catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(i18n("command.play.resumeSong",  user )).catch(console.error);
          }
          break;

        case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!utils.canModifyQueue(member)) return i18n("error.notChannel");
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
            queue.textChannel.send(i18n("command.play.unmutedSong", { author: user })).catch(console.error);
          } else {
            queue.volume = 0;
            queue.connection.dispatcher.setVolumeLogarithmic(0);
            queue.textChannel.send(i18n("command.play.mutedSong", { author: user })).catch(console.error);
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (queue.volume == 0) return;
          if (!utils.canModifyQueue(member)) return i18n("error.notChannel");
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(i18n("command.play.decreasedVolume", user, queue.volume ))
            .catch(console.error);
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (queue.volume == 100) return;
          if (!utils.canModifyQueue(member)) return i18n("error.notChannel");
          if (queue.volume + 10 >= 100) queue.volume = 100;
          else queue.volume = queue.volume + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(i18n("command.play.increasedVolume", user, queue.volume))
            .catch(console.error);
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!utils.canModifyQueue(member)) return i18n("error.notChannel");
          queue.loop = !queue.loop;
          queue.textChannel
            .send(
              i18n("command.play.loopSong", user, queue.loop ? i18n("on") : i18n("off")
              )
            )
            .catch(console.error);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!utils.canModifyQueue(member)) return i18n("error.notChannel");
          queue.songs = [];
          queue.textChannel.send(i18n("command.play.stopSong", user )).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }

    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};
