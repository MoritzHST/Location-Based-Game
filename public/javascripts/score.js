$(document).ready(function () {
    setNodeHookFromFile($("#header-hook"), "../partials/header/header.html");
    setNodeHookFromFile($("#highscore-hook"), "../partials/highscore-list/highscore-list.html", undefined, undefined, "initHighscoreList");
});