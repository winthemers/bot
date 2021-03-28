const xa        = require('xa');
const config    = require('../config.json');
const WebSocket = require('../socket.js');
const chalk = require('chalk');

const log = {
    debug : function (message, module) {
        console.log( "", chalk.bgHex('#fc8403')` DEBG ` + chalk.bgHex( '#331d00' )(" " + message) );
        if (config.enableWebsocket) {
            let debugObj = {
                message,
                level: "trace",
                module: module
            };
            WebSocket.client.forEach( function each(client) {
                client.send( JSON.stringify(debugObj) )
            });
        }
    },
    load : function (message) {
        xa.custom("LOAD", message, {titleColor:'white', backgroundColor: '#03a5fc'});
        if (config.enableWebsocket) {
            let debugObj = {
                message,
                level: "trace",
                module: "Load"
            };
            WebSocket.client.forEach( function each(client) {
                client.send( JSON.stringify(debugObj) )
            });
        }
    },
    error : function (module, message) {
        xa.custom("ERRO", message, { titleColor: 'white', backgroundColor: 'red' });
        if (config.enableWebsocket) {
            let debugObj = {
                message,
                level: "error",
                module: module
            };
            WebSocket.client.forEach( function each(client) {
                client.send( JSON.stringify(debugObj) )
            });
        }
    },
    success : function (module, message) {
        xa.custom("DONE", message, {titleColor:'white', backgroundColor: '#03fc77'});
        if (config.enableWebsocket) {
            let debugObj = {
                message,
                level: "success",
                module: module
            };
            WebSocket.client.forEach( function each(client) {
                client.send( JSON.stringify(debugObj) )
            });
        }
    },
    command : function (command, user, text) {
        xa.custom("COMD", `${user.username} with ${text}`, {titleColor:'black', backgroundColor: 'white'});
        if (config.enableWebsocket) {
            let debugObj = {
                message: `${user.username} with ${text}`,
                level: "trace",
                module: command
            };
            WebSocket.client.forEach( function each(client) {
                client.send( JSON.stringify(debugObj) )
            });
        }
    },
    voice : function (module, user, channel, action) {
        xa.custom("VOIP", `${user.username} ${action} 🔊 ${channel.name}`, {titleColor:'black', backgroundColor: 'yellow'});
        if (config.enableWebsocket) {
            let debugObj = {
                message: `${user.username} with ${text}`,
                level: "trace",
                module: module
            };
            WebSocket.client.forEach( function each(client) {
                client.send( JSON.stringify(debugObj) )
            });
        }
    }
}

module.exports = log;