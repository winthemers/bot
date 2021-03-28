const i18n = require('../i18n/i18n.js').i8n
const loader = require('../utils/loadfiles.js')
const log = require('../utils/log.js')
const config = require('../config.json')
const moment = require('moment')
const Enmap = require('enmap')
const { recoverFromDead } = require('../utils/util.js')

module.exports = async (client, callback) => {
  if (!client.vcUsers) {
    client.vcUsers = []
  }

  loader.jobs(client, 'events/cronjobs', () => {
    log.success('CORE', `🌱 Autenticated as: ${client.user.tag} @ ${moment(new Date()).locale('pt-br').format('ll')}`)

    client.voiceRecord = new Enmap(
      {
        name: 'voiceRecord',
        autoFetch: true,
        dataDir: './src/database'
      })
    log.success('CORE', '💽 Initialized local DB: voiceRecord')

    client.user.setPresence({ activity: {
      name: config.activityStatus,
      type: config.activityType
    },
      status: config.botStatus
    })
    log.success('CORE', '🌱 Presence defined')

    recoverFromDead(client)
  })
}
