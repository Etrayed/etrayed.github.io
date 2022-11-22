function printToConsole(message) {
    var outputBox = $("#output-box");

    outputBox.html(outputBox.html() + message + "<br>");

    scrollToBottom();
}

function scrollToBottom() {
    var cliContent = $("#cli-content");

    cliContent.scrollTop(cliContent.prop("scrollHeight"));
}

function clearConsole() {
    $("#output-box").text("");

    printToConsole("© EtrayedDEV");
    printToConsole("");
    printToConsole("Type 'help' to see a list of available commands.");
    printToConsole("");
}

const commandMap = {};

function processCommand(command) {
    var parts = command.split(" ");
    var args = parts.slice(1, parts.length);
    var name = parts[0].toLowerCase();

    if (commandMap[name] === undefined) {
        printToConsole("Command not found: '" + command + "'. Type 'help' for a list of commands.");
        printToConsole("");

        return;
    }

    commandMap[name](args);
}

function setPrefix() {
    $("#input-prefix").text("guest@etrayed.dev>");
}

function checkSubmit(event) {
    var text = event.target.value;

    if(event.key == "Enter" && text.length != 0) {
        printToConsole($("#input-prefix").text() + " " + text);
        printToConsole("");
        processCommand(text);

        event.target.value = "";
    }

    scrollToBottom();
}

var advancedMode = window.localStorage.getItem("advancedMode");

function registerCommands() {
    commandMap["help"] = (_) => {
        printToConsole("\t<b>github</b> - My GitHub Account");
        printToConsole("\t<b>twitter</b> - My Twitter Account");
        printToConsole("\t<b>ide</b> - The IDE I'm using");
        printToConsole("\t<b>about</b> - Who am I")
        printToConsole("");
        printToConsole("\t<b>clear</b> - Clears the console");
        printToConsole("\t<b>ip</b> - Shows your IP")
        printToConsole("");
    };
    commandMap["github"] = (_) => {
        printToConsole("GitHub: " + wrapLink("https://github.com/Etrayed/"));
        printToConsole("");
    }
    commandMap["twitter"] = (_) => {
        printToConsole("Twitter: " + wrapLink("https://twitter.com/Etrayed/"));
        printToConsole("");
    }
    commandMap["ide"] = (_) => {
        printToConsole("I'm currently using various JetBrains products, thanks to my student license, to work on my projects: " + wrapLink("https://jetbrains.com"));
        printToConsole("");
    }
    commandMap["about"] = (_) => {
        printToConsole("My name is Miklas and I'm a 17 year old German programming enthusiast. I'm currently in 12th grade and working on my Abitur.");
        printToConsole("");
    }

    commandMap["clear"] = (_) => clearConsole();
    commandMap["ip"] = (_) => {
        printToConsole("Getting IP... (Powered by ipify.org)")
        printToConsole("");

        $.get("https://api.ipify.org", function(ipv4) {
            printToConsole("IP (v4): " + ipv4);

            $.get("https://api64.ipify.org", function(ipv6) {
                if(ipv4 != ipv6) {
                    printToConsole("IP (v6): " + ipv6);
                }

                printToConsole("");
            });
        });
    }

    commandMap["advanced"] = (_) => {
        advancedMode = !advancedMode;

        printToConsole("Advanced mode: <a style=\"color:" + (advancedMode ? "#0BDA51\">ON" : "#FF2400\">OFF") + "</a>");

        window.localStorage.setItem("advancedMode", advancedMode);
    }
}

function wrapLink(link, text = link) {
    return "<a target=\"_blank\" rel=\"noopener noreferrer\" href=\"" + link + "\"><b>" + text + "</b></a>";
}

$(function () {
    clearConsole();
    setPrefix();
    registerCommands();

    $("#github-btn").hover(() => {
        $("#github-btn").attr("src", "img/GitHub-Mark-Light-64px.png");
    }, () => {
        $("#github-btn").attr("src", "img/GitHub-Mark-64px.png");
    });
});