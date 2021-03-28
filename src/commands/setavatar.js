const { i18n } = require("../i18n/i18n.js");

module.exports = {
    run : async (client, message, args, utils) => {
        const loading    = utils.getEmoji(message.guild, 'loading');
        const done       = utils.getEmoji(message.guild, 'check')
        const attachment = message.attachments.first();

        const loadMessage = message.channel.send( i18n("command.color.loading", loading) )

        if (!attachment) {
            message.channel.send( i18n("command.color.noAttachment") )
            return
        };

        const fileName = attachment.name.toLowerCase();

        await utils.downloadImage(attachment.url, `./src/commands/cache/${attachment.id}.${utils.getExtension(fileName)}`)
        .then( () => {
            client.user.setAvatar(`./src/commands/cache/${attachment.id}.${utils.getExtension(fileName)}`)
            .then(user => {
                loadMessage.delete({ timeout: 500 })
                const doneMessage = message.channel.send( i18n("command.setAvatar.done", done) )
                .then( () => {
                    doneMessage.delete({ timeout: 700 });
                });
                message.delete({ timeout: 500});
            })
            .catch(err => {
                loadMessage.delete({ timeout: 500 })
                const errorMessage = message.channel.send( i18n("command.setAvatar.limiRate") )
                .then( () => {
                    errorMessage.delete({ timeout: 700 });
                });
                message.delete({ timeout: 500});
            });
        });
    },



    name: i18n("command.avatar.name"),
    description: i18n("command.avatar.description"),
    aliases: i18n("command.avatar.aliases"),
    usage: i18n("command.avatar.usage"),
    devOnly: false,
    permission: 'ADMINISTRATOR',
    cooldown: 60 * 30,
    args: false
}