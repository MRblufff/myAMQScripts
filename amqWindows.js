// AMQ Window Script (Auto Resize Version)
// This code is fetched automatically
// Do not attempt to add it to tampermonkey

if (typeof Listener === "undefined") return;
windowSetup();

class AMQWindow {
    constructor(data) {
        this.id = data.id ?? "";
        this.title = data.title ?? "Window";
        this.draggable = data.draggable ?? false;
        this.zIndex = data.zIndex ?? 1060;
        this.closeHandler = data.closeHandler ?? function () {};

        this.window = $("<div></div>")
            .addClass("customWindow")
            .addClass(data.class ?? "")
            .attr("id", this.id)
            .css({
                position: "relative",
                zIndex: this.zIndex,
                top: (data.position?.y ?? 0) + "px",
                left: (data.position?.x ?? 0) + "px",
                width: "auto",
                height: "auto",
                maxWidth: "90vw",
                maxHeight: "90vh",
            });

        this.content = $(`<div class="customWindowContent"></div>`);
        this.header = $("<div></div>")
            .addClass("modal-header customWindowHeader")
            .addClass(this.draggable ? "draggableWindow" : "")
            .append(
                $("<div class='close' type='button'><span aria-hidden='true'>×</span></div>")
                .click(() => this.close(this.closeHandler))
            )
            .append(
                $("<h2></h2>").addClass("modal-title").text(this.title)
            );

        this.body = $(`<div class="modal-body customWindowBody"></div>`)
            .css({
                width: "100%",
                height: "auto",
                overflowY: "auto",
            });

        this.content.append(this.header);
        this.content.append(this.body);
        this.window.append(this.content);

        if (this.draggable) {
            this.window.draggable({
                handle: this.header,
                containment: "#gameContainer"
            });
        }

        $("#gameContainer").append(this.window);
    }

    setId(newId) {
        this.id = newId;
        this.window.attr("id", this.id);
    }

    setTitle(newTitle) {
        this.title = newTitle;
        this.header.find(".modal-title").text(newTitle);
    }

    setZIndex(newZIndex) {
        this.zIndex = newZIndex;
        this.window.css("z-index", this.zIndex.toString());
    }

    isVisible() {
        return this.window.is(":visible");
    }

    clear() {
        this.body.children().remove();
    }

    open(handler) {
        this.window.show();
        if (handler) handler();
    }

    close(handler) {
        this.window.hide();
        if (handler) handler();
    }
}

function windowSetup() {
    if ($("#customWindowStyle").length) return;
    const style = document.createElement("style");
    style.type = "text/css";
    style.id = "customWindowStyle";
    style.appendChild(document.createTextNode(`
        .customWindow {
            overflow: visible;
            background-color: #424242;
            border: 1px solid rgba(27, 27, 27, 0.2);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
            user-select: text;
            display: none;
            padding: 10px;
        }
        .customWindowHeader {
            cursor: default;
        }
        .draggableWindow {
            cursor: move;
        }
        .customWindowBody {
            width: 100%;
            height: auto;
            overflow-y: auto;
            padding-top: 10px;
        }
        .customWindowContent {
            width: 100%;
            position: relative;
        }
        .customWindow .close {
            font-size: 28px;
            cursor: pointer;
            position: relative;
            top: 10px;
            right: 10px;
        }
    `));
    document.head.appendChild(style);
}
