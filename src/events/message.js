const { Collection } = require('discord.js');
const config         = require('../config.json');
const utils          = require('../utils/util.js');
const i18n           = require('../i18n/i18n.js');
const log            = require('../utils/log.js');

const ratelimitCooldown = new Set()
const cooldowns         = new Collection();

async function event(client, message) {
    if (message.author.bot || !message.guild) return;

    const args = message.content.slice(config.prefix.length).split(/ +/);

    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (message.content.startsWith(config.prefix)) {

        if (!message.guild.me.permissions.has('EMBED_LINKS')) return message.channel.send('NEED PERM EMBED');

        if (ratelimitCooldown.has(message.author.id)) return;

        ratelimitCooldown.add(message.author.id);

        setTimeout(() => {
            ratelimitCooldown.delete(message.author.id);
        }, 630);

        if (command.devOnly && config.developerID != message.author.id) return message.channel.send('NO PERMISSION');

        if (command.permission && !message.member.hasPermission(command.permission)) return message.channel.send('NO PERMISSION DUDE');

        if (command.args && !args.length) {

            let errmsg = await message.channel.send('YOURE DUMB, CANT USE COMMANDS');

            message.delete({ timeout: 6000 });

            return errmsg.delete({ timeout: 8000 });
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                let cooldownMessage = await message.channel.send( i18n.i18n("error.cooldown", message.author) );
                message.delete({ timeout: 4000 }).catch(() => { });
                return cooldownMessage.delete({ timeout: 5000 }).catch(() => {
                    return;
                });
            }
        }

        try {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            message.react('👀')
            command.run(client, message, args, utils);
            log.command(command.name, message.author, message.content)

        } catch (error) {
            console.error(error);
            message.channel.send(error);
        }
    }
}

module.exports = event;