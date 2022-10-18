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

function onKeyDown(e) {
    var inputSpan = $("#input-text");
    var newText = inputSpan.text();

    if (e.key == "Backspace") {
        newText = newText.substring(0, newText.length - 1);

        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.selection) {
            document.selection.empty();
        }
    } else if (e.key == "Enter" && newText.length != 0) {
        printToConsole($("#input-prefix").text() + " " + newText);
        printToConsole("");
        processCommand(newText);

        newText = "";
    } else if (e.which == 65 && e.ctrlKey) {
        if (document.selection) { // IE
            var range = document.body.createTextRange();

            range.moveToElementText(inputSpan.get());
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(inputSpan.get());

            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    } else if ((e.which == 67 || e.which == 86) && e.ctrlKey) {
        // do default
    } else if ((e.which >= 48 && e.which <= 90) || (e.which >= 96 && e.which <= 111) || e.key.length == 1 && !(e.ctrlKey || e.shiftKey || e.metaKey)) {
        newText += e.key;

        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.selection) {
            document.selection.empty();
        }
    }

    if (inputSpan.text() != newText) {
        scrollToBottom();
    }

    inputSpan.text(newText);
}

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
}

function wrapLink(link, text = link) {
    return "<a target=\"_blank\" rel=\"noopener noreferrer\" href=\"" + link + "\"><b>" + text + "</b></a>";
}

$(function () {
    window.setInterval(() => $("#input-cursor").toggle(), 500); // Cursor visibility task
    window.onkeydown = onKeyDown;

    $(document).on("paste", (event) => {
        var inputText = $("#input-text");

        inputText.text(inputText.text() + event.originalEvent.clipboardData.getData("Text"));
    });

    clearConsole();
    setPrefix();
    registerCommands();

    $("#github-btn").hover(() => {
        $("#github-btn").attr("src", "img/Github-Mark-Light-64px.png");
    }, () => {
        $("#github-btn").attr("src", "img/Github-Mark-64px.png");
    });
});