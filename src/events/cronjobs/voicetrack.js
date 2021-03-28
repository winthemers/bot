const moment   = require('moment');
const config   = require('../../config.json');
const log    = require('../../utils/log.js');

module.exports = {
    run: (client) => {

        if (client.voiceRecord === undefined)
            return

        if (!client.vcUsers)
            return

        if (!client.vcUsers.length > 0)
            return

        client.vcUsers.forEach(prop => {
            let userID = prop.user
            let vcName = prop.channel
            let user = client.users.fetch(userID)
            .then( usr => {
                if (!client.voiceRecord[userID]){
                    client.voiceRecord.ensure(`${usr.id}`, {
                        user: usr.id,
                        voiceTime: 0
                    });
                }
                client.voiceRecord.math(usr.id, "+", 1, "voiceTime")
                // log.debug(`Recalculating voice time of ${usr.username} : Currently on <"${vcName}"> total of ${client.voiceRecord.get(userID, "voiceTime")}`)
            })


        });
    },

    frequency: '* * * * *',
    name: 'voicetrack',
    description: 'Registra o tempo de call de usuários no servidor.',
    disabled: false
}