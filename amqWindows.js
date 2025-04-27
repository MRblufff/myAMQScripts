// ==UserScript==
// @name         AMQ Auto-Resize Window
// @namespace    your-namespace
// @version      1.0
// @description  Custom AMQ Window that resizes automatically based on its content
// @match        https://animemusicquiz.com/*
// @grant        none
// ==/UserScript==

if (typeof Listener === "undefined") return;
windowSetup();

class AMQWindow {
    constructor(data) {
        this.id = data.id || "";
        this.title = data.title || "Window";
        this.draggable = data.draggable || false;
        this.position = data.position || { x: 0, y: 0 };
        this.zIndex = data.zIndex || 1060;

        this.window = $("<div></div>")
            .addClass("customWindow")
            .addClass(data.class || "")
            .attr("id", this.id)
            .css({
                position: "absolute",
                zIndex: this.zIndex,
                top: this.position.y,
                left: this.position.x
            });

        this.content = $("<div class='customWindowContent'></div>");

        this.header = $("<div class='modal-header customWindowHeader'></div>")
            .addClass(this.draggable ? "draggableWindow" : "")
            .append($("<div class='close' type='button'><span aria-hidden='true'>&times;</span></div>").click(() => this.close()))
            .append($("<h2 class='modal-title'></h2>").text(this.title));

        this.body = $("<div class='modal-body customWindowBody'></div>");

        this.content.append(this.header).append(this.body);
        this.window.append(this.content);
        $("#gameContainer").append(this.window);

        if (this.draggable) {
            this.window.draggable({
                handle: this.header,
                containment: "#gameContainer"
            });
        }
    }

    setId(newId) {
        this.id = newId;
        this.window.attr("id", newId);
    }

    setTitle(newTitle) {
        this.title = newTitle;
        this.header.find(".modal-title").text(newTitle);
    }

    setZIndex(newZIndex) {
        this.zIndex = newZIndex;
        this.window.css("z-index", this.zIndex);
    }

    isVisible() {
        return this.window.is(":visible");
    }

    clear() {
        this.body.children().remove();
    }

    open() {
        this.window.show();
    }

    close() {
        this.window.hide();
    }

    addContent(element) {
        this.body.append(element);
    }
}

function windowSetup() {
    if ($("#customWindowStyle").length) return;

    const style = document.createElement("style");
    style.type = "text/css";
    style.id = "customWindowStyle";
    style.appendChild(document.createTextNode(`
        .customWindow {
            background-color: #424242;
            border: 1px solid rgba(27, 27, 27, 0.2);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
            user-select: text;
            display: none;
            max-width: 90vw;
            max-height: 90vh;
            overflow: auto;
        }
        .draggableWindow {
            cursor: move;
        }
        .customWindowBody {
            width: 100%;
            height: auto;
            overflow-y: auto;
            max-height: 80vh;
        }
        .customWindowContent {
            width: 100%;
            position: relative;
        }
        .customWindow .close {
            font-size: 32px;
            cursor: pointer;
        }
    `));
    document.head.appendChild(style);
}
