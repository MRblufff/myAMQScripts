// AMQ Window Script (Auto-Append Improved Version)
// Do not add to Tampermonkey manually

if (typeof Listener === "undefined") return;
windowSetup();

class AMQWindow {
    constructor(data = {}) {
        this.id = data.id ?? "";
        this.title = data.title ?? "Window";
        this.draggable = data.draggable ?? false;
        this.zIndex = data.zIndex ?? 1060;
        this.closeHandler = data.closeHandler ?? (() => {});
        this.created = false; // <-- เพิ่มตัวแปรไว้เช็คว่าถูกโยนเข้า DOM หรือยัง

        this.window = $("<div>", {
            id: this.id,
            class: `customWindow ${data.class ?? ""}`,
            css: {
                position: "relative",
                zIndex: this.zIndex,
                top: (data.position?.y ?? 0) + "px",
                left: (data.position?.x ?? 0) + "px",
                width: "auto",
                height: "auto",
                display: "none",
            },
        });

        this.header = $("<div>", { class: `modal-header customWindowHeader ${this.draggable ? "draggableWindow" : ""}` })
            .append($("<h2>", { class: "modal-title", text: this.title }))
            .append($("<button>", { class: "close", html: "&times;" }).click(() => this.close(this.closeHandler)));

        this.body = $("<div>", { class: "modal-body customWindowBody" });

        this.content = $("<div>", { class: "customWindowContent" })
            .append(this.header, this.body);

        this.window.append(this.content);

        if (this.draggable) {
            this.window.draggable({
                handle: ".customWindowHeader",
                containment: "#gameContainer",
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
        this.window.css("z-index", newZIndex);
    }

    isVisible() {
        return this.window.is(":visible");
    }

    clear() {
        this.body.empty();
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
        this.window.remove();
        this.created = false;
    }
}

function windowSetup() {
    if ($("#customWindowStyle").length) return;

    $("<style>", {
        id: "customWindowStyle",
        text: `
            .customWindow {
                overflow: visible;
                background: #424242;
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
                background: none;
                border: none;
                font-size: 28px;
                line-height: 1;
                cursor: pointer;
                color: #fff;
            }
        `,
    }).appendTo("head");
}
