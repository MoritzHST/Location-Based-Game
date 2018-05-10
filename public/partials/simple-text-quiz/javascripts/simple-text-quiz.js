function initSimpleTextQuiz(obj) {
    $("#question-container").html(obj.question);

    for (let i in obj.answers) {
        $("<a/>", {
            class: "btn btn-sm btn-primary host-button host-function-button col-md-offset-2 col-md-3 game-answer",
            text: obj.answers[i].answer
        }).appendTo($("#answer-container"));
    }
}