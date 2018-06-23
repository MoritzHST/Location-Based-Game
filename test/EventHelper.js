const assert = require('assert');
const eventHelper = require('../helper/eventHelper');
const objects = require('../mongodb/objects');

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
let mockedMapping = new objects.LocationMapping(
    mockedLocation,
    new objects.Exposition("TestAusstellung", "TestBeschreibung"),
    [mockedGame]);
let mockedEvent = new objects.Event("TestEvent", "", [mockedMapping]);

describe('EventHelper', function () {
    describe('formatScoreObject()', function () {
        it('Sollte richtig formatiertes Objekt zurück geben', function () {
            let result = eventHelper.formatScoreObject(mockedEvent, new objects.Score());
            assert.equal(result.score, "0 / 100");
            assert.equal(result.games, "0 / 1");
            assert.equal(result.locations, "0 / 1");
        });
        it('Soll übergebenes Score-Objekt zurück geben, wenn kein Event übergeben wurde', function () {
            let score = new objects.Score();
            let result = eventHelper.formatScoreObject(null, score);
            assert.equal(result, score);
        });
    });
});