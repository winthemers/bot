const { i18n } = require("../i18n/i18n.js");
const log      = require("../utils/log.js");

module.exports = {
    run : async (client, message, args, utils) => {
        const loading    = utils.getEmoji(message.guild, 'loading');
        const done       = utils.getEmoji(message.guild, 'check')

        const loadMessage = await message.channel.send( i18n("command.setName.loading", loading) )

        await client.user.setUsername(args.join(" "))
        .then ( async username => {
            const doneMessage = await message.channel.send( i18n("command.setName.done", done) );
            loadMessage.delete({ timeout: 500 });
            doneMessage.delete({ timeout: 1000 });
    
            message.delete( { timeout: 500 } )
        })
        .catch( err => {
            if (err)
                log.error("COMD", err);
                loadMessage.delete({ timeout: 500 });
                message.channel.send( i18n("command.setName.limitRate") )
                .then( (msg) =>{
                    msg.delete( { timeout: 1500 })
                })

                message.delete({ timeout: 500 })
        })





    },



    name: i18n("command.setName.name"),
    description: i18n("command.setName.description"),
    aliases: i18n("command.setName.aliases"),
    usage: i18n("command.setName.usage"),
    devOnly: false,
    permission: 'ADMINISTRATOR',
    cooldown: 60 * 30,
    args: true
}