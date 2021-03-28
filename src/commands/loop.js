
const { i18n }                                = require("../i18n/i18n.js");



module.exports = {
  run : async (client, message, args, utils) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(i18n("loop.errorNotQueue")).catch(console.error);
    if (!utils.canModifyQueue(message.member)) return i18n("common.errorNotChannel");

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(i18nmf("loop.result", { loop: queue.loop ? i18n("common.on") : i18n("common.off") }))
      .catch(console.error);
  },

  name: i18n("command.loop.name"),
  description: i18n("command.loop.description"),
  aliases: i18n("command.loop.aliases"),
  cooldown: 3
};
