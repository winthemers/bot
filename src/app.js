const path                   = require('path');
const { Collection, Client } = require('discord.js');
const log                    = require('./utils/log.js');
const load                   = require('./utils/loadfiles.js');
const chalk                  = require('chalk');
const Socket                 = require('./socket.js');
const config                 = require('./config.json');
const fs                     = require('fs');
const i18n                   = require('./i18n/i18n.js');

// TODO: Load WS!
// TODO: Load CLIENT!

const client = new Client();
client.commands = new Collection();
client.queue = new Map();
client.login(config.token)


load.events(client, 'events', () => {
});


load.commands(client, 'commands', () => {
});