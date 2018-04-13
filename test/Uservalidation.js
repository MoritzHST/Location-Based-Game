const assert = require('assert');
const validator = require('../validation/user').filter;

describe('Uservalidation', function () {
    describe('isKind()', function () {
        it('should not allow Usernames that contain badwords', function () {
            assert.equal(validator.isKind("ass"), false);
        });
        it('should not allow null value', function () {
            assert.equal(validator.isKind(null), false);
        });
        it('should not allow undefined value', function () {
            assert.equal(validator.isKind(undefined), false);
        });
        it('should allow Usernames that do not contain bad words', function () {
            assert.equal(validator.isKind("myUsername"), true);
        });
    });
    describe('matchesRegex()', function () {
        it('should not allow empty Username', function () {
            assert.equal(validator.matchesRegex(""), false);
        });
        it('should not allow Usernames longer than 20 Characters', function () {
            assert.equal(validator.matchesRegex("aaaaaaaaaaaaaaaaaaaaa"), false);
        });
        it('should not allow Usernames that contain other characters than letters', function () {
            assert.equal(validator.matchesRegex("al2"), false);
        });
        it('should not allow undefined value', function () {
            assert.equal(validator.matchesRegex(undefined), false);
        });
        it('should not allow null value', function () {
            assert.equal(validator.matchesRegex(null), false);
        });
        it('should allow Usernames that match the Regex', function () {
            assert.equal(validator.matchesRegex("myUsername"), true);
        });
    });
});
