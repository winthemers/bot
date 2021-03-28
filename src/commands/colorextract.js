const fs                    = require('fs');
const getColors             = require('get-image-colors');
const { i18n }              = require('../i18n/i18n');
const { MessageAttachment } = require("discord.js");
const { createCanvas }      = require('canvas');
const path                  = require('path');
const chroma                = require('chroma-js');

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	let fontSize = 30;

	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

module.exports = {
    run : async (client, message, args, utils) => {
        const loading    = utils.getEmoji(message.guild, 'loading');
        const done       = utils.getEmoji(message.guild, 'check')
        const attachment = message.attachments.first();

        if (!attachment) {
            message.channel.send( i18n("command.color.noAttachment") )
            return
        };

        if (args[0] && !typeof Number(args[0]) === 'number'){
            message.channel.send( i18n("command.color.mustBeNumber") )
            return
        }

        const amount = Number( args[0] !== undefined ? args[0] : 5 );

        const fileName = attachment.name.toLowerCase();


        if (!fileName.endsWith('.jpeg') && !fileName.endsWith('.jpg') && !fileName.endsWith('.png') && !fileName.endsWith('.svg') && !fileName.endsWith('.gif')) {
            message.channel.send( i18n("command.color.notExpected") )
            return
        };

        const loadMessage = await message.channel.send( i18n("command.color.progress", loading) )

        
        const options = {
            count: amount + 1,
            type: `image/${utils.getExtension(fileName)}`
        }

        await utils.downloadImage(attachment.url, `./src/commands/cache/${attachment.id}.${utils.getExtension(fileName)}`)
        .then( () => {
            let buffer = fs.readFileSync( path.join(__dirname, "/cache/", `${attachment.id}.${utils.getExtension(fileName)}`) )

            loadMessage.edit( i18n("command.color.done", done) )

            getColors(buffer, options)
                .then(colors => {

                    let Embed = {
                        color: 15158332,
                        title: i18n("command.color.title", done),
                        thumbnail: {
                            url: attachment.url
                        },
                        fields: [],
                        image: {
                            url: 'attachment://pal.png',
                        },
                        timestamp: new Date(),
                        footer: {
                            text: i18n("command.color.requestUser", message.author.username),
                            icon_url: message.author.avatarURL(),
                        },
                    };

                    let hexColor = colors.map(color => color.hex());
                    let rgbColor = colors.map(color => color.rgb());
                    let hslColor = colors.map(color => color.hsl());

                    let luminColor = colors.map(color => color.luminance());

                    let width = 100 * amount
                    let height = 100

                    let canvas = createCanvas(width, height)
                    let ctx = canvas.getContext('2d')

                    for (let i = 0; i < amount + 1; i++){
                        let x = (width/amount) * i
                        let y = 0
                        let w = width/amount
                        let h = height

                        ctx.fillStyle = hexColor[i];
                        ctx.fillRect(x, y, w, h)

                        ctx.font = applyText(canvas, i + 1)
                        ctx.fillStyle = luminColor[i] > 0.5 ? '#000' : '#ffffff';
                        ctx.fillText(i + 1, x + w /  2 - 15/2, y + h / 2 + 15/2);
                    }

                    const buffer = canvas.toBuffer('image/png')
                    fs.writeFileSync(`src/commands/cache/pal_${attachment.id}.png`, buffer)

                    const image = new MessageAttachment(`./src/commands/cache/pal_${attachment.id}.png`);
                    Embed.thumbnail.url = attachment.url
                    Embed.image.url =  `attachment://pal_${attachment.id}.png`

                    for (let i = 0; i < amount + 1; i++){
                        if (!rgbColor[i])
                            continue;
                        Embed.fields.push(
                            {
                                name: `${i18n("command.color.color")} ${i+1}`,
                                value: `**RGB**: ${i18n("command.color.rgb", rgbColor[i][0], rgbColor[i][1], rgbColor[i][2])}\n**HEX**: ${hexColor[i]}\n**HSL**: ${rgbColor[i][0]}, ${rgbColor[i][1]}, ${rgbColor[i][2]}`, inline: true
                            }
                        )
                    }
                    Embed.fields.push( {name: i18n("command.color.amount"), value: amount, inline: true} );

                    message.channel.send( { files: [image], embed: Embed } );

                    message.delete({ timeout: 500 }).then( () =>{
                        loadMessage.delete( { timeout: 500 } );
                        fs.unlinkSync(`src/commands/cache/pal_${attachment.id}.png`);
                        fs.unlinkSync(`src/commands/cache/${attachment.id}.${utils.getExtension(fileName)}`);
                    }) ;
                })
            })
            .catch( (err) => {
                console.log(err)
                message.channel.send( i18n("command.color.unableDownload") );
                return
            })
    },



    name: i18n("command.color.name"),
    description: i18n("command.color.description"),
    aliases: i18n("command.color.aliases"),
    usage: i18n("command.color.usage"),
    devOnly: false,
    permission: '',
    cooldown: 30,
    args: false
}