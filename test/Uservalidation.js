const assert = require('assert');
const validator = require('../validation/user');

describe('Uservalidation', function () {
    describe('isValid()', function () {
        it('should should not allow empty Username', function () {
            assert.equal(validator.filter.isValid(""), false);
        });
        it('should should not allow Usernames longer than 20 Characters', function () {
            assert.equal(validator.filter.isValid("aaaaaaaaaaaaaaaaaaaaa"), false);
        });
        it('should should not allow Usernames that contain other characters than letters', function () {
            assert.equal(validator.filter.isValid("al2"), false);
        });
        it('should should not allow Usernames that contain badwords', function () {
            assert.equal(validator.filter.isValid("ass"), false);
        });
        it('should should allow Usernames that are in bounds and do not contain bad words', function () {
            assert.equal(validator.filter.isValid("myUsername"), true);
        });
    });
});
