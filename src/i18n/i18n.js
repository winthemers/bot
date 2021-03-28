
const config = require('../config.json');
const load   = require('../utils/loadfiles.js');
const log    = require('../utils/log.js');

let translations = new Object(null);

load.translations('i18n', languageList => {
    translations = languageList
})

const i18n = (messageID, ...params) => {
    const language = config.language
    const langObj = translations[language].lang

    let evalString = "langObj." + messageID

    try{

        let returnString = messageID

        if (typeof eval(evalString) === 'function') {
            let fn = eval(evalString)
            returnString = fn(...params)
        } else {
            returnString = eval(evalString)
        }

        if (langObj || 'default' ) {
            return returnString
        } else {
            return "Translation not recognized"
        }
    } catch {
        return evalString
    }


};

module.exports = {
    i18n,
};
