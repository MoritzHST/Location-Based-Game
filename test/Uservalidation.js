const assert = require('assert');
const validator = require('../validation/user').filter;

describe('Uservalidation', function () {
    describe('isKind()', function () {
        it('Nutzernamen, die Badwords enthalten sollen nicht zulässig sein', function () {
            assert.equal(validator.isKind("ass"), false);
        });
        it('Nutzername darf nicht Null sein', function () {
            assert.equal(validator.isKind(null), false);
        });
        it('Nutzername darf nicht undefined sein', function () {
            assert.equal(validator.isKind(undefined), false);
        });
        it('Nutzernamen, die keine Badwords enthalten sollen zulässig sein', function () {
            assert.equal(validator.isKind("myUsername"), true);
        });
    });
    describe('matchesRegex()', function () {
        it('leere Nutzernamen sind nicht zulässig', function () {
            assert.equal(validator.matchesRegex(""), false);
        });
        it('Nutzernamen, länger als 20 Zeichen, sind nicht zulässig', function () {
            assert.equal(validator.matchesRegex("aaaaaaaaaaaaaaaaaaaaa"), false);
        });
        it('Nutzernamen, die andere Zeichen, als Buchstaben enthalten, sind unzulässig', function () {
            assert.equal(validator.matchesRegex("al2"), false);
        });
        it('Nutzername darf nicht undefined sein', function () {
            assert.equal(validator.matchesRegex(undefined), false);
        });
        it('Nutzernam darf nicht null sein', function () {
            assert.equal(validator.matchesRegex(null), false);
        });
        it('Nutzernamen die der Regex entsprechen sind zulässig', function () {
            assert.equal(validator.matchesRegex("myUsername"), true);
        });
    });
});
