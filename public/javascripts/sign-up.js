window.onload = init;

function init() {
    setNodeHookFromFile($('head'), document.getElementById("header-hook"), "../partials/header/header.html");
}