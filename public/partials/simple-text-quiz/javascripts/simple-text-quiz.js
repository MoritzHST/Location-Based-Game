var answerObj;
function initSimpleTextQuiz(obj) {
    //Die Frage kann immer gesetzt werden
    $("#question-container").html(obj.question);
    //Wurde das Spiel schon gespielt?
    if (!obj.state || obj.state === GameStates.UNPLAYED) {
        initPlayableQuiz(obj);
    }
    else {
        //Antwort-Hint einblenden
        $("#answer-description").css('display', 'block');
        $("#btn_home").on("click", function () {
            location.href = "/";
        }).css('display', 'block');
        //Ursprünglichen Button erzeugen und disablen
        $("<a/>", {
            class: "btn btn-sm btn-primary host-button host-function-button game-answer disabled",
            text: obj.givenAnswer
        }).appendTo($("#answer-container"));
    }

}

function initPlayableQuiz(obj) {
    answerObj = {};
    answerObj.possibleAnswers = [];
    answerObj.gameId = obj._id;
    answerObj.locationId = obj.locationId;

    //Frage persistieren, um Auswertung zu erleichtern
    answerObj.question = obj.question;
    //Selbiges für den Typen
    answerObj.type = obj.type;

    for (let i in obj.answers) {
        if (obj.answers.hasOwnProperty(i)) {
            $("<a/>", {
                class: "btn btn-sm btn-primary host-button host-function-button game-answer",
                text: obj.answers[i].answer
            }).appendTo($("#answer-container"));
        }
    }

    $(".game-answer").each(function () {
        $(this).on("click", function () {
            $(".game-answer").removeClass("active");
            $(this).addClass("active");
            answerObj.answer = $(this).text();
            submitAnswer(answerObj);
        });
    });
}