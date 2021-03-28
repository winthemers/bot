const i18n = require("../i18n/i18n.js").i18n;

module.exports = {
    run : async (client, message, args, utils) => {
        const loading = utils.getEmoji(message.guild, "loading");
        const done    = utils.getEmoji(message.guild, "checked");
        const pepe    = utils.getEmoji(message.guild, "pepecoffe");
        const error   = utils.getEmoji(message.guild, "deny");
        const pepesus = utils.getEmoji(message.guild, "pepesus");


        let deleteAmount = Number(args[0])

        if (deleteAmount + 2 >= 100) {
            const exceed = await message.channel.send( i18n("command.clear.exceeded", message.author, deleteAmount, 100) );
            await exceed.delete({ timeout: 5000 })
            return
        }

        if (deleteAmount <= 3){
            await message.channel.send( i18n("command.clear.tooFew", pepesus, deleteAmount) )
            return
        }

        const progressMsg = await message.channel.send( i18n("command.clear.progress", loading, deleteAmount) );

        await message.channel.bulkDelete(deleteAmount + 2)
        .then( async messages => {
            const doneMsg = await message.channel.send( i18n("command.clear.done", done, messages.size) );
            await doneMsg.delete({timeout: 2000})
        })
        .catch( async messages => {
            await progressMsg.delete({timeout: 500});

            const oldWarn = await message.channel.send( i18n("command.clear.tooOld", error) )
            const oldBother = await message.channel.send( i18n("command.clear.tooOldContinue", pepe) )

            await message.channel.bulkDelete(deleteAmount + 4, true)
            .then( async msgs => {
                const doneMsg = await message.channel.send(i18n("command.clear.done", done, msgs.size));
                await doneMsg.delete({timeout: 2000})
            })

        });
    },



    name: i18n("command.clear.name"),
    description: i18n("command.clear.description"),
    aliases: i18n("command.clear.aliases"),
    usage: i18n("command.clear.usage"),
    devOnly: false,
    permission: 'ADMINISTRATOR',
    cooldown: 5,
    args: true
}