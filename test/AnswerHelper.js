const assert = require('assert');
const answerHelper = require('../helper/answerHelper');
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

let mockedCorrectVisit = new objects.Visit(mockedMapping, [mockedGame], true);
mockedCorrectVisit.answers = [mockedCorrectAnswer];
let mockedWrongVisit = new objects.Visit(mockedMapping, [mockedGame], false);
mockedWrongAnswer.state = objects.GameStates.WRONG;
mockedWrongVisit.answers = [mockedWrongAnswer];
let mockedIncompleteVisit = new objects.Visit(mockedMapping, [mockedGame], true);
mockedIncompleteVisit.answers = [];

describe('AnswerHelper', function () {
    describe('analizeVisits()', function () {
        it('Korrekt Abgeschlossene Besuche geben FLAWLESS zurück', function () {
            let result = answerHelper.analyzeVisits(mockedCorrectVisit, mockedMapping);
            assert.equal(result, objects.RoomStates.FLAWLESS);
        });
        it('Abgeschlossene Besuche geben COMPLETED zurück', function () {
            let result = answerHelper.analyzeVisits(mockedWrongVisit, mockedMapping);
            assert.equal(result, objects.RoomStates.COMPLETED);
        });
        it('Besuchte Räume geben VISITED zurück', function () {
            let result = answerHelper.analyzeVisits(mockedIncompleteVisit, mockedMapping);
            assert.equal(result, objects.RoomStates.VISITED);
        });
    });

    describe('analizeAnswers()', function () {
        it('Korrekt Abgeschlossene Besuche geben FLAWLESS zurück', function () {
            let result = answerHelper.analyzeAnswers(mockedCorrectVisit);
            assert.equal(result, objects.RoomStates.FLAWLESS);
        });
        it('Abgeschlossene Besuche geben COMPLETED zurück', function () {
            let result = answerHelper.analyzeAnswers(mockedWrongVisit);
            assert.equal(result, objects.RoomStates.COMPLETED);
        });
    });
});