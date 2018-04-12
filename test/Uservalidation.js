const assert = require('assert');
const validator = require('../validation/user');

describe('Uservalidation', function () {
    describe('isKind()', function () {
        it('should should not allow Usernames that contain badwords', function () {
            assert.equal(validator.filter.isKind("ass"), false);
        });
        it('should should allow Usernames that do not contain bad words', function () {
            assert.equal(validator.filter.isKind("myUsername"), true);
        });
    });
    describe('matchesRegex()', function () {
        it('should should not allow empty Username', function () {
            assert.equal(validator.filter.matchesRegex(""), false);
        });
        it('should should not allow Usernames longer than 20 Characters', function () {
            assert.equal(validator.filter.matchesRegex("aaaaaaaaaaaaaaaaaaaaa"), false);
        });
        it('should should not allow Usernames that contain other characters than letters', function () {
            assert.equal(validator.filter.matchesRegex("al2"), false);
        });
        it('should should allow Usernames that match the Regex', function () {
            assert.equal(validator.filter.matchesRegex("myUsername"), true);
        });
    });
});
