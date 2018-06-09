const Filter = require('bad-words');
const wordList = require('./badwords.json');
const regex = new RegExp("^([a-zA-Z]{3,20})$");
const filter = new BadwordFilter();

function BadwordFilter() { // NOSONAR
    this.filter = new Filter();

    /**
     * ein Nutzername darf nur aus Buchstaben bestehen
     * maximale Anzahl an Zeichen: 20
     * minimale Anzahl an Zeichen: 3
     */
    this.isKind = function (pUsername) {
        return pUsername !== undefined && pUsername !== null && !this.filter.isProfane(pUsername);
    };

    this.matchesRegex = function (pUsername) {
        return pUsername !== undefined && pUsername !== null && regex.test(pUsername);
    };

    /**
     * Fügt der Liste weitere Wörter hinzu. Diese Wörter entstammen der Datei badwords.json
     * Die Liste wurde aus http://www.hyperhero.com/de/insults.htm (10.04.2018) entnommen
     */
    this.filter.addWords(wordList["words"]);
}

module.exports = {
    filter: filter
};