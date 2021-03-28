const moment   = require('moment');
const config   = require('../../config.json');

module.exports = {
    run: (client) => {
        const officeGuild   = client.guilds.cache.get( config.guildID )
        const statusChannel = officeGuild.channels.cache.get(config.statusChannel);
        const textChannels  = officeGuild.channels.cache;

        textChannels.forEach( (channel, index, array) => {
            if (config.nonAffectedChannels[channel.parentID]) {
                return
            }

            let role = channel.guild.roles.cache.get(config.guildID);

            channel.overwritePermissions([
                {
                    id: role,
                    allow: ['VIEW_CHANNEL'],
                },], 'Agência fechada');
        });

        const statusMessageID =  statusChannel.messages.lastMessageID
         statusChannel.messages.fetch(statusMessageID).then( msgList => {
            msgList.forEach(statusMessage => {
                statusMessage.edit('https://i.imgur.com/nejsYTA.png').catch( () => {
                    message.channel.send('https://i.imgur.com/nejsYTA.png')
                });
            });
       });
    },

    frequency: '30 18 * * 1-6',
    name: 'expediente',
    description: 'Libera salas do servidor para o uso durante expediente.',
    disabled: false
}