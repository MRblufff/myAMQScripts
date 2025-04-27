// AMQ Window Script (Auto-Append Lazy Create Version)
// Do not add to tampermonkey

if (typeof Listener === "undefined") return;
windowSetup();

class AMQWindow {
    constructor(data = {}) {
        this.id = data.id ?? "";
        this.title = data.title ?? "Window";
        this.draggable = data.draggable ?? false;
        this.zIndex = data.zIndex ?? 1060;
        this.closeHandler = data.closeHandler ?? (() => {});
        this.created = false; // บอกว่ายังไม่ append เข้าหน้าเว็บ

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
                display: "none",
            });

        this.content = $("<div class='customWindowContent'></div>");

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

        this.body = $("<div class='modal-body customWindowBody'></div>")
            .css({
                width: "100%",
                height: "auto",
                overflowY: "auto",
                maxHeight: "80vh",
            });

        this.content.append(this.header, this.body);
        this.window.append(this.content);

        if (this.draggable) {
            this.window.draggable({
                handle: this.header,
                containment: "#gameContainer"
            });
        }
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
        if (!this.created) {
            $("#gameContainer").append(this.window);
            this.created = true;
        }
        this.window.show();
        handler?.();
    }

    close(handler) {
        this.window.hide();
        handler?.();
    }

    destroy() {
        this.window.off();
        this.window.remove();
        this.created = false;
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
            padding: 10px;
        }
        .customWindowHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
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
