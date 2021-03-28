const config  = require('../config.json');
const utils   = require('../utils/util.js');
const i18n    = require('../i18n/i18n.js');
const log     = require('../utils/log.js');

async function event(client, oldState, newState) {
    const user = newState.member.user
    const username = user.username;
    const oldVC = oldState.channel;
    const newVC = newState.channel;

    const oldChannelName = (oldVC === undefined || oldVC === null) ? "None" : oldVC.name;
    const newChannelName = (newVC === undefined || newVC === null) ? "None" : newVC.name;

    if (oldVC === null) {
        log.voice('STATE', user, newVC, "Joined");
        client.vcUsers.push( {user: user.id, channel: newChannelName} )
    } else if (newVC === null) {
        log.voice('STATE', user, oldVC, "Disconnected from");
        client.vcUsers.forEach( (prop, index) => {
            if (prop.user != user.id)
                return;

            client.vcUsers.splice(index, 1);
            log.debug(`Stopping voice time calculation for ${username} : Previously on <"${oldChannelName}">`)
        });
    } else {
        log.voice('STATE', user, newVC, "Moved to");
    }

    client.voiceRecord.ensure(`${user.id}`, {
        user: user.id,
        voiceTime: 0
    });

}

module.exports = event;