function initSimpleTextQuiz(obj) {
    answerObj = {};
    answerObj.gameId = obj._id;
    $("#question-container").html(obj.question);

    for (let i in obj.answers) {
        $("<a/>", {
            class: "btn btn-sm btn-primary host-button host-function-button game-answer",
            text: obj.answers[i].answer
        }).appendTo($("#answer-container"));
    }

    $(".game-answer").each(function () {
        $(this).on("click", function () {
            $(".game-answer").removeClass("active");
            $(this).addClass("active");
            answerObj.answer = $(this).text();
        });
    });
}