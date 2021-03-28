const fs             = require('fs');
const log            = require('./log.js');
const { Collection } = require('discord.js');
const cooldowns      = new Collection();
const config         = require('../config.json');
const CronJob        = require('cron').CronJob;

module.exports = {
    events : function (client, folder, callback) {
        fs.readdir(`./src/${folder}/`, (err, files) => {

            if (err) return console.error(err);
            log.debug('            ≡ [EVENTS]')
            files.forEach((file) => {

                if (!file.endsWith('.js')) return;

                const event = require(`../${folder}/${file}`)

                let eventName = file.split('.')[0];

                log.load(`🚩 event    ≡ ${file}`)

                client.on(eventName, event.bind(null, client));

                delete require.cache[require.resolve(`../${folder}/${file}`)];

            });

            callback();

        })
    },
    commands : function (client, folder, callback) {
        fs.readdir(`./src/${folder}/`, (err, files) => {

            if (err) return console.error(err);
            log.debug('            ≡ [COMMANDS]')
            files.forEach((file) => {

                if (!file.endsWith('.js')) return;

                const props = require(`../${folder}/${file}`);

                let commandName = file.split('.')[0];

                log.load(`⏳ command  ≡ ${file}`)

                if (props)
                    client.commands.set(commandName, props, cooldowns);

            });


            if (callback !== undefined)
                callback();

        });
    },
    translations : function(folder, callback) {
        fs.readdir(`./src/${folder}/language/`, (err, files) => {

            if (err) return console.error(err);

            let languageList = {}
            log.debug('            ≡ [TRANSLATIONS]')
            files.forEach((file) => {
                if (!file.endsWith('.js')) return;

                const language = require(`../${folder}/language/${file}`);

                languageList[ file.replace('.js', '') ] = language

                log.load(`💬 language ≡ ${file}`)
            });

            if (callback !== undefined)
                callback(languageList);

        });
    },
    jobs : function (client, folder, callback) {
        fs.readdir(`./src/${folder}/`, (err, files) => {

            if (err) return console.error(err);
            log.debug('            ≡ [CRONJOBS]')

            files.forEach((file) => {
                if (!file.endsWith('.js')) return;

                const job = require(`../${folder}/${file}`);

                if (job && !job.disabled)
                    new CronJob(job.frequency, job.run.bind(null, client), null, true, config.timeZone)

                log.load(`⏰ cronjob  ≡ ${file}`)

            });

            if (callback !== undefined)
                callback();
        });
    }
}