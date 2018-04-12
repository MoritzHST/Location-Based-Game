const Filter = require('bad-words');
const wordList = require('./badwords.json');
const regex = new RegExp("^([a-zA-Z]{3,20})$");
const filter = new badwordFilter();

function badwordFilter() {
    this.filter = new Filter();
    this.length = function () {
        return filter.list.length;
    };

    /**
     * only letters are allowed for usernames
     * the maximum length is 20 Characters
     * the minimim length is 3 Characters
     */
    this.isValid = function (pUsername) {
        if (!regex.test(pUsername)) {
            return false;
        }
        return !this.filter.isProfane(pUsername);
    };

    /**
     * Adds more badwords to the list. These badwords are read from badwords.json file
     * Badword list by http://www.hyperhero.com/de/insults.htm (10.04.2018)
     */
    this.filter.addWords(wordList["words"]);
}

module.exports = {
    filter: filter
};