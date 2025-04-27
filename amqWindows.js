if (typeof Listener === "undefined") return;
windowSetup();

class AMQWindow {
    constructor(data = {}) {
        this.id = data.id || "";
        this.title = data.title || "Window";
        this.resizable = data.resizable || false;
        this.draggable = data.draggable || false;
        this.minWidth = data.minWidth || 200;
        this.minHeight = data.minHeight || 100;
        this.position = data.position || { x: 0, y: 0 };
        this.closeHandler = data.closeHandler || (() => {});
        this.zIndex = data.zIndex || 1060;
        this.panels = [];

        this.createWindow(data.class);
    }

    createWindow(customClass = "") {
        this.window = $("<div>")
            .addClass("customWindow")
            .addClass(customClass)
            .attr("id", this.id)
            .css({
                "z-index": this.zIndex,
                top: this.position.y,
                left: this.position.x,
                "min-width": this.minWidth + "px",
                "min-height": this.minHeight + "px",
                "max-width": "90vw",
                "max-height": "90vh",
                "display": "inline-block",
                "position": "absolute",
            });

        this.content = $("<div>").addClass("customWindowContent");

        this.header = $("<div>")
            .addClass(`modal-header customWindowHeader ${this.draggable ? "draggableWindow" : ""}`)
            .append($("<div>").addClass("close").html("&times;").click(() => this.close()))
            .append($("<h2>").addClass("modal-title").text(this.title));

        this.body = $("<div>")
            .addClass("modal-body customWindowBody")
            .css({
                overflow: "visible"
            });

        this.content.append(this.header, this.body);
        this.window.append(this.content);

        if (this.draggable) {
            this.window.draggable({
                handle: this.header,
                containment: "#gameContainer"
            });
        }

        $("#gameContainer").append(this.window);
    }

    open(handler) {
        this.window.show();
        if (handler) handler();
    }

    close(handler) {
        this.window.hide();
        if (handler || this.closeHandler) (handler || this.closeHandler)();
    }

    clear() {
        this.body.empty();
    }

    addPanel(data) {
        const panel = new AMQWindowPanel(data);
        this.panels.push(panel);
        this.body.append(panel.panel);
    }

    setId(id) {
        this.id = id;
        this.window.attr("id", id);
    }

    setTitle(title) {
        this.title = title;
        this.header.find(".modal-title").text(title);
    }

    setZIndex(zIndex) {
        this.zIndex = zIndex;
        this.window.css("z-index", zIndex);
    }

    isVisible() {
        return this.window.is(":visible");
    }
}

class AMQWindowPanel {
    constructor(data = {}) {
        this.id = data.id || "";
        this.width = data.width || "100%";
        this.height = data.height || "auto";
        this.position = data.position || { x: 0, y: 0 };
        this.scrollable = data.scrollable || { x: false, y: false };
        this.panels = [];

        this.panel = $("<div>")
            .addClass("customWindowPanel")
            .addClass(data.class || "")
            .attr("id", this.id)
            .css({
                position: "absolute",
                width: this.getDimension(this.width),
                height: this.getDimension(this.height),
                top: this.getDimension(this.position.y),
                left: this.getDimension(this.position.x),
                "overflow-x": this.scrollable.x ? "auto" : "hidden",
                "overflow-y": this.scrollable.y ? "auto" : "hidden"
            });
    }

    getDimension(value) {
        if (typeof value === "string") return value;
        if (value >= 0 && value <= 1) return (value * 100) + "%";
        return value + "px";
    }

    addPanel(data) {
        const panel = new AMQWindowPanel(data);
        this.panels.push(panel);
        this.panel.append(panel.panel);
    }

    clear() {
        this.panel.empty();
    }

    show() {
        this.panel.show();
    }

    hide() {
        this.panel.hide();
    }

    setId(id) {
        this.id = id;
        this.panel.attr("id", id);
    }
}

function windowSetup() {
    if ($("#customWindowStyle").length) return;
    const style = document.createElement("style");
    style.id = "customWindowStyle";
    style.textContent = `
        .customWindow {
            background-color: #424242;
            border: 1px solid rgba(27, 27, 27, 0.2);
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            overflow: visible;
            margin: 0;
            user-select: text;
            display: inline-block;
        }
        .customWindowContent {
            width: 100%;
            position: relative;
        }
        .customWindowBody {
            width: 100%;
            overflow: visible;
        }
        .draggableWindow {
            cursor: move;
        }
        .customWindow .close {
            font-size: 32px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}
