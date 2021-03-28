const lang = {

  locale: 'en-us',

  on: 'On',
  off: 'Off',
  /* Errors */
  error: {
    noPermission: (emote, user) => `${emote} Sorry, ${user}.\nYou have no permission to run this command.`,
    noArgs: (command) => `This command requires arguments\nIf you need: type \`.help ${command} \` For more instructions about this command`,
    devOnly: 'this command is only available to my developer:(',
    cantEmbed: 'I need permission to send embeds :(',
    cooldown: (user) => `Hey! ${user}! This command has cooldowns...\n~~Can't overheat, i'm too young~~`,
    notChannel: 'I need you to be on a voice channel...',
    cantJoinChannel: 'I can\'t join your channel :(',
    notInSameChannel: 'You\'re not in the same channel as me...',
    missingPermissionConnect: 'I need more permission to join there!',
    missingPermissionSpeak: 'I need permission to speak'
  },


  /* Commands */
  command: {
    aliases: 'Aliases',
    cooldown: 'Cooldown',
    permission: 'Permission',
    developer: 'Developer',
    anyone: 'Everyone',

    help: {
      /* specific */
      title: '🧭 Help',
      requestUser: (user) => `Requested by ${user}`,

      /* general */
      name: 'help',
      aliases: ['h'],
      description: 'Shows help cards\nShows specific card if command name is specified\nUse the bottom controls to navigate.',
      usage: '`cmd`'
    },

    ping: {
      name: 'ping',
      aliases: [''],
      description: 'You know ping pong? that\'s not it',
      usage: 'ping'
    },

    uptime: {
      name: 'uptime',
      aliases: ['up'],
      description: 'Shows my running uptime. \n ~~dude, this is slavery~~'
    },

    clear: {
      /* specific */
      exceeded: (author, amount, limit) => `${author} \`${amount} + Command\`  Exceed the usage of: \`${limit}\` messages at the same time.`,
      tooFew: (emote, amount) => `${emote} Only ${amount}? Delete yourself.`,
      tooOld: (emote) => `${emote} Can't delete old messages`,
      tooOldContinue: (emote) => `${emote} Discord is pitty about it ~~i'm deleting what i can~~`,
      progress: (emote, amount) => `${emote} Erasing a total of \`${amount}\` messages`,
      done: (emote, amount) => `${emote} ${amount} messages deleted`,

      /* general */
      name: 'clear',
      aliases: ['c', 'clean', 'purge'],
      description: 'Clears `x` messages from the channel where it\'s called\nCan\'t delete messages older than 14d.\nLimite de 99 mensagens',
      usage: '`amount`\nex: `purge 50`'
    },

    qrcode: {
      name: 'qr',
      aliases: ['qrcode', 'qrgen'],
      description: 'Generates QRCode from URL\nYoucan generate multiple QRCodes by giving it many links',
      usage: '`url`'
    },

    color: {
      /* specific */

      /* error */
      noAttachment: 'Can\'t calculate colors without an image',
      notExpected: 'Format unexpected, type `!help colors` for more information',
      unableDownload: 'Ops. I failed downloading this image\nPlease, contact the guy called Nodge',
      mustbeNumber: 'Argument needs to be a number\nYou can also leave it empty for `5`.\nType `!help colors` for more information',

      /* embed */
      color: 'Color',
      format: 'Format',
      type: 'Type',
      title: (emote, name) => `${emote} Swatches generated.`,
      preview: 'Preview',
      requestUser: (user) => `Requested by ${user}`,
      amount: 'Swatches',

      /* messages */
      progress: (emote) => `${emote} Generating colors, wait a moment`,
      done: (emote, name) => `${emote} Generated a selection of colors from ${name}`,
      rgb: (r, g, b) => `${r}, ${g}, ${b}`,

      name: 'getcolor',
      aliases: ['color', 'colors', 'yoinkcolors', 'swatches'],
      description: 'Gets color scheme from image.\nThe image needs to be sent with the command\nExtensions allowed: .PNG, .JPG, .SVG & .GIF',
      usage: '`amount`'
    },

    wiki: {
      searching: (emote) => `${emote} Searching wikipedia`,
      randomTitle: (title) => `Random result: ${title}`,
      noResult: (title) => `Nothing found for ${title}`,

      name: 'wiki',
      aliases: ['wiki', 'knows', 'what'],
      description: 'Searchs for page on wikipedia (or shows a random knowledge)',
      usage: '`<search term>`'
    },

    setAvatar: {
      loading: (emote) => `${emote} Swapping avatar`,
      limitRate: 'You\'re changing avatar too quick, discordapi doesn\'t like this.',
      done: (emote) => `${emote} Avatar changed :)`,

      name: 'setavatar',
      description: 'Replace the ~~mine~~ avatar.',
      aliases: ['botavatar', 'setavatar'],
      usage: '[anex image with command]'
    },

    setName: {
      loading: (emote) => `${emote} Changing username`,
      limitRate: 'You\'re changing username too quick, discordapi doesn\'t like this.',
      done: (emote) => `${emote} Name changed :)`,

      name: 'setusername',
      description: 'Changes bot name',
      aliases: ['setusername', 'changename', 'swarpname'],
      usage: ''
    },

    avatar: {
      userNotFound: 'User not found.',
      avatar: (user) => `Avatar ${user}`,

      name: 'avatar',
      aliases: ['getavatar', 'getimage'],
      description: 'Gets avatar from user'
    },

    userInfo: {
      notFound: 'User not found',
      visibleName: 'Visible name:',
      id: 'ID:',
      rank: 'Rank:',
      joinDate: 'Join:',
      memberSince: 'Since:',

      name: 'userinfo',
      description: 'Shows information about specific user',
      aliases: ['csi', 'quem', 'who', 'infouser'],
      usage: '`@User`'
    },

    config: {
      name: 'config',
      description: 'General setting for Winthemers\nUse without arguments to see interactive list',
      usage: 'config `name`',
      aliases: ['config', 'conf', 'settings', 'cc', 'settings'],
      title: '🔧 Bot settings.',

      loading: emote => `${emote} Loading config list`,
      currentValue: '📝 Current value',
      configName: '📛 Option name',
      configDescription: '📜 Description',
      changeQuestion: '> Do you want to change the current value?',
      typeValuePrompt: '> Type new value...',
      restarting: 'Done! I\'m restarting to apply changes.',

      token: { name: 'Token', desc: 'Discord bot TOKEN\nThis token authenticates with discord API.\nCAUTION!' },
      developerID: { name: 'Developer ID', desc: 'Discord User ID from developer\nCaution: This is what checks the integrity when managing important configs.' },
      prefix: { name: 'Prefix', desc: 'Prefix before commands\nPrefix can have multiple characters, avoid spaces' },
      language: { name: 'Language', desc: 'Language to be used on the bot\nValid options: en-us & pt-br' },
      locale: { name: 'Locale', desc: 'Locale for date and search operations' },
      botStatus: { name: 'Presence status', desc: 'Discord RICH presence status to be shown\nVisible on members list.' },
      timeZone: { name: 'Timezone', desc: 'Bot timezone' },

      customActivity: { name: 'Activity', desc: 'Show bot activity?\nUse true/false' },
      activityStatus: { name: 'Activity name', desc: 'What should be shown on bot status' },
      activityType: { name: 'Activity type', desc: 'Rich presence type: (LISTENING/STREAMING/PLAYING)' },
      streamingURL: { name: 'Twitch link', desc: 'If STREAMING is set as activity type, here is where you cange the twitch link' },

      clearCache: { name: 'Clear cache?', desc: 'Bot should delete files after downloading attachments to cache? (true/false)' },
      cacheInterval: { name: 'Cache interval', desc: 'Time between each cache cleanup (seconds)' },
      enableWebsocket: { name: 'Enable websocket?', desc: 'Enable websocket? (true/false)' },
      websocketAddress: { name: 'Websocket address', desc: 'Websocket address' },
      ownerList: { name: 'Admin list', desc: 'A list with all server admins\nOnly used in emergency, doesn\'t need to be changed often.' },
      guildID: { name: 'Guild ID', desc: 'UniqueID from server (discord)' },
      YOUTUBE_API_KEY: { name: 'API Key Youtube', desc: 'Youtube api token for playing music' },
      SOUNDCLOUD_CLIENT_ID: { name: 'API Key soundcloud', desc: 'Soundcloud api for playing music' },
      MAX_PLAYLIST_SIZE: { name: 'Playlist maximum size', desc: 'Sets the maximum amount of musics in a playlis.' },
      PRUNING: { name: 'Prunning', desc: 'Enable prunning?' },
      STAY_TIME: { name: 'Presence time', desc: 'Time which bot will stay in a channel waiting for further commands' },
      DEFAULT_VOLUME: { name: 'Default volume', desc: 'Volume where bot starts playing music' }
    },

    /* God please help me, these are the fucking music related translations... */
    loop: {
      name: 'Loop',
      description: 'Toggles music loop',
      aliases: ['l', 'loop', 'repeat'],
      cooldown: 3
    },

    lyrics: {

      name: 'Lyrics',
      description: 'Finds currently playing music lyrics',
      aliases: ['ly', 'lyrics', 'letra'],

      errorNotQueue: 'No music in playlist.',
      lyricsNotFound: 'Lyrics not found',
      title: title => `Sketchy lyrics.com: ${title}`

    },

    move: {
      name: 'Move',
      description: 'Moves music between playlist position',
      aliases: ['move', 'mv'],
      cooldown: 3,

      errorNotQueue: 'No musics in playlist.',
      result: (author, title, index) => `${author.username} Moved \`${title}\` to position ${index}`

    },

    nowPlaying: {
      name: 'Now Playing',
      aliases: ['np', 'nowplaying', 'playing'],
      usage: '',
      description: 'Show information about currently playing music',

      title: 'Playing now',
      timeRemaning: time => `Remaining: ${time}`
    },

    play: {
      name: 'play',
      aliases: ['p', 'play'],
      description: 'Plays one or more music\'s in your voice chat\nYou can run this command multiple times to add more musics to playlist.',
      usage: '`name` or `link` | You need to be in a voice chat.',

      queueError: 'Oops, error...',
      errorNotChannel: 'You need to be in a voice chat.',
      startedPlaying: (title, url) => `Playing now: \`${title}\`\nSource: ${url}`,
      stopSong: user => `${user.username} Stopped music`,
      mutedSong: user => `${user.username} Muted bot`,
      unmutedSong: user => `${user.username} Unmuted bot`,
      decreasedVolume: (user, volume) => `${user.username} Reduced volume to ${volume}`,
      increasedVolume: (user, volume) => `${user.username} Increased volume to ${volume}`,
      loopSong: (user, loop) => `${user.username} Change loop state to: ${loop}`,
      queueEnded: 'Playlist ended.',
      leaveChannel: 'Alright, goodbye.',
      skipSong: user => `${user.username} Skipped music.`,
      pauseSong: user => `${user.username} Paused music.`,
      resumeSong: user => `${user.username} Resumed music.`,
      queueAdded: (title, user) => `${user.username} Added \`${title}\` to the playlist.`
    },

    pause: {
      name: 'Pause',
      description: 'Pauses ongoing music',
      aliases: ['ps', 'pause'],
      usage: '',

      errorNotQueue: 'No music in queue to be paused.',
      pause: user => `${user.username} Paused music.`
    },

    skip: {
      name: 'Skip',
      description: 'Skips current song.',
      aliases: ['skip', 'sk'],
      usage: '',

      result: user => `${user.username} Skipped music`,
      errorNotQueue: 'No music on playlist'
    },

    skipto: {
      name: 'Skip to',
      description: 'Skips to a specific music on playlist\nUse playlist position number as argument',
      aliases: ['st', 'skipto'],
      usage: '`position`',

      errorNotQueue: 'Empty music playlist',
      errorNotValid: lenght => `Position invalid.\nTotal playlist musics: ${lenght}`,
      result: (user, index) => `${user} Skipped to position ${index}`,
      errorNotChannel: 'You need to be in a voice chat.'
    },

    stop: {
      name: 'Stop',
      description: 'Stops music\nThis command will also clear playlist',
      aliases: ['stop', 's'],
      usage: '',


      errorNotQueue: 'Empty music playlist',
      result: user => `${user.username} Stopped music completely.`
    },

    shuffle: {
      name: 'Shuffle',
      description: 'Toggle shuffle mode for playlists\nWhen enabled, the playing order will be shuffled',
      aliases: ['sh', 'shuffle'],
      usage: '',

      result: user => `${user.username} Enabled shuffle`
    },

    remove: {
      name: 'Remove',
      description: 'Removes music from list',
      aliases: ['rm', 'remove'],
      usage: '`Playlist position`',

      errorNotQueue: 'Empty music playlist'
    },

    resume: {
      errorNotQueue: 'Empty music playlist',
      resultNotPlaying: user => `${user.username} Resumed music`,
      errorPlaying: 'can\'t resume music :(',
      errorNotChannel: 'You need to be in a voice chat.',


      name: 'Resume',
      description: 'Resumes music that was paused using the pause cmd',
      aliases: ['r', 'resume'],
      usage: ''
    },

    queue: {

    },

    volume: {

      errorNotQueue: 'Empty music playlist',
      currentVolume: current => `Actual volume: ${current}`,
      errorNotNumber: 'Argument needs to be between 0 & 100.',
      errorNotValid: 'Invalid argument',
      result: vol => `Volume changed to ${vol}`
    }

  },

  /* Contexts */
  none: 'None'

}

module.exports = {
  lang
}
