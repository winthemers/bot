const i18n = require("../i18n/i18n.js").i18n;
const { inspect } = require('util')

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }

module.exports = {
    run : async (client, message, args, utils) => {
        let toEval = args.join(" ");
        try {
            const code = args.join(" ");
            let evaled = eval(code);
      
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
      
            message.channel.send(clean(evaled) ? clean(evaled) : "Check on console", {code:"xl"});
          } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }
    },



    name: 'eval',
    description: '-javascript evaluation',
    aliases: ['evaluate', 'js', eval],
    usage: 'do not use',
    devOnly: true,
    permission: '',
    cooldown: 0,
    args: true
}