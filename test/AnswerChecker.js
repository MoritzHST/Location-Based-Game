const assert = require('assert');
const answerChecker = require('../helper/answerChecker');
const objects = require('../mongodb/objects');
const ObjectID = require('mongodb').ObjectID;

let mockedCorrectAnswer = new objects.Answer("wahr", true);
let mockedWrongAnswer = new objects.Answer("falsch", false);

let mockedGame = new objects.SimpleQuiz(
    "Was ist ein Test?",
    [
        mockedCorrectAnswer,
        new objects.Answer("jup", true),

        mockedWrongAnswer,
        new objects.Answer("nope", false),
        new objects.Answer("nein", false),
        new objects.Answer("wrong", false)
    ],
    100
);
let mockedLocation = new objects.Location("100", "100");
mockedLocation._id = ObjectID("testtesttest");
let mockedMapping = new objects.LocationMapping(
    mockedLocation,
    new objects.Exposition("TestAusstellung", "TestBeschreibung"),
    [mockedGame]);
let mockedEvent = new objects.Event("TestEvent", "", [mockedMapping]);

describe('AnswerChecker', function () {
    describe('checkAnswer()', function () {
        it('Falsche Antworten sollen false als Wert zurück liefern', function () {
            let result = answerChecker.checkAnswer(mockedWrongAnswer.answer, mockedGame);
            assert.equal(result, false);
        });
        it('Richtige Antworten sollen true als Wert zurück liefern', function () {
            let result = answerChecker.checkAnswer(mockedCorrectAnswer.answer, mockedGame);
            assert.equal(result, true);
        });
    });
    describe('findLocationById()', function () {
        it('Location Objekt soll zurückgegeben werden, wenn es im Event vorhanden ist', function () {
            let result = answerChecker.findLocationById(mockedEvent, mockedLocation._id);
            assert.equal(result, mockedMapping);
        });
        it('Null soll zurückgegeben werden, wenn es im Event nicht vorhanden ist', function () {
            let result = answerChecker.findLocationById(mockedEvent, "000000000000");
            assert.equal(result, null);
        });
    });
});