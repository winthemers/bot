const Axios = require('axios');
const fs    = require('fs');
const log   = require('./log.js');

module.exports = {
    getEmoji : function (guild, name) {
        return guild.emojis.cache.find(emoji => emoji.name === name);
    },
    getUserVoiceChannel : function(msg) {
        var voiceChannelArray = msg.guild.channels.cache.filter((v)=>v.type == "voice").filter((v)=>v.members.has(msg.author.id)).array();
        if(voiceChannelArray.length == 0) return null;
        else return voiceChannelArray[0];
    },
    changeTZ : function (date, tzString) {
        return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));
    },
    removeHttp : function(url) {
        return url.replace(/^https?:\/\//, '');
    },
    linkToFileName : function(url) {
        return url.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    },
    downloadImage : async function (url, path) {
        const writer = fs.createWriteStream(path)

        const response = await Axios({
          url,
          method: 'GET',
          responseType: 'stream'
        })

        response.data.pipe(writer)

        return new Promise((resolve, reject) => {
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
    },
    getExtension : function(fileName) {
        return fileName.substring(fileName.lastIndexOf('.')+1, fileName.length) || fileName;
    },

    isUrl : function (str) {
        try {
            const the_url = new URL(str);
            return true;
        } catch(e) {
            return false;
        }
    },

    recoverFromDead : function (client) {

        const voiceChannels = client.channels.cache.filter( channel => channel.type !== 'text');
    
        voiceChannels.forEach( channel => {
            const usersVC = channel.members.filter( member => member.voice.channel !== null)
            if (!usersVC || usersVC === null)
                return;
    
            usersVC.forEach( member => {
                const vcRecordMatch = client.vcUsers.filter( prop => prop.user === member.id)
                const user = member.user;
    
                if (vcRecordMatch.length > 0)
                    return;
    
                client.voiceRecord.ensure(`${user.id}`, {
                    user: user.id,
                    voiceTime: 0
                });
    
                client.vcUsers.push( {user: user.id, channel: channel.name} );
                log.debug(`Recovering voice calculation of ${user.username} : Currently on <"${channel.name}">`)
            });
        })
    },
    canModifyQueue : member => {
        const { channelID } = member.voice;
        const botChannel = member.guild.voice.channelID;
      
        if (channelID !== botChannel) {
          return;
        }
      
        return true;
      }

}