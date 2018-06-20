//Liste aller verfügbaren Spiele
var gameList;
var newMap = new Map();
var updateMap = new Map();
var delMap = new Map();
var selectedGame;
var selectedAnswer;

$(document).ready(function () {
    $(".details input").prop("disabled", true);
    $("#delete-game-button , #new-answer-button , #delete-answer-button").addClass("disabled"); // NOSONAR
    $("#button-save-template.ui-button, #button-import-template.ui-button").prop("disabled", true);
    // Save-Button neu registrieren
    let saveButton = $("#button-save");
    saveButton.off("click");
    saveButton.on("click", function () {
        failedItems = [];
        let calls = [];
        let newList = Array.from(newMap.values());
        let updList = Array.from(updateMap.values());
        let delList = Array.from(delMap.values());

        // Neue Räume persistieren
        for (let i in newList) {
            if (newList.hasOwnProperty(i) && isValid(newList[i])) {
                calls.push(
                    ajaxRequest("/insert/games", "POST", JSON.stringify({
                        question: newList[i].question,
                        type: newList[i].type,
                        points: newList[i].points,
                        answers: newList[i].answers
                    }), function () {
                    }, function () {
                        failedItems.push(newList[i])
                    }));
            }
            else {
                failedItems.push(newList[i]);
            }
        }
        // geänderte RÄume persistieren
        for (let i in updList) {
            if (updList.hasOwnProperty(i) && isValid(updList[i])) {
                calls.push(
                    ajaxRequest("/update/games/" + updList[i]._id, "POST", JSON.stringify({
                        question: updList[i].question,
                        type: updList[i].type,
                        points: updList[i].points,
                        answers: updList[i].answers
                    }), function () {
                    }, function () {
                        failedItems.push(updList[i]);
                    }));

            }
            else {
                failedItems.push(updList[i]);
            }
        }
        // Räume löschen
        for (let i in delList) {
            if (delList.hasOwnProperty(i)) {
                calls.push(
                    $.post("/delete/games", {_id: delList[i]._id})
                        .done(function () {

                        })
                        .fail(function () {
                            failedItems.push(updList[i]);
                        }));
            }
            else {
                failedItems.push(updList[i]);
            }
        }

        $.when.apply($, calls).done(function () {
            init()
                .then(function () {
                    for (let i in failedItems) {
                        if (failedItems[i].isNew) {
                            appendRow(failedItems[i]);
                            $("#" + rowId).addClass("failed");
                        }
                        else {
                            for (let j in gameList) {
                                if (gameList[j]._id && gameList[j]._id.toString() === failedItems[i]._id.toString()) {
                                    $("#" + j).addClass("failed");
                                }
                            }
                        }
                    }
                });
        });
    });

    $("#new-game-button").on("click", function () {
        //Einmal das alte Objekt speichern
        storeOld();
        //Neu initialisieren und flaggen
        selectedGame = {};
        selectedGame.isNew = true;
        //Fake-ID geben die nicht weiter geändert wird, um es in Map ablegen zu können
        selectedGame._id = "pseudoId-" + rowId;
        selectedGame.points = 0;
        selectedGame.question = "";
        selectedGame.type = Game.SINGLE_CHOICE.type;
        selectedGame.answers = [];

        appendRow(selectedGame);

        $("#" + (rowId)).addClass("ui-selected").siblings().removeClass("ui-selected");
        updateDetails();
    });

    $("#delete-game-button").on("click", function () {
        if (!selectedGame) {
            return;
        }
        selectedGame.remove = true;
        $(".ui-selected").find(".bs").addClass("delete-item");
        delMap.set(selectedGame._id, selectedGame);
        storeOld();
    });

    $("#new-answer-button").on("click", function () {
        if (!selectedGame) {
            return;
        }
        storeOld();
        selectedAnswer = {};
        selectedAnswer.answer = "";
        selectedAnswer.isCorrect = false;
        selectedAnswer.isCorrectReadable = "Falsch";

        addRow($("#answer-list"), selectedAnswer, undefined, {
            text: "isCorrectReadable",
            classes: "game-answer-iscorrect"
        }, {text: "answer", classes: "game-answer-answer"}).attr("answer-id", selectedGame.answers.length);

        selectedGame.answers.push(selectedAnswer);

        delete selectedAnswer.isCorrectReadable;
    });

    $("#delete-answer-button").on("click", function () {
        if (!selectedGame || !selectedAnswer) {
            return;
        }

        storeOld();
        selectedGame.answers.splice($("#answer-list .ui-selected").attr("answer-id"), 1);
        updateDetails();
        selectedAnswer = undefined;
    });

    init();
});

async function init() {
    return new Promise(resolve => {
        $.get("/find/games").done(function (result) {
            $(".data-row").remove();
            for (event in result) {
                appendRow(result[event]);
            }
            resolve(true);
        }).fail(function () {
            resolve(false);
        }).always(function () {
            $("#games-list").bind('mousedown', function (event) {
                event.metaKey = true;
            }).selectable({
                filter: 'tr',
                selected: function (event, ui) {
                    $(".details input:not(#game-answer-answer, #game-answer-iscorrect)").prop("disabled", false);
                    $("#delete-game-button, #new-answer-button").removeClass("disabled");
                    $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
                    selectedGame = gameList[$("#games-list .ui-selected").prop("id")];
                    updateDetails();
                },
                unselected: function () {
                    $(".details input").prop("disabled", true);
                    $("#delete-game-button, #new-answer-button").addClass("disabled");
                    selectedGame = undefined;
                    selectedAnswer = undefined;
                }
            });

            $("#answer-list").bind('mousedown', function (event) {
                event.metaKey = true;
            }).selectable({
                filter: 'tr',
                selected: function (event, ui) {
                    $("#delete-answer-button").removeClass("disabled");
                    $("#game-answer-answer, #game-answer-iscorrect").prop("disabled", false);
                    $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
                    selectedAnswer = selectedGame.answers[$("#answer-list .ui-selected").attr("answer-id")];
                    updateAnswerDetails();
                },
                unselected: function () {
                    $("#delete-answer-button").addClass("disabled");
                    $("#game-answer-answer, #game-answer-iscorrect").prop("disabled", true);
                    selectedAnswer = undefined;
                }
            });
        });
        for (let i in Game) {
            if (Game.hasOwnProperty(i) && Game[i].name && Game[i].type) {
                $("<option/>", {
                    value: Game[i].type,
                    text: Game[i].name
                }).appendTo($("#game-type-textfield"));
            }
        }
    });
}


function appendRow(pObj) {
    //Ist die Ausstellungsliste initialisiert? Wenn nein tu es
    if (!(Array.isArray(gameList))) {
        gameList = [];
    }

    pObj.typeReadable = Game.getNameByType(pObj.type);
    addRow($("#games-list"), pObj, {classes: "game-bs-cell " + (pObj.isNew ? "new-item" : "")}, {
        classes: "games-type-cell",
        text: "typeReadable"
    }, {classes: "games-points-cell", text: "points"}, {classes: "games-question-cell", text: "question"});
    delete pObj.typeReadable;

    gameList[rowId] = pObj;
}

function updateDetails() {
    let selRow = $("#games-list .ui-selected");
    let detailsElements = $("#game-question-textfield, #game-points-textfield, #game-type-textfield");

    detailsElements.off("input");
    detailsElements.on("input", function () {
        if (!($(selRow).find(".bs").hasClass("delete-item") || $(selRow).find(".bs").hasClass("new-item")))
            $(selRow).find(".bs").addClass("edit-item");
        selectedGame.question = $("#game-question-textfield").val();
        selectedGame.points = $("#game-points-textfield").prop("value");
        selectedGame.type = $("#game-type-textfield>option:selected").val();
        $(selRow).find(".games-question-cell").text(selectedGame.question);
        $(selRow).find(".games-points-cell").text(selectedGame.points);
        $(selRow).find(".games-type-cell").text(Game.getNameByType(selectedGame.type));

        storeOld();
    });
    $("#game-question-textfield").val(selectedGame.question);
    $("#game-points-textfield").val(selectedGame.points);
    $("#game-type-textfield").val(selectedGame.type);
    $("#game-answer-answer").val("");
    $("#game-answer-iscorrect").prop("checked", false);

    $("#answer-list .data-row").remove();
    if (selectedGame.answers.length > 0) {
        for (let i in selectedGame.answers) {
            selectedGame.answers[i].isCorrectReadable = selectedGame.answers[i].isCorrect.toString() === "true" ? "Richtig" : "Falsch";
            addRow($("#answer-list"), selectedGame.answers[i], undefined, {
                text: "isCorrectReadable",
                classes: "game-answer-iscorrect"
            }, {text: "answer", classes: "game-answer-answer"}).attr("answer-id", i);
            delete selectedGame.answers[i].isCorrectReadable;
        }
    }
}

function updateAnswerDetails() {
    let selRow = $("#answer-list .ui-selected");
    let detailsElements = $("#game-answer-answer, #game-answer-iscorrect");

    detailsElements.off("input");
    detailsElements.on("input", function () {
        let parentRow = $("#games-list .ui-selected");
        if (!($(parentRow).find(".bs").hasClass("delete-item") || $(parentRow).find(".bs").hasClass("new-item")))
            $(parentRow).find(".bs").addClass("edit-item");
        selectedAnswer.answer = $("#game-answer-answer").val();
        selectedAnswer.isCorrect = $("#game-answer-iscorrect").prop("checked");
        $(selRow).find(".game-answer-answer").text(selectedAnswer.answer);
        let readable = selectedAnswer.isCorrect.toString() === "true" ? "Richtig" : "Falsch";
        $(selRow).find(".game-answer-iscorrect").text(readable);

        storeOld();
    });

    $("#game-answer-answer").val(selectedAnswer.answer);
    $("#game-answer-iscorrect").prop("checked", selectedAnswer.isCorrect);
}

function storeOld() {
    if (!selectedGame) {
        return;
    }

    if (selectedGame._id.startsWith("pseudoId-")) {
        if (selectedGame.remove) {
            newMap.delete(selectedGame._id);
        }
        else {
            newMap.set(selectedGame._id, selectedGame);
        }
    }
    else if (selectedGame._id) {
        if (selectedGame.remove) {
            updateMap.delete(selectedGame._id);
        }
        else {
            updateMap.set(selectedGame._id, selectedGame);
        }
    }
}

function isValid(pObj) {
    if (!pObj) {
        return false;
    }
    if (!pObj.question || pObj.question.trim() === "") {
        return false;
    }
    if (!pObj.points || pObj.points.toString().trim() === "" || isNaN(pObj.points)) {
        return false;
    }
    if (!pObj.type || pObj.type.trim() === "") {
        return false;
    }
    if (!(Array.isArray(pObj.answers))) {
        return false;
    }
    let atLeastOneTrue;
    for (let i in pObj.answers) {
        if (typeof pObj.answers[i].isCorrect !== "boolean") {
            return false;
        }
        if (pObj.answers[i].isCorrect) {
            atLeastOneTrue = true;
        }
        if (!pObj.answers[i].answer || pObj.answers[i].answer.trim() === "") {
            return false;
        }
        for (let j in pObj.answers) {
            if (i !== j && pObj.answers[i].answer.trim() === pObj.answers[j].answer.trim()) {
                return false;
            }
        }
    }
    if (!atLeastOneTrue) {
        return false;
    }

    return true;
}