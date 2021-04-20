/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/pts/dist/es2015/Canvas.js":
/*!************************************************!*\
  !*** ./node_modules/pts/dist/es2015/Canvas.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CanvasSpace": () => (/* binding */ CanvasSpace),
/* harmony export */   "CanvasForm": () => (/* binding */ CanvasForm)
/* harmony export */ });
/* harmony import */ var _Space__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Space */ "./node_modules/pts/dist/es2015/Space.js");
/* harmony import */ var _Form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Form */ "./node_modules/pts/dist/es2015/Form.js");
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Util */ "./node_modules/pts/dist/es2015/Util.js");
/* harmony import */ var _Typography__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Typography */ "./node_modules/pts/dist/es2015/Typography.js");
/* harmony import */ var _Op__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Op */ "./node_modules/pts/dist/es2015/Op.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */






class CanvasSpace extends _Space__WEBPACK_IMPORTED_MODULE_0__.MultiTouchSpace {
    constructor(elem, callback) {
        super();
        this._pixelScale = 1;
        this._autoResize = true;
        this._bgcolor = "#e1e9f0";
        this._offscreen = false;
        this._initialResize = false;
        var _selector = null;
        var _existed = false;
        this.id = "pt";
        if (elem instanceof Element) {
            _selector = elem;
            this.id = "pts_existing_space";
        }
        else {
            let id = elem;
            id = (elem[0] === "#" || elem[0] === ".") ? elem : "#" + elem;
            _selector = document.querySelector(id);
            _existed = true;
            this.id = id.substr(1);
        }
        if (!_selector) {
            this._container = this._createElement("div", this.id + "_container");
            this._canvas = this._createElement("canvas", this.id);
            this._container.appendChild(this._canvas);
            document.body.appendChild(this._container);
            _existed = false;
        }
        else if (_selector.nodeName.toLowerCase() != "canvas") {
            this._container = _selector;
            this._canvas = this._createElement("canvas", this.id + "_canvas");
            this._container.appendChild(this._canvas);
            this._initialResize = true;
        }
        else {
            this._canvas = _selector;
            this._container = _selector.parentElement;
            this._autoResize = false;
        }
        setTimeout(this._ready.bind(this, callback), 100);
        this._ctx = this._canvas.getContext('2d');
    }
    _createElement(elem = "div", id) {
        let d = document.createElement(elem);
        d.setAttribute("id", id);
        return d;
    }
    _ready(callback) {
        if (!this._container)
            throw new Error(`Cannot initiate #${this.id} element`);
        this._isReady = true;
        this._resizeHandler(null);
        this.clear(this._bgcolor);
        this._canvas.dispatchEvent(new Event("ready"));
        for (let k in this.players) {
            if (this.players.hasOwnProperty(k)) {
                if (this.players[k].start)
                    this.players[k].start(this.bound.clone(), this);
            }
        }
        this._pointer = this.center;
        this._initialResize = false;
        if (callback)
            callback(this.bound, this._canvas);
    }
    setup(opt) {
        if (opt.bgcolor)
            this._bgcolor = opt.bgcolor;
        this.autoResize = (opt.resize != undefined) ? opt.resize : false;
        if (opt.retina !== false) {
            let r1 = window.devicePixelRatio || 1;
            let r2 = this._ctx.webkitBackingStorePixelRatio || this._ctx.mozBackingStorePixelRatio || this._ctx.msBackingStorePixelRatio || this._ctx.oBackingStorePixelRatio || this._ctx.backingStorePixelRatio || 1;
            this._pixelScale = Math.max(1, r1 / r2);
        }
        if (opt.offscreen) {
            this._offscreen = true;
            this._offCanvas = this._createElement("canvas", this.id + "_offscreen");
            this._offCtx = this._offCanvas.getContext('2d');
        }
        else {
            this._offscreen = false;
        }
        return this;
    }
    set autoResize(auto) {
        this._autoResize = auto;
        if (auto) {
            window.addEventListener('resize', this._resizeHandler.bind(this));
        }
        else {
            window.removeEventListener('resize', this._resizeHandler.bind(this));
        }
    }
    get autoResize() { return this._autoResize; }
    resize(b, evt) {
        this.bound = b;
        this._canvas.width = this.bound.size.x * this._pixelScale;
        this._canvas.height = this.bound.size.y * this._pixelScale;
        this._canvas.style.width = Math.floor(this.bound.size.x) + "px";
        this._canvas.style.height = Math.floor(this.bound.size.y) + "px";
        if (this._offscreen) {
            this._offCanvas.width = this.bound.size.x * this._pixelScale;
            this._offCanvas.height = this.bound.size.y * this._pixelScale;
        }
        if (this._pixelScale != 1) {
            this._ctx.scale(this._pixelScale, this._pixelScale);
            if (this._offscreen) {
                this._offCtx.scale(this._pixelScale, this._pixelScale);
            }
        }
        for (let k in this.players) {
            if (this.players.hasOwnProperty(k)) {
                let p = this.players[k];
                if (p.resize)
                    p.resize(this.bound, evt);
            }
        }
        this.render(this._ctx);
        if (evt && !this.isPlaying)
            this.playOnce(0);
        return this;
    }
    _resizeHandler(evt) {
        let b = (this._autoResize || this._initialResize) ? this._container.getBoundingClientRect() : this._canvas.getBoundingClientRect();
        if (b) {
            let box = _Pt__WEBPACK_IMPORTED_MODULE_2__.Bound.fromBoundingRect(b);
            box.center = box.center.add(window.pageXOffset, window.pageYOffset);
            this.resize(box, evt);
        }
    }
    set background(bg) { this._bgcolor = bg; }
    get background() { return this._bgcolor; }
    get pixelScale() {
        return this._pixelScale;
    }
    get hasOffscreen() {
        return this._offscreen;
    }
    get offscreenCtx() { return this._offCtx; }
    get offscreenCanvas() { return this._offCanvas; }
    getForm() { return new CanvasForm(this); }
    get element() {
        return this._canvas;
    }
    get parent() {
        return this._container;
    }
    get ready() {
        return this._isReady;
    }
    get ctx() { return this._ctx; }
    clear(bg) {
        if (bg)
            this._bgcolor = bg;
        let lastColor = this._ctx.fillStyle;
        if (this._bgcolor && this._bgcolor != "transparent") {
            this._ctx.fillStyle = this._bgcolor;
            this._ctx.fillRect(-1, -1, this._canvas.width + 1, this._canvas.height + 1);
        }
        else {
            this._ctx.clearRect(-1, -1, this._canvas.width + 1, this._canvas.height + 1);
        }
        this._ctx.fillStyle = lastColor;
        return this;
    }
    clearOffscreen(bg) {
        if (this._offscreen) {
            if (bg) {
                this._offCtx.fillStyle = bg;
                this._offCtx.fillRect(-1, -1, this._canvas.width + 1, this._canvas.height + 1);
            }
            else {
                this._offCtx.clearRect(-1, -1, this._offCanvas.width + 1, this._offCanvas.height + 1);
            }
        }
        return this;
    }
    playItems(time) {
        if (this._isReady) {
            this._ctx.save();
            if (this._offscreen)
                this._offCtx.save();
            super.playItems(time);
            this._ctx.restore();
            if (this._offscreen)
                this._offCtx.restore();
            this.render(this._ctx);
        }
    }
    dispose() {
        window.removeEventListener('resize', this._resizeHandler.bind(this));
        this.stop();
        this.removeAll();
        return this;
    }
}
class CanvasForm extends _Form__WEBPACK_IMPORTED_MODULE_1__.VisualForm {
    constructor(space) {
        super();
        this._style = {
            fillStyle: "#f03", strokeStyle: "#fff",
            lineWidth: 1, lineJoin: "bevel", lineCap: "butt",
            globalAlpha: 1
        };
        this._space = space;
        this._space.add({ start: () => {
                this._ctx = this._space.ctx;
                this._ctx.fillStyle = this._style.fillStyle;
                this._ctx.strokeStyle = this._style.strokeStyle;
                this._ctx.lineJoin = "bevel";
                this._ctx.font = this._font.value;
                this._ready = true;
            } });
    }
    get space() { return this._space; }
    get ctx() { return this._space.ctx; }
    useOffscreen(off = true, clear = false) {
        if (clear)
            this._space.clearOffscreen((typeof clear == "string") ? clear : null);
        this._ctx = (this._space.hasOffscreen && off) ? this._space.offscreenCtx : this._space.ctx;
        return this;
    }
    renderOffscreen(offset = [0, 0]) {
        if (this._space.hasOffscreen) {
            this._space.ctx.drawImage(this._space.offscreenCanvas, offset[0], offset[1], this._space.width, this._space.height);
        }
    }
    alpha(a) {
        this._ctx.globalAlpha = a;
        this._style.globalAlpha = a;
        return this;
    }
    fill(c) {
        if (typeof c == "boolean") {
            this.filled = c;
        }
        else {
            this.filled = true;
            this._style.fillStyle = c;
            this._ctx.fillStyle = c;
        }
        return this;
    }
    stroke(c, width, linejoin, linecap) {
        if (typeof c == "boolean") {
            this.stroked = c;
        }
        else {
            this.stroked = true;
            this._style.strokeStyle = c;
            this._ctx.strokeStyle = c;
            if (width) {
                this._ctx.lineWidth = width;
                this._style.lineWidth = width;
            }
            if (linejoin) {
                this._ctx.lineJoin = linejoin;
                this._style.lineJoin = linejoin;
            }
            if (linecap) {
                this._ctx.lineCap = linecap;
                this._style.lineCap = linecap;
            }
        }
        return this;
    }
    gradient(stops) {
        let vals = [];
        if (stops.length < 2)
            stops.push([0.99, "#000"], [1, "#000"]);
        for (let i = 0, len = stops.length; i < len; i++) {
            let t = typeof stops[i] === 'string' ? i * (1 / (stops.length - 1)) : stops[i][0];
            let v = typeof stops[i] === 'string' ? stops[i] : stops[i][1];
            vals.push([t, v]);
        }
        return (area1, area2) => {
            area1 = area1.map(a => a.abs());
            if (area2)
                area2.map(a => a.abs());
            let grad = area2
                ? this.ctx.createRadialGradient(area1[0][0], area1[0][1], area1[1][0], area2[0][0], area2[0][1], area2[1][0])
                : this.ctx.createLinearGradient(area1[0][0], area1[0][1], area1[1][0], area1[1][1]);
            for (let i = 0, len = vals.length; i < len; i++) {
                grad.addColorStop(vals[i][0], vals[i][1]);
            }
            return grad;
        };
    }
    composite(mode = 'source-over') {
        this.ctx.globalCompositeOperation = mode;
        return this;
    }
    clip() {
        this.ctx.clip();
        return this;
    }
    dash(segments = true, offset = 0) {
        if (!segments) {
            this._ctx.setLineDash([]);
            this._ctx.lineDashOffset = 0;
        }
        else {
            if (segments === true) {
                segments = [5, 5];
            }
            this._ctx.setLineDash([segments[0], segments[1]]);
            this._ctx.lineDashOffset = offset;
        }
        return this;
    }
    font(sizeOrFont, weight, style, lineHeight, family) {
        if (typeof sizeOrFont == "number") {
            this._font.size = sizeOrFont;
            if (family)
                this._font.face = family;
            if (weight)
                this._font.weight = weight;
            if (style)
                this._font.style = style;
            if (lineHeight)
                this._font.lineHeight = lineHeight;
        }
        else {
            this._font = sizeOrFont;
        }
        this._ctx.font = this._font.value;
        if (this._estimateTextWidth)
            this.fontWidthEstimate(true);
        return this;
    }
    fontWidthEstimate(estimate = true) {
        this._estimateTextWidth = (estimate) ? _Typography__WEBPACK_IMPORTED_MODULE_4__.Typography.textWidthEstimator(((c) => this._ctx.measureText(c).width)) : undefined;
        return this;
    }
    getTextWidth(c) {
        return (!this._estimateTextWidth) ? this._ctx.measureText(c + " .").width : this._estimateTextWidth(c);
    }
    _textTruncate(str, width, tail = "") {
        return _Typography__WEBPACK_IMPORTED_MODULE_4__.Typography.truncate(this.getTextWidth.bind(this), str, width, tail);
    }
    _textAlign(box, vertical, offset, center) {
        if (!center)
            center = _Op__WEBPACK_IMPORTED_MODULE_5__.Rectangle.center(box);
        var px = box[0][0];
        if (this._ctx.textAlign == "end" || this._ctx.textAlign == "right") {
            px = box[1][0];
        }
        else if (this._ctx.textAlign == "center" || this._ctx.textAlign == "middle") {
            px = center[0];
        }
        var py = center[1];
        if (vertical == "top" || vertical == "start") {
            py = box[0][1];
        }
        else if (vertical == "end" || vertical == "bottom") {
            py = box[1][1];
        }
        return (offset) ? new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(px + offset[0], py + offset[1]) : new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(px, py);
    }
    reset() {
        for (let k in this._style) {
            if (this._style.hasOwnProperty(k)) {
                this._ctx[k] = this._style[k];
            }
        }
        this._font = new _Form__WEBPACK_IMPORTED_MODULE_1__.Font();
        this._ctx.font = this._font.value;
        return this;
    }
    _paint() {
        if (this._filled)
            this._ctx.fill();
        if (this._stroked)
            this._ctx.stroke();
    }
    point(p, radius = 5, shape = "square") {
        if (!p)
            return;
        if (!CanvasForm[shape])
            throw new Error(`${shape} is not a static function of CanvasForm`);
        CanvasForm[shape](this._ctx, p, radius);
        this._paint();
        return this;
    }
    static circle(ctx, pt, radius = 10) {
        if (!pt)
            return;
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], radius, 0, _Util__WEBPACK_IMPORTED_MODULE_3__.Const.two_pi, false);
        ctx.closePath();
    }
    circle(pts) {
        CanvasForm.circle(this._ctx, pts[0], pts[1][0]);
        this._paint();
        return this;
    }
    static ellipse(ctx, pt, radius, rotation = 0, startAngle = 0, endAngle = _Util__WEBPACK_IMPORTED_MODULE_3__.Const.two_pi, cc = false) {
        if (!pt || !radius)
            return;
        ctx.beginPath();
        ctx.ellipse(pt[0], pt[1], radius[0], radius[1], rotation, startAngle, endAngle, cc);
    }
    ellipse(pt, radius, rotation = 0, startAngle = 0, endAngle = _Util__WEBPACK_IMPORTED_MODULE_3__.Const.two_pi, cc = false) {
        CanvasForm.ellipse(this._ctx, pt, radius, rotation, startAngle, endAngle, cc);
        this._paint();
        return this;
    }
    static arc(ctx, pt, radius, startAngle, endAngle, cc) {
        if (!pt)
            return;
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], radius, startAngle, endAngle, cc);
    }
    arc(pt, radius, startAngle, endAngle, cc) {
        CanvasForm.arc(this._ctx, pt, radius, startAngle, endAngle, cc);
        this._paint();
        return this;
    }
    static square(ctx, pt, halfsize) {
        if (!pt)
            return;
        let x1 = pt[0] - halfsize;
        let y1 = pt[1] - halfsize;
        let x2 = pt[0] + halfsize;
        let y2 = pt[1] + halfsize;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, y1);
        ctx.closePath();
    }
    square(pt, halfsize) {
        CanvasForm.square(this._ctx, pt, halfsize);
        this._paint();
        return this;
    }
    static line(ctx, pts) {
        if (pts.length < 2)
            return;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1, len = pts.length; i < len; i++) {
            if (pts[i])
                ctx.lineTo(pts[i][0], pts[i][1]);
        }
    }
    line(pts) {
        CanvasForm.line(this._ctx, pts);
        this._paint();
        return this;
    }
    static polygon(ctx, pts) {
        if (pts.length < 2)
            return;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1, len = pts.length; i < len; i++) {
            if (pts[i])
                ctx.lineTo(pts[i][0], pts[i][1]);
        }
        ctx.closePath();
    }
    polygon(pts) {
        CanvasForm.polygon(this._ctx, pts);
        this._paint();
        return this;
    }
    static rect(ctx, pts) {
        if (pts.length < 2)
            return;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        ctx.lineTo(pts[0][0], pts[1][1]);
        ctx.lineTo(pts[1][0], pts[1][1]);
        ctx.lineTo(pts[1][0], pts[0][1]);
        ctx.closePath();
    }
    rect(pts) {
        CanvasForm.rect(this._ctx, pts);
        this._paint();
        return this;
    }
    static image(ctx, img, target = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(), orig) {
        if (typeof target[0] === "number") {
            ctx.drawImage(img, target[0], target[1]);
        }
        else {
            let t = target;
            if (orig) {
                ctx.drawImage(img, orig[0][0], orig[0][1], orig[1][0] - orig[0][0], orig[1][1] - orig[0][1], t[0][0], t[0][1], t[1][0] - t[0][0], t[1][1] - t[0][1]);
            }
            else {
                ctx.drawImage(img, t[0][0], t[0][1], t[1][0] - t[0][0], t[1][1] - t[0][1]);
            }
        }
    }
    image(img, target, original) {
        CanvasForm.image(this._ctx, img, target, original);
        return this;
    }
    static text(ctx, pt, txt, maxWidth) {
        if (!pt)
            return;
        ctx.fillText(txt, pt[0], pt[1], maxWidth);
    }
    text(pt, txt, maxWidth) {
        CanvasForm.text(this._ctx, pt, txt, maxWidth);
        return this;
    }
    textBox(box, txt, verticalAlign = "middle", tail = "", overrideBaseline = true) {
        if (overrideBaseline)
            this._ctx.textBaseline = verticalAlign;
        let size = _Op__WEBPACK_IMPORTED_MODULE_5__.Rectangle.size(box);
        let t = this._textTruncate(txt, size[0], tail);
        this.text(this._textAlign(box, verticalAlign), t[0]);
        return this;
    }
    paragraphBox(box, txt, lineHeight = 1.2, verticalAlign = "top", crop = true) {
        let size = _Op__WEBPACK_IMPORTED_MODULE_5__.Rectangle.size(box);
        this._ctx.textBaseline = "top";
        let lstep = this._font.size * lineHeight;
        let nextLine = (sub, buffer = [], cc = 0) => {
            if (!sub)
                return buffer;
            if (crop && cc * lstep > size[1] - lstep * 2)
                return buffer;
            if (cc > 10000)
                throw new Error("max recursion reached (10000)");
            let t = this._textTruncate(sub, size[0], "");
            let newln = t[0].indexOf("\n");
            if (newln >= 0) {
                buffer.push(t[0].substr(0, newln));
                return nextLine(sub.substr(newln + 1), buffer, cc + 1);
            }
            let dt = t[0].lastIndexOf(" ") + 1;
            if (dt <= 0 || t[1] === sub.length)
                dt = undefined;
            let line = t[0].substr(0, dt);
            buffer.push(line);
            return (t[1] <= 0 || t[1] === sub.length) ? buffer : nextLine(sub.substr((dt || t[1])), buffer, cc + 1);
        };
        let lines = nextLine(txt);
        let lsize = lines.length * lstep;
        let lbox = box;
        if (verticalAlign == "middle" || verticalAlign == "center") {
            let lpad = (size[1] - lsize) / 2;
            if (crop)
                lpad = Math.max(0, lpad);
            lbox = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(box[0].$add(0, lpad), box[1].$subtract(0, lpad));
        }
        else if (verticalAlign == "bottom") {
            lbox = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(box[0].$add(0, size[1] - lsize), box[1]);
        }
        else {
            lbox = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(box[0], box[0].$add(size[0], lsize));
        }
        let center = _Op__WEBPACK_IMPORTED_MODULE_5__.Rectangle.center(lbox);
        for (let i = 0, len = lines.length; i < len; i++) {
            this.text(this._textAlign(lbox, "top", [0, i * lstep], center), lines[i]);
        }
        return this;
    }
    alignText(alignment = "left", baseline = "alphabetic") {
        if (baseline == "center")
            baseline = "middle";
        if (baseline == "baseline")
            baseline = "alphabetic";
        this._ctx.textAlign = alignment;
        this._ctx.textBaseline = baseline;
        return this;
    }
    log(txt) {
        let w = this._ctx.measureText(txt).width + 20;
        this.stroke(false).fill("rgba(0,0,0,.4)").rect([[0, 0], [w, 20]]);
        this.fill("#fff").text([10, 14], txt);
        return this;
    }
}
//# sourceMappingURL=Canvas.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Color.js":
/*!***********************************************!*\
  !*** ./node_modules/pts/dist/es2015/Color.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Color": () => (/* binding */ Color)
/* harmony export */ });
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util */ "./node_modules/pts/dist/es2015/Util.js");
/* harmony import */ var _Num__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Num */ "./node_modules/pts/dist/es2015/Num.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */



class Color extends _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt {
    constructor(...args) {
        super(...args);
        this._mode = "rgb";
        this._isNorm = false;
    }
    static from(...args) {
        let p = [1, 1, 1, 1];
        let c = _Util__WEBPACK_IMPORTED_MODULE_1__.Util.getArgs(args);
        for (let i = 0, len = p.length; i < len; i++) {
            if (i < c.length)
                p[i] = c[i];
        }
        return new Color(p);
    }
    static fromHex(hex) {
        if (hex[0] == "#")
            hex = hex.substr(1);
        if (hex.length <= 3) {
            let fn = (i) => hex[i] || "F";
            hex = `${fn(0)}${fn(0)}${fn(1)}${fn(1)}${fn(2)}${fn(2)}`;
        }
        let alpha = 1;
        if (hex.length === 8) {
            alpha = hex.substr(6) && 0xFF / 255;
            hex = hex.substring(0, 6);
        }
        let hexVal = parseInt(hex, 16);
        return new Color(hexVal >> 16, hexVal >> 8 & 0xFF, hexVal & 0xFF, alpha);
    }
    static rgb(...args) { return Color.from(...args).toMode("rgb"); }
    static hsl(...args) { return Color.from(...args).toMode("hsl"); }
    static hsb(...args) { return Color.from(...args).toMode("hsb"); }
    static lab(...args) { return Color.from(...args).toMode("lab"); }
    static lch(...args) { return Color.from(...args).toMode("lch"); }
    static luv(...args) { return Color.from(...args).toMode("luv"); }
    static xyz(...args) { return Color.from(...args).toMode("xyz"); }
    static maxValues(mode) { return Color.ranges[mode].zipSlice(1).$take([0, 1, 2]); }
    get hex() { return this.toString("hex"); }
    get rgb() { return this.toString("rgb"); }
    get rgba() { return this.toString("rgba"); }
    clone() {
        let c = new Color(this);
        c.toMode(this._mode);
        return c;
    }
    toMode(mode, convert = false) {
        if (convert) {
            let fname = this._mode.toUpperCase() + "to" + mode.toUpperCase();
            if (Color[fname]) {
                this.to(Color[fname](this, this._isNorm, this._isNorm));
            }
            else {
                throw new Error("Cannot convert color with " + fname);
            }
        }
        this._mode = mode;
        return this;
    }
    get mode() { return this._mode; }
    get r() { return this[0]; }
    set r(n) { this[0] = n; }
    get g() { return this[1]; }
    set g(n) { this[1] = n; }
    get b() { return this[2]; }
    set b(n) { this[2] = n; }
    get h() { return (this._mode == "lch") ? this[2] : this[0]; }
    set h(n) {
        let i = (this._mode == "lch") ? 2 : 0;
        this[i] = n;
    }
    get s() { return this[1]; }
    set s(n) { this[1] = n; }
    get l() { return (this._mode == "hsl") ? this[2] : this[0]; }
    set l(n) {
        let i = (this._mode == "hsl") ? 2 : 0;
        this[i] = n;
    }
    get a() { return this[1]; }
    set a(n) { this[1] = n; }
    get c() { return this[1]; }
    set c(n) { this[1] = n; }
    get u() { return this[1]; }
    set u(n) { this[1] = n; }
    get v() { return this[2]; }
    set v(n) { this[2] = n; }
    set alpha(n) { if (this.length > 3)
        this[3] = n; }
    get alpha() { return (this.length > 3) ? this[3] : 1; }
    get normalized() { return this._isNorm; }
    set normalized(b) { this._isNorm = b; }
    normalize(toNorm = true) {
        if (this._isNorm == toNorm)
            return this;
        let ranges = Color.ranges[this._mode];
        for (let i = 0; i < 3; i++) {
            this[i] = (!toNorm)
                ? _Num__WEBPACK_IMPORTED_MODULE_2__.Num.mapToRange(this[i], 0, 1, ranges[i][0], ranges[i][1])
                : _Num__WEBPACK_IMPORTED_MODULE_2__.Num.mapToRange(this[i], ranges[i][0], ranges[i][1], 0, 1);
        }
        this._isNorm = toNorm;
        return this;
    }
    $normalize(toNorm = true) { return this.clone().normalize(toNorm); }
    toString(format = "mode") {
        if (format == "hex") {
            let _hex = (n) => {
                let s = Math.floor(n).toString(16);
                return (s.length < 2) ? '0' + s : s;
            };
            return `#${_hex(this[0])}${_hex(this[1])}${_hex(this[2])}`;
        }
        else if (format == "rgba") {
            return `rgba(${Math.floor(this[0])},${Math.floor(this[1])},${Math.floor(this[2])},${this.alpha}`;
        }
        else if (format == "rgb") {
            return `rgb(${Math.floor(this[0])},${Math.floor(this[1])},${Math.floor(this[2])}`;
        }
        else {
            return `${this._mode}(${this[0]},${this[1]},${this[2]},${this.alpha})`;
        }
    }
    static RGBtoHSL(rgb, normalizedInput = false, normalizedOutput = false) {
        let [r, g, b] = (!normalizedInput) ? rgb.$normalize() : rgb;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h = (max + min) / 2;
        let s = h;
        let l = h;
        if (max == min) {
            h = 0;
            s = 0;
        }
        else {
            let d = max - min;
            s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
            h = 0;
            if (max === r) {
                h = (g - b) / d + ((g < b) ? 6 : 0);
            }
            else if (max === g) {
                h = (b - r) / d + 2;
            }
            else if (max === b) {
                h = (r - g) / d + 4;
            }
        }
        return Color.hsl(((normalizedOutput) ? h / 60 : h * 60), s, l, rgb.alpha);
    }
    static HSLtoRGB(hsl, normalizedInput = false, normalizedOutput = false) {
        let [h, s, l] = hsl;
        if (!normalizedInput)
            h = h / 360;
        if (s == 0)
            return Color.rgb(l * 255, l * 255, l * 255, hsl.alpha);
        let q = (l <= 0.5) ? l * (1 + s) : l + s - (l * s);
        let p = 2 * l - q;
        let convert = (t) => {
            t = (t < 0) ? t + 1 : (t > 1) ? t - 1 : t;
            if (t * 6 < 1) {
                return p + (q - p) * t * 6;
            }
            else if (t * 2 < 1) {
                return q;
            }
            else if (t * 3 < 2) {
                return p + (q - p) * ((2 / 3) - t) * 6;
            }
            else {
                return p;
            }
        };
        let sc = (normalizedOutput) ? 1 : 255;
        return Color.rgb(sc * convert((h + 1 / 3)), sc * convert(h), sc * convert((h - 1 / 3)), hsl.alpha);
    }
    static RGBtoHSB(rgb, normalizedInput = false, normalizedOutput = false) {
        let [r, g, b] = (!normalizedInput) ? rgb.$normalize() : rgb;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let d = max - min;
        let h = 0;
        let s = (max === 0) ? 0 : d / max;
        let v = max;
        if (max != min) {
            if (max === r) {
                h = (g - b) / d + ((g < b) ? 6 : 0);
            }
            else if (max === g) {
                h = (b - r) / d + 2;
            }
            else if (max === b) {
                h = (r - g) / d + 4;
            }
        }
        return Color.hsb(((normalizedOutput) ? h / 60 : h * 60), s, v, rgb.alpha);
    }
    static HSBtoRGB(hsb, normalizedInput = false, normalizedOutput = false) {
        let [h, s, v] = hsb;
        if (!normalizedInput)
            h = h / 360;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        let pick = [
            [v, t, p], [q, v, p], [p, v, t],
            [p, q, v], [t, p, v], [v, p, q]
        ];
        let c = pick[i % 6];
        let sc = (normalizedOutput) ? 1 : 255;
        return Color.rgb(sc * c[0], sc * c[1], sc * c[2], hsb.alpha);
    }
    static RGBtoLAB(rgb, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? rgb.$normalize(false) : rgb;
        return Color.XYZtoLAB(Color.RGBtoXYZ(c), false, normalizedOutput);
    }
    static LABtoRGB(lab, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? lab.$normalize(false) : lab;
        return Color.XYZtoRGB(Color.LABtoXYZ(c), false, normalizedOutput);
    }
    static RGBtoLCH(rgb, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? rgb.$normalize(false) : rgb;
        return Color.LABtoLCH(Color.RGBtoLAB(c), false, normalizedOutput);
    }
    static LCHtoRGB(lch, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? lch.$normalize(false) : lch;
        return Color.LABtoRGB(Color.LCHtoLAB(c), false, normalizedOutput);
    }
    static RGBtoLUV(rgb, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? rgb.$normalize(false) : rgb;
        return Color.XYZtoLUV(Color.RGBtoXYZ(c), false, normalizedOutput);
    }
    static LUVtoRGB(luv, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? luv.$normalize(false) : luv;
        return Color.XYZtoRGB(Color.LUVtoXYZ(c), false, normalizedOutput);
    }
    static RGBtoXYZ(rgb, normalizedInput = false, normalizedOutput = false) {
        let c = (!normalizedInput) ? rgb.$normalize() : rgb.clone();
        for (let i = 0; i < 3; i++) {
            c[i] = (c[i] > 0.04045) ? Math.pow((c[i] + 0.055) / 1.055, 2.4) : c[i] / 12.92;
            if (!normalizedOutput)
                c[i] = c[i] * 100;
        }
        let cc = Color.xyz(c[0] * 0.4124564 + c[1] * 0.3575761 + c[2] * 0.1804375, c[0] * 0.2126729 + c[1] * 0.7151522 + c[2] * 0.0721750, c[0] * 0.0193339 + c[1] * 0.1191920 + c[2] * 0.9503041, rgb.alpha);
        return (normalizedOutput) ? cc.normalize() : cc;
    }
    static XYZtoRGB(xyz, normalizedInput = false, normalizedOutput = false) {
        let [x, y, z] = (!normalizedInput) ? xyz.$normalize() : xyz;
        let rgb = [
            x * 3.2404542 + y * -1.5371385 + z * -0.4985314,
            x * -0.9692660 + y * 1.8760108 + z * 0.0415560,
            x * 0.0556434 + y * -0.2040259 + z * 1.0572252
        ];
        for (let i = 0; i < 3; i++) {
            rgb[i] = (rgb[i] < 0) ? 0 : (rgb[i] > 0.0031308) ? (1.055 * Math.pow(rgb[i], 1 / 2.4) - 0.055) : (12.92 * rgb[i]);
            rgb[i] = Math.max(0, Math.min(1, rgb[i]));
            if (!normalizedOutput)
                rgb[i] = Math.round(rgb[i] * 255);
        }
        let cc = Color.rgb(rgb[0], rgb[1], rgb[2], xyz.alpha);
        return (normalizedOutput) ? cc.normalize() : cc;
    }
    static XYZtoLAB(xyz, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? xyz.$normalize(false) : xyz.clone();
        c.divide(Color.D65);
        let fn = (n) => (n > 0.008856) ? Math.pow(n, 1 / 3) : (7.787 * n) + 16 / 116;
        let cy = fn(c[1]);
        let cc = Color.lab((116 * cy) - 16, 500 * (fn(c[0]) - cy), 200 * (cy - fn(c[2])), xyz.alpha);
        return (normalizedOutput) ? cc.normalize() : cc;
    }
    static LABtoXYZ(lab, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? lab.$normalize(false) : lab;
        let y = (c[0] + 16) / 116;
        let x = (c[1] / 500) + y;
        let z = y - c[2] / 200;
        let fn = (n) => {
            let nnn = n * n * n;
            return (nnn > 0.008856) ? nnn : (n - 16 / 116) / 7.787;
        };
        let d = Color.D65;
        let cc = Color.xyz(Math.max(0, d[0] * fn(x)), Math.max(0, d[1] * fn(y)), Math.max(0, d[2] * fn(z)), lab.alpha);
        return (normalizedOutput) ? cc.normalize() : cc;
    }
    static XYZtoLUV(xyz, normalizedInput = false, normalizedOutput = false) {
        let [x, y, z] = (normalizedInput) ? xyz.$normalize(false) : xyz;
        let u = (4 * x) / (x + (15 * y) + (3 * z));
        let v = (9 * y) / (x + (15 * y) + (3 * z));
        y = y / 100;
        y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y + 16 / 116);
        let refU = (4 * Color.D65[0]) / (Color.D65[0] + (15 * Color.D65[1]) + (3 * Color.D65[2]));
        let refV = (9 * Color.D65[1]) / (Color.D65[0] + (15 * Color.D65[1]) + (3 * Color.D65[2]));
        let L = (116 * y) - 16;
        return Color.luv(L, 13 * L * (u - refU), 13 * L * (v - refV), xyz.alpha);
    }
    static LUVtoXYZ(luv, normalizedInput = false, normalizedOutput = false) {
        let [l, u, v] = (normalizedInput) ? luv.$normalize(false) : luv;
        let y = (l + 16) / 116;
        let cubeY = y * y * y;
        y = (cubeY > 0.008856) ? cubeY : (y - 16 / 116) / 7.787;
        let refU = (4 * Color.D65[0]) / (Color.D65[0] + (15 * Color.D65[1]) + (3 * Color.D65[2]));
        let refV = (9 * Color.D65[1]) / (Color.D65[0] + (15 * Color.D65[1]) + (3 * Color.D65[2]));
        u = u / (13 * l) + refU;
        v = v / (13 * l) + refV;
        y = y * 100;
        let x = -1 * (9 * y * u) / ((u - 4) * v - u * v);
        let z = (9 * y - (15 * v * y) - (v * x)) / (3 * v);
        return Color.xyz(x, y, z, luv.alpha);
    }
    static LABtoLCH(lab, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? lab.$normalize(false) : lab;
        let h = _Num__WEBPACK_IMPORTED_MODULE_2__.Geom.toDegree(_Num__WEBPACK_IMPORTED_MODULE_2__.Geom.boundRadian(Math.atan2(c[2], c[1])));
        return Color.lch(c[0], Math.sqrt(c[1] * c[1] + c[2] * c[2]), h, lab.alpha);
    }
    static LCHtoLAB(lch, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? lch.$normalize(false) : lch;
        let rad = _Num__WEBPACK_IMPORTED_MODULE_2__.Geom.toRadian(c[2]);
        return Color.lab(c[0], Math.cos(rad) * c[1], Math.sin(rad) * c[1], lch.alpha);
    }
}
Color.D65 = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(95.047, 100, 108.883, 1);
Color.ranges = {
    rgb: new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 255), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 255), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 255)),
    hsl: new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 360), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 1), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 1)),
    hsb: new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 360), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 1), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 1)),
    lab: new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 100), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(-128, 127), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(-128, 127)),
    lch: new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 100), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 100), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 360)),
    luv: new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 100), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(-134, 220), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(-140, 122)),
    xyz: new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 100), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 100), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 100))
};
//# sourceMappingURL=Color.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Create.js":
/*!************************************************!*\
  !*** ./node_modules/pts/dist/es2015/Create.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Create": () => (/* binding */ Create),
/* harmony export */   "Noise": () => (/* binding */ Noise),
/* harmony export */   "Delaunay": () => (/* binding */ Delaunay)
/* harmony export */ });
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/* harmony import */ var _Op__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Op */ "./node_modules/pts/dist/es2015/Op.js");
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Util */ "./node_modules/pts/dist/es2015/Util.js");
/* harmony import */ var _Num__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Num */ "./node_modules/pts/dist/es2015/Num.js");
/* harmony import */ var _LinearAlgebra__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./LinearAlgebra */ "./node_modules/pts/dist/es2015/LinearAlgebra.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */





class Create {
    static distributeRandom(bound, count, dimensions = 2) {
        let pts = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group();
        for (let i = 0; i < count; i++) {
            let p = [bound.x + Math.random() * bound.width];
            if (dimensions > 1)
                p.push(bound.y + Math.random() * bound.height);
            if (dimensions > 2)
                p.push(bound.z + Math.random() * bound.depth);
            pts.push(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(p));
        }
        return pts;
    }
    static distributeLinear(line, count) {
        let ln = _Op__WEBPACK_IMPORTED_MODULE_1__.Line.subpoints(line, count - 2);
        ln.unshift(line[0]);
        ln.push(line[line.length - 1]);
        return ln;
    }
    static gridPts(bound, columns, rows, orientation = [0.5, 0.5]) {
        if (columns === 0 || rows === 0)
            throw new Error("grid columns and rows cannot be 0");
        let unit = bound.size.$subtract(1).$divide(columns, rows);
        let offset = unit.$multiply(orientation);
        let g = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group();
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                g.push(bound.topLeft.$add(unit.$multiply(c, r)).add(offset));
            }
        }
        return g;
    }
    static gridCells(bound, columns, rows) {
        if (columns === 0 || rows === 0)
            throw new Error("grid columns and rows cannot be 0");
        let unit = bound.size.$subtract(1).divide(columns, rows);
        let g = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                g.push(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(bound.topLeft.$add(unit.$multiply(c, r)), bound.topLeft.$add(unit.$multiply(c, r).add(unit))));
            }
        }
        return g;
    }
    static radialPts(center, radius, count, angleOffset = -_Util__WEBPACK_IMPORTED_MODULE_2__.Const.half_pi) {
        let g = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group();
        let a = _Util__WEBPACK_IMPORTED_MODULE_2__.Const.two_pi / count;
        for (let i = 0; i < count; i++) {
            g.push(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(center).toAngle(a * i + angleOffset, radius, true));
        }
        return g;
    }
    static noisePts(pts, dx = 0.01, dy = 0.01, rows = 0, columns = 0) {
        let seed = Math.random();
        let g = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group();
        for (let i = 0, len = pts.length; i < len; i++) {
            let np = new Noise(pts[i]);
            let r = (rows && rows > 0) ? Math.floor(i / rows) : i;
            let c = (columns && columns > 0) ? i % columns : i;
            np.initNoise(dx * c, dy * r);
            np.seed(seed);
            g.push(np);
        }
        return g;
    }
    static delaunay(pts) {
        return Delaunay.from(pts);
    }
}
const __noise_grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
];
const __noise_permTable = [151, 160, 137, 91, 90, 15,
    131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
    190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
    77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
    102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
    135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
    5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
    223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 9, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
    251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
    49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
];
class Noise extends _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt {
    constructor(...args) {
        super(...args);
        this.perm = [];
        this._n = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0.01, 0.01);
        this.perm = __noise_permTable.concat(__noise_permTable);
    }
    initNoise(...args) {
        this._n = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(...args);
        return this;
    }
    step(x = 0, y = 0) {
        this._n.add(x, y);
        return this;
    }
    seed(s) {
        if (s > 0 && s < 1)
            s *= 65536;
        s = Math.floor(s);
        if (s < 256)
            s |= s << 8;
        for (let i = 0; i < 255; i++) {
            let v = (i & 1) ? __noise_permTable[i] ^ (s & 255) : __noise_permTable[i] ^ ((s >> 8) & 255);
            this.perm[i] = this.perm[i + 256] = v;
        }
        return this;
    }
    noise2D() {
        let i = Math.max(0, Math.floor(this._n[0])) % 255;
        let j = Math.max(0, Math.floor(this._n[1])) % 255;
        let x = (this._n[0] % 255) - i;
        let y = (this._n[1] % 255) - j;
        let n00 = _LinearAlgebra__WEBPACK_IMPORTED_MODULE_4__.Vec.dot(__noise_grad3[(i + this.perm[j]) % 12], [x, y, 0]);
        let n01 = _LinearAlgebra__WEBPACK_IMPORTED_MODULE_4__.Vec.dot(__noise_grad3[(i + this.perm[j + 1]) % 12], [x, y - 1, 0]);
        let n10 = _LinearAlgebra__WEBPACK_IMPORTED_MODULE_4__.Vec.dot(__noise_grad3[(i + 1 + this.perm[j]) % 12], [x - 1, y, 0]);
        let n11 = _LinearAlgebra__WEBPACK_IMPORTED_MODULE_4__.Vec.dot(__noise_grad3[(i + 1 + this.perm[j + 1]) % 12], [x - 1, y - 1, 0]);
        let _fade = (f) => f * f * f * (f * (f * 6 - 15) + 10);
        let tx = _fade(x);
        return _Num__WEBPACK_IMPORTED_MODULE_3__.Num.lerp(_Num__WEBPACK_IMPORTED_MODULE_3__.Num.lerp(n00, n10, tx), _Num__WEBPACK_IMPORTED_MODULE_3__.Num.lerp(n01, n11, tx), _fade(y));
    }
}
class Delaunay extends _Pt__WEBPACK_IMPORTED_MODULE_0__.Group {
    constructor() {
        super(...arguments);
        this._mesh = [];
    }
    delaunay(triangleOnly = true) {
        if (this.length < 3)
            return [];
        this._mesh = [];
        let n = this.length;
        let indices = [];
        for (let i = 0; i < n; i++)
            indices[i] = i;
        indices.sort((i, j) => this[j][0] - this[i][0]);
        let pts = this.slice();
        let st = this._superTriangle();
        pts = pts.concat(st);
        let opened = [this._circum(n, n + 1, n + 2, st)];
        let closed = [];
        let tris = [];
        for (let i = 0, len = indices.length; i < len; i++) {
            let c = indices[i];
            let edges = [];
            let j = opened.length;
            if (!this._mesh[c])
                this._mesh[c] = {};
            while (j--) {
                let circum = opened[j];
                let radius = circum.circle[1][0];
                let d = pts[c].$subtract(circum.circle[0]);
                if (d[0] > 0 && d[0] * d[0] > radius * radius) {
                    closed.push(circum);
                    tris.push(circum.triangle);
                    opened.splice(j, 1);
                    continue;
                }
                if (d[0] * d[0] + d[1] * d[1] - radius * radius > _Util__WEBPACK_IMPORTED_MODULE_2__.Const.epsilon) {
                    continue;
                }
                edges.push(circum.i, circum.j, circum.j, circum.k, circum.k, circum.i);
                opened.splice(j, 1);
            }
            Delaunay._dedupe(edges);
            j = edges.length;
            while (j > 1) {
                opened.push(this._circum(edges[--j], edges[--j], c, false, pts));
            }
        }
        for (let i = 0, len = opened.length; i < len; i++) {
            let o = opened[i];
            if (o.i < n && o.j < n && o.k < n) {
                closed.push(o);
                tris.push(o.triangle);
                this._cache(o);
            }
        }
        return (triangleOnly) ? tris : closed;
    }
    voronoi() {
        let vs = [];
        let n = this._mesh;
        for (let i = 0, len = n.length; i < len; i++) {
            vs.push(this.neighborPts(i, true));
        }
        return vs;
    }
    mesh() {
        return this._mesh;
    }
    neighborPts(i, sort = false) {
        let cs = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group();
        let n = this._mesh;
        for (let k in n[i]) {
            if (n[i].hasOwnProperty(k))
                cs.push(n[i][k].circle[0]);
        }
        return (sort) ? _Num__WEBPACK_IMPORTED_MODULE_3__.Geom.sortEdges(cs) : cs;
    }
    neighbors(i) {
        let cs = [];
        let n = this._mesh;
        for (let k in n[i]) {
            if (n[i].hasOwnProperty(k))
                cs.push(n[i][k]);
        }
        return cs;
    }
    _cache(o) {
        this._mesh[o.i][`${Math.min(o.j, o.k)}-${Math.max(o.j, o.k)}`] = o;
        this._mesh[o.j][`${Math.min(o.i, o.k)}-${Math.max(o.i, o.k)}`] = o;
        this._mesh[o.k][`${Math.min(o.i, o.j)}-${Math.max(o.i, o.j)}`] = o;
    }
    _superTriangle() {
        let minPt = this[0];
        let maxPt = this[0];
        for (let i = 1, len = this.length; i < len; i++) {
            minPt = minPt.$min(this[i]);
            maxPt = maxPt.$max(this[i]);
        }
        let d = maxPt.$subtract(minPt);
        let mid = minPt.$add(maxPt).divide(2);
        let dmax = Math.max(d[0], d[1]);
        return new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(mid.$subtract(20 * dmax, dmax), mid.$add(0, 20 * dmax), mid.$add(20 * dmax, -dmax));
    }
    _triangle(i, j, k, pts = this) {
        return new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(pts[i], pts[j], pts[k]);
    }
    _circum(i, j, k, tri, pts = this) {
        let t = tri || this._triangle(i, j, k, pts);
        return {
            i: i,
            j: j,
            k: k,
            triangle: t,
            circle: _Op__WEBPACK_IMPORTED_MODULE_1__.Triangle.circumcircle(t)
        };
    }
    static _dedupe(edges) {
        let j = edges.length;
        while (j > 1) {
            let b = edges[--j];
            let a = edges[--j];
            let i = j;
            while (i > 1) {
                let n = edges[--i];
                let m = edges[--i];
                if ((a == m && b == n) || (a == n && b == m)) {
                    edges.splice(j, 2);
                    edges.splice(i, 2);
                    break;
                }
            }
        }
        return edges;
    }
}
//# sourceMappingURL=Create.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Dom.js":
/*!*********************************************!*\
  !*** ./node_modules/pts/dist/es2015/Dom.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DOMSpace": () => (/* binding */ DOMSpace),
/* harmony export */   "HTMLSpace": () => (/* binding */ HTMLSpace),
/* harmony export */   "HTMLForm": () => (/* binding */ HTMLForm)
/* harmony export */ });
/* harmony import */ var _Space__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Space */ "./node_modules/pts/dist/es2015/Space.js");
/* harmony import */ var _Form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Form */ "./node_modules/pts/dist/es2015/Form.js");
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Util */ "./node_modules/pts/dist/es2015/Util.js");
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */




class DOMSpace extends _Space__WEBPACK_IMPORTED_MODULE_0__.MultiTouchSpace {
    constructor(elem, callback) {
        super();
        this.id = "domspace";
        this._autoResize = true;
        this._bgcolor = "#e1e9f0";
        this._css = {};
        var _selector = null;
        var _existed = false;
        this.id = "pts";
        if (elem instanceof Element) {
            _selector = elem;
            this.id = "pts_existing_space";
        }
        else {
            _selector = document.querySelector(elem);
            _existed = true;
            this.id = elem.substr(1);
        }
        if (!_selector) {
            this._container = DOMSpace.createElement("div", "pts_container");
            this._canvas = DOMSpace.createElement("div", "pts_element");
            this._container.appendChild(this._canvas);
            document.body.appendChild(this._container);
            _existed = false;
        }
        else {
            this._canvas = _selector;
            this._container = _selector.parentElement;
        }
        setTimeout(this._ready.bind(this, callback), 50);
    }
    static createElement(elem = "div", id, appendTo) {
        let d = document.createElement(elem);
        if (id)
            d.setAttribute("id", id);
        if (appendTo && appendTo.appendChild)
            appendTo.appendChild(d);
        return d;
    }
    _ready(callback) {
        if (!this._container)
            throw new Error(`Cannot initiate #${this.id} element`);
        this._isReady = true;
        this._resizeHandler(null);
        this.clear(this._bgcolor);
        this._canvas.dispatchEvent(new Event("ready"));
        for (let k in this.players) {
            if (this.players.hasOwnProperty(k)) {
                if (this.players[k].start)
                    this.players[k].start(this.bound.clone(), this);
            }
        }
        this._pointer = this.center;
        this.refresh(false);
        if (callback)
            callback(this.bound, this._canvas);
    }
    setup(opt) {
        if (opt.bgcolor) {
            this._bgcolor = opt.bgcolor;
        }
        this.autoResize = (opt.resize != undefined) ? opt.resize : false;
        return this;
    }
    getForm() {
        return null;
    }
    set autoResize(auto) {
        this._autoResize = auto;
        if (auto) {
            window.addEventListener('resize', this._resizeHandler.bind(this));
        }
        else {
            delete this._css['width'];
            delete this._css['height'];
            window.removeEventListener('resize', this._resizeHandler.bind(this));
        }
    }
    get autoResize() { return this._autoResize; }
    resize(b, evt) {
        this.bound = b;
        this.styles({ width: `${b.width}px`, height: `${b.height}px` }, true);
        for (let k in this.players) {
            if (this.players.hasOwnProperty(k)) {
                let p = this.players[k];
                if (p.resize)
                    p.resize(this.bound, evt);
            }
        }
        return this;
    }
    _resizeHandler(evt) {
        let b = _Pt__WEBPACK_IMPORTED_MODULE_3__.Bound.fromBoundingRect(this._container.getBoundingClientRect());
        if (this._autoResize) {
            this.styles({ width: "100%", height: "100%" }, true);
        }
        else {
            this.styles({ width: `${b.width}px`, height: `${b.height}px` }, true);
        }
        this.resize(b, evt);
    }
    get element() {
        return this._canvas;
    }
    get parent() {
        return this._container;
    }
    get ready() { return this._isReady; }
    clear(bg) {
        if (bg)
            this.background = bg;
        this._canvas.innerHTML = "";
        return this;
    }
    set background(bg) {
        this._bgcolor = bg;
        this._container.style.backgroundColor = this._bgcolor;
    }
    get background() { return this._bgcolor; }
    style(key, val, update = false) {
        this._css[key] = val;
        if (update)
            this._canvas.style[key] = val;
        return this;
    }
    styles(styles, update = false) {
        for (let k in styles) {
            if (styles.hasOwnProperty(k))
                this.style(k, styles[k], update);
        }
        return this;
    }
    static setAttr(elem, data) {
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                elem.setAttribute(k, data[k]);
            }
        }
        return elem;
    }
    static getInlineStyles(data) {
        let str = "";
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                if (data[k])
                    str += `${k}: ${data[k]}; `;
            }
        }
        return str;
    }
    dispose() {
        window.removeEventListener('resize', this._resizeHandler.bind(this));
        this.stop();
        this.removeAll();
        return this;
    }
}
class HTMLSpace extends DOMSpace {
    getForm() {
        return new HTMLForm(this);
    }
    static htmlElement(parent, name, id, autoClass = true) {
        if (!parent || !parent.appendChild)
            throw new Error("parent is not a valid DOM element");
        let elem = document.querySelector(`#${id}`);
        if (!elem) {
            elem = document.createElement(name);
            elem.setAttribute("id", id);
            if (autoClass)
                elem.setAttribute("class", id.substring(0, id.indexOf("-")));
            parent.appendChild(elem);
        }
        return elem;
    }
    remove(player) {
        let temp = this._container.querySelectorAll("." + HTMLForm.scopeID(player));
        temp.forEach((el) => {
            el.parentNode.removeChild(el);
        });
        return super.remove(player);
    }
    removeAll() {
        this._container.innerHTML = "";
        return super.removeAll();
    }
}
class HTMLForm extends _Form__WEBPACK_IMPORTED_MODULE_1__.VisualForm {
    constructor(space) {
        super();
        this._style = {
            "filled": true,
            "stroked": true,
            "background": "#f03",
            "border-color": "#fff",
            "color": "#000",
            "border-width": "1px",
            "border-radius": "0",
            "border-style": "solid",
            "opacity": 1,
            "position": "absolute",
            "top": 0,
            "left": 0,
            "width": 0,
            "height": 0
        };
        this._ctx = {
            group: null,
            groupID: "pts",
            groupCount: 0,
            currentID: "pts0",
            currentClass: "",
            style: {},
        };
        this._ready = false;
        this._space = space;
        this._space.add({ start: () => {
                this._ctx.group = this._space.element;
                this._ctx.groupID = "pts_dom_" + (HTMLForm.groupID++);
                this._ctx.style = Object.assign({}, this._style);
                this._ready = true;
            } });
    }
    get space() { return this._space; }
    styleTo(k, v, unit = '') {
        if (this._ctx.style[k] === undefined)
            throw new Error(`${k} style property doesn't exist`);
        this._ctx.style[k] = `${v}${unit}`;
    }
    alpha(a) {
        this.styleTo("opacity", a);
        return this;
    }
    fill(c) {
        if (typeof c == "boolean") {
            this.styleTo("filled", c);
            if (!c)
                this.styleTo("background", "transparent");
        }
        else {
            this.styleTo("filled", true);
            this.styleTo("background", c);
        }
        return this;
    }
    stroke(c, width, linejoin, linecap) {
        if (typeof c == "boolean") {
            this.styleTo("stroked", c);
            if (!c)
                this.styleTo("border-width", 0);
        }
        else {
            this.styleTo("stroked", true);
            this.styleTo("border-color", c);
            this.styleTo("border-width", (width || 1) + "px");
        }
        return this;
    }
    fillText(c) {
        this.styleTo("color", c);
        return this;
    }
    cls(c) {
        if (typeof c == "boolean") {
            this._ctx.currentClass = "";
        }
        else {
            this._ctx.currentClass = c;
        }
        return this;
    }
    font(sizeOrFont, weight, style, lineHeight, family) {
        if (typeof sizeOrFont == "number") {
            this._font.size = sizeOrFont;
            if (family)
                this._font.face = family;
            if (weight)
                this._font.weight = weight;
            if (style)
                this._font.style = style;
            if (lineHeight)
                this._font.lineHeight = lineHeight;
        }
        else {
            this._font = sizeOrFont;
        }
        this._ctx.style['font'] = this._font.value;
        return this;
    }
    reset() {
        this._ctx.style = Object.assign({}, this._style);
        this._font = new _Form__WEBPACK_IMPORTED_MODULE_1__.Font(10, "sans-serif");
        this._ctx.style['font'] = this._font.value;
        return this;
    }
    updateScope(group_id, group) {
        this._ctx.group = group;
        this._ctx.groupID = group_id;
        this._ctx.groupCount = 0;
        this.nextID();
        return this._ctx;
    }
    scope(item) {
        if (!item || item.animateID == null)
            throw new Error("item not defined or not yet added to Space");
        return this.updateScope(HTMLForm.scopeID(item), this.space.element);
    }
    nextID() {
        this._ctx.groupCount++;
        this._ctx.currentID = `${this._ctx.groupID}-${this._ctx.groupCount}`;
        return this._ctx.currentID;
    }
    static getID(ctx) {
        return ctx.currentID || `p-${HTMLForm.domID++}`;
    }
    static scopeID(item) {
        return `item-${item.animateID}`;
    }
    static style(elem, styles) {
        let st = [];
        if (!styles["filled"])
            st.push("background: none");
        if (!styles["stroked"])
            st.push("border: none");
        for (let k in styles) {
            if (styles.hasOwnProperty(k) && k != "filled" && k != "stroked") {
                let v = styles[k];
                if (v) {
                    if (!styles["filled"] && k.indexOf('background') === 0) {
                        continue;
                    }
                    else if (!styles["stroked"] && k.indexOf('border-width') === 0) {
                        continue;
                    }
                    else {
                        st.push(`${k}: ${v}`);
                    }
                }
            }
        }
        return HTMLSpace.setAttr(elem, { style: st.join(";") });
    }
    static rectStyle(ctx, pt, size) {
        ctx.style["left"] = pt[0] + "px";
        ctx.style["top"] = pt[1] + "px";
        ctx.style["width"] = size[0] + "px";
        ctx.style["height"] = size[1] + "px";
        return ctx;
    }
    static textStyle(ctx, pt) {
        ctx.style["left"] = pt[0] + "px";
        ctx.style["top"] = pt[1] + "px";
        return ctx;
    }
    static point(ctx, pt, radius = 5, shape = "square") {
        if (shape === "circle") {
            return HTMLForm.circle(ctx, pt, radius);
        }
        else {
            return HTMLForm.square(ctx, pt, radius);
        }
    }
    point(pt, radius = 5, shape = "square") {
        this.nextID();
        if (shape == "circle")
            this.styleTo("border-radius", "100%");
        HTMLForm.point(this._ctx, pt, radius, shape);
        return this;
    }
    static circle(ctx, pt, radius = 10) {
        let elem = HTMLSpace.htmlElement(ctx.group, "div", HTMLForm.getID(ctx));
        HTMLSpace.setAttr(elem, { class: `pts-form pts-circle ${ctx.currentClass}` });
        HTMLForm.rectStyle(ctx, new _Pt__WEBPACK_IMPORTED_MODULE_3__.Pt(pt).$subtract(radius), new _Pt__WEBPACK_IMPORTED_MODULE_3__.Pt(radius * 2, radius * 2));
        HTMLForm.style(elem, ctx.style);
        return elem;
    }
    circle(pts) {
        this.nextID();
        this.styleTo("border-radius", "100%");
        HTMLForm.circle(this._ctx, pts[0], pts[1][0]);
        return this;
    }
    static square(ctx, pt, halfsize) {
        let elem = HTMLSpace.htmlElement(ctx.group, "div", HTMLForm.getID(ctx));
        HTMLSpace.setAttr(elem, { class: `pts-form pts-square ${ctx.currentClass}` });
        HTMLForm.rectStyle(ctx, new _Pt__WEBPACK_IMPORTED_MODULE_3__.Pt(pt).$subtract(halfsize), new _Pt__WEBPACK_IMPORTED_MODULE_3__.Pt(halfsize * 2, halfsize * 2));
        HTMLForm.style(elem, ctx.style);
        return elem;
    }
    square(pt, halfsize) {
        this.nextID();
        HTMLForm.square(this._ctx, pt, halfsize);
        return this;
    }
    static rect(ctx, pts) {
        if (!this._checkSize(pts))
            return;
        let elem = HTMLSpace.htmlElement(ctx.group, "div", HTMLForm.getID(ctx));
        HTMLSpace.setAttr(elem, { class: `pts-form pts-rect ${ctx.currentClass}` });
        HTMLForm.rectStyle(ctx, pts[0], pts[1]);
        HTMLForm.style(elem, ctx.style);
        return elem;
    }
    rect(pts) {
        this.nextID();
        this.styleTo("border-radius", "0");
        HTMLForm.rect(this._ctx, pts);
        return this;
    }
    static text(ctx, pt, txt) {
        let elem = HTMLSpace.htmlElement(ctx.group, "div", HTMLForm.getID(ctx));
        HTMLSpace.setAttr(elem, { class: `pts-form pts-text ${ctx.currentClass}` });
        elem.textContent = txt;
        HTMLForm.textStyle(ctx, pt);
        HTMLForm.style(elem, ctx.style);
        return elem;
    }
    text(pt, txt) {
        this.nextID();
        HTMLForm.text(this._ctx, pt, txt);
        return this;
    }
    log(txt) {
        this.fill("#000").stroke("#fff", 0.5).text([10, 14], txt);
        return this;
    }
    arc(pt, radius, startAngle, endAngle, cc) {
        _Util__WEBPACK_IMPORTED_MODULE_2__.Util.warn("arc is not implemented in HTMLForm");
        return this;
    }
    line(pts) {
        _Util__WEBPACK_IMPORTED_MODULE_2__.Util.warn("line is not implemented in HTMLForm");
        return this;
    }
    polygon(pts) {
        _Util__WEBPACK_IMPORTED_MODULE_2__.Util.warn("polygon is not implemented in HTMLForm");
        return this;
    }
}
HTMLForm.groupID = 0;
HTMLForm.domID = 0;
//# sourceMappingURL=Dom.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Form.js":
/*!**********************************************!*\
  !*** ./node_modules/pts/dist/es2015/Form.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Form": () => (/* binding */ Form),
/* harmony export */   "VisualForm": () => (/* binding */ VisualForm),
/* harmony export */   "Font": () => (/* binding */ Font)
/* harmony export */ });
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util */ "./node_modules/pts/dist/es2015/Util.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */

class Form {
    constructor() {
        this._ready = false;
    }
    get ready() { return this._ready; }
    static _checkSize(pts, required = 2) {
        if (pts.length < required) {
            _Util__WEBPACK_IMPORTED_MODULE_0__.Util.warn("Requires 2 or more Pts in this Group.");
            return false;
        }
        return true;
    }
}
class VisualForm extends Form {
    constructor() {
        super(...arguments);
        this._filled = true;
        this._stroked = true;
        this._font = new Font(14, "sans-serif");
    }
    get filled() { return this._filled; }
    set filled(b) { this._filled = b; }
    get stroked() { return this._stroked; }
    set stroked(b) { this._stroked = b; }
    get currentFont() { return this._font; }
    _multiple(groups, shape, ...rest) {
        if (!groups)
            return this;
        for (let i = 0, len = groups.length; i < len; i++) {
            this[shape](groups[i], ...rest);
        }
        return this;
    }
    alpha(a) {
        return this;
    }
    fill(c) {
        return this;
    }
    fillOnly(c) {
        this.stroke(false);
        return this.fill(c);
    }
    stroke(c, width, linejoin, linecap) {
        return this;
    }
    strokeOnly(c, width, linejoin, linecap) {
        this.fill(false);
        return this.stroke(c, width, linejoin, linecap);
    }
    points(pts, radius, shape) {
        if (!pts)
            return;
        for (let i = 0, len = pts.length; i < len; i++) {
            this.point(pts[i], radius, shape);
        }
        return this;
    }
    circles(groups) {
        return this._multiple(groups, "circle");
    }
    squares(groups) {
        return this._multiple(groups, "square");
    }
    lines(groups) {
        return this._multiple(groups, "line");
    }
    polygons(groups) {
        return this._multiple(groups, "polygon");
    }
    rects(groups) {
        return this._multiple(groups, "rect");
    }
}
class Font {
    constructor(size = 12, face = "sans-serif", weight = "", style = "", lineHeight = 1.5) {
        this.size = size;
        this.face = face;
        this.style = style;
        this.weight = weight;
        this.lineHeight = lineHeight;
    }
    get value() { return `${this.style} ${this.weight} ${this.size}px/${this.lineHeight} ${this.face}`; }
    toString() { return this.value; }
}
//# sourceMappingURL=Form.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/LinearAlgebra.js":
/*!*******************************************************!*\
  !*** ./node_modules/pts/dist/es2015/LinearAlgebra.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vec": () => (/* binding */ Vec),
/* harmony export */   "Mat": () => (/* binding */ Mat)
/* harmony export */ });
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/* harmony import */ var _Op__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Op */ "./node_modules/pts/dist/es2015/Op.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */


class Vec {
    static add(a, b) {
        if (typeof b == "number") {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] += b;
        }
        else {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] += b[i] || 0;
        }
        return a;
    }
    static subtract(a, b) {
        if (typeof b == "number") {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] -= b;
        }
        else {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] -= b[i] || 0;
        }
        return a;
    }
    static multiply(a, b) {
        if (typeof b == "number") {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] *= b;
        }
        else {
            if (a.length != b.length) {
                throw new Error(`Cannot do element-wise multiply since the array lengths don't match: ${a.toString()} multiply-with ${b.toString()}`);
            }
            for (let i = 0, len = a.length; i < len; i++)
                a[i] *= b[i];
        }
        return a;
    }
    static divide(a, b) {
        if (typeof b == "number") {
            if (b === 0)
                throw new Error("Cannot divide by zero");
            for (let i = 0, len = a.length; i < len; i++)
                a[i] /= b;
        }
        else {
            if (a.length != b.length) {
                throw new Error(`Cannot do element-wise divide since the array lengths don't match. ${a.toString()} divide-by ${b.toString()}`);
            }
            for (let i = 0, len = a.length; i < len; i++)
                a[i] /= b[i];
        }
        return a;
    }
    static dot(a, b) {
        if (a.length != b.length)
            throw new Error("Array lengths don't match");
        let d = 0;
        for (let i = 0, len = a.length; i < len; i++) {
            d += a[i] * b[i];
        }
        return d;
    }
    static cross2D(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }
    static cross(a, b) {
        return new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt((a[1] * b[2] - a[2] * b[1]), (a[2] * b[0] - a[0] * b[2]), (a[0] * b[1] - a[1] * b[0]));
    }
    static magnitude(a) {
        return Math.sqrt(Vec.dot(a, a));
    }
    static unit(a, magnitude = undefined) {
        let m = (magnitude === undefined) ? Vec.magnitude(a) : magnitude;
        if (m === 0)
            return _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt.make(a.length);
        return Vec.divide(a, m);
    }
    static abs(a) {
        return Vec.map(a, Math.abs);
    }
    static floor(a) {
        return Vec.map(a, Math.floor);
    }
    static ceil(a) {
        return Vec.map(a, Math.ceil);
    }
    static round(a) {
        return Vec.map(a, Math.round);
    }
    static max(a) {
        let m = Number.MIN_VALUE;
        let index = 0;
        for (let i = 0, len = a.length; i < len; i++) {
            m = Math.max(m, a[i]);
            if (m === a[i])
                index = i;
        }
        return { value: m, index: index };
    }
    static min(a) {
        let m = Number.MAX_VALUE;
        let index = 0;
        for (let i = 0, len = a.length; i < len; i++) {
            m = Math.min(m, a[i]);
            if (m === a[i])
                index = i;
        }
        return { value: m, index: index };
    }
    static sum(a) {
        let s = 0;
        for (let i = 0, len = a.length; i < len; i++)
            s += a[i];
        return s;
    }
    static map(a, fn) {
        for (let i = 0, len = a.length; i < len; i++) {
            a[i] = fn(a[i], i, a);
        }
        return a;
    }
}
class Mat {
    static add(a, b) {
        if (typeof b != "number") {
            if (a[0].length != b[0].length)
                throw new Error("Cannot add matrix if rows' and columns' size don't match.");
            if (a.length != b.length)
                throw new Error("Cannot add matrix if rows' and columns' size don't match.");
        }
        let g = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group();
        let isNum = typeof b == "number";
        for (let i = 0, len = a.length; i < len; i++) {
            g.push(a[i].$add((isNum) ? b : b[i]));
        }
        return g;
    }
    static multiply(a, b, transposed = false, elementwise = false) {
        let g = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group();
        if (typeof b != "number") {
            if (elementwise) {
                if (a.length != b.length)
                    throw new Error("Cannot multiply matrix element-wise because the matrices' sizes don't match.");
                for (let ai = 0, alen = a.length; ai < alen; ai++) {
                    g.push(a[ai].$multiply(b[ai]));
                }
            }
            else {
                if (!transposed && a[0].length != b.length)
                    throw new Error("Cannot multiply matrix if rows in matrix-a don't match columns in matrix-b.");
                if (transposed && a[0].length != b[0].length)
                    throw new Error("Cannot multiply matrix if transposed and the columns in both matrices don't match.");
                if (!transposed)
                    b = Mat.transpose(b);
                for (let ai = 0, alen = a.length; ai < alen; ai++) {
                    let p = _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt.make(b.length, 0);
                    for (let bi = 0, blen = b.length; bi < blen; bi++) {
                        p[bi] = Vec.dot(a[ai], b[bi]);
                    }
                    g.push(p);
                }
            }
        }
        else {
            for (let ai = 0, alen = a.length; ai < alen; ai++) {
                g.push(a[ai].$multiply(b));
            }
        }
        return g;
    }
    static zipSlice(g, index, defaultValue = false) {
        let z = [];
        for (let i = 0, len = g.length; i < len; i++) {
            if (g[i].length - 1 < index && defaultValue === false)
                throw `Index ${index} is out of bounds`;
            z.push(g[i][index] || defaultValue);
        }
        return new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(z);
    }
    static zip(g, defaultValue = false, useLongest = false) {
        let ps = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group();
        let len = (useLongest) ? g.reduce((a, b) => Math.max(a, b.length), 0) : g[0].length;
        for (let i = 0; i < len; i++) {
            ps.push(Mat.zipSlice(g, i, defaultValue));
        }
        return ps;
    }
    static transpose(g, defaultValue = false, useLongest = false) {
        return Mat.zip(g, defaultValue, useLongest);
    }
    static transform2D(pt, m) {
        let x = pt[0] * m[0][0] + pt[1] * m[1][0] + m[2][0];
        let y = pt[0] * m[0][1] + pt[1] * m[1][1] + m[2][1];
        return new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(x, y);
    }
    static scale2DMatrix(x, y) {
        return new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(x, 0, 0), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, y, 0), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 0, 1));
    }
    static rotate2DMatrix(cosA, sinA) {
        return new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(cosA, sinA, 0), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(-sinA, cosA, 0), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 0, 1));
    }
    static shear2DMatrix(tanX, tanY) {
        return new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(1, tanX, 0), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(tanY, 1, 0), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 0, 1));
    }
    static translate2DMatrix(x, y) {
        return new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(1, 0, 0), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, 1, 0), new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(x, y, 1));
    }
    static scaleAt2DMatrix(sx, sy, at) {
        let m = Mat.scale2DMatrix(sx, sy);
        m[2][0] = -at[0] * sx + at[0];
        m[2][1] = -at[1] * sy + at[1];
        return m;
    }
    static rotateAt2DMatrix(cosA, sinA, at) {
        let m = Mat.rotate2DMatrix(cosA, sinA);
        m[2][0] = at[0] * (1 - cosA) + at[1] * sinA;
        m[2][1] = at[1] * (1 - cosA) - at[0] * sinA;
        return m;
    }
    static shearAt2DMatrix(tanX, tanY, at) {
        let m = Mat.shear2DMatrix(tanX, tanY);
        m[2][0] = -at[1] * tanY;
        m[2][1] = -at[0] * tanX;
        return m;
    }
    static reflectAt2DMatrix(p1, p2) {
        let intercept = _Op__WEBPACK_IMPORTED_MODULE_1__.Line.intercept(p1, p2);
        if (intercept == undefined) {
            return [
                new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt([-1, 0, 0]),
                new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt([0, 1, 0]),
                new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt([p1[0] + p2[0], 0, 1])
            ];
        }
        else {
            let yi = intercept.yi;
            let ang2 = Math.atan(intercept.slope) * 2;
            let cosA = Math.cos(ang2);
            let sinA = Math.sin(ang2);
            return [
                new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt([cosA, sinA, 0]),
                new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt([sinA, -cosA, 0]),
                new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt([-yi * sinA, yi + yi * cosA, 1])
            ];
        }
    }
}
//# sourceMappingURL=LinearAlgebra.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Num.js":
/*!*********************************************!*\
  !*** ./node_modules/pts/dist/es2015/Num.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Num": () => (/* binding */ Num),
/* harmony export */   "Geom": () => (/* binding */ Geom),
/* harmony export */   "Shaping": () => (/* binding */ Shaping),
/* harmony export */   "Range": () => (/* binding */ Range)
/* harmony export */ });
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util */ "./node_modules/pts/dist/es2015/Util.js");
/* harmony import */ var _Op__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Op */ "./node_modules/pts/dist/es2015/Op.js");
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/* harmony import */ var _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LinearAlgebra */ "./node_modules/pts/dist/es2015/LinearAlgebra.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */




class Num {
    static equals(a, b, threshold = 0.00001) {
        return Math.abs(a - b) < threshold;
    }
    static lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }
    static clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }
    static boundValue(val, min, max) {
        let len = Math.abs(max - min);
        let a = val % len;
        if (a > max)
            a -= len;
        else if (a < min)
            a += len;
        return a;
    }
    static within(p, a, b) {
        return p >= Math.min(a, b) && p <= Math.max(a, b);
    }
    static randomRange(a, b = 0) {
        let r = (a > b) ? (a - b) : (b - a);
        return a + Math.random() * r;
    }
    static normalizeValue(n, a, b) {
        let min = Math.min(a, b);
        let max = Math.max(a, b);
        return (n - min) / (max - min);
    }
    static sum(pts) {
        let c = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(pts[0]);
        for (let i = 1, len = pts.length; i < len; i++) {
            _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Vec.add(c, pts[i]);
        }
        return c;
    }
    static average(pts) {
        return Num.sum(pts).divide(pts.length);
    }
    static cycle(t, method = Shaping.sineInOut) {
        return method(t > 0.5 ? 2 - t * 2 : t * 2);
    }
    static mapToRange(n, currA, currB, targetA, targetB) {
        if (currA == currB)
            throw new Error("[currMin, currMax] must define a range that is not zero");
        let min = Math.min(targetA, targetB);
        let max = Math.max(targetA, targetB);
        return Num.normalizeValue(n, currA, currB) * (max - min) + min;
    }
}
class Geom {
    static boundAngle(angle) {
        return Num.boundValue(angle, 0, 360);
    }
    static boundRadian(radian) {
        return Num.boundValue(radian, 0, _Util__WEBPACK_IMPORTED_MODULE_0__.Const.two_pi);
    }
    static toRadian(angle) {
        return angle * _Util__WEBPACK_IMPORTED_MODULE_0__.Const.deg_to_rad;
    }
    static toDegree(radian) {
        return radian * _Util__WEBPACK_IMPORTED_MODULE_0__.Const.rad_to_deg;
    }
    static boundingBox(pts) {
        let minPt = pts.reduce((a, p) => a.$min(p));
        let maxPt = pts.reduce((a, p) => a.$max(p));
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(minPt, maxPt);
    }
    static centroid(pts) {
        return Num.average(pts);
    }
    static anchor(pts, ptOrIndex = 0, direction = "to") {
        let method = (direction == "to") ? "subtract" : "add";
        for (let i = 0, len = pts.length; i < len; i++) {
            if (typeof ptOrIndex == "number") {
                if (ptOrIndex !== i)
                    pts[i][method](pts[ptOrIndex]);
            }
            else {
                pts[i][method](ptOrIndex);
            }
        }
    }
    static interpolate(a, b, t = 0.5) {
        let len = Math.min(a.length, b.length);
        let d = _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt.make(len);
        for (let i = 0; i < len; i++) {
            d[i] = a[i] * (1 - t) + b[i] * t;
        }
        return d;
    }
    static perpendicular(pt, axis = _Util__WEBPACK_IMPORTED_MODULE_0__.Const.xy) {
        let y = axis[1];
        let x = axis[0];
        let p = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(pt);
        let pa = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(p);
        pa[x] = -p[y];
        pa[y] = p[x];
        let pb = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(p);
        pb[x] = p[y];
        pb[y] = -p[x];
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(pa, pb);
    }
    static isPerpendicular(p1, p2) {
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(p1).dot(p2) === 0;
    }
    static withinBound(pt, boundPt1, boundPt2) {
        for (let i = 0, len = Math.min(pt.length, boundPt1.length, boundPt2.length); i < len; i++) {
            if (!Num.within(pt[i], boundPt1[i], boundPt2[i]))
                return false;
        }
        return true;
    }
    static sortEdges(pts) {
        let bounds = Geom.boundingBox(pts);
        let center = bounds[1].add(bounds[0]).divide(2);
        let fn = (a, b) => {
            if (a.length < 2 || b.length < 2)
                throw new Error("Pt dimension cannot be less than 2");
            let da = a.$subtract(center);
            let db = b.$subtract(center);
            if (da[0] >= 0 && db[0] < 0)
                return 1;
            if (da[0] < 0 && db[0] >= 0)
                return -1;
            if (da[0] == 0 && db[0] == 0) {
                if (da[1] >= 0 || db[1] >= 0)
                    return (da[1] > db[1]) ? 1 : -1;
                return (db[1] > da[1]) ? 1 : -1;
            }
            let det = da.$cross2D(db);
            if (det < 0)
                return 1;
            if (det > 0)
                return -1;
            return (da[0] * da[0] + da[1] * da[1] > db[0] * db[0] + db[1] * db[1]) ? 1 : -1;
        };
        return pts.sort(fn);
    }
    static scale(ps, scale, anchor) {
        let pts = (!Array.isArray(ps)) ? [ps] : ps;
        let scs = (typeof scale == "number") ? _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt.make(pts[0].length, scale) : scale;
        if (!anchor)
            anchor = _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt.make(pts[0].length, 0);
        for (let i = 0, len = pts.length; i < len; i++) {
            let p = pts[i];
            for (let k = 0, lenP = p.length; k < lenP; k++) {
                p[k] = (anchor && anchor[k]) ? anchor[k] + (p[k] - anchor[k]) * scs[k] : p[k] * scs[k];
            }
        }
        return Geom;
    }
    static rotate2D(ps, angle, anchor, axis) {
        let pts = (!Array.isArray(ps)) ? [ps] : ps;
        let fn = (anchor) ? _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.rotateAt2DMatrix : _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.rotate2DMatrix;
        if (!anchor)
            anchor = _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt.make(pts[0].length, 0);
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        for (let i = 0, len = pts.length; i < len; i++) {
            let p = (axis) ? pts[i].$take(axis) : pts[i];
            p.to(_LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.transform2D(p, fn(cos, sin, anchor)));
            if (axis) {
                for (let k = 0; k < axis.length; k++) {
                    pts[i][axis[k]] = p[k];
                }
            }
        }
        return Geom;
    }
    static shear2D(ps, scale, anchor, axis) {
        let pts = (!Array.isArray(ps)) ? [ps] : ps;
        let s = (typeof scale == "number") ? [scale, scale] : scale;
        if (!anchor)
            anchor = _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt.make(pts[0].length, 0);
        let fn = (anchor) ? _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.shearAt2DMatrix : _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.shear2DMatrix;
        let tanx = Math.tan(s[0]);
        let tany = Math.tan(s[1]);
        for (let i = 0, len = pts.length; i < len; i++) {
            let p = (axis) ? pts[i].$take(axis) : pts[i];
            p.to(_LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.transform2D(p, fn(tanx, tany, anchor)));
            if (axis) {
                for (let k = 0; k < axis.length; k++) {
                    pts[i][axis[k]] = p[k];
                }
            }
        }
        return Geom;
    }
    static reflect2D(ps, line, axis) {
        let pts = (!Array.isArray(ps)) ? [ps] : ps;
        let mat = _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.reflectAt2DMatrix(line[0], line[1]);
        for (let i = 0, len = pts.length; i < len; i++) {
            let p = (axis) ? pts[i].$take(axis) : pts[i];
            p.to(_LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.transform2D(p, mat));
            if (axis) {
                for (let k = 0; k < axis.length; k++) {
                    pts[i][axis[k]] = p[k];
                }
            }
        }
        return Geom;
    }
    static cosTable() {
        let cos = new Float64Array(360);
        for (let i = 0; i < 360; i++)
            cos[i] = Math.cos(i * Math.PI / 180);
        let find = (rad) => cos[Math.floor(Geom.boundAngle(Geom.toDegree(rad)))];
        return { table: cos, cos: find };
    }
    static sinTable() {
        let sin = new Float64Array(360);
        for (let i = 0; i < 360; i++)
            sin[i] = Math.sin(i * Math.PI / 180);
        let find = (rad) => sin[Math.floor(Geom.boundAngle(Geom.toDegree(rad)))];
        return { table: sin, sin: find };
    }
}
class Shaping {
    static linear(t, c = 1) {
        return c * t;
    }
    static quadraticIn(t, c = 1) {
        return c * t * t;
    }
    static quadraticOut(t, c = 1) {
        return -c * t * (t - 2);
    }
    static quadraticInOut(t, c = 1) {
        let dt = t * 2;
        return (t < 0.5) ? c / 2 * t * t * 4 : -c / 2 * ((dt - 1) * (dt - 3) - 1);
    }
    static cubicIn(t, c = 1) {
        return c * t * t * t;
    }
    static cubicOut(t, c = 1) {
        let dt = t - 1;
        return c * (dt * dt * dt + 1);
    }
    static cubicInOut(t, c = 1) {
        let dt = t * 2;
        return (t < 0.5) ? c / 2 * dt * dt * dt : c / 2 * ((dt - 2) * (dt - 2) * (dt - 2) + 2);
    }
    static exponentialIn(t, c = 1, p = 0.25) {
        return c * Math.pow(t, 1 / p);
    }
    static exponentialOut(t, c = 1, p = 0.25) {
        return c * Math.pow(t, p);
    }
    static sineIn(t, c = 1) {
        return -c * Math.cos(t * _Util__WEBPACK_IMPORTED_MODULE_0__.Const.half_pi) + c;
    }
    static sineOut(t, c = 1) {
        return c * Math.sin(t * _Util__WEBPACK_IMPORTED_MODULE_0__.Const.half_pi);
    }
    static sineInOut(t, c = 1) {
        return -c / 2 * (Math.cos(Math.PI * t) - 1);
    }
    static cosineApprox(t, c = 1) {
        let t2 = t * t;
        let t4 = t2 * t2;
        let t6 = t4 * t2;
        return c * (4 * t6 / 9 - 17 * t4 / 9 + 22 * t2 / 9);
    }
    static circularIn(t, c = 1) {
        return -c * (Math.sqrt(1 - t * t) - 1);
    }
    static circularOut(t, c = 1) {
        let dt = t - 1;
        return c * Math.sqrt(1 - dt * dt);
    }
    static circularInOut(t, c = 1) {
        let dt = t * 2;
        return (t < 0.5) ? -c / 2 * (Math.sqrt(1 - dt * dt) - 1) : c / 2 * (Math.sqrt(1 - (dt - 2) * (dt - 2)) + 1);
    }
    static elasticIn(t, c = 1, p = 0.7) {
        let dt = t - 1;
        let s = (p / _Util__WEBPACK_IMPORTED_MODULE_0__.Const.two_pi) * 1.5707963267948966;
        return c * (-Math.pow(2, 10 * dt) * Math.sin((dt - s) * _Util__WEBPACK_IMPORTED_MODULE_0__.Const.two_pi / p));
    }
    static elasticOut(t, c = 1, p = 0.7) {
        let s = (p / _Util__WEBPACK_IMPORTED_MODULE_0__.Const.two_pi) * 1.5707963267948966;
        return c * (Math.pow(2, -10 * t) * Math.sin((t - s) * _Util__WEBPACK_IMPORTED_MODULE_0__.Const.two_pi / p)) + c;
    }
    static elasticInOut(t, c = 1, p = 0.6) {
        let dt = t * 2;
        let s = (p / _Util__WEBPACK_IMPORTED_MODULE_0__.Const.two_pi) * 1.5707963267948966;
        if (t < 0.5) {
            dt -= 1;
            return c * (-0.5 * (Math.pow(2, 10 * dt) * Math.sin((dt - s) * _Util__WEBPACK_IMPORTED_MODULE_0__.Const.two_pi / p)));
        }
        else {
            dt -= 1;
            return c * (0.5 * (Math.pow(2, -10 * dt) * Math.sin((dt - s) * _Util__WEBPACK_IMPORTED_MODULE_0__.Const.two_pi / p))) + c;
        }
    }
    static bounceIn(t, c = 1) {
        return c - Shaping.bounceOut((1 - t), c);
    }
    static bounceOut(t, c = 1) {
        if (t < (1 / 2.75)) {
            return c * (7.5625 * t * t);
        }
        else if (t < (2 / 2.75)) {
            t -= 1.5 / 2.75;
            return c * (7.5625 * t * t + 0.75);
        }
        else if (t < (2.5 / 2.75)) {
            t -= 2.25 / 2.75;
            return c * (7.5625 * t * t + 0.9375);
        }
        else {
            t -= 2.625 / 2.75;
            return c * (7.5625 * t * t + 0.984375);
        }
    }
    static bounceInOut(t, c = 1) {
        return (t < 0.5) ? Shaping.bounceIn(t * 2, c) / 2 : Shaping.bounceOut(t * 2 - 1, c) / 2 + c / 2;
    }
    static sigmoid(t, c = 1, p = 10) {
        let d = p * (t - 0.5);
        return c / (1 + Math.exp(-d));
    }
    static logSigmoid(t, c = 1, p = 0.7) {
        p = Math.max(_Util__WEBPACK_IMPORTED_MODULE_0__.Const.epsilon, Math.min(1 - _Util__WEBPACK_IMPORTED_MODULE_0__.Const.epsilon, p));
        p = 1 / (1 - p);
        let A = 1 / (1 + Math.exp(((t - 0.5) * p * -2)));
        let B = 1 / (1 + Math.exp(p));
        let C = 1 / (1 + Math.exp(-p));
        return c * (A - B) / (C - B);
    }
    static seat(t, c = 1, p = 0.5) {
        if ((t < 0.5)) {
            return c * (Math.pow(2 * t, 1 - p)) / 2;
        }
        else {
            return c * (1 - (Math.pow(2 * (1 - t), 1 - p)) / 2);
        }
    }
    static quadraticBezier(t, c = 1, p = [0.05, 0.95]) {
        let a = (typeof p != "number") ? p[0] : p;
        let b = (typeof p != "number") ? p[1] : 0.5;
        let om2a = 1 - 2 * a;
        if (om2a === 0) {
            om2a = _Util__WEBPACK_IMPORTED_MODULE_0__.Const.epsilon;
        }
        let d = (Math.sqrt(a * a + om2a * t) - a) / om2a;
        return c * ((1 - 2 * b) * (d * d) + (2 * b) * d);
    }
    static cubicBezier(t, c = 1, p1 = [0.1, 0.7], p2 = [0.9, 0.2]) {
        let curve = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(0, 0), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(p1), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(p2), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(1, 1));
        return c * _Op__WEBPACK_IMPORTED_MODULE_1__.Curve.bezierStep(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(t * t * t, t * t, t, 1), _Op__WEBPACK_IMPORTED_MODULE_1__.Curve.controlPoints(curve)).y;
    }
    static quadraticTarget(t, c = 1, p1 = [0.2, 0.35]) {
        let a = Math.min(1 - _Util__WEBPACK_IMPORTED_MODULE_0__.Const.epsilon, Math.max(_Util__WEBPACK_IMPORTED_MODULE_0__.Const.epsilon, p1[0]));
        let b = Math.min(1, Math.max(0, p1[1]));
        let A = (1 - b) / (1 - a) - (b / a);
        let B = (A * (a * a) - b) / a;
        let y = A * (t * t) - B * t;
        return c * Math.min(1, Math.max(0, y));
    }
    static cliff(t, c = 1, p = 0.5) {
        return (t > p) ? c : 0;
    }
    static step(fn, steps, t, c, ...args) {
        let s = 1 / steps;
        let tt = Math.floor(t / s) * s;
        return fn(tt, c, ...args);
    }
}
class Range {
    constructor(g) {
        this._dims = 0;
        this._source = _Pt__WEBPACK_IMPORTED_MODULE_2__.Group.fromPtArray(g);
        this.calc();
    }
    get max() { return this._max.clone(); }
    get min() { return this._min.clone(); }
    get magnitude() { return this._mag.clone(); }
    calc() {
        if (!this._source)
            return;
        let dims = this._source[0].length;
        this._dims = dims;
        let max = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(dims);
        let min = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(dims);
        let mag = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(dims);
        for (let i = 0; i < dims; i++) {
            max[i] = _Util__WEBPACK_IMPORTED_MODULE_0__.Const.min;
            min[i] = _Util__WEBPACK_IMPORTED_MODULE_0__.Const.max;
            mag[i] = 0;
            let s = this._source.zipSlice(i);
            for (let k = 0, len = s.length; k < len; k++) {
                max[i] = Math.max(max[i], s[k]);
                min[i] = Math.min(min[i], s[k]);
                mag[i] = max[i] - min[i];
            }
        }
        this._max = max;
        this._min = min;
        this._mag = mag;
        return this;
    }
    mapTo(min, max, exclude) {
        let target = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        for (let i = 0, len = this._source.length; i < len; i++) {
            let g = this._source[i];
            let n = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(this._dims);
            for (let k = 0; k < this._dims; k++) {
                n[k] = (exclude && exclude[k]) ? g[k] : Num.mapToRange(g[k], this._min[k], this._max[k], min, max);
            }
            target.push(n);
        }
        return target;
    }
    append(g, update = true) {
        if (g[0].length !== this._dims)
            throw new Error(`Dimensions don't match. ${this._dims} dimensions in Range and ${g[0].length} provided in parameter. `);
        this._source = this._source.concat(g);
        if (update)
            this.calc();
        return this;
    }
    ticks(count) {
        let g = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        for (let i = 0; i <= count; i++) {
            let p = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(this._dims);
            for (let k = 0, len = this._max.length; k < len; k++) {
                p[k] = Num.lerp(this._min[k], this._max[k], i / count);
            }
            g.push(p);
        }
        return g;
    }
}
//# sourceMappingURL=Num.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Op.js":
/*!********************************************!*\
  !*** ./node_modules/pts/dist/es2015/Op.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Line": () => (/* binding */ Line),
/* harmony export */   "Rectangle": () => (/* binding */ Rectangle),
/* harmony export */   "Circle": () => (/* binding */ Circle),
/* harmony export */   "Triangle": () => (/* binding */ Triangle),
/* harmony export */   "Polygon": () => (/* binding */ Polygon),
/* harmony export */   "Curve": () => (/* binding */ Curve)
/* harmony export */ });
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util */ "./node_modules/pts/dist/es2015/Util.js");
/* harmony import */ var _Num__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Num */ "./node_modules/pts/dist/es2015/Num.js");
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/* harmony import */ var _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LinearAlgebra */ "./node_modules/pts/dist/es2015/LinearAlgebra.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */




let _errorLength = (obj, param = "expected") => _Util__WEBPACK_IMPORTED_MODULE_0__.Util.warn("Group's length is less than " + param, obj);
let _errorOutofBound = (obj, param = "") => _Util__WEBPACK_IMPORTED_MODULE_0__.Util.warn(`Index ${param} is out of bound in Group`, obj);
class Line {
    static fromAngle(anchor, angle, magnitude) {
        let g = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(anchor), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(anchor));
        g[1].toAngle(angle, magnitude, true);
        return g;
    }
    static slope(p1, p2) {
        return (p2[0] - p1[0] === 0) ? undefined : (p2[1] - p1[1]) / (p2[0] - p1[0]);
    }
    static intercept(p1, p2) {
        if (p2[0] - p1[0] === 0) {
            return undefined;
        }
        else {
            let m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
            let c = p1[1] - m * p1[0];
            return { slope: m, yi: c, xi: (m === 0) ? undefined : -c / m };
        }
    }
    static sideOfPt2D(line, pt) {
        return (line[1][0] - line[0][0]) * (pt[1] - line[0][1]) - (pt[0] - line[0][0]) * (line[1][1] - line[0][1]);
    }
    static collinear(p1, p2, p3, threshold = 0.01) {
        let a = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(0, 0, 0).to(p1).$subtract(p2);
        let b = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(0, 0, 0).to(p1).$subtract(p3);
        return a.$cross(b).divide(1000).equals(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(0, 0, 0), threshold);
    }
    static magnitude(line) {
        return (line.length >= 2) ? line[1].$subtract(line[0]).magnitude() : 0;
    }
    static magnitudeSq(line) {
        return (line.length >= 2) ? line[1].$subtract(line[0]).magnitudeSq() : 0;
    }
    static perpendicularFromPt(line, pt, asProjection = false) {
        if (line[0].equals(line[1]))
            return undefined;
        let a = line[0].$subtract(line[1]);
        let b = line[1].$subtract(pt);
        let proj = b.$subtract(a.$project(b));
        return (asProjection) ? proj : proj.$add(pt);
    }
    static distanceFromPt(line, pt) {
        let projectionVector = Line.perpendicularFromPt(line, pt, true);
        if (projectionVector) {
            return projectionVector.magnitude();
        }
        else {
            return line[0].$subtract(pt).magnitude();
        }
    }
    static intersectRay2D(la, lb) {
        let a = Line.intercept(la[0], la[1]);
        let b = Line.intercept(lb[0], lb[1]);
        let pa = la[0];
        let pb = lb[0];
        if (a == undefined) {
            if (b == undefined)
                return undefined;
            let y1 = -b.slope * (pb[0] - pa[0]) + pb[1];
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(pa[0], y1);
        }
        else {
            if (b == undefined) {
                let y1 = -a.slope * (pa[0] - pb[0]) + pa[1];
                return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(pb[0], y1);
            }
            else if (b.slope != a.slope) {
                let px = (a.slope * pa[0] - b.slope * pb[0] + pb[1] - pa[1]) / (a.slope - b.slope);
                let py = a.slope * (px - pa[0]) + pa[1];
                return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(px, py);
            }
            else {
                if (a.yi == b.yi) {
                    return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(pa[0], pa[1]);
                }
                else {
                    return undefined;
                }
            }
        }
    }
    static intersectLine2D(la, lb) {
        let pt = Line.intersectRay2D(la, lb);
        return (pt && _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.withinBound(pt, la[0], la[1]) && _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.withinBound(pt, lb[0], lb[1])) ? pt : undefined;
    }
    static intersectLineWithRay2D(line, ray) {
        let pt = Line.intersectRay2D(line, ray);
        return (pt && _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.withinBound(pt, line[0], line[1])) ? pt : undefined;
    }
    static intersectPolygon2D(lineOrRay, poly, sourceIsRay = false) {
        let fn = sourceIsRay ? Line.intersectLineWithRay2D : Line.intersectLine2D;
        let pts = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        for (let i = 0, len = poly.length; i < len; i++) {
            let next = (i === len - 1) ? 0 : i + 1;
            let d = fn([poly[i], poly[next]], lineOrRay);
            if (d)
                pts.push(d);
        }
        return (pts.length > 0) ? pts : undefined;
    }
    static intersectLines2D(lines1, lines2, isRay = false) {
        let group = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        let fn = isRay ? Line.intersectLineWithRay2D : Line.intersectLine2D;
        for (let i = 0, len = lines1.length; i < len; i++) {
            for (let k = 0, lenk = lines2.length; k < lenk; k++) {
                let _ip = fn(lines1[i], lines2[k]);
                if (_ip)
                    group.push(_ip);
            }
        }
        return group;
    }
    static intersectGridWithRay2D(ray, gridPt) {
        let t = Line.intercept(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(ray[0]).subtract(gridPt), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(ray[1]).subtract(gridPt));
        let g = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        if (t && t.xi)
            g.push(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(gridPt[0] + t.xi, gridPt[1]));
        if (t && t.yi)
            g.push(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(gridPt[0], gridPt[1] + t.yi));
        return g;
    }
    static intersectGridWithLine2D(line, gridPt) {
        let g = Line.intersectGridWithRay2D(line, gridPt);
        let gg = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        for (let i = 0, len = g.length; i < len; i++) {
            if (_Num__WEBPACK_IMPORTED_MODULE_1__.Geom.withinBound(g[i], line[0], line[1]))
                gg.push(g[i]);
        }
        return gg;
    }
    static intersectRect2D(line, rect) {
        let box = _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.boundingBox(_Pt__WEBPACK_IMPORTED_MODULE_2__.Group.fromPtArray(line));
        if (!Rectangle.hasIntersectRect2D(box, rect))
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        return Line.intersectLines2D([line], Rectangle.sides(rect));
    }
    static subpoints(line, num) {
        let pts = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        for (let i = 1; i <= num; i++) {
            pts.push(_Num__WEBPACK_IMPORTED_MODULE_1__.Geom.interpolate(line[0], line[1], i / (num + 1)));
        }
        return pts;
    }
    static crop(line, size, index = 0, cropAsCircle = true) {
        let tdx = (index === 0) ? 1 : 0;
        let ls = line[tdx].$subtract(line[index]);
        if (ls[0] === 0 || size[0] === 0)
            return line[index];
        if (cropAsCircle) {
            let d = ls.unit().multiply(size[1]);
            return line[index].$add(d);
        }
        else {
            let rect = Rectangle.fromCenter(line[index], size);
            let sides = Rectangle.sides(rect);
            let sideIdx = 0;
            if (Math.abs(ls[1] / ls[0]) > Math.abs(size[1] / size[0])) {
                sideIdx = (ls[1] < 0) ? 0 : 2;
            }
            else {
                sideIdx = (ls[0] < 0) ? 3 : 1;
            }
            return Line.intersectRay2D(sides[sideIdx], line);
        }
    }
    static marker(line, size, graphic = ("arrow" || 0), atTail = true) {
        let h = atTail ? 0 : 1;
        let t = atTail ? 1 : 0;
        let unit = line[h].$subtract(line[t]);
        if (unit.magnitudeSq() === 0)
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        unit.unit();
        let ps = _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.perpendicular(unit).multiply(size[0]).add(line[t]);
        if (graphic == "arrow") {
            ps.add(unit.$multiply(size[1]));
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(line[t], ps[0], ps[1]);
        }
        else {
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(ps[0], ps[1]);
        }
    }
    static toRect(line) {
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(line[0].$min(line[1]), line[0].$max(line[1]));
    }
}
class Rectangle {
    static from(topLeft, widthOrSize, height) {
        return Rectangle.fromTopLeft(topLeft, widthOrSize, height);
    }
    static fromTopLeft(topLeft, widthOrSize, height) {
        let size = (typeof widthOrSize == "number") ? [widthOrSize, (height || widthOrSize)] : widthOrSize;
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(topLeft), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(topLeft).add(size));
    }
    static fromCenter(center, widthOrSize, height) {
        let half = (typeof widthOrSize == "number") ? [widthOrSize / 2, (height || widthOrSize) / 2] : new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(widthOrSize).divide(2);
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(center).subtract(half), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(center).add(half));
    }
    static toCircle(pts, within = true) {
        return Circle.fromRect(pts, within);
    }
    static toSquare(pts, enclose = false) {
        let s = Rectangle.size(pts);
        let m = (enclose) ? s.maxValue().value : s.minValue().value;
        return Rectangle.fromCenter(Rectangle.center(pts), m, m);
    }
    static size(pts) {
        return pts[0].$max(pts[1]).subtract(pts[0].$min(pts[1]));
    }
    static center(pts) {
        let min = pts[0].$min(pts[1]);
        let max = pts[0].$max(pts[1]);
        return min.add(max.$subtract(min).divide(2));
    }
    static corners(rect) {
        let p0 = rect[0].$min(rect[1]);
        let p2 = rect[0].$max(rect[1]);
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(p0, new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(p2.x, p0.y), p2, new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(p0.x, p2.y));
    }
    static sides(rect) {
        let [p0, p1, p2, p3] = Rectangle.corners(rect);
        return [
            new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(p0, p1), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(p1, p2),
            new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(p2, p3), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(p3, p0)
        ];
    }
    static boundingBox(rects) {
        let merged = _Util__WEBPACK_IMPORTED_MODULE_0__.Util.flatten(rects, false);
        let min = _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt.make(2, Number.MAX_VALUE);
        let max = _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt.make(2, Number.MIN_VALUE);
        for (let i = 0, len = merged.length; i < len; i++) {
            for (let k = 0; k < 2; k++) {
                min[k] = Math.min(min[k], merged[i][k]);
                max[k] = Math.max(max[k], merged[i][k]);
            }
        }
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(min, max);
    }
    static polygon(rect) {
        return Rectangle.corners(rect);
    }
    static quadrants(rect, center) {
        let corners = Rectangle.corners(rect);
        let _center = (center != undefined) ? new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(center) : Rectangle.center(rect);
        return corners.map((c) => new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(c, _center).boundingBox());
    }
    static halves(rect, ratio = 0.5, asRows = false) {
        let min = rect[0].$min(rect[1]);
        let max = rect[0].$max(rect[1]);
        let mid = (asRows) ? _Num__WEBPACK_IMPORTED_MODULE_1__.Num.lerp(min[1], max[1], ratio) : _Num__WEBPACK_IMPORTED_MODULE_1__.Num.lerp(min[0], max[0], ratio);
        return (asRows)
            ? [new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(min, new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(max[0], mid)), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(min[0], mid), max)]
            : [new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(min, new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(mid, max[1])), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(mid, min[1]), max)];
    }
    static withinBound(rect, pt) {
        return _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.withinBound(pt, rect[0], rect[1]);
    }
    static hasIntersectRect2D(rect1, rect2, resetBoundingBox = false) {
        if (resetBoundingBox) {
            rect1 = _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.boundingBox(rect1);
            rect2 = _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.boundingBox(rect2);
        }
        if (rect1[0][0] > rect2[1][0] || rect2[0][0] > rect1[1][0])
            return false;
        if (rect1[0][1] > rect2[1][1] || rect2[0][1] > rect1[1][1])
            return false;
        return true;
    }
    static intersectRect2D(rect1, rect2) {
        if (!Rectangle.hasIntersectRect2D(rect1, rect2))
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        return Line.intersectLines2D(Rectangle.sides(rect1), Rectangle.sides(rect2));
    }
}
class Circle {
    static fromRect(pts, enclose = false) {
        let r = 0;
        let min = r = Rectangle.size(pts).minValue().value / 2;
        if (enclose) {
            let max = Rectangle.size(pts).maxValue().value / 2;
            r = Math.sqrt(min * min + max * max);
        }
        else {
            r = min;
        }
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(Rectangle.center(pts), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(r, r));
    }
    static fromTriangle(pts, enclose = false) {
        if (enclose) {
            return Triangle.circumcircle(pts);
        }
        else {
            return Triangle.incircle(pts);
        }
    }
    static fromCenter(pt, radius) {
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(pt), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(radius, radius));
    }
    static withinBound(pts, pt, threshold = 0) {
        let d = pts[0].$subtract(pt);
        return d.dot(d) + threshold < pts[1].x * pts[1].x;
    }
    static intersectRay2D(pts, ray) {
        let d = ray[0].$subtract(ray[1]);
        let f = pts[0].$subtract(ray[0]);
        let a = d.dot(d);
        let b = f.dot(d);
        let c = f.dot(f) - pts[1].x * pts[1].x;
        let p = b / a;
        let q = c / a;
        let disc = p * p - q;
        if (disc < 0) {
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        }
        else {
            let discSqrt = Math.sqrt(disc);
            let t1 = -p + discSqrt;
            let p1 = ray[0].$subtract(d.$multiply(t1));
            if (disc === 0)
                return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(p1);
            let t2 = -p - discSqrt;
            let p2 = ray[0].$subtract(d.$multiply(t2));
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(p1, p2);
        }
    }
    static intersectLine2D(pts, line) {
        let ps = Circle.intersectRay2D(pts, line);
        let g = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        if (ps.length > 0) {
            for (let i = 0, len = ps.length; i < len; i++) {
                if (Rectangle.withinBound(line, ps[i]))
                    g.push(ps[i]);
            }
        }
        return g;
    }
    static intersectCircle2D(pts, circle) {
        let dv = circle[0].$subtract(pts[0]);
        let dr2 = dv.magnitudeSq();
        let dr = Math.sqrt(dr2);
        let ar = pts[1].x;
        let br = circle[1].x;
        let ar2 = ar * ar;
        let br2 = br * br;
        if (dr > ar + br) {
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        }
        else if (dr < Math.abs(ar - br)) {
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(pts[0].clone());
        }
        else {
            let a = (ar2 - br2 + dr2) / (2 * dr);
            let h = Math.sqrt(ar2 - a * a);
            let p = dv.$multiply(a / dr).add(pts[0]);
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(p.x + h * dv.y / dr, p.y - h * dv.x / dr), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(p.x - h * dv.y / dr, p.y + h * dv.x / dr));
        }
    }
    static intersectRect2D(pts, rect) {
        let sides = Rectangle.sides(rect);
        let g = [];
        for (let i = 0, len = sides.length; i < len; i++) {
            let ps = Circle.intersectLine2D(pts, sides[i]);
            if (ps.length > 0)
                g.push(ps);
        }
        return _Util__WEBPACK_IMPORTED_MODULE_0__.Util.flatten(g);
    }
    static toRect(pts, within = false) {
        let r = pts[1][0];
        if (within) {
            let half = Math.sqrt(r * r) / 2;
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(pts[0].$subtract(half), pts[0].$add(half));
        }
        else {
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(pts[0].$subtract(r), pts[0].$add(r));
        }
    }
    static toTriangle(pts, within = true) {
        if (within) {
            let ang = -Math.PI / 2;
            let inc = Math.PI * 2 / 3;
            let g = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
            for (let i = 0; i < 3; i++) {
                g.push(pts[0].clone().toAngle(ang, pts[1][0], true));
                ang += inc;
            }
            return g;
        }
        else {
            return Triangle.fromCenter(pts[0], pts[1][0]);
        }
    }
}
class Triangle {
    static fromRect(rect) {
        let top = rect[0].$add(rect[1]).divide(2);
        top.y = rect[0][1];
        let left = rect[1].clone();
        left.x = rect[0][0];
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(top, rect[1].clone(), left);
    }
    static fromCircle(circle) {
        return Circle.toTriangle(circle, true);
    }
    static fromCenter(pt, size) {
        return Triangle.fromCircle(Circle.fromCenter(pt, size));
    }
    static medial(pts) {
        if (pts.length < 3)
            return _errorLength(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(), 3);
        return Polygon.midpoints(pts, true);
    }
    static oppositeSide(pts, index) {
        if (pts.length < 3)
            return _errorLength(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(), 3);
        if (index === 0) {
            return _Pt__WEBPACK_IMPORTED_MODULE_2__.Group.fromPtArray([pts[1], pts[2]]);
        }
        else if (index === 1) {
            return _Pt__WEBPACK_IMPORTED_MODULE_2__.Group.fromPtArray([pts[0], pts[2]]);
        }
        else {
            return _Pt__WEBPACK_IMPORTED_MODULE_2__.Group.fromPtArray([pts[0], pts[1]]);
        }
    }
    static altitude(pts, index) {
        let opp = Triangle.oppositeSide(pts, index);
        if (opp.length > 1) {
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(pts[index], Line.perpendicularFromPt(opp, pts[index]));
        }
        else {
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        }
    }
    static orthocenter(pts) {
        if (pts.length < 3)
            return _errorLength(undefined, 3);
        let a = Triangle.altitude(pts, 0);
        let b = Triangle.altitude(pts, 1);
        return Line.intersectRay2D(a, b);
    }
    static incenter(pts) {
        if (pts.length < 3)
            return _errorLength(undefined, 3);
        let a = Polygon.bisector(pts, 0).add(pts[0]);
        let b = Polygon.bisector(pts, 1).add(pts[1]);
        return Line.intersectRay2D(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(pts[0], a), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(pts[1], b));
    }
    static incircle(pts, center) {
        let c = (center) ? center : Triangle.incenter(pts);
        let area = Polygon.area(pts);
        let perim = Polygon.perimeter(pts, true);
        let r = 2 * area / perim.total;
        return Circle.fromCenter(c, r);
    }
    static circumcenter(pts) {
        let md = Triangle.medial(pts);
        let a = [md[0], _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.perpendicular(pts[0].$subtract(md[0])).p1.$add(md[0])];
        let b = [md[1], _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.perpendicular(pts[1].$subtract(md[1])).p1.$add(md[1])];
        return Line.intersectRay2D(a, b);
    }
    static circumcircle(pts, center) {
        let c = (center) ? center : Triangle.circumcenter(pts);
        let r = pts[0].$subtract(c).magnitude();
        return Circle.fromCenter(c, r);
    }
}
class Polygon {
    static centroid(pts) {
        return _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.centroid(pts);
    }
    static rectangle(center, widthOrSize, height) {
        return Rectangle.corners(Rectangle.fromCenter(center, widthOrSize, height));
    }
    static fromCenter(center, radius, sides) {
        let g = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        for (let i = 0; i < sides; i++) {
            let ang = Math.PI * 2 * i / sides;
            g.push(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(Math.cos(ang) * radius, Math.sin(ang) * radius).add(center));
        }
        return g;
    }
    static lineAt(pts, idx) {
        if (idx < 0 || idx >= pts.length)
            throw new Error("index out of the Polygon's range");
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(pts[idx], (idx === pts.length - 1) ? pts[0] : pts[idx + 1]);
    }
    static lines(pts, closePath = true) {
        if (pts.length < 2)
            return _errorLength(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(), 2);
        let sp = _Util__WEBPACK_IMPORTED_MODULE_0__.Util.split(pts, 2, 1);
        if (closePath)
            sp.push(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(pts[pts.length - 1], pts[0]));
        return sp.map((g) => g);
    }
    static midpoints(pts, closePath = false, t = 0.5) {
        if (pts.length < 2)
            return _errorLength(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(), 2);
        let sides = Polygon.lines(pts, closePath);
        let mids = sides.map((s) => _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.interpolate(s[0], s[1], t));
        return mids;
    }
    static adjacentSides(pts, index, closePath = false) {
        if (pts.length < 2)
            return _errorLength(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(), 2);
        if (index < 0 || index >= pts.length)
            return _errorOutofBound(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(), index);
        let gs = [];
        let left = index - 1;
        if (closePath && left < 0)
            left = pts.length - 1;
        if (left >= 0)
            gs.push(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(pts[index], pts[left]));
        let right = index + 1;
        if (closePath && right > pts.length - 1)
            right = 0;
        if (right <= pts.length - 1)
            gs.push(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(pts[index], pts[right]));
        return gs;
    }
    static bisector(pts, index) {
        let sides = Polygon.adjacentSides(pts, index, true);
        if (sides.length >= 2) {
            let a = sides[0][1].$subtract(sides[0][0]).unit();
            let b = sides[1][1].$subtract(sides[1][0]).unit();
            return a.add(b).divide(2);
        }
        else {
            return undefined;
        }
    }
    static perimeter(pts, closePath = false) {
        if (pts.length < 2)
            return _errorLength(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(), 2);
        let lines = Polygon.lines(pts, closePath);
        let mag = 0;
        let p = _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt.make(lines.length, 0);
        for (let i = 0, len = lines.length; i < len; i++) {
            let m = Line.magnitude(lines[i]);
            mag += m;
            p[i] = m;
        }
        return {
            total: mag,
            segments: p
        };
    }
    static area(pts) {
        if (pts.length < 3)
            return _errorLength(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(), 3);
        let det = (a, b) => a[0] * b[1] - a[1] * b[0];
        let area = 0;
        for (let i = 0, len = pts.length; i < len; i++) {
            if (i < pts.length - 1) {
                area += det(pts[i], pts[i + 1]);
            }
            else {
                area += det(pts[i], pts[0]);
            }
        }
        return Math.abs(area / 2);
    }
    static convexHull(pts, sorted = false) {
        if (pts.length < 3)
            return _errorLength(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(), 3);
        if (!sorted) {
            pts = pts.slice();
            pts.sort((a, b) => a[0] - b[0]);
        }
        let left = (a, b, c) => {
            return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]) > 0;
        };
        let dq = [];
        let bot = pts.length - 2;
        let top = bot + 3;
        dq[bot] = pts[2];
        dq[top] = pts[2];
        if (left(pts[0], pts[1], pts[2])) {
            dq[bot + 1] = pts[0];
            dq[bot + 2] = pts[1];
        }
        else {
            dq[bot + 1] = pts[1];
            dq[bot + 2] = pts[0];
        }
        for (let i = 3, len = pts.length; i < len; i++) {
            let pt = pts[i];
            if (left(dq[bot], dq[bot + 1], pt) && left(dq[top - 1], dq[top], pt)) {
                continue;
            }
            while (!left(dq[bot], dq[bot + 1], pt)) {
                bot += 1;
            }
            bot -= 1;
            dq[bot] = pt;
            while (!left(dq[top - 1], dq[top], pt)) {
                top -= 1;
            }
            top += 1;
            dq[top] = pt;
        }
        let hull = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        for (let h = 0; h < (top - bot); h++) {
            hull.push(dq[bot + h]);
        }
        return hull;
    }
    static network(pts, originIndex = 0) {
        let g = [];
        for (let i = 0, len = pts.length; i < len; i++) {
            if (i != originIndex)
                g.push(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(pts[originIndex], pts[i]));
        }
        return g;
    }
    static nearestPt(pts, pt) {
        let _near = Number.MAX_VALUE;
        let _item = -1;
        for (let i = 0, len = pts.length; i < len; i++) {
            let d = pts[i].$subtract(pt).magnitudeSq();
            if (d < _near) {
                _near = d;
                _item = i;
            }
        }
        return _item;
    }
    static projectAxis(poly, unitAxis) {
        let dot = unitAxis.dot(poly[0]);
        let d = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(dot, dot);
        for (let n = 1, len = poly.length; n < len; n++) {
            dot = unitAxis.dot(poly[n]);
            d = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(Math.min(dot, d[0]), Math.max(dot, d[1]));
        }
        return d;
    }
    static _axisOverlap(poly1, poly2, unitAxis) {
        let pa = Polygon.projectAxis(poly1, unitAxis);
        let pb = Polygon.projectAxis(poly2, unitAxis);
        return (pa[0] < pb[0]) ? pb[0] - pa[1] : pa[0] - pb[1];
    }
    static hasIntersectPoint(poly, pt) {
        let c = false;
        for (let i = 0, len = poly.length; i < len; i++) {
            let ln = Polygon.lineAt(poly, i);
            if (((ln[0][1] > pt[1]) != (ln[1][1] > pt[1])) &&
                (pt[0] < (ln[1][0] - ln[0][0]) * (pt[1] - ln[0][1]) / (ln[1][1] - ln[0][1]) + ln[0][0])) {
                c = !c;
            }
        }
        return c;
    }
    static hasIntersectCircle(poly, circle) {
        let info = {
            which: -1,
            dist: 0,
            normal: null,
            edge: null,
            vertex: null,
        };
        let c = circle[0];
        let r = circle[1][0];
        let minDist = Number.MAX_SAFE_INTEGER;
        for (let i = 0, len = poly.length; i < len; i++) {
            let edge = Polygon.lineAt(poly, i);
            let axis = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(edge[0].y - edge[1].y, edge[1].x - edge[0].x).unit();
            let poly2 = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(c.$add(axis.$multiply(r)), c.$subtract(axis.$multiply(r)));
            let dist = Polygon._axisOverlap(poly, poly2, axis);
            if (dist > 0) {
                return null;
            }
            else if (Math.abs(dist) < minDist) {
                let check = Rectangle.withinBound(edge, Line.perpendicularFromPt(edge, c)) || Circle.intersectLine2D(circle, edge).length > 0;
                if (check) {
                    info.edge = edge;
                    info.normal = axis;
                    minDist = Math.abs(dist);
                    info.which = i;
                }
            }
        }
        if (!info.edge)
            return null;
        let dir = c.$subtract(Polygon.centroid(poly)).dot(info.normal);
        if (dir < 0)
            info.normal.multiply(-1);
        info.dist = minDist;
        info.vertex = c;
        return info;
    }
    static hasIntersectPolygon(poly1, poly2) {
        let info = {
            which: -1,
            dist: 0,
            normal: new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(),
            edge: new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(),
            vertex: new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt()
        };
        let minDist = Number.MAX_SAFE_INTEGER;
        for (let i = 0, plen = (poly1.length + poly2.length); i < plen; i++) {
            let edge = (i < poly1.length) ? Polygon.lineAt(poly1, i) : Polygon.lineAt(poly2, i - poly1.length);
            let axis = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(edge[0].y - edge[1].y, edge[1].x - edge[0].x).unit();
            let dist = Polygon._axisOverlap(poly1, poly2, axis);
            if (dist > 0) {
                return null;
            }
            else if (Math.abs(dist) < minDist) {
                info.edge = edge;
                info.normal = axis;
                minDist = Math.abs(dist);
                info.which = (i < poly1.length) ? 0 : 1;
            }
        }
        info.dist = minDist;
        let b1 = (info.which === 0) ? poly2 : poly1;
        let b2 = (info.which === 0) ? poly1 : poly2;
        let c1 = Polygon.centroid(b1);
        let c2 = Polygon.centroid(b2);
        let dir = c1.$subtract(c2).dot(info.normal);
        if (dir < 0)
            info.normal.multiply(-1);
        let smallest = Number.MAX_SAFE_INTEGER;
        for (let i = 0, len = b1.length; i < len; i++) {
            let d = info.normal.dot(b1[i].$subtract(c2));
            if (d < smallest) {
                smallest = d;
                info.vertex = b1[i];
            }
        }
        return info;
    }
    static intersectPolygon2D(poly1, poly2) {
        let lp = Polygon.lines(poly1);
        let g = [];
        for (let i = 0, len = lp.length; i < len; i++) {
            let ins = Line.intersectPolygon2D(lp[i], poly2, false);
            if (ins)
                g.push(ins);
        }
        return _Util__WEBPACK_IMPORTED_MODULE_0__.Util.flatten(g, true);
    }
    static toRects(polys) {
        let boxes = polys.map((g) => _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.boundingBox(g));
        let merged = _Util__WEBPACK_IMPORTED_MODULE_0__.Util.flatten(boxes, false);
        boxes.unshift(_Num__WEBPACK_IMPORTED_MODULE_1__.Geom.boundingBox(merged));
        return boxes;
    }
}
class Curve {
    static getSteps(steps) {
        let ts = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        for (let i = 0; i <= steps; i++) {
            let t = i / steps;
            ts.push(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(t * t * t, t * t, t, 1));
        }
        return ts;
    }
    static controlPoints(pts, index = 0, copyStart = false) {
        if (index > pts.length - 1)
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        let _index = (i) => (i < pts.length - 1) ? i : pts.length - 1;
        let p0 = pts[index];
        index = (copyStart) ? index : index + 1;
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(p0, pts[_index(index++)], pts[_index(index++)], pts[_index(index++)]);
    }
    static _calcPt(ctrls, params) {
        let x = ctrls.reduce((a, c, i) => a + c.x * params[i], 0);
        let y = ctrls.reduce((a, c, i) => a + c.y * params[i], 0);
        if (ctrls[0].length > 2) {
            let z = ctrls.reduce((a, c, i) => a + c.z * params[i], 0);
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(x, y, z);
        }
        return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(x, y);
    }
    static catmullRom(pts, steps = 10) {
        if (pts.length < 2)
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        let ps = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        let ts = Curve.getSteps(steps);
        let c = Curve.controlPoints(pts, 0, true);
        for (let i = 0; i <= steps; i++) {
            ps.push(Curve.catmullRomStep(ts[i], c));
        }
        let k = 0;
        while (k < pts.length - 2) {
            let cp = Curve.controlPoints(pts, k);
            if (cp.length > 0) {
                for (let i = 0; i <= steps; i++) {
                    ps.push(Curve.catmullRomStep(ts[i], cp));
                }
                k++;
            }
        }
        return ps;
    }
    static catmullRomStep(step, ctrls) {
        let m = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(-0.5, 1, -0.5, 0), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(1.5, -2.5, 0, 1), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(-1.5, 2, 0.5, 0), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(0.5, -0.5, 0, 0));
        return Curve._calcPt(ctrls, _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.multiply([step], m, true)[0]);
    }
    static cardinal(pts, steps = 10, tension = 0.5) {
        if (pts.length < 2)
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        let ps = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        let ts = Curve.getSteps(steps);
        let c = Curve.controlPoints(pts, 0, true);
        for (let i = 0; i <= steps; i++) {
            ps.push(Curve.cardinalStep(ts[i], c, tension));
        }
        let k = 0;
        while (k < pts.length - 2) {
            let cp = Curve.controlPoints(pts, k);
            if (cp.length > 0) {
                for (let i = 0; i <= steps; i++) {
                    ps.push(Curve.cardinalStep(ts[i], cp, tension));
                }
                k++;
            }
        }
        return ps;
    }
    static cardinalStep(step, ctrls, tension = 0.5) {
        let m = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(-1, 2, -1, 0), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(-1, 1, 0, 0), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(1, -2, 1, 0), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(1, -1, 0, 0));
        let h = _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.multiply([step], m, true)[0].multiply(tension);
        let h2 = (2 * step[0] - 3 * step[1] + 1);
        let h3 = -2 * step[0] + 3 * step[1];
        let pt = Curve._calcPt(ctrls, h);
        pt.x += h2 * ctrls[1].x + h3 * ctrls[2].x;
        pt.y += h2 * ctrls[1].y + h3 * ctrls[2].y;
        if (pt.length > 2)
            pt.z += h2 * ctrls[1].z + h3 * ctrls[2].z;
        return pt;
    }
    static bezier(pts, steps = 10) {
        if (pts.length < 4)
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        let ps = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        let ts = Curve.getSteps(steps);
        let k = 0;
        while (k < pts.length - 3) {
            let c = Curve.controlPoints(pts, k);
            if (c.length > 0) {
                for (let i = 0; i <= steps; i++) {
                    ps.push(Curve.bezierStep(ts[i], c));
                }
                k += 3;
            }
        }
        return ps;
    }
    static bezierStep(step, ctrls) {
        let m = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(-1, 3, -3, 1), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(3, -6, 3, 0), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(-3, 3, 0, 0), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(1, 0, 0, 0));
        return Curve._calcPt(ctrls, _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.multiply([step], m, true)[0]);
    }
    static bspline(pts, steps = 10, tension = 1) {
        if (pts.length < 2)
            return new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        let ps = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group();
        let ts = Curve.getSteps(steps);
        let k = 0;
        while (k < pts.length - 3) {
            let c = Curve.controlPoints(pts, k);
            if (c.length > 0) {
                if (tension !== 1) {
                    for (let i = 0; i <= steps; i++) {
                        ps.push(Curve.bsplineTensionStep(ts[i], c, tension));
                    }
                }
                else {
                    for (let i = 0; i <= steps; i++) {
                        ps.push(Curve.bsplineStep(ts[i], c));
                    }
                }
                k++;
            }
        }
        return ps;
    }
    static bsplineStep(step, ctrls) {
        let m = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(-0.16666666666666666, 0.5, -0.5, 0.16666666666666666), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(0.5, -1, 0, 0.6666666666666666), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(-0.5, 0.5, 0.5, 0.16666666666666666), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(0.16666666666666666, 0, 0, 0));
        return Curve._calcPt(ctrls, _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.multiply([step], m, true)[0]);
    }
    static bsplineTensionStep(step, ctrls, tension = 1) {
        let m = new _Pt__WEBPACK_IMPORTED_MODULE_2__.Group(new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(-0.16666666666666666, 0.5, -0.5, 0.16666666666666666), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(-1.5, 2, 0, -0.3333333333333333), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(1.5, -2.5, 0.5, 0.16666666666666666), new _Pt__WEBPACK_IMPORTED_MODULE_2__.Pt(0.16666666666666666, 0, 0, 0));
        let h = _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat.multiply([step], m, true)[0].multiply(tension);
        let h2 = (2 * step[0] - 3 * step[1] + 1);
        let h3 = -2 * step[0] + 3 * step[1];
        let pt = Curve._calcPt(ctrls, h);
        pt.x += h2 * ctrls[1].x + h3 * ctrls[2].x;
        pt.y += h2 * ctrls[1].y + h3 * ctrls[2].y;
        if (pt.length > 2)
            pt.z += h2 * ctrls[1].z + h3 * ctrls[2].z;
        return pt;
    }
}
//# sourceMappingURL=Op.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Physics.js":
/*!*************************************************!*\
  !*** ./node_modules/pts/dist/es2015/Physics.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "World": () => (/* binding */ World),
/* harmony export */   "Particle": () => (/* binding */ Particle),
/* harmony export */   "Body": () => (/* binding */ Body)
/* harmony export */ });
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/* harmony import */ var _Op__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Op */ "./node_modules/pts/dist/es2015/Op.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */


class World {
    constructor(bound, friction = 1, gravity = 0) {
        this._lastTime = null;
        this._gravity = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt();
        this._friction = 1;
        this._damping = 0.75;
        this._particles = [];
        this._bodies = [];
        this._pnames = [];
        this._bnames = [];
        this._bound = _Pt__WEBPACK_IMPORTED_MODULE_0__.Bound.fromGroup(bound);
        this._friction = friction;
        this._gravity = (typeof gravity === "number") ? new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(0, gravity) : new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(gravity);
        return this;
    }
    get bound() { return this._bound; }
    set bound(bound) { this._bound = bound; }
    get gravity() { return this._gravity; }
    set gravity(g) { this._gravity = g; }
    get friction() { return this._friction; }
    set friction(f) { this._friction = f; }
    get damping() { return this._damping; }
    set damping(f) { this._damping = f; }
    get bodyCount() { return this._bodies.length; }
    get particleCount() { return this._particles.length; }
    body(id) {
        let idx = id;
        if (typeof id === "string" && id.length > 0) {
            idx = this._bnames.indexOf(id);
        }
        if (!(idx >= 0))
            return undefined;
        return this._bodies[idx];
    }
    particle(id) {
        let idx = id;
        if (typeof id === "string" && id.length > 0) {
            idx = this._pnames.indexOf(id);
        }
        if (!(idx >= 0))
            return undefined;
        return this._particles[idx];
    }
    bodyIndex(name) {
        return this._bnames.indexOf(name);
    }
    particleIndex(name) {
        return this._pnames.indexOf(name);
    }
    update(ms) {
        let dt = ms / 1000;
        this._updateParticles(dt);
        this._updateBodies(dt);
    }
    drawParticles(fn) {
        this._drawParticles = fn;
    }
    drawBodies(fn) {
        this._drawBodies = fn;
    }
    add(p, name = '') {
        if (p instanceof Body) {
            this._bodies.push(p);
            this._bnames.push(name);
        }
        else {
            this._particles.push(p);
            this._pnames.push(name);
        }
        return this;
    }
    _index(fn, id) {
        let index = 0;
        if (typeof id === "string") {
            index = fn(id);
            if (index < 0)
                throw new Error(`Cannot find index of ${id}. You can use particleIndex() or bodyIndex() function to check existence by name.`);
        }
        else {
            index = id;
        }
        return index;
    }
    removeBody(from, count = 1) {
        const index = this._index(this.bodyIndex.bind(this), from);
        const param = (index < 0) ? [index * -1 - 1, count] : [index, count];
        this._bodies.splice(param[0], param[1]);
        this._bnames.splice(param[0], param[1]);
        return this;
    }
    removeParticle(from, count = 1) {
        const index = this._index(this.particleIndex.bind(this), from);
        const param = (index < 0) ? [index * -1 - 1, count] : [index, count];
        this._particles.splice(param[0], param[1]);
        this._pnames.splice(param[0], param[1]);
        return this;
    }
    static edgeConstraint(p1, p2, dist, stiff = 1, precise = false) {
        const m1 = 1 / (p1.mass || 1);
        const m2 = 1 / (p2.mass || 1);
        const mm = m1 + m2;
        let delta = p2.$subtract(p1);
        let distSq = dist * dist;
        let d = (precise) ? (dist / delta.magnitude() - 1) : (distSq / (delta.dot(delta) + distSq) - 0.5);
        let f = delta.$multiply(d * stiff);
        p1.subtract(f.$multiply(m1 / mm));
        p2.add(f.$multiply(m2 / mm));
        return p1;
    }
    static boundConstraint(p, rect, damping = 0.75) {
        let bound = rect.boundingBox();
        let np = p.$min(bound[1].subtract(p.radius)).$max(bound[0].add(p.radius));
        if (np[0] === bound[0][0] || np[0] === bound[1][0]) {
            let c = p.changed.$multiply(damping);
            p.previous = np.$subtract(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(-c[0], c[1]));
        }
        else if (np[1] === bound[0][1] || np[1] === bound[1][1]) {
            let c = p.changed.$multiply(damping);
            p.previous = np.$subtract(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(c[0], -c[1]));
        }
        p.to(np);
    }
    integrate(p, dt, prevDt) {
        p.addForce(this._gravity);
        p.verlet(dt, this._friction, prevDt);
        return p;
    }
    _updateParticles(dt) {
        for (let i = 0, len = this._particles.length; i < len; i++) {
            let p = this._particles[i];
            this.integrate(p, dt, this._lastTime);
            World.boundConstraint(p, this._bound, this._damping);
            for (let k = i + 1; k < len; k++) {
                if (i !== k) {
                    let p2 = this._particles[k];
                    p.collide(p2, this._damping);
                }
            }
            if (this._drawParticles)
                this._drawParticles(p, i);
        }
        this._lastTime = dt;
    }
    _updateBodies(dt) {
        for (let i = 0, len = this._bodies.length; i < len; i++) {
            let bds = this._bodies[i];
            if (bds) {
                for (let k = 0, klen = bds.length; k < klen; k++) {
                    let bk = bds[k];
                    World.boundConstraint(bk, this._bound, this._damping);
                    this.integrate(bk, dt, this._lastTime);
                }
                for (let k = i + 1; k < len; k++) {
                    bds.processBody(this._bodies[k]);
                }
                for (let m = 0, mlen = this._particles.length; m < mlen; m++) {
                    bds.processParticle(this._particles[m]);
                }
                bds.processEdges();
                if (this._drawBodies)
                    this._drawBodies(bds, i);
            }
        }
    }
}
class Particle extends _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt {
    constructor(...args) {
        super(...args);
        this._mass = 1;
        this._radius = 0;
        this._force = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt();
        this._prev = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt();
        this._lock = false;
        this._prev = this.clone();
    }
    get mass() { return this._mass; }
    set mass(m) { this._mass = m; }
    get radius() { return this._radius; }
    set radius(f) { this._radius = f; }
    get previous() { return this._prev; }
    set previous(p) { this._prev = p; }
    get force() { return this._force; }
    set force(g) { this._force = g; }
    get body() { return this._body; }
    set body(b) { this._body = b; }
    get lock() { return this._lock; }
    set lock(b) {
        this._lock = b;
        this._lockPt = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(this);
    }
    get changed() { return this.$subtract(this._prev); }
    set position(p) {
        this.previous.to(this);
        if (this._lock)
            this._lockPt = p;
        this.to(p);
    }
    size(r) {
        this._mass = r;
        this._radius = r;
        return this;
    }
    addForce(...args) {
        this._force.add(...args);
        return this._force;
    }
    verlet(dt, friction, lastDt) {
        if (this._lock) {
            this.to(this._lockPt);
        }
        else {
            let lt = (lastDt) ? lastDt : dt;
            let a = this._force.multiply(dt * (dt + lt) / 2);
            let v = this.changed.multiply(friction * dt / lt).add(a);
            this._prev = this.clone();
            this.add(v);
            this._force = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt();
        }
        return this;
    }
    hit(...args) {
        this._prev.subtract(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(...args).$divide(Math.sqrt(this._mass)));
        return this;
    }
    collide(p2, damp = 1) {
        let p1 = this;
        let dp = p1.$subtract(p2);
        let distSq = dp.magnitudeSq();
        let dr = p1.radius + p2.radius;
        if (distSq < dr * dr) {
            let c1 = p1.changed;
            let c2 = p2.changed;
            let dist = Math.sqrt(distSq);
            let d = dp.$multiply(((dist - dr) / dist) / 2);
            let np1 = p1.$subtract(d);
            let np2 = p2.$add(d);
            p1.to(np1);
            p2.to(np2);
            let f1 = damp * dp.dot(c1) / distSq;
            let f2 = damp * dp.dot(c2) / distSq;
            let dm1 = p1.mass / (p1.mass + p2.mass);
            let dm2 = p2.mass / (p1.mass + p2.mass);
            c1.add(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(f2 * dp[0] - f1 * dp[0], f2 * dp[1] - f1 * dp[1]).$multiply(dm2));
            c2.add(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(f1 * dp[0] - f2 * dp[0], f1 * dp[1] - f2 * dp[1]).$multiply(dm1));
            p1.previous = p1.$subtract(c1);
            p2.previous = p2.$subtract(c2);
        }
    }
    toString() {
        return `Particle: ${this[0]} ${this[1]} | previous ${this._prev[0]} ${this._prev[1]} | mass ${this._mass}`;
    }
}
class Body extends _Pt__WEBPACK_IMPORTED_MODULE_0__.Group {
    constructor() {
        super();
        this._cs = [];
        this._stiff = 1;
        this._locks = {};
        this._mass = 1;
    }
    static fromGroup(list, stiff = 1, autoLink = true, autoMass = true) {
        let b = new Body().init(list);
        if (autoLink)
            b.linkAll(stiff);
        if (autoMass)
            b.autoMass();
        return b;
    }
    init(list, stiff = 1) {
        let c = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt();
        for (let i = 0, len = list.length; i < len; i++) {
            let p = new Particle(list[i]);
            p.body = this;
            c.add(list[i]);
            this.push(p);
        }
        this._stiff = stiff;
        return this;
    }
    get mass() { return this._mass; }
    set mass(m) {
        this._mass = m;
        for (let i = 0, len = this.length; i < len; i++) {
            this[i].mass = this._mass;
        }
    }
    autoMass() {
        this.mass = Math.sqrt(_Op__WEBPACK_IMPORTED_MODULE_1__.Polygon.area(this)) / 10;
        return this;
    }
    link(index1, index2, stiff) {
        if (index1 < 0 || index1 >= this.length)
            throw new Error("index1 is not in the Group's indices");
        if (index2 < 0 || index2 >= this.length)
            throw new Error("index1 is not in the Group's indices");
        let d = this[index1].$subtract(this[index2]).magnitude();
        this._cs.push([index1, index2, d, stiff || this._stiff]);
        return this;
    }
    linkAll(stiff) {
        let half = this.length / 2;
        for (let i = 0, len = this.length; i < len; i++) {
            let n = (i >= len - 1) ? 0 : i + 1;
            this.link(i, n, stiff);
            if (len > 4) {
                let nd = (Math.floor(half / 2)) + 1;
                let n2 = (i >= len - nd) ? i % len : i + nd;
                this.link(i, n2, stiff);
            }
            if (i <= half - 1) {
                this.link(i, Math.min(this.length - 1, i + Math.floor(half)));
            }
        }
    }
    linksToLines() {
        let gs = [];
        for (let i = 0, len = this._cs.length; i < len; i++) {
            let ln = this._cs[i];
            gs.push(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group(this[ln[0]], this[ln[1]]));
        }
        return gs;
    }
    processEdges() {
        for (let i = 0, len = this._cs.length; i < len; i++) {
            let [m, n, d, s] = this._cs[i];
            World.edgeConstraint(this[m], this[n], d, s);
        }
    }
    processBody(b) {
        let b1 = this;
        let b2 = b;
        let hit = _Op__WEBPACK_IMPORTED_MODULE_1__.Polygon.hasIntersectPolygon(b1, b2);
        if (hit) {
            let cv = hit.normal.$multiply(hit.dist);
            let t;
            let eg = hit.edge;
            if (Math.abs(eg[0][0] - eg[1][0]) > Math.abs(eg[0][1] - eg[1][1])) {
                t = (hit.vertex[0] - cv[0] - eg[0][0]) / (eg[1][0] - eg[0][0]);
            }
            else {
                t = (hit.vertex[1] - cv[1] - eg[0][1]) / (eg[1][1] - eg[0][1]);
            }
            let lambda = 1 / (t * t + (1 - t) * (1 - t));
            let m0 = hit.vertex.body.mass || 1;
            let m1 = hit.edge[0].body.mass || 1;
            let mr0 = m0 / (m0 + m1);
            let mr1 = m1 / (m0 + m1);
            eg[0].subtract(cv.$multiply(mr0 * (1 - t) * lambda / 2));
            eg[1].subtract(cv.$multiply(mr0 * t * lambda / 2));
            hit.vertex.add(cv.$multiply(mr1));
        }
    }
    processParticle(b) {
        let b1 = this;
        let b2 = b;
        let hit = _Op__WEBPACK_IMPORTED_MODULE_1__.Polygon.hasIntersectCircle(b1, _Op__WEBPACK_IMPORTED_MODULE_1__.Circle.fromCenter(b, b.radius));
        if (hit) {
            let cv = hit.normal.$multiply(hit.dist);
            let t;
            let eg = hit.edge;
            if (Math.abs(eg[0][0] - eg[1][0]) > Math.abs(eg[0][1] - eg[1][1])) {
                t = (hit.vertex[0] - cv[0] - eg[0][0]) / (eg[1][0] - eg[0][0]);
            }
            else {
                t = (hit.vertex[1] - cv[1] - eg[0][1]) / (eg[1][1] - eg[0][1]);
            }
            let lambda = 1 / (t * t + (1 - t) * (1 - t));
            let m0 = hit.vertex.mass || b2.mass || 1;
            let m1 = hit.edge[0].body.mass || 1;
            let mr0 = m0 / (m0 + m1);
            let mr1 = m1 / (m0 + m1);
            eg[0].subtract(cv.$multiply(mr0 * (1 - t) * lambda / 2));
            eg[1].subtract(cv.$multiply(mr0 * t * lambda / 2));
            let c1 = b.changed.add(cv.$multiply(mr1));
            b.previous = b.$subtract(c1);
        }
    }
}
//# sourceMappingURL=Physics.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Play.js":
/*!**********************************************!*\
  !*** ./node_modules/pts/dist/es2015/Play.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tempo": () => (/* binding */ Tempo),
/* harmony export */   "Sound": () => (/* binding */ Sound)
/* harmony export */ });
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/* harmony import */ var _Num__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Num */ "./node_modules/pts/dist/es2015/Num.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class Tempo {
    constructor(bpm) {
        this._listeners = {};
        this._listenerInc = 0;
        this.bpm = bpm;
    }
    static fromBeat(ms) {
        return new Tempo(60000 / ms);
    }
    get bpm() { return this._bpm; }
    set bpm(n) {
        this._bpm = n;
        this._ms = 60000 / this._bpm;
    }
    get ms() { return this._ms; }
    set ms(n) {
        this._bpm = Math.floor(60000 / n);
        this._ms = 60000 / this._bpm;
    }
    _createID(listener) {
        let id = '';
        if (typeof listener === 'function') {
            id = '_b' + (this._listenerInc++);
        }
        else {
            id = listener.name || '_b' + (this._listenerInc++);
        }
        return id;
    }
    every(beats) {
        let self = this;
        let p = Array.isArray(beats) ? beats[0] : beats;
        return {
            start: function (fn, offset = 0, name) {
                let id = name || self._createID(fn);
                self._listeners[id] = { name: id, beats: beats, period: p, index: 0, offset: offset, duration: -1, continuous: false, fn: fn };
                return this;
            },
            progress: function (fn, offset = 0, name) {
                let id = name || self._createID(fn);
                self._listeners[id] = { name: id, beats: beats, period: p, index: 0, offset: offset, duration: -1, continuous: true, fn: fn };
                return this;
            }
        };
    }
    track(time) {
        for (let k in this._listeners) {
            if (this._listeners.hasOwnProperty(k)) {
                let li = this._listeners[k];
                let _t = (li.offset) ? time + li.offset : time;
                let ms = li.period * this._ms;
                let isStart = false;
                if (_t > li.duration + ms) {
                    li.duration = _t - (_t % this._ms);
                    if (Array.isArray(li.beats)) {
                        li.index = (li.index + 1) % li.beats.length;
                        li.period = li.beats[li.index];
                    }
                    isStart = true;
                }
                let count = Math.max(0, Math.ceil(Math.floor(li.duration / this._ms) / li.period));
                let params = (li.continuous) ? [count, _Num__WEBPACK_IMPORTED_MODULE_1__.Num.clamp((_t - li.duration) / ms, 0, 1), _t, isStart] : [count];
                if (li.continuous || isStart) {
                    let done = li.fn.apply(li, params);
                    if (done)
                        delete this._listeners[li.name];
                }
            }
        }
    }
    stop(name) {
        if (this._listeners[name])
            delete this._listeners[name];
    }
    animate(time, ftime) {
        this.track(time);
    }
    resize(bound, evt) {
        return;
    }
    action(type, px, py, evt) {
        return;
    }
}
class Sound {
    constructor(type) {
        this._playing = false;
        this._type = type;
        let _ctx = window.AudioContext || window.webkitAudioContext || false;
        if (!_ctx)
            throw (new Error("Your browser doesn't support Web Audio. (No AudioContext)"));
        this._ctx = (_ctx) ? new _ctx() : undefined;
    }
    static from(node, ctx, type = "gen", stream) {
        let s = new Sound(type);
        s._node = node;
        s._ctx = ctx;
        if (stream)
            s._stream = stream;
        return s;
    }
    static load(source, crossOrigin = "anonymous") {
        return new Promise((resolve, reject) => {
            let s = new Sound("file");
            s._source = (typeof source === 'string') ? new Audio(source) : source;
            s._source.autoplay = false;
            s._source.crossOrigin = crossOrigin;
            s._source.addEventListener("ended", function () { s._playing = false; });
            s._source.addEventListener('error', function () { reject("Error loading sound"); });
            s._source.addEventListener('canplaythrough', function () {
                s._node = s._ctx.createMediaElementSource(s._source);
                resolve(s);
            });
        });
    }
    static loadAsBuffer(url) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            let s = new Sound("file");
            request.onload = function () {
                s._ctx.decodeAudioData(request.response, function (buffer) {
                    s.createBuffer(buffer);
                    resolve(s);
                }, (err) => reject("Error decoding audio"));
            };
            request.send();
        });
    }
    createBuffer(buf) {
        this._node = this._ctx.createBufferSource();
        if (buf !== undefined)
            this._buffer = buf;
        this._node.buffer = this._buffer;
        this._node.onended = () => { this._playing = false; };
        return this;
    }
    static generate(type, val) {
        let s = new Sound("gen");
        return s._gen(type, val);
    }
    _gen(type, val) {
        this._node = this._ctx.createOscillator();
        let osc = this._node;
        osc.type = type;
        if (type === 'custom') {
            osc.setPeriodicWave(val);
        }
        else {
            osc.frequency.value = val;
        }
        return this;
    }
    static input(constraint) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let s = new Sound("input");
                if (!s)
                    return undefined;
                const c = constraint ? constraint : { audio: true, video: false };
                s._stream = yield navigator.mediaDevices.getUserMedia(c);
                s._node = s._ctx.createMediaStreamSource(s._stream);
                return s;
            }
            catch (e) {
                console.error("Cannot get audio from input device.");
                return Promise.resolve(null);
            }
        });
    }
    get ctx() { return this._ctx; }
    get node() { return this._node; }
    get stream() { return this._stream; }
    get source() { return this._source; }
    get buffer() { return this._buffer; }
    set buffer(b) { this._buffer = b; }
    get type() { return this._type; }
    get playing() { return this._playing; }
    get progress() {
        let dur = 0;
        let curr = 0;
        if (!!this._buffer) {
            dur = this._buffer.duration;
            curr = (this._timestamp) ? this._ctx.currentTime - this._timestamp : 0;
        }
        else {
            dur = this._source.duration;
            curr = this._source.currentTime;
        }
        return curr / dur;
    }
    get playable() {
        return (this._type === "input") ? this._node !== undefined : (!!this._buffer || this._source.readyState === 4);
    }
    get binSize() {
        return this.analyzer.size;
    }
    get sampleRate() {
        return this._ctx.sampleRate;
    }
    get frequency() {
        return (this._type === "gen") ? this._node.frequency.value : 0;
    }
    set frequency(f) {
        if (this._type === "gen")
            this._node.frequency.value = f;
    }
    connect(node) {
        this._node.connect(node);
        return this;
    }
    analyze(size = 256, minDb = -100, maxDb = -30, smooth = 0.8) {
        let a = this._ctx.createAnalyser();
        a.fftSize = size * 2;
        a.minDecibels = minDb;
        a.maxDecibels = maxDb;
        a.smoothingTimeConstant = smooth;
        this.analyzer = {
            node: a,
            size: a.frequencyBinCount,
            data: new Uint8Array(a.frequencyBinCount)
        };
        this._node.connect(this.analyzer.node);
        return this;
    }
    _domain(time) {
        if (this.analyzer) {
            if (time) {
                this.analyzer.node.getByteTimeDomainData(this.analyzer.data);
            }
            else {
                this.analyzer.node.getByteFrequencyData(this.analyzer.data);
            }
            return this.analyzer.data;
        }
        return new Uint8Array(0);
    }
    _domainTo(time, size, position = [0, 0], trim = [0, 0]) {
        let data = (time) ? this.timeDomain() : this.freqDomain();
        let g = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group();
        for (let i = trim[0], len = data.length - trim[1]; i < len; i++) {
            g.push(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(position[0] + size[0] * i / len, position[1] + size[1] * data[i] / 255));
        }
        return g;
    }
    timeDomain() {
        return this._domain(true);
    }
    timeDomainTo(size, position = [0, 0], trim = [0, 0]) {
        return this._domainTo(true, size, position, trim);
    }
    freqDomain() {
        return this._domain(false);
    }
    freqDomainTo(size, position = [0, 0], trim = [0, 0]) {
        return this._domainTo(false, size, position, trim);
    }
    reset() {
        this.stop();
        this._node.disconnect();
        return this;
    }
    start(timeAt = 0) {
        if (this._ctx.state === 'suspended')
            this._ctx.resume();
        if (this._type === "file") {
            if (!!this._buffer) {
                this._node.start(timeAt);
                this._timestamp = this._ctx.currentTime + timeAt;
            }
            else {
                this._source.play();
                if (timeAt > 0)
                    this._source.currentTime = timeAt;
            }
        }
        else if (this._type === "gen") {
            this._gen(this._node.type, this._node.frequency.value);
            this._node.start();
            if (this.analyzer)
                this._node.connect(this.analyzer.node);
        }
        this._node.connect(this._ctx.destination);
        this._playing = true;
        return this;
    }
    stop() {
        if (this._playing)
            this._node.disconnect(this._ctx.destination);
        if (this._type === "file") {
            if (!!this._buffer) {
                if (this.progress < 1)
                    this._node.stop();
            }
            else {
                this._source.pause();
            }
        }
        else if (this._type === "gen") {
            this._node.stop();
        }
        else if (this._type === "input") {
            this._stream.getAudioTracks().forEach(track => track.stop());
        }
        this._playing = false;
        return this;
    }
    toggle() {
        if (this._playing) {
            this.stop();
        }
        else {
            this.start();
        }
        return this;
    }
}
//# sourceMappingURL=Play.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Pt.js":
/*!********************************************!*\
  !*** ./node_modules/pts/dist/es2015/Pt.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Pt": () => (/* binding */ Pt),
/* harmony export */   "Group": () => (/* binding */ Group),
/* harmony export */   "Bound": () => (/* binding */ Bound)
/* harmony export */ });
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util */ "./node_modules/pts/dist/es2015/Util.js");
/* harmony import */ var _Num__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Num */ "./node_modules/pts/dist/es2015/Num.js");
/* harmony import */ var _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LinearAlgebra */ "./node_modules/pts/dist/es2015/LinearAlgebra.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */



class Pt extends Float32Array {
    constructor(...args) {
        if (args.length === 1 && typeof args[0] == "number") {
            super(args[0]);
        }
        else {
            super((args.length > 0) ? _Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args) : [0, 0]);
        }
    }
    static make(dimensions, defaultValue = 0, randomize = false) {
        let p = new Float32Array(dimensions);
        if (defaultValue)
            p.fill(defaultValue);
        if (randomize) {
            for (let i = 0, len = p.length; i < len; i++) {
                p[i] = p[i] * Math.random();
            }
        }
        return new Pt(p);
    }
    get id() { return this._id; }
    set id(s) { this._id = s; }
    get x() { return this[0]; }
    set x(n) { this[0] = n; }
    get y() { return this[1]; }
    set y(n) { this[1] = n; }
    get z() { return this[2]; }
    set z(n) { this[2] = n; }
    get w() { return this[3]; }
    set w(n) { this[3] = n; }
    clone() {
        return new Pt(this);
    }
    equals(p, threshold = 0.000001) {
        for (let i = 0, len = this.length; i < len; i++) {
            if (Math.abs(this[i] - p[i]) > threshold)
                return false;
        }
        return true;
    }
    to(...args) {
        let p = _Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args);
        for (let i = 0, len = Math.min(this.length, p.length); i < len; i++) {
            this[i] = p[i];
        }
        return this;
    }
    $to(...args) {
        return this.clone().to(...args);
    }
    toAngle(radian, magnitude, anchorFromPt = false) {
        let m = (magnitude != undefined) ? magnitude : this.magnitude();
        let change = [Math.cos(radian) * m, Math.sin(radian) * m];
        return (anchorFromPt) ? this.add(change) : this.to(change);
    }
    op(fn) {
        let self = this;
        return (...params) => {
            return fn(self, ...params);
        };
    }
    ops(fns) {
        let _ops = [];
        for (let i = 0, len = fns.length; i < len; i++) {
            _ops.push(this.op(fns[i]));
        }
        return _ops;
    }
    $take(axis) {
        let p = [];
        for (let i = 0, len = axis.length; i < len; i++) {
            p.push(this[axis[i]] || 0);
        }
        return new Pt(p);
    }
    $concat(...args) {
        return new Pt(this.toArray().concat(_Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args)));
    }
    add(...args) {
        (args.length === 1 && typeof args[0] == "number") ? _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.add(this, args[0]) : _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.add(this, _Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args));
        return this;
    }
    $add(...args) { return this.clone().add(...args); }
    subtract(...args) {
        (args.length === 1 && typeof args[0] == "number") ? _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.subtract(this, args[0]) : _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.subtract(this, _Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args));
        return this;
    }
    $subtract(...args) { return this.clone().subtract(...args); }
    multiply(...args) {
        (args.length === 1 && typeof args[0] == "number") ? _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.multiply(this, args[0]) : _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.multiply(this, _Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args));
        return this;
    }
    $multiply(...args) { return this.clone().multiply(...args); }
    divide(...args) {
        (args.length === 1 && typeof args[0] == "number") ? _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.divide(this, args[0]) : _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.divide(this, _Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args));
        return this;
    }
    $divide(...args) { return this.clone().divide(...args); }
    magnitudeSq() { return _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.dot(this, this); }
    magnitude() { return _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.magnitude(this); }
    unit(magnitude = undefined) {
        _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.unit(this, magnitude);
        return this;
    }
    $unit(magnitude = undefined) { return this.clone().unit(magnitude); }
    dot(...args) { return _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.dot(this, _Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args)); }
    $cross2D(...args) { return _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.cross2D(this, _Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args)); }
    $cross(...args) { return _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.cross(this, _Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args)); }
    $project(...args) {
        return this.$multiply(this.dot(...args) / this.magnitudeSq());
    }
    projectScalar(...args) {
        return this.dot(...args) / this.magnitude();
    }
    abs() {
        _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.abs(this);
        return this;
    }
    $abs() {
        return this.clone().abs();
    }
    floor() {
        _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.floor(this);
        return this;
    }
    $floor() {
        return this.clone().floor();
    }
    ceil() {
        _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.ceil(this);
        return this;
    }
    $ceil() {
        return this.clone().ceil();
    }
    round() {
        _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.round(this);
        return this;
    }
    $round() {
        return this.clone().round();
    }
    minValue() {
        return _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.min(this);
    }
    maxValue() {
        return _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Vec.max(this);
    }
    $min(...args) {
        let p = _Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args);
        let m = this.clone();
        for (let i = 0, len = Math.min(this.length, p.length); i < len; i++) {
            m[i] = Math.min(this[i], p[i]);
        }
        return m;
    }
    $max(...args) {
        let p = _Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args);
        let m = this.clone();
        for (let i = 0, len = Math.min(this.length, p.length); i < len; i++) {
            m[i] = Math.max(this[i], p[i]);
        }
        return m;
    }
    angle(axis = _Util__WEBPACK_IMPORTED_MODULE_0__.Const.xy) {
        return Math.atan2(this[axis[1]], this[axis[0]]);
    }
    angleBetween(p, axis = _Util__WEBPACK_IMPORTED_MODULE_0__.Const.xy) {
        return _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.boundRadian(this.angle(axis)) - _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.boundRadian(p.angle(axis));
    }
    scale(scale, anchor) {
        _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.scale(this, scale, anchor || Pt.make(this.length, 0));
        return this;
    }
    rotate2D(angle, anchor, axis) {
        _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.rotate2D(this, angle, anchor || Pt.make(this.length, 0), axis);
        return this;
    }
    shear2D(scale, anchor, axis) {
        _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.shear2D(this, scale, anchor || Pt.make(this.length, 0), axis);
        return this;
    }
    reflect2D(line, axis) {
        _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.reflect2D(this, line, axis);
        return this;
    }
    toString() {
        return `Pt(${this.join(", ")})`;
    }
    toArray() {
        return [].slice.call(this);
    }
    toGroup() {
        return new Group(Pt.make(this.length), this.clone());
    }
    toBound() {
        return new Bound(Pt.make(this.length), this.clone());
    }
}
class Group extends Array {
    constructor(...args) {
        super(...args);
    }
    get id() { return this._id; }
    set id(s) { this._id = s; }
    get p1() { return this[0]; }
    get p2() { return this[1]; }
    get p3() { return this[2]; }
    get p4() { return this[3]; }
    get q1() { return this[this.length - 1]; }
    get q2() { return this[this.length - 2]; }
    get q3() { return this[this.length - 3]; }
    get q4() { return this[this.length - 4]; }
    clone() {
        let group = new Group();
        for (let i = 0, len = this.length; i < len; i++) {
            group.push(this[i].clone());
        }
        return group;
    }
    static fromArray(list) {
        let g = new Group();
        for (let i = 0, len = list.length; i < len; i++) {
            let p = (list[i] instanceof Pt) ? list[i] : new Pt(list[i]);
            g.push(p);
        }
        return g;
    }
    static fromPtArray(list) {
        return Group.from(list);
    }
    split(chunkSize, stride, loopBack = false) {
        let sp = _Util__WEBPACK_IMPORTED_MODULE_0__.Util.split(this, chunkSize, stride, loopBack);
        return sp;
    }
    insert(pts, index = 0) {
        Group.prototype.splice.apply(this, [index, 0, ...pts]);
        return this;
    }
    remove(index = 0, count = 1) {
        let param = (index < 0) ? [index * -1 - 1, count] : [index, count];
        return Group.prototype.splice.apply(this, param);
    }
    segments(pts_per_segment = 2, stride = 1, loopBack = false) {
        return this.split(pts_per_segment, stride, loopBack);
    }
    lines() { return this.segments(2, 1); }
    centroid() {
        return _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.centroid(this);
    }
    boundingBox() {
        return _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.boundingBox(this);
    }
    anchorTo(ptOrIndex = 0) { _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.anchor(this, ptOrIndex, "to"); }
    anchorFrom(ptOrIndex = 0) { _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.anchor(this, ptOrIndex, "from"); }
    op(fn) {
        let self = this;
        return (...params) => {
            return fn(self, ...params);
        };
    }
    ops(fns) {
        let _ops = [];
        for (let i = 0, len = fns.length; i < len; i++) {
            _ops.push(this.op(fns[i]));
        }
        return _ops;
    }
    interpolate(t) {
        t = _Num__WEBPACK_IMPORTED_MODULE_1__.Num.clamp(t, 0, 1);
        let chunk = this.length - 1;
        let tc = 1 / (this.length - 1);
        let idx = Math.floor(t / tc);
        return _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.interpolate(this[idx], this[Math.min(this.length - 1, idx + 1)], (t - idx * tc) * chunk);
    }
    moveBy(...args) {
        return this.add(...args);
    }
    moveTo(...args) {
        let d = new Pt(_Util__WEBPACK_IMPORTED_MODULE_0__.Util.getArgs(args)).subtract(this[0]);
        this.moveBy(d);
        return this;
    }
    scale(scale, anchor) {
        for (let i = 0, len = this.length; i < len; i++) {
            _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.scale(this[i], scale, anchor || this[0]);
        }
        return this;
    }
    rotate2D(angle, anchor, axis) {
        for (let i = 0, len = this.length; i < len; i++) {
            _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.rotate2D(this[i], angle, anchor || this[0], axis);
        }
        return this;
    }
    shear2D(scale, anchor, axis) {
        for (let i = 0, len = this.length; i < len; i++) {
            _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.shear2D(this[i], scale, anchor || this[0], axis);
        }
        return this;
    }
    reflect2D(line, axis) {
        for (let i = 0, len = this.length; i < len; i++) {
            _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.reflect2D(this[i], line, axis);
        }
        return this;
    }
    sortByDimension(dim, desc = false) {
        return this.sort((a, b) => (desc) ? b[dim] - a[dim] : a[dim] - b[dim]);
    }
    forEachPt(ptFn, ...args) {
        if (!this[0][ptFn]) {
            _Util__WEBPACK_IMPORTED_MODULE_0__.Util.warn(`${ptFn} is not a function of Pt`);
            return this;
        }
        for (let i = 0, len = this.length; i < len; i++) {
            this[i] = this[i][ptFn](...args);
        }
        return this;
    }
    add(...args) {
        return this.forEachPt("add", ...args);
    }
    subtract(...args) {
        return this.forEachPt("subtract", ...args);
    }
    multiply(...args) {
        return this.forEachPt("multiply", ...args);
    }
    divide(...args) {
        return this.forEachPt("divide", ...args);
    }
    $matrixAdd(g) {
        return _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Mat.add(this, g);
    }
    $matrixMultiply(g, transposed = false, elementwise = false) {
        return _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Mat.multiply(this, g, transposed, elementwise);
    }
    zipSlice(index, defaultValue = false) {
        return _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Mat.zipSlice(this, index, defaultValue);
    }
    $zip(defaultValue = undefined, useLongest = false) {
        return _LinearAlgebra__WEBPACK_IMPORTED_MODULE_2__.Mat.zip(this, defaultValue, useLongest);
    }
    toString() {
        return "Group[ " + this.reduce((p, c) => p + c.toString() + " ", "") + " ]";
    }
}
class Bound extends Group {
    constructor(...args) {
        super(...args);
        this._center = new Pt();
        this._size = new Pt();
        this._topLeft = new Pt();
        this._bottomRight = new Pt();
        this._inited = false;
        this.init();
    }
    static fromBoundingRect(rect) {
        let b = new Bound(new Pt(rect.left || 0, rect.top || 0), new Pt(rect.right || 0, rect.bottom || 0));
        if (rect.width && rect.height)
            b.size = new Pt(rect.width, rect.height);
        return b;
    }
    static fromGroup(g) {
        if (g.length < 2)
            throw new Error("Cannot create a Bound from a group that has less than 2 Pt");
        return new Bound(g[0], g[g.length - 1]);
    }
    init() {
        if (this.p1) {
            this._size = this.p1.clone();
            this._inited = true;
        }
        if (this.p1 && this.p2) {
            let a = this.p1;
            let b = this.p2;
            this.topLeft = a.$min(b);
            this._bottomRight = a.$max(b);
            this._updateSize();
            this._inited = true;
        }
    }
    clone() {
        return new Bound(this._topLeft.clone(), this._bottomRight.clone());
    }
    _updateSize() {
        this._size = this._bottomRight.$subtract(this._topLeft).abs();
        this._updateCenter();
    }
    _updateCenter() {
        this._center = this._size.$multiply(0.5).add(this._topLeft);
    }
    _updatePosFromTop() {
        this._bottomRight = this._topLeft.$add(this._size);
        this._updateCenter();
    }
    _updatePosFromBottom() {
        this._topLeft = this._bottomRight.$subtract(this._size);
        this._updateCenter();
    }
    _updatePosFromCenter() {
        let half = this._size.$multiply(0.5);
        this._topLeft = this._center.$subtract(half);
        this._bottomRight = this._center.$add(half);
    }
    get size() { return new Pt(this._size); }
    set size(p) {
        this._size = new Pt(p);
        this._updatePosFromTop();
    }
    get center() { return new Pt(this._center); }
    set center(p) {
        this._center = new Pt(p);
        this._updatePosFromCenter();
    }
    get topLeft() { return new Pt(this._topLeft); }
    set topLeft(p) {
        this._topLeft = new Pt(p);
        this[0] = this._topLeft;
        this._updateSize();
    }
    get bottomRight() { return new Pt(this._bottomRight); }
    set bottomRight(p) {
        this._bottomRight = new Pt(p);
        this[1] = this._bottomRight;
        this._updateSize();
    }
    get width() { return (this._size.length > 0) ? this._size.x : 0; }
    set width(w) {
        this._size.x = w;
        this._updatePosFromTop();
    }
    get height() { return (this._size.length > 1) ? this._size.y : 0; }
    set height(h) {
        this._size.y = h;
        this._updatePosFromTop();
    }
    get depth() { return (this._size.length > 2) ? this._size.z : 0; }
    set depth(d) {
        this._size.z = d;
        this._updatePosFromTop();
    }
    get x() { return this.topLeft.x; }
    get y() { return this.topLeft.y; }
    get z() { return this.topLeft.z; }
    get inited() { return this._inited; }
    update() {
        this._topLeft = this[0];
        this._bottomRight = this[1];
        this._updateSize();
        return this;
    }
}
//# sourceMappingURL=Pt.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Space.js":
/*!***********************************************!*\
  !*** ./node_modules/pts/dist/es2015/Space.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Space": () => (/* binding */ Space),
/* harmony export */   "MultiTouchSpace": () => (/* binding */ MultiTouchSpace)
/* harmony export */ });
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UI */ "./node_modules/pts/dist/es2015/UI.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */


class Space {
    constructor() {
        this.id = "space";
        this.bound = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Bound();
        this._time = { prev: 0, diff: 0, end: -1 };
        this.players = {};
        this.playerCount = 0;
        this._animID = -1;
        this._pause = false;
        this._refresh = undefined;
        this._pointer = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt();
        this._isReady = false;
        this._playing = false;
    }
    refresh(b) {
        this._refresh = b;
        return this;
    }
    add(p) {
        let player = (typeof p == "function") ? { animate: p } : p;
        let k = this.playerCount++;
        let pid = this.id + k;
        this.players[pid] = player;
        player.animateID = pid;
        if (player.resize && this.bound.inited)
            player.resize(this.bound);
        if (this._refresh === undefined)
            this._refresh = true;
        return this;
    }
    remove(player) {
        delete this.players[player.animateID];
        return this;
    }
    removeAll() {
        this.players = {};
        return this;
    }
    play(time = 0) {
        if (time === 0 && this._animID !== -1) {
            return;
        }
        this._animID = requestAnimationFrame(this.play.bind(this));
        if (this._pause)
            return this;
        this._time.diff = time - this._time.prev;
        this._time.prev = time;
        try {
            this.playItems(time);
        }
        catch (err) {
            cancelAnimationFrame(this._animID);
            this._animID = -1;
            this._playing = false;
            throw err;
        }
        return this;
    }
    replay() {
        this._time.end = -1;
        this.play();
    }
    playItems(time) {
        this._playing = true;
        if (this._refresh)
            this.clear();
        if (this._isReady) {
            for (let k in this.players) {
                if (this.players[k].animate)
                    this.players[k].animate(time, this._time.diff, this);
            }
        }
        if (this._time.end >= 0 && time > this._time.end) {
            cancelAnimationFrame(this._animID);
            this._animID = -1;
            this._playing = false;
        }
    }
    pause(toggle = false) {
        this._pause = (toggle) ? !this._pause : true;
        return this;
    }
    resume() {
        this._pause = false;
        return this;
    }
    stop(t = 0) {
        this._time.end = t;
        return this;
    }
    playOnce(duration = 5000) {
        this.play();
        this.stop(duration);
        return this;
    }
    render(context) {
        if (this._renderFunc)
            this._renderFunc(context, this);
        return this;
    }
    set customRendering(f) { this._renderFunc = f; }
    get customRendering() { return this._renderFunc; }
    get isPlaying() { return this._playing; }
    get outerBound() { return this.bound.clone(); }
    get innerBound() { return new _Pt__WEBPACK_IMPORTED_MODULE_0__.Bound(_Pt__WEBPACK_IMPORTED_MODULE_0__.Pt.make(this.size.length, 0), this.size.clone()); }
    get size() { return this.bound.size.clone(); }
    get center() { return this.size.divide(2); }
    get width() { return this.bound.width; }
    get height() { return this.bound.height; }
}
class MultiTouchSpace extends Space {
    constructor() {
        super(...arguments);
        this._pressed = false;
        this._dragged = false;
        this._hasMouse = false;
        this._hasTouch = false;
    }
    get pointer() {
        let p = this._pointer.clone();
        p.id = this._pointer.id;
        return p;
    }
    bindCanvas(evt, callback) {
        this._canvas.addEventListener(evt, callback);
    }
    unbindCanvas(evt, callback) {
        this._canvas.removeEventListener(evt, callback);
    }
    bindMouse(_bind = true) {
        if (_bind) {
            this.bindCanvas("mousedown", this._mouseDown.bind(this));
            this.bindCanvas("mouseup", this._mouseUp.bind(this));
            this.bindCanvas("mouseover", this._mouseOver.bind(this));
            this.bindCanvas("mouseout", this._mouseOut.bind(this));
            this.bindCanvas("mousemove", this._mouseMove.bind(this));
            this.bindCanvas("contextmenu", this._contextMenu.bind(this));
            this._hasMouse = true;
        }
        else {
            this.unbindCanvas("mousedown", this._mouseDown.bind(this));
            this.unbindCanvas("mouseup", this._mouseUp.bind(this));
            this.unbindCanvas("mouseover", this._mouseOver.bind(this));
            this.unbindCanvas("mouseout", this._mouseOut.bind(this));
            this.unbindCanvas("mousemove", this._mouseMove.bind(this));
            this.unbindCanvas("contextmenu", this._contextMenu.bind(this));
            this._hasMouse = false;
        }
        return this;
    }
    bindTouch(_bind = true) {
        if (_bind) {
            this.bindCanvas("touchstart", this._touchStart.bind(this));
            this.bindCanvas("touchend", this._mouseUp.bind(this));
            this.bindCanvas("touchmove", this._touchMove.bind(this));
            this.bindCanvas("touchcancel", this._mouseOut.bind(this));
            this._hasTouch = true;
        }
        else {
            this.unbindCanvas("touchstart", this._touchStart.bind(this));
            this.unbindCanvas("touchend", this._mouseUp.bind(this));
            this.unbindCanvas("touchmove", this._touchMove.bind(this));
            this.unbindCanvas("touchcancel", this._mouseOut.bind(this));
            this._hasTouch = false;
        }
        return this;
    }
    touchesToPoints(evt, which = "touches") {
        if (!evt || !evt[which])
            return [];
        let ts = [];
        for (var i = 0; i < evt[which].length; i++) {
            let t = evt[which].item(i);
            ts.push(new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(t.pageX - this.bound.topLeft.x, t.pageY - this.bound.topLeft.y));
        }
        return ts;
    }
    _mouseAction(type, evt) {
        let px = 0, py = 0;
        if (evt instanceof MouseEvent) {
            for (let k in this.players) {
                if (this.players.hasOwnProperty(k)) {
                    let v = this.players[k];
                    px = evt.pageX - this.outerBound.x;
                    py = evt.pageY - this.outerBound.y;
                    if (v.action)
                        v.action(type, px, py, evt);
                }
            }
        }
        else {
            for (let k in this.players) {
                if (this.players.hasOwnProperty(k)) {
                    let v = this.players[k];
                    let c = evt.changedTouches && evt.changedTouches.length > 0;
                    let touch = evt.changedTouches.item(0);
                    px = (c) ? touch.pageX - this.outerBound.x : 0;
                    py = (c) ? touch.pageY - this.outerBound.y : 0;
                    if (v.action)
                        v.action(type, px, py, evt);
                }
            }
        }
        if (type) {
            this._pointer.to(px, py);
            this._pointer.id = type;
        }
    }
    _mouseDown(evt) {
        this._mouseAction(_UI__WEBPACK_IMPORTED_MODULE_1__.UIPointerActions.down, evt);
        this._pressed = true;
        return false;
    }
    _mouseUp(evt) {
        if (this._dragged) {
            this._mouseAction(_UI__WEBPACK_IMPORTED_MODULE_1__.UIPointerActions.drop, evt);
        }
        else {
            this._mouseAction(_UI__WEBPACK_IMPORTED_MODULE_1__.UIPointerActions.up, evt);
        }
        this._pressed = false;
        this._dragged = false;
        return false;
    }
    _mouseMove(evt) {
        this._mouseAction(_UI__WEBPACK_IMPORTED_MODULE_1__.UIPointerActions.move, evt);
        if (this._pressed) {
            this._dragged = true;
            this._mouseAction(_UI__WEBPACK_IMPORTED_MODULE_1__.UIPointerActions.drag, evt);
        }
        return false;
    }
    _mouseOver(evt) {
        this._mouseAction(_UI__WEBPACK_IMPORTED_MODULE_1__.UIPointerActions.over, evt);
        return false;
    }
    _mouseOut(evt) {
        this._mouseAction(_UI__WEBPACK_IMPORTED_MODULE_1__.UIPointerActions.out, evt);
        if (this._dragged)
            this._mouseAction(_UI__WEBPACK_IMPORTED_MODULE_1__.UIPointerActions.drop, evt);
        this._dragged = false;
        return false;
    }
    _contextMenu(evt) {
        this._mouseAction(_UI__WEBPACK_IMPORTED_MODULE_1__.UIPointerActions.contextmenu, evt);
        return false;
    }
    _touchMove(evt) {
        this._mouseMove(evt);
        evt.preventDefault();
        return false;
    }
    _touchStart(evt) {
        this._mouseDown(evt);
        evt.preventDefault();
        return false;
    }
}
//# sourceMappingURL=Space.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Svg.js":
/*!*********************************************!*\
  !*** ./node_modules/pts/dist/es2015/Svg.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SVGSpace": () => (/* binding */ SVGSpace),
/* harmony export */   "SVGForm": () => (/* binding */ SVGForm)
/* harmony export */ });
/* harmony import */ var _Form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Form */ "./node_modules/pts/dist/es2015/Form.js");
/* harmony import */ var _Num__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Num */ "./node_modules/pts/dist/es2015/Num.js");
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Util */ "./node_modules/pts/dist/es2015/Util.js");
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/* harmony import */ var _Op__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Op */ "./node_modules/pts/dist/es2015/Op.js");
/* harmony import */ var _Dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Dom */ "./node_modules/pts/dist/es2015/Dom.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */






class SVGSpace extends _Dom__WEBPACK_IMPORTED_MODULE_5__.DOMSpace {
    constructor(elem, callback) {
        super(elem, callback);
        this._bgcolor = "#999";
        if (this._canvas.nodeName.toLowerCase() != "svg") {
            let s = SVGSpace.svgElement(this._canvas, "svg", `${this.id}_svg`);
            this._container = this._canvas;
            this._canvas = s;
        }
    }
    getForm() { return new SVGForm(this); }
    get element() {
        return this._canvas;
    }
    resize(b, evt) {
        super.resize(b, evt);
        SVGSpace.setAttr(this.element, {
            "viewBox": `0 0 ${this.bound.width} ${this.bound.height}`,
            "width": `${this.bound.width}`,
            "height": `${this.bound.height}`,
            "xmlns": "http://www.w3.org/2000/svg",
            "version": "1.1"
        });
        return this;
    }
    static svgElement(parent, name, id) {
        if (!parent || !parent.appendChild)
            throw new Error("parent is not a valid DOM element");
        let elem = document.querySelector(`#${id}`);
        if (!elem) {
            elem = document.createElementNS("http://www.w3.org/2000/svg", name);
            elem.setAttribute("id", id);
            parent.appendChild(elem);
        }
        return elem;
    }
    remove(player) {
        let temp = this._container.querySelectorAll("." + SVGForm.scopeID(player));
        temp.forEach((el) => {
            el.parentNode.removeChild(el);
        });
        return super.remove(player);
    }
    removeAll() {
        this._container.innerHTML = "";
        return super.removeAll();
    }
}
class SVGForm extends _Form__WEBPACK_IMPORTED_MODULE_0__.VisualForm {
    constructor(space) {
        super();
        this._style = {
            "filled": true,
            "stroked": true,
            "fill": "#f03",
            "stroke": "#fff",
            "stroke-width": 1,
            "stroke-linejoin": "bevel",
            "stroke-linecap": "sqaure",
            "opacity": 1
        };
        this._ctx = {
            group: null,
            groupID: "pts",
            groupCount: 0,
            currentID: "pts0",
            currentClass: "",
            style: {},
        };
        this._ready = false;
        this._space = space;
        this._space.add({ start: () => {
                this._ctx.group = this._space.element;
                this._ctx.groupID = "pts_svg_" + (SVGForm.groupID++);
                this._ctx.style = Object.assign({}, this._style);
                this._ready = true;
            } });
    }
    get space() { return this._space; }
    styleTo(k, v) {
        if (this._ctx.style[k] === undefined)
            throw new Error(`${k} style property doesn't exist`);
        this._ctx.style[k] = v;
    }
    alpha(a) {
        this.styleTo("opacity", a);
        return this;
    }
    fill(c) {
        if (typeof c == "boolean") {
            this.styleTo("filled", c);
        }
        else {
            this.styleTo("filled", true);
            this.styleTo("fill", c);
        }
        return this;
    }
    stroke(c, width, linejoin, linecap) {
        if (typeof c == "boolean") {
            this.styleTo("stroked", c);
        }
        else {
            this.styleTo("stroked", true);
            this.styleTo("stroke", c);
            if (width)
                this.styleTo("stroke-width", width);
            if (linejoin)
                this.styleTo("stroke-linejoin", linejoin);
            if (linecap)
                this.styleTo("stroke-linecap", linecap);
        }
        return this;
    }
    cls(c) {
        if (typeof c == "boolean") {
            this._ctx.currentClass = "";
        }
        else {
            this._ctx.currentClass = c;
        }
        return this;
    }
    font(sizeOrFont, weight, style, lineHeight, family) {
        if (typeof sizeOrFont == "number") {
            this._font.size = sizeOrFont;
            if (family)
                this._font.face = family;
            if (weight)
                this._font.weight = weight;
            if (style)
                this._font.style = style;
            if (lineHeight)
                this._font.lineHeight = lineHeight;
        }
        else {
            this._font = sizeOrFont;
        }
        this._ctx.style['font'] = this._font.value;
        return this;
    }
    reset() {
        this._ctx.style = Object.assign({}, this._style);
        this._font = new _Form__WEBPACK_IMPORTED_MODULE_0__.Font(10, "sans-serif");
        this._ctx.style['font'] = this._font.value;
        return this;
    }
    updateScope(group_id, group) {
        this._ctx.group = group;
        this._ctx.groupID = group_id;
        this._ctx.groupCount = 0;
        this.nextID();
        return this._ctx;
    }
    scope(item) {
        if (!item || item.animateID == null)
            throw new Error("item not defined or not yet added to Space");
        return this.updateScope(SVGForm.scopeID(item), this.space.element);
    }
    nextID() {
        this._ctx.groupCount++;
        this._ctx.currentID = `${this._ctx.groupID}-${this._ctx.groupCount}`;
        return this._ctx.currentID;
    }
    static getID(ctx) {
        return ctx.currentID || `p-${SVGForm.domID++}`;
    }
    static scopeID(item) {
        return `item-${item.animateID}`;
    }
    static style(elem, styles) {
        let st = [];
        if (!styles["filled"])
            st.push("fill: none");
        if (!styles["stroked"])
            st.push("stroke: none");
        for (let k in styles) {
            if (styles.hasOwnProperty(k) && k != "filled" && k != "stroked") {
                let v = styles[k];
                if (v) {
                    if (!styles["filled"] && k.indexOf('fill') === 0) {
                        continue;
                    }
                    else if (!styles["stroked"] && k.indexOf('stroke') === 0) {
                        continue;
                    }
                    else {
                        st.push(`${k}: ${v}`);
                    }
                }
            }
        }
        return _Dom__WEBPACK_IMPORTED_MODULE_5__.DOMSpace.setAttr(elem, { style: st.join(";") });
    }
    static point(ctx, pt, radius = 5, shape = "square") {
        if (shape === "circle") {
            return SVGForm.circle(ctx, pt, radius);
        }
        else {
            return SVGForm.square(ctx, pt, radius);
        }
    }
    point(pt, radius = 5, shape = "square") {
        this.nextID();
        SVGForm.point(this._ctx, pt, radius, shape);
        return this;
    }
    static circle(ctx, pt, radius = 10) {
        let elem = SVGSpace.svgElement(ctx.group, "circle", SVGForm.getID(ctx));
        _Dom__WEBPACK_IMPORTED_MODULE_5__.DOMSpace.setAttr(elem, {
            cx: pt[0],
            cy: pt[1],
            r: radius,
            'class': `pts-svgform pts-circle ${ctx.currentClass}`,
        });
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    circle(pts) {
        this.nextID();
        SVGForm.circle(this._ctx, pts[0], pts[1][0]);
        return this;
    }
    static arc(ctx, pt, radius, startAngle, endAngle, cc) {
        let elem = SVGSpace.svgElement(ctx.group, "path", SVGForm.getID(ctx));
        const start = new _Pt__WEBPACK_IMPORTED_MODULE_3__.Pt(pt).toAngle(startAngle, radius, true);
        const end = new _Pt__WEBPACK_IMPORTED_MODULE_3__.Pt(pt).toAngle(endAngle, radius, true);
        const diff = _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.boundAngle(endAngle) - _Num__WEBPACK_IMPORTED_MODULE_1__.Geom.boundAngle(startAngle);
        let largeArc = (diff > _Util__WEBPACK_IMPORTED_MODULE_2__.Const.pi) ? true : false;
        if (cc)
            largeArc = !largeArc;
        const sweep = (cc) ? "0" : "1";
        const d = `M ${start[0]} ${start[1]} A ${radius} ${radius} 0 ${largeArc ? "1" : "0"} ${sweep} ${end[0]} ${end[1]}`;
        _Dom__WEBPACK_IMPORTED_MODULE_5__.DOMSpace.setAttr(elem, {
            d: d,
            'class': `pts-svgform pts-arc ${ctx.currentClass}`,
        });
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    arc(pt, radius, startAngle, endAngle, cc) {
        this.nextID();
        SVGForm.arc(this._ctx, pt, radius, startAngle, endAngle, cc);
        return this;
    }
    static square(ctx, pt, halfsize) {
        let elem = SVGSpace.svgElement(ctx.group, "rect", SVGForm.getID(ctx));
        _Dom__WEBPACK_IMPORTED_MODULE_5__.DOMSpace.setAttr(elem, {
            x: pt[0] - halfsize,
            y: pt[1] - halfsize,
            width: halfsize * 2,
            height: halfsize * 2,
            'class': `pts-svgform pts-square ${ctx.currentClass}`,
        });
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    square(pt, halfsize) {
        this.nextID();
        SVGForm.square(this._ctx, pt, halfsize);
        return this;
    }
    static line(ctx, pts) {
        if (!this._checkSize(pts))
            return;
        if (pts.length > 2)
            return SVGForm._poly(ctx, pts, false);
        let elem = SVGSpace.svgElement(ctx.group, "line", SVGForm.getID(ctx));
        _Dom__WEBPACK_IMPORTED_MODULE_5__.DOMSpace.setAttr(elem, {
            x1: pts[0][0],
            y1: pts[0][1],
            x2: pts[1][0],
            y2: pts[1][1],
            'class': `pts-svgform pts-line ${ctx.currentClass}`,
        });
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    line(pts) {
        this.nextID();
        SVGForm.line(this._ctx, pts);
        return this;
    }
    static _poly(ctx, pts, closePath = true) {
        if (!this._checkSize(pts))
            return;
        let elem = SVGSpace.svgElement(ctx.group, ((closePath) ? "polygon" : "polyline"), SVGForm.getID(ctx));
        let points = pts.reduce((a, p) => a + `${p[0]},${p[1]} `, "");
        _Dom__WEBPACK_IMPORTED_MODULE_5__.DOMSpace.setAttr(elem, {
            points: points,
            'class': `pts-svgform pts-polygon ${ctx.currentClass}`,
        });
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    static polygon(ctx, pts) {
        return SVGForm._poly(ctx, pts, true);
    }
    polygon(pts) {
        this.nextID();
        SVGForm.polygon(this._ctx, pts);
        return this;
    }
    static rect(ctx, pts) {
        if (!this._checkSize(pts))
            return;
        let elem = SVGSpace.svgElement(ctx.group, "rect", SVGForm.getID(ctx));
        let bound = _Pt__WEBPACK_IMPORTED_MODULE_3__.Group.fromArray(pts).boundingBox();
        let size = _Op__WEBPACK_IMPORTED_MODULE_4__.Rectangle.size(bound);
        _Dom__WEBPACK_IMPORTED_MODULE_5__.DOMSpace.setAttr(elem, {
            x: bound[0][0],
            y: bound[0][1],
            width: size[0],
            height: size[1],
            'class': `pts-svgform pts-rect ${ctx.currentClass}`,
        });
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    rect(pts) {
        this.nextID();
        SVGForm.rect(this._ctx, pts);
        return this;
    }
    static text(ctx, pt, txt) {
        let elem = SVGSpace.svgElement(ctx.group, "text", SVGForm.getID(ctx));
        _Dom__WEBPACK_IMPORTED_MODULE_5__.DOMSpace.setAttr(elem, {
            "pointer-events": "none",
            x: pt[0],
            y: pt[1],
            dx: 0, dy: 0,
            'class': `pts-svgform pts-text ${ctx.currentClass}`,
        });
        elem.textContent = txt;
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    text(pt, txt) {
        this.nextID();
        SVGForm.text(this._ctx, pt, txt);
        return this;
    }
    log(txt) {
        this.fill("#000").stroke("#fff", 0.5).text([10, 14], txt);
        return this;
    }
}
SVGForm.groupID = 0;
SVGForm.domID = 0;
//# sourceMappingURL=Svg.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Typography.js":
/*!****************************************************!*\
  !*** ./node_modules/pts/dist/es2015/Typography.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Typography": () => (/* binding */ Typography)
/* harmony export */ });
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */

class Typography {
    static textWidthEstimator(fn, samples = ["M", "n", "."], distribution = [0.06, 0.8, 0.14]) {
        let m = samples.map(fn);
        let avg = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(distribution).dot(m);
        return (str) => str.length * avg;
    }
    static truncate(fn, str, width, tail = "") {
        let trim = Math.floor(str.length * Math.min(1, width / fn(str)));
        if (trim < str.length) {
            trim = Math.max(0, trim - tail.length);
            return [str.substr(0, trim) + tail, trim];
        }
        else {
            return [str, str.length];
        }
    }
    static fontSizeToBox(box, ratio = 1, byHeight = true) {
        let i = byHeight ? 1 : 0;
        let h = (box[1][i] - box[0][i]);
        let f = ratio * h;
        return function (b) {
            let nh = (b[1][i] - b[0][i]) / h;
            return f * nh;
        };
    }
    static fontSizeToThreshold(threshold, direction = 0) {
        return function (defaultSize, val) {
            let d = defaultSize * val / threshold;
            if (direction < 0)
                return Math.min(d, defaultSize);
            if (direction > 0)
                return Math.max(d, defaultSize);
            return d;
        };
    }
}
//# sourceMappingURL=Typography.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/UI.js":
/*!********************************************!*\
  !*** ./node_modules/pts/dist/es2015/UI.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UIShape": () => (/* binding */ UIShape),
/* harmony export */   "UIPointerActions": () => (/* binding */ UIPointerActions),
/* harmony export */   "UI": () => (/* binding */ UI),
/* harmony export */   "UIButton": () => (/* binding */ UIButton),
/* harmony export */   "UIDragger": () => (/* binding */ UIDragger)
/* harmony export */ });
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/* harmony import */ var _Op__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Op */ "./node_modules/pts/dist/es2015/Op.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */


const UIShape = {
    rectangle: "rectangle", circle: "circle", polygon: "polygon", polyline: "polyline", line: "line"
};
const UIPointerActions = {
    up: "up", down: "down", move: "move", drag: "drag", uidrag: "uidrag", drop: "drop", uidrop: "uidrop", over: "over", out: "out", enter: "enter", leave: "leave", contextmenu: "contextmenu", all: "all"
};
class UI {
    constructor(group, shape, states = {}, id) {
        this._holds = new Map();
        this._group = _Pt__WEBPACK_IMPORTED_MODULE_0__.Group.fromArray(group);
        this._shape = shape;
        this._id = id === undefined ? `ui_${(UI._counter++)}` : id;
        this._states = states;
        this._actions = {};
    }
    static fromRectangle(group, states, id) {
        return new this(group, UIShape.rectangle, states, id);
    }
    static fromCircle(group, states, id) {
        return new this(group, UIShape.circle, states, id);
    }
    static fromPolygon(group, states, id) {
        return new this(group, UIShape.polygon, states, id);
    }
    static fromUI(ui, states, id) {
        return new this(ui.group, ui.shape, states || ui._states, id);
    }
    get id() { return this._id; }
    set id(d) { this._id = d; }
    get group() { return this._group; }
    set group(d) { this._group = d; }
    get shape() { return this._shape; }
    set shape(d) { this._shape = d; }
    state(key, value) {
        if (!key)
            return null;
        if (value !== undefined) {
            this._states[key] = value;
            return this;
        }
        return this._states[key];
    }
    on(type, fn) {
        if (!this._actions[type])
            this._actions[type] = [];
        return UI._addHandler(this._actions[type], fn);
    }
    off(type, which) {
        if (!this._actions[type])
            return false;
        if (which === undefined) {
            delete this._actions[type];
            return true;
        }
        else {
            return UI._removeHandler(this._actions[type], which);
        }
    }
    listen(type, p, evt) {
        if (this._actions[type] !== undefined) {
            if (this._within(p) || Array.from(this._holds.values()).indexOf(type) >= 0) {
                UI._trigger(this._actions[type], this, p, type, evt);
                return true;
            }
            else if (this._actions['all']) {
                UI._trigger(this._actions['all'], this, p, type, evt);
                return true;
            }
        }
        return false;
    }
    hold(type) {
        let newKey = Math.max(0, ...Array.from(this._holds.keys())) + 1;
        this._holds.set(newKey, type);
        return newKey;
    }
    unhold(key) {
        if (key !== undefined) {
            this._holds.delete(key);
        }
        else {
            this._holds.clear();
        }
    }
    static track(uis, type, p, evt) {
        for (let i = 0, len = uis.length; i < len; i++) {
            uis[i].listen(type, p, evt);
        }
    }
    render(fn) {
        fn(this._group, this._states);
    }
    toString() {
        return `UI ${this.group.toString}`;
    }
    _within(p) {
        let fn = null;
        if (this._shape === UIShape.rectangle) {
            fn = _Op__WEBPACK_IMPORTED_MODULE_1__.Rectangle.withinBound;
        }
        else if (this._shape === UIShape.circle) {
            fn = _Op__WEBPACK_IMPORTED_MODULE_1__.Circle.withinBound;
        }
        else if (this._shape === UIShape.polygon) {
            fn = _Op__WEBPACK_IMPORTED_MODULE_1__.Polygon.hasIntersectPoint;
        }
        else {
            return false;
        }
        return fn(this._group, p);
    }
    static _trigger(fns, target, pt, type, evt) {
        if (fns) {
            for (let i = 0, len = fns.length; i < len; i++) {
                if (fns[i])
                    fns[i](target, pt, type, evt);
            }
        }
    }
    static _addHandler(fns, fn) {
        if (fn) {
            fns.push(fn);
            return fns.length - 1;
        }
        else {
            return -1;
        }
    }
    static _removeHandler(fns, index) {
        if (index >= 0 && index < fns.length) {
            let temp = fns.length;
            fns.splice(index, 1);
            return (temp > fns.length);
        }
        else {
            return false;
        }
    }
}
UI._counter = 0;
class UIButton extends UI {
    constructor(group, shape, states = {}, id) {
        super(group, shape, states, id);
        this._hoverID = -1;
        if (states.hover === undefined)
            this._states['hover'] = false;
        if (states.clicks === undefined)
            this._states['clicks'] = 0;
        const UA = UIPointerActions;
        this.on(UA.up, (target, pt, type, evt) => {
            this.state('clicks', this._states.clicks + 1);
        });
        this.on(UA.move, (target, pt, type, evt) => {
            let hover = this._within(pt);
            if (hover && !this._states.hover) {
                this.state('hover', true);
                UI._trigger(this._actions[UA.enter], this, pt, UA.enter, evt);
                var _capID = this.hold(UA.move);
                this._hoverID = this.on(UA.move, (t, p) => {
                    if (!this._within(p) && !this.state('dragging')) {
                        this.state('hover', false);
                        UI._trigger(this._actions[UA.leave], this, pt, UA.leave, evt);
                        this.off(UA.move, this._hoverID);
                        this.unhold(_capID);
                    }
                });
            }
        });
    }
    onClick(fn) {
        return this.on(UIPointerActions.up, fn);
    }
    offClick(id) {
        return this.off(UIPointerActions.up, id);
    }
    onContextMenu(fn) {
        return this.on(UIPointerActions.contextmenu, fn);
    }
    offContextMenu(id) {
        return this.off(UIPointerActions.contextmenu, id);
    }
    onHover(enter, leave) {
        var ids = [undefined, undefined];
        if (enter)
            ids[0] = this.on(UIPointerActions.enter, enter);
        if (leave)
            ids[1] = this.on(UIPointerActions.leave, leave);
        return ids;
    }
    offHover(enterID, leaveID) {
        var s = [false, false];
        if (enterID === undefined || enterID >= 0)
            s[0] = this.off(UIPointerActions.enter, enterID);
        if (leaveID === undefined || leaveID >= 0)
            s[1] = this.off(UIPointerActions.leave, leaveID);
        return s;
    }
}
class UIDragger extends UIButton {
    constructor(group, shape, states = {}, id) {
        super(group, shape, states, id);
        this._draggingID = -1;
        this._moveHoldID = -1;
        this._dropHoldID = -1;
        this._upHoldID = -1;
        if (states.dragging === undefined)
            this._states['dragging'] = false;
        if (states.moved === undefined)
            this._states['moved'] = false;
        if (states.offset === undefined)
            this._states['offset'] = new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt();
        const UA = UIPointerActions;
        this.on(UA.down, (target, pt, type, evt) => {
            if (this._moveHoldID === -1) {
                this.state('dragging', true);
                this.state('offset', new _Pt__WEBPACK_IMPORTED_MODULE_0__.Pt(pt).subtract(target.group[0]));
                this._moveHoldID = this.hold(UA.move);
            }
            if (this._dropHoldID === -1) {
                this._dropHoldID = this.hold(UA.drop);
            }
            if (this._upHoldID === -1) {
                this._upHoldID = this.hold(UA.up);
            }
            if (this._draggingID === -1) {
                this._draggingID = this.on(UA.move, (t, p) => {
                    if (this.state('dragging')) {
                        UI._trigger(this._actions[UA.uidrag], t, p, UA.uidrag, evt);
                        this.state('moved', true);
                    }
                });
            }
        });
        const endDrag = (target, pt, type, evt) => {
            this.state('dragging', false);
            this.off(UA.move, this._draggingID);
            this._draggingID = -1;
            this.unhold(this._moveHoldID);
            this._moveHoldID = -1;
            this.unhold(this._dropHoldID);
            this._dropHoldID = -1;
            this.unhold(this._upHoldID);
            this._upHoldID = -1;
            if (this.state('moved')) {
                UI._trigger(this._actions[UA.uidrop], target, pt, UA.uidrop, evt);
                this.state('moved', false);
            }
        };
        this.on(UA.drop, endDrag);
        this.on(UA.up, endDrag);
        this.on(UA.out, endDrag);
    }
    onDrag(fn) {
        return this.on(UIPointerActions.uidrag, fn);
    }
    offDrag(id) {
        return this.off(UIPointerActions.uidrag, id);
    }
    onDrop(fn) {
        return this.on(UIPointerActions.uidrop, fn);
    }
    offDrop(id) {
        return this.off(UIPointerActions.uidrop, id);
    }
}
//# sourceMappingURL=UI.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/Util.js":
/*!**********************************************!*\
  !*** ./node_modules/pts/dist/es2015/Util.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Const": () => (/* binding */ Const),
/* harmony export */   "Util": () => (/* binding */ Util)
/* harmony export */ });
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */

const Const = {
    xy: "xy",
    yz: "yz",
    xz: "xz",
    xyz: "xyz",
    horizontal: 0,
    vertical: 1,
    identical: 0,
    right: 4,
    bottom_right: 5,
    bottom: 6,
    bottom_left: 7,
    left: 8,
    top_left: 1,
    top: 2,
    top_right: 3,
    epsilon: 0.0001,
    max: Number.MAX_VALUE,
    min: Number.MIN_VALUE,
    pi: Math.PI,
    two_pi: 6.283185307179586,
    half_pi: 1.5707963267948966,
    quarter_pi: 0.7853981633974483,
    one_degree: 0.017453292519943295,
    rad_to_deg: 57.29577951308232,
    deg_to_rad: 0.017453292519943295,
    gravity: 9.81,
    newton: 0.10197,
    gaussian: 0.3989422804014327
};
class Util {
    static warnLevel(lv) {
        if (lv) {
            Util._warnLevel = lv;
        }
        return Util._warnLevel;
    }
    static getArgs(args) {
        if (args.length < 1)
            return [];
        let pos = [];
        let isArray = Array.isArray(args[0]) || ArrayBuffer.isView(args[0]);
        if (typeof args[0] === 'number') {
            pos = Array.prototype.slice.call(args);
        }
        else if (typeof args[0] === 'object' && !isArray) {
            let a = ["x", "y", "z", "w"];
            let p = args[0];
            for (let i = 0; i < a.length; i++) {
                if ((p.length && i >= p.length) || !(a[i] in p))
                    break;
                pos.push(p[a[i]]);
            }
        }
        else if (isArray) {
            pos = [].slice.call(args[0]);
        }
        return pos;
    }
    static warn(message = "error", defaultReturn = undefined) {
        if (Util.warnLevel() == "error") {
            throw new Error(message);
        }
        else if (Util.warnLevel() == "warn") {
            console.warn(message);
        }
        return defaultReturn;
    }
    static randomInt(range, start = 0) {
        return Math.floor(Math.random() * range) + start;
    }
    static split(pts, size, stride, loopBack = false, matchSize = true) {
        let chunks = [];
        let part = [];
        let st = stride || size;
        let index = 0;
        if (pts.length <= 0 || st <= 0)
            return [];
        while (index < pts.length) {
            part = [];
            for (let k = 0; k < size; k++) {
                if (loopBack) {
                    part.push(pts[(index + k) % pts.length]);
                }
                else {
                    if (index + k >= pts.length)
                        break;
                    part.push(pts[index + k]);
                }
            }
            index += st;
            if (!matchSize || (matchSize && part.length === size))
                chunks.push(part);
        }
        return chunks;
    }
    static flatten(pts, flattenAsGroup = true) {
        let arr = (flattenAsGroup) ? new _Pt__WEBPACK_IMPORTED_MODULE_0__.Group() : new Array();
        return arr.concat.apply(arr, pts);
    }
    static combine(a, b, op) {
        let result = [];
        for (let i = 0, len = a.length; i < len; i++) {
            for (let k = 0, lenB = b.length; k < lenB; k++) {
                result.push(op(a[i], b[k]));
            }
        }
        return result;
    }
    static zip(arrays) {
        let z = [];
        for (let i = 0, len = arrays[0].length; i < len; i++) {
            let p = [];
            for (let k = 0; k < arrays.length; k++) {
                p.push(arrays[k][i]);
            }
            z.push(p);
        }
        return z;
    }
    static stepper(max, min = 0, stride = 1, callback) {
        let c = min;
        return function () {
            c += stride;
            if (c >= max) {
                c = min + (c - max);
            }
            if (callback)
                callback(c);
            return c;
        };
    }
    static forRange(fn, range, start = 0, step = 1) {
        let temp = [];
        for (let i = start, len = range; i < len; i += step) {
            temp[i] = fn(i);
        }
        return temp;
    }
    static load(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                callback(request.responseText, true);
            }
            else {
                callback(`Server error (${request.status}) when loading "${url}"`, false);
            }
        };
        request.onerror = function () {
            callback(`Unknown network error`, false);
        };
        request.send();
    }
    static performance(avgFrames = 10) {
        let last = Date.now();
        let avg = [];
        return function () {
            const now = Date.now();
            avg.push(now - last);
            if (avg.length >= avgFrames)
                avg.shift();
            last = now;
            return Math.floor(avg.reduce((a, b) => a + b, 0) / avg.length);
        };
    }
    static iterFromPtLike(list) {
        return Array.isArray(list) ? list[Symbol.iterator]() : list;
    }
    static iterFromPt(list) {
        return Array.isArray(list) ? list[Symbol.iterator]() : list;
    }
}
Util._warnLevel = "mute";
//# sourceMappingURL=Util.js.map

/***/ }),

/***/ "./node_modules/pts/dist/es2015/_module.js":
/*!*************************************************!*\
  !*** ./node_modules/pts/dist/es2015/_module.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CanvasForm": () => (/* reexport safe */ _Canvas__WEBPACK_IMPORTED_MODULE_0__.CanvasForm),
/* harmony export */   "CanvasSpace": () => (/* reexport safe */ _Canvas__WEBPACK_IMPORTED_MODULE_0__.CanvasSpace),
/* harmony export */   "Create": () => (/* reexport safe */ _Create__WEBPACK_IMPORTED_MODULE_1__.Create),
/* harmony export */   "Delaunay": () => (/* reexport safe */ _Create__WEBPACK_IMPORTED_MODULE_1__.Delaunay),
/* harmony export */   "Noise": () => (/* reexport safe */ _Create__WEBPACK_IMPORTED_MODULE_1__.Noise),
/* harmony export */   "Font": () => (/* reexport safe */ _Form__WEBPACK_IMPORTED_MODULE_2__.Font),
/* harmony export */   "Form": () => (/* reexport safe */ _Form__WEBPACK_IMPORTED_MODULE_2__.Form),
/* harmony export */   "VisualForm": () => (/* reexport safe */ _Form__WEBPACK_IMPORTED_MODULE_2__.VisualForm),
/* harmony export */   "Mat": () => (/* reexport safe */ _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Mat),
/* harmony export */   "Vec": () => (/* reexport safe */ _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__.Vec),
/* harmony export */   "Geom": () => (/* reexport safe */ _Num__WEBPACK_IMPORTED_MODULE_4__.Geom),
/* harmony export */   "Num": () => (/* reexport safe */ _Num__WEBPACK_IMPORTED_MODULE_4__.Num),
/* harmony export */   "Range": () => (/* reexport safe */ _Num__WEBPACK_IMPORTED_MODULE_4__.Range),
/* harmony export */   "Shaping": () => (/* reexport safe */ _Num__WEBPACK_IMPORTED_MODULE_4__.Shaping),
/* harmony export */   "Circle": () => (/* reexport safe */ _Op__WEBPACK_IMPORTED_MODULE_5__.Circle),
/* harmony export */   "Curve": () => (/* reexport safe */ _Op__WEBPACK_IMPORTED_MODULE_5__.Curve),
/* harmony export */   "Line": () => (/* reexport safe */ _Op__WEBPACK_IMPORTED_MODULE_5__.Line),
/* harmony export */   "Polygon": () => (/* reexport safe */ _Op__WEBPACK_IMPORTED_MODULE_5__.Polygon),
/* harmony export */   "Rectangle": () => (/* reexport safe */ _Op__WEBPACK_IMPORTED_MODULE_5__.Rectangle),
/* harmony export */   "Triangle": () => (/* reexport safe */ _Op__WEBPACK_IMPORTED_MODULE_5__.Triangle),
/* harmony export */   "Bound": () => (/* reexport safe */ _Pt__WEBPACK_IMPORTED_MODULE_6__.Bound),
/* harmony export */   "Group": () => (/* reexport safe */ _Pt__WEBPACK_IMPORTED_MODULE_6__.Group),
/* harmony export */   "Pt": () => (/* reexport safe */ _Pt__WEBPACK_IMPORTED_MODULE_6__.Pt),
/* harmony export */   "MultiTouchSpace": () => (/* reexport safe */ _Space__WEBPACK_IMPORTED_MODULE_7__.MultiTouchSpace),
/* harmony export */   "Space": () => (/* reexport safe */ _Space__WEBPACK_IMPORTED_MODULE_7__.Space),
/* harmony export */   "Color": () => (/* reexport safe */ _Color__WEBPACK_IMPORTED_MODULE_8__.Color),
/* harmony export */   "Const": () => (/* reexport safe */ _Util__WEBPACK_IMPORTED_MODULE_9__.Const),
/* harmony export */   "Util": () => (/* reexport safe */ _Util__WEBPACK_IMPORTED_MODULE_9__.Util),
/* harmony export */   "DOMSpace": () => (/* reexport safe */ _Dom__WEBPACK_IMPORTED_MODULE_10__.DOMSpace),
/* harmony export */   "HTMLForm": () => (/* reexport safe */ _Dom__WEBPACK_IMPORTED_MODULE_10__.HTMLForm),
/* harmony export */   "HTMLSpace": () => (/* reexport safe */ _Dom__WEBPACK_IMPORTED_MODULE_10__.HTMLSpace),
/* harmony export */   "SVGForm": () => (/* reexport safe */ _Svg__WEBPACK_IMPORTED_MODULE_11__.SVGForm),
/* harmony export */   "SVGSpace": () => (/* reexport safe */ _Svg__WEBPACK_IMPORTED_MODULE_11__.SVGSpace),
/* harmony export */   "Typography": () => (/* reexport safe */ _Typography__WEBPACK_IMPORTED_MODULE_12__.Typography),
/* harmony export */   "Body": () => (/* reexport safe */ _Physics__WEBPACK_IMPORTED_MODULE_13__.Body),
/* harmony export */   "Particle": () => (/* reexport safe */ _Physics__WEBPACK_IMPORTED_MODULE_13__.Particle),
/* harmony export */   "World": () => (/* reexport safe */ _Physics__WEBPACK_IMPORTED_MODULE_13__.World),
/* harmony export */   "Sound": () => (/* reexport safe */ _Play__WEBPACK_IMPORTED_MODULE_14__.Sound),
/* harmony export */   "Tempo": () => (/* reexport safe */ _Play__WEBPACK_IMPORTED_MODULE_14__.Tempo),
/* harmony export */   "UI": () => (/* reexport safe */ _UI__WEBPACK_IMPORTED_MODULE_15__.UI),
/* harmony export */   "UIButton": () => (/* reexport safe */ _UI__WEBPACK_IMPORTED_MODULE_15__.UIButton),
/* harmony export */   "UIDragger": () => (/* reexport safe */ _UI__WEBPACK_IMPORTED_MODULE_15__.UIDragger),
/* harmony export */   "UIPointerActions": () => (/* reexport safe */ _UI__WEBPACK_IMPORTED_MODULE_15__.UIPointerActions),
/* harmony export */   "UIShape": () => (/* reexport safe */ _UI__WEBPACK_IMPORTED_MODULE_15__.UIShape)
/* harmony export */ });
/* harmony import */ var _Canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Canvas */ "./node_modules/pts/dist/es2015/Canvas.js");
/* harmony import */ var _Create__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Create */ "./node_modules/pts/dist/es2015/Create.js");
/* harmony import */ var _Form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Form */ "./node_modules/pts/dist/es2015/Form.js");
/* harmony import */ var _LinearAlgebra__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LinearAlgebra */ "./node_modules/pts/dist/es2015/LinearAlgebra.js");
/* harmony import */ var _Num__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Num */ "./node_modules/pts/dist/es2015/Num.js");
/* harmony import */ var _Op__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Op */ "./node_modules/pts/dist/es2015/Op.js");
/* harmony import */ var _Pt__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Pt */ "./node_modules/pts/dist/es2015/Pt.js");
/* harmony import */ var _Space__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Space */ "./node_modules/pts/dist/es2015/Space.js");
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Color */ "./node_modules/pts/dist/es2015/Color.js");
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Util */ "./node_modules/pts/dist/es2015/Util.js");
/* harmony import */ var _Dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Dom */ "./node_modules/pts/dist/es2015/Dom.js");
/* harmony import */ var _Svg__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Svg */ "./node_modules/pts/dist/es2015/Svg.js");
/* harmony import */ var _Typography__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Typography */ "./node_modules/pts/dist/es2015/Typography.js");
/* harmony import */ var _Physics__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Physics */ "./node_modules/pts/dist/es2015/Physics.js");
/* harmony import */ var _Play__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Play */ "./node_modules/pts/dist/es2015/Play.js");
/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./UI */ "./node_modules/pts/dist/es2015/UI.js");
















//# sourceMappingURL=_module.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/canvas.js ***!
  \***********************/
const { Line } = __webpack_require__(/*! pts */ "./node_modules/pts/dist/es2015/_module.js");

(function() {

  Pts.namespace( this );
  var space = new CanvasSpace("#canvas").setup({bgcolor: "#1b242f", resize: true, retina: true});
  var form = space.getForm();


  //// Demo code ---

  var pts = new Group();
  var timeOutId = -1;
  var header = null;

  const angle = -(window.innerWidth * .05);
  const line = new Line(0, angle);


  space.add({ 

    // creatr 200 random points
    start:( bound ) => {
      pts = Create.distributeRandom( space.innerBound, 75 );
      header = document.getElementById("header");
    }, 

    animate: (time, ftime) => {
      // make a line and turn it into an "op" (see the guide on Op for more)
      
      pts.rotate2D( 0.0008, space.center );

      pts.forEach( (p, i) => {
        // for each point, find the perpendicular to the line
        
        
        
        form.fillOnly( ["#f03", "#09f", "#0c6"][i%3] ).point( p, 2, "circle" );
        form.stroke(`rgba(255,255,255, 0.3`, 2).line(Line.fromAngle(p, -45, 4000));
      });

      // header position
      if (header) {
        let top = window.pageYOffset || document.documentElement.scrollTop;
        let dp = top - space.size.y + 150;
        if (dp > 0) {
          header.style.top = `${dp * -1}px`;
        } else {
          header.style.top = "0px";
        }
      }

    },

    resize: () => {
      clearTimeout( timeOutId );
      setTimeout( () => {
        if (window.innerWidth >= 600) {
          pts = Create.distributeRandom( space.innerBound, 75 );
        } else {
          pts = Create.distributeRandom( space.innerBound, 30 );
        }
      }, 500 );
    }

  });

  space.bindMouse().bindTouch().play();

})();;
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvcHRzL2Rpc3QvZXMyMDE1L0NhbnZhcy5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvcHRzL2Rpc3QvZXMyMDE1L0NvbG9yLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy9wdHMvZGlzdC9lczIwMTUvQ3JlYXRlLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy9wdHMvZGlzdC9lczIwMTUvRG9tLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy9wdHMvZGlzdC9lczIwMTUvRm9ybS5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvcHRzL2Rpc3QvZXMyMDE1L0xpbmVhckFsZ2VicmEuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL3B0cy9kaXN0L2VzMjAxNS9OdW0uanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL3B0cy9kaXN0L2VzMjAxNS9PcC5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvcHRzL2Rpc3QvZXMyMDE1L1BoeXNpY3MuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL3B0cy9kaXN0L2VzMjAxNS9QbGF5LmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy9wdHMvZGlzdC9lczIwMTUvUHQuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL3B0cy9kaXN0L2VzMjAxNS9TcGFjZS5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvcHRzL2Rpc3QvZXMyMDE1L1N2Zy5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvcHRzL2Rpc3QvZXMyMDE1L1R5cG9ncmFwaHkuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL3B0cy9kaXN0L2VzMjAxNS9VSS5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvcHRzL2Rpc3QvZXMyMDE1L1V0aWwuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL3B0cy9kaXN0L2VzMjAxNS9fbW9kdWxlLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL215LXBvcnRmb2xpby93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL215LXBvcnRmb2xpby93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL215LXBvcnRmb2xpby8uL3NyYy9jYW52YXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDMEM7QUFDQTtBQUNGO0FBQ1Q7QUFDbUI7QUFDakI7QUFDMUIsMEJBQTBCLG1EQUFlO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFFBQVE7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFRLEdBQUcsUUFBUSxHQUFHLFFBQVEsR0FBRyxXQUFXO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7O0FDTkEsT0FBTyxPQUFPLEdBQUcsbUJBQU8sQ0FBQyxzREFBSzs7QUFFOUI7O0FBRUE7QUFDQSxnREFBZ0QsK0NBQStDO0FBQy9GOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0EsYTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxRQUFRO0FBQ3hDLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUEsR0FBRzs7QUFFSDs7QUFFQSxDQUFDLEsiLCJmaWxlIjoiY2FudmFzLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBTb3VyY2UgY29kZSBsaWNlbnNlZCB1bmRlciBBcGFjaGUgTGljZW5zZSAyLjAuIENvcHlyaWdodCDCqSAyMDE3LWN1cnJlbnQgV2lsbGlhbSBOZ2FuIGFuZCBjb250cmlidXRvcnMuIChodHRwczovL2dpdGh1Yi5jb20vd2lsbGlhbW5nYW4vcHRzKSAqL1xuaW1wb3J0IHsgTXVsdGlUb3VjaFNwYWNlIH0gZnJvbSAnLi9TcGFjZSc7XG5pbXBvcnQgeyBWaXN1YWxGb3JtLCBGb250IH0gZnJvbSBcIi4vRm9ybVwiO1xuaW1wb3J0IHsgUHQsIEdyb3VwLCBCb3VuZCB9IGZyb20gXCIuL1B0XCI7XG5pbXBvcnQgeyBDb25zdCB9IGZyb20gXCIuL1V0aWxcIjtcbmltcG9ydCB7IFR5cG9ncmFwaHkgYXMgVHlwbyB9IGZyb20gXCIuL1R5cG9ncmFwaHlcIjtcbmltcG9ydCB7IFJlY3RhbmdsZSB9IGZyb20gJy4vT3AnO1xuZXhwb3J0IGNsYXNzIENhbnZhc1NwYWNlIGV4dGVuZHMgTXVsdGlUb3VjaFNwYWNlIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtLCBjYWxsYmFjaykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9waXhlbFNjYWxlID0gMTtcbiAgICAgICAgdGhpcy5fYXV0b1Jlc2l6ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX2JnY29sb3IgPSBcIiNlMWU5ZjBcIjtcbiAgICAgICAgdGhpcy5fb2Zmc2NyZWVuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2luaXRpYWxSZXNpemUgPSBmYWxzZTtcbiAgICAgICAgdmFyIF9zZWxlY3RvciA9IG51bGw7XG4gICAgICAgIHZhciBfZXhpc3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlkID0gXCJwdFwiO1xuICAgICAgICBpZiAoZWxlbSBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgICAgIF9zZWxlY3RvciA9IGVsZW07XG4gICAgICAgICAgICB0aGlzLmlkID0gXCJwdHNfZXhpc3Rpbmdfc3BhY2VcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpZCA9IGVsZW07XG4gICAgICAgICAgICBpZCA9IChlbGVtWzBdID09PSBcIiNcIiB8fCBlbGVtWzBdID09PSBcIi5cIikgPyBlbGVtIDogXCIjXCIgKyBlbGVtO1xuICAgICAgICAgICAgX3NlbGVjdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZCk7XG4gICAgICAgICAgICBfZXhpc3RlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQuc3Vic3RyKDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghX3NlbGVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIgPSB0aGlzLl9jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHRoaXMuaWQgKyBcIl9jb250YWluZXJcIik7XG4gICAgICAgICAgICB0aGlzLl9jYW52YXMgPSB0aGlzLl9jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIsIHRoaXMuaWQpO1xuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX2NhbnZhcyk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX2NvbnRhaW5lcik7XG4gICAgICAgICAgICBfZXhpc3RlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9zZWxlY3Rvci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9IFwiY2FudmFzXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IF9zZWxlY3RvcjtcbiAgICAgICAgICAgIHRoaXMuX2NhbnZhcyA9IHRoaXMuX2NyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiwgdGhpcy5pZCArIFwiX2NhbnZhc1wiKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl9jYW52YXMpO1xuICAgICAgICAgICAgdGhpcy5faW5pdGlhbFJlc2l6ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jYW52YXMgPSBfc2VsZWN0b3I7XG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIgPSBfc2VsZWN0b3IucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIHRoaXMuX2F1dG9SZXNpemUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuX3JlYWR5LmJpbmQodGhpcywgY2FsbGJhY2spLCAxMDApO1xuICAgICAgICB0aGlzLl9jdHggPSB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB9XG4gICAgX2NyZWF0ZUVsZW1lbnQoZWxlbSA9IFwiZGl2XCIsIGlkKSB7XG4gICAgICAgIGxldCBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtKTtcbiAgICAgICAgZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBpZCk7XG4gICAgICAgIHJldHVybiBkO1xuICAgIH1cbiAgICBfcmVhZHkoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jb250YWluZXIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBpbml0aWF0ZSAjJHt0aGlzLmlkfSBlbGVtZW50YCk7XG4gICAgICAgIHRoaXMuX2lzUmVhZHkgPSB0cnVlO1xuICAgICAgICB0aGlzLl9yZXNpemVIYW5kbGVyKG51bGwpO1xuICAgICAgICB0aGlzLmNsZWFyKHRoaXMuX2JnY29sb3IpO1xuICAgICAgICB0aGlzLl9jYW52YXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJyZWFkeVwiKSk7XG4gICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy5wbGF5ZXJzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1trXS5zdGFydClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW2tdLnN0YXJ0KHRoaXMuYm91bmQuY2xvbmUoKSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcG9pbnRlciA9IHRoaXMuY2VudGVyO1xuICAgICAgICB0aGlzLl9pbml0aWFsUmVzaXplID0gZmFsc2U7XG4gICAgICAgIGlmIChjYWxsYmFjaylcbiAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMuYm91bmQsIHRoaXMuX2NhbnZhcyk7XG4gICAgfVxuICAgIHNldHVwKG9wdCkge1xuICAgICAgICBpZiAob3B0LmJnY29sb3IpXG4gICAgICAgICAgICB0aGlzLl9iZ2NvbG9yID0gb3B0LmJnY29sb3I7XG4gICAgICAgIHRoaXMuYXV0b1Jlc2l6ZSA9IChvcHQucmVzaXplICE9IHVuZGVmaW5lZCkgPyBvcHQucmVzaXplIDogZmFsc2U7XG4gICAgICAgIGlmIChvcHQucmV0aW5hICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgbGV0IHIxID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICAgICAgICAgIGxldCByMiA9IHRoaXMuX2N0eC53ZWJraXRCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8IHRoaXMuX2N0eC5tb3pCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8IHRoaXMuX2N0eC5tc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHwgdGhpcy5fY3R4Lm9CYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8IHRoaXMuX2N0eC5iYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8IDE7XG4gICAgICAgICAgICB0aGlzLl9waXhlbFNjYWxlID0gTWF0aC5tYXgoMSwgcjEgLyByMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdC5vZmZzY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuX29mZnNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9vZmZDYW52YXMgPSB0aGlzLl9jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIsIHRoaXMuaWQgKyBcIl9vZmZzY3JlZW5cIik7XG4gICAgICAgICAgICB0aGlzLl9vZmZDdHggPSB0aGlzLl9vZmZDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX29mZnNjcmVlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzZXQgYXV0b1Jlc2l6ZShhdXRvKSB7XG4gICAgICAgIHRoaXMuX2F1dG9SZXNpemUgPSBhdXRvO1xuICAgICAgICBpZiAoYXV0bykge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUhhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplSGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgYXV0b1Jlc2l6ZSgpIHsgcmV0dXJuIHRoaXMuX2F1dG9SZXNpemU7IH1cbiAgICByZXNpemUoYiwgZXZ0KSB7XG4gICAgICAgIHRoaXMuYm91bmQgPSBiO1xuICAgICAgICB0aGlzLl9jYW52YXMud2lkdGggPSB0aGlzLmJvdW5kLnNpemUueCAqIHRoaXMuX3BpeGVsU2NhbGU7XG4gICAgICAgIHRoaXMuX2NhbnZhcy5oZWlnaHQgPSB0aGlzLmJvdW5kLnNpemUueSAqIHRoaXMuX3BpeGVsU2NhbGU7XG4gICAgICAgIHRoaXMuX2NhbnZhcy5zdHlsZS53aWR0aCA9IE1hdGguZmxvb3IodGhpcy5ib3VuZC5zaXplLngpICsgXCJweFwiO1xuICAgICAgICB0aGlzLl9jYW52YXMuc3R5bGUuaGVpZ2h0ID0gTWF0aC5mbG9vcih0aGlzLmJvdW5kLnNpemUueSkgKyBcInB4XCI7XG4gICAgICAgIGlmICh0aGlzLl9vZmZzY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuX29mZkNhbnZhcy53aWR0aCA9IHRoaXMuYm91bmQuc2l6ZS54ICogdGhpcy5fcGl4ZWxTY2FsZTtcbiAgICAgICAgICAgIHRoaXMuX29mZkNhbnZhcy5oZWlnaHQgPSB0aGlzLmJvdW5kLnNpemUueSAqIHRoaXMuX3BpeGVsU2NhbGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3BpeGVsU2NhbGUgIT0gMSkge1xuICAgICAgICAgICAgdGhpcy5fY3R4LnNjYWxlKHRoaXMuX3BpeGVsU2NhbGUsIHRoaXMuX3BpeGVsU2NhbGUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX29mZnNjcmVlbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX29mZkN0eC5zY2FsZSh0aGlzLl9waXhlbFNjYWxlLCB0aGlzLl9waXhlbFNjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBrIGluIHRoaXMucGxheWVycykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVycy5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgIGxldCBwID0gdGhpcy5wbGF5ZXJzW2tdO1xuICAgICAgICAgICAgICAgIGlmIChwLnJlc2l6ZSlcbiAgICAgICAgICAgICAgICAgICAgcC5yZXNpemUodGhpcy5ib3VuZCwgZXZ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlcih0aGlzLl9jdHgpO1xuICAgICAgICBpZiAoZXZ0ICYmICF0aGlzLmlzUGxheWluZylcbiAgICAgICAgICAgIHRoaXMucGxheU9uY2UoMCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBfcmVzaXplSGFuZGxlcihldnQpIHtcbiAgICAgICAgbGV0IGIgPSAodGhpcy5fYXV0b1Jlc2l6ZSB8fCB0aGlzLl9pbml0aWFsUmVzaXplKSA/IHRoaXMuX2NvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSA6IHRoaXMuX2NhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKGIpIHtcbiAgICAgICAgICAgIGxldCBib3ggPSBCb3VuZC5mcm9tQm91bmRpbmdSZWN0KGIpO1xuICAgICAgICAgICAgYm94LmNlbnRlciA9IGJveC5jZW50ZXIuYWRkKHdpbmRvdy5wYWdlWE9mZnNldCwgd2luZG93LnBhZ2VZT2Zmc2V0KTtcbiAgICAgICAgICAgIHRoaXMucmVzaXplKGJveCwgZXZ0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXQgYmFja2dyb3VuZChiZykgeyB0aGlzLl9iZ2NvbG9yID0gYmc7IH1cbiAgICBnZXQgYmFja2dyb3VuZCgpIHsgcmV0dXJuIHRoaXMuX2JnY29sb3I7IH1cbiAgICBnZXQgcGl4ZWxTY2FsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BpeGVsU2NhbGU7XG4gICAgfVxuICAgIGdldCBoYXNPZmZzY3JlZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzY3JlZW47XG4gICAgfVxuICAgIGdldCBvZmZzY3JlZW5DdHgoKSB7IHJldHVybiB0aGlzLl9vZmZDdHg7IH1cbiAgICBnZXQgb2Zmc2NyZWVuQ2FudmFzKCkgeyByZXR1cm4gdGhpcy5fb2ZmQ2FudmFzOyB9XG4gICAgZ2V0Rm9ybSgpIHsgcmV0dXJuIG5ldyBDYW52YXNGb3JtKHRoaXMpOyB9XG4gICAgZ2V0IGVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYW52YXM7XG4gICAgfVxuICAgIGdldCBwYXJlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb250YWluZXI7XG4gICAgfVxuICAgIGdldCByZWFkeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzUmVhZHk7XG4gICAgfVxuICAgIGdldCBjdHgoKSB7IHJldHVybiB0aGlzLl9jdHg7IH1cbiAgICBjbGVhcihiZykge1xuICAgICAgICBpZiAoYmcpXG4gICAgICAgICAgICB0aGlzLl9iZ2NvbG9yID0gYmc7XG4gICAgICAgIGxldCBsYXN0Q29sb3IgPSB0aGlzLl9jdHguZmlsbFN0eWxlO1xuICAgICAgICBpZiAodGhpcy5fYmdjb2xvciAmJiB0aGlzLl9iZ2NvbG9yICE9IFwidHJhbnNwYXJlbnRcIikge1xuICAgICAgICAgICAgdGhpcy5fY3R4LmZpbGxTdHlsZSA9IHRoaXMuX2JnY29sb3I7XG4gICAgICAgICAgICB0aGlzLl9jdHguZmlsbFJlY3QoLTEsIC0xLCB0aGlzLl9jYW52YXMud2lkdGggKyAxLCB0aGlzLl9jYW52YXMuaGVpZ2h0ICsgMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jdHguY2xlYXJSZWN0KC0xLCAtMSwgdGhpcy5fY2FudmFzLndpZHRoICsgMSwgdGhpcy5fY2FudmFzLmhlaWdodCArIDEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2N0eC5maWxsU3R5bGUgPSBsYXN0Q29sb3I7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBjbGVhck9mZnNjcmVlbihiZykge1xuICAgICAgICBpZiAodGhpcy5fb2Zmc2NyZWVuKSB7XG4gICAgICAgICAgICBpZiAoYmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vZmZDdHguZmlsbFN0eWxlID0gYmc7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2ZmQ3R4LmZpbGxSZWN0KC0xLCAtMSwgdGhpcy5fY2FudmFzLndpZHRoICsgMSwgdGhpcy5fY2FudmFzLmhlaWdodCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2ZmQ3R4LmNsZWFyUmVjdCgtMSwgLTEsIHRoaXMuX29mZkNhbnZhcy53aWR0aCArIDEsIHRoaXMuX29mZkNhbnZhcy5oZWlnaHQgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcGxheUl0ZW1zKHRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzUmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zYXZlKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fb2Zmc2NyZWVuKVxuICAgICAgICAgICAgICAgIHRoaXMuX29mZkN0eC5zYXZlKCk7XG4gICAgICAgICAgICBzdXBlci5wbGF5SXRlbXModGltZSk7XG4gICAgICAgICAgICB0aGlzLl9jdHgucmVzdG9yZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX29mZnNjcmVlbilcbiAgICAgICAgICAgICAgICB0aGlzLl9vZmZDdHgucmVzdG9yZSgpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIodGhpcy5fY3R4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBkaXNwb3NlKCkge1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplSGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlQWxsKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBDYW52YXNGb3JtIGV4dGVuZHMgVmlzdWFsRm9ybSB7XG4gICAgY29uc3RydWN0b3Ioc3BhY2UpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fc3R5bGUgPSB7XG4gICAgICAgICAgICBmaWxsU3R5bGU6IFwiI2YwM1wiLCBzdHJva2VTdHlsZTogXCIjZmZmXCIsXG4gICAgICAgICAgICBsaW5lV2lkdGg6IDEsIGxpbmVKb2luOiBcImJldmVsXCIsIGxpbmVDYXA6IFwiYnV0dFwiLFxuICAgICAgICAgICAgZ2xvYmFsQWxwaGE6IDFcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fc3BhY2UgPSBzcGFjZTtcbiAgICAgICAgdGhpcy5fc3BhY2UuYWRkKHsgc3RhcnQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdHggPSB0aGlzLl9zcGFjZS5jdHg7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3R4LmZpbGxTdHlsZSA9IHRoaXMuX3N0eWxlLmZpbGxTdHlsZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLl9zdHlsZS5zdHJva2VTdHlsZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdHgubGluZUpvaW4gPSBcImJldmVsXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3R4LmZvbnQgPSB0aGlzLl9mb250LnZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gfSk7XG4gICAgfVxuICAgIGdldCBzcGFjZSgpIHsgcmV0dXJuIHRoaXMuX3NwYWNlOyB9XG4gICAgZ2V0IGN0eCgpIHsgcmV0dXJuIHRoaXMuX3NwYWNlLmN0eDsgfVxuICAgIHVzZU9mZnNjcmVlbihvZmYgPSB0cnVlLCBjbGVhciA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChjbGVhcilcbiAgICAgICAgICAgIHRoaXMuX3NwYWNlLmNsZWFyT2Zmc2NyZWVuKCh0eXBlb2YgY2xlYXIgPT0gXCJzdHJpbmdcIikgPyBjbGVhciA6IG51bGwpO1xuICAgICAgICB0aGlzLl9jdHggPSAodGhpcy5fc3BhY2UuaGFzT2Zmc2NyZWVuICYmIG9mZikgPyB0aGlzLl9zcGFjZS5vZmZzY3JlZW5DdHggOiB0aGlzLl9zcGFjZS5jdHg7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW5kZXJPZmZzY3JlZW4ob2Zmc2V0ID0gWzAsIDBdKSB7XG4gICAgICAgIGlmICh0aGlzLl9zcGFjZS5oYXNPZmZzY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuX3NwYWNlLmN0eC5kcmF3SW1hZ2UodGhpcy5fc3BhY2Uub2Zmc2NyZWVuQ2FudmFzLCBvZmZzZXRbMF0sIG9mZnNldFsxXSwgdGhpcy5fc3BhY2Uud2lkdGgsIHRoaXMuX3NwYWNlLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWxwaGEoYSkge1xuICAgICAgICB0aGlzLl9jdHguZ2xvYmFsQWxwaGEgPSBhO1xuICAgICAgICB0aGlzLl9zdHlsZS5nbG9iYWxBbHBoYSA9IGE7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBmaWxsKGMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjID09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICB0aGlzLmZpbGxlZCA9IGM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZpbGxlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9zdHlsZS5maWxsU3R5bGUgPSBjO1xuICAgICAgICAgICAgdGhpcy5fY3R4LmZpbGxTdHlsZSA9IGM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0cm9rZShjLCB3aWR0aCwgbGluZWpvaW4sIGxpbmVjYXApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjID09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICB0aGlzLnN0cm9rZWQgPSBjO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdHJva2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3N0eWxlLnN0cm9rZVN0eWxlID0gYztcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VTdHlsZSA9IGM7XG4gICAgICAgICAgICBpZiAod2lkdGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdHgubGluZVdpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3R5bGUubGluZVdpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGluZWpvaW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdHgubGluZUpvaW4gPSBsaW5lam9pbjtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdHlsZS5saW5lSm9pbiA9IGxpbmVqb2luO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpbmVjYXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdHgubGluZUNhcCA9IGxpbmVjYXA7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3R5bGUubGluZUNhcCA9IGxpbmVjYXA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGdyYWRpZW50KHN0b3BzKSB7XG4gICAgICAgIGxldCB2YWxzID0gW107XG4gICAgICAgIGlmIChzdG9wcy5sZW5ndGggPCAyKVxuICAgICAgICAgICAgc3RvcHMucHVzaChbMC45OSwgXCIjMDAwXCJdLCBbMSwgXCIjMDAwXCJdKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHN0b3BzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdCA9IHR5cGVvZiBzdG9wc1tpXSA9PT0gJ3N0cmluZycgPyBpICogKDEgLyAoc3RvcHMubGVuZ3RoIC0gMSkpIDogc3RvcHNbaV1bMF07XG4gICAgICAgICAgICBsZXQgdiA9IHR5cGVvZiBzdG9wc1tpXSA9PT0gJ3N0cmluZycgPyBzdG9wc1tpXSA6IHN0b3BzW2ldWzFdO1xuICAgICAgICAgICAgdmFscy5wdXNoKFt0LCB2XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChhcmVhMSwgYXJlYTIpID0+IHtcbiAgICAgICAgICAgIGFyZWExID0gYXJlYTEubWFwKGEgPT4gYS5hYnMoKSk7XG4gICAgICAgICAgICBpZiAoYXJlYTIpXG4gICAgICAgICAgICAgICAgYXJlYTIubWFwKGEgPT4gYS5hYnMoKSk7XG4gICAgICAgICAgICBsZXQgZ3JhZCA9IGFyZWEyXG4gICAgICAgICAgICAgICAgPyB0aGlzLmN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudChhcmVhMVswXVswXSwgYXJlYTFbMF1bMV0sIGFyZWExWzFdWzBdLCBhcmVhMlswXVswXSwgYXJlYTJbMF1bMV0sIGFyZWEyWzFdWzBdKVxuICAgICAgICAgICAgICAgIDogdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoYXJlYTFbMF1bMF0sIGFyZWExWzBdWzFdLCBhcmVhMVsxXVswXSwgYXJlYTFbMV1bMV0pO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHZhbHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCh2YWxzW2ldWzBdLCB2YWxzW2ldWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBncmFkO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBjb21wb3NpdGUobW9kZSA9ICdzb3VyY2Utb3ZlcicpIHtcbiAgICAgICAgdGhpcy5jdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gbW9kZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNsaXAoKSB7XG4gICAgICAgIHRoaXMuY3R4LmNsaXAoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhc2goc2VnbWVudHMgPSB0cnVlLCBvZmZzZXQgPSAwKSB7XG4gICAgICAgIGlmICghc2VnbWVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zZXRMaW5lRGFzaChbXSk7XG4gICAgICAgICAgICB0aGlzLl9jdHgubGluZURhc2hPZmZzZXQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlZ21lbnRzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudHMgPSBbNSwgNV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jdHguc2V0TGluZURhc2goW3NlZ21lbnRzWzBdLCBzZWdtZW50c1sxXV0pO1xuICAgICAgICAgICAgdGhpcy5fY3R4LmxpbmVEYXNoT2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBmb250KHNpemVPckZvbnQsIHdlaWdodCwgc3R5bGUsIGxpbmVIZWlnaHQsIGZhbWlseSkge1xuICAgICAgICBpZiAodHlwZW9mIHNpemVPckZvbnQgPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhpcy5fZm9udC5zaXplID0gc2l6ZU9yRm9udDtcbiAgICAgICAgICAgIGlmIChmYW1pbHkpXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udC5mYWNlID0gZmFtaWx5O1xuICAgICAgICAgICAgaWYgKHdlaWdodClcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250LndlaWdodCA9IHdlaWdodDtcbiAgICAgICAgICAgIGlmIChzdHlsZSlcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250LnN0eWxlID0gc3R5bGU7XG4gICAgICAgICAgICBpZiAobGluZUhlaWdodClcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250LmxpbmVIZWlnaHQgPSBsaW5lSGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZm9udCA9IHNpemVPckZvbnQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3R4LmZvbnQgPSB0aGlzLl9mb250LnZhbHVlO1xuICAgICAgICBpZiAodGhpcy5fZXN0aW1hdGVUZXh0V2lkdGgpXG4gICAgICAgICAgICB0aGlzLmZvbnRXaWR0aEVzdGltYXRlKHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZm9udFdpZHRoRXN0aW1hdGUoZXN0aW1hdGUgPSB0cnVlKSB7XG4gICAgICAgIHRoaXMuX2VzdGltYXRlVGV4dFdpZHRoID0gKGVzdGltYXRlKSA/IFR5cG8udGV4dFdpZHRoRXN0aW1hdG9yKCgoYykgPT4gdGhpcy5fY3R4Lm1lYXN1cmVUZXh0KGMpLndpZHRoKSkgOiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBnZXRUZXh0V2lkdGgoYykge1xuICAgICAgICByZXR1cm4gKCF0aGlzLl9lc3RpbWF0ZVRleHRXaWR0aCkgPyB0aGlzLl9jdHgubWVhc3VyZVRleHQoYyArIFwiIC5cIikud2lkdGggOiB0aGlzLl9lc3RpbWF0ZVRleHRXaWR0aChjKTtcbiAgICB9XG4gICAgX3RleHRUcnVuY2F0ZShzdHIsIHdpZHRoLCB0YWlsID0gXCJcIikge1xuICAgICAgICByZXR1cm4gVHlwby50cnVuY2F0ZSh0aGlzLmdldFRleHRXaWR0aC5iaW5kKHRoaXMpLCBzdHIsIHdpZHRoLCB0YWlsKTtcbiAgICB9XG4gICAgX3RleHRBbGlnbihib3gsIHZlcnRpY2FsLCBvZmZzZXQsIGNlbnRlcikge1xuICAgICAgICBpZiAoIWNlbnRlcilcbiAgICAgICAgICAgIGNlbnRlciA9IFJlY3RhbmdsZS5jZW50ZXIoYm94KTtcbiAgICAgICAgdmFyIHB4ID0gYm94WzBdWzBdO1xuICAgICAgICBpZiAodGhpcy5fY3R4LnRleHRBbGlnbiA9PSBcImVuZFwiIHx8IHRoaXMuX2N0eC50ZXh0QWxpZ24gPT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICBweCA9IGJveFsxXVswXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9jdHgudGV4dEFsaWduID09IFwiY2VudGVyXCIgfHwgdGhpcy5fY3R4LnRleHRBbGlnbiA9PSBcIm1pZGRsZVwiKSB7XG4gICAgICAgICAgICBweCA9IGNlbnRlclswXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHkgPSBjZW50ZXJbMV07XG4gICAgICAgIGlmICh2ZXJ0aWNhbCA9PSBcInRvcFwiIHx8IHZlcnRpY2FsID09IFwic3RhcnRcIikge1xuICAgICAgICAgICAgcHkgPSBib3hbMF1bMV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmVydGljYWwgPT0gXCJlbmRcIiB8fCB2ZXJ0aWNhbCA9PSBcImJvdHRvbVwiKSB7XG4gICAgICAgICAgICBweSA9IGJveFsxXVsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKG9mZnNldCkgPyBuZXcgUHQocHggKyBvZmZzZXRbMF0sIHB5ICsgb2Zmc2V0WzFdKSA6IG5ldyBQdChweCwgcHkpO1xuICAgIH1cbiAgICByZXNldCgpIHtcbiAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLl9zdHlsZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0eWxlLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3R4W2tdID0gdGhpcy5fc3R5bGVba107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZm9udCA9IG5ldyBGb250KCk7XG4gICAgICAgIHRoaXMuX2N0eC5mb250ID0gdGhpcy5fZm9udC52YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIF9wYWludCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ZpbGxlZClcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsKCk7XG4gICAgICAgIGlmICh0aGlzLl9zdHJva2VkKVxuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBwb2ludChwLCByYWRpdXMgPSA1LCBzaGFwZSA9IFwic3F1YXJlXCIpIHtcbiAgICAgICAgaWYgKCFwKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAoIUNhbnZhc0Zvcm1bc2hhcGVdKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3NoYXBlfSBpcyBub3QgYSBzdGF0aWMgZnVuY3Rpb24gb2YgQ2FudmFzRm9ybWApO1xuICAgICAgICBDYW52YXNGb3JtW3NoYXBlXSh0aGlzLl9jdHgsIHAsIHJhZGl1cyk7XG4gICAgICAgIHRoaXMuX3BhaW50KCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzdGF0aWMgY2lyY2xlKGN0eCwgcHQsIHJhZGl1cyA9IDEwKSB7XG4gICAgICAgIGlmICghcHQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYyhwdFswXSwgcHRbMV0sIHJhZGl1cywgMCwgQ29uc3QudHdvX3BpLCBmYWxzZSk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICB9XG4gICAgY2lyY2xlKHB0cykge1xuICAgICAgICBDYW52YXNGb3JtLmNpcmNsZSh0aGlzLl9jdHgsIHB0c1swXSwgcHRzWzFdWzBdKTtcbiAgICAgICAgdGhpcy5fcGFpbnQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0YXRpYyBlbGxpcHNlKGN0eCwgcHQsIHJhZGl1cywgcm90YXRpb24gPSAwLCBzdGFydEFuZ2xlID0gMCwgZW5kQW5nbGUgPSBDb25zdC50d29fcGksIGNjID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCFwdCB8fCAhcmFkaXVzKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5lbGxpcHNlKHB0WzBdLCBwdFsxXSwgcmFkaXVzWzBdLCByYWRpdXNbMV0sIHJvdGF0aW9uLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgY2MpO1xuICAgIH1cbiAgICBlbGxpcHNlKHB0LCByYWRpdXMsIHJvdGF0aW9uID0gMCwgc3RhcnRBbmdsZSA9IDAsIGVuZEFuZ2xlID0gQ29uc3QudHdvX3BpLCBjYyA9IGZhbHNlKSB7XG4gICAgICAgIENhbnZhc0Zvcm0uZWxsaXBzZSh0aGlzLl9jdHgsIHB0LCByYWRpdXMsIHJvdGF0aW9uLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgY2MpO1xuICAgICAgICB0aGlzLl9wYWludCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhdGljIGFyYyhjdHgsIHB0LCByYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBjYykge1xuICAgICAgICBpZiAoIXB0KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmMocHRbMF0sIHB0WzFdLCByYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBjYyk7XG4gICAgfVxuICAgIGFyYyhwdCwgcmFkaXVzLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgY2MpIHtcbiAgICAgICAgQ2FudmFzRm9ybS5hcmModGhpcy5fY3R4LCBwdCwgcmFkaXVzLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgY2MpO1xuICAgICAgICB0aGlzLl9wYWludCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhdGljIHNxdWFyZShjdHgsIHB0LCBoYWxmc2l6ZSkge1xuICAgICAgICBpZiAoIXB0KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsZXQgeDEgPSBwdFswXSAtIGhhbGZzaXplO1xuICAgICAgICBsZXQgeTEgPSBwdFsxXSAtIGhhbGZzaXplO1xuICAgICAgICBsZXQgeDIgPSBwdFswXSArIGhhbGZzaXplO1xuICAgICAgICBsZXQgeTIgPSBwdFsxXSArIGhhbGZzaXplO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5tb3ZlVG8oeDEsIHkxKTtcbiAgICAgICAgY3R4LmxpbmVUbyh4MSwgeTIpO1xuICAgICAgICBjdHgubGluZVRvKHgyLCB5Mik7XG4gICAgICAgIGN0eC5saW5lVG8oeDIsIHkxKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIH1cbiAgICBzcXVhcmUocHQsIGhhbGZzaXplKSB7XG4gICAgICAgIENhbnZhc0Zvcm0uc3F1YXJlKHRoaXMuX2N0eCwgcHQsIGhhbGZzaXplKTtcbiAgICAgICAgdGhpcy5fcGFpbnQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0YXRpYyBsaW5lKGN0eCwgcHRzKSB7XG4gICAgICAgIGlmIChwdHMubGVuZ3RoIDwgMilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKHB0c1swXVswXSwgcHRzWzBdWzFdKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDEsIGxlbiA9IHB0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKHB0c1tpXSlcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHB0c1tpXVswXSwgcHRzW2ldWzFdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsaW5lKHB0cykge1xuICAgICAgICBDYW52YXNGb3JtLmxpbmUodGhpcy5fY3R4LCBwdHMpO1xuICAgICAgICB0aGlzLl9wYWludCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhdGljIHBvbHlnb24oY3R4LCBwdHMpIHtcbiAgICAgICAgaWYgKHB0cy5sZW5ndGggPCAyKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5tb3ZlVG8ocHRzWzBdWzBdLCBwdHNbMF1bMV0pO1xuICAgICAgICBmb3IgKGxldCBpID0gMSwgbGVuID0gcHRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocHRzW2ldKVxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8ocHRzW2ldWzBdLCBwdHNbaV1bMV0pO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICB9XG4gICAgcG9seWdvbihwdHMpIHtcbiAgICAgICAgQ2FudmFzRm9ybS5wb2x5Z29uKHRoaXMuX2N0eCwgcHRzKTtcbiAgICAgICAgdGhpcy5fcGFpbnQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0YXRpYyByZWN0KGN0eCwgcHRzKSB7XG4gICAgICAgIGlmIChwdHMubGVuZ3RoIDwgMilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKHB0c1swXVswXSwgcHRzWzBdWzFdKTtcbiAgICAgICAgY3R4LmxpbmVUbyhwdHNbMF1bMF0sIHB0c1sxXVsxXSk7XG4gICAgICAgIGN0eC5saW5lVG8ocHRzWzFdWzBdLCBwdHNbMV1bMV0pO1xuICAgICAgICBjdHgubGluZVRvKHB0c1sxXVswXSwgcHRzWzBdWzFdKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIH1cbiAgICByZWN0KHB0cykge1xuICAgICAgICBDYW52YXNGb3JtLnJlY3QodGhpcy5fY3R4LCBwdHMpO1xuICAgICAgICB0aGlzLl9wYWludCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhdGljIGltYWdlKGN0eCwgaW1nLCB0YXJnZXQgPSBuZXcgUHQoKSwgb3JpZykge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldFswXSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIHRhcmdldFswXSwgdGFyZ2V0WzFdKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0ID0gdGFyZ2V0O1xuICAgICAgICAgICAgaWYgKG9yaWcpIHtcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgb3JpZ1swXVswXSwgb3JpZ1swXVsxXSwgb3JpZ1sxXVswXSAtIG9yaWdbMF1bMF0sIG9yaWdbMV1bMV0gLSBvcmlnWzBdWzFdLCB0WzBdWzBdLCB0WzBdWzFdLCB0WzFdWzBdIC0gdFswXVswXSwgdFsxXVsxXSAtIHRbMF1bMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIHRbMF1bMF0sIHRbMF1bMV0sIHRbMV1bMF0gLSB0WzBdWzBdLCB0WzFdWzFdIC0gdFswXVsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW1hZ2UoaW1nLCB0YXJnZXQsIG9yaWdpbmFsKSB7XG4gICAgICAgIENhbnZhc0Zvcm0uaW1hZ2UodGhpcy5fY3R4LCBpbWcsIHRhcmdldCwgb3JpZ2luYWwpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhdGljIHRleHQoY3R4LCBwdCwgdHh0LCBtYXhXaWR0aCkge1xuICAgICAgICBpZiAoIXB0KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjdHguZmlsbFRleHQodHh0LCBwdFswXSwgcHRbMV0sIG1heFdpZHRoKTtcbiAgICB9XG4gICAgdGV4dChwdCwgdHh0LCBtYXhXaWR0aCkge1xuICAgICAgICBDYW52YXNGb3JtLnRleHQodGhpcy5fY3R4LCBwdCwgdHh0LCBtYXhXaWR0aCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0ZXh0Qm94KGJveCwgdHh0LCB2ZXJ0aWNhbEFsaWduID0gXCJtaWRkbGVcIiwgdGFpbCA9IFwiXCIsIG92ZXJyaWRlQmFzZWxpbmUgPSB0cnVlKSB7XG4gICAgICAgIGlmIChvdmVycmlkZUJhc2VsaW5lKVxuICAgICAgICAgICAgdGhpcy5fY3R4LnRleHRCYXNlbGluZSA9IHZlcnRpY2FsQWxpZ247XG4gICAgICAgIGxldCBzaXplID0gUmVjdGFuZ2xlLnNpemUoYm94KTtcbiAgICAgICAgbGV0IHQgPSB0aGlzLl90ZXh0VHJ1bmNhdGUodHh0LCBzaXplWzBdLCB0YWlsKTtcbiAgICAgICAgdGhpcy50ZXh0KHRoaXMuX3RleHRBbGlnbihib3gsIHZlcnRpY2FsQWxpZ24pLCB0WzBdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHBhcmFncmFwaEJveChib3gsIHR4dCwgbGluZUhlaWdodCA9IDEuMiwgdmVydGljYWxBbGlnbiA9IFwidG9wXCIsIGNyb3AgPSB0cnVlKSB7XG4gICAgICAgIGxldCBzaXplID0gUmVjdGFuZ2xlLnNpemUoYm94KTtcbiAgICAgICAgdGhpcy5fY3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XG4gICAgICAgIGxldCBsc3RlcCA9IHRoaXMuX2ZvbnQuc2l6ZSAqIGxpbmVIZWlnaHQ7XG4gICAgICAgIGxldCBuZXh0TGluZSA9IChzdWIsIGJ1ZmZlciA9IFtdLCBjYyA9IDApID0+IHtcbiAgICAgICAgICAgIGlmICghc3ViKVxuICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICAgICAgICBpZiAoY3JvcCAmJiBjYyAqIGxzdGVwID4gc2l6ZVsxXSAtIGxzdGVwICogMilcbiAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgICAgICAgICAgaWYgKGNjID4gMTAwMDApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibWF4IHJlY3Vyc2lvbiByZWFjaGVkICgxMDAwMClcIik7XG4gICAgICAgICAgICBsZXQgdCA9IHRoaXMuX3RleHRUcnVuY2F0ZShzdWIsIHNpemVbMF0sIFwiXCIpO1xuICAgICAgICAgICAgbGV0IG5ld2xuID0gdFswXS5pbmRleE9mKFwiXFxuXCIpO1xuICAgICAgICAgICAgaWYgKG5ld2xuID49IDApIHtcbiAgICAgICAgICAgICAgICBidWZmZXIucHVzaCh0WzBdLnN1YnN0cigwLCBuZXdsbikpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0TGluZShzdWIuc3Vic3RyKG5ld2xuICsgMSksIGJ1ZmZlciwgY2MgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBkdCA9IHRbMF0ubGFzdEluZGV4T2YoXCIgXCIpICsgMTtcbiAgICAgICAgICAgIGlmIChkdCA8PSAwIHx8IHRbMV0gPT09IHN1Yi5sZW5ndGgpXG4gICAgICAgICAgICAgICAgZHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBsZXQgbGluZSA9IHRbMF0uc3Vic3RyKDAsIGR0KTtcbiAgICAgICAgICAgIGJ1ZmZlci5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgcmV0dXJuICh0WzFdIDw9IDAgfHwgdFsxXSA9PT0gc3ViLmxlbmd0aCkgPyBidWZmZXIgOiBuZXh0TGluZShzdWIuc3Vic3RyKChkdCB8fCB0WzFdKSksIGJ1ZmZlciwgY2MgKyAxKTtcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGxpbmVzID0gbmV4dExpbmUodHh0KTtcbiAgICAgICAgbGV0IGxzaXplID0gbGluZXMubGVuZ3RoICogbHN0ZXA7XG4gICAgICAgIGxldCBsYm94ID0gYm94O1xuICAgICAgICBpZiAodmVydGljYWxBbGlnbiA9PSBcIm1pZGRsZVwiIHx8IHZlcnRpY2FsQWxpZ24gPT0gXCJjZW50ZXJcIikge1xuICAgICAgICAgICAgbGV0IGxwYWQgPSAoc2l6ZVsxXSAtIGxzaXplKSAvIDI7XG4gICAgICAgICAgICBpZiAoY3JvcClcbiAgICAgICAgICAgICAgICBscGFkID0gTWF0aC5tYXgoMCwgbHBhZCk7XG4gICAgICAgICAgICBsYm94ID0gbmV3IEdyb3VwKGJveFswXS4kYWRkKDAsIGxwYWQpLCBib3hbMV0uJHN1YnRyYWN0KDAsIGxwYWQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2ZXJ0aWNhbEFsaWduID09IFwiYm90dG9tXCIpIHtcbiAgICAgICAgICAgIGxib3ggPSBuZXcgR3JvdXAoYm94WzBdLiRhZGQoMCwgc2l6ZVsxXSAtIGxzaXplKSwgYm94WzFdKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxib3ggPSBuZXcgR3JvdXAoYm94WzBdLCBib3hbMF0uJGFkZChzaXplWzBdLCBsc2l6ZSkpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjZW50ZXIgPSBSZWN0YW5nbGUuY2VudGVyKGxib3gpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMudGV4dCh0aGlzLl90ZXh0QWxpZ24obGJveCwgXCJ0b3BcIiwgWzAsIGkgKiBsc3RlcF0sIGNlbnRlciksIGxpbmVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgYWxpZ25UZXh0KGFsaWdubWVudCA9IFwibGVmdFwiLCBiYXNlbGluZSA9IFwiYWxwaGFiZXRpY1wiKSB7XG4gICAgICAgIGlmIChiYXNlbGluZSA9PSBcImNlbnRlclwiKVxuICAgICAgICAgICAgYmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuICAgICAgICBpZiAoYmFzZWxpbmUgPT0gXCJiYXNlbGluZVwiKVxuICAgICAgICAgICAgYmFzZWxpbmUgPSBcImFscGhhYmV0aWNcIjtcbiAgICAgICAgdGhpcy5fY3R4LnRleHRBbGlnbiA9IGFsaWdubWVudDtcbiAgICAgICAgdGhpcy5fY3R4LnRleHRCYXNlbGluZSA9IGJhc2VsaW5lO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgbG9nKHR4dCkge1xuICAgICAgICBsZXQgdyA9IHRoaXMuX2N0eC5tZWFzdXJlVGV4dCh0eHQpLndpZHRoICsgMjA7XG4gICAgICAgIHRoaXMuc3Ryb2tlKGZhbHNlKS5maWxsKFwicmdiYSgwLDAsMCwuNClcIikucmVjdChbWzAsIDBdLCBbdywgMjBdXSk7XG4gICAgICAgIHRoaXMuZmlsbChcIiNmZmZcIikudGV4dChbMTAsIDE0XSwgdHh0KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q2FudmFzLmpzLm1hcCIsIi8qISBTb3VyY2UgY29kZSBsaWNlbnNlZCB1bmRlciBBcGFjaGUgTGljZW5zZSAyLjAuIENvcHlyaWdodCDCqSAyMDE3LWN1cnJlbnQgV2lsbGlhbSBOZ2FuIGFuZCBjb250cmlidXRvcnMuIChodHRwczovL2dpdGh1Yi5jb20vd2lsbGlhbW5nYW4vcHRzKSAqL1xuaW1wb3J0IHsgUHQsIEdyb3VwIH0gZnJvbSBcIi4vUHRcIjtcbmltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi9VdGlsXCI7XG5pbXBvcnQgeyBOdW0sIEdlb20gfSBmcm9tIFwiLi9OdW1cIjtcbmV4cG9ydCBjbGFzcyBDb2xvciBleHRlbmRzIFB0IHtcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICB0aGlzLl9tb2RlID0gXCJyZ2JcIjtcbiAgICAgICAgdGhpcy5faXNOb3JtID0gZmFsc2U7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tKC4uLmFyZ3MpIHtcbiAgICAgICAgbGV0IHAgPSBbMSwgMSwgMSwgMV07XG4gICAgICAgIGxldCBjID0gVXRpbC5nZXRBcmdzKGFyZ3MpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgPCBjLmxlbmd0aClcbiAgICAgICAgICAgICAgICBwW2ldID0gY1tpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKHApO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbUhleChoZXgpIHtcbiAgICAgICAgaWYgKGhleFswXSA9PSBcIiNcIilcbiAgICAgICAgICAgIGhleCA9IGhleC5zdWJzdHIoMSk7XG4gICAgICAgIGlmIChoZXgubGVuZ3RoIDw9IDMpIHtcbiAgICAgICAgICAgIGxldCBmbiA9IChpKSA9PiBoZXhbaV0gfHwgXCJGXCI7XG4gICAgICAgICAgICBoZXggPSBgJHtmbigwKX0ke2ZuKDApfSR7Zm4oMSl9JHtmbigxKX0ke2ZuKDIpfSR7Zm4oMil9YDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYWxwaGEgPSAxO1xuICAgICAgICBpZiAoaGV4Lmxlbmd0aCA9PT0gOCkge1xuICAgICAgICAgICAgYWxwaGEgPSBoZXguc3Vic3RyKDYpICYmIDB4RkYgLyAyNTU7XG4gICAgICAgICAgICBoZXggPSBoZXguc3Vic3RyaW5nKDAsIDYpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBoZXhWYWwgPSBwYXJzZUludChoZXgsIDE2KTtcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihoZXhWYWwgPj4gMTYsIGhleFZhbCA+PiA4ICYgMHhGRiwgaGV4VmFsICYgMHhGRiwgYWxwaGEpO1xuICAgIH1cbiAgICBzdGF0aWMgcmdiKC4uLmFyZ3MpIHsgcmV0dXJuIENvbG9yLmZyb20oLi4uYXJncykudG9Nb2RlKFwicmdiXCIpOyB9XG4gICAgc3RhdGljIGhzbCguLi5hcmdzKSB7IHJldHVybiBDb2xvci5mcm9tKC4uLmFyZ3MpLnRvTW9kZShcImhzbFwiKTsgfVxuICAgIHN0YXRpYyBoc2IoLi4uYXJncykgeyByZXR1cm4gQ29sb3IuZnJvbSguLi5hcmdzKS50b01vZGUoXCJoc2JcIik7IH1cbiAgICBzdGF0aWMgbGFiKC4uLmFyZ3MpIHsgcmV0dXJuIENvbG9yLmZyb20oLi4uYXJncykudG9Nb2RlKFwibGFiXCIpOyB9XG4gICAgc3RhdGljIGxjaCguLi5hcmdzKSB7IHJldHVybiBDb2xvci5mcm9tKC4uLmFyZ3MpLnRvTW9kZShcImxjaFwiKTsgfVxuICAgIHN0YXRpYyBsdXYoLi4uYXJncykgeyByZXR1cm4gQ29sb3IuZnJvbSguLi5hcmdzKS50b01vZGUoXCJsdXZcIik7IH1cbiAgICBzdGF0aWMgeHl6KC4uLmFyZ3MpIHsgcmV0dXJuIENvbG9yLmZyb20oLi4uYXJncykudG9Nb2RlKFwieHl6XCIpOyB9XG4gICAgc3RhdGljIG1heFZhbHVlcyhtb2RlKSB7IHJldHVybiBDb2xvci5yYW5nZXNbbW9kZV0uemlwU2xpY2UoMSkuJHRha2UoWzAsIDEsIDJdKTsgfVxuICAgIGdldCBoZXgoKSB7IHJldHVybiB0aGlzLnRvU3RyaW5nKFwiaGV4XCIpOyB9XG4gICAgZ2V0IHJnYigpIHsgcmV0dXJuIHRoaXMudG9TdHJpbmcoXCJyZ2JcIik7IH1cbiAgICBnZXQgcmdiYSgpIHsgcmV0dXJuIHRoaXMudG9TdHJpbmcoXCJyZ2JhXCIpOyB9XG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGxldCBjID0gbmV3IENvbG9yKHRoaXMpO1xuICAgICAgICBjLnRvTW9kZSh0aGlzLl9tb2RlKTtcbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuICAgIHRvTW9kZShtb2RlLCBjb252ZXJ0ID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKGNvbnZlcnQpIHtcbiAgICAgICAgICAgIGxldCBmbmFtZSA9IHRoaXMuX21vZGUudG9VcHBlckNhc2UoKSArIFwidG9cIiArIG1vZGUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIGlmIChDb2xvcltmbmFtZV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvKENvbG9yW2ZuYW1lXSh0aGlzLCB0aGlzLl9pc05vcm0sIHRoaXMuX2lzTm9ybSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGNvbnZlcnQgY29sb3Igd2l0aCBcIiArIGZuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tb2RlID0gbW9kZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGdldCBtb2RlKCkgeyByZXR1cm4gdGhpcy5fbW9kZTsgfVxuICAgIGdldCByKCkgeyByZXR1cm4gdGhpc1swXTsgfVxuICAgIHNldCByKG4pIHsgdGhpc1swXSA9IG47IH1cbiAgICBnZXQgZygpIHsgcmV0dXJuIHRoaXNbMV07IH1cbiAgICBzZXQgZyhuKSB7IHRoaXNbMV0gPSBuOyB9XG4gICAgZ2V0IGIoKSB7IHJldHVybiB0aGlzWzJdOyB9XG4gICAgc2V0IGIobikgeyB0aGlzWzJdID0gbjsgfVxuICAgIGdldCBoKCkgeyByZXR1cm4gKHRoaXMuX21vZGUgPT0gXCJsY2hcIikgPyB0aGlzWzJdIDogdGhpc1swXTsgfVxuICAgIHNldCBoKG4pIHtcbiAgICAgICAgbGV0IGkgPSAodGhpcy5fbW9kZSA9PSBcImxjaFwiKSA/IDIgOiAwO1xuICAgICAgICB0aGlzW2ldID0gbjtcbiAgICB9XG4gICAgZ2V0IHMoKSB7IHJldHVybiB0aGlzWzFdOyB9XG4gICAgc2V0IHMobikgeyB0aGlzWzFdID0gbjsgfVxuICAgIGdldCBsKCkgeyByZXR1cm4gKHRoaXMuX21vZGUgPT0gXCJoc2xcIikgPyB0aGlzWzJdIDogdGhpc1swXTsgfVxuICAgIHNldCBsKG4pIHtcbiAgICAgICAgbGV0IGkgPSAodGhpcy5fbW9kZSA9PSBcImhzbFwiKSA/IDIgOiAwO1xuICAgICAgICB0aGlzW2ldID0gbjtcbiAgICB9XG4gICAgZ2V0IGEoKSB7IHJldHVybiB0aGlzWzFdOyB9XG4gICAgc2V0IGEobikgeyB0aGlzWzFdID0gbjsgfVxuICAgIGdldCBjKCkgeyByZXR1cm4gdGhpc1sxXTsgfVxuICAgIHNldCBjKG4pIHsgdGhpc1sxXSA9IG47IH1cbiAgICBnZXQgdSgpIHsgcmV0dXJuIHRoaXNbMV07IH1cbiAgICBzZXQgdShuKSB7IHRoaXNbMV0gPSBuOyB9XG4gICAgZ2V0IHYoKSB7IHJldHVybiB0aGlzWzJdOyB9XG4gICAgc2V0IHYobikgeyB0aGlzWzJdID0gbjsgfVxuICAgIHNldCBhbHBoYShuKSB7IGlmICh0aGlzLmxlbmd0aCA+IDMpXG4gICAgICAgIHRoaXNbM10gPSBuOyB9XG4gICAgZ2V0IGFscGhhKCkgeyByZXR1cm4gKHRoaXMubGVuZ3RoID4gMykgPyB0aGlzWzNdIDogMTsgfVxuICAgIGdldCBub3JtYWxpemVkKCkgeyByZXR1cm4gdGhpcy5faXNOb3JtOyB9XG4gICAgc2V0IG5vcm1hbGl6ZWQoYikgeyB0aGlzLl9pc05vcm0gPSBiOyB9XG4gICAgbm9ybWFsaXplKHRvTm9ybSA9IHRydWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzTm9ybSA9PSB0b05vcm0pXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgbGV0IHJhbmdlcyA9IENvbG9yLnJhbmdlc1t0aGlzLl9tb2RlXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXNbaV0gPSAoIXRvTm9ybSlcbiAgICAgICAgICAgICAgICA/IE51bS5tYXBUb1JhbmdlKHRoaXNbaV0sIDAsIDEsIHJhbmdlc1tpXVswXSwgcmFuZ2VzW2ldWzFdKVxuICAgICAgICAgICAgICAgIDogTnVtLm1hcFRvUmFuZ2UodGhpc1tpXSwgcmFuZ2VzW2ldWzBdLCByYW5nZXNbaV1bMV0sIDAsIDEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2lzTm9ybSA9IHRvTm9ybTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgICRub3JtYWxpemUodG9Ob3JtID0gdHJ1ZSkgeyByZXR1cm4gdGhpcy5jbG9uZSgpLm5vcm1hbGl6ZSh0b05vcm0pOyB9XG4gICAgdG9TdHJpbmcoZm9ybWF0ID0gXCJtb2RlXCIpIHtcbiAgICAgICAgaWYgKGZvcm1hdCA9PSBcImhleFwiKSB7XG4gICAgICAgICAgICBsZXQgX2hleCA9IChuKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHMgPSBNYXRoLmZsb29yKG4pLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHMubGVuZ3RoIDwgMikgPyAnMCcgKyBzIDogcztcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gYCMke19oZXgodGhpc1swXSl9JHtfaGV4KHRoaXNbMV0pfSR7X2hleCh0aGlzWzJdKX1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZvcm1hdCA9PSBcInJnYmFcIikge1xuICAgICAgICAgICAgcmV0dXJuIGByZ2JhKCR7TWF0aC5mbG9vcih0aGlzWzBdKX0sJHtNYXRoLmZsb29yKHRoaXNbMV0pfSwke01hdGguZmxvb3IodGhpc1syXSl9LCR7dGhpcy5hbHBoYX1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZvcm1hdCA9PSBcInJnYlwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYHJnYigke01hdGguZmxvb3IodGhpc1swXSl9LCR7TWF0aC5mbG9vcih0aGlzWzFdKX0sJHtNYXRoLmZsb29yKHRoaXNbMl0pfWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5fbW9kZX0oJHt0aGlzWzBdfSwke3RoaXNbMV19LCR7dGhpc1syXX0sJHt0aGlzLmFscGhhfSlgO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBSR0J0b0hTTChyZ2IsIG5vcm1hbGl6ZWRJbnB1dCA9IGZhbHNlLCBub3JtYWxpemVkT3V0cHV0ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IFtyLCBnLCBiXSA9ICghbm9ybWFsaXplZElucHV0KSA/IHJnYi4kbm9ybWFsaXplKCkgOiByZ2I7XG4gICAgICAgIGxldCBtYXggPSBNYXRoLm1heChyLCBnLCBiKTtcbiAgICAgICAgbGV0IG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuICAgICAgICBsZXQgaCA9IChtYXggKyBtaW4pIC8gMjtcbiAgICAgICAgbGV0IHMgPSBoO1xuICAgICAgICBsZXQgbCA9IGg7XG4gICAgICAgIGlmIChtYXggPT0gbWluKSB7XG4gICAgICAgICAgICBoID0gMDtcbiAgICAgICAgICAgIHMgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGQgPSBtYXggLSBtaW47XG4gICAgICAgICAgICBzID0gKGwgPiAwLjUpID8gZCAvICgyIC0gbWF4IC0gbWluKSA6IGQgLyAobWF4ICsgbWluKTtcbiAgICAgICAgICAgIGggPSAwO1xuICAgICAgICAgICAgaWYgKG1heCA9PT0gcikge1xuICAgICAgICAgICAgICAgIGggPSAoZyAtIGIpIC8gZCArICgoZyA8IGIpID8gNiA6IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobWF4ID09PSBnKSB7XG4gICAgICAgICAgICAgICAgaCA9IChiIC0gcikgLyBkICsgMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1heCA9PT0gYikge1xuICAgICAgICAgICAgICAgIGggPSAociAtIGcpIC8gZCArIDQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENvbG9yLmhzbCgoKG5vcm1hbGl6ZWRPdXRwdXQpID8gaCAvIDYwIDogaCAqIDYwKSwgcywgbCwgcmdiLmFscGhhKTtcbiAgICB9XG4gICAgc3RhdGljIEhTTHRvUkdCKGhzbCwgbm9ybWFsaXplZElucHV0ID0gZmFsc2UsIG5vcm1hbGl6ZWRPdXRwdXQgPSBmYWxzZSkge1xuICAgICAgICBsZXQgW2gsIHMsIGxdID0gaHNsO1xuICAgICAgICBpZiAoIW5vcm1hbGl6ZWRJbnB1dClcbiAgICAgICAgICAgIGggPSBoIC8gMzYwO1xuICAgICAgICBpZiAocyA9PSAwKVxuICAgICAgICAgICAgcmV0dXJuIENvbG9yLnJnYihsICogMjU1LCBsICogMjU1LCBsICogMjU1LCBoc2wuYWxwaGEpO1xuICAgICAgICBsZXQgcSA9IChsIDw9IDAuNSkgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gKGwgKiBzKTtcbiAgICAgICAgbGV0IHAgPSAyICogbCAtIHE7XG4gICAgICAgIGxldCBjb252ZXJ0ID0gKHQpID0+IHtcbiAgICAgICAgICAgIHQgPSAodCA8IDApID8gdCArIDEgOiAodCA+IDEpID8gdCAtIDEgOiB0O1xuICAgICAgICAgICAgaWYgKHQgKiA2IDwgMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwICsgKHEgLSBwKSAqIHQgKiA2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodCAqIDIgPCAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0ICogMyA8IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcCArIChxIC0gcCkgKiAoKDIgLyAzKSAtIHQpICogNjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBsZXQgc2MgPSAobm9ybWFsaXplZE91dHB1dCkgPyAxIDogMjU1O1xuICAgICAgICByZXR1cm4gQ29sb3IucmdiKHNjICogY29udmVydCgoaCArIDEgLyAzKSksIHNjICogY29udmVydChoKSwgc2MgKiBjb252ZXJ0KChoIC0gMSAvIDMpKSwgaHNsLmFscGhhKTtcbiAgICB9XG4gICAgc3RhdGljIFJHQnRvSFNCKHJnYiwgbm9ybWFsaXplZElucHV0ID0gZmFsc2UsIG5vcm1hbGl6ZWRPdXRwdXQgPSBmYWxzZSkge1xuICAgICAgICBsZXQgW3IsIGcsIGJdID0gKCFub3JtYWxpemVkSW5wdXQpID8gcmdiLiRub3JtYWxpemUoKSA6IHJnYjtcbiAgICAgICAgbGV0IG1heCA9IE1hdGgubWF4KHIsIGcsIGIpO1xuICAgICAgICBsZXQgbWluID0gTWF0aC5taW4ociwgZywgYik7XG4gICAgICAgIGxldCBkID0gbWF4IC0gbWluO1xuICAgICAgICBsZXQgaCA9IDA7XG4gICAgICAgIGxldCBzID0gKG1heCA9PT0gMCkgPyAwIDogZCAvIG1heDtcbiAgICAgICAgbGV0IHYgPSBtYXg7XG4gICAgICAgIGlmIChtYXggIT0gbWluKSB7XG4gICAgICAgICAgICBpZiAobWF4ID09PSByKSB7XG4gICAgICAgICAgICAgICAgaCA9IChnIC0gYikgLyBkICsgKChnIDwgYikgPyA2IDogMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtYXggPT09IGcpIHtcbiAgICAgICAgICAgICAgICBoID0gKGIgLSByKSAvIGQgKyAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobWF4ID09PSBiKSB7XG4gICAgICAgICAgICAgICAgaCA9IChyIC0gZykgLyBkICsgNDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ29sb3IuaHNiKCgobm9ybWFsaXplZE91dHB1dCkgPyBoIC8gNjAgOiBoICogNjApLCBzLCB2LCByZ2IuYWxwaGEpO1xuICAgIH1cbiAgICBzdGF0aWMgSFNCdG9SR0IoaHNiLCBub3JtYWxpemVkSW5wdXQgPSBmYWxzZSwgbm9ybWFsaXplZE91dHB1dCA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBbaCwgcywgdl0gPSBoc2I7XG4gICAgICAgIGlmICghbm9ybWFsaXplZElucHV0KVxuICAgICAgICAgICAgaCA9IGggLyAzNjA7XG4gICAgICAgIGxldCBpID0gTWF0aC5mbG9vcihoICogNik7XG4gICAgICAgIGxldCBmID0gaCAqIDYgLSBpO1xuICAgICAgICBsZXQgcCA9IHYgKiAoMSAtIHMpO1xuICAgICAgICBsZXQgcSA9IHYgKiAoMSAtIGYgKiBzKTtcbiAgICAgICAgbGV0IHQgPSB2ICogKDEgLSAoMSAtIGYpICogcyk7XG4gICAgICAgIGxldCBwaWNrID0gW1xuICAgICAgICAgICAgW3YsIHQsIHBdLCBbcSwgdiwgcF0sIFtwLCB2LCB0XSxcbiAgICAgICAgICAgIFtwLCBxLCB2XSwgW3QsIHAsIHZdLCBbdiwgcCwgcV1cbiAgICAgICAgXTtcbiAgICAgICAgbGV0IGMgPSBwaWNrW2kgJSA2XTtcbiAgICAgICAgbGV0IHNjID0gKG5vcm1hbGl6ZWRPdXRwdXQpID8gMSA6IDI1NTtcbiAgICAgICAgcmV0dXJuIENvbG9yLnJnYihzYyAqIGNbMF0sIHNjICogY1sxXSwgc2MgKiBjWzJdLCBoc2IuYWxwaGEpO1xuICAgIH1cbiAgICBzdGF0aWMgUkdCdG9MQUIocmdiLCBub3JtYWxpemVkSW5wdXQgPSBmYWxzZSwgbm9ybWFsaXplZE91dHB1dCA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBjID0gKG5vcm1hbGl6ZWRJbnB1dCkgPyByZ2IuJG5vcm1hbGl6ZShmYWxzZSkgOiByZ2I7XG4gICAgICAgIHJldHVybiBDb2xvci5YWVp0b0xBQihDb2xvci5SR0J0b1hZWihjKSwgZmFsc2UsIG5vcm1hbGl6ZWRPdXRwdXQpO1xuICAgIH1cbiAgICBzdGF0aWMgTEFCdG9SR0IobGFiLCBub3JtYWxpemVkSW5wdXQgPSBmYWxzZSwgbm9ybWFsaXplZE91dHB1dCA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBjID0gKG5vcm1hbGl6ZWRJbnB1dCkgPyBsYWIuJG5vcm1hbGl6ZShmYWxzZSkgOiBsYWI7XG4gICAgICAgIHJldHVybiBDb2xvci5YWVp0b1JHQihDb2xvci5MQUJ0b1hZWihjKSwgZmFsc2UsIG5vcm1hbGl6ZWRPdXRwdXQpO1xuICAgIH1cbiAgICBzdGF0aWMgUkdCdG9MQ0gocmdiLCBub3JtYWxpemVkSW5wdXQgPSBmYWxzZSwgbm9ybWFsaXplZE91dHB1dCA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBjID0gKG5vcm1hbGl6ZWRJbnB1dCkgPyByZ2IuJG5vcm1hbGl6ZShmYWxzZSkgOiByZ2I7XG4gICAgICAgIHJldHVybiBDb2xvci5MQUJ0b0xDSChDb2xvci5SR0J0b0xBQihjKSwgZmFsc2UsIG5vcm1hbGl6ZWRPdXRwdXQpO1xuICAgIH1cbiAgICBzdGF0aWMgTENIdG9SR0IobGNoLCBub3JtYWxpemVkSW5wdXQgPSBmYWxzZSwgbm9ybWFsaXplZE91dHB1dCA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBjID0gKG5vcm1hbGl6ZWRJbnB1dCkgPyBsY2guJG5vcm1hbGl6ZShmYWxzZSkgOiBsY2g7XG4gICAgICAgIHJldHVybiBDb2xvci5MQUJ0b1JHQihDb2xvci5MQ0h0b0xBQihjKSwgZmFsc2UsIG5vcm1hbGl6ZWRPdXRwdXQpO1xuICAgIH1cbiAgICBzdGF0aWMgUkdCdG9MVVYocmdiLCBub3JtYWxpemVkSW5wdXQgPSBmYWxzZSwgbm9ybWFsaXplZE91dHB1dCA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBjID0gKG5vcm1hbGl6ZWRJbnB1dCkgPyByZ2IuJG5vcm1hbGl6ZShmYWxzZSkgOiByZ2I7XG4gICAgICAgIHJldHVybiBDb2xvci5YWVp0b0xVVihDb2xvci5SR0J0b1hZWihjKSwgZmFsc2UsIG5vcm1hbGl6ZWRPdXRwdXQpO1xuICAgIH1cbiAgICBzdGF0aWMgTFVWdG9SR0IobHV2LCBub3JtYWxpemVkSW5wdXQgPSBmYWxzZSwgbm9ybWFsaXplZE91dHB1dCA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBjID0gKG5vcm1hbGl6ZWRJbnB1dCkgPyBsdXYuJG5vcm1hbGl6ZShmYWxzZSkgOiBsdXY7XG4gICAgICAgIHJldHVybiBDb2xvci5YWVp0b1JHQihDb2xvci5MVVZ0b1hZWihjKSwgZmFsc2UsIG5vcm1hbGl6ZWRPdXRwdXQpO1xuICAgIH1cbiAgICBzdGF0aWMgUkdCdG9YWVoocmdiLCBub3JtYWxpemVkSW5wdXQgPSBmYWxzZSwgbm9ybWFsaXplZE91dHB1dCA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBjID0gKCFub3JtYWxpemVkSW5wdXQpID8gcmdiLiRub3JtYWxpemUoKSA6IHJnYi5jbG9uZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgY1tpXSA9IChjW2ldID4gMC4wNDA0NSkgPyBNYXRoLnBvdygoY1tpXSArIDAuMDU1KSAvIDEuMDU1LCAyLjQpIDogY1tpXSAvIDEyLjkyO1xuICAgICAgICAgICAgaWYgKCFub3JtYWxpemVkT3V0cHV0KVxuICAgICAgICAgICAgICAgIGNbaV0gPSBjW2ldICogMTAwO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjYyA9IENvbG9yLnh5eihjWzBdICogMC40MTI0NTY0ICsgY1sxXSAqIDAuMzU3NTc2MSArIGNbMl0gKiAwLjE4MDQzNzUsIGNbMF0gKiAwLjIxMjY3MjkgKyBjWzFdICogMC43MTUxNTIyICsgY1syXSAqIDAuMDcyMTc1MCwgY1swXSAqIDAuMDE5MzMzOSArIGNbMV0gKiAwLjExOTE5MjAgKyBjWzJdICogMC45NTAzMDQxLCByZ2IuYWxwaGEpO1xuICAgICAgICByZXR1cm4gKG5vcm1hbGl6ZWRPdXRwdXQpID8gY2Mubm9ybWFsaXplKCkgOiBjYztcbiAgICB9XG4gICAgc3RhdGljIFhZWnRvUkdCKHh5eiwgbm9ybWFsaXplZElucHV0ID0gZmFsc2UsIG5vcm1hbGl6ZWRPdXRwdXQgPSBmYWxzZSkge1xuICAgICAgICBsZXQgW3gsIHksIHpdID0gKCFub3JtYWxpemVkSW5wdXQpID8geHl6LiRub3JtYWxpemUoKSA6IHh5ejtcbiAgICAgICAgbGV0IHJnYiA9IFtcbiAgICAgICAgICAgIHggKiAzLjI0MDQ1NDIgKyB5ICogLTEuNTM3MTM4NSArIHogKiAtMC40OTg1MzE0LFxuICAgICAgICAgICAgeCAqIC0wLjk2OTI2NjAgKyB5ICogMS44NzYwMTA4ICsgeiAqIDAuMDQxNTU2MCxcbiAgICAgICAgICAgIHggKiAwLjA1NTY0MzQgKyB5ICogLTAuMjA0MDI1OSArIHogKiAxLjA1NzIyNTJcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHJnYltpXSA9IChyZ2JbaV0gPCAwKSA/IDAgOiAocmdiW2ldID4gMC4wMDMxMzA4KSA/ICgxLjA1NSAqIE1hdGgucG93KHJnYltpXSwgMSAvIDIuNCkgLSAwLjA1NSkgOiAoMTIuOTIgKiByZ2JbaV0pO1xuICAgICAgICAgICAgcmdiW2ldID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgcmdiW2ldKSk7XG4gICAgICAgICAgICBpZiAoIW5vcm1hbGl6ZWRPdXRwdXQpXG4gICAgICAgICAgICAgICAgcmdiW2ldID0gTWF0aC5yb3VuZChyZ2JbaV0gKiAyNTUpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjYyA9IENvbG9yLnJnYihyZ2JbMF0sIHJnYlsxXSwgcmdiWzJdLCB4eXouYWxwaGEpO1xuICAgICAgICByZXR1cm4gKG5vcm1hbGl6ZWRPdXRwdXQpID8gY2Mubm9ybWFsaXplKCkgOiBjYztcbiAgICB9XG4gICAgc3RhdGljIFhZWnRvTEFCKHh5eiwgbm9ybWFsaXplZElucHV0ID0gZmFsc2UsIG5vcm1hbGl6ZWRPdXRwdXQgPSBmYWxzZSkge1xuICAgICAgICBsZXQgYyA9IChub3JtYWxpemVkSW5wdXQpID8geHl6LiRub3JtYWxpemUoZmFsc2UpIDogeHl6LmNsb25lKCk7XG4gICAgICAgIGMuZGl2aWRlKENvbG9yLkQ2NSk7XG4gICAgICAgIGxldCBmbiA9IChuKSA9PiAobiA+IDAuMDA4ODU2KSA/IE1hdGgucG93KG4sIDEgLyAzKSA6ICg3Ljc4NyAqIG4pICsgMTYgLyAxMTY7XG4gICAgICAgIGxldCBjeSA9IGZuKGNbMV0pO1xuICAgICAgICBsZXQgY2MgPSBDb2xvci5sYWIoKDExNiAqIGN5KSAtIDE2LCA1MDAgKiAoZm4oY1swXSkgLSBjeSksIDIwMCAqIChjeSAtIGZuKGNbMl0pKSwgeHl6LmFscGhhKTtcbiAgICAgICAgcmV0dXJuIChub3JtYWxpemVkT3V0cHV0KSA/IGNjLm5vcm1hbGl6ZSgpIDogY2M7XG4gICAgfVxuICAgIHN0YXRpYyBMQUJ0b1hZWihsYWIsIG5vcm1hbGl6ZWRJbnB1dCA9IGZhbHNlLCBub3JtYWxpemVkT3V0cHV0ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IGMgPSAobm9ybWFsaXplZElucHV0KSA/IGxhYi4kbm9ybWFsaXplKGZhbHNlKSA6IGxhYjtcbiAgICAgICAgbGV0IHkgPSAoY1swXSArIDE2KSAvIDExNjtcbiAgICAgICAgbGV0IHggPSAoY1sxXSAvIDUwMCkgKyB5O1xuICAgICAgICBsZXQgeiA9IHkgLSBjWzJdIC8gMjAwO1xuICAgICAgICBsZXQgZm4gPSAobikgPT4ge1xuICAgICAgICAgICAgbGV0IG5ubiA9IG4gKiBuICogbjtcbiAgICAgICAgICAgIHJldHVybiAobm5uID4gMC4wMDg4NTYpID8gbm5uIDogKG4gLSAxNiAvIDExNikgLyA3Ljc4NztcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGQgPSBDb2xvci5ENjU7XG4gICAgICAgIGxldCBjYyA9IENvbG9yLnh5eihNYXRoLm1heCgwLCBkWzBdICogZm4oeCkpLCBNYXRoLm1heCgwLCBkWzFdICogZm4oeSkpLCBNYXRoLm1heCgwLCBkWzJdICogZm4oeikpLCBsYWIuYWxwaGEpO1xuICAgICAgICByZXR1cm4gKG5vcm1hbGl6ZWRPdXRwdXQpID8gY2Mubm9ybWFsaXplKCkgOiBjYztcbiAgICB9XG4gICAgc3RhdGljIFhZWnRvTFVWKHh5eiwgbm9ybWFsaXplZElucHV0ID0gZmFsc2UsIG5vcm1hbGl6ZWRPdXRwdXQgPSBmYWxzZSkge1xuICAgICAgICBsZXQgW3gsIHksIHpdID0gKG5vcm1hbGl6ZWRJbnB1dCkgPyB4eXouJG5vcm1hbGl6ZShmYWxzZSkgOiB4eXo7XG4gICAgICAgIGxldCB1ID0gKDQgKiB4KSAvICh4ICsgKDE1ICogeSkgKyAoMyAqIHopKTtcbiAgICAgICAgbGV0IHYgPSAoOSAqIHkpIC8gKHggKyAoMTUgKiB5KSArICgzICogeikpO1xuICAgICAgICB5ID0geSAvIDEwMDtcbiAgICAgICAgeSA9ICh5ID4gMC4wMDg4NTYpID8gTWF0aC5wb3coeSwgMSAvIDMpIDogKDcuNzg3ICogeSArIDE2IC8gMTE2KTtcbiAgICAgICAgbGV0IHJlZlUgPSAoNCAqIENvbG9yLkQ2NVswXSkgLyAoQ29sb3IuRDY1WzBdICsgKDE1ICogQ29sb3IuRDY1WzFdKSArICgzICogQ29sb3IuRDY1WzJdKSk7XG4gICAgICAgIGxldCByZWZWID0gKDkgKiBDb2xvci5ENjVbMV0pIC8gKENvbG9yLkQ2NVswXSArICgxNSAqIENvbG9yLkQ2NVsxXSkgKyAoMyAqIENvbG9yLkQ2NVsyXSkpO1xuICAgICAgICBsZXQgTCA9ICgxMTYgKiB5KSAtIDE2O1xuICAgICAgICByZXR1cm4gQ29sb3IubHV2KEwsIDEzICogTCAqICh1IC0gcmVmVSksIDEzICogTCAqICh2IC0gcmVmViksIHh5ei5hbHBoYSk7XG4gICAgfVxuICAgIHN0YXRpYyBMVVZ0b1hZWihsdXYsIG5vcm1hbGl6ZWRJbnB1dCA9IGZhbHNlLCBub3JtYWxpemVkT3V0cHV0ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IFtsLCB1LCB2XSA9IChub3JtYWxpemVkSW5wdXQpID8gbHV2LiRub3JtYWxpemUoZmFsc2UpIDogbHV2O1xuICAgICAgICBsZXQgeSA9IChsICsgMTYpIC8gMTE2O1xuICAgICAgICBsZXQgY3ViZVkgPSB5ICogeSAqIHk7XG4gICAgICAgIHkgPSAoY3ViZVkgPiAwLjAwODg1NikgPyBjdWJlWSA6ICh5IC0gMTYgLyAxMTYpIC8gNy43ODc7XG4gICAgICAgIGxldCByZWZVID0gKDQgKiBDb2xvci5ENjVbMF0pIC8gKENvbG9yLkQ2NVswXSArICgxNSAqIENvbG9yLkQ2NVsxXSkgKyAoMyAqIENvbG9yLkQ2NVsyXSkpO1xuICAgICAgICBsZXQgcmVmViA9ICg5ICogQ29sb3IuRDY1WzFdKSAvIChDb2xvci5ENjVbMF0gKyAoMTUgKiBDb2xvci5ENjVbMV0pICsgKDMgKiBDb2xvci5ENjVbMl0pKTtcbiAgICAgICAgdSA9IHUgLyAoMTMgKiBsKSArIHJlZlU7XG4gICAgICAgIHYgPSB2IC8gKDEzICogbCkgKyByZWZWO1xuICAgICAgICB5ID0geSAqIDEwMDtcbiAgICAgICAgbGV0IHggPSAtMSAqICg5ICogeSAqIHUpIC8gKCh1IC0gNCkgKiB2IC0gdSAqIHYpO1xuICAgICAgICBsZXQgeiA9ICg5ICogeSAtICgxNSAqIHYgKiB5KSAtICh2ICogeCkpIC8gKDMgKiB2KTtcbiAgICAgICAgcmV0dXJuIENvbG9yLnh5eih4LCB5LCB6LCBsdXYuYWxwaGEpO1xuICAgIH1cbiAgICBzdGF0aWMgTEFCdG9MQ0gobGFiLCBub3JtYWxpemVkSW5wdXQgPSBmYWxzZSwgbm9ybWFsaXplZE91dHB1dCA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBjID0gKG5vcm1hbGl6ZWRJbnB1dCkgPyBsYWIuJG5vcm1hbGl6ZShmYWxzZSkgOiBsYWI7XG4gICAgICAgIGxldCBoID0gR2VvbS50b0RlZ3JlZShHZW9tLmJvdW5kUmFkaWFuKE1hdGguYXRhbjIoY1syXSwgY1sxXSkpKTtcbiAgICAgICAgcmV0dXJuIENvbG9yLmxjaChjWzBdLCBNYXRoLnNxcnQoY1sxXSAqIGNbMV0gKyBjWzJdICogY1syXSksIGgsIGxhYi5hbHBoYSk7XG4gICAgfVxuICAgIHN0YXRpYyBMQ0h0b0xBQihsY2gsIG5vcm1hbGl6ZWRJbnB1dCA9IGZhbHNlLCBub3JtYWxpemVkT3V0cHV0ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IGMgPSAobm9ybWFsaXplZElucHV0KSA/IGxjaC4kbm9ybWFsaXplKGZhbHNlKSA6IGxjaDtcbiAgICAgICAgbGV0IHJhZCA9IEdlb20udG9SYWRpYW4oY1syXSk7XG4gICAgICAgIHJldHVybiBDb2xvci5sYWIoY1swXSwgTWF0aC5jb3MocmFkKSAqIGNbMV0sIE1hdGguc2luKHJhZCkgKiBjWzFdLCBsY2guYWxwaGEpO1xuICAgIH1cbn1cbkNvbG9yLkQ2NSA9IG5ldyBQdCg5NS4wNDcsIDEwMCwgMTA4Ljg4MywgMSk7XG5Db2xvci5yYW5nZXMgPSB7XG4gICAgcmdiOiBuZXcgR3JvdXAobmV3IFB0KDAsIDI1NSksIG5ldyBQdCgwLCAyNTUpLCBuZXcgUHQoMCwgMjU1KSksXG4gICAgaHNsOiBuZXcgR3JvdXAobmV3IFB0KDAsIDM2MCksIG5ldyBQdCgwLCAxKSwgbmV3IFB0KDAsIDEpKSxcbiAgICBoc2I6IG5ldyBHcm91cChuZXcgUHQoMCwgMzYwKSwgbmV3IFB0KDAsIDEpLCBuZXcgUHQoMCwgMSkpLFxuICAgIGxhYjogbmV3IEdyb3VwKG5ldyBQdCgwLCAxMDApLCBuZXcgUHQoLTEyOCwgMTI3KSwgbmV3IFB0KC0xMjgsIDEyNykpLFxuICAgIGxjaDogbmV3IEdyb3VwKG5ldyBQdCgwLCAxMDApLCBuZXcgUHQoMCwgMTAwKSwgbmV3IFB0KDAsIDM2MCkpLFxuICAgIGx1djogbmV3IEdyb3VwKG5ldyBQdCgwLCAxMDApLCBuZXcgUHQoLTEzNCwgMjIwKSwgbmV3IFB0KC0xNDAsIDEyMikpLFxuICAgIHh5ejogbmV3IEdyb3VwKG5ldyBQdCgwLCAxMDApLCBuZXcgUHQoMCwgMTAwKSwgbmV3IFB0KDAsIDEwMCkpXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q29sb3IuanMubWFwIiwiLyohIFNvdXJjZSBjb2RlIGxpY2Vuc2VkIHVuZGVyIEFwYWNoZSBMaWNlbnNlIDIuMC4gQ29weXJpZ2h0IMKpIDIwMTctY3VycmVudCBXaWxsaWFtIE5nYW4gYW5kIGNvbnRyaWJ1dG9ycy4gKGh0dHBzOi8vZ2l0aHViLmNvbS93aWxsaWFtbmdhbi9wdHMpICovXG5pbXBvcnQgeyBQdCwgR3JvdXAgfSBmcm9tIFwiLi9QdFwiO1xuaW1wb3J0IHsgTGluZSwgVHJpYW5nbGUgfSBmcm9tIFwiLi9PcFwiO1xuaW1wb3J0IHsgQ29uc3QgfSBmcm9tIFwiLi9VdGlsXCI7XG5pbXBvcnQgeyBOdW0sIEdlb20gfSBmcm9tIFwiLi9OdW1cIjtcbmltcG9ydCB7IFZlYyB9IGZyb20gXCIuL0xpbmVhckFsZ2VicmFcIjtcbmV4cG9ydCBjbGFzcyBDcmVhdGUge1xuICAgIHN0YXRpYyBkaXN0cmlidXRlUmFuZG9tKGJvdW5kLCBjb3VudCwgZGltZW5zaW9ucyA9IDIpIHtcbiAgICAgICAgbGV0IHB0cyA9IG5ldyBHcm91cCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwID0gW2JvdW5kLnggKyBNYXRoLnJhbmRvbSgpICogYm91bmQud2lkdGhdO1xuICAgICAgICAgICAgaWYgKGRpbWVuc2lvbnMgPiAxKVxuICAgICAgICAgICAgICAgIHAucHVzaChib3VuZC55ICsgTWF0aC5yYW5kb20oKSAqIGJvdW5kLmhlaWdodCk7XG4gICAgICAgICAgICBpZiAoZGltZW5zaW9ucyA+IDIpXG4gICAgICAgICAgICAgICAgcC5wdXNoKGJvdW5kLnogKyBNYXRoLnJhbmRvbSgpICogYm91bmQuZGVwdGgpO1xuICAgICAgICAgICAgcHRzLnB1c2gobmV3IFB0KHApKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHRzO1xuICAgIH1cbiAgICBzdGF0aWMgZGlzdHJpYnV0ZUxpbmVhcihsaW5lLCBjb3VudCkge1xuICAgICAgICBsZXQgbG4gPSBMaW5lLnN1YnBvaW50cyhsaW5lLCBjb3VudCAtIDIpO1xuICAgICAgICBsbi51bnNoaWZ0KGxpbmVbMF0pO1xuICAgICAgICBsbi5wdXNoKGxpbmVbbGluZS5sZW5ndGggLSAxXSk7XG4gICAgICAgIHJldHVybiBsbjtcbiAgICB9XG4gICAgc3RhdGljIGdyaWRQdHMoYm91bmQsIGNvbHVtbnMsIHJvd3MsIG9yaWVudGF0aW9uID0gWzAuNSwgMC41XSkge1xuICAgICAgICBpZiAoY29sdW1ucyA9PT0gMCB8fCByb3dzID09PSAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ3JpZCBjb2x1bW5zIGFuZCByb3dzIGNhbm5vdCBiZSAwXCIpO1xuICAgICAgICBsZXQgdW5pdCA9IGJvdW5kLnNpemUuJHN1YnRyYWN0KDEpLiRkaXZpZGUoY29sdW1ucywgcm93cyk7XG4gICAgICAgIGxldCBvZmZzZXQgPSB1bml0LiRtdWx0aXBseShvcmllbnRhdGlvbik7XG4gICAgICAgIGxldCBnID0gbmV3IEdyb3VwKCk7XG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgcm93czsgcisrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IGNvbHVtbnM7IGMrKykge1xuICAgICAgICAgICAgICAgIGcucHVzaChib3VuZC50b3BMZWZ0LiRhZGQodW5pdC4kbXVsdGlwbHkoYywgcikpLmFkZChvZmZzZXQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZztcbiAgICB9XG4gICAgc3RhdGljIGdyaWRDZWxscyhib3VuZCwgY29sdW1ucywgcm93cykge1xuICAgICAgICBpZiAoY29sdW1ucyA9PT0gMCB8fCByb3dzID09PSAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ3JpZCBjb2x1bW5zIGFuZCByb3dzIGNhbm5vdCBiZSAwXCIpO1xuICAgICAgICBsZXQgdW5pdCA9IGJvdW5kLnNpemUuJHN1YnRyYWN0KDEpLmRpdmlkZShjb2x1bW5zLCByb3dzKTtcbiAgICAgICAgbGV0IGcgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sdW1uczsgYysrKSB7XG4gICAgICAgICAgICAgICAgZy5wdXNoKG5ldyBHcm91cChib3VuZC50b3BMZWZ0LiRhZGQodW5pdC4kbXVsdGlwbHkoYywgcikpLCBib3VuZC50b3BMZWZ0LiRhZGQodW5pdC4kbXVsdGlwbHkoYywgcikuYWRkKHVuaXQpKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnO1xuICAgIH1cbiAgICBzdGF0aWMgcmFkaWFsUHRzKGNlbnRlciwgcmFkaXVzLCBjb3VudCwgYW5nbGVPZmZzZXQgPSAtQ29uc3QuaGFsZl9waSkge1xuICAgICAgICBsZXQgZyA9IG5ldyBHcm91cCgpO1xuICAgICAgICBsZXQgYSA9IENvbnN0LnR3b19waSAvIGNvdW50O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGcucHVzaChuZXcgUHQoY2VudGVyKS50b0FuZ2xlKGEgKiBpICsgYW5nbGVPZmZzZXQsIHJhZGl1cywgdHJ1ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnO1xuICAgIH1cbiAgICBzdGF0aWMgbm9pc2VQdHMocHRzLCBkeCA9IDAuMDEsIGR5ID0gMC4wMSwgcm93cyA9IDAsIGNvbHVtbnMgPSAwKSB7XG4gICAgICAgIGxldCBzZWVkID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgbGV0IGcgPSBuZXcgR3JvdXAoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHB0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IG5wID0gbmV3IE5vaXNlKHB0c1tpXSk7XG4gICAgICAgICAgICBsZXQgciA9IChyb3dzICYmIHJvd3MgPiAwKSA/IE1hdGguZmxvb3IoaSAvIHJvd3MpIDogaTtcbiAgICAgICAgICAgIGxldCBjID0gKGNvbHVtbnMgJiYgY29sdW1ucyA+IDApID8gaSAlIGNvbHVtbnMgOiBpO1xuICAgICAgICAgICAgbnAuaW5pdE5vaXNlKGR4ICogYywgZHkgKiByKTtcbiAgICAgICAgICAgIG5wLnNlZWQoc2VlZCk7XG4gICAgICAgICAgICBnLnB1c2gobnApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnO1xuICAgIH1cbiAgICBzdGF0aWMgZGVsYXVuYXkocHRzKSB7XG4gICAgICAgIHJldHVybiBEZWxhdW5heS5mcm9tKHB0cyk7XG4gICAgfVxufVxuY29uc3QgX19ub2lzZV9ncmFkMyA9IFtcbiAgICBbMSwgMSwgMF0sIFstMSwgMSwgMF0sIFsxLCAtMSwgMF0sIFstMSwgLTEsIDBdLFxuICAgIFsxLCAwLCAxXSwgWy0xLCAwLCAxXSwgWzEsIDAsIC0xXSwgWy0xLCAwLCAtMV0sXG4gICAgWzAsIDEsIDFdLCBbMCwgLTEsIDFdLCBbMCwgMSwgLTFdLCBbMCwgLTEsIC0xXVxuXTtcbmNvbnN0IF9fbm9pc2VfcGVybVRhYmxlID0gWzE1MSwgMTYwLCAxMzcsIDkxLCA5MCwgMTUsXG4gICAgMTMxLCAxMywgMjAxLCA5NSwgOTYsIDUzLCAxOTQsIDIzMywgNywgMjI1LCAxNDAsIDM2LCAxMDMsIDMwLCA2OSwgMTQyLCA4LCA5OSwgMzcsIDI0MCwgMjEsIDEwLCAyMyxcbiAgICAxOTAsIDYsIDE0OCwgMjQ3LCAxMjAsIDIzNCwgNzUsIDAsIDI2LCAxOTcsIDYyLCA5NCwgMjUyLCAyMTksIDIwMywgMTE3LCAzNSwgMTEsIDMyLCA1NywgMTc3LCAzMyxcbiAgICA4OCwgMjM3LCAxNDksIDU2LCA4NywgMTc0LCAyMCwgMTI1LCAxMzYsIDE3MSwgMTY4LCA2OCwgMTc1LCA3NCwgMTY1LCA3MSwgMTM0LCAxMzksIDQ4LCAyNywgMTY2LFxuICAgIDc3LCAxNDYsIDE1OCwgMjMxLCA4MywgMTExLCAyMjksIDEyMiwgNjAsIDIxMSwgMTMzLCAyMzAsIDIyMCwgMTA1LCA5MiwgNDEsIDU1LCA0NiwgMjQ1LCA0MCwgMjQ0LFxuICAgIDEwMiwgMTQzLCA1NCwgNjUsIDI1LCA2MywgMTYxLCAxLCAyMTYsIDgwLCA3MywgMjA5LCA3NiwgMTMyLCAxODcsIDIwOCwgODksIDE4LCAxNjksIDIwMCwgMTk2LFxuICAgIDEzNSwgMTMwLCAxMTYsIDE4OCwgMTU5LCA4NiwgMTY0LCAxMDAsIDEwOSwgMTk4LCAxNzMsIDE4NiwgMywgNjQsIDUyLCAyMTcsIDIyNiwgMjUwLCAxMjQsIDEyMyxcbiAgICA1LCAyMDIsIDM4LCAxNDcsIDExOCwgMTI2LCAyNTUsIDgyLCA4NSwgMjEyLCAyMDcsIDIwNiwgNTksIDIyNywgNDcsIDE2LCA1OCwgMTcsIDE4MiwgMTg5LCAyOCwgNDIsXG4gICAgMjIzLCAxODMsIDE3MCwgMjEzLCAxMTksIDI0OCwgMTUyLCAyLCA0NCwgMTU0LCAxNjMsIDcwLCAyMjEsIDE1MywgMTAxLCAxNTUsIDE2NywgNDMsIDE3MiwgOSxcbiAgICAxMjksIDIyLCAzOSwgMjUzLCA5LCA5OCwgMTA4LCAxMTAsIDc5LCAxMTMsIDIyNCwgMjMyLCAxNzgsIDE4NSwgMTEyLCAxMDQsIDIxOCwgMjQ2LCA5NywgMjI4LFxuICAgIDI1MSwgMzQsIDI0MiwgMTkzLCAyMzgsIDIxMCwgMTQ0LCAxMiwgMTkxLCAxNzksIDE2MiwgMjQxLCA4MSwgNTEsIDE0NSwgMjM1LCAyNDksIDE0LCAyMzksIDEwNyxcbiAgICA0OSwgMTkyLCAyMTQsIDMxLCAxODEsIDE5OSwgMTA2LCAxNTcsIDE4NCwgODQsIDIwNCwgMTc2LCAxMTUsIDEyMSwgNTAsIDQ1LCAxMjcsIDQsIDE1MCwgMjU0LFxuICAgIDEzOCwgMjM2LCAyMDUsIDkzLCAyMjIsIDExNCwgNjcsIDI5LCAyNCwgNzIsIDI0MywgMTQxLCAxMjgsIDE5NSwgNzgsIDY2LCAyMTUsIDYxLCAxNTYsIDE4MFxuXTtcbmV4cG9ydCBjbGFzcyBOb2lzZSBleHRlbmRzIFB0IHtcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICB0aGlzLnBlcm0gPSBbXTtcbiAgICAgICAgdGhpcy5fbiA9IG5ldyBQdCgwLjAxLCAwLjAxKTtcbiAgICAgICAgdGhpcy5wZXJtID0gX19ub2lzZV9wZXJtVGFibGUuY29uY2F0KF9fbm9pc2VfcGVybVRhYmxlKTtcbiAgICB9XG4gICAgaW5pdE5vaXNlKC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5fbiA9IG5ldyBQdCguLi5hcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0ZXAoeCA9IDAsIHkgPSAwKSB7XG4gICAgICAgIHRoaXMuX24uYWRkKHgsIHkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2VlZChzKSB7XG4gICAgICAgIGlmIChzID4gMCAmJiBzIDwgMSlcbiAgICAgICAgICAgIHMgKj0gNjU1MzY7XG4gICAgICAgIHMgPSBNYXRoLmZsb29yKHMpO1xuICAgICAgICBpZiAocyA8IDI1NilcbiAgICAgICAgICAgIHMgfD0gcyA8PCA4O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI1NTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdiA9IChpICYgMSkgPyBfX25vaXNlX3Blcm1UYWJsZVtpXSBeIChzICYgMjU1KSA6IF9fbm9pc2VfcGVybVRhYmxlW2ldIF4gKChzID4+IDgpICYgMjU1KTtcbiAgICAgICAgICAgIHRoaXMucGVybVtpXSA9IHRoaXMucGVybVtpICsgMjU2XSA9IHY7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG5vaXNlMkQoKSB7XG4gICAgICAgIGxldCBpID0gTWF0aC5tYXgoMCwgTWF0aC5mbG9vcih0aGlzLl9uWzBdKSkgJSAyNTU7XG4gICAgICAgIGxldCBqID0gTWF0aC5tYXgoMCwgTWF0aC5mbG9vcih0aGlzLl9uWzFdKSkgJSAyNTU7XG4gICAgICAgIGxldCB4ID0gKHRoaXMuX25bMF0gJSAyNTUpIC0gaTtcbiAgICAgICAgbGV0IHkgPSAodGhpcy5fblsxXSAlIDI1NSkgLSBqO1xuICAgICAgICBsZXQgbjAwID0gVmVjLmRvdChfX25vaXNlX2dyYWQzWyhpICsgdGhpcy5wZXJtW2pdKSAlIDEyXSwgW3gsIHksIDBdKTtcbiAgICAgICAgbGV0IG4wMSA9IFZlYy5kb3QoX19ub2lzZV9ncmFkM1soaSArIHRoaXMucGVybVtqICsgMV0pICUgMTJdLCBbeCwgeSAtIDEsIDBdKTtcbiAgICAgICAgbGV0IG4xMCA9IFZlYy5kb3QoX19ub2lzZV9ncmFkM1soaSArIDEgKyB0aGlzLnBlcm1bal0pICUgMTJdLCBbeCAtIDEsIHksIDBdKTtcbiAgICAgICAgbGV0IG4xMSA9IFZlYy5kb3QoX19ub2lzZV9ncmFkM1soaSArIDEgKyB0aGlzLnBlcm1baiArIDFdKSAlIDEyXSwgW3ggLSAxLCB5IC0gMSwgMF0pO1xuICAgICAgICBsZXQgX2ZhZGUgPSAoZikgPT4gZiAqIGYgKiBmICogKGYgKiAoZiAqIDYgLSAxNSkgKyAxMCk7XG4gICAgICAgIGxldCB0eCA9IF9mYWRlKHgpO1xuICAgICAgICByZXR1cm4gTnVtLmxlcnAoTnVtLmxlcnAobjAwLCBuMTAsIHR4KSwgTnVtLmxlcnAobjAxLCBuMTEsIHR4KSwgX2ZhZGUoeSkpO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBEZWxhdW5heSBleHRlbmRzIEdyb3VwIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5fbWVzaCA9IFtdO1xuICAgIH1cbiAgICBkZWxhdW5heSh0cmlhbmdsZU9ubHkgPSB0cnVlKSB7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA8IDMpXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHRoaXMuX21lc2ggPSBbXTtcbiAgICAgICAgbGV0IG4gPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgbGV0IGluZGljZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspXG4gICAgICAgICAgICBpbmRpY2VzW2ldID0gaTtcbiAgICAgICAgaW5kaWNlcy5zb3J0KChpLCBqKSA9PiB0aGlzW2pdWzBdIC0gdGhpc1tpXVswXSk7XG4gICAgICAgIGxldCBwdHMgPSB0aGlzLnNsaWNlKCk7XG4gICAgICAgIGxldCBzdCA9IHRoaXMuX3N1cGVyVHJpYW5nbGUoKTtcbiAgICAgICAgcHRzID0gcHRzLmNvbmNhdChzdCk7XG4gICAgICAgIGxldCBvcGVuZWQgPSBbdGhpcy5fY2lyY3VtKG4sIG4gKyAxLCBuICsgMiwgc3QpXTtcbiAgICAgICAgbGV0IGNsb3NlZCA9IFtdO1xuICAgICAgICBsZXQgdHJpcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gaW5kaWNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IGMgPSBpbmRpY2VzW2ldO1xuICAgICAgICAgICAgbGV0IGVkZ2VzID0gW107XG4gICAgICAgICAgICBsZXQgaiA9IG9wZW5lZC5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX21lc2hbY10pXG4gICAgICAgICAgICAgICAgdGhpcy5fbWVzaFtjXSA9IHt9O1xuICAgICAgICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICAgICAgICAgIGxldCBjaXJjdW0gPSBvcGVuZWRbal07XG4gICAgICAgICAgICAgICAgbGV0IHJhZGl1cyA9IGNpcmN1bS5jaXJjbGVbMV1bMF07XG4gICAgICAgICAgICAgICAgbGV0IGQgPSBwdHNbY10uJHN1YnRyYWN0KGNpcmN1bS5jaXJjbGVbMF0pO1xuICAgICAgICAgICAgICAgIGlmIChkWzBdID4gMCAmJiBkWzBdICogZFswXSA+IHJhZGl1cyAqIHJhZGl1cykge1xuICAgICAgICAgICAgICAgICAgICBjbG9zZWQucHVzaChjaXJjdW0pO1xuICAgICAgICAgICAgICAgICAgICB0cmlzLnB1c2goY2lyY3VtLnRyaWFuZ2xlKTtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmVkLnNwbGljZShqLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkWzBdICogZFswXSArIGRbMV0gKiBkWzFdIC0gcmFkaXVzICogcmFkaXVzID4gQ29uc3QuZXBzaWxvbikge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWRnZXMucHVzaChjaXJjdW0uaSwgY2lyY3VtLmosIGNpcmN1bS5qLCBjaXJjdW0uaywgY2lyY3VtLmssIGNpcmN1bS5pKTtcbiAgICAgICAgICAgICAgICBvcGVuZWQuc3BsaWNlKGosIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRGVsYXVuYXkuX2RlZHVwZShlZGdlcyk7XG4gICAgICAgICAgICBqID0gZWRnZXMubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKGogPiAxKSB7XG4gICAgICAgICAgICAgICAgb3BlbmVkLnB1c2godGhpcy5fY2lyY3VtKGVkZ2VzWy0tal0sIGVkZ2VzWy0tal0sIGMsIGZhbHNlLCBwdHMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gb3BlbmVkLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbyA9IG9wZW5lZFtpXTtcbiAgICAgICAgICAgIGlmIChvLmkgPCBuICYmIG8uaiA8IG4gJiYgby5rIDwgbikge1xuICAgICAgICAgICAgICAgIGNsb3NlZC5wdXNoKG8pO1xuICAgICAgICAgICAgICAgIHRyaXMucHVzaChvLnRyaWFuZ2xlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHRyaWFuZ2xlT25seSkgPyB0cmlzIDogY2xvc2VkO1xuICAgIH1cbiAgICB2b3Jvbm9pKCkge1xuICAgICAgICBsZXQgdnMgPSBbXTtcbiAgICAgICAgbGV0IG4gPSB0aGlzLl9tZXNoO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdnMucHVzaCh0aGlzLm5laWdoYm9yUHRzKGksIHRydWUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdnM7XG4gICAgfVxuICAgIG1lc2goKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tZXNoO1xuICAgIH1cbiAgICBuZWlnaGJvclB0cyhpLCBzb3J0ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IGNzID0gbmV3IEdyb3VwKCk7XG4gICAgICAgIGxldCBuID0gdGhpcy5fbWVzaDtcbiAgICAgICAgZm9yIChsZXQgayBpbiBuW2ldKSB7XG4gICAgICAgICAgICBpZiAobltpXS5oYXNPd25Qcm9wZXJ0eShrKSlcbiAgICAgICAgICAgICAgICBjcy5wdXNoKG5baV1ba10uY2lyY2xlWzBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHNvcnQpID8gR2VvbS5zb3J0RWRnZXMoY3MpIDogY3M7XG4gICAgfVxuICAgIG5laWdoYm9ycyhpKSB7XG4gICAgICAgIGxldCBjcyA9IFtdO1xuICAgICAgICBsZXQgbiA9IHRoaXMuX21lc2g7XG4gICAgICAgIGZvciAobGV0IGsgaW4gbltpXSkge1xuICAgICAgICAgICAgaWYgKG5baV0uaGFzT3duUHJvcGVydHkoaykpXG4gICAgICAgICAgICAgICAgY3MucHVzaChuW2ldW2tdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3M7XG4gICAgfVxuICAgIF9jYWNoZShvKSB7XG4gICAgICAgIHRoaXMuX21lc2hbby5pXVtgJHtNYXRoLm1pbihvLmosIG8uayl9LSR7TWF0aC5tYXgoby5qLCBvLmspfWBdID0gbztcbiAgICAgICAgdGhpcy5fbWVzaFtvLmpdW2Ake01hdGgubWluKG8uaSwgby5rKX0tJHtNYXRoLm1heChvLmksIG8uayl9YF0gPSBvO1xuICAgICAgICB0aGlzLl9tZXNoW28ua11bYCR7TWF0aC5taW4oby5pLCBvLmopfS0ke01hdGgubWF4KG8uaSwgby5qKX1gXSA9IG87XG4gICAgfVxuICAgIF9zdXBlclRyaWFuZ2xlKCkge1xuICAgICAgICBsZXQgbWluUHQgPSB0aGlzWzBdO1xuICAgICAgICBsZXQgbWF4UHQgPSB0aGlzWzBdO1xuICAgICAgICBmb3IgKGxldCBpID0gMSwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbWluUHQgPSBtaW5QdC4kbWluKHRoaXNbaV0pO1xuICAgICAgICAgICAgbWF4UHQgPSBtYXhQdC4kbWF4KHRoaXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkID0gbWF4UHQuJHN1YnRyYWN0KG1pblB0KTtcbiAgICAgICAgbGV0IG1pZCA9IG1pblB0LiRhZGQobWF4UHQpLmRpdmlkZSgyKTtcbiAgICAgICAgbGV0IGRtYXggPSBNYXRoLm1heChkWzBdLCBkWzFdKTtcbiAgICAgICAgcmV0dXJuIG5ldyBHcm91cChtaWQuJHN1YnRyYWN0KDIwICogZG1heCwgZG1heCksIG1pZC4kYWRkKDAsIDIwICogZG1heCksIG1pZC4kYWRkKDIwICogZG1heCwgLWRtYXgpKTtcbiAgICB9XG4gICAgX3RyaWFuZ2xlKGksIGosIGssIHB0cyA9IHRoaXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBHcm91cChwdHNbaV0sIHB0c1tqXSwgcHRzW2tdKTtcbiAgICB9XG4gICAgX2NpcmN1bShpLCBqLCBrLCB0cmksIHB0cyA9IHRoaXMpIHtcbiAgICAgICAgbGV0IHQgPSB0cmkgfHwgdGhpcy5fdHJpYW5nbGUoaSwgaiwgaywgcHRzKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGk6IGksXG4gICAgICAgICAgICBqOiBqLFxuICAgICAgICAgICAgazogayxcbiAgICAgICAgICAgIHRyaWFuZ2xlOiB0LFxuICAgICAgICAgICAgY2lyY2xlOiBUcmlhbmdsZS5jaXJjdW1jaXJjbGUodClcbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3RhdGljIF9kZWR1cGUoZWRnZXMpIHtcbiAgICAgICAgbGV0IGogPSBlZGdlcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChqID4gMSkge1xuICAgICAgICAgICAgbGV0IGIgPSBlZGdlc1stLWpdO1xuICAgICAgICAgICAgbGV0IGEgPSBlZGdlc1stLWpdO1xuICAgICAgICAgICAgbGV0IGkgPSBqO1xuICAgICAgICAgICAgd2hpbGUgKGkgPiAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IG4gPSBlZGdlc1stLWldO1xuICAgICAgICAgICAgICAgIGxldCBtID0gZWRnZXNbLS1pXTtcbiAgICAgICAgICAgICAgICBpZiAoKGEgPT0gbSAmJiBiID09IG4pIHx8IChhID09IG4gJiYgYiA9PSBtKSkge1xuICAgICAgICAgICAgICAgICAgICBlZGdlcy5zcGxpY2UoaiwgMik7XG4gICAgICAgICAgICAgICAgICAgIGVkZ2VzLnNwbGljZShpLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlZGdlcztcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1DcmVhdGUuanMubWFwIiwiLyohIFNvdXJjZSBjb2RlIGxpY2Vuc2VkIHVuZGVyIEFwYWNoZSBMaWNlbnNlIDIuMC4gQ29weXJpZ2h0IMKpIDIwMTctY3VycmVudCBXaWxsaWFtIE5nYW4gYW5kIGNvbnRyaWJ1dG9ycy4gKGh0dHBzOi8vZ2l0aHViLmNvbS93aWxsaWFtbmdhbi9wdHMpICovXG5pbXBvcnQgeyBNdWx0aVRvdWNoU3BhY2UgfSBmcm9tICcuL1NwYWNlJztcbmltcG9ydCB7IFZpc3VhbEZvcm0sIEZvbnQgfSBmcm9tIFwiLi9Gb3JtXCI7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi9VdGlsJztcbmltcG9ydCB7IFB0LCBCb3VuZCB9IGZyb20gJy4vUHQnO1xuZXhwb3J0IGNsYXNzIERPTVNwYWNlIGV4dGVuZHMgTXVsdGlUb3VjaFNwYWNlIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtLCBjYWxsYmFjaykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlkID0gXCJkb21zcGFjZVwiO1xuICAgICAgICB0aGlzLl9hdXRvUmVzaXplID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fYmdjb2xvciA9IFwiI2UxZTlmMFwiO1xuICAgICAgICB0aGlzLl9jc3MgPSB7fTtcbiAgICAgICAgdmFyIF9zZWxlY3RvciA9IG51bGw7XG4gICAgICAgIHZhciBfZXhpc3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlkID0gXCJwdHNcIjtcbiAgICAgICAgaWYgKGVsZW0gaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgICAgICBfc2VsZWN0b3IgPSBlbGVtO1xuICAgICAgICAgICAgdGhpcy5pZCA9IFwicHRzX2V4aXN0aW5nX3NwYWNlXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBfc2VsZWN0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW0pO1xuICAgICAgICAgICAgX2V4aXN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5pZCA9IGVsZW0uc3Vic3RyKDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghX3NlbGVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIgPSBET01TcGFjZS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwicHRzX2NvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIHRoaXMuX2NhbnZhcyA9IERPTVNwYWNlLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJwdHNfZWxlbWVudFwiKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl9jYW52YXMpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9jb250YWluZXIpO1xuICAgICAgICAgICAgX2V4aXN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbnZhcyA9IF9zZWxlY3RvcjtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IF9zZWxlY3Rvci5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQodGhpcy5fcmVhZHkuYmluZCh0aGlzLCBjYWxsYmFjayksIDUwKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZUVsZW1lbnQoZWxlbSA9IFwiZGl2XCIsIGlkLCBhcHBlbmRUbykge1xuICAgICAgICBsZXQgZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbSk7XG4gICAgICAgIGlmIChpZClcbiAgICAgICAgICAgIGQuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgICAgICBpZiAoYXBwZW5kVG8gJiYgYXBwZW5kVG8uYXBwZW5kQ2hpbGQpXG4gICAgICAgICAgICBhcHBlbmRUby5hcHBlbmRDaGlsZChkKTtcbiAgICAgICAgcmV0dXJuIGQ7XG4gICAgfVxuICAgIF9yZWFkeShjYWxsYmFjaykge1xuICAgICAgICBpZiAoIXRoaXMuX2NvbnRhaW5lcilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGluaXRpYXRlICMke3RoaXMuaWR9IGVsZW1lbnRgKTtcbiAgICAgICAgdGhpcy5faXNSZWFkeSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3Jlc2l6ZUhhbmRsZXIobnVsbCk7XG4gICAgICAgIHRoaXMuY2xlYXIodGhpcy5fYmdjb2xvcik7XG4gICAgICAgIHRoaXMuX2NhbnZhcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInJlYWR5XCIpKTtcbiAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLnBsYXllcnMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcnMuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2tdLnN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnNba10uc3RhcnQodGhpcy5ib3VuZC5jbG9uZSgpLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wb2ludGVyID0gdGhpcy5jZW50ZXI7XG4gICAgICAgIHRoaXMucmVmcmVzaChmYWxzZSk7XG4gICAgICAgIGlmIChjYWxsYmFjaylcbiAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMuYm91bmQsIHRoaXMuX2NhbnZhcyk7XG4gICAgfVxuICAgIHNldHVwKG9wdCkge1xuICAgICAgICBpZiAob3B0LmJnY29sb3IpIHtcbiAgICAgICAgICAgIHRoaXMuX2JnY29sb3IgPSBvcHQuYmdjb2xvcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmF1dG9SZXNpemUgPSAob3B0LnJlc2l6ZSAhPSB1bmRlZmluZWQpID8gb3B0LnJlc2l6ZSA6IGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZ2V0Rm9ybSgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHNldCBhdXRvUmVzaXplKGF1dG8pIHtcbiAgICAgICAgdGhpcy5fYXV0b1Jlc2l6ZSA9IGF1dG87XG4gICAgICAgIGlmIChhdXRvKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplSGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jc3NbJ3dpZHRoJ107XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fY3NzWydoZWlnaHQnXTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBhdXRvUmVzaXplKCkgeyByZXR1cm4gdGhpcy5fYXV0b1Jlc2l6ZTsgfVxuICAgIHJlc2l6ZShiLCBldnQpIHtcbiAgICAgICAgdGhpcy5ib3VuZCA9IGI7XG4gICAgICAgIHRoaXMuc3R5bGVzKHsgd2lkdGg6IGAke2Iud2lkdGh9cHhgLCBoZWlnaHQ6IGAke2IuaGVpZ2h0fXB4YCB9LCB0cnVlKTtcbiAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLnBsYXllcnMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcnMuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICBsZXQgcCA9IHRoaXMucGxheWVyc1trXTtcbiAgICAgICAgICAgICAgICBpZiAocC5yZXNpemUpXG4gICAgICAgICAgICAgICAgICAgIHAucmVzaXplKHRoaXMuYm91bmQsIGV2dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIF9yZXNpemVIYW5kbGVyKGV2dCkge1xuICAgICAgICBsZXQgYiA9IEJvdW5kLmZyb21Cb3VuZGluZ1JlY3QodGhpcy5fY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICAgICAgaWYgKHRoaXMuX2F1dG9SZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVzKHsgd2lkdGg6IFwiMTAwJVwiLCBoZWlnaHQ6IFwiMTAwJVwiIH0sIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdHlsZXMoeyB3aWR0aDogYCR7Yi53aWR0aH1weGAsIGhlaWdodDogYCR7Yi5oZWlnaHR9cHhgIH0sIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzaXplKGIsIGV2dCk7XG4gICAgfVxuICAgIGdldCBlbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FudmFzO1xuICAgIH1cbiAgICBnZXQgcGFyZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyO1xuICAgIH1cbiAgICBnZXQgcmVhZHkoKSB7IHJldHVybiB0aGlzLl9pc1JlYWR5OyB9XG4gICAgY2xlYXIoYmcpIHtcbiAgICAgICAgaWYgKGJnKVxuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gYmc7XG4gICAgICAgIHRoaXMuX2NhbnZhcy5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0IGJhY2tncm91bmQoYmcpIHtcbiAgICAgICAgdGhpcy5fYmdjb2xvciA9IGJnO1xuICAgICAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5fYmdjb2xvcjtcbiAgICB9XG4gICAgZ2V0IGJhY2tncm91bmQoKSB7IHJldHVybiB0aGlzLl9iZ2NvbG9yOyB9XG4gICAgc3R5bGUoa2V5LCB2YWwsIHVwZGF0ZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuX2Nzc1trZXldID0gdmFsO1xuICAgICAgICBpZiAodXBkYXRlKVxuICAgICAgICAgICAgdGhpcy5fY2FudmFzLnN0eWxlW2tleV0gPSB2YWw7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzdHlsZXMoc3R5bGVzLCB1cGRhdGUgPSBmYWxzZSkge1xuICAgICAgICBmb3IgKGxldCBrIGluIHN0eWxlcykge1xuICAgICAgICAgICAgaWYgKHN0eWxlcy5oYXNPd25Qcm9wZXJ0eShrKSlcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlKGssIHN0eWxlc1trXSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhdGljIHNldEF0dHIoZWxlbSwgZGF0YSkge1xuICAgICAgICBmb3IgKGxldCBrIGluIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoaywgZGF0YVtrXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICAgIHN0YXRpYyBnZXRJbmxpbmVTdHlsZXMoZGF0YSkge1xuICAgICAgICBsZXQgc3RyID0gXCJcIjtcbiAgICAgICAgZm9yIChsZXQgayBpbiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhW2tdKVxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gYCR7a306ICR7ZGF0YVtrXX07IGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgZGlzcG9zZSgpIHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUhhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB0aGlzLnJlbW92ZUFsbCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSFRNTFNwYWNlIGV4dGVuZHMgRE9NU3BhY2Uge1xuICAgIGdldEZvcm0oKSB7XG4gICAgICAgIHJldHVybiBuZXcgSFRNTEZvcm0odGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBodG1sRWxlbWVudChwYXJlbnQsIG5hbWUsIGlkLCBhdXRvQ2xhc3MgPSB0cnVlKSB7XG4gICAgICAgIGlmICghcGFyZW50IHx8ICFwYXJlbnQuYXBwZW5kQ2hpbGQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJlbnQgaXMgbm90IGEgdmFsaWQgRE9NIGVsZW1lbnRcIik7XG4gICAgICAgIGxldCBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7aWR9YCk7XG4gICAgICAgIGlmICghZWxlbSkge1xuICAgICAgICAgICAgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSk7XG4gICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImlkXCIsIGlkKTtcbiAgICAgICAgICAgIGlmIChhdXRvQ2xhc3MpXG4gICAgICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBpZC5zdWJzdHJpbmcoMCwgaWQuaW5kZXhPZihcIi1cIikpKTtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbTtcbiAgICB9XG4gICAgcmVtb3ZlKHBsYXllcikge1xuICAgICAgICBsZXQgdGVtcCA9IHRoaXMuX2NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiLlwiICsgSFRNTEZvcm0uc2NvcGVJRChwbGF5ZXIpKTtcbiAgICAgICAgdGVtcC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc3VwZXIucmVtb3ZlKHBsYXllcik7XG4gICAgfVxuICAgIHJlbW92ZUFsbCgpIHtcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIHJldHVybiBzdXBlci5yZW1vdmVBbGwoKTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSFRNTEZvcm0gZXh0ZW5kcyBWaXN1YWxGb3JtIHtcbiAgICBjb25zdHJ1Y3RvcihzcGFjZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9zdHlsZSA9IHtcbiAgICAgICAgICAgIFwiZmlsbGVkXCI6IHRydWUsXG4gICAgICAgICAgICBcInN0cm9rZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZFwiOiBcIiNmMDNcIixcbiAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMwMDBcIixcbiAgICAgICAgICAgIFwiYm9yZGVyLXdpZHRoXCI6IFwiMXB4XCIsXG4gICAgICAgICAgICBcImJvcmRlci1yYWRpdXNcIjogXCIwXCIsXG4gICAgICAgICAgICBcImJvcmRlci1zdHlsZVwiOiBcInNvbGlkXCIsXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogMSxcbiAgICAgICAgICAgIFwicG9zaXRpb25cIjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICAgICAgXCJ0b3BcIjogMCxcbiAgICAgICAgICAgIFwibGVmdFwiOiAwLFxuICAgICAgICAgICAgXCJ3aWR0aFwiOiAwLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogMFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9jdHggPSB7XG4gICAgICAgICAgICBncm91cDogbnVsbCxcbiAgICAgICAgICAgIGdyb3VwSUQ6IFwicHRzXCIsXG4gICAgICAgICAgICBncm91cENvdW50OiAwLFxuICAgICAgICAgICAgY3VycmVudElEOiBcInB0czBcIixcbiAgICAgICAgICAgIGN1cnJlbnRDbGFzczogXCJcIixcbiAgICAgICAgICAgIHN0eWxlOiB7fSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fcmVhZHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc3BhY2UgPSBzcGFjZTtcbiAgICAgICAgdGhpcy5fc3BhY2UuYWRkKHsgc3RhcnQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdHguZ3JvdXAgPSB0aGlzLl9zcGFjZS5lbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2N0eC5ncm91cElEID0gXCJwdHNfZG9tX1wiICsgKEhUTUxGb3JtLmdyb3VwSUQrKyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3R4LnN0eWxlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fc3R5bGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gfSk7XG4gICAgfVxuICAgIGdldCBzcGFjZSgpIHsgcmV0dXJuIHRoaXMuX3NwYWNlOyB9XG4gICAgc3R5bGVUbyhrLCB2LCB1bml0ID0gJycpIHtcbiAgICAgICAgaWYgKHRoaXMuX2N0eC5zdHlsZVtrXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2t9IHN0eWxlIHByb3BlcnR5IGRvZXNuJ3QgZXhpc3RgKTtcbiAgICAgICAgdGhpcy5fY3R4LnN0eWxlW2tdID0gYCR7dn0ke3VuaXR9YDtcbiAgICB9XG4gICAgYWxwaGEoYSkge1xuICAgICAgICB0aGlzLnN0eWxlVG8oXCJvcGFjaXR5XCIsIGEpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZmlsbChjKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYyA9PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgdGhpcy5zdHlsZVRvKFwiZmlsbGVkXCIsIGMpO1xuICAgICAgICAgICAgaWYgKCFjKVxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVUbyhcImJhY2tncm91bmRcIiwgXCJ0cmFuc3BhcmVudFwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVUbyhcImZpbGxlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVUbyhcImJhY2tncm91bmRcIiwgYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0cm9rZShjLCB3aWR0aCwgbGluZWpvaW4sIGxpbmVjYXApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjID09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlVG8oXCJzdHJva2VkXCIsIGMpO1xuICAgICAgICAgICAgaWYgKCFjKVxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVUbyhcImJvcmRlci13aWR0aFwiLCAwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVUbyhcInN0cm9rZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnN0eWxlVG8oXCJib3JkZXItY29sb3JcIiwgYyk7XG4gICAgICAgICAgICB0aGlzLnN0eWxlVG8oXCJib3JkZXItd2lkdGhcIiwgKHdpZHRoIHx8IDEpICsgXCJweFwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZmlsbFRleHQoYykge1xuICAgICAgICB0aGlzLnN0eWxlVG8oXCJjb2xvclwiLCBjKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNscyhjKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYyA9PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgdGhpcy5fY3R4LmN1cnJlbnRDbGFzcyA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jdHguY3VycmVudENsYXNzID0gYztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZm9udChzaXplT3JGb250LCB3ZWlnaHQsIHN0eWxlLCBsaW5lSGVpZ2h0LCBmYW1pbHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaXplT3JGb250ID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQuc2l6ZSA9IHNpemVPckZvbnQ7XG4gICAgICAgICAgICBpZiAoZmFtaWx5KVxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnQuZmFjZSA9IGZhbWlseTtcbiAgICAgICAgICAgIGlmICh3ZWlnaHQpXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udC53ZWlnaHQgPSB3ZWlnaHQ7XG4gICAgICAgICAgICBpZiAoc3R5bGUpXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udC5zdHlsZSA9IHN0eWxlO1xuICAgICAgICAgICAgaWYgKGxpbmVIZWlnaHQpXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udC5saW5lSGVpZ2h0ID0gbGluZUhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSBzaXplT3JGb250O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2N0eC5zdHlsZVsnZm9udCddID0gdGhpcy5fZm9udC52YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl9jdHguc3R5bGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9zdHlsZSk7XG4gICAgICAgIHRoaXMuX2ZvbnQgPSBuZXcgRm9udCgxMCwgXCJzYW5zLXNlcmlmXCIpO1xuICAgICAgICB0aGlzLl9jdHguc3R5bGVbJ2ZvbnQnXSA9IHRoaXMuX2ZvbnQudmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB1cGRhdGVTY29wZShncm91cF9pZCwgZ3JvdXApIHtcbiAgICAgICAgdGhpcy5fY3R4Lmdyb3VwID0gZ3JvdXA7XG4gICAgICAgIHRoaXMuX2N0eC5ncm91cElEID0gZ3JvdXBfaWQ7XG4gICAgICAgIHRoaXMuX2N0eC5ncm91cENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5uZXh0SUQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N0eDtcbiAgICB9XG4gICAgc2NvcGUoaXRlbSkge1xuICAgICAgICBpZiAoIWl0ZW0gfHwgaXRlbS5hbmltYXRlSUQgPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIml0ZW0gbm90IGRlZmluZWQgb3Igbm90IHlldCBhZGRlZCB0byBTcGFjZVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlU2NvcGUoSFRNTEZvcm0uc2NvcGVJRChpdGVtKSwgdGhpcy5zcGFjZS5lbGVtZW50KTtcbiAgICB9XG4gICAgbmV4dElEKCkge1xuICAgICAgICB0aGlzLl9jdHguZ3JvdXBDb3VudCsrO1xuICAgICAgICB0aGlzLl9jdHguY3VycmVudElEID0gYCR7dGhpcy5fY3R4Lmdyb3VwSUR9LSR7dGhpcy5fY3R4Lmdyb3VwQ291bnR9YDtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N0eC5jdXJyZW50SUQ7XG4gICAgfVxuICAgIHN0YXRpYyBnZXRJRChjdHgpIHtcbiAgICAgICAgcmV0dXJuIGN0eC5jdXJyZW50SUQgfHwgYHAtJHtIVE1MRm9ybS5kb21JRCsrfWA7XG4gICAgfVxuICAgIHN0YXRpYyBzY29wZUlEKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGBpdGVtLSR7aXRlbS5hbmltYXRlSUR9YDtcbiAgICB9XG4gICAgc3RhdGljIHN0eWxlKGVsZW0sIHN0eWxlcykge1xuICAgICAgICBsZXQgc3QgPSBbXTtcbiAgICAgICAgaWYgKCFzdHlsZXNbXCJmaWxsZWRcIl0pXG4gICAgICAgICAgICBzdC5wdXNoKFwiYmFja2dyb3VuZDogbm9uZVwiKTtcbiAgICAgICAgaWYgKCFzdHlsZXNbXCJzdHJva2VkXCJdKVxuICAgICAgICAgICAgc3QucHVzaChcImJvcmRlcjogbm9uZVwiKTtcbiAgICAgICAgZm9yIChsZXQgayBpbiBzdHlsZXMpIHtcbiAgICAgICAgICAgIGlmIChzdHlsZXMuaGFzT3duUHJvcGVydHkoaykgJiYgayAhPSBcImZpbGxlZFwiICYmIGsgIT0gXCJzdHJva2VkXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgdiA9IHN0eWxlc1trXTtcbiAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0eWxlc1tcImZpbGxlZFwiXSAmJiBrLmluZGV4T2YoJ2JhY2tncm91bmQnKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIXN0eWxlc1tcInN0cm9rZWRcIl0gJiYgay5pbmRleE9mKCdib3JkZXItd2lkdGgnKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdC5wdXNoKGAke2t9OiAke3Z9YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEhUTUxTcGFjZS5zZXRBdHRyKGVsZW0sIHsgc3R5bGU6IHN0LmpvaW4oXCI7XCIpIH0pO1xuICAgIH1cbiAgICBzdGF0aWMgcmVjdFN0eWxlKGN0eCwgcHQsIHNpemUpIHtcbiAgICAgICAgY3R4LnN0eWxlW1wibGVmdFwiXSA9IHB0WzBdICsgXCJweFwiO1xuICAgICAgICBjdHguc3R5bGVbXCJ0b3BcIl0gPSBwdFsxXSArIFwicHhcIjtcbiAgICAgICAgY3R4LnN0eWxlW1wid2lkdGhcIl0gPSBzaXplWzBdICsgXCJweFwiO1xuICAgICAgICBjdHguc3R5bGVbXCJoZWlnaHRcIl0gPSBzaXplWzFdICsgXCJweFwiO1xuICAgICAgICByZXR1cm4gY3R4O1xuICAgIH1cbiAgICBzdGF0aWMgdGV4dFN0eWxlKGN0eCwgcHQpIHtcbiAgICAgICAgY3R4LnN0eWxlW1wibGVmdFwiXSA9IHB0WzBdICsgXCJweFwiO1xuICAgICAgICBjdHguc3R5bGVbXCJ0b3BcIl0gPSBwdFsxXSArIFwicHhcIjtcbiAgICAgICAgcmV0dXJuIGN0eDtcbiAgICB9XG4gICAgc3RhdGljIHBvaW50KGN0eCwgcHQsIHJhZGl1cyA9IDUsIHNoYXBlID0gXCJzcXVhcmVcIikge1xuICAgICAgICBpZiAoc2hhcGUgPT09IFwiY2lyY2xlXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBIVE1MRm9ybS5jaXJjbGUoY3R4LCBwdCwgcmFkaXVzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBIVE1MRm9ybS5zcXVhcmUoY3R4LCBwdCwgcmFkaXVzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwb2ludChwdCwgcmFkaXVzID0gNSwgc2hhcGUgPSBcInNxdWFyZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dElEKCk7XG4gICAgICAgIGlmIChzaGFwZSA9PSBcImNpcmNsZVwiKVxuICAgICAgICAgICAgdGhpcy5zdHlsZVRvKFwiYm9yZGVyLXJhZGl1c1wiLCBcIjEwMCVcIik7XG4gICAgICAgIEhUTUxGb3JtLnBvaW50KHRoaXMuX2N0eCwgcHQsIHJhZGl1cywgc2hhcGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhdGljIGNpcmNsZShjdHgsIHB0LCByYWRpdXMgPSAxMCkge1xuICAgICAgICBsZXQgZWxlbSA9IEhUTUxTcGFjZS5odG1sRWxlbWVudChjdHguZ3JvdXAsIFwiZGl2XCIsIEhUTUxGb3JtLmdldElEKGN0eCkpO1xuICAgICAgICBIVE1MU3BhY2Uuc2V0QXR0cihlbGVtLCB7IGNsYXNzOiBgcHRzLWZvcm0gcHRzLWNpcmNsZSAke2N0eC5jdXJyZW50Q2xhc3N9YCB9KTtcbiAgICAgICAgSFRNTEZvcm0ucmVjdFN0eWxlKGN0eCwgbmV3IFB0KHB0KS4kc3VidHJhY3QocmFkaXVzKSwgbmV3IFB0KHJhZGl1cyAqIDIsIHJhZGl1cyAqIDIpKTtcbiAgICAgICAgSFRNTEZvcm0uc3R5bGUoZWxlbSwgY3R4LnN0eWxlKTtcbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICAgIGNpcmNsZShwdHMpIHtcbiAgICAgICAgdGhpcy5uZXh0SUQoKTtcbiAgICAgICAgdGhpcy5zdHlsZVRvKFwiYm9yZGVyLXJhZGl1c1wiLCBcIjEwMCVcIik7XG4gICAgICAgIEhUTUxGb3JtLmNpcmNsZSh0aGlzLl9jdHgsIHB0c1swXSwgcHRzWzFdWzBdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0YXRpYyBzcXVhcmUoY3R4LCBwdCwgaGFsZnNpemUpIHtcbiAgICAgICAgbGV0IGVsZW0gPSBIVE1MU3BhY2UuaHRtbEVsZW1lbnQoY3R4Lmdyb3VwLCBcImRpdlwiLCBIVE1MRm9ybS5nZXRJRChjdHgpKTtcbiAgICAgICAgSFRNTFNwYWNlLnNldEF0dHIoZWxlbSwgeyBjbGFzczogYHB0cy1mb3JtIHB0cy1zcXVhcmUgJHtjdHguY3VycmVudENsYXNzfWAgfSk7XG4gICAgICAgIEhUTUxGb3JtLnJlY3RTdHlsZShjdHgsIG5ldyBQdChwdCkuJHN1YnRyYWN0KGhhbGZzaXplKSwgbmV3IFB0KGhhbGZzaXplICogMiwgaGFsZnNpemUgKiAyKSk7XG4gICAgICAgIEhUTUxGb3JtLnN0eWxlKGVsZW0sIGN0eC5zdHlsZSk7XG4gICAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cbiAgICBzcXVhcmUocHQsIGhhbGZzaXplKSB7XG4gICAgICAgIHRoaXMubmV4dElEKCk7XG4gICAgICAgIEhUTUxGb3JtLnNxdWFyZSh0aGlzLl9jdHgsIHB0LCBoYWxmc2l6ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzdGF0aWMgcmVjdChjdHgsIHB0cykge1xuICAgICAgICBpZiAoIXRoaXMuX2NoZWNrU2l6ZShwdHMpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsZXQgZWxlbSA9IEhUTUxTcGFjZS5odG1sRWxlbWVudChjdHguZ3JvdXAsIFwiZGl2XCIsIEhUTUxGb3JtLmdldElEKGN0eCkpO1xuICAgICAgICBIVE1MU3BhY2Uuc2V0QXR0cihlbGVtLCB7IGNsYXNzOiBgcHRzLWZvcm0gcHRzLXJlY3QgJHtjdHguY3VycmVudENsYXNzfWAgfSk7XG4gICAgICAgIEhUTUxGb3JtLnJlY3RTdHlsZShjdHgsIHB0c1swXSwgcHRzWzFdKTtcbiAgICAgICAgSFRNTEZvcm0uc3R5bGUoZWxlbSwgY3R4LnN0eWxlKTtcbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICAgIHJlY3QocHRzKSB7XG4gICAgICAgIHRoaXMubmV4dElEKCk7XG4gICAgICAgIHRoaXMuc3R5bGVUbyhcImJvcmRlci1yYWRpdXNcIiwgXCIwXCIpO1xuICAgICAgICBIVE1MRm9ybS5yZWN0KHRoaXMuX2N0eCwgcHRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0YXRpYyB0ZXh0KGN0eCwgcHQsIHR4dCkge1xuICAgICAgICBsZXQgZWxlbSA9IEhUTUxTcGFjZS5odG1sRWxlbWVudChjdHguZ3JvdXAsIFwiZGl2XCIsIEhUTUxGb3JtLmdldElEKGN0eCkpO1xuICAgICAgICBIVE1MU3BhY2Uuc2V0QXR0cihlbGVtLCB7IGNsYXNzOiBgcHRzLWZvcm0gcHRzLXRleHQgJHtjdHguY3VycmVudENsYXNzfWAgfSk7XG4gICAgICAgIGVsZW0udGV4dENvbnRlbnQgPSB0eHQ7XG4gICAgICAgIEhUTUxGb3JtLnRleHRTdHlsZShjdHgsIHB0KTtcbiAgICAgICAgSFRNTEZvcm0uc3R5bGUoZWxlbSwgY3R4LnN0eWxlKTtcbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICAgIHRleHQocHQsIHR4dCkge1xuICAgICAgICB0aGlzLm5leHRJRCgpO1xuICAgICAgICBIVE1MRm9ybS50ZXh0KHRoaXMuX2N0eCwgcHQsIHR4dCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBsb2codHh0KSB7XG4gICAgICAgIHRoaXMuZmlsbChcIiMwMDBcIikuc3Ryb2tlKFwiI2ZmZlwiLCAwLjUpLnRleHQoWzEwLCAxNF0sIHR4dCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBhcmMocHQsIHJhZGl1cywgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGNjKSB7XG4gICAgICAgIFV0aWwud2FybihcImFyYyBpcyBub3QgaW1wbGVtZW50ZWQgaW4gSFRNTEZvcm1cIik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBsaW5lKHB0cykge1xuICAgICAgICBVdGlsLndhcm4oXCJsaW5lIGlzIG5vdCBpbXBsZW1lbnRlZCBpbiBIVE1MRm9ybVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHBvbHlnb24ocHRzKSB7XG4gICAgICAgIFV0aWwud2FybihcInBvbHlnb24gaXMgbm90IGltcGxlbWVudGVkIGluIEhUTUxGb3JtXCIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5IVE1MRm9ybS5ncm91cElEID0gMDtcbkhUTUxGb3JtLmRvbUlEID0gMDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURvbS5qcy5tYXAiLCIvKiEgU291cmNlIGNvZGUgbGljZW5zZWQgdW5kZXIgQXBhY2hlIExpY2Vuc2UgMi4wLiBDb3B5cmlnaHQgwqkgMjAxNy1jdXJyZW50IFdpbGxpYW0gTmdhbiBhbmQgY29udHJpYnV0b3JzLiAoaHR0cHM6Ly9naXRodWIuY29tL3dpbGxpYW1uZ2FuL3B0cykgKi9cbmltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi9VdGlsXCI7XG5leHBvcnQgY2xhc3MgRm9ybSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3JlYWR5ID0gZmFsc2U7XG4gICAgfVxuICAgIGdldCByZWFkeSgpIHsgcmV0dXJuIHRoaXMuX3JlYWR5OyB9XG4gICAgc3RhdGljIF9jaGVja1NpemUocHRzLCByZXF1aXJlZCA9IDIpIHtcbiAgICAgICAgaWYgKHB0cy5sZW5ndGggPCByZXF1aXJlZCkge1xuICAgICAgICAgICAgVXRpbC53YXJuKFwiUmVxdWlyZXMgMiBvciBtb3JlIFB0cyBpbiB0aGlzIEdyb3VwLlwiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgVmlzdWFsRm9ybSBleHRlbmRzIEZvcm0ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLl9maWxsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9zdHJva2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fZm9udCA9IG5ldyBGb250KDE0LCBcInNhbnMtc2VyaWZcIik7XG4gICAgfVxuICAgIGdldCBmaWxsZWQoKSB7IHJldHVybiB0aGlzLl9maWxsZWQ7IH1cbiAgICBzZXQgZmlsbGVkKGIpIHsgdGhpcy5fZmlsbGVkID0gYjsgfVxuICAgIGdldCBzdHJva2VkKCkgeyByZXR1cm4gdGhpcy5fc3Ryb2tlZDsgfVxuICAgIHNldCBzdHJva2VkKGIpIHsgdGhpcy5fc3Ryb2tlZCA9IGI7IH1cbiAgICBnZXQgY3VycmVudEZvbnQoKSB7IHJldHVybiB0aGlzLl9mb250OyB9XG4gICAgX211bHRpcGxlKGdyb3Vwcywgc2hhcGUsIC4uLnJlc3QpIHtcbiAgICAgICAgaWYgKCFncm91cHMpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGdyb3Vwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdGhpc1tzaGFwZV0oZ3JvdXBzW2ldLCAuLi5yZXN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgYWxwaGEoYSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZmlsbChjKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBmaWxsT25seShjKSB7XG4gICAgICAgIHRoaXMuc3Ryb2tlKGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsbChjKTtcbiAgICB9XG4gICAgc3Ryb2tlKGMsIHdpZHRoLCBsaW5lam9pbiwgbGluZWNhcCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3Ryb2tlT25seShjLCB3aWR0aCwgbGluZWpvaW4sIGxpbmVjYXApIHtcbiAgICAgICAgdGhpcy5maWxsKGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Ryb2tlKGMsIHdpZHRoLCBsaW5lam9pbiwgbGluZWNhcCk7XG4gICAgfVxuICAgIHBvaW50cyhwdHMsIHJhZGl1cywgc2hhcGUpIHtcbiAgICAgICAgaWYgKCFwdHMpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBwdHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucG9pbnQocHRzW2ldLCByYWRpdXMsIHNoYXBlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgY2lyY2xlcyhncm91cHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX211bHRpcGxlKGdyb3VwcywgXCJjaXJjbGVcIik7XG4gICAgfVxuICAgIHNxdWFyZXMoZ3JvdXBzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tdWx0aXBsZShncm91cHMsIFwic3F1YXJlXCIpO1xuICAgIH1cbiAgICBsaW5lcyhncm91cHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX211bHRpcGxlKGdyb3VwcywgXCJsaW5lXCIpO1xuICAgIH1cbiAgICBwb2x5Z29ucyhncm91cHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX211bHRpcGxlKGdyb3VwcywgXCJwb2x5Z29uXCIpO1xuICAgIH1cbiAgICByZWN0cyhncm91cHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX211bHRpcGxlKGdyb3VwcywgXCJyZWN0XCIpO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBGb250IHtcbiAgICBjb25zdHJ1Y3RvcihzaXplID0gMTIsIGZhY2UgPSBcInNhbnMtc2VyaWZcIiwgd2VpZ2h0ID0gXCJcIiwgc3R5bGUgPSBcIlwiLCBsaW5lSGVpZ2h0ID0gMS41KSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gICAgICAgIHRoaXMuZmFjZSA9IGZhY2U7XG4gICAgICAgIHRoaXMuc3R5bGUgPSBzdHlsZTtcbiAgICAgICAgdGhpcy53ZWlnaHQgPSB3ZWlnaHQ7XG4gICAgICAgIHRoaXMubGluZUhlaWdodCA9IGxpbmVIZWlnaHQ7XG4gICAgfVxuICAgIGdldCB2YWx1ZSgpIHsgcmV0dXJuIGAke3RoaXMuc3R5bGV9ICR7dGhpcy53ZWlnaHR9ICR7dGhpcy5zaXplfXB4LyR7dGhpcy5saW5lSGVpZ2h0fSAke3RoaXMuZmFjZX1gOyB9XG4gICAgdG9TdHJpbmcoKSB7IHJldHVybiB0aGlzLnZhbHVlOyB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Gb3JtLmpzLm1hcCIsIi8qISBTb3VyY2UgY29kZSBsaWNlbnNlZCB1bmRlciBBcGFjaGUgTGljZW5zZSAyLjAuIENvcHlyaWdodCDCqSAyMDE3LWN1cnJlbnQgV2lsbGlhbSBOZ2FuIGFuZCBjb250cmlidXRvcnMuIChodHRwczovL2dpdGh1Yi5jb20vd2lsbGlhbW5nYW4vcHRzKSAqL1xuaW1wb3J0IHsgUHQsIEdyb3VwIH0gZnJvbSBcIi4vUHRcIjtcbmltcG9ydCB7IExpbmUgfSBmcm9tIFwiLi9PcFwiO1xuZXhwb3J0IGNsYXNzIFZlYyB7XG4gICAgc3RhdGljIGFkZChhLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYS5sZW5ndGg7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICAgICAgICBhW2ldICs9IGI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYS5sZW5ndGg7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICAgICAgICBhW2ldICs9IGJbaV0gfHwgMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgc3RhdGljIHN1YnRyYWN0KGEsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgICAgICAgIGFbaV0gLT0gYjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgICAgICAgIGFbaV0gLT0gYltpXSB8fCAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBzdGF0aWMgbXVsdGlwbHkoYSwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgYVtpXSAqPSBiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGEubGVuZ3RoICE9IGIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZG8gZWxlbWVudC13aXNlIG11bHRpcGx5IHNpbmNlIHRoZSBhcnJheSBsZW5ndGhzIGRvbid0IG1hdGNoOiAke2EudG9TdHJpbmcoKX0gbXVsdGlwbHktd2l0aCAke2IudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgICAgICAgIGFbaV0gKj0gYltpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgc3RhdGljIGRpdmlkZShhLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBpZiAoYiA9PT0gMClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZGl2aWRlIGJ5IHplcm9cIik7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYS5sZW5ndGg7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICAgICAgICBhW2ldIC89IGI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoYS5sZW5ndGggIT0gYi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBkbyBlbGVtZW50LXdpc2UgZGl2aWRlIHNpbmNlIHRoZSBhcnJheSBsZW5ndGhzIGRvbid0IG1hdGNoLiAke2EudG9TdHJpbmcoKX0gZGl2aWRlLWJ5ICR7Yi50b1N0cmluZygpfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgYVtpXSAvPSBiW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBzdGF0aWMgZG90KGEsIGIpIHtcbiAgICAgICAgaWYgKGEubGVuZ3RoICE9IGIubGVuZ3RoKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXJyYXkgbGVuZ3RocyBkb24ndCBtYXRjaFwiKTtcbiAgICAgICAgbGV0IGQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgZCArPSBhW2ldICogYltpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZDtcbiAgICB9XG4gICAgc3RhdGljIGNyb3NzMkQoYSwgYikge1xuICAgICAgICByZXR1cm4gYVswXSAqIGJbMV0gLSBhWzFdICogYlswXTtcbiAgICB9XG4gICAgc3RhdGljIGNyb3NzKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQdCgoYVsxXSAqIGJbMl0gLSBhWzJdICogYlsxXSksIChhWzJdICogYlswXSAtIGFbMF0gKiBiWzJdKSwgKGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF0pKTtcbiAgICB9XG4gICAgc3RhdGljIG1hZ25pdHVkZShhKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoVmVjLmRvdChhLCBhKSk7XG4gICAgfVxuICAgIHN0YXRpYyB1bml0KGEsIG1hZ25pdHVkZSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgbSA9IChtYWduaXR1ZGUgPT09IHVuZGVmaW5lZCkgPyBWZWMubWFnbml0dWRlKGEpIDogbWFnbml0dWRlO1xuICAgICAgICBpZiAobSA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiBQdC5tYWtlKGEubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIFZlYy5kaXZpZGUoYSwgbSk7XG4gICAgfVxuICAgIHN0YXRpYyBhYnMoYSkge1xuICAgICAgICByZXR1cm4gVmVjLm1hcChhLCBNYXRoLmFicyk7XG4gICAgfVxuICAgIHN0YXRpYyBmbG9vcihhKSB7XG4gICAgICAgIHJldHVybiBWZWMubWFwKGEsIE1hdGguZmxvb3IpO1xuICAgIH1cbiAgICBzdGF0aWMgY2VpbChhKSB7XG4gICAgICAgIHJldHVybiBWZWMubWFwKGEsIE1hdGguY2VpbCk7XG4gICAgfVxuICAgIHN0YXRpYyByb3VuZChhKSB7XG4gICAgICAgIHJldHVybiBWZWMubWFwKGEsIE1hdGgucm91bmQpO1xuICAgIH1cbiAgICBzdGF0aWMgbWF4KGEpIHtcbiAgICAgICAgbGV0IG0gPSBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbSA9IE1hdGgubWF4KG0sIGFbaV0pO1xuICAgICAgICAgICAgaWYgKG0gPT09IGFbaV0pXG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHZhbHVlOiBtLCBpbmRleDogaW5kZXggfTtcbiAgICB9XG4gICAgc3RhdGljIG1pbihhKSB7XG4gICAgICAgIGxldCBtID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIG0gPSBNYXRoLm1pbihtLCBhW2ldKTtcbiAgICAgICAgICAgIGlmIChtID09PSBhW2ldKVxuICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyB2YWx1ZTogbSwgaW5kZXg6IGluZGV4IH07XG4gICAgfVxuICAgIHN0YXRpYyBzdW0oYSkge1xuICAgICAgICBsZXQgcyA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgICAgcyArPSBhW2ldO1xuICAgICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgc3RhdGljIG1hcChhLCBmbikge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgYVtpXSA9IGZuKGFbaV0sIGksIGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBNYXQge1xuICAgIHN0YXRpYyBhZGQoYSwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgaWYgKGFbMF0ubGVuZ3RoICE9IGJbMF0ubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhZGQgbWF0cml4IGlmIHJvd3MnIGFuZCBjb2x1bW5zJyBzaXplIGRvbid0IG1hdGNoLlwiKTtcbiAgICAgICAgICAgIGlmIChhLmxlbmd0aCAhPSBiLmxlbmd0aClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYWRkIG1hdHJpeCBpZiByb3dzJyBhbmQgY29sdW1ucycgc2l6ZSBkb24ndCBtYXRjaC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGcgPSBuZXcgR3JvdXAoKTtcbiAgICAgICAgbGV0IGlzTnVtID0gdHlwZW9mIGIgPT0gXCJudW1iZXJcIjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGcucHVzaChhW2ldLiRhZGQoKGlzTnVtKSA/IGIgOiBiW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGc7XG4gICAgfVxuICAgIHN0YXRpYyBtdWx0aXBseShhLCBiLCB0cmFuc3Bvc2VkID0gZmFsc2UsIGVsZW1lbnR3aXNlID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IGcgPSBuZXcgR3JvdXAoKTtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50d2lzZSkge1xuICAgICAgICAgICAgICAgIGlmIChhLmxlbmd0aCAhPSBiLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IG11bHRpcGx5IG1hdHJpeCBlbGVtZW50LXdpc2UgYmVjYXVzZSB0aGUgbWF0cmljZXMnIHNpemVzIGRvbid0IG1hdGNoLlwiKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhaSA9IDAsIGFsZW4gPSBhLmxlbmd0aDsgYWkgPCBhbGVuOyBhaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGcucHVzaChhW2FpXS4kbXVsdGlwbHkoYlthaV0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRyYW5zcG9zZWQgJiYgYVswXS5sZW5ndGggIT0gYi5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBtdWx0aXBseSBtYXRyaXggaWYgcm93cyBpbiBtYXRyaXgtYSBkb24ndCBtYXRjaCBjb2x1bW5zIGluIG1hdHJpeC1iLlwiKTtcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNwb3NlZCAmJiBhWzBdLmxlbmd0aCAhPSBiWzBdLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IG11bHRpcGx5IG1hdHJpeCBpZiB0cmFuc3Bvc2VkIGFuZCB0aGUgY29sdW1ucyBpbiBib3RoIG1hdHJpY2VzIGRvbid0IG1hdGNoLlwiKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRyYW5zcG9zZWQpXG4gICAgICAgICAgICAgICAgICAgIGIgPSBNYXQudHJhbnNwb3NlKGIpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGFpID0gMCwgYWxlbiA9IGEubGVuZ3RoOyBhaSA8IGFsZW47IGFpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBQdC5tYWtlKGIubGVuZ3RoLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYmkgPSAwLCBibGVuID0gYi5sZW5ndGg7IGJpIDwgYmxlbjsgYmkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcFtiaV0gPSBWZWMuZG90KGFbYWldLCBiW2JpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZy5wdXNoKHApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGFpID0gMCwgYWxlbiA9IGEubGVuZ3RoOyBhaSA8IGFsZW47IGFpKyspIHtcbiAgICAgICAgICAgICAgICBnLnB1c2goYVthaV0uJG11bHRpcGx5KGIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZztcbiAgICB9XG4gICAgc3RhdGljIHppcFNsaWNlKGcsIGluZGV4LCBkZWZhdWx0VmFsdWUgPSBmYWxzZSkge1xuICAgICAgICBsZXQgeiA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gZy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGdbaV0ubGVuZ3RoIC0gMSA8IGluZGV4ICYmIGRlZmF1bHRWYWx1ZSA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgdGhyb3cgYEluZGV4ICR7aW5kZXh9IGlzIG91dCBvZiBib3VuZHNgO1xuICAgICAgICAgICAgei5wdXNoKGdbaV1baW5kZXhdIHx8IGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQdCh6KTtcbiAgICB9XG4gICAgc3RhdGljIHppcChnLCBkZWZhdWx0VmFsdWUgPSBmYWxzZSwgdXNlTG9uZ2VzdCA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBwcyA9IG5ldyBHcm91cCgpO1xuICAgICAgICBsZXQgbGVuID0gKHVzZUxvbmdlc3QpID8gZy5yZWR1Y2UoKGEsIGIpID0+IE1hdGgubWF4KGEsIGIubGVuZ3RoKSwgMCkgOiBnWzBdLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgcHMucHVzaChNYXQuemlwU2xpY2UoZywgaSwgZGVmYXVsdFZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBzO1xuICAgIH1cbiAgICBzdGF0aWMgdHJhbnNwb3NlKGcsIGRlZmF1bHRWYWx1ZSA9IGZhbHNlLCB1c2VMb25nZXN0ID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIE1hdC56aXAoZywgZGVmYXVsdFZhbHVlLCB1c2VMb25nZXN0KTtcbiAgICB9XG4gICAgc3RhdGljIHRyYW5zZm9ybTJEKHB0LCBtKSB7XG4gICAgICAgIGxldCB4ID0gcHRbMF0gKiBtWzBdWzBdICsgcHRbMV0gKiBtWzFdWzBdICsgbVsyXVswXTtcbiAgICAgICAgbGV0IHkgPSBwdFswXSAqIG1bMF1bMV0gKyBwdFsxXSAqIG1bMV1bMV0gKyBtWzJdWzFdO1xuICAgICAgICByZXR1cm4gbmV3IFB0KHgsIHkpO1xuICAgIH1cbiAgICBzdGF0aWMgc2NhbGUyRE1hdHJpeCh4LCB5KSB7XG4gICAgICAgIHJldHVybiBuZXcgR3JvdXAobmV3IFB0KHgsIDAsIDApLCBuZXcgUHQoMCwgeSwgMCksIG5ldyBQdCgwLCAwLCAxKSk7XG4gICAgfVxuICAgIHN0YXRpYyByb3RhdGUyRE1hdHJpeChjb3NBLCBzaW5BKSB7XG4gICAgICAgIHJldHVybiBuZXcgR3JvdXAobmV3IFB0KGNvc0EsIHNpbkEsIDApLCBuZXcgUHQoLXNpbkEsIGNvc0EsIDApLCBuZXcgUHQoMCwgMCwgMSkpO1xuICAgIH1cbiAgICBzdGF0aWMgc2hlYXIyRE1hdHJpeCh0YW5YLCB0YW5ZKSB7XG4gICAgICAgIHJldHVybiBuZXcgR3JvdXAobmV3IFB0KDEsIHRhblgsIDApLCBuZXcgUHQodGFuWSwgMSwgMCksIG5ldyBQdCgwLCAwLCAxKSk7XG4gICAgfVxuICAgIHN0YXRpYyB0cmFuc2xhdGUyRE1hdHJpeCh4LCB5KSB7XG4gICAgICAgIHJldHVybiBuZXcgR3JvdXAobmV3IFB0KDEsIDAsIDApLCBuZXcgUHQoMCwgMSwgMCksIG5ldyBQdCh4LCB5LCAxKSk7XG4gICAgfVxuICAgIHN0YXRpYyBzY2FsZUF0MkRNYXRyaXgoc3gsIHN5LCBhdCkge1xuICAgICAgICBsZXQgbSA9IE1hdC5zY2FsZTJETWF0cml4KHN4LCBzeSk7XG4gICAgICAgIG1bMl1bMF0gPSAtYXRbMF0gKiBzeCArIGF0WzBdO1xuICAgICAgICBtWzJdWzFdID0gLWF0WzFdICogc3kgKyBhdFsxXTtcbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuICAgIHN0YXRpYyByb3RhdGVBdDJETWF0cml4KGNvc0EsIHNpbkEsIGF0KSB7XG4gICAgICAgIGxldCBtID0gTWF0LnJvdGF0ZTJETWF0cml4KGNvc0EsIHNpbkEpO1xuICAgICAgICBtWzJdWzBdID0gYXRbMF0gKiAoMSAtIGNvc0EpICsgYXRbMV0gKiBzaW5BO1xuICAgICAgICBtWzJdWzFdID0gYXRbMV0gKiAoMSAtIGNvc0EpIC0gYXRbMF0gKiBzaW5BO1xuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG4gICAgc3RhdGljIHNoZWFyQXQyRE1hdHJpeCh0YW5YLCB0YW5ZLCBhdCkge1xuICAgICAgICBsZXQgbSA9IE1hdC5zaGVhcjJETWF0cml4KHRhblgsIHRhblkpO1xuICAgICAgICBtWzJdWzBdID0gLWF0WzFdICogdGFuWTtcbiAgICAgICAgbVsyXVsxXSA9IC1hdFswXSAqIHRhblg7XG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cbiAgICBzdGF0aWMgcmVmbGVjdEF0MkRNYXRyaXgocDEsIHAyKSB7XG4gICAgICAgIGxldCBpbnRlcmNlcHQgPSBMaW5lLmludGVyY2VwdChwMSwgcDIpO1xuICAgICAgICBpZiAoaW50ZXJjZXB0ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBuZXcgUHQoWy0xLCAwLCAwXSksXG4gICAgICAgICAgICAgICAgbmV3IFB0KFswLCAxLCAwXSksXG4gICAgICAgICAgICAgICAgbmV3IFB0KFtwMVswXSArIHAyWzBdLCAwLCAxXSlcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgeWkgPSBpbnRlcmNlcHQueWk7XG4gICAgICAgICAgICBsZXQgYW5nMiA9IE1hdGguYXRhbihpbnRlcmNlcHQuc2xvcGUpICogMjtcbiAgICAgICAgICAgIGxldCBjb3NBID0gTWF0aC5jb3MoYW5nMik7XG4gICAgICAgICAgICBsZXQgc2luQSA9IE1hdGguc2luKGFuZzIpO1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBuZXcgUHQoW2Nvc0EsIHNpbkEsIDBdKSxcbiAgICAgICAgICAgICAgICBuZXcgUHQoW3NpbkEsIC1jb3NBLCAwXSksXG4gICAgICAgICAgICAgICAgbmV3IFB0KFsteWkgKiBzaW5BLCB5aSArIHlpICogY29zQSwgMV0pXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TGluZWFyQWxnZWJyYS5qcy5tYXAiLCIvKiEgU291cmNlIGNvZGUgbGljZW5zZWQgdW5kZXIgQXBhY2hlIExpY2Vuc2UgMi4wLiBDb3B5cmlnaHQgwqkgMjAxNy1jdXJyZW50IFdpbGxpYW0gTmdhbiBhbmQgY29udHJpYnV0b3JzLiAoaHR0cHM6Ly9naXRodWIuY29tL3dpbGxpYW1uZ2FuL3B0cykgKi9cbmltcG9ydCB7IENvbnN0IH0gZnJvbSBcIi4vVXRpbFwiO1xuaW1wb3J0IHsgQ3VydmUgfSBmcm9tIFwiLi9PcFwiO1xuaW1wb3J0IHsgUHQsIEdyb3VwIH0gZnJvbSBcIi4vUHRcIjtcbmltcG9ydCB7IFZlYywgTWF0IH0gZnJvbSBcIi4vTGluZWFyQWxnZWJyYVwiO1xuZXhwb3J0IGNsYXNzIE51bSB7XG4gICAgc3RhdGljIGVxdWFscyhhLCBiLCB0aHJlc2hvbGQgPSAwLjAwMDAxKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhIC0gYikgPCB0aHJlc2hvbGQ7XG4gICAgfVxuICAgIHN0YXRpYyBsZXJwKGEsIGIsIHQpIHtcbiAgICAgICAgcmV0dXJuICgxIC0gdCkgKiBhICsgdCAqIGI7XG4gICAgfVxuICAgIHN0YXRpYyBjbGFtcCh2YWwsIG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKG1heCwgdmFsKSk7XG4gICAgfVxuICAgIHN0YXRpYyBib3VuZFZhbHVlKHZhbCwgbWluLCBtYXgpIHtcbiAgICAgICAgbGV0IGxlbiA9IE1hdGguYWJzKG1heCAtIG1pbik7XG4gICAgICAgIGxldCBhID0gdmFsICUgbGVuO1xuICAgICAgICBpZiAoYSA+IG1heClcbiAgICAgICAgICAgIGEgLT0gbGVuO1xuICAgICAgICBlbHNlIGlmIChhIDwgbWluKVxuICAgICAgICAgICAgYSArPSBsZW47XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBzdGF0aWMgd2l0aGluKHAsIGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIHAgPj0gTWF0aC5taW4oYSwgYikgJiYgcCA8PSBNYXRoLm1heChhLCBiKTtcbiAgICB9XG4gICAgc3RhdGljIHJhbmRvbVJhbmdlKGEsIGIgPSAwKSB7XG4gICAgICAgIGxldCByID0gKGEgPiBiKSA/IChhIC0gYikgOiAoYiAtIGEpO1xuICAgICAgICByZXR1cm4gYSArIE1hdGgucmFuZG9tKCkgKiByO1xuICAgIH1cbiAgICBzdGF0aWMgbm9ybWFsaXplVmFsdWUobiwgYSwgYikge1xuICAgICAgICBsZXQgbWluID0gTWF0aC5taW4oYSwgYik7XG4gICAgICAgIGxldCBtYXggPSBNYXRoLm1heChhLCBiKTtcbiAgICAgICAgcmV0dXJuIChuIC0gbWluKSAvIChtYXggLSBtaW4pO1xuICAgIH1cbiAgICBzdGF0aWMgc3VtKHB0cykge1xuICAgICAgICBsZXQgYyA9IG5ldyBQdChwdHNbMF0pO1xuICAgICAgICBmb3IgKGxldCBpID0gMSwgbGVuID0gcHRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBWZWMuYWRkKGMsIHB0c1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuICAgIHN0YXRpYyBhdmVyYWdlKHB0cykge1xuICAgICAgICByZXR1cm4gTnVtLnN1bShwdHMpLmRpdmlkZShwdHMubGVuZ3RoKTtcbiAgICB9XG4gICAgc3RhdGljIGN5Y2xlKHQsIG1ldGhvZCA9IFNoYXBpbmcuc2luZUluT3V0KSB7XG4gICAgICAgIHJldHVybiBtZXRob2QodCA+IDAuNSA/IDIgLSB0ICogMiA6IHQgKiAyKTtcbiAgICB9XG4gICAgc3RhdGljIG1hcFRvUmFuZ2UobiwgY3VyckEsIGN1cnJCLCB0YXJnZXRBLCB0YXJnZXRCKSB7XG4gICAgICAgIGlmIChjdXJyQSA9PSBjdXJyQilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIltjdXJyTWluLCBjdXJyTWF4XSBtdXN0IGRlZmluZSBhIHJhbmdlIHRoYXQgaXMgbm90IHplcm9cIik7XG4gICAgICAgIGxldCBtaW4gPSBNYXRoLm1pbih0YXJnZXRBLCB0YXJnZXRCKTtcbiAgICAgICAgbGV0IG1heCA9IE1hdGgubWF4KHRhcmdldEEsIHRhcmdldEIpO1xuICAgICAgICByZXR1cm4gTnVtLm5vcm1hbGl6ZVZhbHVlKG4sIGN1cnJBLCBjdXJyQikgKiAobWF4IC0gbWluKSArIG1pbjtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgR2VvbSB7XG4gICAgc3RhdGljIGJvdW5kQW5nbGUoYW5nbGUpIHtcbiAgICAgICAgcmV0dXJuIE51bS5ib3VuZFZhbHVlKGFuZ2xlLCAwLCAzNjApO1xuICAgIH1cbiAgICBzdGF0aWMgYm91bmRSYWRpYW4ocmFkaWFuKSB7XG4gICAgICAgIHJldHVybiBOdW0uYm91bmRWYWx1ZShyYWRpYW4sIDAsIENvbnN0LnR3b19waSk7XG4gICAgfVxuICAgIHN0YXRpYyB0b1JhZGlhbihhbmdsZSkge1xuICAgICAgICByZXR1cm4gYW5nbGUgKiBDb25zdC5kZWdfdG9fcmFkO1xuICAgIH1cbiAgICBzdGF0aWMgdG9EZWdyZWUocmFkaWFuKSB7XG4gICAgICAgIHJldHVybiByYWRpYW4gKiBDb25zdC5yYWRfdG9fZGVnO1xuICAgIH1cbiAgICBzdGF0aWMgYm91bmRpbmdCb3gocHRzKSB7XG4gICAgICAgIGxldCBtaW5QdCA9IHB0cy5yZWR1Y2UoKGEsIHApID0+IGEuJG1pbihwKSk7XG4gICAgICAgIGxldCBtYXhQdCA9IHB0cy5yZWR1Y2UoKGEsIHApID0+IGEuJG1heChwKSk7XG4gICAgICAgIHJldHVybiBuZXcgR3JvdXAobWluUHQsIG1heFB0KTtcbiAgICB9XG4gICAgc3RhdGljIGNlbnRyb2lkKHB0cykge1xuICAgICAgICByZXR1cm4gTnVtLmF2ZXJhZ2UocHRzKTtcbiAgICB9XG4gICAgc3RhdGljIGFuY2hvcihwdHMsIHB0T3JJbmRleCA9IDAsIGRpcmVjdGlvbiA9IFwidG9cIikge1xuICAgICAgICBsZXQgbWV0aG9kID0gKGRpcmVjdGlvbiA9PSBcInRvXCIpID8gXCJzdWJ0cmFjdFwiIDogXCJhZGRcIjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHB0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwdE9ySW5kZXggPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIGlmIChwdE9ySW5kZXggIT09IGkpXG4gICAgICAgICAgICAgICAgICAgIHB0c1tpXVttZXRob2RdKHB0c1twdE9ySW5kZXhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHB0c1tpXVttZXRob2RdKHB0T3JJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIGludGVycG9sYXRlKGEsIGIsIHQgPSAwLjUpIHtcbiAgICAgICAgbGV0IGxlbiA9IE1hdGgubWluKGEubGVuZ3RoLCBiLmxlbmd0aCk7XG4gICAgICAgIGxldCBkID0gUHQubWFrZShsZW4pO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBkW2ldID0gYVtpXSAqICgxIC0gdCkgKyBiW2ldICogdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZDtcbiAgICB9XG4gICAgc3RhdGljIHBlcnBlbmRpY3VsYXIocHQsIGF4aXMgPSBDb25zdC54eSkge1xuICAgICAgICBsZXQgeSA9IGF4aXNbMV07XG4gICAgICAgIGxldCB4ID0gYXhpc1swXTtcbiAgICAgICAgbGV0IHAgPSBuZXcgUHQocHQpO1xuICAgICAgICBsZXQgcGEgPSBuZXcgUHQocCk7XG4gICAgICAgIHBhW3hdID0gLXBbeV07XG4gICAgICAgIHBhW3ldID0gcFt4XTtcbiAgICAgICAgbGV0IHBiID0gbmV3IFB0KHApO1xuICAgICAgICBwYlt4XSA9IHBbeV07XG4gICAgICAgIHBiW3ldID0gLXBbeF07XG4gICAgICAgIHJldHVybiBuZXcgR3JvdXAocGEsIHBiKTtcbiAgICB9XG4gICAgc3RhdGljIGlzUGVycGVuZGljdWxhcihwMSwgcDIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQdChwMSkuZG90KHAyKSA9PT0gMDtcbiAgICB9XG4gICAgc3RhdGljIHdpdGhpbkJvdW5kKHB0LCBib3VuZFB0MSwgYm91bmRQdDIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IE1hdGgubWluKHB0Lmxlbmd0aCwgYm91bmRQdDEubGVuZ3RoLCBib3VuZFB0Mi5sZW5ndGgpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghTnVtLndpdGhpbihwdFtpXSwgYm91bmRQdDFbaV0sIGJvdW5kUHQyW2ldKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHN0YXRpYyBzb3J0RWRnZXMocHRzKSB7XG4gICAgICAgIGxldCBib3VuZHMgPSBHZW9tLmJvdW5kaW5nQm94KHB0cyk7XG4gICAgICAgIGxldCBjZW50ZXIgPSBib3VuZHNbMV0uYWRkKGJvdW5kc1swXSkuZGl2aWRlKDIpO1xuICAgICAgICBsZXQgZm4gPSAoYSwgYikgPT4ge1xuICAgICAgICAgICAgaWYgKGEubGVuZ3RoIDwgMiB8fCBiLmxlbmd0aCA8IDIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUHQgZGltZW5zaW9uIGNhbm5vdCBiZSBsZXNzIHRoYW4gMlwiKTtcbiAgICAgICAgICAgIGxldCBkYSA9IGEuJHN1YnRyYWN0KGNlbnRlcik7XG4gICAgICAgICAgICBsZXQgZGIgPSBiLiRzdWJ0cmFjdChjZW50ZXIpO1xuICAgICAgICAgICAgaWYgKGRhWzBdID49IDAgJiYgZGJbMF0gPCAwKVxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgaWYgKGRhWzBdIDwgMCAmJiBkYlswXSA+PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmIChkYVswXSA9PSAwICYmIGRiWzBdID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoZGFbMV0gPj0gMCB8fCBkYlsxXSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGRhWzFdID4gZGJbMV0pID8gMSA6IC0xO1xuICAgICAgICAgICAgICAgIHJldHVybiAoZGJbMV0gPiBkYVsxXSkgPyAxIDogLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZGV0ID0gZGEuJGNyb3NzMkQoZGIpO1xuICAgICAgICAgICAgaWYgKGRldCA8IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICBpZiAoZGV0ID4gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICByZXR1cm4gKGRhWzBdICogZGFbMF0gKyBkYVsxXSAqIGRhWzFdID4gZGJbMF0gKiBkYlswXSArIGRiWzFdICogZGJbMV0pID8gMSA6IC0xO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcHRzLnNvcnQoZm4pO1xuICAgIH1cbiAgICBzdGF0aWMgc2NhbGUocHMsIHNjYWxlLCBhbmNob3IpIHtcbiAgICAgICAgbGV0IHB0cyA9ICghQXJyYXkuaXNBcnJheShwcykpID8gW3BzXSA6IHBzO1xuICAgICAgICBsZXQgc2NzID0gKHR5cGVvZiBzY2FsZSA9PSBcIm51bWJlclwiKSA/IFB0Lm1ha2UocHRzWzBdLmxlbmd0aCwgc2NhbGUpIDogc2NhbGU7XG4gICAgICAgIGlmICghYW5jaG9yKVxuICAgICAgICAgICAgYW5jaG9yID0gUHQubWFrZShwdHNbMF0ubGVuZ3RoLCAwKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHB0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IHAgPSBwdHNbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuUCA9IHAubGVuZ3RoOyBrIDwgbGVuUDsgaysrKSB7XG4gICAgICAgICAgICAgICAgcFtrXSA9IChhbmNob3IgJiYgYW5jaG9yW2tdKSA/IGFuY2hvcltrXSArIChwW2tdIC0gYW5jaG9yW2tdKSAqIHNjc1trXSA6IHBba10gKiBzY3Nba107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEdlb207XG4gICAgfVxuICAgIHN0YXRpYyByb3RhdGUyRChwcywgYW5nbGUsIGFuY2hvciwgYXhpcykge1xuICAgICAgICBsZXQgcHRzID0gKCFBcnJheS5pc0FycmF5KHBzKSkgPyBbcHNdIDogcHM7XG4gICAgICAgIGxldCBmbiA9IChhbmNob3IpID8gTWF0LnJvdGF0ZUF0MkRNYXRyaXggOiBNYXQucm90YXRlMkRNYXRyaXg7XG4gICAgICAgIGlmICghYW5jaG9yKVxuICAgICAgICAgICAgYW5jaG9yID0gUHQubWFrZShwdHNbMF0ubGVuZ3RoLCAwKTtcbiAgICAgICAgbGV0IGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgICAgbGV0IHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHB0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IHAgPSAoYXhpcykgPyBwdHNbaV0uJHRha2UoYXhpcykgOiBwdHNbaV07XG4gICAgICAgICAgICBwLnRvKE1hdC50cmFuc2Zvcm0yRChwLCBmbihjb3MsIHNpbiwgYW5jaG9yKSkpO1xuICAgICAgICAgICAgaWYgKGF4aXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGF4aXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcHRzW2ldW2F4aXNba11dID0gcFtrXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEdlb207XG4gICAgfVxuICAgIHN0YXRpYyBzaGVhcjJEKHBzLCBzY2FsZSwgYW5jaG9yLCBheGlzKSB7XG4gICAgICAgIGxldCBwdHMgPSAoIUFycmF5LmlzQXJyYXkocHMpKSA/IFtwc10gOiBwcztcbiAgICAgICAgbGV0IHMgPSAodHlwZW9mIHNjYWxlID09IFwibnVtYmVyXCIpID8gW3NjYWxlLCBzY2FsZV0gOiBzY2FsZTtcbiAgICAgICAgaWYgKCFhbmNob3IpXG4gICAgICAgICAgICBhbmNob3IgPSBQdC5tYWtlKHB0c1swXS5sZW5ndGgsIDApO1xuICAgICAgICBsZXQgZm4gPSAoYW5jaG9yKSA/IE1hdC5zaGVhckF0MkRNYXRyaXggOiBNYXQuc2hlYXIyRE1hdHJpeDtcbiAgICAgICAgbGV0IHRhbnggPSBNYXRoLnRhbihzWzBdKTtcbiAgICAgICAgbGV0IHRhbnkgPSBNYXRoLnRhbihzWzFdKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHB0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IHAgPSAoYXhpcykgPyBwdHNbaV0uJHRha2UoYXhpcykgOiBwdHNbaV07XG4gICAgICAgICAgICBwLnRvKE1hdC50cmFuc2Zvcm0yRChwLCBmbih0YW54LCB0YW55LCBhbmNob3IpKSk7XG4gICAgICAgICAgICBpZiAoYXhpcykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYXhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBwdHNbaV1bYXhpc1trXV0gPSBwW2tdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gR2VvbTtcbiAgICB9XG4gICAgc3RhdGljIHJlZmxlY3QyRChwcywgbGluZSwgYXhpcykge1xuICAgICAgICBsZXQgcHRzID0gKCFBcnJheS5pc0FycmF5KHBzKSkgPyBbcHNdIDogcHM7XG4gICAgICAgIGxldCBtYXQgPSBNYXQucmVmbGVjdEF0MkRNYXRyaXgobGluZVswXSwgbGluZVsxXSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBwdHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwID0gKGF4aXMpID8gcHRzW2ldLiR0YWtlKGF4aXMpIDogcHRzW2ldO1xuICAgICAgICAgICAgcC50byhNYXQudHJhbnNmb3JtMkQocCwgbWF0KSk7XG4gICAgICAgICAgICBpZiAoYXhpcykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYXhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBwdHNbaV1bYXhpc1trXV0gPSBwW2tdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gR2VvbTtcbiAgICB9XG4gICAgc3RhdGljIGNvc1RhYmxlKCkge1xuICAgICAgICBsZXQgY29zID0gbmV3IEZsb2F0NjRBcnJheSgzNjApO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM2MDsgaSsrKVxuICAgICAgICAgICAgY29zW2ldID0gTWF0aC5jb3MoaSAqIE1hdGguUEkgLyAxODApO1xuICAgICAgICBsZXQgZmluZCA9IChyYWQpID0+IGNvc1tNYXRoLmZsb29yKEdlb20uYm91bmRBbmdsZShHZW9tLnRvRGVncmVlKHJhZCkpKV07XG4gICAgICAgIHJldHVybiB7IHRhYmxlOiBjb3MsIGNvczogZmluZCB9O1xuICAgIH1cbiAgICBzdGF0aWMgc2luVGFibGUoKSB7XG4gICAgICAgIGxldCBzaW4gPSBuZXcgRmxvYXQ2NEFycmF5KDM2MCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzYwOyBpKyspXG4gICAgICAgICAgICBzaW5baV0gPSBNYXRoLnNpbihpICogTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgIGxldCBmaW5kID0gKHJhZCkgPT4gc2luW01hdGguZmxvb3IoR2VvbS5ib3VuZEFuZ2xlKEdlb20udG9EZWdyZWUocmFkKSkpXTtcbiAgICAgICAgcmV0dXJuIHsgdGFibGU6IHNpbiwgc2luOiBmaW5kIH07XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFNoYXBpbmcge1xuICAgIHN0YXRpYyBsaW5lYXIodCwgYyA9IDEpIHtcbiAgICAgICAgcmV0dXJuIGMgKiB0O1xuICAgIH1cbiAgICBzdGF0aWMgcXVhZHJhdGljSW4odCwgYyA9IDEpIHtcbiAgICAgICAgcmV0dXJuIGMgKiB0ICogdDtcbiAgICB9XG4gICAgc3RhdGljIHF1YWRyYXRpY091dCh0LCBjID0gMSkge1xuICAgICAgICByZXR1cm4gLWMgKiB0ICogKHQgLSAyKTtcbiAgICB9XG4gICAgc3RhdGljIHF1YWRyYXRpY0luT3V0KHQsIGMgPSAxKSB7XG4gICAgICAgIGxldCBkdCA9IHQgKiAyO1xuICAgICAgICByZXR1cm4gKHQgPCAwLjUpID8gYyAvIDIgKiB0ICogdCAqIDQgOiAtYyAvIDIgKiAoKGR0IC0gMSkgKiAoZHQgLSAzKSAtIDEpO1xuICAgIH1cbiAgICBzdGF0aWMgY3ViaWNJbih0LCBjID0gMSkge1xuICAgICAgICByZXR1cm4gYyAqIHQgKiB0ICogdDtcbiAgICB9XG4gICAgc3RhdGljIGN1YmljT3V0KHQsIGMgPSAxKSB7XG4gICAgICAgIGxldCBkdCA9IHQgLSAxO1xuICAgICAgICByZXR1cm4gYyAqIChkdCAqIGR0ICogZHQgKyAxKTtcbiAgICB9XG4gICAgc3RhdGljIGN1YmljSW5PdXQodCwgYyA9IDEpIHtcbiAgICAgICAgbGV0IGR0ID0gdCAqIDI7XG4gICAgICAgIHJldHVybiAodCA8IDAuNSkgPyBjIC8gMiAqIGR0ICogZHQgKiBkdCA6IGMgLyAyICogKChkdCAtIDIpICogKGR0IC0gMikgKiAoZHQgLSAyKSArIDIpO1xuICAgIH1cbiAgICBzdGF0aWMgZXhwb25lbnRpYWxJbih0LCBjID0gMSwgcCA9IDAuMjUpIHtcbiAgICAgICAgcmV0dXJuIGMgKiBNYXRoLnBvdyh0LCAxIC8gcCk7XG4gICAgfVxuICAgIHN0YXRpYyBleHBvbmVudGlhbE91dCh0LCBjID0gMSwgcCA9IDAuMjUpIHtcbiAgICAgICAgcmV0dXJuIGMgKiBNYXRoLnBvdyh0LCBwKTtcbiAgICB9XG4gICAgc3RhdGljIHNpbmVJbih0LCBjID0gMSkge1xuICAgICAgICByZXR1cm4gLWMgKiBNYXRoLmNvcyh0ICogQ29uc3QuaGFsZl9waSkgKyBjO1xuICAgIH1cbiAgICBzdGF0aWMgc2luZU91dCh0LCBjID0gMSkge1xuICAgICAgICByZXR1cm4gYyAqIE1hdGguc2luKHQgKiBDb25zdC5oYWxmX3BpKTtcbiAgICB9XG4gICAgc3RhdGljIHNpbmVJbk91dCh0LCBjID0gMSkge1xuICAgICAgICByZXR1cm4gLWMgLyAyICogKE1hdGguY29zKE1hdGguUEkgKiB0KSAtIDEpO1xuICAgIH1cbiAgICBzdGF0aWMgY29zaW5lQXBwcm94KHQsIGMgPSAxKSB7XG4gICAgICAgIGxldCB0MiA9IHQgKiB0O1xuICAgICAgICBsZXQgdDQgPSB0MiAqIHQyO1xuICAgICAgICBsZXQgdDYgPSB0NCAqIHQyO1xuICAgICAgICByZXR1cm4gYyAqICg0ICogdDYgLyA5IC0gMTcgKiB0NCAvIDkgKyAyMiAqIHQyIC8gOSk7XG4gICAgfVxuICAgIHN0YXRpYyBjaXJjdWxhckluKHQsIGMgPSAxKSB7XG4gICAgICAgIHJldHVybiAtYyAqIChNYXRoLnNxcnQoMSAtIHQgKiB0KSAtIDEpO1xuICAgIH1cbiAgICBzdGF0aWMgY2lyY3VsYXJPdXQodCwgYyA9IDEpIHtcbiAgICAgICAgbGV0IGR0ID0gdCAtIDE7XG4gICAgICAgIHJldHVybiBjICogTWF0aC5zcXJ0KDEgLSBkdCAqIGR0KTtcbiAgICB9XG4gICAgc3RhdGljIGNpcmN1bGFySW5PdXQodCwgYyA9IDEpIHtcbiAgICAgICAgbGV0IGR0ID0gdCAqIDI7XG4gICAgICAgIHJldHVybiAodCA8IDAuNSkgPyAtYyAvIDIgKiAoTWF0aC5zcXJ0KDEgLSBkdCAqIGR0KSAtIDEpIDogYyAvIDIgKiAoTWF0aC5zcXJ0KDEgLSAoZHQgLSAyKSAqIChkdCAtIDIpKSArIDEpO1xuICAgIH1cbiAgICBzdGF0aWMgZWxhc3RpY0luKHQsIGMgPSAxLCBwID0gMC43KSB7XG4gICAgICAgIGxldCBkdCA9IHQgLSAxO1xuICAgICAgICBsZXQgcyA9IChwIC8gQ29uc3QudHdvX3BpKSAqIDEuNTcwNzk2MzI2Nzk0ODk2NjtcbiAgICAgICAgcmV0dXJuIGMgKiAoLU1hdGgucG93KDIsIDEwICogZHQpICogTWF0aC5zaW4oKGR0IC0gcykgKiBDb25zdC50d29fcGkgLyBwKSk7XG4gICAgfVxuICAgIHN0YXRpYyBlbGFzdGljT3V0KHQsIGMgPSAxLCBwID0gMC43KSB7XG4gICAgICAgIGxldCBzID0gKHAgLyBDb25zdC50d29fcGkpICogMS41NzA3OTYzMjY3OTQ4OTY2O1xuICAgICAgICByZXR1cm4gYyAqIChNYXRoLnBvdygyLCAtMTAgKiB0KSAqIE1hdGguc2luKCh0IC0gcykgKiBDb25zdC50d29fcGkgLyBwKSkgKyBjO1xuICAgIH1cbiAgICBzdGF0aWMgZWxhc3RpY0luT3V0KHQsIGMgPSAxLCBwID0gMC42KSB7XG4gICAgICAgIGxldCBkdCA9IHQgKiAyO1xuICAgICAgICBsZXQgcyA9IChwIC8gQ29uc3QudHdvX3BpKSAqIDEuNTcwNzk2MzI2Nzk0ODk2NjtcbiAgICAgICAgaWYgKHQgPCAwLjUpIHtcbiAgICAgICAgICAgIGR0IC09IDE7XG4gICAgICAgICAgICByZXR1cm4gYyAqICgtMC41ICogKE1hdGgucG93KDIsIDEwICogZHQpICogTWF0aC5zaW4oKGR0IC0gcykgKiBDb25zdC50d29fcGkgLyBwKSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZHQgLT0gMTtcbiAgICAgICAgICAgIHJldHVybiBjICogKDAuNSAqIChNYXRoLnBvdygyLCAtMTAgKiBkdCkgKiBNYXRoLnNpbigoZHQgLSBzKSAqIENvbnN0LnR3b19waSAvIHApKSkgKyBjO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBib3VuY2VJbih0LCBjID0gMSkge1xuICAgICAgICByZXR1cm4gYyAtIFNoYXBpbmcuYm91bmNlT3V0KCgxIC0gdCksIGMpO1xuICAgIH1cbiAgICBzdGF0aWMgYm91bmNlT3V0KHQsIGMgPSAxKSB7XG4gICAgICAgIGlmICh0IDwgKDEgLyAyLjc1KSkge1xuICAgICAgICAgICAgcmV0dXJuIGMgKiAoNy41NjI1ICogdCAqIHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHQgPCAoMiAvIDIuNzUpKSB7XG4gICAgICAgICAgICB0IC09IDEuNSAvIDIuNzU7XG4gICAgICAgICAgICByZXR1cm4gYyAqICg3LjU2MjUgKiB0ICogdCArIDAuNzUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHQgPCAoMi41IC8gMi43NSkpIHtcbiAgICAgICAgICAgIHQgLT0gMi4yNSAvIDIuNzU7XG4gICAgICAgICAgICByZXR1cm4gYyAqICg3LjU2MjUgKiB0ICogdCArIDAuOTM3NSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0IC09IDIuNjI1IC8gMi43NTtcbiAgICAgICAgICAgIHJldHVybiBjICogKDcuNTYyNSAqIHQgKiB0ICsgMC45ODQzNzUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBib3VuY2VJbk91dCh0LCBjID0gMSkge1xuICAgICAgICByZXR1cm4gKHQgPCAwLjUpID8gU2hhcGluZy5ib3VuY2VJbih0ICogMiwgYykgLyAyIDogU2hhcGluZy5ib3VuY2VPdXQodCAqIDIgLSAxLCBjKSAvIDIgKyBjIC8gMjtcbiAgICB9XG4gICAgc3RhdGljIHNpZ21vaWQodCwgYyA9IDEsIHAgPSAxMCkge1xuICAgICAgICBsZXQgZCA9IHAgKiAodCAtIDAuNSk7XG4gICAgICAgIHJldHVybiBjIC8gKDEgKyBNYXRoLmV4cCgtZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgbG9nU2lnbW9pZCh0LCBjID0gMSwgcCA9IDAuNykge1xuICAgICAgICBwID0gTWF0aC5tYXgoQ29uc3QuZXBzaWxvbiwgTWF0aC5taW4oMSAtIENvbnN0LmVwc2lsb24sIHApKTtcbiAgICAgICAgcCA9IDEgLyAoMSAtIHApO1xuICAgICAgICBsZXQgQSA9IDEgLyAoMSArIE1hdGguZXhwKCgodCAtIDAuNSkgKiBwICogLTIpKSk7XG4gICAgICAgIGxldCBCID0gMSAvICgxICsgTWF0aC5leHAocCkpO1xuICAgICAgICBsZXQgQyA9IDEgLyAoMSArIE1hdGguZXhwKC1wKSk7XG4gICAgICAgIHJldHVybiBjICogKEEgLSBCKSAvIChDIC0gQik7XG4gICAgfVxuICAgIHN0YXRpYyBzZWF0KHQsIGMgPSAxLCBwID0gMC41KSB7XG4gICAgICAgIGlmICgodCA8IDAuNSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjICogKE1hdGgucG93KDIgKiB0LCAxIC0gcCkpIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjICogKDEgLSAoTWF0aC5wb3coMiAqICgxIC0gdCksIDEgLSBwKSkgLyAyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgcXVhZHJhdGljQmV6aWVyKHQsIGMgPSAxLCBwID0gWzAuMDUsIDAuOTVdKSB7XG4gICAgICAgIGxldCBhID0gKHR5cGVvZiBwICE9IFwibnVtYmVyXCIpID8gcFswXSA6IHA7XG4gICAgICAgIGxldCBiID0gKHR5cGVvZiBwICE9IFwibnVtYmVyXCIpID8gcFsxXSA6IDAuNTtcbiAgICAgICAgbGV0IG9tMmEgPSAxIC0gMiAqIGE7XG4gICAgICAgIGlmIChvbTJhID09PSAwKSB7XG4gICAgICAgICAgICBvbTJhID0gQ29uc3QuZXBzaWxvbjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZCA9IChNYXRoLnNxcnQoYSAqIGEgKyBvbTJhICogdCkgLSBhKSAvIG9tMmE7XG4gICAgICAgIHJldHVybiBjICogKCgxIC0gMiAqIGIpICogKGQgKiBkKSArICgyICogYikgKiBkKTtcbiAgICB9XG4gICAgc3RhdGljIGN1YmljQmV6aWVyKHQsIGMgPSAxLCBwMSA9IFswLjEsIDAuN10sIHAyID0gWzAuOSwgMC4yXSkge1xuICAgICAgICBsZXQgY3VydmUgPSBuZXcgR3JvdXAobmV3IFB0KDAsIDApLCBuZXcgUHQocDEpLCBuZXcgUHQocDIpLCBuZXcgUHQoMSwgMSkpO1xuICAgICAgICByZXR1cm4gYyAqIEN1cnZlLmJlemllclN0ZXAobmV3IFB0KHQgKiB0ICogdCwgdCAqIHQsIHQsIDEpLCBDdXJ2ZS5jb250cm9sUG9pbnRzKGN1cnZlKSkueTtcbiAgICB9XG4gICAgc3RhdGljIHF1YWRyYXRpY1RhcmdldCh0LCBjID0gMSwgcDEgPSBbMC4yLCAwLjM1XSkge1xuICAgICAgICBsZXQgYSA9IE1hdGgubWluKDEgLSBDb25zdC5lcHNpbG9uLCBNYXRoLm1heChDb25zdC5lcHNpbG9uLCBwMVswXSkpO1xuICAgICAgICBsZXQgYiA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIHAxWzFdKSk7XG4gICAgICAgIGxldCBBID0gKDEgLSBiKSAvICgxIC0gYSkgLSAoYiAvIGEpO1xuICAgICAgICBsZXQgQiA9IChBICogKGEgKiBhKSAtIGIpIC8gYTtcbiAgICAgICAgbGV0IHkgPSBBICogKHQgKiB0KSAtIEIgKiB0O1xuICAgICAgICByZXR1cm4gYyAqIE1hdGgubWluKDEsIE1hdGgubWF4KDAsIHkpKTtcbiAgICB9XG4gICAgc3RhdGljIGNsaWZmKHQsIGMgPSAxLCBwID0gMC41KSB7XG4gICAgICAgIHJldHVybiAodCA+IHApID8gYyA6IDA7XG4gICAgfVxuICAgIHN0YXRpYyBzdGVwKGZuLCBzdGVwcywgdCwgYywgLi4uYXJncykge1xuICAgICAgICBsZXQgcyA9IDEgLyBzdGVwcztcbiAgICAgICAgbGV0IHR0ID0gTWF0aC5mbG9vcih0IC8gcykgKiBzO1xuICAgICAgICByZXR1cm4gZm4odHQsIGMsIC4uLmFyZ3MpO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBSYW5nZSB7XG4gICAgY29uc3RydWN0b3IoZykge1xuICAgICAgICB0aGlzLl9kaW1zID0gMDtcbiAgICAgICAgdGhpcy5fc291cmNlID0gR3JvdXAuZnJvbVB0QXJyYXkoZyk7XG4gICAgICAgIHRoaXMuY2FsYygpO1xuICAgIH1cbiAgICBnZXQgbWF4KCkgeyByZXR1cm4gdGhpcy5fbWF4LmNsb25lKCk7IH1cbiAgICBnZXQgbWluKCkgeyByZXR1cm4gdGhpcy5fbWluLmNsb25lKCk7IH1cbiAgICBnZXQgbWFnbml0dWRlKCkgeyByZXR1cm4gdGhpcy5fbWFnLmNsb25lKCk7IH1cbiAgICBjYWxjKCkge1xuICAgICAgICBpZiAoIXRoaXMuX3NvdXJjZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbGV0IGRpbXMgPSB0aGlzLl9zb3VyY2VbMF0ubGVuZ3RoO1xuICAgICAgICB0aGlzLl9kaW1zID0gZGltcztcbiAgICAgICAgbGV0IG1heCA9IG5ldyBQdChkaW1zKTtcbiAgICAgICAgbGV0IG1pbiA9IG5ldyBQdChkaW1zKTtcbiAgICAgICAgbGV0IG1hZyA9IG5ldyBQdChkaW1zKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1zOyBpKyspIHtcbiAgICAgICAgICAgIG1heFtpXSA9IENvbnN0Lm1pbjtcbiAgICAgICAgICAgIG1pbltpXSA9IENvbnN0Lm1heDtcbiAgICAgICAgICAgIG1hZ1tpXSA9IDA7XG4gICAgICAgICAgICBsZXQgcyA9IHRoaXMuX3NvdXJjZS56aXBTbGljZShpKTtcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW4gPSBzLmxlbmd0aDsgayA8IGxlbjsgaysrKSB7XG4gICAgICAgICAgICAgICAgbWF4W2ldID0gTWF0aC5tYXgobWF4W2ldLCBzW2tdKTtcbiAgICAgICAgICAgICAgICBtaW5baV0gPSBNYXRoLm1pbihtaW5baV0sIHNba10pO1xuICAgICAgICAgICAgICAgIG1hZ1tpXSA9IG1heFtpXSAtIG1pbltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXggPSBtYXg7XG4gICAgICAgIHRoaXMuX21pbiA9IG1pbjtcbiAgICAgICAgdGhpcy5fbWFnID0gbWFnO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgbWFwVG8obWluLCBtYXgsIGV4Y2x1ZGUpIHtcbiAgICAgICAgbGV0IHRhcmdldCA9IG5ldyBHcm91cCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5fc291cmNlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZyA9IHRoaXMuX3NvdXJjZVtpXTtcbiAgICAgICAgICAgIGxldCBuID0gbmV3IFB0KHRoaXMuX2RpbXMpO1xuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLl9kaW1zOyBrKyspIHtcbiAgICAgICAgICAgICAgICBuW2tdID0gKGV4Y2x1ZGUgJiYgZXhjbHVkZVtrXSkgPyBnW2tdIDogTnVtLm1hcFRvUmFuZ2UoZ1trXSwgdGhpcy5fbWluW2tdLCB0aGlzLl9tYXhba10sIG1pbiwgbWF4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldC5wdXNoKG4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgIGFwcGVuZChnLCB1cGRhdGUgPSB0cnVlKSB7XG4gICAgICAgIGlmIChnWzBdLmxlbmd0aCAhPT0gdGhpcy5fZGltcylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRGltZW5zaW9ucyBkb24ndCBtYXRjaC4gJHt0aGlzLl9kaW1zfSBkaW1lbnNpb25zIGluIFJhbmdlIGFuZCAke2dbMF0ubGVuZ3RofSBwcm92aWRlZCBpbiBwYXJhbWV0ZXIuIGApO1xuICAgICAgICB0aGlzLl9zb3VyY2UgPSB0aGlzLl9zb3VyY2UuY29uY2F0KGcpO1xuICAgICAgICBpZiAodXBkYXRlKVxuICAgICAgICAgICAgdGhpcy5jYWxjKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0aWNrcyhjb3VudCkge1xuICAgICAgICBsZXQgZyA9IG5ldyBHcm91cCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBQdCh0aGlzLl9kaW1zKTtcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW4gPSB0aGlzLl9tYXgubGVuZ3RoOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgICAgICAgICAgICBwW2tdID0gTnVtLmxlcnAodGhpcy5fbWluW2tdLCB0aGlzLl9tYXhba10sIGkgLyBjb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnLnB1c2gocCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGc7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TnVtLmpzLm1hcCIsIi8qISBTb3VyY2UgY29kZSBsaWNlbnNlZCB1bmRlciBBcGFjaGUgTGljZW5zZSAyLjAuIENvcHlyaWdodCDCqSAyMDE3LWN1cnJlbnQgV2lsbGlhbSBOZ2FuIGFuZCBjb250cmlidXRvcnMuIChodHRwczovL2dpdGh1Yi5jb20vd2lsbGlhbW5nYW4vcHRzKSAqL1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gXCIuL1V0aWxcIjtcbmltcG9ydCB7IEdlb20sIE51bSB9IGZyb20gXCIuL051bVwiO1xuaW1wb3J0IHsgUHQsIEdyb3VwIH0gZnJvbSBcIi4vUHRcIjtcbmltcG9ydCB7IE1hdCB9IGZyb20gXCIuL0xpbmVhckFsZ2VicmFcIjtcbmxldCBfZXJyb3JMZW5ndGggPSAob2JqLCBwYXJhbSA9IFwiZXhwZWN0ZWRcIikgPT4gVXRpbC53YXJuKFwiR3JvdXAncyBsZW5ndGggaXMgbGVzcyB0aGFuIFwiICsgcGFyYW0sIG9iaik7XG5sZXQgX2Vycm9yT3V0b2ZCb3VuZCA9IChvYmosIHBhcmFtID0gXCJcIikgPT4gVXRpbC53YXJuKGBJbmRleCAke3BhcmFtfSBpcyBvdXQgb2YgYm91bmQgaW4gR3JvdXBgLCBvYmopO1xuZXhwb3J0IGNsYXNzIExpbmUge1xuICAgIHN0YXRpYyBmcm9tQW5nbGUoYW5jaG9yLCBhbmdsZSwgbWFnbml0dWRlKSB7XG4gICAgICAgIGxldCBnID0gbmV3IEdyb3VwKG5ldyBQdChhbmNob3IpLCBuZXcgUHQoYW5jaG9yKSk7XG4gICAgICAgIGdbMV0udG9BbmdsZShhbmdsZSwgbWFnbml0dWRlLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGc7XG4gICAgfVxuICAgIHN0YXRpYyBzbG9wZShwMSwgcDIpIHtcbiAgICAgICAgcmV0dXJuIChwMlswXSAtIHAxWzBdID09PSAwKSA/IHVuZGVmaW5lZCA6IChwMlsxXSAtIHAxWzFdKSAvIChwMlswXSAtIHAxWzBdKTtcbiAgICB9XG4gICAgc3RhdGljIGludGVyY2VwdChwMSwgcDIpIHtcbiAgICAgICAgaWYgKHAyWzBdIC0gcDFbMF0gPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgbSA9IChwMlsxXSAtIHAxWzFdKSAvIChwMlswXSAtIHAxWzBdKTtcbiAgICAgICAgICAgIGxldCBjID0gcDFbMV0gLSBtICogcDFbMF07XG4gICAgICAgICAgICByZXR1cm4geyBzbG9wZTogbSwgeWk6IGMsIHhpOiAobSA9PT0gMCkgPyB1bmRlZmluZWQgOiAtYyAvIG0gfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgc2lkZU9mUHQyRChsaW5lLCBwdCkge1xuICAgICAgICByZXR1cm4gKGxpbmVbMV1bMF0gLSBsaW5lWzBdWzBdKSAqIChwdFsxXSAtIGxpbmVbMF1bMV0pIC0gKHB0WzBdIC0gbGluZVswXVswXSkgKiAobGluZVsxXVsxXSAtIGxpbmVbMF1bMV0pO1xuICAgIH1cbiAgICBzdGF0aWMgY29sbGluZWFyKHAxLCBwMiwgcDMsIHRocmVzaG9sZCA9IDAuMDEpIHtcbiAgICAgICAgbGV0IGEgPSBuZXcgUHQoMCwgMCwgMCkudG8ocDEpLiRzdWJ0cmFjdChwMik7XG4gICAgICAgIGxldCBiID0gbmV3IFB0KDAsIDAsIDApLnRvKHAxKS4kc3VidHJhY3QocDMpO1xuICAgICAgICByZXR1cm4gYS4kY3Jvc3MoYikuZGl2aWRlKDEwMDApLmVxdWFscyhuZXcgUHQoMCwgMCwgMCksIHRocmVzaG9sZCk7XG4gICAgfVxuICAgIHN0YXRpYyBtYWduaXR1ZGUobGluZSkge1xuICAgICAgICByZXR1cm4gKGxpbmUubGVuZ3RoID49IDIpID8gbGluZVsxXS4kc3VidHJhY3QobGluZVswXSkubWFnbml0dWRlKCkgOiAwO1xuICAgIH1cbiAgICBzdGF0aWMgbWFnbml0dWRlU3EobGluZSkge1xuICAgICAgICByZXR1cm4gKGxpbmUubGVuZ3RoID49IDIpID8gbGluZVsxXS4kc3VidHJhY3QobGluZVswXSkubWFnbml0dWRlU3EoKSA6IDA7XG4gICAgfVxuICAgIHN0YXRpYyBwZXJwZW5kaWN1bGFyRnJvbVB0KGxpbmUsIHB0LCBhc1Byb2plY3Rpb24gPSBmYWxzZSkge1xuICAgICAgICBpZiAobGluZVswXS5lcXVhbHMobGluZVsxXSkpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgYSA9IGxpbmVbMF0uJHN1YnRyYWN0KGxpbmVbMV0pO1xuICAgICAgICBsZXQgYiA9IGxpbmVbMV0uJHN1YnRyYWN0KHB0KTtcbiAgICAgICAgbGV0IHByb2ogPSBiLiRzdWJ0cmFjdChhLiRwcm9qZWN0KGIpKTtcbiAgICAgICAgcmV0dXJuIChhc1Byb2plY3Rpb24pID8gcHJvaiA6IHByb2ouJGFkZChwdCk7XG4gICAgfVxuICAgIHN0YXRpYyBkaXN0YW5jZUZyb21QdChsaW5lLCBwdCkge1xuICAgICAgICBsZXQgcHJvamVjdGlvblZlY3RvciA9IExpbmUucGVycGVuZGljdWxhckZyb21QdChsaW5lLCBwdCwgdHJ1ZSk7XG4gICAgICAgIGlmIChwcm9qZWN0aW9uVmVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGlvblZlY3Rvci5tYWduaXR1ZGUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsaW5lWzBdLiRzdWJ0cmFjdChwdCkubWFnbml0dWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIGludGVyc2VjdFJheTJEKGxhLCBsYikge1xuICAgICAgICBsZXQgYSA9IExpbmUuaW50ZXJjZXB0KGxhWzBdLCBsYVsxXSk7XG4gICAgICAgIGxldCBiID0gTGluZS5pbnRlcmNlcHQobGJbMF0sIGxiWzFdKTtcbiAgICAgICAgbGV0IHBhID0gbGFbMF07XG4gICAgICAgIGxldCBwYiA9IGxiWzBdO1xuICAgICAgICBpZiAoYSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChiID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgbGV0IHkxID0gLWIuc2xvcGUgKiAocGJbMF0gLSBwYVswXSkgKyBwYlsxXTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHQocGFbMF0sIHkxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChiID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxldCB5MSA9IC1hLnNsb3BlICogKHBhWzBdIC0gcGJbMF0pICsgcGFbMV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQdChwYlswXSwgeTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYi5zbG9wZSAhPSBhLnNsb3BlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHB4ID0gKGEuc2xvcGUgKiBwYVswXSAtIGIuc2xvcGUgKiBwYlswXSArIHBiWzFdIC0gcGFbMV0pIC8gKGEuc2xvcGUgLSBiLnNsb3BlKTtcbiAgICAgICAgICAgICAgICBsZXQgcHkgPSBhLnNsb3BlICogKHB4IC0gcGFbMF0pICsgcGFbMV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQdChweCwgcHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGEueWkgPT0gYi55aSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFB0KHBhWzBdLCBwYVsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgaW50ZXJzZWN0TGluZTJEKGxhLCBsYikge1xuICAgICAgICBsZXQgcHQgPSBMaW5lLmludGVyc2VjdFJheTJEKGxhLCBsYik7XG4gICAgICAgIHJldHVybiAocHQgJiYgR2VvbS53aXRoaW5Cb3VuZChwdCwgbGFbMF0sIGxhWzFdKSAmJiBHZW9tLndpdGhpbkJvdW5kKHB0LCBsYlswXSwgbGJbMV0pKSA/IHB0IDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBzdGF0aWMgaW50ZXJzZWN0TGluZVdpdGhSYXkyRChsaW5lLCByYXkpIHtcbiAgICAgICAgbGV0IHB0ID0gTGluZS5pbnRlcnNlY3RSYXkyRChsaW5lLCByYXkpO1xuICAgICAgICByZXR1cm4gKHB0ICYmIEdlb20ud2l0aGluQm91bmQocHQsIGxpbmVbMF0sIGxpbmVbMV0pKSA/IHB0IDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBzdGF0aWMgaW50ZXJzZWN0UG9seWdvbjJEKGxpbmVPclJheSwgcG9seSwgc291cmNlSXNSYXkgPSBmYWxzZSkge1xuICAgICAgICBsZXQgZm4gPSBzb3VyY2VJc1JheSA/IExpbmUuaW50ZXJzZWN0TGluZVdpdGhSYXkyRCA6IExpbmUuaW50ZXJzZWN0TGluZTJEO1xuICAgICAgICBsZXQgcHRzID0gbmV3IEdyb3VwKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBwb2x5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbmV4dCA9IChpID09PSBsZW4gLSAxKSA/IDAgOiBpICsgMTtcbiAgICAgICAgICAgIGxldCBkID0gZm4oW3BvbHlbaV0sIHBvbHlbbmV4dF1dLCBsaW5lT3JSYXkpO1xuICAgICAgICAgICAgaWYgKGQpXG4gICAgICAgICAgICAgICAgcHRzLnB1c2goZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChwdHMubGVuZ3RoID4gMCkgPyBwdHMgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHN0YXRpYyBpbnRlcnNlY3RMaW5lczJEKGxpbmVzMSwgbGluZXMyLCBpc1JheSA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBncm91cCA9IG5ldyBHcm91cCgpO1xuICAgICAgICBsZXQgZm4gPSBpc1JheSA/IExpbmUuaW50ZXJzZWN0TGluZVdpdGhSYXkyRCA6IExpbmUuaW50ZXJzZWN0TGluZTJEO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGluZXMxLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuayA9IGxpbmVzMi5sZW5ndGg7IGsgPCBsZW5rOyBrKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgX2lwID0gZm4obGluZXMxW2ldLCBsaW5lczJba10pO1xuICAgICAgICAgICAgICAgIGlmIChfaXApXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLnB1c2goX2lwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3JvdXA7XG4gICAgfVxuICAgIHN0YXRpYyBpbnRlcnNlY3RHcmlkV2l0aFJheTJEKHJheSwgZ3JpZFB0KSB7XG4gICAgICAgIGxldCB0ID0gTGluZS5pbnRlcmNlcHQobmV3IFB0KHJheVswXSkuc3VidHJhY3QoZ3JpZFB0KSwgbmV3IFB0KHJheVsxXSkuc3VidHJhY3QoZ3JpZFB0KSk7XG4gICAgICAgIGxldCBnID0gbmV3IEdyb3VwKCk7XG4gICAgICAgIGlmICh0ICYmIHQueGkpXG4gICAgICAgICAgICBnLnB1c2gobmV3IFB0KGdyaWRQdFswXSArIHQueGksIGdyaWRQdFsxXSkpO1xuICAgICAgICBpZiAodCAmJiB0LnlpKVxuICAgICAgICAgICAgZy5wdXNoKG5ldyBQdChncmlkUHRbMF0sIGdyaWRQdFsxXSArIHQueWkpKTtcbiAgICAgICAgcmV0dXJuIGc7XG4gICAgfVxuICAgIHN0YXRpYyBpbnRlcnNlY3RHcmlkV2l0aExpbmUyRChsaW5lLCBncmlkUHQpIHtcbiAgICAgICAgbGV0IGcgPSBMaW5lLmludGVyc2VjdEdyaWRXaXRoUmF5MkQobGluZSwgZ3JpZFB0KTtcbiAgICAgICAgbGV0IGdnID0gbmV3IEdyb3VwKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBnLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoR2VvbS53aXRoaW5Cb3VuZChnW2ldLCBsaW5lWzBdLCBsaW5lWzFdKSlcbiAgICAgICAgICAgICAgICBnZy5wdXNoKGdbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZztcbiAgICB9XG4gICAgc3RhdGljIGludGVyc2VjdFJlY3QyRChsaW5lLCByZWN0KSB7XG4gICAgICAgIGxldCBib3ggPSBHZW9tLmJvdW5kaW5nQm94KEdyb3VwLmZyb21QdEFycmF5KGxpbmUpKTtcbiAgICAgICAgaWYgKCFSZWN0YW5nbGUuaGFzSW50ZXJzZWN0UmVjdDJEKGJveCwgcmVjdCkpXG4gICAgICAgICAgICByZXR1cm4gbmV3IEdyb3VwKCk7XG4gICAgICAgIHJldHVybiBMaW5lLmludGVyc2VjdExpbmVzMkQoW2xpbmVdLCBSZWN0YW5nbGUuc2lkZXMocmVjdCkpO1xuICAgIH1cbiAgICBzdGF0aWMgc3VicG9pbnRzKGxpbmUsIG51bSkge1xuICAgICAgICBsZXQgcHRzID0gbmV3IEdyb3VwKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IG51bTsgaSsrKSB7XG4gICAgICAgICAgICBwdHMucHVzaChHZW9tLmludGVycG9sYXRlKGxpbmVbMF0sIGxpbmVbMV0sIGkgLyAobnVtICsgMSkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHRzO1xuICAgIH1cbiAgICBzdGF0aWMgY3JvcChsaW5lLCBzaXplLCBpbmRleCA9IDAsIGNyb3BBc0NpcmNsZSA9IHRydWUpIHtcbiAgICAgICAgbGV0IHRkeCA9IChpbmRleCA9PT0gMCkgPyAxIDogMDtcbiAgICAgICAgbGV0IGxzID0gbGluZVt0ZHhdLiRzdWJ0cmFjdChsaW5lW2luZGV4XSk7XG4gICAgICAgIGlmIChsc1swXSA9PT0gMCB8fCBzaXplWzBdID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIGxpbmVbaW5kZXhdO1xuICAgICAgICBpZiAoY3JvcEFzQ2lyY2xlKSB7XG4gICAgICAgICAgICBsZXQgZCA9IGxzLnVuaXQoKS5tdWx0aXBseShzaXplWzFdKTtcbiAgICAgICAgICAgIHJldHVybiBsaW5lW2luZGV4XS4kYWRkKGQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJlY3QgPSBSZWN0YW5nbGUuZnJvbUNlbnRlcihsaW5lW2luZGV4XSwgc2l6ZSk7XG4gICAgICAgICAgICBsZXQgc2lkZXMgPSBSZWN0YW5nbGUuc2lkZXMocmVjdCk7XG4gICAgICAgICAgICBsZXQgc2lkZUlkeCA9IDA7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMobHNbMV0gLyBsc1swXSkgPiBNYXRoLmFicyhzaXplWzFdIC8gc2l6ZVswXSkpIHtcbiAgICAgICAgICAgICAgICBzaWRlSWR4ID0gKGxzWzFdIDwgMCkgPyAwIDogMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNpZGVJZHggPSAobHNbMF0gPCAwKSA/IDMgOiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIExpbmUuaW50ZXJzZWN0UmF5MkQoc2lkZXNbc2lkZUlkeF0sIGxpbmUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBtYXJrZXIobGluZSwgc2l6ZSwgZ3JhcGhpYyA9IChcImFycm93XCIgfHwgXCJsaW5lXCIpLCBhdFRhaWwgPSB0cnVlKSB7XG4gICAgICAgIGxldCBoID0gYXRUYWlsID8gMCA6IDE7XG4gICAgICAgIGxldCB0ID0gYXRUYWlsID8gMSA6IDA7XG4gICAgICAgIGxldCB1bml0ID0gbGluZVtoXS4kc3VidHJhY3QobGluZVt0XSk7XG4gICAgICAgIGlmICh1bml0Lm1hZ25pdHVkZVNxKCkgPT09IDApXG4gICAgICAgICAgICByZXR1cm4gbmV3IEdyb3VwKCk7XG4gICAgICAgIHVuaXQudW5pdCgpO1xuICAgICAgICBsZXQgcHMgPSBHZW9tLnBlcnBlbmRpY3VsYXIodW5pdCkubXVsdGlwbHkoc2l6ZVswXSkuYWRkKGxpbmVbdF0pO1xuICAgICAgICBpZiAoZ3JhcGhpYyA9PSBcImFycm93XCIpIHtcbiAgICAgICAgICAgIHBzLmFkZCh1bml0LiRtdWx0aXBseShzaXplWzFdKSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEdyb3VwKGxpbmVbdF0sIHBzWzBdLCBwc1sxXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEdyb3VwKHBzWzBdLCBwc1sxXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIHRvUmVjdChsaW5lKSB7XG4gICAgICAgIHJldHVybiBuZXcgR3JvdXAobGluZVswXS4kbWluKGxpbmVbMV0pLCBsaW5lWzBdLiRtYXgobGluZVsxXSkpO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBSZWN0YW5nbGUge1xuICAgIHN0YXRpYyBmcm9tKHRvcExlZnQsIHdpZHRoT3JTaXplLCBoZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIFJlY3RhbmdsZS5mcm9tVG9wTGVmdCh0b3BMZWZ0LCB3aWR0aE9yU2l6ZSwgaGVpZ2h0KTtcbiAgICB9XG4gICAgc3RhdGljIGZyb21Ub3BMZWZ0KHRvcExlZnQsIHdpZHRoT3JTaXplLCBoZWlnaHQpIHtcbiAgICAgICAgbGV0IHNpemUgPSAodHlwZW9mIHdpZHRoT3JTaXplID09IFwibnVtYmVyXCIpID8gW3dpZHRoT3JTaXplLCAoaGVpZ2h0IHx8IHdpZHRoT3JTaXplKV0gOiB3aWR0aE9yU2l6ZTtcbiAgICAgICAgcmV0dXJuIG5ldyBHcm91cChuZXcgUHQodG9wTGVmdCksIG5ldyBQdCh0b3BMZWZ0KS5hZGQoc2l6ZSkpO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbUNlbnRlcihjZW50ZXIsIHdpZHRoT3JTaXplLCBoZWlnaHQpIHtcbiAgICAgICAgbGV0IGhhbGYgPSAodHlwZW9mIHdpZHRoT3JTaXplID09IFwibnVtYmVyXCIpID8gW3dpZHRoT3JTaXplIC8gMiwgKGhlaWdodCB8fCB3aWR0aE9yU2l6ZSkgLyAyXSA6IG5ldyBQdCh3aWR0aE9yU2l6ZSkuZGl2aWRlKDIpO1xuICAgICAgICByZXR1cm4gbmV3IEdyb3VwKG5ldyBQdChjZW50ZXIpLnN1YnRyYWN0KGhhbGYpLCBuZXcgUHQoY2VudGVyKS5hZGQoaGFsZikpO1xuICAgIH1cbiAgICBzdGF0aWMgdG9DaXJjbGUocHRzLCB3aXRoaW4gPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBDaXJjbGUuZnJvbVJlY3QocHRzLCB3aXRoaW4pO1xuICAgIH1cbiAgICBzdGF0aWMgdG9TcXVhcmUocHRzLCBlbmNsb3NlID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHMgPSBSZWN0YW5nbGUuc2l6ZShwdHMpO1xuICAgICAgICBsZXQgbSA9IChlbmNsb3NlKSA/IHMubWF4VmFsdWUoKS52YWx1ZSA6IHMubWluVmFsdWUoKS52YWx1ZTtcbiAgICAgICAgcmV0dXJuIFJlY3RhbmdsZS5mcm9tQ2VudGVyKFJlY3RhbmdsZS5jZW50ZXIocHRzKSwgbSwgbSk7XG4gICAgfVxuICAgIHN0YXRpYyBzaXplKHB0cykge1xuICAgICAgICByZXR1cm4gcHRzWzBdLiRtYXgocHRzWzFdKS5zdWJ0cmFjdChwdHNbMF0uJG1pbihwdHNbMV0pKTtcbiAgICB9XG4gICAgc3RhdGljIGNlbnRlcihwdHMpIHtcbiAgICAgICAgbGV0IG1pbiA9IHB0c1swXS4kbWluKHB0c1sxXSk7XG4gICAgICAgIGxldCBtYXggPSBwdHNbMF0uJG1heChwdHNbMV0pO1xuICAgICAgICByZXR1cm4gbWluLmFkZChtYXguJHN1YnRyYWN0KG1pbikuZGl2aWRlKDIpKTtcbiAgICB9XG4gICAgc3RhdGljIGNvcm5lcnMocmVjdCkge1xuICAgICAgICBsZXQgcDAgPSByZWN0WzBdLiRtaW4ocmVjdFsxXSk7XG4gICAgICAgIGxldCBwMiA9IHJlY3RbMF0uJG1heChyZWN0WzFdKTtcbiAgICAgICAgcmV0dXJuIG5ldyBHcm91cChwMCwgbmV3IFB0KHAyLngsIHAwLnkpLCBwMiwgbmV3IFB0KHAwLngsIHAyLnkpKTtcbiAgICB9XG4gICAgc3RhdGljIHNpZGVzKHJlY3QpIHtcbiAgICAgICAgbGV0IFtwMCwgcDEsIHAyLCBwM10gPSBSZWN0YW5nbGUuY29ybmVycyhyZWN0KTtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG5ldyBHcm91cChwMCwgcDEpLCBuZXcgR3JvdXAocDEsIHAyKSxcbiAgICAgICAgICAgIG5ldyBHcm91cChwMiwgcDMpLCBuZXcgR3JvdXAocDMsIHAwKVxuICAgICAgICBdO1xuICAgIH1cbiAgICBzdGF0aWMgYm91bmRpbmdCb3gocmVjdHMpIHtcbiAgICAgICAgbGV0IG1lcmdlZCA9IFV0aWwuZmxhdHRlbihyZWN0cywgZmFsc2UpO1xuICAgICAgICBsZXQgbWluID0gUHQubWFrZSgyLCBOdW1iZXIuTUFYX1ZBTFVFKTtcbiAgICAgICAgbGV0IG1heCA9IFB0Lm1ha2UoMiwgTnVtYmVyLk1JTl9WQUxVRSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBtZXJnZWQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgMjsgaysrKSB7XG4gICAgICAgICAgICAgICAgbWluW2tdID0gTWF0aC5taW4obWluW2tdLCBtZXJnZWRbaV1ba10pO1xuICAgICAgICAgICAgICAgIG1heFtrXSA9IE1hdGgubWF4KG1heFtrXSwgbWVyZ2VkW2ldW2tdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEdyb3VwKG1pbiwgbWF4KTtcbiAgICB9XG4gICAgc3RhdGljIHBvbHlnb24ocmVjdCkge1xuICAgICAgICByZXR1cm4gUmVjdGFuZ2xlLmNvcm5lcnMocmVjdCk7XG4gICAgfVxuICAgIHN0YXRpYyBxdWFkcmFudHMocmVjdCwgY2VudGVyKSB7XG4gICAgICAgIGxldCBjb3JuZXJzID0gUmVjdGFuZ2xlLmNvcm5lcnMocmVjdCk7XG4gICAgICAgIGxldCBfY2VudGVyID0gKGNlbnRlciAhPSB1bmRlZmluZWQpID8gbmV3IFB0KGNlbnRlcikgOiBSZWN0YW5nbGUuY2VudGVyKHJlY3QpO1xuICAgICAgICByZXR1cm4gY29ybmVycy5tYXAoKGMpID0+IG5ldyBHcm91cChjLCBfY2VudGVyKS5ib3VuZGluZ0JveCgpKTtcbiAgICB9XG4gICAgc3RhdGljIGhhbHZlcyhyZWN0LCByYXRpbyA9IDAuNSwgYXNSb3dzID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IG1pbiA9IHJlY3RbMF0uJG1pbihyZWN0WzFdKTtcbiAgICAgICAgbGV0IG1heCA9IHJlY3RbMF0uJG1heChyZWN0WzFdKTtcbiAgICAgICAgbGV0IG1pZCA9IChhc1Jvd3MpID8gTnVtLmxlcnAobWluWzFdLCBtYXhbMV0sIHJhdGlvKSA6IE51bS5sZXJwKG1pblswXSwgbWF4WzBdLCByYXRpbyk7XG4gICAgICAgIHJldHVybiAoYXNSb3dzKVxuICAgICAgICAgICAgPyBbbmV3IEdyb3VwKG1pbiwgbmV3IFB0KG1heFswXSwgbWlkKSksIG5ldyBHcm91cChuZXcgUHQobWluWzBdLCBtaWQpLCBtYXgpXVxuICAgICAgICAgICAgOiBbbmV3IEdyb3VwKG1pbiwgbmV3IFB0KG1pZCwgbWF4WzFdKSksIG5ldyBHcm91cChuZXcgUHQobWlkLCBtaW5bMV0pLCBtYXgpXTtcbiAgICB9XG4gICAgc3RhdGljIHdpdGhpbkJvdW5kKHJlY3QsIHB0KSB7XG4gICAgICAgIHJldHVybiBHZW9tLndpdGhpbkJvdW5kKHB0LCByZWN0WzBdLCByZWN0WzFdKTtcbiAgICB9XG4gICAgc3RhdGljIGhhc0ludGVyc2VjdFJlY3QyRChyZWN0MSwgcmVjdDIsIHJlc2V0Qm91bmRpbmdCb3ggPSBmYWxzZSkge1xuICAgICAgICBpZiAocmVzZXRCb3VuZGluZ0JveCkge1xuICAgICAgICAgICAgcmVjdDEgPSBHZW9tLmJvdW5kaW5nQm94KHJlY3QxKTtcbiAgICAgICAgICAgIHJlY3QyID0gR2VvbS5ib3VuZGluZ0JveChyZWN0Mik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlY3QxWzBdWzBdID4gcmVjdDJbMV1bMF0gfHwgcmVjdDJbMF1bMF0gPiByZWN0MVsxXVswXSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHJlY3QxWzBdWzFdID4gcmVjdDJbMV1bMV0gfHwgcmVjdDJbMF1bMV0gPiByZWN0MVsxXVsxXSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHN0YXRpYyBpbnRlcnNlY3RSZWN0MkQocmVjdDEsIHJlY3QyKSB7XG4gICAgICAgIGlmICghUmVjdGFuZ2xlLmhhc0ludGVyc2VjdFJlY3QyRChyZWN0MSwgcmVjdDIpKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBHcm91cCgpO1xuICAgICAgICByZXR1cm4gTGluZS5pbnRlcnNlY3RMaW5lczJEKFJlY3RhbmdsZS5zaWRlcyhyZWN0MSksIFJlY3RhbmdsZS5zaWRlcyhyZWN0MikpO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBDaXJjbGUge1xuICAgIHN0YXRpYyBmcm9tUmVjdChwdHMsIGVuY2xvc2UgPSBmYWxzZSkge1xuICAgICAgICBsZXQgciA9IDA7XG4gICAgICAgIGxldCBtaW4gPSByID0gUmVjdGFuZ2xlLnNpemUocHRzKS5taW5WYWx1ZSgpLnZhbHVlIC8gMjtcbiAgICAgICAgaWYgKGVuY2xvc2UpIHtcbiAgICAgICAgICAgIGxldCBtYXggPSBSZWN0YW5nbGUuc2l6ZShwdHMpLm1heFZhbHVlKCkudmFsdWUgLyAyO1xuICAgICAgICAgICAgciA9IE1hdGguc3FydChtaW4gKiBtaW4gKyBtYXggKiBtYXgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgciA9IG1pbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEdyb3VwKFJlY3RhbmdsZS5jZW50ZXIocHRzKSwgbmV3IFB0KHIsIHIpKTtcbiAgICB9XG4gICAgc3RhdGljIGZyb21UcmlhbmdsZShwdHMsIGVuY2xvc2UgPSBmYWxzZSkge1xuICAgICAgICBpZiAoZW5jbG9zZSkge1xuICAgICAgICAgICAgcmV0dXJuIFRyaWFuZ2xlLmNpcmN1bWNpcmNsZShwdHMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFRyaWFuZ2xlLmluY2lyY2xlKHB0cyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIGZyb21DZW50ZXIocHQsIHJhZGl1cykge1xuICAgICAgICByZXR1cm4gbmV3IEdyb3VwKG5ldyBQdChwdCksIG5ldyBQdChyYWRpdXMsIHJhZGl1cykpO1xuICAgIH1cbiAgICBzdGF0aWMgd2l0aGluQm91bmQocHRzLCBwdCwgdGhyZXNob2xkID0gMCkge1xuICAgICAgICBsZXQgZCA9IHB0c1swXS4kc3VidHJhY3QocHQpO1xuICAgICAgICByZXR1cm4gZC5kb3QoZCkgKyB0aHJlc2hvbGQgPCBwdHNbMV0ueCAqIHB0c1sxXS54O1xuICAgIH1cbiAgICBzdGF0aWMgaW50ZXJzZWN0UmF5MkQocHRzLCByYXkpIHtcbiAgICAgICAgbGV0IGQgPSByYXlbMF0uJHN1YnRyYWN0KHJheVsxXSk7XG4gICAgICAgIGxldCBmID0gcHRzWzBdLiRzdWJ0cmFjdChyYXlbMF0pO1xuICAgICAgICBsZXQgYSA9IGQuZG90KGQpO1xuICAgICAgICBsZXQgYiA9IGYuZG90KGQpO1xuICAgICAgICBsZXQgYyA9IGYuZG90KGYpIC0gcHRzWzFdLnggKiBwdHNbMV0ueDtcbiAgICAgICAgbGV0IHAgPSBiIC8gYTtcbiAgICAgICAgbGV0IHEgPSBjIC8gYTtcbiAgICAgICAgbGV0IGRpc2MgPSBwICogcCAtIHE7XG4gICAgICAgIGlmIChkaXNjIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBHcm91cCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGRpc2NTcXJ0ID0gTWF0aC5zcXJ0KGRpc2MpO1xuICAgICAgICAgICAgbGV0IHQxID0gLXAgKyBkaXNjU3FydDtcbiAgICAgICAgICAgIGxldCBwMSA9IHJheVswXS4kc3VidHJhY3QoZC4kbXVsdGlwbHkodDEpKTtcbiAgICAgICAgICAgIGlmIChkaXNjID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgR3JvdXAocDEpO1xuICAgICAgICAgICAgbGV0IHQyID0gLXAgLSBkaXNjU3FydDtcbiAgICAgICAgICAgIGxldCBwMiA9IHJheVswXS4kc3VidHJhY3QoZC4kbXVsdGlwbHkodDIpKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgR3JvdXAocDEsIHAyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgaW50ZXJzZWN0TGluZTJEKHB0cywgbGluZSkge1xuICAgICAgICBsZXQgcHMgPSBDaXJjbGUuaW50ZXJzZWN0UmF5MkQocHRzLCBsaW5lKTtcbiAgICAgICAgbGV0IGcgPSBuZXcgR3JvdXAoKTtcbiAgICAgICAgaWYgKHBzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChSZWN0YW5nbGUud2l0aGluQm91bmQobGluZSwgcHNbaV0pKVxuICAgICAgICAgICAgICAgICAgICBnLnB1c2gocHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnO1xuICAgIH1cbiAgICBzdGF0aWMgaW50ZXJzZWN0Q2lyY2xlMkQocHRzLCBjaXJjbGUpIHtcbiAgICAgICAgbGV0IGR2ID0gY2lyY2xlWzBdLiRzdWJ0cmFjdChwdHNbMF0pO1xuICAgICAgICBsZXQgZHIyID0gZHYubWFnbml0dWRlU3EoKTtcbiAgICAgICAgbGV0IGRyID0gTWF0aC5zcXJ0KGRyMik7XG4gICAgICAgIGxldCBhciA9IHB0c1sxXS54O1xuICAgICAgICBsZXQgYnIgPSBjaXJjbGVbMV0ueDtcbiAgICAgICAgbGV0IGFyMiA9IGFyICogYXI7XG4gICAgICAgIGxldCBicjIgPSBiciAqIGJyO1xuICAgICAgICBpZiAoZHIgPiBhciArIGJyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEdyb3VwKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZHIgPCBNYXRoLmFicyhhciAtIGJyKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBHcm91cChwdHNbMF0uY2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgYSA9IChhcjIgLSBicjIgKyBkcjIpIC8gKDIgKiBkcik7XG4gICAgICAgICAgICBsZXQgaCA9IE1hdGguc3FydChhcjIgLSBhICogYSk7XG4gICAgICAgICAgICBsZXQgcCA9IGR2LiRtdWx0aXBseShhIC8gZHIpLmFkZChwdHNbMF0pO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBHcm91cChuZXcgUHQocC54ICsgaCAqIGR2LnkgLyBkciwgcC55IC0gaCAqIGR2LnggLyBkciksIG5ldyBQdChwLnggLSBoICogZHYueSAvIGRyLCBwLnkgKyBoICogZHYueCAvIGRyKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIGludGVyc2VjdFJlY3QyRChwdHMsIHJlY3QpIHtcbiAgICAgICAgbGV0IHNpZGVzID0gUmVjdGFuZ2xlLnNpZGVzKHJlY3QpO1xuICAgICAgICBsZXQgZyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gc2lkZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwcyA9IENpcmNsZS5pbnRlcnNlY3RMaW5lMkQocHRzLCBzaWRlc1tpXSk7XG4gICAgICAgICAgICBpZiAocHMubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICBnLnB1c2gocHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBVdGlsLmZsYXR0ZW4oZyk7XG4gICAgfVxuICAgIHN0YXRpYyB0b1JlY3QocHRzLCB3aXRoaW4gPSBmYWxzZSkge1xuICAgICAgICBsZXQgciA9IHB0c1sxXVswXTtcbiAgICAgICAgaWYgKHdpdGhpbikge1xuICAgICAgICAgICAgbGV0IGhhbGYgPSBNYXRoLnNxcnQociAqIHIpIC8gMjtcbiAgICAgICAgICAgIHJldHVybiBuZXcgR3JvdXAocHRzWzBdLiRzdWJ0cmFjdChoYWxmKSwgcHRzWzBdLiRhZGQoaGFsZikpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBHcm91cChwdHNbMF0uJHN1YnRyYWN0KHIpLCBwdHNbMF0uJGFkZChyKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIHRvVHJpYW5nbGUocHRzLCB3aXRoaW4gPSB0cnVlKSB7XG4gICAgICAgIGlmICh3aXRoaW4pIHtcbiAgICAgICAgICAgIGxldCBhbmcgPSAtTWF0aC5QSSAvIDI7XG4gICAgICAgICAgICBsZXQgaW5jID0gTWF0aC5QSSAqIDIgLyAzO1xuICAgICAgICAgICAgbGV0IGcgPSBuZXcgR3JvdXAoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZy5wdXNoKHB0c1swXS5jbG9uZSgpLnRvQW5nbGUoYW5nLCBwdHNbMV1bMF0sIHRydWUpKTtcbiAgICAgICAgICAgICAgICBhbmcgKz0gaW5jO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gVHJpYW5nbGUuZnJvbUNlbnRlcihwdHNbMF0sIHB0c1sxXVswXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgY2xhc3MgVHJpYW5nbGUge1xuICAgIHN0YXRpYyBmcm9tUmVjdChyZWN0KSB7XG4gICAgICAgIGxldCB0b3AgPSByZWN0WzBdLiRhZGQocmVjdFsxXSkuZGl2aWRlKDIpO1xuICAgICAgICB0b3AueSA9IHJlY3RbMF1bMV07XG4gICAgICAgIGxldCBsZWZ0ID0gcmVjdFsxXS5jbG9uZSgpO1xuICAgICAgICBsZWZ0LnggPSByZWN0WzBdWzBdO1xuICAgICAgICByZXR1cm4gbmV3IEdyb3VwKHRvcCwgcmVjdFsxXS5jbG9uZSgpLCBsZWZ0KTtcbiAgICB9XG4gICAgc3RhdGljIGZyb21DaXJjbGUoY2lyY2xlKSB7XG4gICAgICAgIHJldHVybiBDaXJjbGUudG9UcmlhbmdsZShjaXJjbGUsIHRydWUpO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbUNlbnRlcihwdCwgc2l6ZSkge1xuICAgICAgICByZXR1cm4gVHJpYW5nbGUuZnJvbUNpcmNsZShDaXJjbGUuZnJvbUNlbnRlcihwdCwgc2l6ZSkpO1xuICAgIH1cbiAgICBzdGF0aWMgbWVkaWFsKHB0cykge1xuICAgICAgICBpZiAocHRzLmxlbmd0aCA8IDMpXG4gICAgICAgICAgICByZXR1cm4gX2Vycm9yTGVuZ3RoKG5ldyBHcm91cCgpLCAzKTtcbiAgICAgICAgcmV0dXJuIFBvbHlnb24ubWlkcG9pbnRzKHB0cywgdHJ1ZSk7XG4gICAgfVxuICAgIHN0YXRpYyBvcHBvc2l0ZVNpZGUocHRzLCBpbmRleCkge1xuICAgICAgICBpZiAocHRzLmxlbmd0aCA8IDMpXG4gICAgICAgICAgICByZXR1cm4gX2Vycm9yTGVuZ3RoKG5ldyBHcm91cCgpLCAzKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gR3JvdXAuZnJvbVB0QXJyYXkoW3B0c1sxXSwgcHRzWzJdXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBHcm91cC5mcm9tUHRBcnJheShbcHRzWzBdLCBwdHNbMl1dKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBHcm91cC5mcm9tUHRBcnJheShbcHRzWzBdLCBwdHNbMV1dKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgYWx0aXR1ZGUocHRzLCBpbmRleCkge1xuICAgICAgICBsZXQgb3BwID0gVHJpYW5nbGUub3Bwb3NpdGVTaWRlKHB0cywgaW5kZXgpO1xuICAgICAgICBpZiAob3BwLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgR3JvdXAocHRzW2luZGV4XSwgTGluZS5wZXJwZW5kaWN1bGFyRnJvbVB0KG9wcCwgcHRzW2luZGV4XSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBHcm91cCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBvcnRob2NlbnRlcihwdHMpIHtcbiAgICAgICAgaWYgKHB0cy5sZW5ndGggPCAzKVxuICAgICAgICAgICAgcmV0dXJuIF9lcnJvckxlbmd0aCh1bmRlZmluZWQsIDMpO1xuICAgICAgICBsZXQgYSA9IFRyaWFuZ2xlLmFsdGl0dWRlKHB0cywgMCk7XG4gICAgICAgIGxldCBiID0gVHJpYW5nbGUuYWx0aXR1ZGUocHRzLCAxKTtcbiAgICAgICAgcmV0dXJuIExpbmUuaW50ZXJzZWN0UmF5MkQoYSwgYik7XG4gICAgfVxuICAgIHN0YXRpYyBpbmNlbnRlcihwdHMpIHtcbiAgICAgICAgaWYgKHB0cy5sZW5ndGggPCAzKVxuICAgICAgICAgICAgcmV0dXJuIF9lcnJvckxlbmd0aCh1bmRlZmluZWQsIDMpO1xuICAgICAgICBsZXQgYSA9IFBvbHlnb24uYmlzZWN0b3IocHRzLCAwKS5hZGQocHRzWzBdKTtcbiAgICAgICAgbGV0IGIgPSBQb2x5Z29uLmJpc2VjdG9yKHB0cywgMSkuYWRkKHB0c1sxXSk7XG4gICAgICAgIHJldHVybiBMaW5lLmludGVyc2VjdFJheTJEKG5ldyBHcm91cChwdHNbMF0sIGEpLCBuZXcgR3JvdXAocHRzWzFdLCBiKSk7XG4gICAgfVxuICAgIHN0YXRpYyBpbmNpcmNsZShwdHMsIGNlbnRlcikge1xuICAgICAgICBsZXQgYyA9IChjZW50ZXIpID8gY2VudGVyIDogVHJpYW5nbGUuaW5jZW50ZXIocHRzKTtcbiAgICAgICAgbGV0IGFyZWEgPSBQb2x5Z29uLmFyZWEocHRzKTtcbiAgICAgICAgbGV0IHBlcmltID0gUG9seWdvbi5wZXJpbWV0ZXIocHRzLCB0cnVlKTtcbiAgICAgICAgbGV0IHIgPSAyICogYXJlYSAvIHBlcmltLnRvdGFsO1xuICAgICAgICByZXR1cm4gQ2lyY2xlLmZyb21DZW50ZXIoYywgcik7XG4gICAgfVxuICAgIHN0YXRpYyBjaXJjdW1jZW50ZXIocHRzKSB7XG4gICAgICAgIGxldCBtZCA9IFRyaWFuZ2xlLm1lZGlhbChwdHMpO1xuICAgICAgICBsZXQgYSA9IFttZFswXSwgR2VvbS5wZXJwZW5kaWN1bGFyKHB0c1swXS4kc3VidHJhY3QobWRbMF0pKS5wMS4kYWRkKG1kWzBdKV07XG4gICAgICAgIGxldCBiID0gW21kWzFdLCBHZW9tLnBlcnBlbmRpY3VsYXIocHRzWzFdLiRzdWJ0cmFjdChtZFsxXSkpLnAxLiRhZGQobWRbMV0pXTtcbiAgICAgICAgcmV0dXJuIExpbmUuaW50ZXJzZWN0UmF5MkQoYSwgYik7XG4gICAgfVxuICAgIHN0YXRpYyBjaXJjdW1jaXJjbGUocHRzLCBjZW50ZXIpIHtcbiAgICAgICAgbGV0IGMgPSAoY2VudGVyKSA/IGNlbnRlciA6IFRyaWFuZ2xlLmNpcmN1bWNlbnRlcihwdHMpO1xuICAgICAgICBsZXQgciA9IHB0c1swXS4kc3VidHJhY3QoYykubWFnbml0dWRlKCk7XG4gICAgICAgIHJldHVybiBDaXJjbGUuZnJvbUNlbnRlcihjLCByKTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgUG9seWdvbiB7XG4gICAgc3RhdGljIGNlbnRyb2lkKHB0cykge1xuICAgICAgICByZXR1cm4gR2VvbS5jZW50cm9pZChwdHMpO1xuICAgIH1cbiAgICBzdGF0aWMgcmVjdGFuZ2xlKGNlbnRlciwgd2lkdGhPclNpemUsIGhlaWdodCkge1xuICAgICAgICByZXR1cm4gUmVjdGFuZ2xlLmNvcm5lcnMoUmVjdGFuZ2xlLmZyb21DZW50ZXIoY2VudGVyLCB3aWR0aE9yU2l6ZSwgaGVpZ2h0KSk7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tQ2VudGVyKGNlbnRlciwgcmFkaXVzLCBzaWRlcykge1xuICAgICAgICBsZXQgZyA9IG5ldyBHcm91cCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpZGVzOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBhbmcgPSBNYXRoLlBJICogMiAqIGkgLyBzaWRlcztcbiAgICAgICAgICAgIGcucHVzaChuZXcgUHQoTWF0aC5jb3MoYW5nKSAqIHJhZGl1cywgTWF0aC5zaW4oYW5nKSAqIHJhZGl1cykuYWRkKGNlbnRlcikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnO1xuICAgIH1cbiAgICBzdGF0aWMgbGluZUF0KHB0cywgaWR4KSB7XG4gICAgICAgIGlmIChpZHggPCAwIHx8IGlkeCA+PSBwdHMubGVuZ3RoKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW5kZXggb3V0IG9mIHRoZSBQb2x5Z29uJ3MgcmFuZ2VcIik7XG4gICAgICAgIHJldHVybiBuZXcgR3JvdXAocHRzW2lkeF0sIChpZHggPT09IHB0cy5sZW5ndGggLSAxKSA/IHB0c1swXSA6IHB0c1tpZHggKyAxXSk7XG4gICAgfVxuICAgIHN0YXRpYyBsaW5lcyhwdHMsIGNsb3NlUGF0aCA9IHRydWUpIHtcbiAgICAgICAgaWYgKHB0cy5sZW5ndGggPCAyKVxuICAgICAgICAgICAgcmV0dXJuIF9lcnJvckxlbmd0aChuZXcgR3JvdXAoKSwgMik7XG4gICAgICAgIGxldCBzcCA9IFV0aWwuc3BsaXQocHRzLCAyLCAxKTtcbiAgICAgICAgaWYgKGNsb3NlUGF0aClcbiAgICAgICAgICAgIHNwLnB1c2gobmV3IEdyb3VwKHB0c1twdHMubGVuZ3RoIC0gMV0sIHB0c1swXSkpO1xuICAgICAgICByZXR1cm4gc3AubWFwKChnKSA9PiBnKTtcbiAgICB9XG4gICAgc3RhdGljIG1pZHBvaW50cyhwdHMsIGNsb3NlUGF0aCA9IGZhbHNlLCB0ID0gMC41KSB7XG4gICAgICAgIGlmIChwdHMubGVuZ3RoIDwgMilcbiAgICAgICAgICAgIHJldHVybiBfZXJyb3JMZW5ndGgobmV3IEdyb3VwKCksIDIpO1xuICAgICAgICBsZXQgc2lkZXMgPSBQb2x5Z29uLmxpbmVzKHB0cywgY2xvc2VQYXRoKTtcbiAgICAgICAgbGV0IG1pZHMgPSBzaWRlcy5tYXAoKHMpID0+IEdlb20uaW50ZXJwb2xhdGUoc1swXSwgc1sxXSwgdCkpO1xuICAgICAgICByZXR1cm4gbWlkcztcbiAgICB9XG4gICAgc3RhdGljIGFkamFjZW50U2lkZXMocHRzLCBpbmRleCwgY2xvc2VQYXRoID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHB0cy5sZW5ndGggPCAyKVxuICAgICAgICAgICAgcmV0dXJuIF9lcnJvckxlbmd0aChuZXcgR3JvdXAoKSwgMik7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gcHRzLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiBfZXJyb3JPdXRvZkJvdW5kKG5ldyBHcm91cCgpLCBpbmRleCk7XG4gICAgICAgIGxldCBncyA9IFtdO1xuICAgICAgICBsZXQgbGVmdCA9IGluZGV4IC0gMTtcbiAgICAgICAgaWYgKGNsb3NlUGF0aCAmJiBsZWZ0IDwgMClcbiAgICAgICAgICAgIGxlZnQgPSBwdHMubGVuZ3RoIC0gMTtcbiAgICAgICAgaWYgKGxlZnQgPj0gMClcbiAgICAgICAgICAgIGdzLnB1c2gobmV3IEdyb3VwKHB0c1tpbmRleF0sIHB0c1tsZWZ0XSkpO1xuICAgICAgICBsZXQgcmlnaHQgPSBpbmRleCArIDE7XG4gICAgICAgIGlmIChjbG9zZVBhdGggJiYgcmlnaHQgPiBwdHMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIHJpZ2h0ID0gMDtcbiAgICAgICAgaWYgKHJpZ2h0IDw9IHB0cy5sZW5ndGggLSAxKVxuICAgICAgICAgICAgZ3MucHVzaChuZXcgR3JvdXAocHRzW2luZGV4XSwgcHRzW3JpZ2h0XSkpO1xuICAgICAgICByZXR1cm4gZ3M7XG4gICAgfVxuICAgIHN0YXRpYyBiaXNlY3RvcihwdHMsIGluZGV4KSB7XG4gICAgICAgIGxldCBzaWRlcyA9IFBvbHlnb24uYWRqYWNlbnRTaWRlcyhwdHMsIGluZGV4LCB0cnVlKTtcbiAgICAgICAgaWYgKHNpZGVzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICBsZXQgYSA9IHNpZGVzWzBdWzFdLiRzdWJ0cmFjdChzaWRlc1swXVswXSkudW5pdCgpO1xuICAgICAgICAgICAgbGV0IGIgPSBzaWRlc1sxXVsxXS4kc3VidHJhY3Qoc2lkZXNbMV1bMF0pLnVuaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBhLmFkZChiKS5kaXZpZGUoMik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBwZXJpbWV0ZXIocHRzLCBjbG9zZVBhdGggPSBmYWxzZSkge1xuICAgICAgICBpZiAocHRzLmxlbmd0aCA8IDIpXG4gICAgICAgICAgICByZXR1cm4gX2Vycm9yTGVuZ3RoKG5ldyBHcm91cCgpLCAyKTtcbiAgICAgICAgbGV0IGxpbmVzID0gUG9seWdvbi5saW5lcyhwdHMsIGNsb3NlUGF0aCk7XG4gICAgICAgIGxldCBtYWcgPSAwO1xuICAgICAgICBsZXQgcCA9IFB0Lm1ha2UobGluZXMubGVuZ3RoLCAwKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbSA9IExpbmUubWFnbml0dWRlKGxpbmVzW2ldKTtcbiAgICAgICAgICAgIG1hZyArPSBtO1xuICAgICAgICAgICAgcFtpXSA9IG07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvdGFsOiBtYWcsXG4gICAgICAgICAgICBzZWdtZW50czogcFxuICAgICAgICB9O1xuICAgIH1cbiAgICBzdGF0aWMgYXJlYShwdHMpIHtcbiAgICAgICAgaWYgKHB0cy5sZW5ndGggPCAzKVxuICAgICAgICAgICAgcmV0dXJuIF9lcnJvckxlbmd0aChuZXcgR3JvdXAoKSwgMyk7XG4gICAgICAgIGxldCBkZXQgPSAoYSwgYikgPT4gYVswXSAqIGJbMV0gLSBhWzFdICogYlswXTtcbiAgICAgICAgbGV0IGFyZWEgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcHRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSA8IHB0cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgYXJlYSArPSBkZXQocHRzW2ldLCBwdHNbaSArIDFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFyZWEgKz0gZGV0KHB0c1tpXSwgcHRzWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYXJlYSAvIDIpO1xuICAgIH1cbiAgICBzdGF0aWMgY29udmV4SHVsbChwdHMsIHNvcnRlZCA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChwdHMubGVuZ3RoIDwgMylcbiAgICAgICAgICAgIHJldHVybiBfZXJyb3JMZW5ndGgobmV3IEdyb3VwKCksIDMpO1xuICAgICAgICBpZiAoIXNvcnRlZCkge1xuICAgICAgICAgICAgcHRzID0gcHRzLnNsaWNlKCk7XG4gICAgICAgICAgICBwdHMuc29ydCgoYSwgYikgPT4gYVswXSAtIGJbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBsZWZ0ID0gKGEsIGIsIGMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYlswXSAtIGFbMF0pICogKGNbMV0gLSBhWzFdKSAtIChjWzBdIC0gYVswXSkgKiAoYlsxXSAtIGFbMV0pID4gMDtcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGRxID0gW107XG4gICAgICAgIGxldCBib3QgPSBwdHMubGVuZ3RoIC0gMjtcbiAgICAgICAgbGV0IHRvcCA9IGJvdCArIDM7XG4gICAgICAgIGRxW2JvdF0gPSBwdHNbMl07XG4gICAgICAgIGRxW3RvcF0gPSBwdHNbMl07XG4gICAgICAgIGlmIChsZWZ0KHB0c1swXSwgcHRzWzFdLCBwdHNbMl0pKSB7XG4gICAgICAgICAgICBkcVtib3QgKyAxXSA9IHB0c1swXTtcbiAgICAgICAgICAgIGRxW2JvdCArIDJdID0gcHRzWzFdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZHFbYm90ICsgMV0gPSBwdHNbMV07XG4gICAgICAgICAgICBkcVtib3QgKyAyXSA9IHB0c1swXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMywgbGVuID0gcHRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcHQgPSBwdHNbaV07XG4gICAgICAgICAgICBpZiAobGVmdChkcVtib3RdLCBkcVtib3QgKyAxXSwgcHQpICYmIGxlZnQoZHFbdG9wIC0gMV0sIGRxW3RvcF0sIHB0KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKCFsZWZ0KGRxW2JvdF0sIGRxW2JvdCArIDFdLCBwdCkpIHtcbiAgICAgICAgICAgICAgICBib3QgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJvdCAtPSAxO1xuICAgICAgICAgICAgZHFbYm90XSA9IHB0O1xuICAgICAgICAgICAgd2hpbGUgKCFsZWZ0KGRxW3RvcCAtIDFdLCBkcVt0b3BdLCBwdCkpIHtcbiAgICAgICAgICAgICAgICB0b3AgLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvcCArPSAxO1xuICAgICAgICAgICAgZHFbdG9wXSA9IHB0O1xuICAgICAgICB9XG4gICAgICAgIGxldCBodWxsID0gbmV3IEdyb3VwKCk7XG4gICAgICAgIGZvciAobGV0IGggPSAwOyBoIDwgKHRvcCAtIGJvdCk7IGgrKykge1xuICAgICAgICAgICAgaHVsbC5wdXNoKGRxW2JvdCArIGhdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaHVsbDtcbiAgICB9XG4gICAgc3RhdGljIG5ldHdvcmsocHRzLCBvcmlnaW5JbmRleCA9IDApIHtcbiAgICAgICAgbGV0IGcgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHB0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgIT0gb3JpZ2luSW5kZXgpXG4gICAgICAgICAgICAgICAgZy5wdXNoKG5ldyBHcm91cChwdHNbb3JpZ2luSW5kZXhdLCBwdHNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZztcbiAgICB9XG4gICAgc3RhdGljIG5lYXJlc3RQdChwdHMsIHB0KSB7XG4gICAgICAgIGxldCBfbmVhciA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgIGxldCBfaXRlbSA9IC0xO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcHRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZCA9IHB0c1tpXS4kc3VidHJhY3QocHQpLm1hZ25pdHVkZVNxKCk7XG4gICAgICAgICAgICBpZiAoZCA8IF9uZWFyKSB7XG4gICAgICAgICAgICAgICAgX25lYXIgPSBkO1xuICAgICAgICAgICAgICAgIF9pdGVtID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX2l0ZW07XG4gICAgfVxuICAgIHN0YXRpYyBwcm9qZWN0QXhpcyhwb2x5LCB1bml0QXhpcykge1xuICAgICAgICBsZXQgZG90ID0gdW5pdEF4aXMuZG90KHBvbHlbMF0pO1xuICAgICAgICBsZXQgZCA9IG5ldyBQdChkb3QsIGRvdCk7XG4gICAgICAgIGZvciAobGV0IG4gPSAxLCBsZW4gPSBwb2x5Lmxlbmd0aDsgbiA8IGxlbjsgbisrKSB7XG4gICAgICAgICAgICBkb3QgPSB1bml0QXhpcy5kb3QocG9seVtuXSk7XG4gICAgICAgICAgICBkID0gbmV3IFB0KE1hdGgubWluKGRvdCwgZFswXSksIE1hdGgubWF4KGRvdCwgZFsxXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkO1xuICAgIH1cbiAgICBzdGF0aWMgX2F4aXNPdmVybGFwKHBvbHkxLCBwb2x5MiwgdW5pdEF4aXMpIHtcbiAgICAgICAgbGV0IHBhID0gUG9seWdvbi5wcm9qZWN0QXhpcyhwb2x5MSwgdW5pdEF4aXMpO1xuICAgICAgICBsZXQgcGIgPSBQb2x5Z29uLnByb2plY3RBeGlzKHBvbHkyLCB1bml0QXhpcyk7XG4gICAgICAgIHJldHVybiAocGFbMF0gPCBwYlswXSkgPyBwYlswXSAtIHBhWzFdIDogcGFbMF0gLSBwYlsxXTtcbiAgICB9XG4gICAgc3RhdGljIGhhc0ludGVyc2VjdFBvaW50KHBvbHksIHB0KSB7XG4gICAgICAgIGxldCBjID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBwb2x5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbG4gPSBQb2x5Z29uLmxpbmVBdChwb2x5LCBpKTtcbiAgICAgICAgICAgIGlmICgoKGxuWzBdWzFdID4gcHRbMV0pICE9IChsblsxXVsxXSA+IHB0WzFdKSkgJiZcbiAgICAgICAgICAgICAgICAocHRbMF0gPCAobG5bMV1bMF0gLSBsblswXVswXSkgKiAocHRbMV0gLSBsblswXVsxXSkgLyAobG5bMV1bMV0gLSBsblswXVsxXSkgKyBsblswXVswXSkpIHtcbiAgICAgICAgICAgICAgICBjID0gIWM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuICAgIHN0YXRpYyBoYXNJbnRlcnNlY3RDaXJjbGUocG9seSwgY2lyY2xlKSB7XG4gICAgICAgIGxldCBpbmZvID0ge1xuICAgICAgICAgICAgd2hpY2g6IC0xLFxuICAgICAgICAgICAgZGlzdDogMCxcbiAgICAgICAgICAgIG5vcm1hbDogbnVsbCxcbiAgICAgICAgICAgIGVkZ2U6IG51bGwsXG4gICAgICAgICAgICB2ZXJ0ZXg6IG51bGwsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBjID0gY2lyY2xlWzBdO1xuICAgICAgICBsZXQgciA9IGNpcmNsZVsxXVswXTtcbiAgICAgICAgbGV0IG1pbkRpc3QgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHBvbHkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBlZGdlID0gUG9seWdvbi5saW5lQXQocG9seSwgaSk7XG4gICAgICAgICAgICBsZXQgYXhpcyA9IG5ldyBQdChlZGdlWzBdLnkgLSBlZGdlWzFdLnksIGVkZ2VbMV0ueCAtIGVkZ2VbMF0ueCkudW5pdCgpO1xuICAgICAgICAgICAgbGV0IHBvbHkyID0gbmV3IEdyb3VwKGMuJGFkZChheGlzLiRtdWx0aXBseShyKSksIGMuJHN1YnRyYWN0KGF4aXMuJG11bHRpcGx5KHIpKSk7XG4gICAgICAgICAgICBsZXQgZGlzdCA9IFBvbHlnb24uX2F4aXNPdmVybGFwKHBvbHksIHBvbHkyLCBheGlzKTtcbiAgICAgICAgICAgIGlmIChkaXN0ID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoTWF0aC5hYnMoZGlzdCkgPCBtaW5EaXN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoZWNrID0gUmVjdGFuZ2xlLndpdGhpbkJvdW5kKGVkZ2UsIExpbmUucGVycGVuZGljdWxhckZyb21QdChlZGdlLCBjKSkgfHwgQ2lyY2xlLmludGVyc2VjdExpbmUyRChjaXJjbGUsIGVkZ2UpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZm8uZWRnZSA9IGVkZ2U7XG4gICAgICAgICAgICAgICAgICAgIGluZm8ubm9ybWFsID0gYXhpcztcbiAgICAgICAgICAgICAgICAgICAgbWluRGlzdCA9IE1hdGguYWJzKGRpc3QpO1xuICAgICAgICAgICAgICAgICAgICBpbmZvLndoaWNoID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpbmZvLmVkZ2UpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgbGV0IGRpciA9IGMuJHN1YnRyYWN0KFBvbHlnb24uY2VudHJvaWQocG9seSkpLmRvdChpbmZvLm5vcm1hbCk7XG4gICAgICAgIGlmIChkaXIgPCAwKVxuICAgICAgICAgICAgaW5mby5ub3JtYWwubXVsdGlwbHkoLTEpO1xuICAgICAgICBpbmZvLmRpc3QgPSBtaW5EaXN0O1xuICAgICAgICBpbmZvLnZlcnRleCA9IGM7XG4gICAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cbiAgICBzdGF0aWMgaGFzSW50ZXJzZWN0UG9seWdvbihwb2x5MSwgcG9seTIpIHtcbiAgICAgICAgbGV0IGluZm8gPSB7XG4gICAgICAgICAgICB3aGljaDogLTEsXG4gICAgICAgICAgICBkaXN0OiAwLFxuICAgICAgICAgICAgbm9ybWFsOiBuZXcgUHQoKSxcbiAgICAgICAgICAgIGVkZ2U6IG5ldyBHcm91cCgpLFxuICAgICAgICAgICAgdmVydGV4OiBuZXcgUHQoKVxuICAgICAgICB9O1xuICAgICAgICBsZXQgbWluRGlzdCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgcGxlbiA9IChwb2x5MS5sZW5ndGggKyBwb2x5Mi5sZW5ndGgpOyBpIDwgcGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZWRnZSA9IChpIDwgcG9seTEubGVuZ3RoKSA/IFBvbHlnb24ubGluZUF0KHBvbHkxLCBpKSA6IFBvbHlnb24ubGluZUF0KHBvbHkyLCBpIC0gcG9seTEubGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBheGlzID0gbmV3IFB0KGVkZ2VbMF0ueSAtIGVkZ2VbMV0ueSwgZWRnZVsxXS54IC0gZWRnZVswXS54KS51bml0KCk7XG4gICAgICAgICAgICBsZXQgZGlzdCA9IFBvbHlnb24uX2F4aXNPdmVybGFwKHBvbHkxLCBwb2x5MiwgYXhpcyk7XG4gICAgICAgICAgICBpZiAoZGlzdCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKE1hdGguYWJzKGRpc3QpIDwgbWluRGlzdCkge1xuICAgICAgICAgICAgICAgIGluZm8uZWRnZSA9IGVkZ2U7XG4gICAgICAgICAgICAgICAgaW5mby5ub3JtYWwgPSBheGlzO1xuICAgICAgICAgICAgICAgIG1pbkRpc3QgPSBNYXRoLmFicyhkaXN0KTtcbiAgICAgICAgICAgICAgICBpbmZvLndoaWNoID0gKGkgPCBwb2x5MS5sZW5ndGgpID8gMCA6IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaW5mby5kaXN0ID0gbWluRGlzdDtcbiAgICAgICAgbGV0IGIxID0gKGluZm8ud2hpY2ggPT09IDApID8gcG9seTIgOiBwb2x5MTtcbiAgICAgICAgbGV0IGIyID0gKGluZm8ud2hpY2ggPT09IDApID8gcG9seTEgOiBwb2x5MjtcbiAgICAgICAgbGV0IGMxID0gUG9seWdvbi5jZW50cm9pZChiMSk7XG4gICAgICAgIGxldCBjMiA9IFBvbHlnb24uY2VudHJvaWQoYjIpO1xuICAgICAgICBsZXQgZGlyID0gYzEuJHN1YnRyYWN0KGMyKS5kb3QoaW5mby5ub3JtYWwpO1xuICAgICAgICBpZiAoZGlyIDwgMClcbiAgICAgICAgICAgIGluZm8ubm9ybWFsLm11bHRpcGx5KC0xKTtcbiAgICAgICAgbGV0IHNtYWxsZXN0ID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBiMS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IGQgPSBpbmZvLm5vcm1hbC5kb3QoYjFbaV0uJHN1YnRyYWN0KGMyKSk7XG4gICAgICAgICAgICBpZiAoZCA8IHNtYWxsZXN0KSB7XG4gICAgICAgICAgICAgICAgc21hbGxlc3QgPSBkO1xuICAgICAgICAgICAgICAgIGluZm8udmVydGV4ID0gYjFbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuICAgIHN0YXRpYyBpbnRlcnNlY3RQb2x5Z29uMkQocG9seTEsIHBvbHkyKSB7XG4gICAgICAgIGxldCBscCA9IFBvbHlnb24ubGluZXMocG9seTEpO1xuICAgICAgICBsZXQgZyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbHAubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBpbnMgPSBMaW5lLmludGVyc2VjdFBvbHlnb24yRChscFtpXSwgcG9seTIsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChpbnMpXG4gICAgICAgICAgICAgICAgZy5wdXNoKGlucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFV0aWwuZmxhdHRlbihnLCB0cnVlKTtcbiAgICB9XG4gICAgc3RhdGljIHRvUmVjdHMocG9seXMpIHtcbiAgICAgICAgbGV0IGJveGVzID0gcG9seXMubWFwKChnKSA9PiBHZW9tLmJvdW5kaW5nQm94KGcpKTtcbiAgICAgICAgbGV0IG1lcmdlZCA9IFV0aWwuZmxhdHRlbihib3hlcywgZmFsc2UpO1xuICAgICAgICBib3hlcy51bnNoaWZ0KEdlb20uYm91bmRpbmdCb3gobWVyZ2VkKSk7XG4gICAgICAgIHJldHVybiBib3hlcztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgQ3VydmUge1xuICAgIHN0YXRpYyBnZXRTdGVwcyhzdGVwcykge1xuICAgICAgICBsZXQgdHMgPSBuZXcgR3JvdXAoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgbGV0IHQgPSBpIC8gc3RlcHM7XG4gICAgICAgICAgICB0cy5wdXNoKG5ldyBQdCh0ICogdCAqIHQsIHQgKiB0LCB0LCAxKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRzO1xuICAgIH1cbiAgICBzdGF0aWMgY29udHJvbFBvaW50cyhwdHMsIGluZGV4ID0gMCwgY29weVN0YXJ0ID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKGluZGV4ID4gcHRzLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICByZXR1cm4gbmV3IEdyb3VwKCk7XG4gICAgICAgIGxldCBfaW5kZXggPSAoaSkgPT4gKGkgPCBwdHMubGVuZ3RoIC0gMSkgPyBpIDogcHRzLmxlbmd0aCAtIDE7XG4gICAgICAgIGxldCBwMCA9IHB0c1tpbmRleF07XG4gICAgICAgIGluZGV4ID0gKGNvcHlTdGFydCkgPyBpbmRleCA6IGluZGV4ICsgMTtcbiAgICAgICAgcmV0dXJuIG5ldyBHcm91cChwMCwgcHRzW19pbmRleChpbmRleCsrKV0sIHB0c1tfaW5kZXgoaW5kZXgrKyldLCBwdHNbX2luZGV4KGluZGV4KyspXSk7XG4gICAgfVxuICAgIHN0YXRpYyBfY2FsY1B0KGN0cmxzLCBwYXJhbXMpIHtcbiAgICAgICAgbGV0IHggPSBjdHJscy5yZWR1Y2UoKGEsIGMsIGkpID0+IGEgKyBjLnggKiBwYXJhbXNbaV0sIDApO1xuICAgICAgICBsZXQgeSA9IGN0cmxzLnJlZHVjZSgoYSwgYywgaSkgPT4gYSArIGMueSAqIHBhcmFtc1tpXSwgMCk7XG4gICAgICAgIGlmIChjdHJsc1swXS5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICBsZXQgeiA9IGN0cmxzLnJlZHVjZSgoYSwgYywgaSkgPT4gYSArIGMueiAqIHBhcmFtc1tpXSwgMCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFB0KHgsIHksIHopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUHQoeCwgeSk7XG4gICAgfVxuICAgIHN0YXRpYyBjYXRtdWxsUm9tKHB0cywgc3RlcHMgPSAxMCkge1xuICAgICAgICBpZiAocHRzLmxlbmd0aCA8IDIpXG4gICAgICAgICAgICByZXR1cm4gbmV3IEdyb3VwKCk7XG4gICAgICAgIGxldCBwcyA9IG5ldyBHcm91cCgpO1xuICAgICAgICBsZXQgdHMgPSBDdXJ2ZS5nZXRTdGVwcyhzdGVwcyk7XG4gICAgICAgIGxldCBjID0gQ3VydmUuY29udHJvbFBvaW50cyhwdHMsIDAsIHRydWUpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBzdGVwczsgaSsrKSB7XG4gICAgICAgICAgICBwcy5wdXNoKEN1cnZlLmNhdG11bGxSb21TdGVwKHRzW2ldLCBjKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGsgPSAwO1xuICAgICAgICB3aGlsZSAoayA8IHB0cy5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgICBsZXQgY3AgPSBDdXJ2ZS5jb250cm9sUG9pbnRzKHB0cywgayk7XG4gICAgICAgICAgICBpZiAoY3AubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcHMucHVzaChDdXJ2ZS5jYXRtdWxsUm9tU3RlcCh0c1tpXSwgY3ApKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcztcbiAgICB9XG4gICAgc3RhdGljIGNhdG11bGxSb21TdGVwKHN0ZXAsIGN0cmxzKSB7XG4gICAgICAgIGxldCBtID0gbmV3IEdyb3VwKG5ldyBQdCgtMC41LCAxLCAtMC41LCAwKSwgbmV3IFB0KDEuNSwgLTIuNSwgMCwgMSksIG5ldyBQdCgtMS41LCAyLCAwLjUsIDApLCBuZXcgUHQoMC41LCAtMC41LCAwLCAwKSk7XG4gICAgICAgIHJldHVybiBDdXJ2ZS5fY2FsY1B0KGN0cmxzLCBNYXQubXVsdGlwbHkoW3N0ZXBdLCBtLCB0cnVlKVswXSk7XG4gICAgfVxuICAgIHN0YXRpYyBjYXJkaW5hbChwdHMsIHN0ZXBzID0gMTAsIHRlbnNpb24gPSAwLjUpIHtcbiAgICAgICAgaWYgKHB0cy5sZW5ndGggPCAyKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBHcm91cCgpO1xuICAgICAgICBsZXQgcHMgPSBuZXcgR3JvdXAoKTtcbiAgICAgICAgbGV0IHRzID0gQ3VydmUuZ2V0U3RlcHMoc3RlcHMpO1xuICAgICAgICBsZXQgYyA9IEN1cnZlLmNvbnRyb2xQb2ludHMocHRzLCAwLCB0cnVlKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgcHMucHVzaChDdXJ2ZS5jYXJkaW5hbFN0ZXAodHNbaV0sIGMsIHRlbnNpb24pKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgayA9IDA7XG4gICAgICAgIHdoaWxlIChrIDwgcHRzLmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICAgIGxldCBjcCA9IEN1cnZlLmNvbnRyb2xQb2ludHMocHRzLCBrKTtcbiAgICAgICAgICAgIGlmIChjcC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBwcy5wdXNoKEN1cnZlLmNhcmRpbmFsU3RlcCh0c1tpXSwgY3AsIHRlbnNpb24pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcztcbiAgICB9XG4gICAgc3RhdGljIGNhcmRpbmFsU3RlcChzdGVwLCBjdHJscywgdGVuc2lvbiA9IDAuNSkge1xuICAgICAgICBsZXQgbSA9IG5ldyBHcm91cChuZXcgUHQoLTEsIDIsIC0xLCAwKSwgbmV3IFB0KC0xLCAxLCAwLCAwKSwgbmV3IFB0KDEsIC0yLCAxLCAwKSwgbmV3IFB0KDEsIC0xLCAwLCAwKSk7XG4gICAgICAgIGxldCBoID0gTWF0Lm11bHRpcGx5KFtzdGVwXSwgbSwgdHJ1ZSlbMF0ubXVsdGlwbHkodGVuc2lvbik7XG4gICAgICAgIGxldCBoMiA9ICgyICogc3RlcFswXSAtIDMgKiBzdGVwWzFdICsgMSk7XG4gICAgICAgIGxldCBoMyA9IC0yICogc3RlcFswXSArIDMgKiBzdGVwWzFdO1xuICAgICAgICBsZXQgcHQgPSBDdXJ2ZS5fY2FsY1B0KGN0cmxzLCBoKTtcbiAgICAgICAgcHQueCArPSBoMiAqIGN0cmxzWzFdLnggKyBoMyAqIGN0cmxzWzJdLng7XG4gICAgICAgIHB0LnkgKz0gaDIgKiBjdHJsc1sxXS55ICsgaDMgKiBjdHJsc1syXS55O1xuICAgICAgICBpZiAocHQubGVuZ3RoID4gMilcbiAgICAgICAgICAgIHB0LnogKz0gaDIgKiBjdHJsc1sxXS56ICsgaDMgKiBjdHJsc1syXS56O1xuICAgICAgICByZXR1cm4gcHQ7XG4gICAgfVxuICAgIHN0YXRpYyBiZXppZXIocHRzLCBzdGVwcyA9IDEwKSB7XG4gICAgICAgIGlmIChwdHMubGVuZ3RoIDwgNClcbiAgICAgICAgICAgIHJldHVybiBuZXcgR3JvdXAoKTtcbiAgICAgICAgbGV0IHBzID0gbmV3IEdyb3VwKCk7XG4gICAgICAgIGxldCB0cyA9IEN1cnZlLmdldFN0ZXBzKHN0ZXBzKTtcbiAgICAgICAgbGV0IGsgPSAwO1xuICAgICAgICB3aGlsZSAoayA8IHB0cy5sZW5ndGggLSAzKSB7XG4gICAgICAgICAgICBsZXQgYyA9IEN1cnZlLmNvbnRyb2xQb2ludHMocHRzLCBrKTtcbiAgICAgICAgICAgIGlmIChjLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBzdGVwczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHBzLnB1c2goQ3VydmUuYmV6aWVyU3RlcCh0c1tpXSwgYykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBrICs9IDM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBzO1xuICAgIH1cbiAgICBzdGF0aWMgYmV6aWVyU3RlcChzdGVwLCBjdHJscykge1xuICAgICAgICBsZXQgbSA9IG5ldyBHcm91cChuZXcgUHQoLTEsIDMsIC0zLCAxKSwgbmV3IFB0KDMsIC02LCAzLCAwKSwgbmV3IFB0KC0zLCAzLCAwLCAwKSwgbmV3IFB0KDEsIDAsIDAsIDApKTtcbiAgICAgICAgcmV0dXJuIEN1cnZlLl9jYWxjUHQoY3RybHMsIE1hdC5tdWx0aXBseShbc3RlcF0sIG0sIHRydWUpWzBdKTtcbiAgICB9XG4gICAgc3RhdGljIGJzcGxpbmUocHRzLCBzdGVwcyA9IDEwLCB0ZW5zaW9uID0gMSkge1xuICAgICAgICBpZiAocHRzLmxlbmd0aCA8IDIpXG4gICAgICAgICAgICByZXR1cm4gbmV3IEdyb3VwKCk7XG4gICAgICAgIGxldCBwcyA9IG5ldyBHcm91cCgpO1xuICAgICAgICBsZXQgdHMgPSBDdXJ2ZS5nZXRTdGVwcyhzdGVwcyk7XG4gICAgICAgIGxldCBrID0gMDtcbiAgICAgICAgd2hpbGUgKGsgPCBwdHMubGVuZ3RoIC0gMykge1xuICAgICAgICAgICAgbGV0IGMgPSBDdXJ2ZS5jb250cm9sUG9pbnRzKHB0cywgayk7XG4gICAgICAgICAgICBpZiAoYy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRlbnNpb24gIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHMucHVzaChDdXJ2ZS5ic3BsaW5lVGVuc2lvblN0ZXAodHNbaV0sIGMsIHRlbnNpb24pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHMucHVzaChDdXJ2ZS5ic3BsaW5lU3RlcCh0c1tpXSwgYykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHM7XG4gICAgfVxuICAgIHN0YXRpYyBic3BsaW5lU3RlcChzdGVwLCBjdHJscykge1xuICAgICAgICBsZXQgbSA9IG5ldyBHcm91cChuZXcgUHQoLTAuMTY2NjY2NjY2NjY2NjY2NjYsIDAuNSwgLTAuNSwgMC4xNjY2NjY2NjY2NjY2NjY2NiksIG5ldyBQdCgwLjUsIC0xLCAwLCAwLjY2NjY2NjY2NjY2NjY2NjYpLCBuZXcgUHQoLTAuNSwgMC41LCAwLjUsIDAuMTY2NjY2NjY2NjY2NjY2NjYpLCBuZXcgUHQoMC4xNjY2NjY2NjY2NjY2NjY2NiwgMCwgMCwgMCkpO1xuICAgICAgICByZXR1cm4gQ3VydmUuX2NhbGNQdChjdHJscywgTWF0Lm11bHRpcGx5KFtzdGVwXSwgbSwgdHJ1ZSlbMF0pO1xuICAgIH1cbiAgICBzdGF0aWMgYnNwbGluZVRlbnNpb25TdGVwKHN0ZXAsIGN0cmxzLCB0ZW5zaW9uID0gMSkge1xuICAgICAgICBsZXQgbSA9IG5ldyBHcm91cChuZXcgUHQoLTAuMTY2NjY2NjY2NjY2NjY2NjYsIDAuNSwgLTAuNSwgMC4xNjY2NjY2NjY2NjY2NjY2NiksIG5ldyBQdCgtMS41LCAyLCAwLCAtMC4zMzMzMzMzMzMzMzMzMzMzKSwgbmV3IFB0KDEuNSwgLTIuNSwgMC41LCAwLjE2NjY2NjY2NjY2NjY2NjY2KSwgbmV3IFB0KDAuMTY2NjY2NjY2NjY2NjY2NjYsIDAsIDAsIDApKTtcbiAgICAgICAgbGV0IGggPSBNYXQubXVsdGlwbHkoW3N0ZXBdLCBtLCB0cnVlKVswXS5tdWx0aXBseSh0ZW5zaW9uKTtcbiAgICAgICAgbGV0IGgyID0gKDIgKiBzdGVwWzBdIC0gMyAqIHN0ZXBbMV0gKyAxKTtcbiAgICAgICAgbGV0IGgzID0gLTIgKiBzdGVwWzBdICsgMyAqIHN0ZXBbMV07XG4gICAgICAgIGxldCBwdCA9IEN1cnZlLl9jYWxjUHQoY3RybHMsIGgpO1xuICAgICAgICBwdC54ICs9IGgyICogY3RybHNbMV0ueCArIGgzICogY3RybHNbMl0ueDtcbiAgICAgICAgcHQueSArPSBoMiAqIGN0cmxzWzFdLnkgKyBoMyAqIGN0cmxzWzJdLnk7XG4gICAgICAgIGlmIChwdC5sZW5ndGggPiAyKVxuICAgICAgICAgICAgcHQueiArPSBoMiAqIGN0cmxzWzFdLnogKyBoMyAqIGN0cmxzWzJdLno7XG4gICAgICAgIHJldHVybiBwdDtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1PcC5qcy5tYXAiLCIvKiEgU291cmNlIGNvZGUgbGljZW5zZWQgdW5kZXIgQXBhY2hlIExpY2Vuc2UgMi4wLiBDb3B5cmlnaHQgwqkgMjAxNy1jdXJyZW50IFdpbGxpYW0gTmdhbiBhbmQgY29udHJpYnV0b3JzLiAoaHR0cHM6Ly9naXRodWIuY29tL3dpbGxpYW1uZ2FuL3B0cykgKi9cbmltcG9ydCB7IFB0LCBHcm91cCwgQm91bmQgfSBmcm9tIFwiLi9QdFwiO1xuaW1wb3J0IHsgUG9seWdvbiwgQ2lyY2xlIH0gZnJvbSBcIi4vT3BcIjtcbmV4cG9ydCBjbGFzcyBXb3JsZCB7XG4gICAgY29uc3RydWN0b3IoYm91bmQsIGZyaWN0aW9uID0gMSwgZ3Jhdml0eSA9IDApIHtcbiAgICAgICAgdGhpcy5fbGFzdFRpbWUgPSBudWxsO1xuICAgICAgICB0aGlzLl9ncmF2aXR5ID0gbmV3IFB0KCk7XG4gICAgICAgIHRoaXMuX2ZyaWN0aW9uID0gMTtcbiAgICAgICAgdGhpcy5fZGFtcGluZyA9IDAuNzU7XG4gICAgICAgIHRoaXMuX3BhcnRpY2xlcyA9IFtdO1xuICAgICAgICB0aGlzLl9ib2RpZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fcG5hbWVzID0gW107XG4gICAgICAgIHRoaXMuX2JuYW1lcyA9IFtdO1xuICAgICAgICB0aGlzLl9ib3VuZCA9IEJvdW5kLmZyb21Hcm91cChib3VuZCk7XG4gICAgICAgIHRoaXMuX2ZyaWN0aW9uID0gZnJpY3Rpb247XG4gICAgICAgIHRoaXMuX2dyYXZpdHkgPSAodHlwZW9mIGdyYXZpdHkgPT09IFwibnVtYmVyXCIpID8gbmV3IFB0KDAsIGdyYXZpdHkpIDogbmV3IFB0KGdyYXZpdHkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZ2V0IGJvdW5kKCkgeyByZXR1cm4gdGhpcy5fYm91bmQ7IH1cbiAgICBzZXQgYm91bmQoYm91bmQpIHsgdGhpcy5fYm91bmQgPSBib3VuZDsgfVxuICAgIGdldCBncmF2aXR5KCkgeyByZXR1cm4gdGhpcy5fZ3Jhdml0eTsgfVxuICAgIHNldCBncmF2aXR5KGcpIHsgdGhpcy5fZ3Jhdml0eSA9IGc7IH1cbiAgICBnZXQgZnJpY3Rpb24oKSB7IHJldHVybiB0aGlzLl9mcmljdGlvbjsgfVxuICAgIHNldCBmcmljdGlvbihmKSB7IHRoaXMuX2ZyaWN0aW9uID0gZjsgfVxuICAgIGdldCBkYW1waW5nKCkgeyByZXR1cm4gdGhpcy5fZGFtcGluZzsgfVxuICAgIHNldCBkYW1waW5nKGYpIHsgdGhpcy5fZGFtcGluZyA9IGY7IH1cbiAgICBnZXQgYm9keUNvdW50KCkgeyByZXR1cm4gdGhpcy5fYm9kaWVzLmxlbmd0aDsgfVxuICAgIGdldCBwYXJ0aWNsZUNvdW50KCkgeyByZXR1cm4gdGhpcy5fcGFydGljbGVzLmxlbmd0aDsgfVxuICAgIGJvZHkoaWQpIHtcbiAgICAgICAgbGV0IGlkeCA9IGlkO1xuICAgICAgICBpZiAodHlwZW9mIGlkID09PSBcInN0cmluZ1wiICYmIGlkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlkeCA9IHRoaXMuX2JuYW1lcy5pbmRleE9mKGlkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShpZHggPj0gMCkpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gdGhpcy5fYm9kaWVzW2lkeF07XG4gICAgfVxuICAgIHBhcnRpY2xlKGlkKSB7XG4gICAgICAgIGxldCBpZHggPSBpZDtcbiAgICAgICAgaWYgKHR5cGVvZiBpZCA9PT0gXCJzdHJpbmdcIiAmJiBpZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZHggPSB0aGlzLl9wbmFtZXMuaW5kZXhPZihpZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoaWR4ID49IDApKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRpY2xlc1tpZHhdO1xuICAgIH1cbiAgICBib2R5SW5kZXgobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYm5hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgfVxuICAgIHBhcnRpY2xlSW5kZXgobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG5hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgfVxuICAgIHVwZGF0ZShtcykge1xuICAgICAgICBsZXQgZHQgPSBtcyAvIDEwMDA7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVBhcnRpY2xlcyhkdCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUJvZGllcyhkdCk7XG4gICAgfVxuICAgIGRyYXdQYXJ0aWNsZXMoZm4pIHtcbiAgICAgICAgdGhpcy5fZHJhd1BhcnRpY2xlcyA9IGZuO1xuICAgIH1cbiAgICBkcmF3Qm9kaWVzKGZuKSB7XG4gICAgICAgIHRoaXMuX2RyYXdCb2RpZXMgPSBmbjtcbiAgICB9XG4gICAgYWRkKHAsIG5hbWUgPSAnJykge1xuICAgICAgICBpZiAocCBpbnN0YW5jZW9mIEJvZHkpIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZGllcy5wdXNoKHApO1xuICAgICAgICAgICAgdGhpcy5fYm5hbWVzLnB1c2gobmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZXMucHVzaChwKTtcbiAgICAgICAgICAgIHRoaXMuX3BuYW1lcy5wdXNoKG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBfaW5kZXgoZm4sIGlkKSB7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGlmICh0eXBlb2YgaWQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGluZGV4ID0gZm4oaWQpO1xuICAgICAgICAgICAgaWYgKGluZGV4IDwgMClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kIGluZGV4IG9mICR7aWR9LiBZb3UgY2FuIHVzZSBwYXJ0aWNsZUluZGV4KCkgb3IgYm9keUluZGV4KCkgZnVuY3Rpb24gdG8gY2hlY2sgZXhpc3RlbmNlIGJ5IG5hbWUuYCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpbmRleCA9IGlkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gICAgcmVtb3ZlQm9keShmcm9tLCBjb3VudCA9IDEpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9pbmRleCh0aGlzLmJvZHlJbmRleC5iaW5kKHRoaXMpLCBmcm9tKTtcbiAgICAgICAgY29uc3QgcGFyYW0gPSAoaW5kZXggPCAwKSA/IFtpbmRleCAqIC0xIC0gMSwgY291bnRdIDogW2luZGV4LCBjb3VudF07XG4gICAgICAgIHRoaXMuX2JvZGllcy5zcGxpY2UocGFyYW1bMF0sIHBhcmFtWzFdKTtcbiAgICAgICAgdGhpcy5fYm5hbWVzLnNwbGljZShwYXJhbVswXSwgcGFyYW1bMV0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVtb3ZlUGFydGljbGUoZnJvbSwgY291bnQgPSAxKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5faW5kZXgodGhpcy5wYXJ0aWNsZUluZGV4LmJpbmQodGhpcyksIGZyb20pO1xuICAgICAgICBjb25zdCBwYXJhbSA9IChpbmRleCA8IDApID8gW2luZGV4ICogLTEgLSAxLCBjb3VudF0gOiBbaW5kZXgsIGNvdW50XTtcbiAgICAgICAgdGhpcy5fcGFydGljbGVzLnNwbGljZShwYXJhbVswXSwgcGFyYW1bMV0pO1xuICAgICAgICB0aGlzLl9wbmFtZXMuc3BsaWNlKHBhcmFtWzBdLCBwYXJhbVsxXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzdGF0aWMgZWRnZUNvbnN0cmFpbnQocDEsIHAyLCBkaXN0LCBzdGlmZiA9IDEsIHByZWNpc2UgPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBtMSA9IDEgLyAocDEubWFzcyB8fCAxKTtcbiAgICAgICAgY29uc3QgbTIgPSAxIC8gKHAyLm1hc3MgfHwgMSk7XG4gICAgICAgIGNvbnN0IG1tID0gbTEgKyBtMjtcbiAgICAgICAgbGV0IGRlbHRhID0gcDIuJHN1YnRyYWN0KHAxKTtcbiAgICAgICAgbGV0IGRpc3RTcSA9IGRpc3QgKiBkaXN0O1xuICAgICAgICBsZXQgZCA9IChwcmVjaXNlKSA/IChkaXN0IC8gZGVsdGEubWFnbml0dWRlKCkgLSAxKSA6IChkaXN0U3EgLyAoZGVsdGEuZG90KGRlbHRhKSArIGRpc3RTcSkgLSAwLjUpO1xuICAgICAgICBsZXQgZiA9IGRlbHRhLiRtdWx0aXBseShkICogc3RpZmYpO1xuICAgICAgICBwMS5zdWJ0cmFjdChmLiRtdWx0aXBseShtMSAvIG1tKSk7XG4gICAgICAgIHAyLmFkZChmLiRtdWx0aXBseShtMiAvIG1tKSk7XG4gICAgICAgIHJldHVybiBwMTtcbiAgICB9XG4gICAgc3RhdGljIGJvdW5kQ29uc3RyYWludChwLCByZWN0LCBkYW1waW5nID0gMC43NSkge1xuICAgICAgICBsZXQgYm91bmQgPSByZWN0LmJvdW5kaW5nQm94KCk7XG4gICAgICAgIGxldCBucCA9IHAuJG1pbihib3VuZFsxXS5zdWJ0cmFjdChwLnJhZGl1cykpLiRtYXgoYm91bmRbMF0uYWRkKHAucmFkaXVzKSk7XG4gICAgICAgIGlmIChucFswXSA9PT0gYm91bmRbMF1bMF0gfHwgbnBbMF0gPT09IGJvdW5kWzFdWzBdKSB7XG4gICAgICAgICAgICBsZXQgYyA9IHAuY2hhbmdlZC4kbXVsdGlwbHkoZGFtcGluZyk7XG4gICAgICAgICAgICBwLnByZXZpb3VzID0gbnAuJHN1YnRyYWN0KG5ldyBQdCgtY1swXSwgY1sxXSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5wWzFdID09PSBib3VuZFswXVsxXSB8fCBucFsxXSA9PT0gYm91bmRbMV1bMV0pIHtcbiAgICAgICAgICAgIGxldCBjID0gcC5jaGFuZ2VkLiRtdWx0aXBseShkYW1waW5nKTtcbiAgICAgICAgICAgIHAucHJldmlvdXMgPSBucC4kc3VidHJhY3QobmV3IFB0KGNbMF0sIC1jWzFdKSk7XG4gICAgICAgIH1cbiAgICAgICAgcC50byhucCk7XG4gICAgfVxuICAgIGludGVncmF0ZShwLCBkdCwgcHJldkR0KSB7XG4gICAgICAgIHAuYWRkRm9yY2UodGhpcy5fZ3Jhdml0eSk7XG4gICAgICAgIHAudmVybGV0KGR0LCB0aGlzLl9mcmljdGlvbiwgcHJldkR0KTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIF91cGRhdGVQYXJ0aWNsZXMoZHQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMuX3BhcnRpY2xlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IHAgPSB0aGlzLl9wYXJ0aWNsZXNbaV07XG4gICAgICAgICAgICB0aGlzLmludGVncmF0ZShwLCBkdCwgdGhpcy5fbGFzdFRpbWUpO1xuICAgICAgICAgICAgV29ybGQuYm91bmRDb25zdHJhaW50KHAsIHRoaXMuX2JvdW5kLCB0aGlzLl9kYW1waW5nKTtcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSBpICsgMTsgayA8IGxlbjsgaysrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgIT09IGspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHAyID0gdGhpcy5fcGFydGljbGVzW2tdO1xuICAgICAgICAgICAgICAgICAgICBwLmNvbGxpZGUocDIsIHRoaXMuX2RhbXBpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9kcmF3UGFydGljbGVzKVxuICAgICAgICAgICAgICAgIHRoaXMuX2RyYXdQYXJ0aWNsZXMocCwgaSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbGFzdFRpbWUgPSBkdDtcbiAgICB9XG4gICAgX3VwZGF0ZUJvZGllcyhkdCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5fYm9kaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYmRzID0gdGhpcy5fYm9kaWVzW2ldO1xuICAgICAgICAgICAgaWYgKGJkcykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBrbGVuID0gYmRzLmxlbmd0aDsgayA8IGtsZW47IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYmsgPSBiZHNba107XG4gICAgICAgICAgICAgICAgICAgIFdvcmxkLmJvdW5kQ29uc3RyYWludChiaywgdGhpcy5fYm91bmQsIHRoaXMuX2RhbXBpbmcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmludGVncmF0ZShiaywgZHQsIHRoaXMuX2xhc3RUaW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IGkgKyAxOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmRzLnByb2Nlc3NCb2R5KHRoaXMuX2JvZGllc1trXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gPSAwLCBtbGVuID0gdGhpcy5fcGFydGljbGVzLmxlbmd0aDsgbSA8IG1sZW47IG0rKykge1xuICAgICAgICAgICAgICAgICAgICBiZHMucHJvY2Vzc1BhcnRpY2xlKHRoaXMuX3BhcnRpY2xlc1ttXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJkcy5wcm9jZXNzRWRnZXMoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZHJhd0JvZGllcylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJhd0JvZGllcyhiZHMsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFBhcnRpY2xlIGV4dGVuZHMgUHQge1xuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIHRoaXMuX21hc3MgPSAxO1xuICAgICAgICB0aGlzLl9yYWRpdXMgPSAwO1xuICAgICAgICB0aGlzLl9mb3JjZSA9IG5ldyBQdCgpO1xuICAgICAgICB0aGlzLl9wcmV2ID0gbmV3IFB0KCk7XG4gICAgICAgIHRoaXMuX2xvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcHJldiA9IHRoaXMuY2xvbmUoKTtcbiAgICB9XG4gICAgZ2V0IG1hc3MoKSB7IHJldHVybiB0aGlzLl9tYXNzOyB9XG4gICAgc2V0IG1hc3MobSkgeyB0aGlzLl9tYXNzID0gbTsgfVxuICAgIGdldCByYWRpdXMoKSB7IHJldHVybiB0aGlzLl9yYWRpdXM7IH1cbiAgICBzZXQgcmFkaXVzKGYpIHsgdGhpcy5fcmFkaXVzID0gZjsgfVxuICAgIGdldCBwcmV2aW91cygpIHsgcmV0dXJuIHRoaXMuX3ByZXY7IH1cbiAgICBzZXQgcHJldmlvdXMocCkgeyB0aGlzLl9wcmV2ID0gcDsgfVxuICAgIGdldCBmb3JjZSgpIHsgcmV0dXJuIHRoaXMuX2ZvcmNlOyB9XG4gICAgc2V0IGZvcmNlKGcpIHsgdGhpcy5fZm9yY2UgPSBnOyB9XG4gICAgZ2V0IGJvZHkoKSB7IHJldHVybiB0aGlzLl9ib2R5OyB9XG4gICAgc2V0IGJvZHkoYikgeyB0aGlzLl9ib2R5ID0gYjsgfVxuICAgIGdldCBsb2NrKCkgeyByZXR1cm4gdGhpcy5fbG9jazsgfVxuICAgIHNldCBsb2NrKGIpIHtcbiAgICAgICAgdGhpcy5fbG9jayA9IGI7XG4gICAgICAgIHRoaXMuX2xvY2tQdCA9IG5ldyBQdCh0aGlzKTtcbiAgICB9XG4gICAgZ2V0IGNoYW5nZWQoKSB7IHJldHVybiB0aGlzLiRzdWJ0cmFjdCh0aGlzLl9wcmV2KTsgfVxuICAgIHNldCBwb3NpdGlvbihwKSB7XG4gICAgICAgIHRoaXMucHJldmlvdXMudG8odGhpcyk7XG4gICAgICAgIGlmICh0aGlzLl9sb2NrKVxuICAgICAgICAgICAgdGhpcy5fbG9ja1B0ID0gcDtcbiAgICAgICAgdGhpcy50byhwKTtcbiAgICB9XG4gICAgc2l6ZShyKSB7XG4gICAgICAgIHRoaXMuX21hc3MgPSByO1xuICAgICAgICB0aGlzLl9yYWRpdXMgPSByO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgYWRkRm9yY2UoLi4uYXJncykge1xuICAgICAgICB0aGlzLl9mb3JjZS5hZGQoLi4uYXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JjZTtcbiAgICB9XG4gICAgdmVybGV0KGR0LCBmcmljdGlvbiwgbGFzdER0KSB7XG4gICAgICAgIGlmICh0aGlzLl9sb2NrKSB7XG4gICAgICAgICAgICB0aGlzLnRvKHRoaXMuX2xvY2tQdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgbHQgPSAobGFzdER0KSA/IGxhc3REdCA6IGR0O1xuICAgICAgICAgICAgbGV0IGEgPSB0aGlzLl9mb3JjZS5tdWx0aXBseShkdCAqIChkdCArIGx0KSAvIDIpO1xuICAgICAgICAgICAgbGV0IHYgPSB0aGlzLmNoYW5nZWQubXVsdGlwbHkoZnJpY3Rpb24gKiBkdCAvIGx0KS5hZGQoYSk7XG4gICAgICAgICAgICB0aGlzLl9wcmV2ID0gdGhpcy5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5hZGQodik7XG4gICAgICAgICAgICB0aGlzLl9mb3JjZSA9IG5ldyBQdCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBoaXQoLi4uYXJncykge1xuICAgICAgICB0aGlzLl9wcmV2LnN1YnRyYWN0KG5ldyBQdCguLi5hcmdzKS4kZGl2aWRlKE1hdGguc3FydCh0aGlzLl9tYXNzKSkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgY29sbGlkZShwMiwgZGFtcCA9IDEpIHtcbiAgICAgICAgbGV0IHAxID0gdGhpcztcbiAgICAgICAgbGV0IGRwID0gcDEuJHN1YnRyYWN0KHAyKTtcbiAgICAgICAgbGV0IGRpc3RTcSA9IGRwLm1hZ25pdHVkZVNxKCk7XG4gICAgICAgIGxldCBkciA9IHAxLnJhZGl1cyArIHAyLnJhZGl1cztcbiAgICAgICAgaWYgKGRpc3RTcSA8IGRyICogZHIpIHtcbiAgICAgICAgICAgIGxldCBjMSA9IHAxLmNoYW5nZWQ7XG4gICAgICAgICAgICBsZXQgYzIgPSBwMi5jaGFuZ2VkO1xuICAgICAgICAgICAgbGV0IGRpc3QgPSBNYXRoLnNxcnQoZGlzdFNxKTtcbiAgICAgICAgICAgIGxldCBkID0gZHAuJG11bHRpcGx5KCgoZGlzdCAtIGRyKSAvIGRpc3QpIC8gMik7XG4gICAgICAgICAgICBsZXQgbnAxID0gcDEuJHN1YnRyYWN0KGQpO1xuICAgICAgICAgICAgbGV0IG5wMiA9IHAyLiRhZGQoZCk7XG4gICAgICAgICAgICBwMS50byhucDEpO1xuICAgICAgICAgICAgcDIudG8obnAyKTtcbiAgICAgICAgICAgIGxldCBmMSA9IGRhbXAgKiBkcC5kb3QoYzEpIC8gZGlzdFNxO1xuICAgICAgICAgICAgbGV0IGYyID0gZGFtcCAqIGRwLmRvdChjMikgLyBkaXN0U3E7XG4gICAgICAgICAgICBsZXQgZG0xID0gcDEubWFzcyAvIChwMS5tYXNzICsgcDIubWFzcyk7XG4gICAgICAgICAgICBsZXQgZG0yID0gcDIubWFzcyAvIChwMS5tYXNzICsgcDIubWFzcyk7XG4gICAgICAgICAgICBjMS5hZGQobmV3IFB0KGYyICogZHBbMF0gLSBmMSAqIGRwWzBdLCBmMiAqIGRwWzFdIC0gZjEgKiBkcFsxXSkuJG11bHRpcGx5KGRtMikpO1xuICAgICAgICAgICAgYzIuYWRkKG5ldyBQdChmMSAqIGRwWzBdIC0gZjIgKiBkcFswXSwgZjEgKiBkcFsxXSAtIGYyICogZHBbMV0pLiRtdWx0aXBseShkbTEpKTtcbiAgICAgICAgICAgIHAxLnByZXZpb3VzID0gcDEuJHN1YnRyYWN0KGMxKTtcbiAgICAgICAgICAgIHAyLnByZXZpb3VzID0gcDIuJHN1YnRyYWN0KGMyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGBQYXJ0aWNsZTogJHt0aGlzWzBdfSAke3RoaXNbMV19IHwgcHJldmlvdXMgJHt0aGlzLl9wcmV2WzBdfSAke3RoaXMuX3ByZXZbMV19IHwgbWFzcyAke3RoaXMuX21hc3N9YDtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgQm9keSBleHRlbmRzIEdyb3VwIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fY3MgPSBbXTtcbiAgICAgICAgdGhpcy5fc3RpZmYgPSAxO1xuICAgICAgICB0aGlzLl9sb2NrcyA9IHt9O1xuICAgICAgICB0aGlzLl9tYXNzID0gMTtcbiAgICB9XG4gICAgc3RhdGljIGZyb21Hcm91cChsaXN0LCBzdGlmZiA9IDEsIGF1dG9MaW5rID0gdHJ1ZSwgYXV0b01hc3MgPSB0cnVlKSB7XG4gICAgICAgIGxldCBiID0gbmV3IEJvZHkoKS5pbml0KGxpc3QpO1xuICAgICAgICBpZiAoYXV0b0xpbmspXG4gICAgICAgICAgICBiLmxpbmtBbGwoc3RpZmYpO1xuICAgICAgICBpZiAoYXV0b01hc3MpXG4gICAgICAgICAgICBiLmF1dG9NYXNzKCk7XG4gICAgICAgIHJldHVybiBiO1xuICAgIH1cbiAgICBpbml0KGxpc3QsIHN0aWZmID0gMSkge1xuICAgICAgICBsZXQgYyA9IG5ldyBQdCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IHAgPSBuZXcgUGFydGljbGUobGlzdFtpXSk7XG4gICAgICAgICAgICBwLmJvZHkgPSB0aGlzO1xuICAgICAgICAgICAgYy5hZGQobGlzdFtpXSk7XG4gICAgICAgICAgICB0aGlzLnB1c2gocCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3RpZmYgPSBzdGlmZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGdldCBtYXNzKCkgeyByZXR1cm4gdGhpcy5fbWFzczsgfVxuICAgIHNldCBtYXNzKG0pIHtcbiAgICAgICAgdGhpcy5fbWFzcyA9IG07XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzW2ldLm1hc3MgPSB0aGlzLl9tYXNzO1xuICAgICAgICB9XG4gICAgfVxuICAgIGF1dG9NYXNzKCkge1xuICAgICAgICB0aGlzLm1hc3MgPSBNYXRoLnNxcnQoUG9seWdvbi5hcmVhKHRoaXMpKSAvIDEwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgbGluayhpbmRleDEsIGluZGV4Miwgc3RpZmYpIHtcbiAgICAgICAgaWYgKGluZGV4MSA8IDAgfHwgaW5kZXgxID49IHRoaXMubGVuZ3RoKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW5kZXgxIGlzIG5vdCBpbiB0aGUgR3JvdXAncyBpbmRpY2VzXCIpO1xuICAgICAgICBpZiAoaW5kZXgyIDwgMCB8fCBpbmRleDIgPj0gdGhpcy5sZW5ndGgpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbmRleDEgaXMgbm90IGluIHRoZSBHcm91cCdzIGluZGljZXNcIik7XG4gICAgICAgIGxldCBkID0gdGhpc1tpbmRleDFdLiRzdWJ0cmFjdCh0aGlzW2luZGV4Ml0pLm1hZ25pdHVkZSgpO1xuICAgICAgICB0aGlzLl9jcy5wdXNoKFtpbmRleDEsIGluZGV4MiwgZCwgc3RpZmYgfHwgdGhpcy5fc3RpZmZdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGxpbmtBbGwoc3RpZmYpIHtcbiAgICAgICAgbGV0IGhhbGYgPSB0aGlzLmxlbmd0aCAvIDI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbiA9IChpID49IGxlbiAtIDEpID8gMCA6IGkgKyAxO1xuICAgICAgICAgICAgdGhpcy5saW5rKGksIG4sIHN0aWZmKTtcbiAgICAgICAgICAgIGlmIChsZW4gPiA0KSB7XG4gICAgICAgICAgICAgICAgbGV0IG5kID0gKE1hdGguZmxvb3IoaGFsZiAvIDIpKSArIDE7XG4gICAgICAgICAgICAgICAgbGV0IG4yID0gKGkgPj0gbGVuIC0gbmQpID8gaSAlIGxlbiA6IGkgKyBuZDtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmsoaSwgbjIsIHN0aWZmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpIDw9IGhhbGYgLSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saW5rKGksIE1hdGgubWluKHRoaXMubGVuZ3RoIC0gMSwgaSArIE1hdGguZmxvb3IoaGFsZikpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBsaW5rc1RvTGluZXMoKSB7XG4gICAgICAgIGxldCBncyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5fY3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsbiA9IHRoaXMuX2NzW2ldO1xuICAgICAgICAgICAgZ3MucHVzaChuZXcgR3JvdXAodGhpc1tsblswXV0sIHRoaXNbbG5bMV1dKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdzO1xuICAgIH1cbiAgICBwcm9jZXNzRWRnZXMoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLl9jcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IFttLCBuLCBkLCBzXSA9IHRoaXMuX2NzW2ldO1xuICAgICAgICAgICAgV29ybGQuZWRnZUNvbnN0cmFpbnQodGhpc1ttXSwgdGhpc1tuXSwgZCwgcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJvY2Vzc0JvZHkoYikge1xuICAgICAgICBsZXQgYjEgPSB0aGlzO1xuICAgICAgICBsZXQgYjIgPSBiO1xuICAgICAgICBsZXQgaGl0ID0gUG9seWdvbi5oYXNJbnRlcnNlY3RQb2x5Z29uKGIxLCBiMik7XG4gICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgIGxldCBjdiA9IGhpdC5ub3JtYWwuJG11bHRpcGx5KGhpdC5kaXN0KTtcbiAgICAgICAgICAgIGxldCB0O1xuICAgICAgICAgICAgbGV0IGVnID0gaGl0LmVkZ2U7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZWdbMF1bMF0gLSBlZ1sxXVswXSkgPiBNYXRoLmFicyhlZ1swXVsxXSAtIGVnWzFdWzFdKSkge1xuICAgICAgICAgICAgICAgIHQgPSAoaGl0LnZlcnRleFswXSAtIGN2WzBdIC0gZWdbMF1bMF0pIC8gKGVnWzFdWzBdIC0gZWdbMF1bMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdCA9IChoaXQudmVydGV4WzFdIC0gY3ZbMV0gLSBlZ1swXVsxXSkgLyAoZWdbMV1bMV0gLSBlZ1swXVsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbGFtYmRhID0gMSAvICh0ICogdCArICgxIC0gdCkgKiAoMSAtIHQpKTtcbiAgICAgICAgICAgIGxldCBtMCA9IGhpdC52ZXJ0ZXguYm9keS5tYXNzIHx8IDE7XG4gICAgICAgICAgICBsZXQgbTEgPSBoaXQuZWRnZVswXS5ib2R5Lm1hc3MgfHwgMTtcbiAgICAgICAgICAgIGxldCBtcjAgPSBtMCAvIChtMCArIG0xKTtcbiAgICAgICAgICAgIGxldCBtcjEgPSBtMSAvIChtMCArIG0xKTtcbiAgICAgICAgICAgIGVnWzBdLnN1YnRyYWN0KGN2LiRtdWx0aXBseShtcjAgKiAoMSAtIHQpICogbGFtYmRhIC8gMikpO1xuICAgICAgICAgICAgZWdbMV0uc3VidHJhY3QoY3YuJG11bHRpcGx5KG1yMCAqIHQgKiBsYW1iZGEgLyAyKSk7XG4gICAgICAgICAgICBoaXQudmVydGV4LmFkZChjdi4kbXVsdGlwbHkobXIxKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJvY2Vzc1BhcnRpY2xlKGIpIHtcbiAgICAgICAgbGV0IGIxID0gdGhpcztcbiAgICAgICAgbGV0IGIyID0gYjtcbiAgICAgICAgbGV0IGhpdCA9IFBvbHlnb24uaGFzSW50ZXJzZWN0Q2lyY2xlKGIxLCBDaXJjbGUuZnJvbUNlbnRlcihiLCBiLnJhZGl1cykpO1xuICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICBsZXQgY3YgPSBoaXQubm9ybWFsLiRtdWx0aXBseShoaXQuZGlzdCk7XG4gICAgICAgICAgICBsZXQgdDtcbiAgICAgICAgICAgIGxldCBlZyA9IGhpdC5lZGdlO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGVnWzBdWzBdIC0gZWdbMV1bMF0pID4gTWF0aC5hYnMoZWdbMF1bMV0gLSBlZ1sxXVsxXSkpIHtcbiAgICAgICAgICAgICAgICB0ID0gKGhpdC52ZXJ0ZXhbMF0gLSBjdlswXSAtIGVnWzBdWzBdKSAvIChlZ1sxXVswXSAtIGVnWzBdWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHQgPSAoaGl0LnZlcnRleFsxXSAtIGN2WzFdIC0gZWdbMF1bMV0pIC8gKGVnWzFdWzFdIC0gZWdbMF1bMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGxhbWJkYSA9IDEgLyAodCAqIHQgKyAoMSAtIHQpICogKDEgLSB0KSk7XG4gICAgICAgICAgICBsZXQgbTAgPSBoaXQudmVydGV4Lm1hc3MgfHwgYjIubWFzcyB8fCAxO1xuICAgICAgICAgICAgbGV0IG0xID0gaGl0LmVkZ2VbMF0uYm9keS5tYXNzIHx8IDE7XG4gICAgICAgICAgICBsZXQgbXIwID0gbTAgLyAobTAgKyBtMSk7XG4gICAgICAgICAgICBsZXQgbXIxID0gbTEgLyAobTAgKyBtMSk7XG4gICAgICAgICAgICBlZ1swXS5zdWJ0cmFjdChjdi4kbXVsdGlwbHkobXIwICogKDEgLSB0KSAqIGxhbWJkYSAvIDIpKTtcbiAgICAgICAgICAgIGVnWzFdLnN1YnRyYWN0KGN2LiRtdWx0aXBseShtcjAgKiB0ICogbGFtYmRhIC8gMikpO1xuICAgICAgICAgICAgbGV0IGMxID0gYi5jaGFuZ2VkLmFkZChjdi4kbXVsdGlwbHkobXIxKSk7XG4gICAgICAgICAgICBiLnByZXZpb3VzID0gYi4kc3VidHJhY3QoYzEpO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UGh5c2ljcy5qcy5tYXAiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IFB0LCBHcm91cCB9IGZyb20gXCIuL1B0XCI7XG5pbXBvcnQgeyBOdW0gfSBmcm9tIFwiLi9OdW1cIjtcbmV4cG9ydCBjbGFzcyBUZW1wbyB7XG4gICAgY29uc3RydWN0b3IoYnBtKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuICAgICAgICB0aGlzLl9saXN0ZW5lckluYyA9IDA7XG4gICAgICAgIHRoaXMuYnBtID0gYnBtO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbUJlYXQobXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUZW1wbyg2MDAwMCAvIG1zKTtcbiAgICB9XG4gICAgZ2V0IGJwbSgpIHsgcmV0dXJuIHRoaXMuX2JwbTsgfVxuICAgIHNldCBicG0obikge1xuICAgICAgICB0aGlzLl9icG0gPSBuO1xuICAgICAgICB0aGlzLl9tcyA9IDYwMDAwIC8gdGhpcy5fYnBtO1xuICAgIH1cbiAgICBnZXQgbXMoKSB7IHJldHVybiB0aGlzLl9tczsgfVxuICAgIHNldCBtcyhuKSB7XG4gICAgICAgIHRoaXMuX2JwbSA9IE1hdGguZmxvb3IoNjAwMDAgLyBuKTtcbiAgICAgICAgdGhpcy5fbXMgPSA2MDAwMCAvIHRoaXMuX2JwbTtcbiAgICB9XG4gICAgX2NyZWF0ZUlEKGxpc3RlbmVyKSB7XG4gICAgICAgIGxldCBpZCA9ICcnO1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBpZCA9ICdfYicgKyAodGhpcy5fbGlzdGVuZXJJbmMrKyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZCA9IGxpc3RlbmVyLm5hbWUgfHwgJ19iJyArICh0aGlzLl9saXN0ZW5lckluYysrKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxuICAgIGV2ZXJ5KGJlYXRzKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IHAgPSBBcnJheS5pc0FycmF5KGJlYXRzKSA/IGJlYXRzWzBdIDogYmVhdHM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydDogZnVuY3Rpb24gKGZuLCBvZmZzZXQgPSAwLCBuYW1lKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlkID0gbmFtZSB8fCBzZWxmLl9jcmVhdGVJRChmbik7XG4gICAgICAgICAgICAgICAgc2VsZi5fbGlzdGVuZXJzW2lkXSA9IHsgbmFtZTogaWQsIGJlYXRzOiBiZWF0cywgcGVyaW9kOiBwLCBpbmRleDogMCwgb2Zmc2V0OiBvZmZzZXQsIGR1cmF0aW9uOiAtMSwgY29udGludW91czogZmFsc2UsIGZuOiBmbiB9O1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByb2dyZXNzOiBmdW5jdGlvbiAoZm4sIG9mZnNldCA9IDAsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgaWQgPSBuYW1lIHx8IHNlbGYuX2NyZWF0ZUlEKGZuKTtcbiAgICAgICAgICAgICAgICBzZWxmLl9saXN0ZW5lcnNbaWRdID0geyBuYW1lOiBpZCwgYmVhdHM6IGJlYXRzLCBwZXJpb2Q6IHAsIGluZGV4OiAwLCBvZmZzZXQ6IG9mZnNldCwgZHVyYXRpb246IC0xLCBjb250aW51b3VzOiB0cnVlLCBmbjogZm4gfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgdHJhY2sodGltZSkge1xuICAgICAgICBmb3IgKGxldCBrIGluIHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgIGxldCBsaSA9IHRoaXMuX2xpc3RlbmVyc1trXTtcbiAgICAgICAgICAgICAgICBsZXQgX3QgPSAobGkub2Zmc2V0KSA/IHRpbWUgKyBsaS5vZmZzZXQgOiB0aW1lO1xuICAgICAgICAgICAgICAgIGxldCBtcyA9IGxpLnBlcmlvZCAqIHRoaXMuX21zO1xuICAgICAgICAgICAgICAgIGxldCBpc1N0YXJ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKF90ID4gbGkuZHVyYXRpb24gKyBtcykge1xuICAgICAgICAgICAgICAgICAgICBsaS5kdXJhdGlvbiA9IF90IC0gKF90ICUgdGhpcy5fbXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsaS5iZWF0cykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpLmluZGV4ID0gKGxpLmluZGV4ICsgMSkgJSBsaS5iZWF0cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaS5wZXJpb2QgPSBsaS5iZWF0c1tsaS5pbmRleF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaXNTdGFydCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBjb3VudCA9IE1hdGgubWF4KDAsIE1hdGguY2VpbChNYXRoLmZsb29yKGxpLmR1cmF0aW9uIC8gdGhpcy5fbXMpIC8gbGkucGVyaW9kKSk7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IChsaS5jb250aW51b3VzKSA/IFtjb3VudCwgTnVtLmNsYW1wKChfdCAtIGxpLmR1cmF0aW9uKSAvIG1zLCAwLCAxKSwgX3QsIGlzU3RhcnRdIDogW2NvdW50XTtcbiAgICAgICAgICAgICAgICBpZiAobGkuY29udGludW91cyB8fCBpc1N0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkb25lID0gbGkuZm4uYXBwbHkobGksIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb25lKVxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyc1tsaS5uYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RvcChuYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbbmFtZV0pXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fbGlzdGVuZXJzW25hbWVdO1xuICAgIH1cbiAgICBhbmltYXRlKHRpbWUsIGZ0aW1lKSB7XG4gICAgICAgIHRoaXMudHJhY2sodGltZSk7XG4gICAgfVxuICAgIHJlc2l6ZShib3VuZCwgZXZ0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYWN0aW9uKHR5cGUsIHB4LCBweSwgZXZ0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKHR5cGUpIHtcbiAgICAgICAgdGhpcy5fcGxheWluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICAgICAgbGV0IF9jdHggPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQgfHwgZmFsc2U7XG4gICAgICAgIGlmICghX2N0eClcbiAgICAgICAgICAgIHRocm93IChuZXcgRXJyb3IoXCJZb3VyIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IFdlYiBBdWRpby4gKE5vIEF1ZGlvQ29udGV4dClcIikpO1xuICAgICAgICB0aGlzLl9jdHggPSAoX2N0eCkgPyBuZXcgX2N0eCgpIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbShub2RlLCBjdHgsIHR5cGUgPSBcImdlblwiLCBzdHJlYW0pIHtcbiAgICAgICAgbGV0IHMgPSBuZXcgU291bmQodHlwZSk7XG4gICAgICAgIHMuX25vZGUgPSBub2RlO1xuICAgICAgICBzLl9jdHggPSBjdHg7XG4gICAgICAgIGlmIChzdHJlYW0pXG4gICAgICAgICAgICBzLl9zdHJlYW0gPSBzdHJlYW07XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICBzdGF0aWMgbG9hZChzb3VyY2UsIGNyb3NzT3JpZ2luID0gXCJhbm9ueW1vdXNcIikge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHMgPSBuZXcgU291bmQoXCJmaWxlXCIpO1xuICAgICAgICAgICAgcy5fc291cmNlID0gKHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnKSA/IG5ldyBBdWRpbyhzb3VyY2UpIDogc291cmNlO1xuICAgICAgICAgICAgcy5fc291cmNlLmF1dG9wbGF5ID0gZmFsc2U7XG4gICAgICAgICAgICBzLl9zb3VyY2UuY3Jvc3NPcmlnaW4gPSBjcm9zc09yaWdpbjtcbiAgICAgICAgICAgIHMuX3NvdXJjZS5hZGRFdmVudExpc3RlbmVyKFwiZW5kZWRcIiwgZnVuY3Rpb24gKCkgeyBzLl9wbGF5aW5nID0gZmFsc2U7IH0pO1xuICAgICAgICAgICAgcy5fc291cmNlLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24gKCkgeyByZWplY3QoXCJFcnJvciBsb2FkaW5nIHNvdW5kXCIpOyB9KTtcbiAgICAgICAgICAgIHMuX3NvdXJjZS5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5dGhyb3VnaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzLl9ub2RlID0gcy5fY3R4LmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZShzLl9zb3VyY2UpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUocyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHN0YXRpYyBsb2FkQXNCdWZmZXIodXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgICAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICAgICAgICAgICAgbGV0IHMgPSBuZXcgU291bmQoXCJmaWxlXCIpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcy5fY3R4LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBmdW5jdGlvbiAoYnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuY3JlYXRlQnVmZmVyKGJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocyk7XG4gICAgICAgICAgICAgICAgfSwgKGVycikgPT4gcmVqZWN0KFwiRXJyb3IgZGVjb2RpbmcgYXVkaW9cIikpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlQnVmZmVyKGJ1Zikge1xuICAgICAgICB0aGlzLl9ub2RlID0gdGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICBpZiAoYnVmICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9idWZmZXIgPSBidWY7XG4gICAgICAgIHRoaXMuX25vZGUuYnVmZmVyID0gdGhpcy5fYnVmZmVyO1xuICAgICAgICB0aGlzLl9ub2RlLm9uZW5kZWQgPSAoKSA9PiB7IHRoaXMuX3BsYXlpbmcgPSBmYWxzZTsgfTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0YXRpYyBnZW5lcmF0ZSh0eXBlLCB2YWwpIHtcbiAgICAgICAgbGV0IHMgPSBuZXcgU291bmQoXCJnZW5cIik7XG4gICAgICAgIHJldHVybiBzLl9nZW4odHlwZSwgdmFsKTtcbiAgICB9XG4gICAgX2dlbih0eXBlLCB2YWwpIHtcbiAgICAgICAgdGhpcy5fbm9kZSA9IHRoaXMuX2N0eC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgICAgIGxldCBvc2MgPSB0aGlzLl9ub2RlO1xuICAgICAgICBvc2MudHlwZSA9IHR5cGU7XG4gICAgICAgIGlmICh0eXBlID09PSAnY3VzdG9tJykge1xuICAgICAgICAgICAgb3NjLnNldFBlcmlvZGljV2F2ZSh2YWwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3NjLmZyZXF1ZW5jeS52YWx1ZSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhdGljIGlucHV0KGNvbnN0cmFpbnQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IHMgPSBuZXcgU291bmQoXCJpbnB1dFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoIXMpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IGNvbnN0cmFpbnQgPyBjb25zdHJhaW50IDogeyBhdWRpbzogdHJ1ZSwgdmlkZW86IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgcy5fc3RyZWFtID0geWllbGQgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoYyk7XG4gICAgICAgICAgICAgICAgcy5fbm9kZSA9IHMuX2N0eC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzLl9zdHJlYW0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IGdldCBhdWRpbyBmcm9tIGlucHV0IGRldmljZS5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldCBjdHgoKSB7IHJldHVybiB0aGlzLl9jdHg7IH1cbiAgICBnZXQgbm9kZSgpIHsgcmV0dXJuIHRoaXMuX25vZGU7IH1cbiAgICBnZXQgc3RyZWFtKCkgeyByZXR1cm4gdGhpcy5fc3RyZWFtOyB9XG4gICAgZ2V0IHNvdXJjZSgpIHsgcmV0dXJuIHRoaXMuX3NvdXJjZTsgfVxuICAgIGdldCBidWZmZXIoKSB7IHJldHVybiB0aGlzLl9idWZmZXI7IH1cbiAgICBzZXQgYnVmZmVyKGIpIHsgdGhpcy5fYnVmZmVyID0gYjsgfVxuICAgIGdldCB0eXBlKCkgeyByZXR1cm4gdGhpcy5fdHlwZTsgfVxuICAgIGdldCBwbGF5aW5nKCkgeyByZXR1cm4gdGhpcy5fcGxheWluZzsgfVxuICAgIGdldCBwcm9ncmVzcygpIHtcbiAgICAgICAgbGV0IGR1ciA9IDA7XG4gICAgICAgIGxldCBjdXJyID0gMDtcbiAgICAgICAgaWYgKCEhdGhpcy5fYnVmZmVyKSB7XG4gICAgICAgICAgICBkdXIgPSB0aGlzLl9idWZmZXIuZHVyYXRpb247XG4gICAgICAgICAgICBjdXJyID0gKHRoaXMuX3RpbWVzdGFtcCkgPyB0aGlzLl9jdHguY3VycmVudFRpbWUgLSB0aGlzLl90aW1lc3RhbXAgOiAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZHVyID0gdGhpcy5fc291cmNlLmR1cmF0aW9uO1xuICAgICAgICAgICAgY3VyciA9IHRoaXMuX3NvdXJjZS5jdXJyZW50VGltZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3VyciAvIGR1cjtcbiAgICB9XG4gICAgZ2V0IHBsYXlhYmxlKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX3R5cGUgPT09IFwiaW5wdXRcIikgPyB0aGlzLl9ub2RlICE9PSB1bmRlZmluZWQgOiAoISF0aGlzLl9idWZmZXIgfHwgdGhpcy5fc291cmNlLnJlYWR5U3RhdGUgPT09IDQpO1xuICAgIH1cbiAgICBnZXQgYmluU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5hbHl6ZXIuc2l6ZTtcbiAgICB9XG4gICAgZ2V0IHNhbXBsZVJhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdHguc2FtcGxlUmF0ZTtcbiAgICB9XG4gICAgZ2V0IGZyZXF1ZW5jeSgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl90eXBlID09PSBcImdlblwiKSA/IHRoaXMuX25vZGUuZnJlcXVlbmN5LnZhbHVlIDogMDtcbiAgICB9XG4gICAgc2V0IGZyZXF1ZW5jeShmKSB7XG4gICAgICAgIGlmICh0aGlzLl90eXBlID09PSBcImdlblwiKVxuICAgICAgICAgICAgdGhpcy5fbm9kZS5mcmVxdWVuY3kudmFsdWUgPSBmO1xuICAgIH1cbiAgICBjb25uZWN0KG5vZGUpIHtcbiAgICAgICAgdGhpcy5fbm9kZS5jb25uZWN0KG5vZGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgYW5hbHl6ZShzaXplID0gMjU2LCBtaW5EYiA9IC0xMDAsIG1heERiID0gLTMwLCBzbW9vdGggPSAwLjgpIHtcbiAgICAgICAgbGV0IGEgPSB0aGlzLl9jdHguY3JlYXRlQW5hbHlzZXIoKTtcbiAgICAgICAgYS5mZnRTaXplID0gc2l6ZSAqIDI7XG4gICAgICAgIGEubWluRGVjaWJlbHMgPSBtaW5EYjtcbiAgICAgICAgYS5tYXhEZWNpYmVscyA9IG1heERiO1xuICAgICAgICBhLnNtb290aGluZ1RpbWVDb25zdGFudCA9IHNtb290aDtcbiAgICAgICAgdGhpcy5hbmFseXplciA9IHtcbiAgICAgICAgICAgIG5vZGU6IGEsXG4gICAgICAgICAgICBzaXplOiBhLmZyZXF1ZW5jeUJpbkNvdW50LFxuICAgICAgICAgICAgZGF0YTogbmV3IFVpbnQ4QXJyYXkoYS5mcmVxdWVuY3lCaW5Db3VudClcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fbm9kZS5jb25uZWN0KHRoaXMuYW5hbHl6ZXIubm9kZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBfZG9tYWluKHRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuYW5hbHl6ZXIpIHtcbiAgICAgICAgICAgIGlmICh0aW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmFseXplci5ub2RlLmdldEJ5dGVUaW1lRG9tYWluRGF0YSh0aGlzLmFuYWx5emVyLmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmFseXplci5ub2RlLmdldEJ5dGVGcmVxdWVuY3lEYXRhKHRoaXMuYW5hbHl6ZXIuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hbmFseXplci5kYXRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheSgwKTtcbiAgICB9XG4gICAgX2RvbWFpblRvKHRpbWUsIHNpemUsIHBvc2l0aW9uID0gWzAsIDBdLCB0cmltID0gWzAsIDBdKSB7XG4gICAgICAgIGxldCBkYXRhID0gKHRpbWUpID8gdGhpcy50aW1lRG9tYWluKCkgOiB0aGlzLmZyZXFEb21haW4oKTtcbiAgICAgICAgbGV0IGcgPSBuZXcgR3JvdXAoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRyaW1bMF0sIGxlbiA9IGRhdGEubGVuZ3RoIC0gdHJpbVsxXTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBnLnB1c2gobmV3IFB0KHBvc2l0aW9uWzBdICsgc2l6ZVswXSAqIGkgLyBsZW4sIHBvc2l0aW9uWzFdICsgc2l6ZVsxXSAqIGRhdGFbaV0gLyAyNTUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZztcbiAgICB9XG4gICAgdGltZURvbWFpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RvbWFpbih0cnVlKTtcbiAgICB9XG4gICAgdGltZURvbWFpblRvKHNpemUsIHBvc2l0aW9uID0gWzAsIDBdLCB0cmltID0gWzAsIDBdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kb21haW5Ubyh0cnVlLCBzaXplLCBwb3NpdGlvbiwgdHJpbSk7XG4gICAgfVxuICAgIGZyZXFEb21haW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kb21haW4oZmFsc2UpO1xuICAgIH1cbiAgICBmcmVxRG9tYWluVG8oc2l6ZSwgcG9zaXRpb24gPSBbMCwgMF0sIHRyaW0gPSBbMCwgMF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RvbWFpblRvKGZhbHNlLCBzaXplLCBwb3NpdGlvbiwgdHJpbSk7XG4gICAgfVxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgdGhpcy5fbm9kZS5kaXNjb25uZWN0KCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzdGFydCh0aW1lQXQgPSAwKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdHguc3RhdGUgPT09ICdzdXNwZW5kZWQnKVxuICAgICAgICAgICAgdGhpcy5fY3R4LnJlc3VtZSgpO1xuICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gXCJmaWxlXCIpIHtcbiAgICAgICAgICAgIGlmICghIXRoaXMuX2J1ZmZlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX25vZGUuc3RhcnQodGltZUF0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl90aW1lc3RhbXAgPSB0aGlzLl9jdHguY3VycmVudFRpbWUgKyB0aW1lQXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2UucGxheSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aW1lQXQgPiAwKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2UuY3VycmVudFRpbWUgPSB0aW1lQXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fdHlwZSA9PT0gXCJnZW5cIikge1xuICAgICAgICAgICAgdGhpcy5fZ2VuKHRoaXMuX25vZGUudHlwZSwgdGhpcy5fbm9kZS5mcmVxdWVuY3kudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5fbm9kZS5zdGFydCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuYW5hbHl6ZXIpXG4gICAgICAgICAgICAgICAgdGhpcy5fbm9kZS5jb25uZWN0KHRoaXMuYW5hbHl6ZXIubm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbm9kZS5jb25uZWN0KHRoaXMuX2N0eC5kZXN0aW5hdGlvbik7XG4gICAgICAgIHRoaXMuX3BsYXlpbmcgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RvcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BsYXlpbmcpXG4gICAgICAgICAgICB0aGlzLl9ub2RlLmRpc2Nvbm5lY3QodGhpcy5fY3R4LmRlc3RpbmF0aW9uKTtcbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09IFwiZmlsZVwiKSB7XG4gICAgICAgICAgICBpZiAoISF0aGlzLl9idWZmZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9ncmVzcyA8IDEpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vZGUuc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc291cmNlLnBhdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fdHlwZSA9PT0gXCJnZW5cIikge1xuICAgICAgICAgICAgdGhpcy5fbm9kZS5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fdHlwZSA9PT0gXCJpbnB1dFwiKSB7XG4gICAgICAgICAgICB0aGlzLl9zdHJlYW0uZ2V0QXVkaW9UcmFja3MoKS5mb3JFYWNoKHRyYWNrID0+IHRyYWNrLnN0b3AoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcGxheWluZyA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5fcGxheWluZykge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UGxheS5qcy5tYXAiLCIvKiEgU291cmNlIGNvZGUgbGljZW5zZWQgdW5kZXIgQXBhY2hlIExpY2Vuc2UgMi4wLiBDb3B5cmlnaHQgwqkgMjAxNy1jdXJyZW50IFdpbGxpYW0gTmdhbiBhbmQgY29udHJpYnV0b3JzLiAoaHR0cHM6Ly9naXRodWIuY29tL3dpbGxpYW1uZ2FuL3B0cykgKi9cbmltcG9ydCB7IFV0aWwsIENvbnN0IH0gZnJvbSBcIi4vVXRpbFwiO1xuaW1wb3J0IHsgR2VvbSwgTnVtIH0gZnJvbSBcIi4vTnVtXCI7XG5pbXBvcnQgeyBWZWMsIE1hdCB9IGZyb20gXCIuL0xpbmVhckFsZ2VicmFcIjtcbmV4cG9ydCBjbGFzcyBQdCBleHRlbmRzIEZsb2F0MzJBcnJheSB7XG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGFyZ3NbMF0gPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgc3VwZXIoYXJnc1swXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdXBlcigoYXJncy5sZW5ndGggPiAwKSA/IFV0aWwuZ2V0QXJncyhhcmdzKSA6IFswLCAwXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIG1ha2UoZGltZW5zaW9ucywgZGVmYXVsdFZhbHVlID0gMCwgcmFuZG9taXplID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHAgPSBuZXcgRmxvYXQzMkFycmF5KGRpbWVuc2lvbnMpO1xuICAgICAgICBpZiAoZGVmYXVsdFZhbHVlKVxuICAgICAgICAgICAgcC5maWxsKGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIGlmIChyYW5kb21pemUpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBwLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcFtpXSA9IHBbaV0gKiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUHQocCk7XG4gICAgfVxuICAgIGdldCBpZCgpIHsgcmV0dXJuIHRoaXMuX2lkOyB9XG4gICAgc2V0IGlkKHMpIHsgdGhpcy5faWQgPSBzOyB9XG4gICAgZ2V0IHgoKSB7IHJldHVybiB0aGlzWzBdOyB9XG4gICAgc2V0IHgobikgeyB0aGlzWzBdID0gbjsgfVxuICAgIGdldCB5KCkgeyByZXR1cm4gdGhpc1sxXTsgfVxuICAgIHNldCB5KG4pIHsgdGhpc1sxXSA9IG47IH1cbiAgICBnZXQgeigpIHsgcmV0dXJuIHRoaXNbMl07IH1cbiAgICBzZXQgeihuKSB7IHRoaXNbMl0gPSBuOyB9XG4gICAgZ2V0IHcoKSB7IHJldHVybiB0aGlzWzNdOyB9XG4gICAgc2V0IHcobikgeyB0aGlzWzNdID0gbjsgfVxuICAgIGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IFB0KHRoaXMpO1xuICAgIH1cbiAgICBlcXVhbHMocCwgdGhyZXNob2xkID0gMC4wMDAwMDEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh0aGlzW2ldIC0gcFtpXSkgPiB0aHJlc2hvbGQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB0byguLi5hcmdzKSB7XG4gICAgICAgIGxldCBwID0gVXRpbC5nZXRBcmdzKGFyZ3MpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gTWF0aC5taW4odGhpcy5sZW5ndGgsIHAubGVuZ3RoKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzW2ldID0gcFtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgJHRvKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS50byguLi5hcmdzKTtcbiAgICB9XG4gICAgdG9BbmdsZShyYWRpYW4sIG1hZ25pdHVkZSwgYW5jaG9yRnJvbVB0ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IG0gPSAobWFnbml0dWRlICE9IHVuZGVmaW5lZCkgPyBtYWduaXR1ZGUgOiB0aGlzLm1hZ25pdHVkZSgpO1xuICAgICAgICBsZXQgY2hhbmdlID0gW01hdGguY29zKHJhZGlhbikgKiBtLCBNYXRoLnNpbihyYWRpYW4pICogbV07XG4gICAgICAgIHJldHVybiAoYW5jaG9yRnJvbVB0KSA/IHRoaXMuYWRkKGNoYW5nZSkgOiB0aGlzLnRvKGNoYW5nZSk7XG4gICAgfVxuICAgIG9wKGZuKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuICguLi5wYXJhbXMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBmbihzZWxmLCAuLi5wYXJhbXMpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBvcHMoZm5zKSB7XG4gICAgICAgIGxldCBfb3BzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBmbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIF9vcHMucHVzaCh0aGlzLm9wKGZuc1tpXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfb3BzO1xuICAgIH1cbiAgICAkdGFrZShheGlzKSB7XG4gICAgICAgIGxldCBwID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBheGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBwLnB1c2godGhpc1theGlzW2ldXSB8fCAwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFB0KHApO1xuICAgIH1cbiAgICAkY29uY2F0KC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQdCh0aGlzLnRvQXJyYXkoKS5jb25jYXQoVXRpbC5nZXRBcmdzKGFyZ3MpKSk7XG4gICAgfVxuICAgIGFkZCguLi5hcmdzKSB7XG4gICAgICAgIChhcmdzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgYXJnc1swXSA9PSBcIm51bWJlclwiKSA/IFZlYy5hZGQodGhpcywgYXJnc1swXSkgOiBWZWMuYWRkKHRoaXMsIFV0aWwuZ2V0QXJncyhhcmdzKSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAkYWRkKC4uLmFyZ3MpIHsgcmV0dXJuIHRoaXMuY2xvbmUoKS5hZGQoLi4uYXJncyk7IH1cbiAgICBzdWJ0cmFjdCguLi5hcmdzKSB7XG4gICAgICAgIChhcmdzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgYXJnc1swXSA9PSBcIm51bWJlclwiKSA/IFZlYy5zdWJ0cmFjdCh0aGlzLCBhcmdzWzBdKSA6IFZlYy5zdWJ0cmFjdCh0aGlzLCBVdGlsLmdldEFyZ3MoYXJncykpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgJHN1YnRyYWN0KC4uLmFyZ3MpIHsgcmV0dXJuIHRoaXMuY2xvbmUoKS5zdWJ0cmFjdCguLi5hcmdzKTsgfVxuICAgIG11bHRpcGx5KC4uLmFyZ3MpIHtcbiAgICAgICAgKGFyZ3MubGVuZ3RoID09PSAxICYmIHR5cGVvZiBhcmdzWzBdID09IFwibnVtYmVyXCIpID8gVmVjLm11bHRpcGx5KHRoaXMsIGFyZ3NbMF0pIDogVmVjLm11bHRpcGx5KHRoaXMsIFV0aWwuZ2V0QXJncyhhcmdzKSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAkbXVsdGlwbHkoLi4uYXJncykgeyByZXR1cm4gdGhpcy5jbG9uZSgpLm11bHRpcGx5KC4uLmFyZ3MpOyB9XG4gICAgZGl2aWRlKC4uLmFyZ3MpIHtcbiAgICAgICAgKGFyZ3MubGVuZ3RoID09PSAxICYmIHR5cGVvZiBhcmdzWzBdID09IFwibnVtYmVyXCIpID8gVmVjLmRpdmlkZSh0aGlzLCBhcmdzWzBdKSA6IFZlYy5kaXZpZGUodGhpcywgVXRpbC5nZXRBcmdzKGFyZ3MpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgICRkaXZpZGUoLi4uYXJncykgeyByZXR1cm4gdGhpcy5jbG9uZSgpLmRpdmlkZSguLi5hcmdzKTsgfVxuICAgIG1hZ25pdHVkZVNxKCkgeyByZXR1cm4gVmVjLmRvdCh0aGlzLCB0aGlzKTsgfVxuICAgIG1hZ25pdHVkZSgpIHsgcmV0dXJuIFZlYy5tYWduaXR1ZGUodGhpcyk7IH1cbiAgICB1bml0KG1hZ25pdHVkZSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBWZWMudW5pdCh0aGlzLCBtYWduaXR1ZGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgJHVuaXQobWFnbml0dWRlID0gdW5kZWZpbmVkKSB7IHJldHVybiB0aGlzLmNsb25lKCkudW5pdChtYWduaXR1ZGUpOyB9XG4gICAgZG90KC4uLmFyZ3MpIHsgcmV0dXJuIFZlYy5kb3QodGhpcywgVXRpbC5nZXRBcmdzKGFyZ3MpKTsgfVxuICAgICRjcm9zczJEKC4uLmFyZ3MpIHsgcmV0dXJuIFZlYy5jcm9zczJEKHRoaXMsIFV0aWwuZ2V0QXJncyhhcmdzKSk7IH1cbiAgICAkY3Jvc3MoLi4uYXJncykgeyByZXR1cm4gVmVjLmNyb3NzKHRoaXMsIFV0aWwuZ2V0QXJncyhhcmdzKSk7IH1cbiAgICAkcHJvamVjdCguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRtdWx0aXBseSh0aGlzLmRvdCguLi5hcmdzKSAvIHRoaXMubWFnbml0dWRlU3EoKSk7XG4gICAgfVxuICAgIHByb2plY3RTY2FsYXIoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gdGhpcy5kb3QoLi4uYXJncykgLyB0aGlzLm1hZ25pdHVkZSgpO1xuICAgIH1cbiAgICBhYnMoKSB7XG4gICAgICAgIFZlYy5hYnModGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAkYWJzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFicygpO1xuICAgIH1cbiAgICBmbG9vcigpIHtcbiAgICAgICAgVmVjLmZsb29yKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgJGZsb29yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmZsb29yKCk7XG4gICAgfVxuICAgIGNlaWwoKSB7XG4gICAgICAgIFZlYy5jZWlsKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgJGNlaWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuY2VpbCgpO1xuICAgIH1cbiAgICByb3VuZCgpIHtcbiAgICAgICAgVmVjLnJvdW5kKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgJHJvdW5kKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdW5kKCk7XG4gICAgfVxuICAgIG1pblZhbHVlKCkge1xuICAgICAgICByZXR1cm4gVmVjLm1pbih0aGlzKTtcbiAgICB9XG4gICAgbWF4VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiBWZWMubWF4KHRoaXMpO1xuICAgIH1cbiAgICAkbWluKC4uLmFyZ3MpIHtcbiAgICAgICAgbGV0IHAgPSBVdGlsLmdldEFyZ3MoYXJncyk7XG4gICAgICAgIGxldCBtID0gdGhpcy5jbG9uZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gTWF0aC5taW4odGhpcy5sZW5ndGgsIHAubGVuZ3RoKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBtW2ldID0gTWF0aC5taW4odGhpc1tpXSwgcFtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuICAgICRtYXgoLi4uYXJncykge1xuICAgICAgICBsZXQgcCA9IFV0aWwuZ2V0QXJncyhhcmdzKTtcbiAgICAgICAgbGV0IG0gPSB0aGlzLmNsb25lKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBNYXRoLm1pbih0aGlzLmxlbmd0aCwgcC5sZW5ndGgpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIG1baV0gPSBNYXRoLm1heCh0aGlzW2ldLCBwW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG4gICAgYW5nbGUoYXhpcyA9IENvbnN0Lnh5KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXNbYXhpc1sxXV0sIHRoaXNbYXhpc1swXV0pO1xuICAgIH1cbiAgICBhbmdsZUJldHdlZW4ocCwgYXhpcyA9IENvbnN0Lnh5KSB7XG4gICAgICAgIHJldHVybiBHZW9tLmJvdW5kUmFkaWFuKHRoaXMuYW5nbGUoYXhpcykpIC0gR2VvbS5ib3VuZFJhZGlhbihwLmFuZ2xlKGF4aXMpKTtcbiAgICB9XG4gICAgc2NhbGUoc2NhbGUsIGFuY2hvcikge1xuICAgICAgICBHZW9tLnNjYWxlKHRoaXMsIHNjYWxlLCBhbmNob3IgfHwgUHQubWFrZSh0aGlzLmxlbmd0aCwgMCkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcm90YXRlMkQoYW5nbGUsIGFuY2hvciwgYXhpcykge1xuICAgICAgICBHZW9tLnJvdGF0ZTJEKHRoaXMsIGFuZ2xlLCBhbmNob3IgfHwgUHQubWFrZSh0aGlzLmxlbmd0aCwgMCksIGF4aXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2hlYXIyRChzY2FsZSwgYW5jaG9yLCBheGlzKSB7XG4gICAgICAgIEdlb20uc2hlYXIyRCh0aGlzLCBzY2FsZSwgYW5jaG9yIHx8IFB0Lm1ha2UodGhpcy5sZW5ndGgsIDApLCBheGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJlZmxlY3QyRChsaW5lLCBheGlzKSB7XG4gICAgICAgIEdlb20ucmVmbGVjdDJEKHRoaXMsIGxpbmUsIGF4aXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBgUHQoJHt0aGlzLmpvaW4oXCIsIFwiKX0pYDtcbiAgICB9XG4gICAgdG9BcnJheSgpIHtcbiAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwodGhpcyk7XG4gICAgfVxuICAgIHRvR3JvdXAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgR3JvdXAoUHQubWFrZSh0aGlzLmxlbmd0aCksIHRoaXMuY2xvbmUoKSk7XG4gICAgfVxuICAgIHRvQm91bmQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmQoUHQubWFrZSh0aGlzLmxlbmd0aCksIHRoaXMuY2xvbmUoKSk7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEdyb3VwIGV4dGVuZHMgQXJyYXkge1xuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgfVxuICAgIGdldCBpZCgpIHsgcmV0dXJuIHRoaXMuX2lkOyB9XG4gICAgc2V0IGlkKHMpIHsgdGhpcy5faWQgPSBzOyB9XG4gICAgZ2V0IHAxKCkgeyByZXR1cm4gdGhpc1swXTsgfVxuICAgIGdldCBwMigpIHsgcmV0dXJuIHRoaXNbMV07IH1cbiAgICBnZXQgcDMoKSB7IHJldHVybiB0aGlzWzJdOyB9XG4gICAgZ2V0IHA0KCkgeyByZXR1cm4gdGhpc1szXTsgfVxuICAgIGdldCBxMSgpIHsgcmV0dXJuIHRoaXNbdGhpcy5sZW5ndGggLSAxXTsgfVxuICAgIGdldCBxMigpIHsgcmV0dXJuIHRoaXNbdGhpcy5sZW5ndGggLSAyXTsgfVxuICAgIGdldCBxMygpIHsgcmV0dXJuIHRoaXNbdGhpcy5sZW5ndGggLSAzXTsgfVxuICAgIGdldCBxNCgpIHsgcmV0dXJuIHRoaXNbdGhpcy5sZW5ndGggLSA0XTsgfVxuICAgIGNsb25lKCkge1xuICAgICAgICBsZXQgZ3JvdXAgPSBuZXcgR3JvdXAoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGdyb3VwLnB1c2godGhpc1tpXS5jbG9uZSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3JvdXA7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tQXJyYXkobGlzdCkge1xuICAgICAgICBsZXQgZyA9IG5ldyBHcm91cCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IHAgPSAobGlzdFtpXSBpbnN0YW5jZW9mIFB0KSA/IGxpc3RbaV0gOiBuZXcgUHQobGlzdFtpXSk7XG4gICAgICAgICAgICBnLnB1c2gocCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGc7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tUHRBcnJheShsaXN0KSB7XG4gICAgICAgIHJldHVybiBHcm91cC5mcm9tKGxpc3QpO1xuICAgIH1cbiAgICBzcGxpdChjaHVua1NpemUsIHN0cmlkZSwgbG9vcEJhY2sgPSBmYWxzZSkge1xuICAgICAgICBsZXQgc3AgPSBVdGlsLnNwbGl0KHRoaXMsIGNodW5rU2l6ZSwgc3RyaWRlLCBsb29wQmFjayk7XG4gICAgICAgIHJldHVybiBzcDtcbiAgICB9XG4gICAgaW5zZXJ0KHB0cywgaW5kZXggPSAwKSB7XG4gICAgICAgIEdyb3VwLnByb3RvdHlwZS5zcGxpY2UuYXBwbHkodGhpcywgW2luZGV4LCAwLCAuLi5wdHNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJlbW92ZShpbmRleCA9IDAsIGNvdW50ID0gMSkge1xuICAgICAgICBsZXQgcGFyYW0gPSAoaW5kZXggPCAwKSA/IFtpbmRleCAqIC0xIC0gMSwgY291bnRdIDogW2luZGV4LCBjb3VudF07XG4gICAgICAgIHJldHVybiBHcm91cC5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMsIHBhcmFtKTtcbiAgICB9XG4gICAgc2VnbWVudHMocHRzX3Blcl9zZWdtZW50ID0gMiwgc3RyaWRlID0gMSwgbG9vcEJhY2sgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdChwdHNfcGVyX3NlZ21lbnQsIHN0cmlkZSwgbG9vcEJhY2spO1xuICAgIH1cbiAgICBsaW5lcygpIHsgcmV0dXJuIHRoaXMuc2VnbWVudHMoMiwgMSk7IH1cbiAgICBjZW50cm9pZCgpIHtcbiAgICAgICAgcmV0dXJuIEdlb20uY2VudHJvaWQodGhpcyk7XG4gICAgfVxuICAgIGJvdW5kaW5nQm94KCkge1xuICAgICAgICByZXR1cm4gR2VvbS5ib3VuZGluZ0JveCh0aGlzKTtcbiAgICB9XG4gICAgYW5jaG9yVG8ocHRPckluZGV4ID0gMCkgeyBHZW9tLmFuY2hvcih0aGlzLCBwdE9ySW5kZXgsIFwidG9cIik7IH1cbiAgICBhbmNob3JGcm9tKHB0T3JJbmRleCA9IDApIHsgR2VvbS5hbmNob3IodGhpcywgcHRPckluZGV4LCBcImZyb21cIik7IH1cbiAgICBvcChmbikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiAoLi4ucGFyYW1zKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZm4oc2VsZiwgLi4ucGFyYW1zKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgb3BzKGZucykge1xuICAgICAgICBsZXQgX29wcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gZm5zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBfb3BzLnB1c2godGhpcy5vcChmbnNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX29wcztcbiAgICB9XG4gICAgaW50ZXJwb2xhdGUodCkge1xuICAgICAgICB0ID0gTnVtLmNsYW1wKHQsIDAsIDEpO1xuICAgICAgICBsZXQgY2h1bmsgPSB0aGlzLmxlbmd0aCAtIDE7XG4gICAgICAgIGxldCB0YyA9IDEgLyAodGhpcy5sZW5ndGggLSAxKTtcbiAgICAgICAgbGV0IGlkeCA9IE1hdGguZmxvb3IodCAvIHRjKTtcbiAgICAgICAgcmV0dXJuIEdlb20uaW50ZXJwb2xhdGUodGhpc1tpZHhdLCB0aGlzW01hdGgubWluKHRoaXMubGVuZ3RoIC0gMSwgaWR4ICsgMSldLCAodCAtIGlkeCAqIHRjKSAqIGNodW5rKTtcbiAgICB9XG4gICAgbW92ZUJ5KC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKC4uLmFyZ3MpO1xuICAgIH1cbiAgICBtb3ZlVG8oLi4uYXJncykge1xuICAgICAgICBsZXQgZCA9IG5ldyBQdChVdGlsLmdldEFyZ3MoYXJncykpLnN1YnRyYWN0KHRoaXNbMF0pO1xuICAgICAgICB0aGlzLm1vdmVCeShkKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNjYWxlKHNjYWxlLCBhbmNob3IpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIEdlb20uc2NhbGUodGhpc1tpXSwgc2NhbGUsIGFuY2hvciB8fCB0aGlzWzBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcm90YXRlMkQoYW5nbGUsIGFuY2hvciwgYXhpcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgR2VvbS5yb3RhdGUyRCh0aGlzW2ldLCBhbmdsZSwgYW5jaG9yIHx8IHRoaXNbMF0sIGF4aXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzaGVhcjJEKHNjYWxlLCBhbmNob3IsIGF4aXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIEdlb20uc2hlYXIyRCh0aGlzW2ldLCBzY2FsZSwgYW5jaG9yIHx8IHRoaXNbMF0sIGF4aXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZWZsZWN0MkQobGluZSwgYXhpcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgR2VvbS5yZWZsZWN0MkQodGhpc1tpXSwgbGluZSwgYXhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNvcnRCeURpbWVuc2lvbihkaW0sIGRlc2MgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3J0KChhLCBiKSA9PiAoZGVzYykgPyBiW2RpbV0gLSBhW2RpbV0gOiBhW2RpbV0gLSBiW2RpbV0pO1xuICAgIH1cbiAgICBmb3JFYWNoUHQocHRGbiwgLi4uYXJncykge1xuICAgICAgICBpZiAoIXRoaXNbMF1bcHRGbl0pIHtcbiAgICAgICAgICAgIFV0aWwud2FybihgJHtwdEZufSBpcyBub3QgYSBmdW5jdGlvbiBvZiBQdGApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXNbaV0gPSB0aGlzW2ldW3B0Rm5dKC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBhZGQoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JFYWNoUHQoXCJhZGRcIiwgLi4uYXJncyk7XG4gICAgfVxuICAgIHN1YnRyYWN0KC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9yRWFjaFB0KFwic3VidHJhY3RcIiwgLi4uYXJncyk7XG4gICAgfVxuICAgIG11bHRpcGx5KC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9yRWFjaFB0KFwibXVsdGlwbHlcIiwgLi4uYXJncyk7XG4gICAgfVxuICAgIGRpdmlkZSguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvckVhY2hQdChcImRpdmlkZVwiLCAuLi5hcmdzKTtcbiAgICB9XG4gICAgJG1hdHJpeEFkZChnKSB7XG4gICAgICAgIHJldHVybiBNYXQuYWRkKHRoaXMsIGcpO1xuICAgIH1cbiAgICAkbWF0cml4TXVsdGlwbHkoZywgdHJhbnNwb3NlZCA9IGZhbHNlLCBlbGVtZW50d2lzZSA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBNYXQubXVsdGlwbHkodGhpcywgZywgdHJhbnNwb3NlZCwgZWxlbWVudHdpc2UpO1xuICAgIH1cbiAgICB6aXBTbGljZShpbmRleCwgZGVmYXVsdFZhbHVlID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIE1hdC56aXBTbGljZSh0aGlzLCBpbmRleCwgZGVmYXVsdFZhbHVlKTtcbiAgICB9XG4gICAgJHppcChkZWZhdWx0VmFsdWUgPSB1bmRlZmluZWQsIHVzZUxvbmdlc3QgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gTWF0LnppcCh0aGlzLCBkZWZhdWx0VmFsdWUsIHVzZUxvbmdlc3QpO1xuICAgIH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiR3JvdXBbIFwiICsgdGhpcy5yZWR1Y2UoKHAsIGMpID0+IHAgKyBjLnRvU3RyaW5nKCkgKyBcIiBcIiwgXCJcIikgKyBcIiBdXCI7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEJvdW5kIGV4dGVuZHMgR3JvdXAge1xuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIHRoaXMuX2NlbnRlciA9IG5ldyBQdCgpO1xuICAgICAgICB0aGlzLl9zaXplID0gbmV3IFB0KCk7XG4gICAgICAgIHRoaXMuX3RvcExlZnQgPSBuZXcgUHQoKTtcbiAgICAgICAgdGhpcy5fYm90dG9tUmlnaHQgPSBuZXcgUHQoKTtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbUJvdW5kaW5nUmVjdChyZWN0KSB7XG4gICAgICAgIGxldCBiID0gbmV3IEJvdW5kKG5ldyBQdChyZWN0LmxlZnQgfHwgMCwgcmVjdC50b3AgfHwgMCksIG5ldyBQdChyZWN0LnJpZ2h0IHx8IDAsIHJlY3QuYm90dG9tIHx8IDApKTtcbiAgICAgICAgaWYgKHJlY3Qud2lkdGggJiYgcmVjdC5oZWlnaHQpXG4gICAgICAgICAgICBiLnNpemUgPSBuZXcgUHQocmVjdC53aWR0aCwgcmVjdC5oZWlnaHQpO1xuICAgICAgICByZXR1cm4gYjtcbiAgICB9XG4gICAgc3RhdGljIGZyb21Hcm91cChnKSB7XG4gICAgICAgIGlmIChnLmxlbmd0aCA8IDIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgY3JlYXRlIGEgQm91bmQgZnJvbSBhIGdyb3VwIHRoYXQgaGFzIGxlc3MgdGhhbiAyIFB0XCIpO1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kKGdbMF0sIGdbZy5sZW5ndGggLSAxXSk7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLnAxKSB7XG4gICAgICAgICAgICB0aGlzLl9zaXplID0gdGhpcy5wMS5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wMSAmJiB0aGlzLnAyKSB7XG4gICAgICAgICAgICBsZXQgYSA9IHRoaXMucDE7XG4gICAgICAgICAgICBsZXQgYiA9IHRoaXMucDI7XG4gICAgICAgICAgICB0aGlzLnRvcExlZnQgPSBhLiRtaW4oYik7XG4gICAgICAgICAgICB0aGlzLl9ib3R0b21SaWdodCA9IGEuJG1heChiKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNpemUoKTtcbiAgICAgICAgICAgIHRoaXMuX2luaXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xvbmUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmQodGhpcy5fdG9wTGVmdC5jbG9uZSgpLCB0aGlzLl9ib3R0b21SaWdodC5jbG9uZSgpKTtcbiAgICB9XG4gICAgX3VwZGF0ZVNpemUoKSB7XG4gICAgICAgIHRoaXMuX3NpemUgPSB0aGlzLl9ib3R0b21SaWdodC4kc3VidHJhY3QodGhpcy5fdG9wTGVmdCkuYWJzKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNlbnRlcigpO1xuICAgIH1cbiAgICBfdXBkYXRlQ2VudGVyKCkge1xuICAgICAgICB0aGlzLl9jZW50ZXIgPSB0aGlzLl9zaXplLiRtdWx0aXBseSgwLjUpLmFkZCh0aGlzLl90b3BMZWZ0KTtcbiAgICB9XG4gICAgX3VwZGF0ZVBvc0Zyb21Ub3AoKSB7XG4gICAgICAgIHRoaXMuX2JvdHRvbVJpZ2h0ID0gdGhpcy5fdG9wTGVmdC4kYWRkKHRoaXMuX3NpemUpO1xuICAgICAgICB0aGlzLl91cGRhdGVDZW50ZXIoKTtcbiAgICB9XG4gICAgX3VwZGF0ZVBvc0Zyb21Cb3R0b20oKSB7XG4gICAgICAgIHRoaXMuX3RvcExlZnQgPSB0aGlzLl9ib3R0b21SaWdodC4kc3VidHJhY3QodGhpcy5fc2l6ZSk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNlbnRlcigpO1xuICAgIH1cbiAgICBfdXBkYXRlUG9zRnJvbUNlbnRlcigpIHtcbiAgICAgICAgbGV0IGhhbGYgPSB0aGlzLl9zaXplLiRtdWx0aXBseSgwLjUpO1xuICAgICAgICB0aGlzLl90b3BMZWZ0ID0gdGhpcy5fY2VudGVyLiRzdWJ0cmFjdChoYWxmKTtcbiAgICAgICAgdGhpcy5fYm90dG9tUmlnaHQgPSB0aGlzLl9jZW50ZXIuJGFkZChoYWxmKTtcbiAgICB9XG4gICAgZ2V0IHNpemUoKSB7IHJldHVybiBuZXcgUHQodGhpcy5fc2l6ZSk7IH1cbiAgICBzZXQgc2l6ZShwKSB7XG4gICAgICAgIHRoaXMuX3NpemUgPSBuZXcgUHQocCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVBvc0Zyb21Ub3AoKTtcbiAgICB9XG4gICAgZ2V0IGNlbnRlcigpIHsgcmV0dXJuIG5ldyBQdCh0aGlzLl9jZW50ZXIpOyB9XG4gICAgc2V0IGNlbnRlcihwKSB7XG4gICAgICAgIHRoaXMuX2NlbnRlciA9IG5ldyBQdChwKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUG9zRnJvbUNlbnRlcigpO1xuICAgIH1cbiAgICBnZXQgdG9wTGVmdCgpIHsgcmV0dXJuIG5ldyBQdCh0aGlzLl90b3BMZWZ0KTsgfVxuICAgIHNldCB0b3BMZWZ0KHApIHtcbiAgICAgICAgdGhpcy5fdG9wTGVmdCA9IG5ldyBQdChwKTtcbiAgICAgICAgdGhpc1swXSA9IHRoaXMuX3RvcExlZnQ7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVNpemUoKTtcbiAgICB9XG4gICAgZ2V0IGJvdHRvbVJpZ2h0KCkgeyByZXR1cm4gbmV3IFB0KHRoaXMuX2JvdHRvbVJpZ2h0KTsgfVxuICAgIHNldCBib3R0b21SaWdodChwKSB7XG4gICAgICAgIHRoaXMuX2JvdHRvbVJpZ2h0ID0gbmV3IFB0KHApO1xuICAgICAgICB0aGlzWzFdID0gdGhpcy5fYm90dG9tUmlnaHQ7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVNpemUoKTtcbiAgICB9XG4gICAgZ2V0IHdpZHRoKCkgeyByZXR1cm4gKHRoaXMuX3NpemUubGVuZ3RoID4gMCkgPyB0aGlzLl9zaXplLnggOiAwOyB9XG4gICAgc2V0IHdpZHRoKHcpIHtcbiAgICAgICAgdGhpcy5fc2l6ZS54ID0gdztcbiAgICAgICAgdGhpcy5fdXBkYXRlUG9zRnJvbVRvcCgpO1xuICAgIH1cbiAgICBnZXQgaGVpZ2h0KCkgeyByZXR1cm4gKHRoaXMuX3NpemUubGVuZ3RoID4gMSkgPyB0aGlzLl9zaXplLnkgOiAwOyB9XG4gICAgc2V0IGhlaWdodChoKSB7XG4gICAgICAgIHRoaXMuX3NpemUueSA9IGg7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVBvc0Zyb21Ub3AoKTtcbiAgICB9XG4gICAgZ2V0IGRlcHRoKCkgeyByZXR1cm4gKHRoaXMuX3NpemUubGVuZ3RoID4gMikgPyB0aGlzLl9zaXplLnogOiAwOyB9XG4gICAgc2V0IGRlcHRoKGQpIHtcbiAgICAgICAgdGhpcy5fc2l6ZS56ID0gZDtcbiAgICAgICAgdGhpcy5fdXBkYXRlUG9zRnJvbVRvcCgpO1xuICAgIH1cbiAgICBnZXQgeCgpIHsgcmV0dXJuIHRoaXMudG9wTGVmdC54OyB9XG4gICAgZ2V0IHkoKSB7IHJldHVybiB0aGlzLnRvcExlZnQueTsgfVxuICAgIGdldCB6KCkgeyByZXR1cm4gdGhpcy50b3BMZWZ0Lno7IH1cbiAgICBnZXQgaW5pdGVkKCkgeyByZXR1cm4gdGhpcy5faW5pdGVkOyB9XG4gICAgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLl90b3BMZWZ0ID0gdGhpc1swXTtcbiAgICAgICAgdGhpcy5fYm90dG9tUmlnaHQgPSB0aGlzWzFdO1xuICAgICAgICB0aGlzLl91cGRhdGVTaXplKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVB0LmpzLm1hcCIsIi8qISBTb3VyY2UgY29kZSBsaWNlbnNlZCB1bmRlciBBcGFjaGUgTGljZW5zZSAyLjAuIENvcHlyaWdodCDCqSAyMDE3LWN1cnJlbnQgV2lsbGlhbSBOZ2FuIGFuZCBjb250cmlidXRvcnMuIChodHRwczovL2dpdGh1Yi5jb20vd2lsbGlhbW5nYW4vcHRzKSAqL1xuaW1wb3J0IHsgUHQsIEJvdW5kIH0gZnJvbSBcIi4vUHRcIjtcbmltcG9ydCB7IFVJUG9pbnRlckFjdGlvbnMgYXMgVUlBIH0gZnJvbSBcIi4vVUlcIjtcbmV4cG9ydCBjbGFzcyBTcGFjZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBcInNwYWNlXCI7XG4gICAgICAgIHRoaXMuYm91bmQgPSBuZXcgQm91bmQoKTtcbiAgICAgICAgdGhpcy5fdGltZSA9IHsgcHJldjogMCwgZGlmZjogMCwgZW5kOiAtMSB9O1xuICAgICAgICB0aGlzLnBsYXllcnMgPSB7fTtcbiAgICAgICAgdGhpcy5wbGF5ZXJDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuX2FuaW1JRCA9IC0xO1xuICAgICAgICB0aGlzLl9wYXVzZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9yZWZyZXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9wb2ludGVyID0gbmV3IFB0KCk7XG4gICAgICAgIHRoaXMuX2lzUmVhZHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcGxheWluZyA9IGZhbHNlO1xuICAgIH1cbiAgICByZWZyZXNoKGIpIHtcbiAgICAgICAgdGhpcy5fcmVmcmVzaCA9IGI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBhZGQocCkge1xuICAgICAgICBsZXQgcGxheWVyID0gKHR5cGVvZiBwID09IFwiZnVuY3Rpb25cIikgPyB7IGFuaW1hdGU6IHAgfSA6IHA7XG4gICAgICAgIGxldCBrID0gdGhpcy5wbGF5ZXJDb3VudCsrO1xuICAgICAgICBsZXQgcGlkID0gdGhpcy5pZCArIGs7XG4gICAgICAgIHRoaXMucGxheWVyc1twaWRdID0gcGxheWVyO1xuICAgICAgICBwbGF5ZXIuYW5pbWF0ZUlEID0gcGlkO1xuICAgICAgICBpZiAocGxheWVyLnJlc2l6ZSAmJiB0aGlzLmJvdW5kLmluaXRlZClcbiAgICAgICAgICAgIHBsYXllci5yZXNpemUodGhpcy5ib3VuZCk7XG4gICAgICAgIGlmICh0aGlzLl9yZWZyZXNoID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9yZWZyZXNoID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJlbW92ZShwbGF5ZXIpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMucGxheWVyc1twbGF5ZXIuYW5pbWF0ZUlEXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJlbW92ZUFsbCgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0ge307XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBwbGF5KHRpbWUgPSAwKSB7XG4gICAgICAgIGlmICh0aW1lID09PSAwICYmIHRoaXMuX2FuaW1JRCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hbmltSUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5wbGF5LmJpbmQodGhpcykpO1xuICAgICAgICBpZiAodGhpcy5fcGF1c2UpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgdGhpcy5fdGltZS5kaWZmID0gdGltZSAtIHRoaXMuX3RpbWUucHJldjtcbiAgICAgICAgdGhpcy5fdGltZS5wcmV2ID0gdGltZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMucGxheUl0ZW1zKHRpbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX2FuaW1JRCk7XG4gICAgICAgICAgICB0aGlzLl9hbmltSUQgPSAtMTtcbiAgICAgICAgICAgIHRoaXMuX3BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVwbGF5KCkge1xuICAgICAgICB0aGlzLl90aW1lLmVuZCA9IC0xO1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG4gICAgcGxheUl0ZW1zKHRpbWUpIHtcbiAgICAgICAgdGhpcy5fcGxheWluZyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLl9yZWZyZXNoKVxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICBpZiAodGhpcy5faXNSZWFkeSkge1xuICAgICAgICAgICAgZm9yIChsZXQgayBpbiB0aGlzLnBsYXllcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2tdLmFuaW1hdGUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxheWVyc1trXS5hbmltYXRlKHRpbWUsIHRoaXMuX3RpbWUuZGlmZiwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3RpbWUuZW5kID49IDAgJiYgdGltZSA+IHRoaXMuX3RpbWUuZW5kKSB7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9hbmltSUQpO1xuICAgICAgICAgICAgdGhpcy5fYW5pbUlEID0gLTE7XG4gICAgICAgICAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGF1c2UodG9nZ2xlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5fcGF1c2UgPSAodG9nZ2xlKSA/ICF0aGlzLl9wYXVzZSA6IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXN1bWUoKSB7XG4gICAgICAgIHRoaXMuX3BhdXNlID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzdG9wKHQgPSAwKSB7XG4gICAgICAgIHRoaXMuX3RpbWUuZW5kID0gdDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHBsYXlPbmNlKGR1cmF0aW9uID0gNTAwMCkge1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgdGhpcy5zdG9wKGR1cmF0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJlbmRlcihjb250ZXh0KSB7XG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJGdW5jKVxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyRnVuYyhjb250ZXh0LCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldCBjdXN0b21SZW5kZXJpbmcoZikgeyB0aGlzLl9yZW5kZXJGdW5jID0gZjsgfVxuICAgIGdldCBjdXN0b21SZW5kZXJpbmcoKSB7IHJldHVybiB0aGlzLl9yZW5kZXJGdW5jOyB9XG4gICAgZ2V0IGlzUGxheWluZygpIHsgcmV0dXJuIHRoaXMuX3BsYXlpbmc7IH1cbiAgICBnZXQgb3V0ZXJCb3VuZCgpIHsgcmV0dXJuIHRoaXMuYm91bmQuY2xvbmUoKTsgfVxuICAgIGdldCBpbm5lckJvdW5kKCkgeyByZXR1cm4gbmV3IEJvdW5kKFB0Lm1ha2UodGhpcy5zaXplLmxlbmd0aCwgMCksIHRoaXMuc2l6ZS5jbG9uZSgpKTsgfVxuICAgIGdldCBzaXplKCkgeyByZXR1cm4gdGhpcy5ib3VuZC5zaXplLmNsb25lKCk7IH1cbiAgICBnZXQgY2VudGVyKCkgeyByZXR1cm4gdGhpcy5zaXplLmRpdmlkZSgyKTsgfVxuICAgIGdldCB3aWR0aCgpIHsgcmV0dXJuIHRoaXMuYm91bmQud2lkdGg7IH1cbiAgICBnZXQgaGVpZ2h0KCkgeyByZXR1cm4gdGhpcy5ib3VuZC5oZWlnaHQ7IH1cbn1cbmV4cG9ydCBjbGFzcyBNdWx0aVRvdWNoU3BhY2UgZXh0ZW5kcyBTcGFjZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuX3ByZXNzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZHJhZ2dlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9oYXNNb3VzZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9oYXNUb3VjaCA9IGZhbHNlO1xuICAgIH1cbiAgICBnZXQgcG9pbnRlcigpIHtcbiAgICAgICAgbGV0IHAgPSB0aGlzLl9wb2ludGVyLmNsb25lKCk7XG4gICAgICAgIHAuaWQgPSB0aGlzLl9wb2ludGVyLmlkO1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgYmluZENhbnZhcyhldnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX2NhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2dCwgY2FsbGJhY2spO1xuICAgIH1cbiAgICB1bmJpbmRDYW52YXMoZXZ0LCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnQsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgYmluZE1vdXNlKF9iaW5kID0gdHJ1ZSkge1xuICAgICAgICBpZiAoX2JpbmQpIHtcbiAgICAgICAgICAgIHRoaXMuYmluZENhbnZhcyhcIm1vdXNlZG93blwiLCB0aGlzLl9tb3VzZURvd24uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmJpbmRDYW52YXMoXCJtb3VzZXVwXCIsIHRoaXMuX21vdXNlVXAuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmJpbmRDYW52YXMoXCJtb3VzZW92ZXJcIiwgdGhpcy5fbW91c2VPdmVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5iaW5kQ2FudmFzKFwibW91c2VvdXRcIiwgdGhpcy5fbW91c2VPdXQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmJpbmRDYW52YXMoXCJtb3VzZW1vdmVcIiwgdGhpcy5fbW91c2VNb3ZlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5iaW5kQ2FudmFzKFwiY29udGV4dG1lbnVcIiwgdGhpcy5fY29udGV4dE1lbnUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLl9oYXNNb3VzZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVuYmluZENhbnZhcyhcIm1vdXNlZG93blwiLCB0aGlzLl9tb3VzZURvd24uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLnVuYmluZENhbnZhcyhcIm1vdXNldXBcIiwgdGhpcy5fbW91c2VVcC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kQ2FudmFzKFwibW91c2VvdmVyXCIsIHRoaXMuX21vdXNlT3Zlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kQ2FudmFzKFwibW91c2VvdXRcIiwgdGhpcy5fbW91c2VPdXQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLnVuYmluZENhbnZhcyhcIm1vdXNlbW92ZVwiLCB0aGlzLl9tb3VzZU1vdmUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLnVuYmluZENhbnZhcyhcImNvbnRleHRtZW51XCIsIHRoaXMuX2NvbnRleHRNZW51LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5faGFzTW91c2UgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgYmluZFRvdWNoKF9iaW5kID0gdHJ1ZSkge1xuICAgICAgICBpZiAoX2JpbmQpIHtcbiAgICAgICAgICAgIHRoaXMuYmluZENhbnZhcyhcInRvdWNoc3RhcnRcIiwgdGhpcy5fdG91Y2hTdGFydC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuYmluZENhbnZhcyhcInRvdWNoZW5kXCIsIHRoaXMuX21vdXNlVXAuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmJpbmRDYW52YXMoXCJ0b3VjaG1vdmVcIiwgdGhpcy5fdG91Y2hNb3ZlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5iaW5kQ2FudmFzKFwidG91Y2hjYW5jZWxcIiwgdGhpcy5fbW91c2VPdXQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLl9oYXNUb3VjaCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVuYmluZENhbnZhcyhcInRvdWNoc3RhcnRcIiwgdGhpcy5fdG91Y2hTdGFydC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kQ2FudmFzKFwidG91Y2hlbmRcIiwgdGhpcy5fbW91c2VVcC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kQ2FudmFzKFwidG91Y2htb3ZlXCIsIHRoaXMuX3RvdWNoTW92ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kQ2FudmFzKFwidG91Y2hjYW5jZWxcIiwgdGhpcy5fbW91c2VPdXQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLl9oYXNUb3VjaCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0b3VjaGVzVG9Qb2ludHMoZXZ0LCB3aGljaCA9IFwidG91Y2hlc1wiKSB7XG4gICAgICAgIGlmICghZXZ0IHx8ICFldnRbd2hpY2hdKVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICBsZXQgdHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldnRbd2hpY2hdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdCA9IGV2dFt3aGljaF0uaXRlbShpKTtcbiAgICAgICAgICAgIHRzLnB1c2gobmV3IFB0KHQucGFnZVggLSB0aGlzLmJvdW5kLnRvcExlZnQueCwgdC5wYWdlWSAtIHRoaXMuYm91bmQudG9wTGVmdC55KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRzO1xuICAgIH1cbiAgICBfbW91c2VBY3Rpb24odHlwZSwgZXZ0KSB7XG4gICAgICAgIGxldCBweCA9IDAsIHB5ID0gMDtcbiAgICAgICAgaWYgKGV2dCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy5wbGF5ZXJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGxheWVycy5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdiA9IHRoaXMucGxheWVyc1trXTtcbiAgICAgICAgICAgICAgICAgICAgcHggPSBldnQucGFnZVggLSB0aGlzLm91dGVyQm91bmQueDtcbiAgICAgICAgICAgICAgICAgICAgcHkgPSBldnQucGFnZVkgLSB0aGlzLm91dGVyQm91bmQueTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYuYWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgdi5hY3Rpb24odHlwZSwgcHgsIHB5LCBldnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy5wbGF5ZXJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGxheWVycy5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdiA9IHRoaXMucGxheWVyc1trXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGMgPSBldnQuY2hhbmdlZFRvdWNoZXMgJiYgZXZ0LmNoYW5nZWRUb3VjaGVzLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0b3VjaCA9IGV2dC5jaGFuZ2VkVG91Y2hlcy5pdGVtKDApO1xuICAgICAgICAgICAgICAgICAgICBweCA9IChjKSA/IHRvdWNoLnBhZ2VYIC0gdGhpcy5vdXRlckJvdW5kLnggOiAwO1xuICAgICAgICAgICAgICAgICAgICBweSA9IChjKSA/IHRvdWNoLnBhZ2VZIC0gdGhpcy5vdXRlckJvdW5kLnkgOiAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAodi5hY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICB2LmFjdGlvbih0eXBlLCBweCwgcHksIGV2dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLl9wb2ludGVyLnRvKHB4LCBweSk7XG4gICAgICAgICAgICB0aGlzLl9wb2ludGVyLmlkID0gdHlwZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfbW91c2VEb3duKGV2dCkge1xuICAgICAgICB0aGlzLl9tb3VzZUFjdGlvbihVSUEuZG93biwgZXZ0KTtcbiAgICAgICAgdGhpcy5fcHJlc3NlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgX21vdXNlVXAoZXZ0KSB7XG4gICAgICAgIGlmICh0aGlzLl9kcmFnZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZUFjdGlvbihVSUEuZHJvcCwgZXZ0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlQWN0aW9uKFVJQS51cCwgZXZ0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wcmVzc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2RyYWdnZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBfbW91c2VNb3ZlKGV2dCkge1xuICAgICAgICB0aGlzLl9tb3VzZUFjdGlvbihVSUEubW92ZSwgZXZ0KTtcbiAgICAgICAgaWYgKHRoaXMuX3ByZXNzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2RyYWdnZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fbW91c2VBY3Rpb24oVUlBLmRyYWcsIGV2dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBfbW91c2VPdmVyKGV2dCkge1xuICAgICAgICB0aGlzLl9tb3VzZUFjdGlvbihVSUEub3ZlciwgZXZ0KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBfbW91c2VPdXQoZXZ0KSB7XG4gICAgICAgIHRoaXMuX21vdXNlQWN0aW9uKFVJQS5vdXQsIGV2dCk7XG4gICAgICAgIGlmICh0aGlzLl9kcmFnZ2VkKVxuICAgICAgICAgICAgdGhpcy5fbW91c2VBY3Rpb24oVUlBLmRyb3AsIGV2dCk7XG4gICAgICAgIHRoaXMuX2RyYWdnZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBfY29udGV4dE1lbnUoZXZ0KSB7XG4gICAgICAgIHRoaXMuX21vdXNlQWN0aW9uKFVJQS5jb250ZXh0bWVudSwgZXZ0KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBfdG91Y2hNb3ZlKGV2dCkge1xuICAgICAgICB0aGlzLl9tb3VzZU1vdmUoZXZ0KTtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgX3RvdWNoU3RhcnQoZXZ0KSB7XG4gICAgICAgIHRoaXMuX21vdXNlRG93bihldnQpO1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVNwYWNlLmpzLm1hcCIsIi8qISBTb3VyY2UgY29kZSBsaWNlbnNlZCB1bmRlciBBcGFjaGUgTGljZW5zZSAyLjAuIENvcHlyaWdodCDCqSAyMDE3LWN1cnJlbnQgV2lsbGlhbSBOZ2FuIGFuZCBjb250cmlidXRvcnMuIChodHRwczovL2dpdGh1Yi5jb20vd2lsbGlhbW5nYW4vcHRzKSAqL1xuaW1wb3J0IHsgVmlzdWFsRm9ybSwgRm9udCB9IGZyb20gXCIuL0Zvcm1cIjtcbmltcG9ydCB7IEdlb20gfSBmcm9tICcuL051bSc7XG5pbXBvcnQgeyBDb25zdCB9IGZyb20gJy4vVXRpbCc7XG5pbXBvcnQgeyBQdCwgR3JvdXAgfSBmcm9tICcuL1B0JztcbmltcG9ydCB7IFJlY3RhbmdsZSB9IGZyb20gXCIuL09wXCI7XG5pbXBvcnQgeyBET01TcGFjZSB9IGZyb20gXCIuL0RvbVwiO1xuZXhwb3J0IGNsYXNzIFNWR1NwYWNlIGV4dGVuZHMgRE9NU3BhY2Uge1xuICAgIGNvbnN0cnVjdG9yKGVsZW0sIGNhbGxiYWNrKSB7XG4gICAgICAgIHN1cGVyKGVsZW0sIGNhbGxiYWNrKTtcbiAgICAgICAgdGhpcy5fYmdjb2xvciA9IFwiIzk5OVwiO1xuICAgICAgICBpZiAodGhpcy5fY2FudmFzLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT0gXCJzdmdcIikge1xuICAgICAgICAgICAgbGV0IHMgPSBTVkdTcGFjZS5zdmdFbGVtZW50KHRoaXMuX2NhbnZhcywgXCJzdmdcIiwgYCR7dGhpcy5pZH1fc3ZnYCk7XG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIgPSB0aGlzLl9jYW52YXM7XG4gICAgICAgICAgICB0aGlzLl9jYW52YXMgPSBzO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldEZvcm0oKSB7IHJldHVybiBuZXcgU1ZHRm9ybSh0aGlzKTsgfVxuICAgIGdldCBlbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FudmFzO1xuICAgIH1cbiAgICByZXNpemUoYiwgZXZ0KSB7XG4gICAgICAgIHN1cGVyLnJlc2l6ZShiLCBldnQpO1xuICAgICAgICBTVkdTcGFjZS5zZXRBdHRyKHRoaXMuZWxlbWVudCwge1xuICAgICAgICAgICAgXCJ2aWV3Qm94XCI6IGAwIDAgJHt0aGlzLmJvdW5kLndpZHRofSAke3RoaXMuYm91bmQuaGVpZ2h0fWAsXG4gICAgICAgICAgICBcIndpZHRoXCI6IGAke3RoaXMuYm91bmQud2lkdGh9YCxcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IGAke3RoaXMuYm91bmQuaGVpZ2h0fWAsXG4gICAgICAgICAgICBcInhtbG5zXCI6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICAgIFwidmVyc2lvblwiOiBcIjEuMVwiXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhdGljIHN2Z0VsZW1lbnQocGFyZW50LCBuYW1lLCBpZCkge1xuICAgICAgICBpZiAoIXBhcmVudCB8fCAhcGFyZW50LmFwcGVuZENoaWxkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGFyZW50IGlzIG5vdCBhIHZhbGlkIERPTSBlbGVtZW50XCIpO1xuICAgICAgICBsZXQgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2lkfWApO1xuICAgICAgICBpZiAoIWVsZW0pIHtcbiAgICAgICAgICAgIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBuYW1lKTtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cbiAgICByZW1vdmUocGxheWVyKSB7XG4gICAgICAgIGxldCB0ZW1wID0gdGhpcy5fY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuXCIgKyBTVkdGb3JtLnNjb3BlSUQocGxheWVyKSk7XG4gICAgICAgIHRlbXAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnJlbW92ZShwbGF5ZXIpO1xuICAgIH1cbiAgICByZW1vdmVBbGwoKSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICByZXR1cm4gc3VwZXIucmVtb3ZlQWxsKCk7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFNWR0Zvcm0gZXh0ZW5kcyBWaXN1YWxGb3JtIHtcbiAgICBjb25zdHJ1Y3RvcihzcGFjZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9zdHlsZSA9IHtcbiAgICAgICAgICAgIFwiZmlsbGVkXCI6IHRydWUsXG4gICAgICAgICAgICBcInN0cm9rZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcIiNmMDNcIixcbiAgICAgICAgICAgIFwic3Ryb2tlXCI6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogMSxcbiAgICAgICAgICAgIFwic3Ryb2tlLWxpbmVqb2luXCI6IFwiYmV2ZWxcIixcbiAgICAgICAgICAgIFwic3Ryb2tlLWxpbmVjYXBcIjogXCJzcWF1cmVcIixcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiAxXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2N0eCA9IHtcbiAgICAgICAgICAgIGdyb3VwOiBudWxsLFxuICAgICAgICAgICAgZ3JvdXBJRDogXCJwdHNcIixcbiAgICAgICAgICAgIGdyb3VwQ291bnQ6IDAsXG4gICAgICAgICAgICBjdXJyZW50SUQ6IFwicHRzMFwiLFxuICAgICAgICAgICAgY3VycmVudENsYXNzOiBcIlwiLFxuICAgICAgICAgICAgc3R5bGU6IHt9LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9yZWFkeSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zcGFjZSA9IHNwYWNlO1xuICAgICAgICB0aGlzLl9zcGFjZS5hZGQoeyBzdGFydDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N0eC5ncm91cCA9IHRoaXMuX3NwYWNlLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3R4Lmdyb3VwSUQgPSBcInB0c19zdmdfXCIgKyAoU1ZHRm9ybS5ncm91cElEKyspO1xuICAgICAgICAgICAgICAgIHRoaXMuX2N0eC5zdHlsZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3N0eWxlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB9IH0pO1xuICAgIH1cbiAgICBnZXQgc3BhY2UoKSB7IHJldHVybiB0aGlzLl9zcGFjZTsgfVxuICAgIHN0eWxlVG8oaywgdikge1xuICAgICAgICBpZiAodGhpcy5fY3R4LnN0eWxlW2tdID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7a30gc3R5bGUgcHJvcGVydHkgZG9lc24ndCBleGlzdGApO1xuICAgICAgICB0aGlzLl9jdHguc3R5bGVba10gPSB2O1xuICAgIH1cbiAgICBhbHBoYShhKSB7XG4gICAgICAgIHRoaXMuc3R5bGVUbyhcIm9wYWNpdHlcIiwgYSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBmaWxsKGMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjID09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlVG8oXCJmaWxsZWRcIiwgYyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlVG8oXCJmaWxsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnN0eWxlVG8oXCJmaWxsXCIsIGMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzdHJva2UoYywgd2lkdGgsIGxpbmVqb2luLCBsaW5lY2FwKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYyA9PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgdGhpcy5zdHlsZVRvKFwic3Ryb2tlZFwiLCBjKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVUbyhcInN0cm9rZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnN0eWxlVG8oXCJzdHJva2VcIiwgYyk7XG4gICAgICAgICAgICBpZiAod2lkdGgpXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZVRvKFwic3Ryb2tlLXdpZHRoXCIsIHdpZHRoKTtcbiAgICAgICAgICAgIGlmIChsaW5lam9pbilcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlVG8oXCJzdHJva2UtbGluZWpvaW5cIiwgbGluZWpvaW4pO1xuICAgICAgICAgICAgaWYgKGxpbmVjYXApXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZVRvKFwic3Ryb2tlLWxpbmVjYXBcIiwgbGluZWNhcCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNscyhjKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYyA9PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgdGhpcy5fY3R4LmN1cnJlbnRDbGFzcyA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jdHguY3VycmVudENsYXNzID0gYztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZm9udChzaXplT3JGb250LCB3ZWlnaHQsIHN0eWxlLCBsaW5lSGVpZ2h0LCBmYW1pbHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaXplT3JGb250ID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQuc2l6ZSA9IHNpemVPckZvbnQ7XG4gICAgICAgICAgICBpZiAoZmFtaWx5KVxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnQuZmFjZSA9IGZhbWlseTtcbiAgICAgICAgICAgIGlmICh3ZWlnaHQpXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udC53ZWlnaHQgPSB3ZWlnaHQ7XG4gICAgICAgICAgICBpZiAoc3R5bGUpXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udC5zdHlsZSA9IHN0eWxlO1xuICAgICAgICAgICAgaWYgKGxpbmVIZWlnaHQpXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udC5saW5lSGVpZ2h0ID0gbGluZUhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSBzaXplT3JGb250O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2N0eC5zdHlsZVsnZm9udCddID0gdGhpcy5fZm9udC52YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl9jdHguc3R5bGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9zdHlsZSk7XG4gICAgICAgIHRoaXMuX2ZvbnQgPSBuZXcgRm9udCgxMCwgXCJzYW5zLXNlcmlmXCIpO1xuICAgICAgICB0aGlzLl9jdHguc3R5bGVbJ2ZvbnQnXSA9IHRoaXMuX2ZvbnQudmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB1cGRhdGVTY29wZShncm91cF9pZCwgZ3JvdXApIHtcbiAgICAgICAgdGhpcy5fY3R4Lmdyb3VwID0gZ3JvdXA7XG4gICAgICAgIHRoaXMuX2N0eC5ncm91cElEID0gZ3JvdXBfaWQ7XG4gICAgICAgIHRoaXMuX2N0eC5ncm91cENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5uZXh0SUQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N0eDtcbiAgICB9XG4gICAgc2NvcGUoaXRlbSkge1xuICAgICAgICBpZiAoIWl0ZW0gfHwgaXRlbS5hbmltYXRlSUQgPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIml0ZW0gbm90IGRlZmluZWQgb3Igbm90IHlldCBhZGRlZCB0byBTcGFjZVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlU2NvcGUoU1ZHRm9ybS5zY29wZUlEKGl0ZW0pLCB0aGlzLnNwYWNlLmVsZW1lbnQpO1xuICAgIH1cbiAgICBuZXh0SUQoKSB7XG4gICAgICAgIHRoaXMuX2N0eC5ncm91cENvdW50Kys7XG4gICAgICAgIHRoaXMuX2N0eC5jdXJyZW50SUQgPSBgJHt0aGlzLl9jdHguZ3JvdXBJRH0tJHt0aGlzLl9jdHguZ3JvdXBDb3VudH1gO1xuICAgICAgICByZXR1cm4gdGhpcy5fY3R4LmN1cnJlbnRJRDtcbiAgICB9XG4gICAgc3RhdGljIGdldElEKGN0eCkge1xuICAgICAgICByZXR1cm4gY3R4LmN1cnJlbnRJRCB8fCBgcC0ke1NWR0Zvcm0uZG9tSUQrK31gO1xuICAgIH1cbiAgICBzdGF0aWMgc2NvcGVJRChpdGVtKSB7XG4gICAgICAgIHJldHVybiBgaXRlbS0ke2l0ZW0uYW5pbWF0ZUlEfWA7XG4gICAgfVxuICAgIHN0YXRpYyBzdHlsZShlbGVtLCBzdHlsZXMpIHtcbiAgICAgICAgbGV0IHN0ID0gW107XG4gICAgICAgIGlmICghc3R5bGVzW1wiZmlsbGVkXCJdKVxuICAgICAgICAgICAgc3QucHVzaChcImZpbGw6IG5vbmVcIik7XG4gICAgICAgIGlmICghc3R5bGVzW1wic3Ryb2tlZFwiXSlcbiAgICAgICAgICAgIHN0LnB1c2goXCJzdHJva2U6IG5vbmVcIik7XG4gICAgICAgIGZvciAobGV0IGsgaW4gc3R5bGVzKSB7XG4gICAgICAgICAgICBpZiAoc3R5bGVzLmhhc093blByb3BlcnR5KGspICYmIGsgIT0gXCJmaWxsZWRcIiAmJiBrICE9IFwic3Ryb2tlZFwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IHYgPSBzdHlsZXNba107XG4gICAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHlsZXNbXCJmaWxsZWRcIl0gJiYgay5pbmRleE9mKCdmaWxsJykgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFzdHlsZXNbXCJzdHJva2VkXCJdICYmIGsuaW5kZXhPZignc3Ryb2tlJykgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3QucHVzaChgJHtrfTogJHt2fWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBET01TcGFjZS5zZXRBdHRyKGVsZW0sIHsgc3R5bGU6IHN0LmpvaW4oXCI7XCIpIH0pO1xuICAgIH1cbiAgICBzdGF0aWMgcG9pbnQoY3R4LCBwdCwgcmFkaXVzID0gNSwgc2hhcGUgPSBcInNxdWFyZVwiKSB7XG4gICAgICAgIGlmIChzaGFwZSA9PT0gXCJjaXJjbGVcIikge1xuICAgICAgICAgICAgcmV0dXJuIFNWR0Zvcm0uY2lyY2xlKGN0eCwgcHQsIHJhZGl1cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gU1ZHRm9ybS5zcXVhcmUoY3R4LCBwdCwgcmFkaXVzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwb2ludChwdCwgcmFkaXVzID0gNSwgc2hhcGUgPSBcInNxdWFyZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dElEKCk7XG4gICAgICAgIFNWR0Zvcm0ucG9pbnQodGhpcy5fY3R4LCBwdCwgcmFkaXVzLCBzaGFwZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzdGF0aWMgY2lyY2xlKGN0eCwgcHQsIHJhZGl1cyA9IDEwKSB7XG4gICAgICAgIGxldCBlbGVtID0gU1ZHU3BhY2Uuc3ZnRWxlbWVudChjdHguZ3JvdXAsIFwiY2lyY2xlXCIsIFNWR0Zvcm0uZ2V0SUQoY3R4KSk7XG4gICAgICAgIERPTVNwYWNlLnNldEF0dHIoZWxlbSwge1xuICAgICAgICAgICAgY3g6IHB0WzBdLFxuICAgICAgICAgICAgY3k6IHB0WzFdLFxuICAgICAgICAgICAgcjogcmFkaXVzLFxuICAgICAgICAgICAgJ2NsYXNzJzogYHB0cy1zdmdmb3JtIHB0cy1jaXJjbGUgJHtjdHguY3VycmVudENsYXNzfWAsXG4gICAgICAgIH0pO1xuICAgICAgICBTVkdGb3JtLnN0eWxlKGVsZW0sIGN0eC5zdHlsZSk7XG4gICAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cbiAgICBjaXJjbGUocHRzKSB7XG4gICAgICAgIHRoaXMubmV4dElEKCk7XG4gICAgICAgIFNWR0Zvcm0uY2lyY2xlKHRoaXMuX2N0eCwgcHRzWzBdLCBwdHNbMV1bMF0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhdGljIGFyYyhjdHgsIHB0LCByYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBjYykge1xuICAgICAgICBsZXQgZWxlbSA9IFNWR1NwYWNlLnN2Z0VsZW1lbnQoY3R4Lmdyb3VwLCBcInBhdGhcIiwgU1ZHRm9ybS5nZXRJRChjdHgpKTtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBuZXcgUHQocHQpLnRvQW5nbGUoc3RhcnRBbmdsZSwgcmFkaXVzLCB0cnVlKTtcbiAgICAgICAgY29uc3QgZW5kID0gbmV3IFB0KHB0KS50b0FuZ2xlKGVuZEFuZ2xlLCByYWRpdXMsIHRydWUpO1xuICAgICAgICBjb25zdCBkaWZmID0gR2VvbS5ib3VuZEFuZ2xlKGVuZEFuZ2xlKSAtIEdlb20uYm91bmRBbmdsZShzdGFydEFuZ2xlKTtcbiAgICAgICAgbGV0IGxhcmdlQXJjID0gKGRpZmYgPiBDb25zdC5waSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIGlmIChjYylcbiAgICAgICAgICAgIGxhcmdlQXJjID0gIWxhcmdlQXJjO1xuICAgICAgICBjb25zdCBzd2VlcCA9IChjYykgPyBcIjBcIiA6IFwiMVwiO1xuICAgICAgICBjb25zdCBkID0gYE0gJHtzdGFydFswXX0gJHtzdGFydFsxXX0gQSAke3JhZGl1c30gJHtyYWRpdXN9IDAgJHtsYXJnZUFyYyA/IFwiMVwiIDogXCIwXCJ9ICR7c3dlZXB9ICR7ZW5kWzBdfSAke2VuZFsxXX1gO1xuICAgICAgICBET01TcGFjZS5zZXRBdHRyKGVsZW0sIHtcbiAgICAgICAgICAgIGQ6IGQsXG4gICAgICAgICAgICAnY2xhc3MnOiBgcHRzLXN2Z2Zvcm0gcHRzLWFyYyAke2N0eC5jdXJyZW50Q2xhc3N9YCxcbiAgICAgICAgfSk7XG4gICAgICAgIFNWR0Zvcm0uc3R5bGUoZWxlbSwgY3R4LnN0eWxlKTtcbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICAgIGFyYyhwdCwgcmFkaXVzLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgY2MpIHtcbiAgICAgICAgdGhpcy5uZXh0SUQoKTtcbiAgICAgICAgU1ZHRm9ybS5hcmModGhpcy5fY3R4LCBwdCwgcmFkaXVzLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgY2MpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhdGljIHNxdWFyZShjdHgsIHB0LCBoYWxmc2l6ZSkge1xuICAgICAgICBsZXQgZWxlbSA9IFNWR1NwYWNlLnN2Z0VsZW1lbnQoY3R4Lmdyb3VwLCBcInJlY3RcIiwgU1ZHRm9ybS5nZXRJRChjdHgpKTtcbiAgICAgICAgRE9NU3BhY2Uuc2V0QXR0cihlbGVtLCB7XG4gICAgICAgICAgICB4OiBwdFswXSAtIGhhbGZzaXplLFxuICAgICAgICAgICAgeTogcHRbMV0gLSBoYWxmc2l6ZSxcbiAgICAgICAgICAgIHdpZHRoOiBoYWxmc2l6ZSAqIDIsXG4gICAgICAgICAgICBoZWlnaHQ6IGhhbGZzaXplICogMixcbiAgICAgICAgICAgICdjbGFzcyc6IGBwdHMtc3ZnZm9ybSBwdHMtc3F1YXJlICR7Y3R4LmN1cnJlbnRDbGFzc31gLFxuICAgICAgICB9KTtcbiAgICAgICAgU1ZHRm9ybS5zdHlsZShlbGVtLCBjdHguc3R5bGUpO1xuICAgICAgICByZXR1cm4gZWxlbTtcbiAgICB9XG4gICAgc3F1YXJlKHB0LCBoYWxmc2l6ZSkge1xuICAgICAgICB0aGlzLm5leHRJRCgpO1xuICAgICAgICBTVkdGb3JtLnNxdWFyZSh0aGlzLl9jdHgsIHB0LCBoYWxmc2l6ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzdGF0aWMgbGluZShjdHgsIHB0cykge1xuICAgICAgICBpZiAoIXRoaXMuX2NoZWNrU2l6ZShwdHMpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAocHRzLmxlbmd0aCA+IDIpXG4gICAgICAgICAgICByZXR1cm4gU1ZHRm9ybS5fcG9seShjdHgsIHB0cywgZmFsc2UpO1xuICAgICAgICBsZXQgZWxlbSA9IFNWR1NwYWNlLnN2Z0VsZW1lbnQoY3R4Lmdyb3VwLCBcImxpbmVcIiwgU1ZHRm9ybS5nZXRJRChjdHgpKTtcbiAgICAgICAgRE9NU3BhY2Uuc2V0QXR0cihlbGVtLCB7XG4gICAgICAgICAgICB4MTogcHRzWzBdWzBdLFxuICAgICAgICAgICAgeTE6IHB0c1swXVsxXSxcbiAgICAgICAgICAgIHgyOiBwdHNbMV1bMF0sXG4gICAgICAgICAgICB5MjogcHRzWzFdWzFdLFxuICAgICAgICAgICAgJ2NsYXNzJzogYHB0cy1zdmdmb3JtIHB0cy1saW5lICR7Y3R4LmN1cnJlbnRDbGFzc31gLFxuICAgICAgICB9KTtcbiAgICAgICAgU1ZHRm9ybS5zdHlsZShlbGVtLCBjdHguc3R5bGUpO1xuICAgICAgICByZXR1cm4gZWxlbTtcbiAgICB9XG4gICAgbGluZShwdHMpIHtcbiAgICAgICAgdGhpcy5uZXh0SUQoKTtcbiAgICAgICAgU1ZHRm9ybS5saW5lKHRoaXMuX2N0eCwgcHRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0YXRpYyBfcG9seShjdHgsIHB0cywgY2xvc2VQYXRoID0gdHJ1ZSkge1xuICAgICAgICBpZiAoIXRoaXMuX2NoZWNrU2l6ZShwdHMpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsZXQgZWxlbSA9IFNWR1NwYWNlLnN2Z0VsZW1lbnQoY3R4Lmdyb3VwLCAoKGNsb3NlUGF0aCkgPyBcInBvbHlnb25cIiA6IFwicG9seWxpbmVcIiksIFNWR0Zvcm0uZ2V0SUQoY3R4KSk7XG4gICAgICAgIGxldCBwb2ludHMgPSBwdHMucmVkdWNlKChhLCBwKSA9PiBhICsgYCR7cFswXX0sJHtwWzFdfSBgLCBcIlwiKTtcbiAgICAgICAgRE9NU3BhY2Uuc2V0QXR0cihlbGVtLCB7XG4gICAgICAgICAgICBwb2ludHM6IHBvaW50cyxcbiAgICAgICAgICAgICdjbGFzcyc6IGBwdHMtc3ZnZm9ybSBwdHMtcG9seWdvbiAke2N0eC5jdXJyZW50Q2xhc3N9YCxcbiAgICAgICAgfSk7XG4gICAgICAgIFNWR0Zvcm0uc3R5bGUoZWxlbSwgY3R4LnN0eWxlKTtcbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICAgIHN0YXRpYyBwb2x5Z29uKGN0eCwgcHRzKSB7XG4gICAgICAgIHJldHVybiBTVkdGb3JtLl9wb2x5KGN0eCwgcHRzLCB0cnVlKTtcbiAgICB9XG4gICAgcG9seWdvbihwdHMpIHtcbiAgICAgICAgdGhpcy5uZXh0SUQoKTtcbiAgICAgICAgU1ZHRm9ybS5wb2x5Z29uKHRoaXMuX2N0eCwgcHRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0YXRpYyByZWN0KGN0eCwgcHRzKSB7XG4gICAgICAgIGlmICghdGhpcy5fY2hlY2tTaXplKHB0cykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGxldCBlbGVtID0gU1ZHU3BhY2Uuc3ZnRWxlbWVudChjdHguZ3JvdXAsIFwicmVjdFwiLCBTVkdGb3JtLmdldElEKGN0eCkpO1xuICAgICAgICBsZXQgYm91bmQgPSBHcm91cC5mcm9tQXJyYXkocHRzKS5ib3VuZGluZ0JveCgpO1xuICAgICAgICBsZXQgc2l6ZSA9IFJlY3RhbmdsZS5zaXplKGJvdW5kKTtcbiAgICAgICAgRE9NU3BhY2Uuc2V0QXR0cihlbGVtLCB7XG4gICAgICAgICAgICB4OiBib3VuZFswXVswXSxcbiAgICAgICAgICAgIHk6IGJvdW5kWzBdWzFdLFxuICAgICAgICAgICAgd2lkdGg6IHNpemVbMF0sXG4gICAgICAgICAgICBoZWlnaHQ6IHNpemVbMV0sXG4gICAgICAgICAgICAnY2xhc3MnOiBgcHRzLXN2Z2Zvcm0gcHRzLXJlY3QgJHtjdHguY3VycmVudENsYXNzfWAsXG4gICAgICAgIH0pO1xuICAgICAgICBTVkdGb3JtLnN0eWxlKGVsZW0sIGN0eC5zdHlsZSk7XG4gICAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cbiAgICByZWN0KHB0cykge1xuICAgICAgICB0aGlzLm5leHRJRCgpO1xuICAgICAgICBTVkdGb3JtLnJlY3QodGhpcy5fY3R4LCBwdHMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhdGljIHRleHQoY3R4LCBwdCwgdHh0KSB7XG4gICAgICAgIGxldCBlbGVtID0gU1ZHU3BhY2Uuc3ZnRWxlbWVudChjdHguZ3JvdXAsIFwidGV4dFwiLCBTVkdGb3JtLmdldElEKGN0eCkpO1xuICAgICAgICBET01TcGFjZS5zZXRBdHRyKGVsZW0sIHtcbiAgICAgICAgICAgIFwicG9pbnRlci1ldmVudHNcIjogXCJub25lXCIsXG4gICAgICAgICAgICB4OiBwdFswXSxcbiAgICAgICAgICAgIHk6IHB0WzFdLFxuICAgICAgICAgICAgZHg6IDAsIGR5OiAwLFxuICAgICAgICAgICAgJ2NsYXNzJzogYHB0cy1zdmdmb3JtIHB0cy10ZXh0ICR7Y3R4LmN1cnJlbnRDbGFzc31gLFxuICAgICAgICB9KTtcbiAgICAgICAgZWxlbS50ZXh0Q29udGVudCA9IHR4dDtcbiAgICAgICAgU1ZHRm9ybS5zdHlsZShlbGVtLCBjdHguc3R5bGUpO1xuICAgICAgICByZXR1cm4gZWxlbTtcbiAgICB9XG4gICAgdGV4dChwdCwgdHh0KSB7XG4gICAgICAgIHRoaXMubmV4dElEKCk7XG4gICAgICAgIFNWR0Zvcm0udGV4dCh0aGlzLl9jdHgsIHB0LCB0eHQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgbG9nKHR4dCkge1xuICAgICAgICB0aGlzLmZpbGwoXCIjMDAwXCIpLnN0cm9rZShcIiNmZmZcIiwgMC41KS50ZXh0KFsxMCwgMTRdLCB0eHQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5TVkdGb3JtLmdyb3VwSUQgPSAwO1xuU1ZHRm9ybS5kb21JRCA9IDA7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdmcuanMubWFwIiwiLyohIFNvdXJjZSBjb2RlIGxpY2Vuc2VkIHVuZGVyIEFwYWNoZSBMaWNlbnNlIDIuMC4gQ29weXJpZ2h0IMKpIDIwMTctY3VycmVudCBXaWxsaWFtIE5nYW4gYW5kIGNvbnRyaWJ1dG9ycy4gKGh0dHBzOi8vZ2l0aHViLmNvbS93aWxsaWFtbmdhbi9wdHMpICovXG5pbXBvcnQgeyBQdCB9IGZyb20gXCIuL1B0XCI7XG5leHBvcnQgY2xhc3MgVHlwb2dyYXBoeSB7XG4gICAgc3RhdGljIHRleHRXaWR0aEVzdGltYXRvcihmbiwgc2FtcGxlcyA9IFtcIk1cIiwgXCJuXCIsIFwiLlwiXSwgZGlzdHJpYnV0aW9uID0gWzAuMDYsIDAuOCwgMC4xNF0pIHtcbiAgICAgICAgbGV0IG0gPSBzYW1wbGVzLm1hcChmbik7XG4gICAgICAgIGxldCBhdmcgPSBuZXcgUHQoZGlzdHJpYnV0aW9uKS5kb3QobSk7XG4gICAgICAgIHJldHVybiAoc3RyKSA9PiBzdHIubGVuZ3RoICogYXZnO1xuICAgIH1cbiAgICBzdGF0aWMgdHJ1bmNhdGUoZm4sIHN0ciwgd2lkdGgsIHRhaWwgPSBcIlwiKSB7XG4gICAgICAgIGxldCB0cmltID0gTWF0aC5mbG9vcihzdHIubGVuZ3RoICogTWF0aC5taW4oMSwgd2lkdGggLyBmbihzdHIpKSk7XG4gICAgICAgIGlmICh0cmltIDwgc3RyLmxlbmd0aCkge1xuICAgICAgICAgICAgdHJpbSA9IE1hdGgubWF4KDAsIHRyaW0gLSB0YWlsLmxlbmd0aCk7XG4gICAgICAgICAgICByZXR1cm4gW3N0ci5zdWJzdHIoMCwgdHJpbSkgKyB0YWlsLCB0cmltXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbc3RyLCBzdHIubGVuZ3RoXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgZm9udFNpemVUb0JveChib3gsIHJhdGlvID0gMSwgYnlIZWlnaHQgPSB0cnVlKSB7XG4gICAgICAgIGxldCBpID0gYnlIZWlnaHQgPyAxIDogMDtcbiAgICAgICAgbGV0IGggPSAoYm94WzFdW2ldIC0gYm94WzBdW2ldKTtcbiAgICAgICAgbGV0IGYgPSByYXRpbyAqIGg7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgbGV0IG5oID0gKGJbMV1baV0gLSBiWzBdW2ldKSAvIGg7XG4gICAgICAgICAgICByZXR1cm4gZiAqIG5oO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBzdGF0aWMgZm9udFNpemVUb1RocmVzaG9sZCh0aHJlc2hvbGQsIGRpcmVjdGlvbiA9IDApIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkZWZhdWx0U2l6ZSwgdmFsKSB7XG4gICAgICAgICAgICBsZXQgZCA9IGRlZmF1bHRTaXplICogdmFsIC8gdGhyZXNob2xkO1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA8IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgubWluKGQsIGRlZmF1bHRTaXplKTtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLm1heChkLCBkZWZhdWx0U2l6ZSk7XG4gICAgICAgICAgICByZXR1cm4gZDtcbiAgICAgICAgfTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1UeXBvZ3JhcGh5LmpzLm1hcCIsIi8qISBTb3VyY2UgY29kZSBsaWNlbnNlZCB1bmRlciBBcGFjaGUgTGljZW5zZSAyLjAuIENvcHlyaWdodCDCqSAyMDE3LWN1cnJlbnQgV2lsbGlhbSBOZ2FuIGFuZCBjb250cmlidXRvcnMuIChodHRwczovL2dpdGh1Yi5jb20vd2lsbGlhbW5nYW4vcHRzKSAqL1xuaW1wb3J0IHsgUHQsIEdyb3VwIH0gZnJvbSBcIi4vUHRcIjtcbmltcG9ydCB7IFJlY3RhbmdsZSwgQ2lyY2xlLCBQb2x5Z29uIH0gZnJvbSBcIi4vT3BcIjtcbmV4cG9ydCBjb25zdCBVSVNoYXBlID0ge1xuICAgIHJlY3RhbmdsZTogXCJyZWN0YW5nbGVcIiwgY2lyY2xlOiBcImNpcmNsZVwiLCBwb2x5Z29uOiBcInBvbHlnb25cIiwgcG9seWxpbmU6IFwicG9seWxpbmVcIiwgbGluZTogXCJsaW5lXCJcbn07XG5leHBvcnQgY29uc3QgVUlQb2ludGVyQWN0aW9ucyA9IHtcbiAgICB1cDogXCJ1cFwiLCBkb3duOiBcImRvd25cIiwgbW92ZTogXCJtb3ZlXCIsIGRyYWc6IFwiZHJhZ1wiLCB1aWRyYWc6IFwidWlkcmFnXCIsIGRyb3A6IFwiZHJvcFwiLCB1aWRyb3A6IFwidWlkcm9wXCIsIG92ZXI6IFwib3ZlclwiLCBvdXQ6IFwib3V0XCIsIGVudGVyOiBcImVudGVyXCIsIGxlYXZlOiBcImxlYXZlXCIsIGNvbnRleHRtZW51OiBcImNvbnRleHRtZW51XCIsIGFsbDogXCJhbGxcIlxufTtcbmV4cG9ydCBjbGFzcyBVSSB7XG4gICAgY29uc3RydWN0b3IoZ3JvdXAsIHNoYXBlLCBzdGF0ZXMgPSB7fSwgaWQpIHtcbiAgICAgICAgdGhpcy5faG9sZHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX2dyb3VwID0gR3JvdXAuZnJvbUFycmF5KGdyb3VwKTtcbiAgICAgICAgdGhpcy5fc2hhcGUgPSBzaGFwZTtcbiAgICAgICAgdGhpcy5faWQgPSBpZCA9PT0gdW5kZWZpbmVkID8gYHVpXyR7KFVJLl9jb3VudGVyKyspfWAgOiBpZDtcbiAgICAgICAgdGhpcy5fc3RhdGVzID0gc3RhdGVzO1xuICAgICAgICB0aGlzLl9hY3Rpb25zID0ge307XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tUmVjdGFuZ2xlKGdyb3VwLCBzdGF0ZXMsIGlkKSB7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcyhncm91cCwgVUlTaGFwZS5yZWN0YW5nbGUsIHN0YXRlcywgaWQpO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbUNpcmNsZShncm91cCwgc3RhdGVzLCBpZCkge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMoZ3JvdXAsIFVJU2hhcGUuY2lyY2xlLCBzdGF0ZXMsIGlkKTtcbiAgICB9XG4gICAgc3RhdGljIGZyb21Qb2x5Z29uKGdyb3VwLCBzdGF0ZXMsIGlkKSB7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcyhncm91cCwgVUlTaGFwZS5wb2x5Z29uLCBzdGF0ZXMsIGlkKTtcbiAgICB9XG4gICAgc3RhdGljIGZyb21VSSh1aSwgc3RhdGVzLCBpZCkge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXModWkuZ3JvdXAsIHVpLnNoYXBlLCBzdGF0ZXMgfHwgdWkuX3N0YXRlcywgaWQpO1xuICAgIH1cbiAgICBnZXQgaWQoKSB7IHJldHVybiB0aGlzLl9pZDsgfVxuICAgIHNldCBpZChkKSB7IHRoaXMuX2lkID0gZDsgfVxuICAgIGdldCBncm91cCgpIHsgcmV0dXJuIHRoaXMuX2dyb3VwOyB9XG4gICAgc2V0IGdyb3VwKGQpIHsgdGhpcy5fZ3JvdXAgPSBkOyB9XG4gICAgZ2V0IHNoYXBlKCkgeyByZXR1cm4gdGhpcy5fc2hhcGU7IH1cbiAgICBzZXQgc2hhcGUoZCkgeyB0aGlzLl9zaGFwZSA9IGQ7IH1cbiAgICBzdGF0ZShrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICgha2V5KVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZXNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlc1trZXldO1xuICAgIH1cbiAgICBvbih0eXBlLCBmbikge1xuICAgICAgICBpZiAoIXRoaXMuX2FjdGlvbnNbdHlwZV0pXG4gICAgICAgICAgICB0aGlzLl9hY3Rpb25zW3R5cGVdID0gW107XG4gICAgICAgIHJldHVybiBVSS5fYWRkSGFuZGxlcih0aGlzLl9hY3Rpb25zW3R5cGVdLCBmbik7XG4gICAgfVxuICAgIG9mZih0eXBlLCB3aGljaCkge1xuICAgICAgICBpZiAoIXRoaXMuX2FjdGlvbnNbdHlwZV0pXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh3aGljaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fYWN0aW9uc1t0eXBlXTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFVJLl9yZW1vdmVIYW5kbGVyKHRoaXMuX2FjdGlvbnNbdHlwZV0sIHdoaWNoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsaXN0ZW4odHlwZSwgcCwgZXZ0KSB7XG4gICAgICAgIGlmICh0aGlzLl9hY3Rpb25zW3R5cGVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl93aXRoaW4ocCkgfHwgQXJyYXkuZnJvbSh0aGlzLl9ob2xkcy52YWx1ZXMoKSkuaW5kZXhPZih0eXBlKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgVUkuX3RyaWdnZXIodGhpcy5fYWN0aW9uc1t0eXBlXSwgdGhpcywgcCwgdHlwZSwgZXZ0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX2FjdGlvbnNbJ2FsbCddKSB7XG4gICAgICAgICAgICAgICAgVUkuX3RyaWdnZXIodGhpcy5fYWN0aW9uc1snYWxsJ10sIHRoaXMsIHAsIHR5cGUsIGV2dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBob2xkKHR5cGUpIHtcbiAgICAgICAgbGV0IG5ld0tleSA9IE1hdGgubWF4KDAsIC4uLkFycmF5LmZyb20odGhpcy5faG9sZHMua2V5cygpKSkgKyAxO1xuICAgICAgICB0aGlzLl9ob2xkcy5zZXQobmV3S2V5LCB0eXBlKTtcbiAgICAgICAgcmV0dXJuIG5ld0tleTtcbiAgICB9XG4gICAgdW5ob2xkKGtleSkge1xuICAgICAgICBpZiAoa2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2hvbGRzLmRlbGV0ZShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faG9sZHMuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgdHJhY2sodWlzLCB0eXBlLCBwLCBldnQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHVpcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdWlzW2ldLmxpc3Rlbih0eXBlLCBwLCBldnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcihmbikge1xuICAgICAgICBmbih0aGlzLl9ncm91cCwgdGhpcy5fc3RhdGVzKTtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBgVUkgJHt0aGlzLmdyb3VwLnRvU3RyaW5nfWA7XG4gICAgfVxuICAgIF93aXRoaW4ocCkge1xuICAgICAgICBsZXQgZm4gPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5fc2hhcGUgPT09IFVJU2hhcGUucmVjdGFuZ2xlKSB7XG4gICAgICAgICAgICBmbiA9IFJlY3RhbmdsZS53aXRoaW5Cb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9zaGFwZSA9PT0gVUlTaGFwZS5jaXJjbGUpIHtcbiAgICAgICAgICAgIGZuID0gQ2lyY2xlLndpdGhpbkJvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3NoYXBlID09PSBVSVNoYXBlLnBvbHlnb24pIHtcbiAgICAgICAgICAgIGZuID0gUG9seWdvbi5oYXNJbnRlcnNlY3RQb2ludDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm4odGhpcy5fZ3JvdXAsIHApO1xuICAgIH1cbiAgICBzdGF0aWMgX3RyaWdnZXIoZm5zLCB0YXJnZXQsIHB0LCB0eXBlLCBldnQpIHtcbiAgICAgICAgaWYgKGZucykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGZucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChmbnNbaV0pXG4gICAgICAgICAgICAgICAgICAgIGZuc1tpXSh0YXJnZXQsIHB0LCB0eXBlLCBldnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBfYWRkSGFuZGxlcihmbnMsIGZuKSB7XG4gICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgZm5zLnB1c2goZm4pO1xuICAgICAgICAgICAgcmV0dXJuIGZucy5sZW5ndGggLSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBfcmVtb3ZlSGFuZGxlcihmbnMsIGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDwgZm5zLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IHRlbXAgPSBmbnMubGVuZ3RoO1xuICAgICAgICAgICAgZm5zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICByZXR1cm4gKHRlbXAgPiBmbnMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblVJLl9jb3VudGVyID0gMDtcbmV4cG9ydCBjbGFzcyBVSUJ1dHRvbiBleHRlbmRzIFVJIHtcbiAgICBjb25zdHJ1Y3Rvcihncm91cCwgc2hhcGUsIHN0YXRlcyA9IHt9LCBpZCkge1xuICAgICAgICBzdXBlcihncm91cCwgc2hhcGUsIHN0YXRlcywgaWQpO1xuICAgICAgICB0aGlzLl9ob3ZlcklEID0gLTE7XG4gICAgICAgIGlmIChzdGF0ZXMuaG92ZXIgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlc1snaG92ZXInXSA9IGZhbHNlO1xuICAgICAgICBpZiAoc3RhdGVzLmNsaWNrcyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5fc3RhdGVzWydjbGlja3MnXSA9IDA7XG4gICAgICAgIGNvbnN0IFVBID0gVUlQb2ludGVyQWN0aW9ucztcbiAgICAgICAgdGhpcy5vbihVQS51cCwgKHRhcmdldCwgcHQsIHR5cGUsIGV2dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSgnY2xpY2tzJywgdGhpcy5fc3RhdGVzLmNsaWNrcyArIDEpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbihVQS5tb3ZlLCAodGFyZ2V0LCBwdCwgdHlwZSwgZXZ0KSA9PiB7XG4gICAgICAgICAgICBsZXQgaG92ZXIgPSB0aGlzLl93aXRoaW4ocHQpO1xuICAgICAgICAgICAgaWYgKGhvdmVyICYmICF0aGlzLl9zdGF0ZXMuaG92ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlKCdob3ZlcicsIHRydWUpO1xuICAgICAgICAgICAgICAgIFVJLl90cmlnZ2VyKHRoaXMuX2FjdGlvbnNbVUEuZW50ZXJdLCB0aGlzLCBwdCwgVUEuZW50ZXIsIGV2dCk7XG4gICAgICAgICAgICAgICAgdmFyIF9jYXBJRCA9IHRoaXMuaG9sZChVQS5tb3ZlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9ob3ZlcklEID0gdGhpcy5vbihVQS5tb3ZlLCAodCwgcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3dpdGhpbihwKSAmJiAhdGhpcy5zdGF0ZSgnZHJhZ2dpbmcnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSgnaG92ZXInLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBVSS5fdHJpZ2dlcih0aGlzLl9hY3Rpb25zW1VBLmxlYXZlXSwgdGhpcywgcHQsIFVBLmxlYXZlLCBldnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vZmYoVUEubW92ZSwgdGhpcy5faG92ZXJJRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuaG9sZChfY2FwSUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbkNsaWNrKGZuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uKFVJUG9pbnRlckFjdGlvbnMudXAsIGZuKTtcbiAgICB9XG4gICAgb2ZmQ2xpY2soaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2ZmKFVJUG9pbnRlckFjdGlvbnMudXAsIGlkKTtcbiAgICB9XG4gICAgb25Db250ZXh0TWVudShmbikge1xuICAgICAgICByZXR1cm4gdGhpcy5vbihVSVBvaW50ZXJBY3Rpb25zLmNvbnRleHRtZW51LCBmbik7XG4gICAgfVxuICAgIG9mZkNvbnRleHRNZW51KGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9mZihVSVBvaW50ZXJBY3Rpb25zLmNvbnRleHRtZW51LCBpZCk7XG4gICAgfVxuICAgIG9uSG92ZXIoZW50ZXIsIGxlYXZlKSB7XG4gICAgICAgIHZhciBpZHMgPSBbdW5kZWZpbmVkLCB1bmRlZmluZWRdO1xuICAgICAgICBpZiAoZW50ZXIpXG4gICAgICAgICAgICBpZHNbMF0gPSB0aGlzLm9uKFVJUG9pbnRlckFjdGlvbnMuZW50ZXIsIGVudGVyKTtcbiAgICAgICAgaWYgKGxlYXZlKVxuICAgICAgICAgICAgaWRzWzFdID0gdGhpcy5vbihVSVBvaW50ZXJBY3Rpb25zLmxlYXZlLCBsZWF2ZSk7XG4gICAgICAgIHJldHVybiBpZHM7XG4gICAgfVxuICAgIG9mZkhvdmVyKGVudGVySUQsIGxlYXZlSUQpIHtcbiAgICAgICAgdmFyIHMgPSBbZmFsc2UsIGZhbHNlXTtcbiAgICAgICAgaWYgKGVudGVySUQgPT09IHVuZGVmaW5lZCB8fCBlbnRlcklEID49IDApXG4gICAgICAgICAgICBzWzBdID0gdGhpcy5vZmYoVUlQb2ludGVyQWN0aW9ucy5lbnRlciwgZW50ZXJJRCk7XG4gICAgICAgIGlmIChsZWF2ZUlEID09PSB1bmRlZmluZWQgfHwgbGVhdmVJRCA+PSAwKVxuICAgICAgICAgICAgc1sxXSA9IHRoaXMub2ZmKFVJUG9pbnRlckFjdGlvbnMubGVhdmUsIGxlYXZlSUQpO1xuICAgICAgICByZXR1cm4gcztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgVUlEcmFnZ2VyIGV4dGVuZHMgVUlCdXR0b24ge1xuICAgIGNvbnN0cnVjdG9yKGdyb3VwLCBzaGFwZSwgc3RhdGVzID0ge30sIGlkKSB7XG4gICAgICAgIHN1cGVyKGdyb3VwLCBzaGFwZSwgc3RhdGVzLCBpZCk7XG4gICAgICAgIHRoaXMuX2RyYWdnaW5nSUQgPSAtMTtcbiAgICAgICAgdGhpcy5fbW92ZUhvbGRJRCA9IC0xO1xuICAgICAgICB0aGlzLl9kcm9wSG9sZElEID0gLTE7XG4gICAgICAgIHRoaXMuX3VwSG9sZElEID0gLTE7XG4gICAgICAgIGlmIChzdGF0ZXMuZHJhZ2dpbmcgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlc1snZHJhZ2dpbmcnXSA9IGZhbHNlO1xuICAgICAgICBpZiAoc3RhdGVzLm1vdmVkID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZXNbJ21vdmVkJ10gPSBmYWxzZTtcbiAgICAgICAgaWYgKHN0YXRlcy5vZmZzZXQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlc1snb2Zmc2V0J10gPSBuZXcgUHQoKTtcbiAgICAgICAgY29uc3QgVUEgPSBVSVBvaW50ZXJBY3Rpb25zO1xuICAgICAgICB0aGlzLm9uKFVBLmRvd24sICh0YXJnZXQsIHB0LCB0eXBlLCBldnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb3ZlSG9sZElEID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUoJ2RyYWdnaW5nJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSgnb2Zmc2V0JywgbmV3IFB0KHB0KS5zdWJ0cmFjdCh0YXJnZXQuZ3JvdXBbMF0pKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3ZlSG9sZElEID0gdGhpcy5ob2xkKFVBLm1vdmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2Ryb3BIb2xkSUQgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZHJvcEhvbGRJRCA9IHRoaXMuaG9sZChVQS5kcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl91cEhvbGRJRCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cEhvbGRJRCA9IHRoaXMuaG9sZChVQS51cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fZHJhZ2dpbmdJRCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kcmFnZ2luZ0lEID0gdGhpcy5vbihVQS5tb3ZlLCAodCwgcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSgnZHJhZ2dpbmcnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVUkuX3RyaWdnZXIodGhpcy5fYWN0aW9uc1tVQS51aWRyYWddLCB0LCBwLCBVQS51aWRyYWcsIGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlKCdtb3ZlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBlbmREcmFnID0gKHRhcmdldCwgcHQsIHR5cGUsIGV2dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSgnZHJhZ2dpbmcnLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLm9mZihVQS5tb3ZlLCB0aGlzLl9kcmFnZ2luZ0lEKTtcbiAgICAgICAgICAgIHRoaXMuX2RyYWdnaW5nSUQgPSAtMTtcbiAgICAgICAgICAgIHRoaXMudW5ob2xkKHRoaXMuX21vdmVIb2xkSUQpO1xuICAgICAgICAgICAgdGhpcy5fbW92ZUhvbGRJRCA9IC0xO1xuICAgICAgICAgICAgdGhpcy51bmhvbGQodGhpcy5fZHJvcEhvbGRJRCk7XG4gICAgICAgICAgICB0aGlzLl9kcm9wSG9sZElEID0gLTE7XG4gICAgICAgICAgICB0aGlzLnVuaG9sZCh0aGlzLl91cEhvbGRJRCk7XG4gICAgICAgICAgICB0aGlzLl91cEhvbGRJRCA9IC0xO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUoJ21vdmVkJykpIHtcbiAgICAgICAgICAgICAgICBVSS5fdHJpZ2dlcih0aGlzLl9hY3Rpb25zW1VBLnVpZHJvcF0sIHRhcmdldCwgcHQsIFVBLnVpZHJvcCwgZXZ0KTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlKCdtb3ZlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vbihVQS5kcm9wLCBlbmREcmFnKTtcbiAgICAgICAgdGhpcy5vbihVQS51cCwgZW5kRHJhZyk7XG4gICAgICAgIHRoaXMub24oVUEub3V0LCBlbmREcmFnKTtcbiAgICB9XG4gICAgb25EcmFnKGZuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uKFVJUG9pbnRlckFjdGlvbnMudWlkcmFnLCBmbik7XG4gICAgfVxuICAgIG9mZkRyYWcoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2ZmKFVJUG9pbnRlckFjdGlvbnMudWlkcmFnLCBpZCk7XG4gICAgfVxuICAgIG9uRHJvcChmbikge1xuICAgICAgICByZXR1cm4gdGhpcy5vbihVSVBvaW50ZXJBY3Rpb25zLnVpZHJvcCwgZm4pO1xuICAgIH1cbiAgICBvZmZEcm9wKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9mZihVSVBvaW50ZXJBY3Rpb25zLnVpZHJvcCwgaWQpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVVJLmpzLm1hcCIsIi8qISBTb3VyY2UgY29kZSBsaWNlbnNlZCB1bmRlciBBcGFjaGUgTGljZW5zZSAyLjAuIENvcHlyaWdodCDCqSAyMDE3LWN1cnJlbnQgV2lsbGlhbSBOZ2FuIGFuZCBjb250cmlidXRvcnMuIChodHRwczovL2dpdGh1Yi5jb20vd2lsbGlhbW5nYW4vcHRzKSAqL1xuaW1wb3J0IHsgR3JvdXAgfSBmcm9tIFwiLi9QdFwiO1xuZXhwb3J0IGNvbnN0IENvbnN0ID0ge1xuICAgIHh5OiBcInh5XCIsXG4gICAgeXo6IFwieXpcIixcbiAgICB4ejogXCJ4elwiLFxuICAgIHh5ejogXCJ4eXpcIixcbiAgICBob3Jpem9udGFsOiAwLFxuICAgIHZlcnRpY2FsOiAxLFxuICAgIGlkZW50aWNhbDogMCxcbiAgICByaWdodDogNCxcbiAgICBib3R0b21fcmlnaHQ6IDUsXG4gICAgYm90dG9tOiA2LFxuICAgIGJvdHRvbV9sZWZ0OiA3LFxuICAgIGxlZnQ6IDgsXG4gICAgdG9wX2xlZnQ6IDEsXG4gICAgdG9wOiAyLFxuICAgIHRvcF9yaWdodDogMyxcbiAgICBlcHNpbG9uOiAwLjAwMDEsXG4gICAgbWF4OiBOdW1iZXIuTUFYX1ZBTFVFLFxuICAgIG1pbjogTnVtYmVyLk1JTl9WQUxVRSxcbiAgICBwaTogTWF0aC5QSSxcbiAgICB0d29fcGk6IDYuMjgzMTg1MzA3MTc5NTg2LFxuICAgIGhhbGZfcGk6IDEuNTcwNzk2MzI2Nzk0ODk2NixcbiAgICBxdWFydGVyX3BpOiAwLjc4NTM5ODE2MzM5NzQ0ODMsXG4gICAgb25lX2RlZ3JlZTogMC4wMTc0NTMyOTI1MTk5NDMyOTUsXG4gICAgcmFkX3RvX2RlZzogNTcuMjk1Nzc5NTEzMDgyMzIsXG4gICAgZGVnX3RvX3JhZDogMC4wMTc0NTMyOTI1MTk5NDMyOTUsXG4gICAgZ3Jhdml0eTogOS44MSxcbiAgICBuZXd0b246IDAuMTAxOTcsXG4gICAgZ2F1c3NpYW46IDAuMzk4OTQyMjgwNDAxNDMyN1xufTtcbmV4cG9ydCBjbGFzcyBVdGlsIHtcbiAgICBzdGF0aWMgd2FybkxldmVsKGx2KSB7XG4gICAgICAgIGlmIChsdikge1xuICAgICAgICAgICAgVXRpbC5fd2FybkxldmVsID0gbHY7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFV0aWwuX3dhcm5MZXZlbDtcbiAgICB9XG4gICAgc3RhdGljIGdldEFyZ3MoYXJncykge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPCAxKVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICBsZXQgcG9zID0gW107XG4gICAgICAgIGxldCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShhcmdzWzBdKSB8fCBBcnJheUJ1ZmZlci5pc1ZpZXcoYXJnc1swXSk7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHBvcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0JyAmJiAhaXNBcnJheSkge1xuICAgICAgICAgICAgbGV0IGEgPSBbXCJ4XCIsIFwieVwiLCBcInpcIiwgXCJ3XCJdO1xuICAgICAgICAgICAgbGV0IHAgPSBhcmdzWzBdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKChwLmxlbmd0aCAmJiBpID49IHAubGVuZ3RoKSB8fCAhKGFbaV0gaW4gcCkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIHBvcy5wdXNoKHBbYVtpXV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzQXJyYXkpIHtcbiAgICAgICAgICAgIHBvcyA9IFtdLnNsaWNlLmNhbGwoYXJnc1swXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvcztcbiAgICB9XG4gICAgc3RhdGljIHdhcm4obWVzc2FnZSA9IFwiZXJyb3JcIiwgZGVmYXVsdFJldHVybiA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoVXRpbC53YXJuTGV2ZWwoKSA9PSBcImVycm9yXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChVdGlsLndhcm5MZXZlbCgpID09IFwid2FyblwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4obWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRSZXR1cm47XG4gICAgfVxuICAgIHN0YXRpYyByYW5kb21JbnQocmFuZ2UsIHN0YXJ0ID0gMCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZ2UpICsgc3RhcnQ7XG4gICAgfVxuICAgIHN0YXRpYyBzcGxpdChwdHMsIHNpemUsIHN0cmlkZSwgbG9vcEJhY2sgPSBmYWxzZSwgbWF0Y2hTaXplID0gdHJ1ZSkge1xuICAgICAgICBsZXQgY2h1bmtzID0gW107XG4gICAgICAgIGxldCBwYXJ0ID0gW107XG4gICAgICAgIGxldCBzdCA9IHN0cmlkZSB8fCBzaXplO1xuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBpZiAocHRzLmxlbmd0aCA8PSAwIHx8IHN0IDw9IDApXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHdoaWxlIChpbmRleCA8IHB0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhcnQgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgc2l6ZTsgaysrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxvb3BCYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnQucHVzaChwdHNbKGluZGV4ICsgaykgJSBwdHMubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggKyBrID49IHB0cy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgcGFydC5wdXNoKHB0c1tpbmRleCArIGtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbmRleCArPSBzdDtcbiAgICAgICAgICAgIGlmICghbWF0Y2hTaXplIHx8IChtYXRjaFNpemUgJiYgcGFydC5sZW5ndGggPT09IHNpemUpKVxuICAgICAgICAgICAgICAgIGNodW5rcy5wdXNoKHBhcnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaHVua3M7XG4gICAgfVxuICAgIHN0YXRpYyBmbGF0dGVuKHB0cywgZmxhdHRlbkFzR3JvdXAgPSB0cnVlKSB7XG4gICAgICAgIGxldCBhcnIgPSAoZmxhdHRlbkFzR3JvdXApID8gbmV3IEdyb3VwKCkgOiBuZXcgQXJyYXkoKTtcbiAgICAgICAgcmV0dXJuIGFyci5jb25jYXQuYXBwbHkoYXJyLCBwdHMpO1xuICAgIH1cbiAgICBzdGF0aWMgY29tYmluZShhLCBiLCBvcCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuQiA9IGIubGVuZ3RoOyBrIDwgbGVuQjsgaysrKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gob3AoYVtpXSwgYltrXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHN0YXRpYyB6aXAoYXJyYXlzKSB7XG4gICAgICAgIGxldCB6ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhcnJheXNbMF0ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGFycmF5cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIHAucHVzaChhcnJheXNba11baV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgei5wdXNoKHApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB6O1xuICAgIH1cbiAgICBzdGF0aWMgc3RlcHBlcihtYXgsIG1pbiA9IDAsIHN0cmlkZSA9IDEsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBjID0gbWluO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYyArPSBzdHJpZGU7XG4gICAgICAgICAgICBpZiAoYyA+PSBtYXgpIHtcbiAgICAgICAgICAgICAgICBjID0gbWluICsgKGMgLSBtYXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGMpO1xuICAgICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXRpYyBmb3JSYW5nZShmbiwgcmFuZ2UsIHN0YXJ0ID0gMCwgc3RlcCA9IDEpIHtcbiAgICAgICAgbGV0IHRlbXAgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0LCBsZW4gPSByYW5nZTsgaSA8IGxlbjsgaSArPSBzdGVwKSB7XG4gICAgICAgICAgICB0ZW1wW2ldID0gZm4oaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRlbXA7XG4gICAgfVxuICAgIHN0YXRpYyBsb2FkKHVybCwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA+PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgPCA0MDApIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhyZXF1ZXN0LnJlc3BvbnNlVGV4dCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhgU2VydmVyIGVycm9yICgke3JlcXVlc3Quc3RhdHVzfSkgd2hlbiBsb2FkaW5nIFwiJHt1cmx9XCJgLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGBVbmtub3duIG5ldHdvcmsgZXJyb3JgLCBmYWxzZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgIH1cbiAgICBzdGF0aWMgcGVyZm9ybWFuY2UoYXZnRnJhbWVzID0gMTApIHtcbiAgICAgICAgbGV0IGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgICBsZXQgYXZnID0gW107XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgYXZnLnB1c2gobm93IC0gbGFzdCk7XG4gICAgICAgICAgICBpZiAoYXZnLmxlbmd0aCA+PSBhdmdGcmFtZXMpXG4gICAgICAgICAgICAgICAgYXZnLnNoaWZ0KCk7XG4gICAgICAgICAgICBsYXN0ID0gbm93O1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoYXZnLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApIC8gYXZnLmxlbmd0aCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXRpYyBpdGVyRnJvbVB0TGlrZShsaXN0KSB7XG4gICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGxpc3QpID8gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCkgOiBsaXN0O1xuICAgIH1cbiAgICBzdGF0aWMgaXRlckZyb21QdChsaXN0KSB7XG4gICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGxpc3QpID8gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCkgOiBsaXN0O1xuICAgIH1cbn1cblV0aWwuX3dhcm5MZXZlbCA9IFwibXV0ZVwiO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VXRpbC5qcy5tYXAiLCJleHBvcnQgKiBmcm9tIFwiLi9DYW52YXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0NyZWF0ZVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vRm9ybVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vTGluZWFyQWxnZWJyYVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vTnVtXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9PcFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vUHRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1NwYWNlXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9Db2xvclwiO1xuZXhwb3J0ICogZnJvbSBcIi4vVXRpbFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vRG9tXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9TdmdcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1R5cG9ncmFwaHlcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1BoeXNpY3NcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1BsYXlcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1VJXCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1fbW9kdWxlLmpzLm1hcCIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImNvbnN0IHsgTGluZSB9ID0gcmVxdWlyZShcInB0c1wiKTtcclxuXHJcbihmdW5jdGlvbigpIHtcclxuXHJcbiAgUHRzLm5hbWVzcGFjZSggdGhpcyApO1xyXG4gIHZhciBzcGFjZSA9IG5ldyBDYW52YXNTcGFjZShcIiNjYW52YXNcIikuc2V0dXAoe2JnY29sb3I6IFwiIzFiMjQyZlwiLCByZXNpemU6IHRydWUsIHJldGluYTogdHJ1ZX0pO1xyXG4gIHZhciBmb3JtID0gc3BhY2UuZ2V0Rm9ybSgpO1xyXG5cclxuXHJcbiAgLy8vLyBEZW1vIGNvZGUgLS0tXHJcblxyXG4gIHZhciBwdHMgPSBuZXcgR3JvdXAoKTtcclxuICB2YXIgdGltZU91dElkID0gLTE7XHJcbiAgdmFyIGhlYWRlciA9IG51bGw7XHJcblxyXG4gIGNvbnN0IGFuZ2xlID0gLSh3aW5kb3cuaW5uZXJXaWR0aCAqIC4wNSk7XHJcbiAgY29uc3QgbGluZSA9IG5ldyBMaW5lKDAsIGFuZ2xlKTtcclxuXHJcblxyXG4gIHNwYWNlLmFkZCh7IFxyXG5cclxuICAgIC8vIGNyZWF0ciAyMDAgcmFuZG9tIHBvaW50c1xyXG4gICAgc3RhcnQ6KCBib3VuZCApID0+IHtcclxuICAgICAgcHRzID0gQ3JlYXRlLmRpc3RyaWJ1dGVSYW5kb20oIHNwYWNlLmlubmVyQm91bmQsIDc1ICk7XHJcbiAgICAgIGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVhZGVyXCIpO1xyXG4gICAgfSwgXHJcblxyXG4gICAgYW5pbWF0ZTogKHRpbWUsIGZ0aW1lKSA9PiB7XHJcbiAgICAgIC8vIG1ha2UgYSBsaW5lIGFuZCB0dXJuIGl0IGludG8gYW4gXCJvcFwiIChzZWUgdGhlIGd1aWRlIG9uIE9wIGZvciBtb3JlKVxyXG4gICAgICBcclxuICAgICAgcHRzLnJvdGF0ZTJEKCAwLjAwMDgsIHNwYWNlLmNlbnRlciApO1xyXG5cclxuICAgICAgcHRzLmZvckVhY2goIChwLCBpKSA9PiB7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggcG9pbnQsIGZpbmQgdGhlIHBlcnBlbmRpY3VsYXIgdG8gdGhlIGxpbmVcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBmb3JtLmZpbGxPbmx5KCBbXCIjZjAzXCIsIFwiIzA5ZlwiLCBcIiMwYzZcIl1baSUzXSApLnBvaW50KCBwLCAyLCBcImNpcmNsZVwiICk7XHJcbiAgICAgICAgZm9ybS5zdHJva2UoYHJnYmEoMjU1LDI1NSwyNTUsIDAuM2AsIDIpLmxpbmUoTGluZS5mcm9tQW5nbGUocCwgLTQ1LCA0MDAwKSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gaGVhZGVyIHBvc2l0aW9uXHJcbiAgICAgIGlmIChoZWFkZXIpIHtcclxuICAgICAgICBsZXQgdG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICAgICAgbGV0IGRwID0gdG9wIC0gc3BhY2Uuc2l6ZS55ICsgMTUwO1xyXG4gICAgICAgIGlmIChkcCA+IDApIHtcclxuICAgICAgICAgIGhlYWRlci5zdHlsZS50b3AgPSBgJHtkcCAqIC0xfXB4YDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IFwiMHB4XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICByZXNpemU6ICgpID0+IHtcclxuICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lT3V0SWQgKTtcclxuICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSA2MDApIHtcclxuICAgICAgICAgIHB0cyA9IENyZWF0ZS5kaXN0cmlidXRlUmFuZG9tKCBzcGFjZS5pbm5lckJvdW5kLCA3NSApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwdHMgPSBDcmVhdGUuZGlzdHJpYnV0ZVJhbmRvbSggc3BhY2UuaW5uZXJCb3VuZCwgMzAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDUwMCApO1xyXG4gICAgfVxyXG5cclxuICB9KTtcclxuXHJcbiAgc3BhY2UuYmluZE1vdXNlKCkuYmluZFRvdWNoKCkucGxheSgpO1xyXG5cclxufSkoKTs7Il0sInNvdXJjZVJvb3QiOiIifQ==