/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var calc_1 = __webpack_require__(12);
exports.Calc = calc_1.Calc;
var camera_1 = __webpack_require__(27);
exports.Camera = camera_1.Camera;
var color_1 = __webpack_require__(30);
exports.Color = color_1.Color;
var ease_1 = __webpack_require__(31);
exports.Ease = ease_1.Ease;
var matrix_1 = __webpack_require__(7);
exports.Matrix = matrix_1.Matrix;
var objectList_1 = __webpack_require__(32);
exports.ObjectList = objectList_1.ObjectList;
var rectangle_1 = __webpack_require__(13);
exports.Rectangle = rectangle_1.Rectangle;
var shaders_1 = __webpack_require__(33);
exports.Shaders = shaders_1.Shaders;
var vector_1 = __webpack_require__(8);
exports.Vector = vector_1.Vector;
const Shader = __webpack_require__(14);
exports.Shader = Shader;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __webpack_require__(3);
const assets_1 = __webpack_require__(4);
const collider_1 = __webpack_require__(5);
const input_1 = __webpack_require__(6);
const util_1 = __webpack_require__(0);
/**
 * Current game Client
 */
var Client;
(function (Client) {
    /**
     * Running in Electron
     */
    Client[Client["Electron"] = 0] = "Electron";
    /**
     * Running in the Browser
     */
    Client[Client["Browser"] = 1] = "Browser";
})(Client = exports.Client || (exports.Client = {}));
/**
 * Core of the Foster Engine. Initializes and Runs the game.
 */
class Engine {
    constructor() {
        this.scene = null;
        this.nextScene = null;
        if (Engine.instance != null)
            throw "Engine has already been instantiated";
        if (!Engine.started)
            throw "Engine must be instantiated through static Engine.start";
        Engine.instance = this;
        this.client = Client.Browser;
        if (typeof (window) !== "undefined") {
            const w = window;
            if (w.process !== undefined && w.process.versions !== undefined && w.process.versions.electron !== undefined)
                this.client = Client.Electron;
        }
        this.startTime = Date.now();
    }
    /**
     * The root HTML event that the game Canvas is created in (for the actual Canvas element, see Engine.graphics.screen)
     */
    static get root() { return Engine.instance.root; }
    /**
     * Current Client (Client.Desktop if in Electron and Client.Web if in the browser)
     */
    static get client() { return Engine.instance.client; }
    /**
     * Gets the current game Scene
     */
    static get scene() {
        return (Engine.instance.nextScene != null ? Engine.instance.nextScene : Engine.instance.scene);
    }
    /**
     * Gets the Game Width, before being scaled up / down to fit in the screen
     */
    static get width() { return Engine.instance.width; }
    /**
     * Gets the Game Height, before being scaled up / down to fit in the screen
     */
    static get height() { return Engine.instance.height; }
    /**
     * Toggles Debug Mode, which shows hitboxes and allows entities to be dragged around
     */
    static get debugMode() { return Engine.instance.debuggerEnabled; }
    static set debugMode(v) { Engine.instance.debuggerEnabled = v; }
    /**
     * Delta Time (time, in seconds, since the last frame)
     */
    static get delta() { return Engine.instance.dt; }
    /**
     * Total elapsed game time (time, in seconds, since the Engine was started)
     */
    static get elapsed() { return Engine.instance.elapsed; }
    /**
     * Gets the current Engine graphics (used for all rendering)
     */
    static get graphics() { return Engine.instance.graphics; }
    /**
     * Gets or sets the global sound volume multiplier
     */
    static get volume() { return Engine._volume; }
    static set volume(n) {
        Engine._volume = n;
        for (const sound of assets_1.Sound.active)
            sound.volume = sound.volume;
    }
    /**
     * Mutes or Unmutes the entire game
     */
    static get muted() { return Engine._muted; }
    static set muted(m) {
        Engine._muted = m;
        for (const sound of assets_1.Sound.active)
            sound.muted = sound.muted;
    }
    /**
     * Starts up the Game Engine
     * @param title 	Window Title
     * @param width 	Game Width
     * @param height 	Game Height
     * @param scale 	Scales the Window (on Desktop) to width * scale and height * scale
     * @param ready 	Callback when the Engine is ready
     */
    static start(title, width, height, scale, ready) {
        // instantiate
        Engine.started = true;
        new Engine();
        new _1.GameWindow();
        // window
        _1.GameWindow.title = title;
        _1.GameWindow.resize(width * scale, height * scale);
        _1.GameWindow.center();
        // wait for window
        window.onload = () => {
            const c = String.fromCharCode(0x25cf);
            console.log("%c " + c + " ENGINE START " + c + " ", "background:#222; color:#ff44aa;");
            Engine.instance.root = document.getElementsByTagName("body")[0];
            // init
            collider_1.DefaultOverlapTests();
            _1.IO.init();
            Engine.instance.graphics = new _1.Graphics(Engine.instance);
            Engine.instance.graphics.load();
            Engine.resize(width, height);
            util_1.Shaders.init();
            input_1.Mouse.init();
            input_1.Keyboard.init();
            // start update loop
            Engine.instance.step();
            // ready callback for game
            if (ready !== undefined)
                ready();
        };
    }
    /**
     * Goes to a new Scene
     * @param scene 	The Scene to go to
     * @param disposeLastScene 	If the last scene should be disposed
     */
    static goto(scene, disposeLastScene) {
        const lastScene = Engine.scene;
        Engine.instance.nextScene = scene;
        Engine.instance.disposeLastScene = disposeLastScene;
        return scene;
    }
    /**
     * Ends the Game
     */
    static exit() {
        if (Engine.started && !Engine.exiting)
            Engine.instance.exit();
    }
    /**
     * Resizes the game to the given size
     * @param width 	new Game Width
     * @param height 	new Game Height
     */
    static resize(width, height) {
        Engine.instance.width = width;
        Engine.instance.height = height;
        Engine.instance.graphics.resize();
    }
    /**
     * Checks that the given value is true, otherwise throws an error
     */
    static assert(value, message) {
        if (!value)
            throw message;
        return value;
    }
    step() {
        // time management!
        const time = Date.now();
        this.elapsed = Math.floor(time - this.startTime) / 1000;
        this.dt = Math.floor(time - this.lastTime) / 1000;
        this.lastTime = time;
        // update graphics
        this.graphics.update();
        // update inputs
        input_1.Mouse.update();
        input_1.Keyboard.update();
        // swap scenes
        if (this.nextScene != null) {
            if (this.scene != null) {
                this.scene.ended();
                if (this.disposeLastScene)
                    this.scene.dispose();
            }
            this.scene = this.nextScene;
            this.nextScene = null;
            this.scene.begin();
        }
        // update scene
        if (this.scene != null)
            this.scene.update();
        if (this.nextScene == null) {
            // begin drawing
            this.graphics.reset();
            // render current scene
            if (this.scene != null)
                this.scene.render();
            // final flush on graphics
            this.graphics.finalize();
        }
        // update sounds
        for (const sound of assets_1.Sound.active)
            sound.update();
        // do it all again!
        if (!Engine.exiting)
            requestAnimationFrame(this.step.bind(this));
    }
    exit() {
        Engine.exiting = true;
        assets_1.Assets.unload();
        Engine.graphics.unload();
        if (Engine.client === Client.Electron) {
            const remote = __webpack_require__(20).remote;
            const win = remote.getCurrentWindow();
            win.close();
        }
    }
}
/**
 * Foster Engine version
 * major.minor.build
 */
Engine.version = "0.1.11";
Engine._volume = 1;
Engine._muted = false;
Engine.instance = null;
Engine.started = false;
Engine.exiting = false;
exports.Engine = Engine;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __webpack_require__(0);
class Component {
    constructor() {
        this._entity = null;
        /**
         * The Scene containing this Component
         */
        this.scene = null;
        /**
         * Whether this Component should be updated
         */
        this.active = true;
        /**
         * Whether this Component should be rendered
         */
        this.visible = true;
        /**
         * The Local position of the Component, relative to the Entity
         */
        this.position = new util_1.Vector(0, 0);
        /**
         * The position of the Component in the Scene (position + Entity.position)
         */
        this._scenePosition = new util_1.Vector();
    }
    /**
     * The Entity this Component is a child of
     */
    get entity() { return this._entity; }
    set entity(val) {
        if (this._entity != null && val != null)
            throw new Error("This Component is already attached to an Entity");
        this._entity = val;
    }
    /**
     * The Local X position of the Component, relative to the Entity
     */
    get x() { return this.position.x; }
    set x(val) { this.position.x = val; }
    /**
     * The Local Y position of the Component, relative to the Entity
     */
    get y() { return this.position.y; }
    set y(val) { this.position.y = val; }
    get scenePosition() {
        return this._scenePosition.set(this._entity ? this._entity.x : 0, this._entity ? this._entity.y : 0).add(this.position);
    }
    /**
     * Called when the Component was Added to the Entity
     */
    addedToEntity() { }
    /**
     * Called when the Component was Added to the Scene
     */
    addedToScene() { }
    /**
     * Called when the Component was Removed from the Entity
     */
    removedFromEntity() { }
    /**
     * Called when the Component was Removed from the Scene
     */
    removedFromScene() { }
    /**
     * Called when the Component is Updated from its Entity
     */
    update() { }
    /**
     * Called when the component is Rendered from its Entity
     */
    render(camera) { }
    /**
     * Called when the Engine is in Debug mode, at the end of the Scene Render from its Entity
     */
    debugRender(camera) { }
}
exports.Component = Component;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var engine_1 = __webpack_require__(1);
exports.Engine = engine_1.Engine;
exports.Client = engine_1.Client;
var entity_1 = __webpack_require__(41);
exports.Entity = entity_1.Entity;
var gameWindow_1 = __webpack_require__(42);
exports.GameWindow = gameWindow_1.GameWindow;
var graphics_1 = __webpack_require__(43);
exports.Graphics = graphics_1.Graphics;
exports.BlendMode = graphics_1.BlendMode;
exports.BlendModes = graphics_1.BlendModes;
exports.ResolutionStyle = graphics_1.ResolutionStyle;
var scene_1 = __webpack_require__(44);
exports.Scene = scene_1.Scene;
var component_1 = __webpack_require__(2);
exports.Component = component_1.Component;
var renderer_1 = __webpack_require__(10);
exports.Renderer = renderer_1.Renderer;
var io_1 = __webpack_require__(45);
exports.IO = io_1.IO;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(26));
__export(__webpack_require__(35));
__export(__webpack_require__(37));
var assetLoader_1 = __webpack_require__(40);
exports.AssetLoader = assetLoader_1.AssetLoader;
var assets_1 = __webpack_require__(18);
exports.Assets = assets_1.Assets;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __webpack_require__(2);
class Collider extends component_1.Component {
    constructor() {
        super(...arguments);
        this.tags = [];
    }
    tag(tag) {
        this.tags.push(tag);
        if (this.entity != null && this.entity.scene != null)
            this.entity.scene._trackCollider(this, tag);
    }
    untag(tag) {
        const index = this.tags.indexOf(tag);
        if (index >= 0) {
            this.tags.splice(index, 1);
            if (this.entity != null && this.entity.scene != null)
                this.entity.scene._untrackCollider(this, tag);
        }
    }
    check(tag, x, y) {
        return this.collide(tag, x, y) != null;
    }
    checks(tags, x, y) {
        for (const tag of tags)
            if (this.collide(tag, x, y) != null)
                return true;
        return false;
    }
    collide(tag, x, y) {
        let result = null;
        const against = this.entity.scene.allCollidersInTag(tag);
        this.x += x || 0;
        this.y += y || 0;
        for (const other of against)
            if (Collider.overlap(this, other)) {
                result = other;
                break;
            }
        this.x -= x || 0;
        this.y -= y || 0;
        return result;
    }
    collides(tags, x, y) {
        for (const tag of tags) {
            const hit = this.collide(tag, x, y);
            if (hit != null)
                return hit;
        }
        return null;
    }
    collideAll(tag, x, y) {
        const list = [];
        const against = this.entity.scene.allCollidersInTag(tag);
        this.x += x || 0;
        this.y += y || 0;
        for (const other of against)
            if (Collider.overlap(this, other))
                list.push(other);
        this.x -= x || 0;
        this.y -= y || 0;
        return list;
    }
    static registerOverlapTest(fromType, toType, test) {
        if (Collider.overlaptest[fromType] === undefined)
            Collider.overlaptest[fromType] = {};
        if (Collider.overlaptest[toType] === undefined)
            Collider.overlaptest[toType] = {};
        Collider.overlaptest[fromType][toType] = (a, b) => test(a, b);
        Collider.overlaptest[toType][fromType] = (a, b) => test(b, a);
    }
    static overlap(a, b) {
        return Collider.overlaptest[a.type][b.type](a, b);
    }
}
Collider.overlaptest = {};
exports.Collider = Collider;
function DefaultOverlapTests() {
    Collider.registerOverlapTest("Hitbox", "Hitbox", (a, b) => {
        return a.sceneRight > b.sceneLeft && a.sceneBottom > b.sceneTop && a.sceneLeft < b.sceneRight && a.sceneTop < b.sceneBottom;
    });
    Collider.registerOverlapTest("Hitbox", "Hitgrid", (a, b) => {
        const gridPosition = b.scenePosition;
        const left = Math.floor((a.sceneLeft - gridPosition.x) / b.tileWidth);
        const top = Math.floor((a.sceneTop - gridPosition.y) / b.tileHeight);
        const right = Math.ceil((a.sceneRight - gridPosition.x) / b.tileWidth);
        const bottom = Math.ceil((a.sceneBottom - gridPosition.y) / b.tileHeight);
        for (let x = left; x < right; x++)
            for (let y = top; y < bottom; y++)
                if (b.has(x, y))
                    return true;
        return false;
    });
}
exports.DefaultOverlapTests = DefaultOverlapTests;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var keyboard_1 = __webpack_require__(28);
exports.Keyboard = keyboard_1.Keyboard;
exports.Key = keyboard_1.Key;
var mouse_1 = __webpack_require__(29);
exports.Mouse = mouse_1.Mouse;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Matrix {
    constructor() {
        this.mat = new Float32Array(9);
        this.identity();
    }
    identity() {
        this.mat[0] = 1;
        this.mat[1] = 0;
        this.mat[2] = 0;
        this.mat[3] = 0;
        this.mat[4] = 1;
        this.mat[5] = 0;
        this.mat[6] = 0;
        this.mat[7] = 0;
        this.mat[8] = 1;
        return this;
    }
    copy(o) {
        this.mat[0] = o.mat[0];
        this.mat[1] = o.mat[1];
        this.mat[2] = o.mat[2];
        this.mat[3] = o.mat[3];
        this.mat[4] = o.mat[4];
        this.mat[5] = o.mat[5];
        this.mat[6] = o.mat[6];
        this.mat[7] = o.mat[7];
        this.mat[8] = o.mat[8];
        return this;
    }
    set(a, b, c, d, tx, ty) {
        this.mat[0] = a;
        this.mat[1] = d;
        this.mat[2] = 0;
        this.mat[3] = c;
        this.mat[4] = b;
        this.mat[5] = 0;
        this.mat[6] = tx;
        this.mat[7] = ty;
        this.mat[8] = 1;
        return this;
    }
    add(o) {
        this.mat[0] += o.mat[0];
        this.mat[1] += o.mat[1];
        this.mat[2] += o.mat[2];
        this.mat[3] += o.mat[3];
        this.mat[4] += o.mat[4];
        this.mat[5] += o.mat[5];
        this.mat[6] += o.mat[6];
        this.mat[7] += o.mat[7];
        this.mat[8] += o.mat[8];
        return this;
    }
    sub(o) {
        this.mat[0] -= o.mat[0];
        this.mat[1] -= o.mat[1];
        this.mat[2] -= o.mat[2];
        this.mat[3] -= o.mat[3];
        this.mat[4] -= o.mat[4];
        this.mat[5] -= o.mat[5];
        this.mat[6] -= o.mat[6];
        this.mat[7] -= o.mat[7];
        this.mat[8] -= o.mat[8];
        return this;
    }
    scaler(s) {
        this.mat[0] *= s;
        this.mat[1] *= s;
        this.mat[2] *= s;
        this.mat[3] *= s;
        this.mat[4] *= s;
        this.mat[5] *= s;
        this.mat[6] *= s;
        this.mat[7] *= s;
        this.mat[8] *= s;
        return this;
    }
    invert() {
        const a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2], a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20;
        let det = a00 * b01 + a01 * b11 + a02 * b21;
        if (!det)
            return this;
        det = 1.0 / det;
        this.mat[0] = b01 * det;
        this.mat[1] = (-a22 * a01 + a02 * a21) * det;
        this.mat[2] = (a12 * a01 - a02 * a11) * det;
        this.mat[3] = b11 * det;
        this.mat[4] = (a22 * a00 - a02 * a20) * det;
        this.mat[5] = (-a12 * a00 + a02 * a10) * det;
        this.mat[6] = b21 * det;
        this.mat[7] = (-a21 * a00 + a01 * a20) * det;
        this.mat[8] = (a11 * a00 - a01 * a10) * det;
        return this;
    }
    multiply(o) {
        const a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2], a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8], b00 = o.mat[0], b01 = o.mat[1], b02 = o.mat[2], b10 = o.mat[3], b11 = o.mat[4], b12 = o.mat[5], b20 = o.mat[6], b21 = o.mat[7], b22 = o.mat[8];
        this.mat[0] = b00 * a00 + b01 * a10 + b02 * a20;
        this.mat[1] = b00 * a01 + b01 * a11 + b02 * a21;
        this.mat[2] = b00 * a02 + b01 * a12 + b02 * a22;
        this.mat[3] = b10 * a00 + b11 * a10 + b12 * a20;
        this.mat[4] = b10 * a01 + b11 * a11 + b12 * a21;
        this.mat[5] = b10 * a02 + b11 * a12 + b12 * a22;
        this.mat[6] = b20 * a00 + b21 * a10 + b22 * a20;
        this.mat[7] = b20 * a01 + b21 * a11 + b22 * a21;
        this.mat[8] = b20 * a02 + b21 * a12 + b22 * a22;
        return this;
    }
    rotate(rad) {
        const a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2], a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], s = Math.sin(rad), c = Math.cos(rad);
        this.mat[0] = c * a00 + s * a10;
        this.mat[1] = c * a01 + s * a11;
        this.mat[2] = c * a02 + s * a12;
        this.mat[3] = c * a10 - s * a00;
        this.mat[4] = c * a11 - s * a01;
        this.mat[5] = c * a12 - s * a02;
        return this;
    }
    scale(x, y) {
        this.mat[0] = x * this.mat[0];
        this.mat[1] = x * this.mat[1];
        this.mat[2] = x * this.mat[2];
        this.mat[3] = y * this.mat[3];
        this.mat[4] = y * this.mat[4];
        this.mat[5] = y * this.mat[5];
        return this;
    }
    translate(x, y) {
        const a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2], a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8];
        this.mat[6] = x * a00 + y * a10 + a20;
        this.mat[7] = x * a01 + y * a11 + a21;
        this.mat[8] = x * a02 + y * a12 + a22;
        return this;
    }
    fromRotation(rad) {
        const s = Math.sin(rad), c = Math.cos(rad);
        this.identity();
        this.mat[0] = c;
        this.mat[1] = -s;
        this.mat[3] = s;
        this.mat[4] = c;
        return this;
    }
    fromScale(x, y) {
        this.identity();
        this.mat[0] = x;
        this.mat[4] = y;
        return this;
    }
    fromTranslation(x, y) {
        this.identity();
        this.mat[6] = x;
        this.mat[7] = y;
        return this;
    }
}
exports.Matrix = Matrix;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const calc_1 = __webpack_require__(12);
class Vector {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        if (x !== undefined)
            this.x = x;
        if (y !== undefined)
            this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    mult(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }
    div(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }
    scale(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    rotate(sin, cos) {
        const ox = this.x, oy = this.y;
        this.x = ox * cos - oy * sin;
        this.y = ox * sin + oy * cos;
        return this;
    }
    transform(m) {
        const ax = this.x, ay = this.y;
        this.x = m.mat[0] * ax + m.mat[3] * ay + m.mat[6];
        this.y = m.mat[1] * ax + m.mat[4] * ay + m.mat[7];
        return this;
    }
    approach(target, step) {
        const normal = Vector.temp0.copy(target).sub(this).normalize();
        this.x = calc_1.Calc.approach(this.x, target.x, normal.x * step);
        this.y = calc_1.Calc.approach(this.y, target.y, normal.y * step);
    }
    approachXY(x, y, step) {
        const normal = Vector.temp0.set(x, y).sub(this).normalize();
        this.x = calc_1.Calc.approach(this.x, x, normal.x * step);
        this.y = calc_1.Calc.approach(this.y, y, normal.y * step);
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    get length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    get angle() {
        return Math.atan2(this.y, this.x);
    }
    get normal() {
        const dist = this.length;
        return new Vector(this.x / dist, this.y / dist);
    }
    normalize(length = 1) {
        const dist = this.length;
        this.x = (this.x / dist) * length;
        this.y = (this.y / dist) * length;
        return this;
    }
    static get zero() { return Vector._zero.set(0, 0); }
}
Vector.directions = [
    new Vector(-1, 0),
    new Vector(0, -1),
    new Vector(1, 0),
    new Vector(0, 1),
];
// temporary vectors used wherever
Vector.temp0 = new Vector();
Vector.temp1 = new Vector();
Vector.temp2 = new Vector();
Vector._zero = new Vector();
exports.Vector = Vector;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
/**
 * Internal Texture used for Foster during Rendering
 */
class FosterWebGLTexture {
    constructor(texture, width, height) {
        this.disposed = false;
        this.webGLTexture = texture;
        this.width = width;
        this.height = height;
    }
    dispose() {
        if (!this.disposed) {
            const gl = engine_1.Engine.graphics.gl;
            gl.deleteTexture(this.webGLTexture);
            this.path = "";
            this.webGLTexture = null;
            this.width = 1;
            this.height = 1;
            this.disposed = true;
        }
    }
}
exports.FosterWebGLTexture = FosterWebGLTexture;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const util_1 = __webpack_require__(0);
/**
 * Used by the Scene to render. A Scene can have multiple renderers that essentially act as separate layers / draw calls
 */
class Renderer {
    constructor() {
        /**
         * If this renderer is visible
         */
        this.visible = true;
        /**
         * Current Render Target. null means it will draw to the screen
         */
        this.target = null;
        /**
         * Clear color when drawing (defaults to transparent)
         */
        this.clearTargetColor = new util_1.Color(0, 0, 0, 0);
        /**
         * The scene we're in
         */
        this.scene = null;
        /**
         * Only draws entities of the given mask, if set (otherwise draws all entities)
         */
        this.groupsMask = [];
    }
    /**
     * Called during Scene.update
     */
    update() { }
    /**
     * Called before Render
     */
    preRender() { }
    /**
     * Renders the Renderer. Calls drawBegin and then drawEntities
     */
    render() {
        this.drawBegin();
        this.drawEntities();
    }
    /**
     * Sets up the current render target and shader
     */
    drawBegin() {
        // set target
        if (this.target != null) {
            engine_1.Engine.graphics.setRenderTarget(this.target);
            engine_1.Engine.graphics.clear(this.clearTargetColor);
        }
        else
            engine_1.Engine.graphics.setRenderTarget(engine_1.Engine.graphics.buffer);
        // set to our shader, and set main Matrix to the camera with fallback to Scene camera
        engine_1.Engine.graphics.shader = this.shader;
        engine_1.Engine.graphics.shader.set(this.shaderCameraUniformName, this.getActiveCamera().matrix);
    }
    /**
     * Draws all the entities
     */
    drawEntities() {
        const camera = this.getActiveCamera();
        // draw each entity
        const list = (this.groupsMask.length > 0 ? this.scene.allInGroups(this.groupsMask) : this.scene.entities);
        list.each((e) => {
            if (e.visible)
                e.render(camera);
        });
    }
    getActiveCamera() {
        return (this.camera || this.scene.camera);
    }
    /**
     * Called after Render
     */
    postRender() { }
    /**
     * Called when the Scene is disposed (cleans up our Target, if we have one)
     */
    dispose() {
        if (this.target != null)
            this.target.dispose();
        this.target = null;
    }
}
exports.Renderer = Renderer;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __webpack_require__(0);
/**
 * An animation template handles a single Animation in an Sprite Template (ex. Player.Run)
 */
class SpriteAnimationTemplate {
    constructor(name, speed, frames, loops, position, origin) {
        /**
         * If this animation should loop
         */
        this.loops = false;
        /**
         * What animation(s) the Sprite should go to next upon completion
         */
        this.goto = null;
        this.name = name;
        this.speed = speed;
        this.frames = frames;
        this.loops = loops || false;
        this.position = (position || new util_1.Vector(0, 0));
        this.origin = (origin || new util_1.Vector(0, 0));
    }
}
exports.SpriteAnimationTemplate = SpriteAnimationTemplate;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper class for math related functions
 */
class Calc {
    /**
     * Returns the Sign of the number (-1, 0, or 1)
     */
    static sign(n) {
        return (n < 0 ? -1 : (n > 0 ? 1 : 0));
    }
    /**
     * Clamps the value between a min and max value
     */
    static clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }
    /**
     * Approaches N towards the target value by the step, without going past it
     */
    static approach(n, target, step) {
        return n > target ? Math.max(n - step, target) : Math.min(n + step, target);
    }
    /**
     * Returns a random value within the range. If no Maximum is provided, it returns within the range -min to +min
     */
    static range(min, max) {
        if (max === undefined)
            return -min + Math.random() * min * 2;
        return min + Math.random() * (max - min);
    }
    /**
     * Chooses a random value from the given list
     */
    static choose(list) {
        return list[Math.floor(Math.random() * list.length)];
    }
}
exports.Calc = Calc;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Rectangle {
    get left() { return this.x; }
    get right() { return this.x + this.width; }
    get top() { return this.y; }
    get bottom() { return this.y + this.height; }
    constructor(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 1;
        this.height = h || 1;
    }
    set(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        return this;
    }
    cropRect(r) {
        if (r.x < this.x) {
            r.width += (r.x - this.x);
            r.x = this.x;
        }
        if (r.y < this.x) {
            r.height += (r.y - this.y);
            r.y = this.y;
        }
        if (r.x > this.right) {
            r.x = this.right;
            r.width = 0;
        }
        if (r.y > this.bottom) {
            r.y = this.bottom;
            r.height = 0;
        }
        if (r.right > this.right)
            r.width = this.right - r.x;
        if (r.bottom > this.bottom)
            r.height = this.bottom - r.y;
        return r;
    }
    crop(x, y, w, h, ref) {
        if (ref === undefined)
            ref = new Rectangle();
        ref.set(x, y, w, h);
        this.cropRect(ref);
        return ref;
    }
    clone() {
        return new Rectangle().copy(this);
    }
    copy(from) {
        this.x = from.x;
        this.y = from.y;
        this.width = from.width;
        this.height = from.height;
        return this;
    }
}
exports.Rectangle = Rectangle;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(3);
const matrix_1 = __webpack_require__(7);
const vector_1 = __webpack_require__(8);
/**
 * A Foster Shader used for Rendering
 * For Pre-existing shaders, see Shaders.ts
 */
class Program {
    /**
     * Creates a new Shader from the given vertex and fragment shader code, with the given uniforms and attributes
     */
    constructor(vertex, fragment, uniforms, attributes) {
        /**
         * If this Shader is dirty and must be updated
         */
        this.dirty = true;
        this.uniformsByName = {};
        const gl = core_1.Engine.graphics.gl;
        // vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertex);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
            throw new Error("An error occurred compiling the shaders:" + gl.getShaderInfoLog(vertexShader));
        // fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragment);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
            throw new Error("An error occurred compiling the shaders:" + gl.getShaderInfoLog(fragmentShader));
        // program
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
            throw new Error("Unable to initialize the shader program.");
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        // attributes
        this.attributes = attributes;
        for (const attribute of this.attributes)
            attribute.location = gl.getAttribLocation(this.program, attribute.name);
        // uniforms
        this.uniforms = uniforms;
        for (const uniform of this.uniforms) {
            this.uniformsByName[uniform.name] = uniform;
            uniform.shader = this;
            uniform.location = gl.getUniformLocation(this.program, uniform.name);
            // first sampler2D gets set
            if (uniform.type === UniformType.sampler2D && this.sampler2d == null)
                this.sampler2d = uniform;
        }
    }
    /**
     * Sets the Uniform of the given name to the value
     * @param name 	the name of the uniform
     * @param value 	the value to set the uniform to
     */
    set(name, value) {
        this.uniformsByName[name].value = value;
    }
}
exports.Program = Program;
/**
 * Shader Uniform Types
 */
var UniformType;
(function (UniformType) {
    // normal ones
    UniformType[UniformType["float"] = 0] = "float";
    UniformType[UniformType["floatArray"] = 1] = "floatArray";
    UniformType[UniformType["float2"] = 2] = "float2";
    UniformType[UniformType["float2Array"] = 3] = "float2Array";
    UniformType[UniformType["float3"] = 4] = "float3";
    UniformType[UniformType["float3Array"] = 5] = "float3Array";
    UniformType[UniformType["float4"] = 6] = "float4";
    UniformType[UniformType["float4Array"] = 7] = "float4Array";
    UniformType[UniformType["matrix2d"] = 8] = "matrix2d";
    UniformType[UniformType["matrix3d"] = 9] = "matrix3d";
    UniformType[UniformType["matrix4d"] = 10] = "matrix4d";
    UniformType[UniformType["int"] = 11] = "int";
    UniformType[UniformType["intArray"] = 12] = "intArray";
    UniformType[UniformType["int2"] = 13] = "int2";
    UniformType[UniformType["int2Array"] = 14] = "int2Array";
    UniformType[UniformType["int3"] = 15] = "int3";
    UniformType[UniformType["int3Array"] = 16] = "int3Array";
    UniformType[UniformType["int4"] = 17] = "int4";
    UniformType[UniformType["int4Array"] = 18] = "int4Array";
    // special case for sampler2D
    UniformType[UniformType["sampler2D"] = 19] = "sampler2D";
})(UniformType = exports.UniformType || (exports.UniformType = {}));
/**
 * A Shader Uniform instance
 */
class Uniform {
    constructor(name, type, value) {
        this._value = null;
        this.name = name;
        this.type = type;
        this._value = value;
    }
    get value() { return this._value; }
    set value(a) {
        if (this.value !== a) {
            this._value = a;
            this._shader.dirty = true;
            this.dirty = true;
        }
    }
    set shader(s) {
        if (this._shader != null)
            throw new Error("This Uniform is already attached to a shader");
        this._shader = s;
    }
}
exports.Uniform = Uniform;
/**
 * Shader Attribute Types
 */
var AttributeType;
(function (AttributeType) {
    AttributeType[AttributeType["Position"] = 0] = "Position";
    AttributeType[AttributeType["Texcoord"] = 1] = "Texcoord";
    AttributeType[AttributeType["Color"] = 2] = "Color";
})(AttributeType = exports.AttributeType || (exports.AttributeType = {}));
/**
 * A Shader Attribute Instance
 */
class Attribute {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}
exports.Attribute = Attribute;
/**
 * Dictionary of Methods to handle setting GL Uniform Values
 */
exports.setGLUniformValue = {};
// float
exports.setGLUniformValue[UniformType.float] = (gl, location, value) => {
    gl.uniform1f(location, value);
};
// float 2
exports.setGLUniformValue[UniformType.float2] = (gl, location, value) => {
    if (value instanceof vector_1.Vector)
        gl.uniform2f(location, value.x, value.y);
    else
        gl.uniform2f(location, value[0], value[1]);
};
// float 3
exports.setGLUniformValue[UniformType.float3] = (gl, location, value) => {
    gl.uniform3f(location, value[0], value[1], value[2]);
};
// float 4
exports.setGLUniformValue[UniformType.float4] = (gl, location, value) => {
    gl.uniform4f(location, value[0], value[1], value[2], value[3]);
};
// float array
exports.setGLUniformValue[UniformType.floatArray] = (gl, location, value) => {
    gl.uniform1fv(location, value);
};
// float 2 array
exports.setGLUniformValue[UniformType.float2Array] = (gl, location, value) => {
    gl.uniform2fv(location, value);
};
// float 3 array
exports.setGLUniformValue[UniformType.float3Array] = (gl, location, value) => {
    gl.uniform3fv(location, value);
};
// float 4 array
exports.setGLUniformValue[UniformType.float4Array] = (gl, location, value) => {
    gl.uniform4fv(location, value);
};
// int
exports.setGLUniformValue[UniformType.int] = (gl, location, value) => {
    gl.uniform1i(location, value);
};
// int 2
exports.setGLUniformValue[UniformType.int2] = (gl, location, value) => {
    if (value instanceof vector_1.Vector)
        gl.uniform2i(location, Math.round(value.x), Math.round(value.y));
    else
        gl.uniform2i(location, value[0], value[1]);
};
// int 3
exports.setGLUniformValue[UniformType.int3] = (gl, location, value) => {
    gl.uniform3i(location, value[0], value[1], value[2]);
};
// int 4
exports.setGLUniformValue[UniformType.int4] = (gl, location, value) => {
    gl.uniform4i(location, value[0], value[1], value[2], value[3]);
};
// int array
exports.setGLUniformValue[UniformType.intArray] = (gl, location, value) => {
    gl.uniform1iv(location, value);
};
// int 2 array
exports.setGLUniformValue[UniformType.int2Array] = (gl, location, value) => {
    gl.uniform2iv(location, value);
};
// int 3 array
exports.setGLUniformValue[UniformType.int3Array] = (gl, location, value) => {
    gl.uniform3iv(location, value);
};
// int 4 array
exports.setGLUniformValue[UniformType.int4Array] = (gl, location, value) => {
    gl.uniform4iv(location, value);
};
// matrix 2d
exports.setGLUniformValue[UniformType.matrix2d] = (gl, location, value) => {
    gl.uniformMatrix2fv(location, false, value);
};
// matrix 3d
exports.setGLUniformValue[UniformType.matrix3d] = (gl, location, value) => {
    if (value instanceof matrix_1.Matrix)
        gl.uniformMatrix3fv(location, false, value.mat);
    else
        gl.uniformMatrix3fv(location, false, value);
};
// matrix 4d
exports.setGLUniformValue[UniformType.matrix4d] = (gl, location, value) => {
    gl.uniformMatrix2fv(location, false, value);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const spriteAnimationTemplate_1 = __webpack_require__(11);
const util_1 = __webpack_require__(0);
/**
 * Sprite Template holds a list of Animation Templates, referenced by name
 */
class SpriteTemplate {
    constructor(name) {
        /**
         * A list of all the animation template, by their name
         */
        this.animations = {};
        this.name = name;
    }
    /**
     * Adds a new Animation Template to this set
     */
    add(name, speed, frames, loops, position, origin) {
        const anim = new spriteAnimationTemplate_1.SpriteAnimationTemplate(name, speed, frames, loops, position, origin);
        this.animations[name] = anim;
        if (this.first == null)
            this.first = anim;
        return this;
    }
    /**
     * Adds a new frame-based Animation Template to this set
     */
    addFrameAnimation(name, speed, tex, frameWidth, frameHeight, frames, loops, position, origin) {
        const columns = Math.floor(tex.width / frameWidth);
        const texFrames = [];
        for (const index of frames) {
            const tx = (index % columns) * frameWidth;
            const ty = Math.floor(index / columns) * frameWidth;
            texFrames.push(tex.getSubtexture(new util_1.Rectangle(tx, ty, frameWidth, frameHeight)));
        }
        const anim = new spriteAnimationTemplate_1.SpriteAnimationTemplate(name, speed, texFrames, loops, position, origin);
        this.animations[name] = anim;
        if (this.first == null)
            this.first = anim;
        return this;
    }
    /**
     * Gets an animation template by its name
     */
    get(name) {
        return this.animations[name];
    }
    /**
     * Checks if an animation template exists by the given name
     */
    has(name) {
        return this.animations[name] !== undefined;
    }
}
exports.SpriteTemplate = SpriteTemplate;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const sound_1 = __webpack_require__(17);
class AudioGroup {
    static volume(group, value) {
        if (value !== undefined && AudioGroup.volumes[group] !== value) {
            AudioGroup.volumes[group] = value;
            for (const sound of sound_1.Sound.active)
                if (sound.ingroup(group))
                    sound.volume = sound.volume;
        }
        if (AudioGroup.volumes[group] !== undefined)
            return AudioGroup.volumes[group];
        return 1;
    }
    static muted(group, value) {
        if (value !== undefined && AudioGroup.mutes[group] !== value) {
            AudioGroup.mutes[group] = value;
            for (const sound of sound_1.Sound.active)
                if (sound.ingroup(group))
                    sound.muted = sound.muted;
        }
        if (AudioGroup.mutes[group] !== undefined)
            return AudioGroup.mutes[group];
        return false;
    }
}
AudioGroup.volumes = {};
AudioGroup.mutes = {};
exports.AudioGroup = AudioGroup;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const assets_1 = __webpack_require__(18);
const audioGroup_1 = __webpack_require__(16);
const core_1 = __webpack_require__(3);
const util_1 = __webpack_require__(0);
class Sound {
    /**
     * Creates a new sound of the given handle
     */
    constructor(handle, groups) {
        this.sound = null;
        this.started = false;
        this.groups = [];
        this.fadePercent = 1;
        this.fadeDuration = 1;
        this._loop = false;
        this._paused = false;
        this._muted = false;
        this._volume = 1;
        this.source = assets_1.Assets.sounds[handle];
        if (groups && groups.length > 0)
            for (const group in groups)
                this.group(group);
    }
    /**
     * Gets if the sound is currently playing
     */
    get playing() { return this.started && !this._paused; }
    /**
     * Gets or sets whether the sound is looping
     */
    get loop() { return this._loop; }
    set loop(v) {
        this._loop = v;
        if (this.started)
            this.sound.loop = this._loop;
    }
    /**
     * Gets if the sound is paused
     */
    get paused() { return this._paused; }
    /**
     * Gets or sets whether the current sound is muted
     */
    get muted() { return this._muted; }
    set muted(m) {
        this._muted = m;
        this.internalUpdateMuted();
    }
    /**
     * Gets or sets the volume of this sound
     */
    get volume() { return this._volume; }
    set volume(n) {
        this._volume = n;
        this.internalUpdateVolume();
    }
    /**
     * Plays the sound
     */
    play(loop) {
        // should this sound loop?
        this.loop = loop;
        // reset current sound if we're playing something already
        if (this.sound != null && this.started) {
            this.sound.currentTime = 0;
            if (this._paused)
                this.resume();
        }
        else {
            this.sound = this.source.requestSound();
            if (this.sound != null) {
                if (this.sound.readyState < 3) {
                    const self = this;
                    self.loadedEvent = () => {
                        if (self.sound != null)
                            self.internalPlay();
                        self.sound.removeEventListener("loadeddata", self.loadedEvent);
                        self.loadedEvent = null;
                    };
                    this.sound.addEventListener("loadeddata", self.loadedEvent);
                }
                else
                    this.internalPlay();
            }
        }
        return this;
    }
    /**
     * Resumes if the sound was paused
     */
    resume() {
        if (this.started && this._paused)
            this.sound.play();
        this._paused = false;
        return this;
    }
    /**
     * Pauses a sound
     */
    pause() {
        if (this.started && !this._paused)
            this.sound.pause();
        this._paused = true;
        return this;
    }
    /**
     * Completely stops a sound
     */
    stop() {
        if (this.sound != null) {
            this.source.returnSound(this.sound);
            if (this.started) {
                this.sound.pause();
                this.sound.currentTime = 0;
                this.sound.volume = 1;
                this.sound.muted = false;
                this.sound.removeEventListener("ended", this.endEvent);
                if (this.loadedEvent != null)
                    this.sound.removeEventListener("loadeddata", this.loadedEvent);
            }
            this.sound = null;
            this.started = false;
            this._paused = false;
            this.fadePercent = 1;
            const i = Sound.active.indexOf(this);
            if (i >= 0)
                Sound.active.splice(i, 1);
        }
        return this;
    }
    group(group) {
        this.groups.push(group);
        this.internalUpdateVolume();
        this.internalUpdateMuted();
        return this;
    }
    ungroup(group) {
        const index = this.groups.indexOf(group);
        if (index >= 0) {
            this.groups.splice(index, 1);
            this.internalUpdateVolume();
            this.internalUpdateMuted();
        }
        return this;
    }
    ungroupAll() {
        this.groups = [];
        this.internalUpdateVolume();
        this.internalUpdateMuted();
        return this;
    }
    ingroup(group) {
        return this.groups.indexOf(group) >= 0;
    }
    internalPlay() {
        this.started = true;
        Sound.active.push(this);
        const self = this;
        this.endEvent = () => { self.stop(); };
        this.sound.addEventListener("ended", this.endEvent);
        this.sound.loop = this.loop;
        this.internalUpdateVolume();
        this.internalUpdateMuted();
        if (!this._paused)
            this.sound.play();
    }
    internalUpdateVolume() {
        if (this.started) {
            let groupVolume = 1;
            for (const group of this.groups)
                groupVolume *= audioGroup_1.AudioGroup.volume(group);
            this.sound.volume = this._volume * groupVolume * core_1.Engine.volume;
        }
    }
    internalUpdateMuted() {
        if (this.started) {
            let groupMuted = false;
            for (let i = 0; i < this.groups.length && !groupMuted; i++)
                groupMuted = groupMuted || audioGroup_1.AudioGroup.muted(this.groups[i]);
            this.sound.muted = core_1.Engine.muted || this._muted || groupMuted;
        }
    }
    update() {
        if (this.fadePercent < 1) {
            this.fadePercent = util_1.Calc.approach(this.fadePercent, 1, core_1.Engine.delta / this.fadeDuration);
            this.volume = this.fadeFrom + (this.fadeTo - this.fadeFrom) * this.fadeEase(this.fadePercent);
        }
    }
    fade(volume, duration, ease) {
        this.fadeFrom = this.volume;
        this.fadeTo = volume;
        this.fadeDuration = Math.max(0.001, duration);
        this.fadeEase = (ease !== undefined ? ease : (n) => n);
        this.fadePercent = 0;
        return this;
    }
}
Sound.active = [];
exports.Sound = Sound;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A static reference to all the Assets currently loaded in the game
 */
class Assets {
    /**
     * Unloads all the assets in the entire game
     */
    static unload() {
        // most of these can just lose reference
        Assets.json = {};
        Assets.xml = {};
        Assets.text = {};
        Assets.atlases = {};
        // textures actually need to be unloaded
        for (const path in Assets.textures)
            Assets.textures[path].dispose();
        Assets.textures = {};
        for (const path in Assets.sounds)
            Assets.sounds[path].dispose();
        Assets.sounds = {};
    }
}
Assets.textures = {};
Assets.json = {};
Assets.xml = {};
Assets.text = {};
Assets.sounds = {};
Assets.atlases = {};
exports.Assets = Assets;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fosterWebGLTexture_1 = __webpack_require__(9);
const engine_1 = __webpack_require__(1);
const util_1 = __webpack_require__(0);
/**
 * A Texture used for Rendering
 */
class Texture {
    /**
     * Creates a new Texture from the WebGL Texture
     */
    constructor(texture, bounds, frame) {
        /**
         * The cropped Bounds of the Texture within its WebGL Texture
         */
        this.bounds = null;
        /**
         * The Frame adds padding around the existing Bounds when rendered
         */
        this.frame = null;
        /**
         * A reference to the full WebGL Texture
         */
        this.texture = null;
        /**
         * Metadata attached to this texture
         */
        this.metadata = {};
        this.texture = texture;
        this.bounds = bounds || new util_1.Rectangle(0, 0, texture.width, texture.height);
        this.frame = frame || new util_1.Rectangle(0, 0, this.bounds.width, this.bounds.height);
        this.center = new util_1.Vector(this.frame.width / 2, this.frame.height / 2);
    }
    /**
     * The width of the Texture when rendered (frame.width)
     */
    get width() { return this.frame.width; }
    /**
     * The height of the Texture when rendered (frame.height)
     */
    get height() { return this.frame.height; }
    /**
     * The clipped width of the Texture (bounds.width)
     */
    get clippedWidth() { return this.bounds.width; }
    /**
     * The clipped height of the Texture (bounds.height)
     */
    get clippedHeight() { return this.bounds.height; }
    /**
     * Creates a Subtexture from this texture
     */
    getSubtexture(clip, sub) {
        if (sub === undefined)
            sub = new Texture(this.texture);
        else
            sub.texture = this.texture;
        sub.bounds.x = this.bounds.x + Math.max(0, Math.min(this.bounds.width, clip.x + this.frame.x));
        sub.bounds.y = this.bounds.y + Math.max(0, Math.min(this.bounds.height, clip.y + this.frame.y));
        sub.bounds.width = Math.max(0, this.bounds.x + Math.min(this.bounds.width, clip.x + this.frame.x + clip.width) - sub.bounds.x);
        sub.bounds.height = Math.max(0, this.bounds.y + Math.min(this.bounds.height, clip.y + this.frame.y + clip.height) - sub.bounds.y);
        sub.frame.x = Math.min(0, this.frame.x + clip.x);
        sub.frame.y = Math.min(0, this.frame.y + clip.y);
        sub.frame.width = clip.width;
        sub.frame.height = clip.height;
        sub.center = new util_1.Vector(sub.frame.width / 2, sub.frame.height / 2);
        return sub;
    }
    /**
     * Creates a clone of this texture
     */
    clone() {
        return new Texture(this.texture, this.bounds.clone(), this.frame.clone());
    }
    toString() {
        return (this.texture.path +
            ":[" + this.bounds.x + ", " + this.bounds.y + ", " + this.bounds.width + ", " + this.bounds.height + "]" +
            "frame[" + this.frame.x + ", " + this.frame.y + ", " + this.frame.width + ", " + this.frame.height + "]");
    }
    /**
     * Draws this texture
     */
    draw(position, origin, scale, rotation, color, flipX, flipY) {
        engine_1.Engine.graphics.texture(this, position.x, position.y, null, color, origin, scale, rotation, flipX, flipY);
    }
    /**
     * Draws a cropped version of this texture
     */
    drawCropped(position, crop, origin, scale, rotation, color, flipX, flipY) {
        engine_1.Engine.graphics.texture(this, position.x, position.y, crop, color, origin, scale, rotation, flipX, flipY);
    }
    /**
     * Draws this texture, center aligned
     */
    drawCenter(position, scale, rotation, color, flipX, flipY) {
        engine_1.Engine.graphics.texture(this, position.x, position.y, null, color, this.center, scale, rotation, flipX, flipY);
    }
    /**
     * Draws a cropped version of this texture, center aligned
     */
    drawCenterCropped(position, crop, scale, rotation, color, flipX, flipY) {
        engine_1.Engine.graphics.texture(this, position.x, position.y, crop, color, new util_1.Vector(crop.width / 2, crop.height / 2), scale, rotation, flipX, flipY);
    }
    /**
     * Draws this texture, justified
     */
    drawJustify(position, justify, scale, rotation, color, flipX, flipY) {
        engine_1.Engine.graphics.texture(this, position.x, position.y, null, color, new util_1.Vector(this.width * justify.x, this.height * justify.y), scale, rotation, flipX, flipY);
    }
    /**
     * Draws a cropped version of this texture, justified
     */
    drawJustifyCropped(position, crop, justify, scale, rotation, color, flipX, flipY) {
        engine_1.Engine.graphics.texture(this, position.x, position.y, crop, color, new util_1.Vector(crop.width * justify.x, crop.height * justify.y), scale, rotation, flipX, flipY);
    }
    /**
     * Disposes this texture and its WebGL Texture
     */
    dispose() {
        this.texture.dispose();
        this.texture = null;
    }
    /**
     * Creats a new Texture from an HTML Image Element
     */
    static create(image) {
        const gl = engine_1.Engine.graphics.gl;
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return new Texture(new fosterWebGLTexture_1.FosterWebGLTexture(tex, image.width, image.height));
    }
    /**
     * Creates a new Texture from the given RGBA array
     */
    static createFromData(data, width, height) {
        const gl = engine_1.Engine.graphics.gl;
        const tex = gl.createTexture();
        // convert data into bytes (0-1 to 0-255)
        const input = [];
        for (let i = 0; i < data.length; i++)
            input[i] = Math.floor(data[i] * 255);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(input));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        return new Texture(new fosterWebGLTexture_1.FosterWebGLTexture(tex, width, height));
    }
}
exports.Texture = Texture;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = Electron;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __webpack_require__(0);
const renderer_1 = __webpack_require__(10);
/**
 * Uses the Texture Shader when rendering
 */
class SpriteRenderer extends renderer_1.Renderer {
    constructor() {
        super();
        this.shader = util_1.Shaders.texture;
        this.shaderCameraUniformName = "matrix";
    }
}
exports.SpriteRenderer = SpriteRenderer;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var collider_1 = __webpack_require__(5);
exports.Collider = collider_1.Collider;
var hitbox_1 = __webpack_require__(49);
exports.Hitbox = hitbox_1.Hitbox;
var hitgrid_1 = __webpack_require__(50);
exports.Hitgrid = hitgrid_1.Hitgrid;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const component_1 = __webpack_require__(2);
const util_1 = __webpack_require__(0);
class Graphic extends component_1.Component {
    constructor(texture, position) {
        super();
        this.scale = new util_1.Vector(1, 1);
        this.origin = new util_1.Vector(0, 0);
        this.rotation = 0;
        this.flipX = false;
        this.flipY = false;
        this.color = util_1.Color.white.clone();
        this.alpha = 1;
        if (texture != null) {
            this.texture = texture;
            this.crop = new util_1.Rectangle(0, 0, texture.width, texture.height);
        }
        if (position)
            this.position.copy(position);
    }
    get width() { return this.crop ? this.crop.width : (this.texture ? this.texture.width : 0); }
    get height() { return this.crop ? this.crop.height : (this.texture ? this.texture.height : 0); }
    center() {
        this.justify(0.5, 0.5);
    }
    justify(x, y) {
        this.origin.set(this.width * x, this.height * y);
    }
    render(camera) {
        engine_1.Engine.graphics.texture(this.texture, this.scenePosition.x, this.scenePosition.y, this.crop, util_1.Color.temp.copy(this.color).mult(this.alpha), this.origin, this.scale, this.rotation, this.flipX, this.flipY);
    }
}
exports.Graphic = Graphic;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __webpack_require__(0);
class ParticleTemplate {
    constructor(name) {
        this.texture = null;
        this.speedBase = 0;
        this.speedRange = 0;
        this.accelBaseX = 0;
        this.accelRangeX = 0;
        this.accelBaseY = 0;
        this.accelRangeY = 0;
        this.frictionBaseX = 0;
        this.frictionRangeX = 0;
        this.frictionBaseY = 0;
        this.frictionRangeY = 0;
        this.colorsFrom = [util_1.Color.white];
        this.colorsTo = [util_1.Color.white];
        this.colorEaser = util_1.Ease.linear;
        this.alphaFromBase = 1;
        this.alphaFromRange = 0;
        this.alphaToBase = 1;
        this.alphaToRange = 0;
        this.alphaEaser = util_1.Ease.linear;
        this.rotationFromBase = 0;
        this.rotationFromRange = 0;
        this.rotationToBase = 0;
        this.rotationToRange = 0;
        this.rotationEaser = util_1.Ease.linear;
        this.scaleFromBaseX = 1;
        this.scaleFromRangeX = 0;
        this.scaleToBaseX = 1;
        this.scaleToRangeX = 0;
        this.scaleXEaser = util_1.Ease.linear;
        this.scaleFromBaseY = 1;
        this.scaleFromRangeY = 0;
        this.scaleToBaseY = 1;
        this.scaleToRangeY = 0;
        this.scaleYEaser = util_1.Ease.linear;
        this.durationBase = 1;
        this.durationRange = 1;
        this.name = name;
        ParticleTemplate.templates[name] = this;
    }
    tex(texture) {
        this.texture = texture;
        return this;
    }
    speed(Base, Range) {
        this.speedBase = Base;
        this.speedRange = Range || 0;
        return this;
    }
    accelX(Base, Range) {
        this.accelBaseX = Base;
        this.accelRangeX = Range || 0;
        return this;
    }
    accelY(Base, Range) {
        this.accelBaseY = Base;
        this.accelRangeY = Range || 0;
        return this;
    }
    frictionX(Base, Range) {
        this.frictionBaseX = Base;
        this.frictionRangeX = Range || 0;
        return this;
    }
    frictionY(Base, Range) {
        this.frictionBaseY = Base;
        this.frictionRangeY = Range || 0;
        return this;
    }
    colors(from, to) {
        this.colorsFrom = from;
        this.colorsTo = to || from;
        return this;
    }
    colorEase(easer) {
        this.colorEaser = easer;
        return this;
    }
    alpha(Base, Range) {
        this.alphaFrom(Base, Range);
        this.alphaTo(Base, Range);
        return this;
    }
    alphaFrom(Base, Range) {
        this.alphaFromBase = Base;
        this.alphaFromRange = Range || 0;
        return this;
    }
    alphaTo(Base, Range) {
        this.alphaToBase = Base;
        this.alphaToRange = Range || 0;
        return this;
    }
    alphaEase(easer) {
        this.alphaEaser = easer;
        return this;
    }
    rotation(Base, Range) {
        this.rotationFrom(Base, Range);
        this.rotationTo(Base, Range);
        return this;
    }
    rotationFrom(Base, Range) {
        this.rotationFromBase = Base;
        this.rotationFromRange = Range || 0;
        return this;
    }
    rotationTo(Base, Range) {
        this.rotationToBase = Base;
        this.rotationToRange = Range || 0;
        return this;
    }
    rotationEase(easer) {
        this.rotationEaser = easer;
        return this;
    }
    scale(Base, Range) {
        this.scaleFrom(Base, Range);
        this.scaleTo(Base, Range);
        return this;
    }
    scaleFrom(Base, Range) {
        this.scaleFromX(Base, Range);
        this.scaleFromY(Base, Range);
        return this;
    }
    scaleTo(Base, Range) {
        this.scaleToX(Base, Range);
        this.scaleToY(Base, Range);
        return this;
    }
    scaleEase(easer) {
        this.scaleXEaser = easer;
        this.scaleYEaser = easer;
        return this;
    }
    scaleX(Base, Range) {
        this.scaleFromX(Base, Range);
        this.scaleToX(Base, Range);
        return this;
    }
    scaleFromX(Base, Range) {
        this.scaleFromBaseX = Base;
        this.scaleFromRangeX = Range || 0;
        return this;
    }
    scaleToX(Base, Range) {
        this.scaleToBaseX = Base;
        this.scaleToRangeX = Range || 0;
        return this;
    }
    scaleY(Base, Range) {
        this.scaleFromY(Base, Range);
        this.scaleToY(Base, Range);
        return this;
    }
    scaleXEase(easer) {
        this.scaleXEaser = easer;
        return this;
    }
    scaleFromY(Base, Range) {
        this.scaleFromBaseY = Base;
        this.scaleFromRangeY = Range || 0;
        return this;
    }
    scaleToY(Base, Range) {
        this.scaleToBaseY = Base;
        this.scaleToRangeY = Range || 0;
        return this;
    }
    scaleYEase(easer) {
        this.scaleYEaser = easer;
        return this;
    }
    duration(Base, Range) {
        this.durationBase = Base;
        this.durationRange = Range || 0;
        return this;
    }
}
ParticleTemplate.templates = {};
exports.ParticleTemplate = ParticleTemplate;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// foster
// https://github.com/noelfb/foster
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(3));
__export(__webpack_require__(0));
__export(__webpack_require__(48));
__export(__webpack_require__(61));
__export(__webpack_require__(6));
__export(__webpack_require__(4));


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(11));
__export(__webpack_require__(34));
__export(__webpack_require__(15));


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const matrix_1 = __webpack_require__(7);
const vector_1 = __webpack_require__(8);
const rectangle_1 = __webpack_require__(13);
const core_1 = __webpack_require__(3);
const input_1 = __webpack_require__(6);
/**
 * Camera used to create a Matrix during rendering. Scenes and Renderers may have Cameras
 */
class Camera {
    constructor() {
        this.position = new vector_1.Vector(0, 0);
        this.origin = new vector_1.Vector(0, 0);
        this.scale = new vector_1.Vector(1, 1);
        this.rotation = 0;
        this._matrix = new matrix_1.Matrix();
        this._internal = new matrix_1.Matrix();
        this._mouse = new vector_1.Vector();
        this.extentsA = new vector_1.Vector();
        this.extentsB = new vector_1.Vector();
        this.extentsC = new vector_1.Vector();
        this.extentsD = new vector_1.Vector();
        this.extentsRect = new rectangle_1.Rectangle();
    }
    get x() { return this.position.x; }
    set x(n) { this.position.x = n; }
    get y() { return this.position.y; }
    set y(n) { this.position.y = n; }
    get internal() {
        return this._internal.identity()
            .translate(this.origin.x, this.origin.y)
            .rotate(this.rotation)
            .scale(this.scale.x, this.scale.y)
            .translate(-this.position.x, -this.position.y);
    }
    get matrix() {
        return this._matrix
            .copy(core_1.Engine.graphics.orthographic)
            .multiply(this.internal);
    }
    get mouse() {
        return this._mouse.set(input_1.Mouse.x + this.position.x - this.origin.x, input_1.Mouse.y + this.position.y - this.origin.y).transform(this.internal.invert());
    }
    getExtents() {
        const inverse = this.internal.invert();
        this.extentsA.set(0, 0).transform(inverse);
        this.extentsB.set(core_1.Engine.width, 0).transform(inverse);
        this.extentsC.set(0, core_1.Engine.height).transform(inverse);
        this.extentsD.set(core_1.Engine.width, core_1.Engine.height).transform(inverse);
    }
    get extents() {
        this.getExtents();
        const r = this.extentsRect;
        r.x = Math.min(this.extentsA.x, this.extentsB.x, this.extentsC.x, this.extentsD.x);
        r.y = Math.min(this.extentsA.y, this.extentsB.y, this.extentsC.y, this.extentsD.y);
        r.width = Math.max(this.extentsA.x, this.extentsB.x, this.extentsC.x, this.extentsD.x) - r.x;
        r.height = Math.max(this.extentsA.y, this.extentsB.y, this.extentsC.y, this.extentsD.y) - r.y;
        return r;
    }
}
exports.Camera = Camera;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Keyboard {
    static init() {
        window.addEventListener("keydown", (e) => {
            Keyboard._next[e.keyCode] = true;
        });
        window.addEventListener("keyup", (e) => {
            Keyboard._next[e.keyCode] = false;
        });
    }
    static update() {
        for (let i = 0; i < 256; i++) {
            Keyboard._last[i] = Keyboard._down[i];
            Keyboard._down[i] = Keyboard._next[i];
        }
    }
    static check(key) {
        if (isNaN(key))
            return Keyboard.mapCheck(key);
        return (Keyboard._down[key] === true);
    }
    static pressed(key) {
        if (isNaN(key))
            return Keyboard.mapPressed(key);
        return (Keyboard._down[key] === true && !Keyboard._last[key]);
    }
    static released(key) {
        if (isNaN(key))
            return Keyboard.mapReleased(key);
        return (!Keyboard._down[key] && Keyboard._last[key] === true);
    }
    static map(name, keys) {
        if (!Keyboard._map[name])
            Keyboard._map[name] = [];
        for (const key of keys)
            Keyboard._map[name].push(key);
    }
    static maps(list) {
        for (const name in list)
            Keyboard.map(name, list[name]);
    }
    static mapCheck(key) {
        if (Keyboard._map[key] !== undefined)
            for (const mapping of Keyboard._map[key])
                if (Keyboard.check(mapping))
                    return true;
        return false;
    }
    static mapPressed(key) {
        if (Keyboard._map[key] !== undefined)
            for (const mapping of Keyboard._map[key])
                if (Keyboard.pressed(mapping))
                    return true;
        return false;
    }
    static mapReleased(key) {
        if (Keyboard._map[key] !== undefined)
            for (const mapping of Keyboard._map[key])
                if (Keyboard.released(mapping))
                    return true;
        return false;
    }
}
Keyboard._down = [];
Keyboard._last = [];
Keyboard._next = [];
Keyboard._map = {};
exports.Keyboard = Keyboard;
var Key;
(function (Key) {
    Key[Key["backspace"] = 8] = "backspace";
    Key[Key["tab"] = 9] = "tab";
    Key[Key["enter"] = 13] = "enter";
    Key[Key["shift"] = 16] = "shift";
    Key[Key["ctrl"] = 17] = "ctrl";
    Key[Key["alt"] = 18] = "alt";
    Key[Key["pause"] = 19] = "pause";
    Key[Key["capslock"] = 20] = "capslock";
    Key[Key["escape"] = 27] = "escape";
    Key[Key["space"] = 32] = "space";
    Key[Key["pageUp"] = 33] = "pageUp";
    Key[Key["pageDown"] = 34] = "pageDown";
    Key[Key["end"] = 35] = "end";
    Key[Key["home"] = 36] = "home";
    Key[Key["left"] = 37] = "left";
    Key[Key["up"] = 38] = "up";
    Key[Key["right"] = 39] = "right";
    Key[Key["down"] = 40] = "down";
    Key[Key["insert"] = 45] = "insert";
    Key[Key["del"] = 46] = "del";
    Key[Key["zero"] = 48] = "zero";
    Key[Key["one"] = 49] = "one";
    Key[Key["two"] = 50] = "two";
    Key[Key["three"] = 51] = "three";
    Key[Key["four"] = 52] = "four";
    Key[Key["five"] = 53] = "five";
    Key[Key["six"] = 54] = "six";
    Key[Key["seven"] = 55] = "seven";
    Key[Key["eight"] = 56] = "eight";
    Key[Key["nine"] = 57] = "nine";
    Key[Key["a"] = 65] = "a";
    Key[Key["b"] = 66] = "b";
    Key[Key["c"] = 67] = "c";
    Key[Key["d"] = 68] = "d";
    Key[Key["e"] = 69] = "e";
    Key[Key["f"] = 70] = "f";
    Key[Key["g"] = 71] = "g";
    Key[Key["h"] = 72] = "h";
    Key[Key["i"] = 73] = "i";
    Key[Key["j"] = 74] = "j";
    Key[Key["k"] = 75] = "k";
    Key[Key["l"] = 76] = "l";
    Key[Key["m"] = 77] = "m";
    Key[Key["n"] = 78] = "n";
    Key[Key["o"] = 79] = "o";
    Key[Key["p"] = 80] = "p";
    Key[Key["q"] = 81] = "q";
    Key[Key["r"] = 82] = "r";
    Key[Key["s"] = 83] = "s";
    Key[Key["t"] = 84] = "t";
    Key[Key["u"] = 85] = "u";
    Key[Key["v"] = 86] = "v";
    Key[Key["w"] = 87] = "w";
    Key[Key["x"] = 88] = "x";
    Key[Key["y"] = 89] = "y";
    Key[Key["z"] = 90] = "z";
    Key[Key["leftWindow"] = 91] = "leftWindow";
    Key[Key["rightWindow"] = 92] = "rightWindow";
    Key[Key["select"] = 93] = "select";
    Key[Key["numpad0"] = 96] = "numpad0";
    Key[Key["numpad1"] = 97] = "numpad1";
    Key[Key["numpad2"] = 98] = "numpad2";
    Key[Key["numpad3"] = 99] = "numpad3";
    Key[Key["numpad4"] = 100] = "numpad4";
    Key[Key["numpad5"] = 101] = "numpad5";
    Key[Key["numpad6"] = 102] = "numpad6";
    Key[Key["numpad7"] = 103] = "numpad7";
    Key[Key["numpad8"] = 104] = "numpad8";
    Key[Key["numpad9"] = 105] = "numpad9";
    Key[Key["multiply"] = 106] = "multiply";
    Key[Key["add"] = 107] = "add";
    Key[Key["subtract"] = 109] = "subtract";
    Key[Key["decimal"] = 110] = "decimal";
    Key[Key["divide"] = 111] = "divide";
    Key[Key["f1"] = 112] = "f1";
    Key[Key["f2"] = 113] = "f2";
    Key[Key["f3"] = 114] = "f3";
    Key[Key["f4"] = 115] = "f4";
    Key[Key["f5"] = 116] = "f5";
    Key[Key["f6"] = 117] = "f6";
    Key[Key["f7"] = 118] = "f7";
    Key[Key["f8"] = 119] = "f8";
    Key[Key["f9"] = 120] = "f9";
    Key[Key["f10"] = 121] = "f10";
    Key[Key["f11"] = 122] = "f11";
    Key[Key["f12"] = 123] = "f12";
    Key[Key["numlock"] = 144] = "numlock";
    Key[Key["scrollLock"] = 145] = "scrollLock";
    Key[Key["semicolon"] = 186] = "semicolon";
    Key[Key["equal"] = 187] = "equal";
    Key[Key["comma"] = 188] = "comma";
    Key[Key["dash"] = 189] = "dash";
    Key[Key["period"] = 190] = "period";
    Key[Key["forwardSlash"] = 191] = "forwardSlash";
    Key[Key["graveAccent"] = 192] = "graveAccent";
    Key[Key["openBracket"] = 219] = "openBracket";
    Key[Key["backSlash"] = 220] = "backSlash";
    Key[Key["closeBraket"] = 221] = "closeBraket";
    Key[Key["singleQuote"] = 222] = "singleQuote";
})(Key = exports.Key || (exports.Key = {}));


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(3);
const util_1 = __webpack_require__(0);
class Mouse {
    static get x() { return this._position.x; }
    static get y() { return this._position.y; }
    static get position() { return new util_1.Vector(this._position.x, this._position.y); }
    static get left() { return this._left; }
    static get leftPressed() { return this._left && !this._leftWas; }
    static get leftReleased() { return !this._left && this._leftWas; }
    static get right() { return this._right; }
    static get rightPressed() { return this._right && !this._rightWas; }
    static get rightReleased() { return !this._right && this._rightWas; }
    static init() {
        Mouse.absolute = new util_1.Vector(0, 0);
        Mouse._position = new util_1.Vector(0, 0);
        Mouse._positionNext = new util_1.Vector(0, 0);
        core_1.Engine.root.addEventListener("mousemove", (e) => {
            Mouse.absolute = new util_1.Vector(e.pageX, e.pageY);
            Mouse.setNextMouseTo(e.pageX, e.pageY);
        });
        core_1.Engine.root.addEventListener("mousedown", (e) => {
            if (e.button === 0)
                Mouse._leftNext = true;
            else
                Mouse._rightNext = true;
        });
        core_1.Engine.root.addEventListener("mouseup", (e) => {
            if (e.button === 0)
                Mouse._leftNext = false;
            else
                Mouse._rightNext = false;
        });
    }
    static update() {
        this._leftWas = this._left;
        this._left = this._leftNext;
        this._rightWas = this._right;
        this._right = this._rightNext;
        /*
        // TODO:SOLVE THIS?
        // this doesn't work because the GameWindow.screenLeft/Top include the Window border
        // if there's a way to get the inner Left/Top then this would be super good as the mouse would
        // update even when out of the window bounds

        // alternatively could measure the difference when the mouse moves, and then use that ... but ugh that's gross

        if (Engine.client == Client.Desktop)
        {
            var screenMouse = GameWindow.screenMouse;
            screenMouse.x -= GameWindow.screenLeft;
            screenMouse.y -= GameWindow.screenTop;
            Mouse.setNextMouseTo(screenMouse.x, screenMouse.y);
        }
        */
        this._position = this._positionNext;
    }
    static setNextMouseTo(pageX, pageY) {
        const screen = core_1.Engine.graphics.canvas.getBoundingClientRect();
        const scaled = core_1.Engine.graphics.getOutputBounds();
        const scale = new util_1.Vector(scaled.width / core_1.Engine.width, scaled.height / core_1.Engine.height);
        // mouse position in the gameplay view
        const was = Mouse._positionNext;
        Mouse._positionNext = new util_1.Vector((pageX - screen.left - scaled.left) / scale.x, (pageY - screen.top - scaled.top) / scale.y);
    }
}
exports.Mouse = Mouse;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Color {
    constructor(r, g, b, a) {
        this.color = [0, 0, 0, 1];
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 1;
    }
    /**
     * The Red component (0 - 1)
     */
    get r() { return this.color[0]; }
    set r(v) { this.color[0] = Math.min(1, Math.max(0, v)); }
    /**
     * The Green component (0 - 1)
     */
    get g() { return this.color[1]; }
    set g(v) { this.color[1] = Math.min(1, Math.max(0, v)); }
    /**
     * The Blue component (0 - 1)
     */
    get b() { return this.color[2]; }
    set b(v) { this.color[2] = Math.min(1, Math.max(0, v)); }
    /**
     * The Alpha component (0 - 1)
     */
    get a() { return this.color[3]; }
    set a(v) { this.color[3] = Math.min(1, Math.max(0, v)); }
    /**
     * Array of components, ordered RGBA
     */
    get rgba() { return this.color; }
    set(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        return this;
    }
    copy(color) {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
        return this;
    }
    lerp(a, b, p) {
        this.r = a.r + (b.r - a.r) * p;
        this.g = a.g + (b.g - a.g) * p;
        this.b = a.b + (b.b - a.b) * p;
        this.a = a.a + (b.a - a.a) * p;
        return this;
    }
    clone() {
        return new Color().copy(this);
    }
    mult(alpha) {
        return this.set(this.r, this.g, this.b, this.a * alpha);
    }
}
Color.white = new Color(1, 1, 1, 1);
Color.black = new Color(0, 0, 0, 1);
Color.red = new Color(1, 0, 0, 1);
Color.green = new Color(0, 1, 0, 1);
Color.blue = new Color(0, 0, 1, 1);
Color.temp = new Color();
exports.Color = Color;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default Ease methods for Tweening
 */
class Ease {
    static linear(t) {
        return t;
    }
    static quadIn(t) {
        return t * t;
    }
    static quadOut(t) {
        return 1 - Ease.quadIn(1 - t);
    }
    static quadInOut(t) {
        return (t <= 0.5) ? Ease.quadIn(t * 2) / 2 : Ease.quadOut(t * 2 - 1) / 2 + 0.5;
    }
    static cubeIn(t) {
        return t * t * t;
    }
    static cubeOut(t) {
        return 1 - Ease.cubeIn(1 - t);
    }
    static cubeInOut(t) {
        return (t <= 0.5) ? Ease.cubeIn(t * 2) / 2 : Ease.cubeOut(t * 2 - 1) / 2 + 0.5;
    }
    static backIn(t) {
        return t * t * (2.70158 * t - 1.70158);
    }
    static backOut(t) {
        return 1 - Ease.backIn(1 - t);
    }
    static backInOut(t) {
        return (t <= 0.5) ? Ease.backIn(t * 2) / 2 : Ease.backOut(t * 2 - 1) / 2 + 0.5;
    }
    static expoIn(t) {
        return Math.pow(2, 10 * (t - 1));
    }
    static expoOut(t) {
        return 1 - Ease.expoIn(t);
    }
    static expoInOut(t) {
        return t < .5 ? Ease.expoIn(t * 2) / 2 : Ease.expoOut(t * 2) / 2;
    }
    static sineIn(t) {
        return -Math.cos((Math.PI / 2) * t) + 1;
    }
    static sineOut(t) {
        return Math.sin((Math.PI / 2) * t);
    }
    static sineInOut(t) {
        return -Math.cos(Math.PI * t) / 2 + .5;
    }
    static elasticInOut(t) {
        t /= 0.5;
        if (t === 2)
            return 1;
        const p = (0.3 * 1.5);
        const s = p / 4;
        if (t < 1)
            return -0.5 * (Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
        return Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
    }
    static arc(t, ease) {
        if (t < 0.5)
            return 1 - ease(1 - t * 2);
        return (1 - ease((t - 0.5) * 2));
    }
}
exports.Ease = Ease;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Custom list class that allows entries to be removed while the list is being iterated over
 * Used for Entity and Renderer lists (so you can iterate over entities and remove them)
 */
class ObjectList {
    constructor() {
        this.objects = [];
        this._count = 0;
    }
    get count() { return this._count; }
    /**
     * Adds an object to the List
     * @param object the object to add
     */
    add(object) {
        this.objects.push(object);
        this._count++;
        this.unsorted = true;
        return object;
    }
    /**
     * Gets the first entry in the list
     */
    first() {
        let entry = null;
        for (let i = 0; i < this.objects.length && entry == null; i++)
            entry = this.objects[i];
        return entry;
    }
    /**
     * Iterates over every object in the List. Return false in the callback to break
     * @param callback
     */
    each(callback) {
        const count = this.objects.length;
        for (let i = 0; i < count; i++)
            if (this.objects[i] != null)
                if (callback(this.objects[i]) === false)
                    break;
    }
    /**
     * Gets an object at the given index
     * @param index
     */
    at(index) {
        for (let i = index; i < this.objects.length; i++)
            if (this.objects[i] != null)
                return this.objects[i];
        return null;
    }
    /**
     * Sorts the list by the compare function
     * @param compare
     */
    sort(compare) {
        if (this.unsorted) {
            for (let i = 0; i < this.objects.length - 1; ++i) {
                let j = i + 1;
                while (j > 0 && this.objects[j - 1] != null && this.objects[j] != null && compare(this.objects[j - 1], this.objects[j]) > 0) {
                    const temp = this.objects[j - 1];
                    this.objects[j - 1] = this.objects[j];
                    this.objects[j--] = temp;
                }
            }
            this.unsorted = false;
        }
    }
    /**
     * Removes the given object from the list. Returns true if removed
     * @param object
     */
    remove(object) {
        const index = this.objects.indexOf(object);
        if (index >= 0) {
            this.objects[index] = null;
            this._count--;
            this.dirty = true;
            return true;
        }
        return false;
    }
    /**
     * Clears the entire list
     */
    clear() {
        for (let i = 0; i < this.objects.length; i++)
            this.objects[i] = null;
        this._count = 0;
        this.dirty = true;
    }
    /**
     * Cleans the list (removing null entries)
     */
    clean() {
        if (this.dirty) {
            if (this.count <= 0)
                this.objects = [];
            else {
                for (let i = this.objects.length - 1; i >= 0; i--)
                    if (this.objects[i] == null)
                        this.objects.splice(i, 1);
            }
        }
    }
}
exports.ObjectList = ObjectList;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Shader = __webpack_require__(14);
/**
 * Default 2D shaders
 */
/// <reference path="./shader.ts"/>
class Shaders {
    /**
     * Initializes Default Shaders (called automatically by the Engine)
     */
    static init() {
        // Default Texture Shader
        Shaders.texture = new Shader.Program(
        // vertex shader
        "attribute vec2 a_position;" +
            "attribute vec2 a_texcoord;" +
            "attribute vec4 a_color;" +
            "uniform mat3 matrix;" +
            "varying vec2 v_texcoord;" +
            "varying vec4 v_color;" +
            "void main()" +
            "{" +
            "	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);" +
            "	v_texcoord = a_texcoord;" +
            "	v_color = vec4(a_color.rgb * a_color.a, a_color.a);" +
            "}", 
        // fragment shader
        "precision mediump float;" +
            "varying vec2 v_texcoord;" +
            "varying vec4 v_color;" +
            "uniform sampler2D texture;" +
            "void main() " +
            "{" +
            "	gl_FragColor = texture2D(texture, v_texcoord) * v_color;" +
            "}", [
            new Shader.Uniform("matrix", Shader.UniformType.matrix3d),
            new Shader.Uniform("texture", Shader.UniformType.sampler2D),
        ], [
            new Shader.Attribute("a_position", Shader.AttributeType.Position),
            new Shader.Attribute("a_texcoord", Shader.AttributeType.Texcoord),
            new Shader.Attribute("a_color", Shader.AttributeType.Color),
        ]);
        // solid color shader over texture
        Shaders.solid = new Shader.Program(
        // vertex shader
        "attribute vec2 a_position;" +
            "attribute vec2 a_texcoord;" +
            "attribute vec4 a_color;" +
            "uniform mat3 matrix;" +
            "varying vec2 v_texcoord;" +
            "varying vec4 v_color;" +
            "void main()" +
            "{" +
            "	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);" +
            "	v_texcoord = a_texcoord;" +
            "	v_color = a_color;" +
            "}", 
        // fragment shader
        "precision mediump float;" +
            "varying vec2 v_texcoord;" +
            "varying vec4 v_color;" +
            "uniform sampler2D texture;" +
            "void main() " +
            "{" +
            "	gl_FragColor = v_color * texture2D(texture, v_texcoord).a;" +
            "}", [
            new Shader.Uniform("matrix", Shader.UniformType.matrix3d),
            new Shader.Uniform("texture", Shader.UniformType.sampler2D),
        ], [
            new Shader.Attribute("a_position", Shader.AttributeType.Position),
            new Shader.Attribute("a_texcoord", Shader.AttributeType.Texcoord),
            new Shader.Attribute("a_color", Shader.AttributeType.Color),
        ]);
        // Primitive shader (no texture)
        Shaders.primitive = new Shader.Program(
        // vertex shader
        "attribute vec2 a_position;" +
            "attribute vec4 a_color;" +
            "uniform mat3 matrix;" +
            "varying vec4 v_color;" +
            "void main()" +
            "{" +
            "	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);" +
            "	v_color = a_color;" +
            "}", 
        // fragment shader
        "precision mediump float;" +
            "varying vec4 v_color;" +
            "void main() " +
            "{" +
            "	gl_FragColor = v_color;" +
            "}", [
            new Shader.Uniform("matrix", Shader.UniformType.matrix3d),
        ], [
            new Shader.Attribute("a_position", Shader.AttributeType.Position),
            new Shader.Attribute("a_color", Shader.AttributeType.Color),
        ]);
    }
}
exports.Shaders = Shaders;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const spriteTemplate_1 = __webpack_require__(15);
/**
 * Sprite Bank holds all the Sprite templates in the game
 */
class SpriteBank {
    /**
     * Creates a new Animation Set of the given Name
     */
    static create(name) {
        const animSet = new spriteTemplate_1.SpriteTemplate(name);
        SpriteBank.bank[name] = animSet;
        return animSet;
    }
    /**
     * Gets an Animation of the given name
     */
    static get(name) {
        return SpriteBank.bank[name];
    }
    /**
     * Checks if an animation with the given name exists
     */
    static has(name) {
        return SpriteBank.bank[name] !== undefined;
    }
}
/**
 * Reference to all the Animations
 */
SpriteBank.bank = {};
exports.SpriteBank = SpriteBank;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(16));
__export(__webpack_require__(36));
__export(__webpack_require__(17));


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AudioSource {
    constructor(path, first) {
        this.sounds = [];
        this.path = path;
        if (first)
            this.sounds.push(first);
    }
    /**
     * Gets a new instance of the sound from cache or file
     */
    requestSound() {
        if (this.sounds.length > 0) {
            const source = this.sounds[0];
            this.sounds.splice(0, 1);
            return source;
        }
        else if (this.sounds.length < AudioSource.maxInstances) {
            const source = new Audio();
            source.src = this.path;
            return source;
        }
        else
            return null;
    }
    /**
     * Returns the sound instance so it can be used again
     */
    returnSound(sound) {
        this.sounds.push(sound);
    }
    /**
     * Not Implemented
     */
    dispose() {
        console.warn("AudioSource.dipose not implemented");
    }
}
AudioSource.maxInstances = 50;
exports.AudioSource = AudioSource;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(38));
__export(__webpack_require__(9));
__export(__webpack_require__(39));
__export(__webpack_require__(19));


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const texture_1 = __webpack_require__(19);
const util_1 = __webpack_require__(0);
/**
 * A single Texture which contains subtextures by name
 */
class Atlas {
    constructor(name, texture, data, reader) {
        /**
         * Dictionary of the Subtextures within this atlas
         */
        this.subtextures = {};
        this.name = name;
        this.texture = texture;
        this.reader = reader;
        this.data = data;
        this.reader(data, this);
    }
    /**
     * Gets a specific subtexture from the atlas
     * @param name 	the name/path of the subtexture
     */
    get(name) {
        return this.subtextures[name];
    }
    /**
     * Checks if a subtexture exists
     * @param name 	the name/path of the subtexture
     */
    has(name) {
        return this.subtextures[name] !== undefined;
    }
    /**
     * Gets a list of textures
     */
    list(prefix, names) {
        const listed = [];
        for (const name of names)
            listed.push(this.get(prefix + name));
        return listed;
    }
    /**
     * Finds all subtextures with the given prefix
     */
    find(prefix) {
        // find all textures
        const found = [];
        for (const key in this.subtextures) {
            if (key.indexOf(prefix) === 0)
                found.push({ name: key, tex: this.subtextures[key] });
        }
        // sort textures by name
        found.sort((a, b) => {
            return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
        });
        // get sorted list
        const listed = [];
        for (const f of found)
            listed.push(f.tex);
        return listed;
    }
}
exports.Atlas = Atlas;
/**
 * Default Atlas Readers
 */
class AtlasReaders {
    /**
     * Parses Aseprite data from the atlas
     */
    static Aseprite(data, into) {
        const json = JSON.parse(data);
        const frames = json.frames;
        for (const path of Object.keys(frames)) {
            const name = path.replace(".ase", "").replace(".png", "");
            const obj = frames[path];
            const bounds = obj.frame;
            let tex;
            if (obj.trimmed) {
                const source = obj.spriteSourceSize;
                const size = obj.sourceSize;
                tex = new texture_1.Texture(into.texture.texture, new util_1.Rectangle(bounds.x, bounds.y, bounds.w, bounds.h), new util_1.Rectangle(-source.x, -source.y, size.w, size.h));
            }
            else {
                tex = new texture_1.Texture(into.texture.texture, new util_1.Rectangle(bounds.x, bounds.y, bounds.w, bounds.h));
            }
            if (obj.duration !== undefined)
                tex.metadata.duration = parseInt(obj.duration, 10);
            into.subtextures[name] = tex;
        }
    }
}
exports.AtlasReaders = AtlasReaders;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fosterWebGLTexture_1 = __webpack_require__(9);
const engine_1 = __webpack_require__(1);
/**
 * The Render Target is used for rendering graphics to
 */
class RenderTarget {
    /**
     * The width of the Render Target
     */
    get width() { return this.texture.width; }
    /**
     * The height of the Render Target
     */
    get height() { return this.texture.height; }
    /**
     * Creates a new Render Target. use RenderTarget.create() for quick access
     */
    constructor(buffer, texture, vertexBuffer, colorBuffer, texcoordBuffer) {
        this.texture = texture;
        this.frameBuffer = buffer;
        this.vertexBuffer = vertexBuffer;
        this.colorBuffer = colorBuffer;
        this.texcoordBuffer = texcoordBuffer;
    }
    /**
     * Disposes the Render Target and all its textures and buffers
     */
    dispose() {
        this.texture.dispose();
        this.texture = null;
        const gl = engine_1.Engine.graphics.gl;
        gl.deleteFramebuffer(this.frameBuffer);
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteBuffer(this.texcoordBuffer);
        gl.deleteBuffer(this.colorBuffer);
        this.frameBuffer = null;
        this.vertexBuffer = null;
        this.texcoordBuffer = null;
        this.colorBuffer = null;
    }
    /**
     * Creates a new Render Target of the given width and height
     */
    static create(width, height) {
        const gl = engine_1.Engine.graphics.gl;
        const frameBuffer = gl.createFramebuffer();
        const tex = gl.createTexture();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        const vertexBuffer = gl.createBuffer();
        const uvBuffer = gl.createBuffer();
        const colorBuffer = gl.createBuffer();
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return new RenderTarget(frameBuffer, new fosterWebGLTexture_1.FosterWebGLTexture(tex, width, height), vertexBuffer, colorBuffer, uvBuffer);
    }
}
exports.RenderTarget = RenderTarget;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __webpack_require__(4);
const core_1 = __webpack_require__(3);
/**
 * Loads a set of assets
 */
class AssetLoader {
    constructor(root) {
        /**
         * The root directory to load from
         */
        this.root = "";
        this._loading = false;
        this._loaded = false;
        this.assets = 0;
        this.assetsLoaded = 0;
        this.textures = [];
        this.jsons = [];
        this.xmls = [];
        this.sounds = [];
        this.atlases = [];
        this.texts = [];
        this.root = root || "";
    }
    /**
     * If the Asset Loader is loading
     */
    get loading() { return this._loading; }
    /**
     * If the Asset Loader has finished loading
     */
    get loaded() { return this._loaded; }
    /**
     * The Percentage towards being finished loading
     */
    get percent() { return this.assetsLoaded / this.assets; }
    /**
     * Adds the Texture to the loader
     */
    addTexture(path) {
        if (this.loading || this.loaded)
            throw new Error("Cannot add more assets when already loaded");
        this.textures.push(path);
        this.assets++;
        return this;
    }
    /**
     * Adds the JSON to the loader
     */
    addJson(path) {
        if (this.loading || this.loaded)
            throw new Error("Cannot add more assets when already loaded");
        this.jsons.push(path);
        this.assets++;
        return this;
    }
    /**
     * Adds the XML to the loader
     */
    addXml(path) {
        if (this.loading || this.loaded)
            throw new Error("Cannot add more assets when already loaded");
        this.xmls.push(path);
        this.assets++;
        return this;
    }
    /**
     * Adds the text to the loader
     */
    addText(path) {
        if (this.loading || this.loaded)
            throw new Error("Cannot add more assets when already loaded");
        this.texts.push(path);
        this.assets++;
        return this;
    }
    /**
     * Adds the sound to the loader
     */
    addSound(handle, path) {
        if (this.loading || this.loaded)
            throw new Error("Cannot add more assets when already loaded");
        this.sounds.push({ handle, path });
        this.assets++;
        return this;
    }
    /**
     * Adds the atlas to the loader
     */
    addAtlas(name, image, data, loader) {
        if (this.loading || this.loaded)
            throw new Error("Cannot add more assets when already loaded");
        this.atlases.push({ name, image, data, loader });
        this.assets += 3;
        return this;
    }
    /**
     * Begins loading all the assets and invokes Callback upon completion
     */
    load(callback) {
        this._loading = true;
        this.callback = callback;
        // textures
        for (const texture of this.textures)
            this.loadTexture(core_1.IO.join(this.root, texture));
        // json files
        for (const json of this.jsons)
            this.loadJson(core_1.IO.join(this.root, json));
        // xml files
        for (const xml of this.xmls)
            this.loadXml(core_1.IO.join(this.root, xml));
        // text files
        for (const text of this.texts)
            this.loadText(core_1.IO.join(this.root, text));
        // sounds
        for (const sound of this.sounds)
            this.loadSound(sound.handle, core_1.IO.join(this.root, sound.path));
        // atlases
        for (const atlas of this.atlases)
            this.loadAtlas(atlas);
    }
    /**
     * Unloads all the Assets that this Asset Loader loaded
     */
    unload() {
        if (this.loading)
            throw new Error("Cannot unload until finished loading");
        if (!this.loaded)
            throw new Error("Cannot unload before loading");
        // TODO:IMPLEMENT THIS
        throw new Error("Asset Unloading not Implemented");
    }
    loadTexture(path, callback) {
        const gl = core_1.Engine.graphics.gl;
        const img = new Image();
        img.addEventListener("load", () => {
            const tex = _1.Texture.create(img);
            tex.texture.path = path;
            _1.Assets.textures[this.pathify(path)] = tex;
            if (callback !== undefined)
                callback(tex);
            this.incrementLoader();
        });
        img.src = path;
    }
    loadJson(path, callback) {
        const self = this;
        core_1.IO.read(path, (data) => {
            const p = this.pathify(path);
            _1.Assets.json[p] = JSON.parse(data);
            if (callback !== undefined)
                callback(_1.Assets.json[p]);
            self.incrementLoader();
        });
    }
    loadXml(path, callback) {
        core_1.IO.read(path, (data) => {
            const p = this.pathify(path);
            _1.Assets.xml[p] = (new DOMParser()).parseFromString(data, "text/xml");
            if (callback !== undefined)
                callback(_1.Assets.xml[p]);
            this.incrementLoader();
        });
    }
    loadText(path, callback) {
        core_1.IO.read(path, (data) => {
            const p = this.pathify(path);
            _1.Assets.text[p] = data;
            if (callback !== undefined)
                callback(_1.Assets.text[p]);
            this.incrementLoader();
        });
    }
    loadSound(handle, path, callback) {
        const audio = new Audio();
        audio.addEventListener("loadeddata", () => {
            _1.Assets.sounds[handle] = new _1.AudioSource(path, audio);
            if (callback !== undefined)
                callback(_1.Assets.sounds[handle]);
            this.incrementLoader();
        });
        audio.src = path;
    }
    loadAtlas(data) {
        const self = this;
        let texture = null;
        let atlasdata = null;
        // check to see if both the texture and data file are done
        // if they are, then create the atlas object
        function check() {
            if (texture == null || atlasdata == null)
                return;
            const atlas = new _1.Atlas(data.name, texture, atlasdata, data.loader);
            _1.Assets.atlases[atlas.name] = atlas;
            self.incrementLoader();
        }
        // load atlas texture file
        this.loadText(core_1.IO.join(this.root, data.data), (text) => { atlasdata = text; check(); });
        this.loadTexture(core_1.IO.join(this.root, data.image), (tex) => { texture = tex; check(); });
    }
    incrementLoader() {
        this.assetsLoaded++;
        if (this.assetsLoaded === this.assets) {
            this._loaded = true;
            this._loading = false;
            if (this.callback !== undefined)
                this.callback();
        }
    }
    pathify(path) {
        while (path.indexOf("\\") >= 0)
            path = path.replace("\\", "/");
        return path;
    }
}
exports.AssetLoader = AssetLoader;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const util_1 = __webpack_require__(0);
class Entity {
    constructor() {
        /**
         * Position of the Entity in the Scene
         */
        this.position = new util_1.Vector(0, 0);
        /**
         * If the Entity is visible. If false, Entity.render is not called
         */
        this.visible = true;
        /**
         * If the Entity is active. If false, Entity.update is not called
         */
        this.active = true;
        /**
         * If the Entity has been created yet (has it ever been added to a scene)
         */
        this.isCreated = false;
        /**
         * If the Entity has been started yet (has it been updated in the current scene)
         */
        this.isStarted = false;
        /**
         * List of all Entity components
         */
        this.components = new util_1.ObjectList();
        /**
         * List of all Groups the Entity is in
         */
        this.groups = [];
        this._depth = 0;
    }
    /**
     * X position of the Entity in the Scene
     */
    get x() { return this.position.x; }
    set x(val) { this.position.x = val; }
    /**
     * Y position of the Entity in the Scene
     */
    get y() { return this.position.y; }
    set y(val) { this.position.y = val; }
    /**
     * The Render-Depth of the Entity (lower = rendered later)
     */
    get depth() {
        return this._depth;
    }
    set depth(val) {
        if (this.scene != null && this._depth !== val) {
            this._depth = val;
            this.scene.entities.unsorted = true;
            for (const group of this.groups)
                this.scene.groups[group].unsorted = true;
        }
    }
    /**
     * Called the first time the entity is added to a scene (after constructor, before added)
     */
    created() { }
    /**
     * Called immediately whenever the entity is added to a Scene (after created, before started)
     */
    added() { }
    /**
     * Called before the first update of the Entity (after added)
     */
    started() { }
    /**
     * Called immediately whenever the entity is removed from a Scene
     */
    removed() { }
    /**
     * Called immediately whenever the entity is recycled in a Scene
     */
    recycled() { }
    /**
     * Called when an entity is permanently destroyed
     */
    destroyed() { }
    /**
     * Called every game-step, if this entity is in a Scene and Active
     */
    update() {
        this.components.each((c) => {
            if (c.active)
                c.update();
        });
    }
    /**
     * Called via a Renderer, if Visible
     */
    render(camera) {
        this.components.each((c) => {
            if (c.visible)
                c.render(camera);
        });
    }
    /**
     * Called via the Debug Renderer
     */
    debugRender(camera) {
        engine_1.Engine.graphics.hollowRect(this.x - 5, this.y - 5, 10, 10, 1, util_1.Color.white);
        this.components.each((c) => {
            if (c.visible)
                c.debugRender(camera);
        });
    }
    /**
     * Adds a Component to this Entity
     */
    add(component) {
        this.components.add(component);
        component.entity = this;
        component.addedToEntity();
        if (this.scene != null)
            this.scene._trackComponent(component);
        return component;
    }
    /**
     * Removes a Components from this Entity
     */
    remove(component) {
        this.components.remove(component);
        component.removedFromEntity();
        component.entity = null;
        if (this.scene != null)
            this.scene._untrackComponent(component);
        return component;
    }
    /**
     * Removes all Components from this Entity
     */
    removeAll() {
        this.components.each((c) => { this.remove(c); });
    }
    /**
     * Finds the first component in this Entity of the given Class
     */
    find(className) {
        let component = null;
        this.components.each((c) => {
            if (c instanceof className) {
                component = c;
                return false;
            }
        });
        return component;
    }
    /**
     * Finds all components in this Entity of the given Class
     */
    findAll(className) {
        const list = [];
        this.components.each((c) => {
            if (c instanceof className)
                list.push(c);
        });
        return list;
    }
    /**
     * Groups this entity into the given Group
     */
    group(groupType) {
        this.groups.push(groupType);
        if (this.scene != null)
            this.scene._groupEntity(this, groupType);
    }
    /**
     * Removes this Entity from the given Group
     */
    ungroup(groupType) {
        const index = this.groups.indexOf(groupType);
        if (index >= 0) {
            this.groups.splice(index, 1);
            if (this.scene != null)
                this.scene._ungroupEntity(this, groupType);
        }
    }
    /**
     * Checks if this Entity is in the given Group
     */
    ingroup(groupType) {
        return (this.groups.indexOf(groupType) >= 0);
    }
}
exports.Entity = Entity;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const input_1 = __webpack_require__(6);
const util_1 = __webpack_require__(0);
/**
 * Handels the Game Window and the differences between Browser / Desktop mode
 */
class GameWindow {
    constructor() {
        if (engine_1.Engine.client === engine_1.Client.Electron) {
            const remote = __webpack_require__(20).remote;
            GameWindow.browserWindow = remote.getCurrentWindow();
            GameWindow.screen = remote.screen;
        }
    }
    /**
     * Gets or Sets the Window Title
     */
    static get title() {
        return GameWindow.titleName;
    }
    static set title(val) {
        GameWindow.titleName = val;
        if (engine_1.Engine.client === engine_1.Client.Electron)
            GameWindow.browserWindow.setTitle(val);
        else
            document.title = val;
    }
    /**
     * Toggles Fullscreen Mode if running on the Desktop
     */
    static get fullscreen() {
        return engine_1.Engine.client === engine_1.Client.Electron && GameWindow.browserWindow.isFullScreen();
    }
    static set fullscreen(val) {
        if (engine_1.Engine.client === engine_1.Client.Electron)
            GameWindow.browserWindow.setFullScreen(val);
        else
            console.warn("Can only set Fullscreen in Client.Desktop mode");
    }
    /**
     * Returns the left position of the screen
     */
    static get screenLeft() {
        if (engine_1.Engine.client === engine_1.Client.Electron)
            return GameWindow.browserWindow.getPosition()[0];
        else
            return engine_1.Engine.graphics.canvas.getBoundingClientRect().left;
    }
    /**
     * Returns the Top position of the screen
     */
    static get screenTop() {
        if (engine_1.Engine.client === engine_1.Client.Electron)
            return GameWindow.browserWindow.getPosition()[1];
        else
            return engine_1.Engine.graphics.canvas.getBoundingClientRect().top;
    }
    /**
     * Returns the Width of the screen
     */
    static get screenWidth() {
        if (engine_1.Engine.client === engine_1.Client.Electron)
            return GameWindow.browserWindow.getContentSize()[0];
        else
            return engine_1.Engine.graphics.canvas.getBoundingClientRect().width;
    }
    /**
     * Returns the Height of the screen
     */
    static get screenHeight() {
        if (engine_1.Engine.client === engine_1.Client.Electron)
            return GameWindow.browserWindow.getContentSize()[1];
        else
            return engine_1.Engine.graphics.canvas.getBoundingClientRect().height;
    }
    /**
     * Resizes the Window if running in Desktop mode
     */
    static resize(width, height) {
        if (engine_1.Engine.client === engine_1.Client.Electron)
            GameWindow.browserWindow.setContentSize(width, height);
    }
    /**
     * Centers the Window if running in Desktop mode
     */
    static center() {
        if (engine_1.Engine.client === engine_1.Client.Electron)
            GameWindow.browserWindow.center();
    }
    /**
     * Toggles Developer tools if running in Desktop mode
     */
    static toggleDevTools() {
        if (engine_1.Engine.client === engine_1.Client.Electron)
            GameWindow.browserWindow.toggleDevTools();
    }
    /**
     * Gets the absolute mouse position in the screen
     */
    static get screenMouse() {
        if (engine_1.Engine.client === engine_1.Client.Electron) {
            const pos = GameWindow.screen.getCursorScreenPoint();
            return new util_1.Vector(pos.x, pos.y);
        }
        return input_1.Mouse.absolute;
    }
}
exports.GameWindow = GameWindow;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const assets_1 = __webpack_require__(4);
const util_1 = __webpack_require__(0);
var ResolutionStyle;
(function (ResolutionStyle) {
    /** Renders the buffer at the Center of the Screen with no scaling */
    ResolutionStyle[ResolutionStyle["None"] = 0] = "None";
    /** Renders the buffer to an exact fit of the Screen (stretching) */
    ResolutionStyle[ResolutionStyle["Exact"] = 1] = "Exact";
    /** Renders the buffer so that it is contained within the Screen */
    ResolutionStyle[ResolutionStyle["Contain"] = 2] = "Contain";
    /** Renders the buffer so that it is contained within the Screen, rounded to an Integer scale */
    ResolutionStyle[ResolutionStyle["ContainInteger"] = 3] = "ContainInteger";
    /** Renders the buffer so that it fills the Screen (cropping the buffer) */
    ResolutionStyle[ResolutionStyle["Fill"] = 4] = "Fill";
    /** Renders the buffer so that it fills the Screen (cropping the buffer), rounded to an Integer scale */
    ResolutionStyle[ResolutionStyle["FillInteger"] = 5] = "FillInteger";
})(ResolutionStyle = exports.ResolutionStyle || (exports.ResolutionStyle = {}));
class BlendMode {
    constructor(source, dest) { this.source = source; this.dest = dest; }
}
exports.BlendMode = BlendMode;
class BlendModes {
}
exports.BlendModes = BlendModes;
class Graphics {
    /**
     * Creates the Engine.Graphics
     */
    constructor(engine) {
        this.resolutionStyle = ResolutionStyle.Contain;
        this.borderColor = util_1.Color.black.clone();
        this.clearColor = new util_1.Color(0.1, 0.1, 0.3, 1);
        // vertices
        this.vertices = [];
        this.texcoords = [];
        this.colors = [];
        // current render target
        this.currentTarget = null;
        // shader
        this.currentShader = null;
        this.nextShader = null;
        // blendmode
        this.currentBlendmode = null;
        this.nextBlendmode = null;
        // orthographic matrix
        this.orthographic = new util_1.Matrix();
        this.toscreen = new util_1.Matrix();
        // pixel drawing
        this._pixel = null;
        this._pixelUVs = [new util_1.Vector(0, 0), new util_1.Vector(1, 0), new util_1.Vector(1, 1), new util_1.Vector(0, 1)];
        this._defaultPixel = null;
        // utils
        this.drawCalls = 0;
        // temp. vars used for drawing
        this.topleft = new util_1.Vector();
        this.topright = new util_1.Vector();
        this.botleft = new util_1.Vector();
        this.botright = new util_1.Vector();
        this.texToDraw = new assets_1.Texture(null, new util_1.Rectangle(), new util_1.Rectangle());
        this.engine = engine;
        // create the screen
        this.canvas = document.createElement("canvas");
        this.gl = this.canvas.getContext("experimental-webgl", {
            alpha: false,
            antialias: false,
        });
        engine_1.Engine.root.appendChild(this.canvas);
        this.gl.enable(this.gl.BLEND);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.CULL_FACE);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        BlendModes.normal = new BlendMode(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        BlendModes.add = new BlendMode(this.gl.ONE, this.gl.DST_ALPHA);
        BlendModes.multiply = new BlendMode(this.gl.DST_COLOR, this.gl.ONE_MINUS_SRC_ALPHA);
        BlendModes.screen = new BlendMode(this.gl.ONE, this.gl.ONE_MINUS_SRC_COLOR);
        this.currentBlendmode = BlendModes.normal;
        this.vertexBuffer = this.gl.createBuffer();
        this.texcoordBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
    }
    get shader() {
        if (this.nextShader != null)
            return this.nextShader;
        return this.currentShader;
    }
    set shader(s) {
        if (this.shader !== s && s != null)
            this.nextShader = s;
    }
    get blendmode() {
        if (this.nextBlendmode != null)
            return this.nextBlendmode;
        return this.currentBlendmode;
    }
    set blendmode(bm) {
        if (this.currentBlendmode !== bm && bm != null)
            this.nextBlendmode = bm;
    }
    set pixel(p) {
        if (p == null)
            p = this._defaultPixel;
        const minX = p.bounds.left / p.texture.width;
        const minY = p.bounds.top / p.texture.height;
        const maxX = p.bounds.right / p.texture.width;
        const maxY = p.bounds.bottom / p.texture.height;
        this._pixel = p;
        this._pixelUVs =
            [
                new util_1.Vector(minX, minY),
                new util_1.Vector(maxX, minY),
                new util_1.Vector(maxX, maxY),
                new util_1.Vector(minX, maxY),
            ];
    }
    get pixel() { return this._pixel; }
    /**
     * Initial load of Graphics and WebGL components
     */
    load() {
        // creates the default pixel texture
        this.pixel = this._defaultPixel = assets_1.Texture.createFromData([1, 1, 1, 1], 1, 1);
    }
    /**
     * Unloads the Graphics and WebGL stuff
     */
    unload() {
        this._defaultPixel.dispose();
        this.gl.deleteBuffer(this.vertexBuffer);
        this.gl.deleteBuffer(this.colorBuffer);
        this.gl.deleteBuffer(this.texcoordBuffer);
        this.buffer.dispose();
        this.buffer = null;
        this.canvas.remove();
        this.canvas = null;
        // TODO:Implement this properly
    }
    /**
     * Called when the Game resolution changes
     */
    resize() {
        // buffer
        if (this.buffer != null)
            this.buffer.dispose();
        this.buffer = assets_1.RenderTarget.create(engine_1.Engine.width, engine_1.Engine.height);
        // orthographic matrix
        this.orthographic
            .identity()
            .translate(-1, 1)
            .scale(1 / this.buffer.width * 2, -1 / this.buffer.height * 2);
    }
    /**
     * Updates the Graphics
     */
    update() {
        // resizing
        if (this.canvas.width !== engine_1.Engine.root.clientWidth || this.canvas.height !== engine_1.Engine.root.clientHeight) {
            this.canvas.width = engine_1.Engine.root.clientWidth;
            this.canvas.height = engine_1.Engine.root.clientHeight;
        }
    }
    /**
     * Gets the rectangle that the game buffer should be drawn to the screen with
     */
    getOutputBounds() {
        let scaleX = 1;
        let scaleY = 1;
        if (this.resolutionStyle === ResolutionStyle.Exact) {
            scaleX = this.canvas.width / this.buffer.width;
            scaleY = this.canvas.height / this.buffer.height;
        }
        else if (this.resolutionStyle === ResolutionStyle.Contain) {
            scaleX = scaleY = (Math.min(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
        }
        else if (this.resolutionStyle === ResolutionStyle.ContainInteger) {
            scaleX = scaleY = Math.floor(Math.min(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
        }
        else if (this.resolutionStyle === ResolutionStyle.Fill) {
            scaleX = scaleY = (Math.max(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
        }
        else if (this.resolutionStyle === ResolutionStyle.FillInteger) {
            scaleX = scaleY = Math.ceil(Math.max(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
        }
        const width = this.buffer.width * scaleX;
        const height = this.buffer.height * scaleY;
        return new util_1.Rectangle((this.canvas.width - width) / 2, (this.canvas.height - height) / 2, width, height);
    }
    /**
     * Clears the screen
     */
    clear(color) {
        this.gl.clearColor(color.r, color.g, color.b, color.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    /**
     * Resets the Graphics rendering
     */
    reset() {
        this.drawCalls = 0;
        this.currentShader = null;
        this.nextShader = null;
        this.vertices = [];
        this.colors = [];
        this.texcoords = [];
        this.setRenderTarget(this.buffer);
        this.clear(this.clearColor);
    }
    /**
     * Sets the current Render Target
     */
    setRenderTarget(target) {
        if (this.currentTarget !== target) {
            this.flush();
            if (target == null) {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }
            else {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target.frameBuffer);
                this.gl.viewport(0, 0, target.width, target.height);
            }
            this.currentTarget = target;
        }
    }
    /**
     * Sets the current texture on the shader (if the shader has a sampler2d uniform)
     */
    setShaderTexture(tex) {
        if (engine_1.Engine.assert(this.shader.sampler2d != null, "This shader has no Sampler2D to set the texture to"))
            this.shader.sampler2d.value = tex.texture.webGLTexture;
    }
    /**
     * Checks if the shader was modified, and if so, flushes the current vertices & starts a new draw
     */
    checkState() {
        if (this.nextShader != null || this.currentShader.dirty || this.nextBlendmode != null) {
            // flush existing
            if (this.currentShader != null)
                this.flush();
            // swap
            const swapped = (this.nextShader != null);
            if (swapped) {
                // disable prev. attributes
                if (this.currentShader != null)
                    for (const attribute of this.currentShader.attributes)
                        this.gl.disableVertexAttribArray(attribute.location);
                // swap
                this.currentShader = this.nextShader;
                this.nextShader = null;
                this.gl.useProgram(this.currentShader.program);
                // enable attributes
                for (const attribute of this.currentShader.attributes)
                    this.gl.enableVertexAttribArray(attribute.location);
            }
            // blendmode
            if (this.nextBlendmode != null) {
                this.currentBlendmode = this.nextBlendmode;
                this.nextBlendmode = null;
                this.gl.blendFunc(this.currentBlendmode.source, this.currentBlendmode.dest);
            }
            // set shader uniforms
            let textureCounter = 0;
            for (const uniform of this.currentShader.uniforms) {
                if (swapped || uniform.dirty) {
                    // special case for Sampler2D
                    if (uniform.type === util_1.Shader.UniformType.sampler2D) {
                        this.gl.activeTexture(this.gl["TEXTURE" + textureCounter]);
                        if (uniform.value instanceof assets_1.Texture)
                            this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value.texture.webGLTexture);
                        else if (uniform.value instanceof assets_1.RenderTarget)
                            this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value.texture.webGLTexture);
                        else
                            this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value);
                        this.gl.uniform1i(uniform.location, textureCounter);
                        textureCounter += 1;
                    }
                    else {
                        util_1.Shader.setGLUniformValue[uniform.type](this.gl, uniform.location, uniform.value);
                    }
                    uniform.dirty = false;
                }
            }
            this.currentShader.dirty = false;
        }
    }
    /**
     * Flushes the current vertices to the screen
     */
    flush() {
        if (this.vertices.length > 0) {
            // set buffer data via shader attributes
            for (const attribute of this.currentShader.attributes) {
                if (attribute.type === util_1.Shader.AttributeType.Position) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.vertexBuffer : this.currentTarget.vertexBuffer));
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
                    this.gl.vertexAttribPointer(attribute.location, 2, this.gl.FLOAT, false, 0, 0);
                }
                else if (attribute.type === util_1.Shader.AttributeType.Texcoord) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.texcoordBuffer : this.currentTarget.texcoordBuffer));
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texcoords), this.gl.STATIC_DRAW);
                    this.gl.vertexAttribPointer(attribute.location, 2, this.gl.FLOAT, false, 0, 0);
                }
                else if (attribute.type === util_1.Shader.AttributeType.Color) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.colorBuffer : this.currentTarget.colorBuffer));
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
                    this.gl.vertexAttribPointer(attribute.location, 4, this.gl.FLOAT, false, 0, 0);
                }
            }
            // draw vertices
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 2);
            this.drawCalls++;
            // clear
            this.vertices = [];
            this.texcoords = [];
            this.colors = [];
        }
    }
    /**
     * Draws the game to the Screen and does cleanup
     */
    finalize() {
        // set target back to the Screen Canvas (null)
        this.setRenderTarget(null);
        this.clear(this.borderColor);
        // create the matrix for rendering back to the Screen
        this.toscreen
            .identity()
            .translate(-1, -1)
            .scale(1 / this.canvas.width * 2, 1 / this.canvas.height * 2);
        // use the default texture shader
        this.shader = util_1.Shaders.texture;
        this.shader.sampler2d.value = this.buffer.texture.webGLTexture;
        this.shader.set("matrix", this.toscreen);
        // draw our buffer centered!
        const bounds = this.getOutputBounds();
        this.push(bounds.left, bounds.top, 0, 0, util_1.Color.white);
        this.push(bounds.right, bounds.top, 1, 0, util_1.Color.white);
        this.push(bounds.right, bounds.bottom, 1, 1, util_1.Color.white);
        this.push(bounds.left, bounds.top, 0, 0, util_1.Color.white);
        this.push(bounds.right, bounds.bottom, 1, 1, util_1.Color.white);
        this.push(bounds.left, bounds.bottom, 0, 1, util_1.Color.white);
        this.flush();
    }
    /**
     * Pushes vertices to the screen. If the shader has been modified, this will end and start a new draw call
     * @param x 	X position of the vertex
     * @param y		Y position of the vertex
     * @param u		X position in the texture (u) (only used in shaders with sampler2d)
     * @param v		Y position in the texture (v) (only used in shaders with sampler2d)
     * @param color optional color for the vertex
     */
    push(x, y, u, v, color) {
        // shader was changed
        this.checkState();
        // append
        this.vertices.push(x, y);
        this.texcoords.push(u, v);
        if (color !== undefined && color != null)
            this.colors.push(color.r, color.g, color.b, color.a);
    }
    /**
     * Same as Graphics.push, but this method assumes the shader was NOT modified. Don't use this unless you know what you're doing
     * @param x 	X position of the vertex
     * @param y		Y position of the vertex
     * @param u		X position in the texture (u) (only used in shaders with sampler2d)
     * @param v		Y position in the texture (v) (only used in shaders with sampler2d)
     * @param color optional color for the vertex
     */
    pushUnsafe(x, y, u, v, color) {
        this.vertices.push(x, y);
        this.texcoords.push(u, v);
        if (color !== undefined && color != null)
            this.colors.push(color.r, color.g, color.b, color.a);
    }
    /**
     * Pushes a list of vertices to the screen. If the shader has been modified, this will end and start a new draw call
     */
    pushList(pos, uv, color) {
        this.checkState();
        for (let i = 0; i < pos.length; i++) {
            this.vertices.push(pos[i].x, pos[i].y);
            if (uv !== undefined && uv != null)
                this.texcoords.push(uv[i].x, uv[i].y);
            if (color !== undefined && color != null) {
                const c = color[i];
                this.colors.push(c.r, c.g, c.b, c.a);
            }
        }
    }
    /**
     * Draws a texture at the given position. If the current Shader does not take a texture, this will throw an error.
     */
    texture(tex, posX, posY, crop, color, origin, scale, rotation, flipX, flipY) {
        this.setShaderTexture(tex);
        // get the texture (or subtexture if crop is passed)
        let t = null;
        if (crop === undefined || crop == null)
            t = tex;
        else
            t = tex.getSubtexture(crop, this.texToDraw);
        // size
        const left = -t.frame.x;
        const top = -t.frame.y;
        const width = t.bounds.width;
        const height = t.bounds.height;
        // relative positions
        this.topleft.set(left, top);
        this.topright.set(left + width, top);
        this.botleft.set(left, top + height);
        this.botright.set(left + width, top + height);
        // offset by origin
        if (origin && (origin.x !== 0 || origin.y !== 0)) {
            this.topleft.sub(origin);
            this.topright.sub(origin);
            this.botleft.sub(origin);
            this.botright.sub(origin);
        }
        // scale
        if (scale && (scale.x !== 1 || scale.y !== 1)) {
            this.topleft.mult(scale);
            this.topright.mult(scale);
            this.botleft.mult(scale);
            this.botright.mult(scale);
        }
        // rotate
        if (rotation && rotation !== 0) {
            const s = Math.sin(rotation);
            const c = Math.cos(rotation);
            this.topleft.rotate(s, c);
            this.topright.rotate(s, c);
            this.botleft.rotate(s, c);
            this.botright.rotate(s, c);
        }
        // uv positions
        let uvMinX = t.bounds.x / t.texture.width;
        let uvMinY = t.bounds.y / t.texture.height;
        let uvMaxX = uvMinX + (width / t.texture.width);
        let uvMaxY = uvMinY + (height / t.texture.height);
        // flip UVs on X
        if (flipX) {
            const a = uvMinX;
            uvMinX = uvMaxX;
            uvMaxX = a;
        }
        // flip UVs on Y
        if (flipY) {
            const a = uvMinY;
            uvMinY = uvMaxY;
            uvMaxY = a;
        }
        // color
        const col = (color || util_1.Color.white);
        // push vertices
        this.push(posX + this.topleft.x, posY + this.topleft.y, uvMinX, uvMinY, col);
        this.pushUnsafe(posX + this.topright.x, posY + this.topright.y, uvMaxX, uvMinY, col);
        this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, uvMaxX, uvMaxY, col);
        this.pushUnsafe(posX + this.topleft.x, posY + this.topleft.y, uvMinX, uvMinY, col);
        this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, uvMaxX, uvMaxY, col);
        this.pushUnsafe(posX + this.botleft.x, posY + this.botleft.y, uvMinX, uvMaxY, col);
    }
    quad(posX, posY, width, height, color, origin, scale, rotation) {
        const left = 0;
        const top = 0;
        // relative positions
        this.topleft.set(left, top);
        this.topright.set(left + width, top);
        this.botleft.set(left, top + height);
        this.botright.set(left + width, top + height);
        // offset by origin
        if (origin && (origin.x !== 0 || origin.y !== 0)) {
            this.topleft.sub(origin);
            this.topright.sub(origin);
            this.botleft.sub(origin);
            this.botright.sub(origin);
        }
        // scale
        if (scale && (scale.x !== 1 || scale.y !== 1)) {
            this.topleft.mult(scale);
            this.topright.mult(scale);
            this.botleft.mult(scale);
            this.botright.mult(scale);
        }
        // rotate
        if (rotation && rotation !== 0) {
            const s = Math.sin(rotation);
            const c = Math.cos(rotation);
            this.topleft.rotate(s, c);
            this.topright.rotate(s, c);
            this.botleft.rotate(s, c);
            this.botright.rotate(s, c);
        }
        // color
        const col = (color || util_1.Color.white);
        // push vertices
        this.push(posX + this.topleft.x, posY + this.topleft.y, 0, 0, color);
        this.pushUnsafe(posX + this.topright.x, posY + this.topright.y, 0, 0, color);
        this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, 0, 0, color);
        this.pushUnsafe(posX + this.topleft.x, posY + this.topleft.y, 0, 0, color);
        this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, 0, 0, color);
        this.pushUnsafe(posX + this.botleft.x, posY + this.botleft.y, 0, 0, color);
    }
    /**
     * Draws a rectangle. If the current shader has a Sampler2D it uses the Graphics.Pixel texture
     */
    rect(x, y, width, height, color) {
        if (this.shader.sampler2d != null)
            this.setShaderTexture(this._pixel);
        const uv = this._pixelUVs;
        this.push(x, y, uv[0].x, uv[0].y, color);
        this.pushUnsafe(x + width, y, uv[1].x, uv[1].y, color);
        this.pushUnsafe(x + width, y + height, uv[2].x, uv[2].y, color);
        this.pushUnsafe(x, y, uv[0].x, uv[0].y, color);
        this.pushUnsafe(x, y + height, uv[3].x, uv[3].y, color);
        this.pushUnsafe(x + width, y + height, uv[2].x, uv[2].y, color);
    }
    /**
     * Draws a triangle. If the current shader has a Sampler2D it uses the Graphics.Pixel texture
     */
    triangle(a, b, c, colA, colB, colC) {
        if (this.shader.sampler2d != null)
            this.setShaderTexture(this._pixel);
        if (colB === undefined)
            colB = colA;
        if (colC === undefined)
            colC = colA;
        const uv = this._pixelUVs;
        this.push(a.x, a.y, uv[0].x, uv[0].y, colA);
        this.pushUnsafe(b.x, b.y, uv[1].x, uv[1].y, colB);
        this.pushUnsafe(c.x, c.y, uv[2].x, uv[2].y, colC);
    }
    /**
     * Draws a circle. If the current shader has a Sampler2D it uses the Graphics.Pixel texture
     */
    circle(pos, rad, steps, colorA, colorB) {
        if (this.shader.sampler2d != null)
            this.setShaderTexture(this._pixel);
        if (colorB === undefined)
            colorB = colorA;
        this.checkState();
        const uv = this._pixelUVs;
        let last = new util_1.Vector(pos.x + rad, pos.y);
        for (let i = 1; i <= steps; i++) {
            const angle = (i / steps) * Math.PI * 2;
            const next = new util_1.Vector(pos.x + Math.cos(angle), pos.y + Math.sin(angle));
            this.pushUnsafe(pos.x, pos.y, uv[0].x, uv[0].y, colorA);
            this.pushUnsafe(last.x, last.y, uv[1].x, uv[1].y, colorB);
            this.pushUnsafe(next.x, next.y, uv[2].x, uv[2].y, colorB);
            last = next;
        }
    }
    hollowRect(x, y, width, height, stroke, color) {
        this.rect(x, y, width, stroke, color);
        this.rect(x, y + stroke, stroke, height - stroke * 2, color);
        this.rect(x + width - stroke, y + stroke, stroke, height - stroke * 2, color);
        this.rect(x, y + height - stroke, width, stroke, color);
    }
}
exports.Graphics = Graphics;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const collider_1 = __webpack_require__(5);
const spriteRenderer_1 = __webpack_require__(21);
const util_1 = __webpack_require__(0);
/**
 * The Scene contains a list of Entities and Renderers that in turn handle Gameplay. There can only be one active Scene at a time
 */
class Scene {
    constructor() {
        /**
         * The Camera in the Scene
         */
        this.camera = new util_1.Camera();
        /**
         * A list of all the Entities in the Scene
         */
        this.entities = new util_1.ObjectList();
        /**
         * A list of all the Renderers in the Scene
         */
        this.renderers = new util_1.ObjectList();
        /**
         * List of entities organized by Group
         */
        this.groups = {};
        this.colliders = {};
        this.cache = {};
        this.camera = new util_1.Camera();
        this.addRenderer(new spriteRenderer_1.SpriteRenderer());
    }
    /**
     * Called when this Scene begins (after Engine.scene has been set)
     */
    begin() {
    }
    /**
     * Called when this Scene ends (Engine.scene is going to a new scene)
     */
    ended() {
    }
    /**
     * Disposes this scene
     */
    dispose() {
        this.renderers.each((r) => r.dispose());
        this.renderers.clear();
        this.entities.each((e) => this.destroy(e));
        this.entities.clear();
        this.colliders = {};
        this.groups = {};
        this.cache = {};
    }
    /**
     * Called every frame and updates the Scene
     */
    update() {
        // update entities
        this.entities.each((e) => {
            if (!e.isStarted) {
                e.isStarted = true;
                e.started();
            }
            if (e.active && e.isStarted)
                e.update();
        });
        // update renderers
        this.renderers.each((r) => {
            if (r.visible)
                r.update();
        });
        // clean dirty lists
        this.entities.clean();
        this.renderers.clean();
        for (const key in this.groups)
            this.groups[key].clean();
    }
    /**
     * Called when the Scene should be rendered, and renders each of its Renderers
     */
    render() {
        // sort entities (only sorts if required)
        this.entities.sort((a, b) => b.depth - a.depth);
        for (const key in this.groups)
            this.groups[key].sort((a, b) => b.depth - a.depth);
        // pre-render
        this.renderers.each((r) => {
            if (r.visible)
                r.preRender();
        });
        // render
        this.renderers.each((r) => {
            if (r.visible)
                r.render();
        });
        // post-render
        this.renderers.each((r) => {
            if (r.visible)
                r.postRender();
        });
        // debug render
        if (engine_1.Engine.debugMode) {
            engine_1.Engine.graphics.setRenderTarget(engine_1.Engine.graphics.buffer);
            engine_1.Engine.graphics.shader = util_1.Shaders.primitive;
            engine_1.Engine.graphics.shader.set("matrix", this.camera.matrix);
            this.entities.each((e) => {
                if (e.active)
                    e.debugRender(this.camera);
            });
        }
    }
    /**
     * Adds the given Entity to this Scene
     * @param entity 	The Entity to add
     * @param position 	The optional position to add the Entity at
     */
    add(entity, position) {
        entity.scene = this;
        this.entities.add(entity);
        if (position !== undefined)
            entity.position.set(position.x, position.y);
        // first time for this entity
        if (!entity.isCreated) {
            entity.isCreated = true;
            entity.created();
        }
        // group existing groups in the entity
        for (const group of entity.groups)
            this._groupEntity(entity, group);
        // add existing components in the entity
        entity.components.each((c) => this._trackComponent(c));
        // add entity
        entity.added();
        return entity;
    }
    /**
     * Recreates and adds an Entity from the cache in the given bucket. If there are no entities cache'd in that bucket, NULL is returned
     * @param bucket	The bucket to pull from
     */
    recreate(bucket) {
        if (Array.isArray(this.cache[bucket]) && this.cache[bucket].length > 0) {
            const entity = this.cache[bucket][0];
            this.cache[bucket].splice(0, 1);
            return this.add(entity);
        }
        return null;
    }
    /**
     * Recycles an entity into the given bucket & removes it from the Scene
     * @param bucket	The bucket to recycle the entity into
     * @param entity	The entity to recycle & remove
     */
    recycle(bucket, entity) {
        this.remove(entity);
        if (this.cache[bucket] === undefined)
            this.cache[bucket] = [];
        this.cache[bucket].push(entity);
        entity.recycled();
    }
    /**
     * Removes the given Entity from the scene
     * @param entity 	The entity to remove
     */
    remove(entity) {
        entity.removed();
        // untrack all components
        entity.components.each((c) => this._untrackComponent(c));
        // ungroup
        for (const group of entity.groups)
            this._ungroupEntity(entity, group);
        // remove entity
        entity.isStarted = false;
        entity.scene = null;
        this.entities.remove(entity);
    }
    /**
     * Removes every Entity from the Scene
     */
    removeAll() {
        this.entities.each((e) => this.remove(e));
    }
    /**
     * Destroys the given entity (calls Entity.destroy, sets Entity.instantiated to false)
     * @param entity 	The entity to destroy
     */
    destroy(entity) {
        if (entity.scene != null)
            this.remove(entity);
        entity.destroyed();
        entity.isCreated = false;
    }
    find(className) {
        let entity = null;
        this.entities.each((e) => {
            if (e instanceof className) {
                entity = e;
                return false;
            }
        });
        return entity;
    }
    findEach(className, callback) {
        this.entities.each((e) => {
            if (e instanceof className)
                return callback(e);
        });
    }
    findAll(className) {
        const list = [];
        this.entities.each((e) => {
            if (e instanceof className)
                list.push(e);
        });
        return list;
    }
    firstInGroup(group) {
        if (this.groups[group] !== undefined && this.groups[group].count > 0)
            return this.groups[group].first();
        return null;
    }
    eachInGroup(group, callback) {
        if (this.groups[group] !== undefined)
            this.groups[group].each(callback);
    }
    allInGroup(group) {
        if (this.groups[group] !== undefined)
            return this.groups[group];
        return null;
    }
    eachInGroups(groups, callback) {
        let stop = false;
        for (let i = 0; i < groups.length && !stop; i++) {
            this.eachInGroup(groups[i], (e) => {
                const result = callback(e);
                if (result === false)
                    stop = true;
                return result;
            });
        }
    }
    allInGroups(groups, into = null) {
        if (into == null || into === undefined)
            into = new util_1.ObjectList();
        for (const group of groups) {
            const list = this.allInGroup(group);
            if (list != null)
                list.each((e) => into.add(e));
        }
        return into;
    }
    firstColliderInTag(tag) {
        if (this.colliders[tag] !== undefined && this.colliders[tag].length > 0)
            return this.colliders[tag][0];
        return null;
    }
    allCollidersInTag(tag) {
        if (this.colliders[tag] !== undefined)
            return this.colliders[tag];
        return [];
    }
    addRenderer(renderer) {
        renderer.scene = this;
        this.renderers.add(renderer);
        return renderer;
    }
    removeRenderer(renderer, dispose) {
        this.renderers.remove(renderer);
        if (dispose)
            renderer.dispose();
        renderer.scene = null;
        return renderer;
    }
    _groupEntity(entity, group) {
        if (this.groups[group] === undefined)
            this.groups[group] = new util_1.ObjectList();
        this.groups[group].add(entity);
    }
    _ungroupEntity(entity, group) {
        if (this.groups[group] !== undefined)
            this.groups[group].remove(entity);
    }
    _trackComponent(component) {
        if (component.entity == null || component.entity.scene !== this)
            throw new Error("Component must be added through an existing entity");
        if (component instanceof collider_1.Collider) {
            for (const tag of component.tags)
                this._trackCollider(component, tag);
        }
        component.scene = this;
        component.addedToScene();
    }
    _untrackComponent(component) {
        component.removedFromScene();
        if (component instanceof collider_1.Collider) {
            for (const tag of component.tags)
                this._untrackCollider(component, tag);
        }
        component.scene = null;
    }
    _trackCollider(collider, tag) {
        if (this.colliders[tag] === undefined)
            this.colliders[tag] = [];
        this.colliders[tag].push(collider);
    }
    _untrackCollider(collider, tag) {
        if (this.colliders[tag] !== undefined) {
            const index = this.colliders[tag].indexOf(collider);
            if (index >= 0) {
                this.colliders[tag].splice(index, 1);
                if (this.colliders[tag].length <= 0)
                    delete this.colliders[tag];
            }
        }
    }
}
exports.Scene = Scene;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
/**
 * Handles File IO stuff and the differences between Browser / Desktop mode
 */
class IO {
    /**
     * Called internally by Engine
     */
    static init() {
        if (IO.fs == null && engine_1.Engine.client === engine_1.Client.Electron) {
            IO.fs = __webpack_require__(46);
            IO.path = __webpack_require__(47);
        }
    }
    /**
     * Reads the contents of a file, using fs.readFile if in Electron, or http request otherwise
     * @param path Path to file
     * @param callback Callback with the contents of the file
     */
    static read(path, callback) {
        if (engine_1.Engine.client === engine_1.Client.Electron) {
            IO.fs.readFile(IO.path.join(__dirname, path), "utf8", (err, data) => {
                if (err)
                    throw err;
                callback(data);
            });
        }
        else {
            const httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = (e) => {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200)
                        callback(httpRequest.responseText);
                    else
                        throw new Error("Unable to read file " + path);
                }
            };
            httpRequest.open("GET", path);
            httpRequest.send();
        }
    }
    /**
     * Combines parts of a path into a single string
     * @param paths the paths to join
     */
    static join(...paths) {
        if (paths.length <= 0)
            return ".";
        if (engine_1.Engine.client === engine_1.Client.Electron) {
            let result = paths[0];
            for (let i = 1; i < paths.length; i++)
                result = IO.path.join(result, paths[i]);
            return result;
        }
        else {
            const result = [];
            for (const part of paths) {
                const sub = part.split("/");
                for (const s of sub)
                    result.push(s);
            }
            return result.length > 0 ? result.join("/") : ".";
        }
    }
    /**
     * Returns the file extension of the given path
     * @param path
     */
    static extension(path) {
        let ext = "";
        const parts = (/(?:\.([^.]+))?$/).exec(path);
        if (parts.length > 1)
            ext = parts[1];
        return ext;
    }
}
IO.fs = null;
IO.path = null;
exports.IO = IO;

/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = Fs;

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = Path;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(22));
__export(__webpack_require__(51));
var particleSystem_1 = __webpack_require__(55);
exports.ParticleSystem = particleSystem_1.ParticleSystem;
var particleTemplate_1 = __webpack_require__(24);
exports.ParticleTemplate = particleTemplate_1.ParticleTemplate;
var alarm_1 = __webpack_require__(57);
exports.Alarm = alarm_1.Alarm;
var coroutine_1 = __webpack_require__(58);
exports.Coroutine = coroutine_1.Coroutine;
var physics_1 = __webpack_require__(59);
exports.Physics = physics_1.Physics;
var tween_1 = __webpack_require__(60);
exports.Tween = tween_1.Tween;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const util_1 = __webpack_require__(0);
const collider_1 = __webpack_require__(5);
class Hitbox extends collider_1.Collider {
    get sceneLeft() { return this.scenePosition.x + this.left; }
    get sceneRight() { return this.scenePosition.x + this.left + this.width; }
    get sceneTop() { return this.scenePosition.y + this.top; }
    get sceneBottom() { return this.scenePosition.y + this.top + this.height; }
    get sceneBounds() { return new util_1.Rectangle(this.sceneLeft, this.sceneTop, this.width, this.height); }
    constructor(left, top, width, height, tags) {
        super();
        this.type = "Hitbox";
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        if (tags !== undefined)
            for (const tag of tags)
                this.tag(tag);
    }
    debugRender() {
        engine_1.Engine.graphics.hollowRect(this.sceneLeft, this.sceneTop, this.width, this.height, 1, util_1.Color.red);
    }
}
exports.Hitbox = Hitbox;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const util_1 = __webpack_require__(0);
const collider_1 = __webpack_require__(5);
class Hitgrid extends collider_1.Collider {
    constructor(tileWidth, tileHeight, tags) {
        super();
        this.map = {};
        this.debugSub = new util_1.Color(200, 200, 200, 0.5);
        this.type = "Hitgrid";
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        if (tags !== undefined)
            for (const tag of tags)
                this.tag(tag);
    }
    set(solid, tx, ty, columns, rows) {
        for (let x = tx; x < tx + (columns || 1); x++) {
            if (this.map[x] === undefined)
                this.map[x] = {};
            for (let y = ty; y < ty + (rows || 1); y++)
                if (solid)
                    this.map[x][y] = solid;
                else
                    delete this.map[x][y];
        }
    }
    has(tx, ty, columns, rows) {
        for (let x = tx; x < tx + (columns || 1); x++)
            if (this.map[x] !== undefined)
                for (let y = ty; y < ty + (rows || 1); y++)
                    if (this.map[x][y] === true)
                        return true;
        return false;
    }
    debugRender(camera) {
        // get bounds of rendering
        const bounds = camera.extents;
        const pos = this.scenePosition;
        const left = Math.floor((bounds.left - pos.x) / this.tileWidth) - 1;
        const right = Math.ceil((bounds.right - pos.x) / this.tileWidth) + 1;
        const top = Math.floor((bounds.top - pos.y) / this.tileHeight) - 1;
        const bottom = Math.ceil((bounds.bottom - pos.y) / this.tileHeight) + 1;
        for (let tx = left; tx < right; tx++) {
            if (this.map[tx] === undefined)
                continue;
            for (let ty = top; ty < bottom; ty++) {
                if (this.map[tx][ty] === true) {
                    const l = this.has(tx - 1, ty);
                    const r = this.has(tx + 1, ty);
                    const u = this.has(tx, ty - 1);
                    const d = this.has(tx, ty + 1);
                    const px = pos.x + tx * this.tileWidth;
                    const py = pos.y + ty * this.tileHeight;
                    engine_1.Engine.graphics.rect(px, py, 1, this.tileHeight, l ? util_1.Color.red : this.debugSub);
                    engine_1.Engine.graphics.rect(px, py, this.tileWidth, 1, u ? util_1.Color.red : this.debugSub);
                    engine_1.Engine.graphics.rect(px + this.tileWidth - 1, py, 1, this.tileHeight, r ? util_1.Color.red : this.debugSub);
                    engine_1.Engine.graphics.rect(px, py + this.tileHeight - 1, this.tileWidth, 1, d ? util_1.Color.red : this.debugSub);
                }
            }
        }
    }
}
exports.Hitgrid = Hitgrid;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var graphic_1 = __webpack_require__(23);
exports.Graphic = graphic_1.Graphic;
var rectsprite_1 = __webpack_require__(52);
exports.Rectsprite = rectsprite_1.Rectsprite;
var sprite_1 = __webpack_require__(53);
exports.Sprite = sprite_1.Sprite;
var tilemap_1 = __webpack_require__(54);
exports.Tilemap = tilemap_1.Tilemap;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const component_1 = __webpack_require__(2);
const util_1 = __webpack_require__(0);
class Rectsprite extends component_1.Component {
    constructor(width, height, color) {
        super();
        this.size = new util_1.Vector(0, 0);
        this.scale = new util_1.Vector(1, 1);
        this.origin = new util_1.Vector(0, 0);
        this.rotation = 0;
        this.color = util_1.Color.white.clone();
        this.alpha = 1;
        this.size.x = width;
        this.size.y = height;
        this.color = color || util_1.Color.white;
    }
    get width() { return this.size.x; }
    set width(val) { this.size.x = val; }
    get height() { return this.size.y; }
    set height(val) { this.size.y = val; }
    render() {
        // draw with a pixel texture (shader is using textures)
        if (engine_1.Engine.graphics.shader.sampler2d != null) {
            engine_1.Engine.graphics.texture(engine_1.Engine.graphics.pixel, this.scenePosition.x, this.scenePosition.y, null, util_1.Color.temp.copy(this.color).mult(this.alpha), util_1.Vector.temp0.copy(this.origin).div(this.size), util_1.Vector.temp1.copy(this.size).mult(this.scale), this.rotation);
        }
        else {
            engine_1.Engine.graphics.quad(this.scenePosition.x, this.scenePosition.y, this.size.x, this.size.y, util_1.Color.temp.copy(this.color).mult(this.alpha), this.origin, this.scale, this.rotation);
        }
    }
}
exports.Rectsprite = Rectsprite;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const graphic_1 = __webpack_require__(23);
const assets_1 = __webpack_require__(4);
const engine_1 = __webpack_require__(1);
const util_1 = __webpack_require__(0);
class Sprite extends graphic_1.Graphic {
    constructor(animation) {
        super(null);
        this._animation = null;
        this._playing = null;
        this._frame = 0;
        this.rate = 1;
        engine_1.Engine.assert(assets_1.SpriteBank.has(animation), "Missing animation '" + animation + "'!");
        this._animation = assets_1.SpriteBank.get(animation);
        this.texture = this._animation.first.frames[0];
    }
    get animation() { return this._animation; }
    get playing() { return this._playing; }
    get frame() { return Math.floor(this._frame); }
    set frame(n) {
        this._frame = n;
        if (this.playing != null) {
            this._frame = util_1.Calc.clamp(n, 0, this.playing.frames.length);
            this.texture = this.playing.frames[this.frame];
        }
    }
    play(name, restart) {
        if (this.animation == null)
            return;
        const next = this.animation.get(name);
        if (next !== null && (this.playing !== next || restart)) {
            this._playing = next;
            this._frame = 0;
            this.active = true;
            if (this._playing.frames.length > 0)
                this.texture = this._playing.frames[0];
        }
    }
    has(name) {
        return this.animation != null && this.animation.has(name);
    }
    update() {
        if (this.playing != null) {
            this._frame += this.playing.speed * this.rate * engine_1.Engine.delta;
            if (this.frame >= this.playing.frames.length || this.frame < 0) {
                // loop this animation
                if (this.playing.loops) {
                    while (this._frame >= this.playing.frames.length)
                        this._frame -= this.playing.frames.length;
                    while (this._frame < 0)
                        this._frame += this.playing.frames.length;
                }
                else if (this.playing.goto != null && this.playing.goto.length > 0) {
                    const next = this.playing.goto[Math.floor(Math.random() * this.playing.goto.length)];
                    this.play(next, true);
                }
                else {
                    this.active = false;
                    if (this.frame >= this.playing.frames.length)
                        this._frame = this.playing.frames.length - 1;
                    else
                        this._frame = 0;
                }
            }
            if (this.playing != null)
                this.texture = this.playing.frames[this.frame];
        }
    }
    render(camera) {
        if (this.texture != null)
            super.render(camera);
    }
}
exports.Sprite = Sprite;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const component_1 = __webpack_require__(2);
const util_1 = __webpack_require__(0);
class Tilemap extends component_1.Component {
    constructor(texture, tileWidth, tileHeight) {
        super();
        this.color = util_1.Color.white.clone();
        this.alpha = 1;
        this.map = {};
        this.crop = new util_1.Rectangle();
        this.texture = texture;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileColumns = this.texture.width / this.tileWidth;
    }
    set(tileX, tileY, mapX, mapY, mapWidth, mapHeight) {
        const tileIndex = tileX + tileY * this.tileColumns;
        for (let x = mapX; x < mapX + (mapWidth || 1); x++) {
            if (this.map[x] === undefined)
                this.map[x] = {};
            for (let y = mapY; y < mapY + (mapHeight || 1); y++)
                this.map[x][y] = tileIndex;
        }
        return this;
    }
    clear(mapX, mapY, mapWidth, mapHeight) {
        for (let x = mapX; x < mapX + (mapWidth || 1); x++)
            if (this.map[x] !== undefined)
                for (let y = mapY; y < mapY + (mapHeight || 1); y++)
                    if (this.map[x][y] !== undefined)
                        delete this.map[x][y];
        return this;
    }
    has(mapX, mapY) {
        return (this.map[mapX] !== undefined && this.map[mapX][mapY] !== undefined);
    }
    get(mapX, mapY) {
        if (this.has(mapX, mapY)) {
            const index = this.map[mapX][mapY];
            return new util_1.Vector(index % this.tileColumns, Math.floor(index / this.tileColumns));
        }
        return null;
    }
    render(camera) {
        // get bounds of rendering
        const bounds = camera.extents;
        const pos = this.scenePosition;
        const left = Math.floor((bounds.left - pos.x) / this.tileWidth) - 1;
        const right = Math.ceil((bounds.right - pos.x) / this.tileWidth) + 1;
        const top = Math.floor((bounds.top - pos.y) / this.tileHeight) - 1;
        const bottom = Math.ceil((bounds.bottom - pos.y) / this.tileHeight) + 1;
        // tile texture cropping
        this.crop.width = this.tileWidth;
        this.crop.height = this.tileHeight;
        for (let tx = left; tx < right; tx++) {
            if (this.map[tx] === undefined)
                continue;
            for (let ty = top; ty < bottom; ty++) {
                const index = this.map[tx][ty];
                if (index !== undefined) {
                    this.crop.x = (index % this.tileColumns) * this.tileWidth;
                    this.crop.y = Math.floor(index / this.tileColumns) * this.tileHeight;
                    engine_1.Engine.graphics.texture(this.texture, pos.x + tx * this.tileWidth, pos.y + ty * this.tileHeight, this.crop, util_1.Color.temp.copy(this.color).mult(this.alpha));
                }
            }
        }
    }
}
exports.Tilemap = Tilemap;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const component_1 = __webpack_require__(2);
const util_1 = __webpack_require__(0);
const particle_1 = __webpack_require__(56);
const particleTemplate_1 = __webpack_require__(24);
class ParticleSystem extends component_1.Component {
    constructor(template) {
        super();
        this.renderRelativeToEntity = false;
        this.particles = [];
        this.template = particleTemplate_1.ParticleTemplate.templates[template];
    }
    update() {
        const dt = engine_1.Engine.delta;
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            if (p.percent >= 1) {
                this.particles.splice(i, 1);
                ParticleSystem.cache.push(p);
                continue;
            }
            p.percent = Math.min(1, p.percent + dt / p.duration);
            p.x += p.speedX * dt;
            p.y += p.speedY * dt;
            p.speedX += p.accelX * dt;
            p.speedY += p.accelY * dt;
            p.speedX = util_1.Calc.approach(p.speedX, 0, p.frictionX * dt);
            p.speedY = util_1.Calc.approach(p.speedY, 0, p.frictionY * dt);
        }
    }
    render(camera) {
        let tex = this.template.texture;
        if (tex == null)
            tex = engine_1.Engine.graphics.pixel;
        if (tex == null)
            throw new Error("Particle requires a Texture");
        let pos = this.position;
        if (this.renderRelativeToEntity)
            pos = this.scenePosition;
        const t = this.template;
        for (const p of this.particles) {
            const lerp = p.percent;
            const x = pos.x + p.x;
            const y = pos.y + p.y;
            const scaleX = p.scaleFromX + (p.scaleToX - p.scaleFromX) * t.scaleXEaser(lerp);
            const scaleY = p.scaleFromY + (p.scaleToY - p.scaleFromY) * t.scaleYEaser(lerp);
            const rotation = p.rotationFrom + (p.rotationTo - p.rotationFrom) * t.rotationEaser(lerp);
            const alpha = p.alphaFrom + (p.alphaTo - p.alphaFrom) * t.alphaEaser(lerp);
            const color = ParticleSystem.color.lerp(p.colorFrom, p.colorTo, t.colorEaser(lerp)).mult(alpha);
            engine_1.Engine.graphics.texture(tex, x, y, null, color, ParticleSystem.origin, ParticleSystem.scale.set(scaleX, scaleY), rotation);
        }
    }
    burst(x, y, direction, rangeX, rangeY, count) {
        const t = this.template;
        if (rangeX === undefined || rangeX == null)
            rangeX = 0;
        if (rangeY === undefined || rangeY == null)
            rangeY = 0;
        if (count === undefined)
            count = 1;
        for (let i = 0; i < count; i++) {
            const duration = t.durationBase + util_1.Calc.range(t.durationRange);
            if (duration <= 0)
                continue;
            // get particle
            let p = null;
            if (ParticleSystem.cache.length > 0) {
                p = ParticleSystem.cache[0];
                ParticleSystem.cache.splice(0, 1);
            }
            else
                p = new particle_1.Particle();
            const speed = t.speedBase + util_1.Calc.range(t.speedRange);
            // spawn particle
            p.percent = 0;
            p.duration = duration;
            p.x = x + util_1.Calc.range(rangeX);
            p.y = y + util_1.Calc.range(rangeY);
            p.colorFrom = util_1.Calc.choose(t.colorsFrom);
            p.colorTo = util_1.Calc.choose(t.colorsTo);
            p.speedX = Math.cos(direction) * speed;
            p.speedY = -Math.sin(direction) * speed;
            p.accelX = t.accelBaseX + util_1.Calc.range(t.accelRangeX);
            p.accelY = t.accelBaseY + util_1.Calc.range(t.accelRangeY);
            p.frictionX = t.frictionBaseX + util_1.Calc.range(t.frictionRangeX);
            p.frictionY = t.frictionBaseY + util_1.Calc.range(t.frictionRangeY);
            p.scaleFromX = t.scaleFromBaseX + util_1.Calc.range(t.scaleFromRangeX);
            p.scaleFromY = t.scaleFromBaseY + util_1.Calc.range(t.scaleFromRangeY);
            p.scaleToX = t.scaleToBaseX + util_1.Calc.range(t.scaleToRangeX);
            p.scaleToY = t.scaleToBaseY + util_1.Calc.range(t.scaleToRangeY);
            p.rotationFrom = t.rotationFromBase + util_1.Calc.range(t.rotationFromRange);
            p.rotationTo = t.rotationToBase + util_1.Calc.range(t.rotationToRange);
            p.alphaFrom = t.alphaFromBase + util_1.Calc.range(t.alphaFromRange);
            p.alphaTo = t.alphaToBase + util_1.Calc.range(t.alphaToRange);
            // addd
            this.particles.push(p);
        }
    }
}
ParticleSystem.cache = [];
// temp values used during rendering so we aren't creating new ones every frame
ParticleSystem.color = new util_1.Color();
ParticleSystem.origin = new util_1.Vector(0.5, 0.5);
ParticleSystem.scale = new util_1.Vector(0, 0);
exports.ParticleSystem = ParticleSystem;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Particle {
}
exports.Particle = Particle;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const component_1 = __webpack_require__(2);
class Alarm extends component_1.Component {
    constructor() {
        super();
        this._percent = 0;
        /**
         * If the Alarm should be removed from the Entity upon completion
         */
        this.removeOnComplete = false;
        this.active = this.visible = false;
    }
    /**
     * Gets the current Percent of the Alarm
     */
    get percent() { return this._percent; }
    /**
     * Gets the current Duration of the Alarm
     */
    get duration() { return this._duration; }
    /**
     * Starts the Alarm
     */
    start(duration, callback) {
        this._percent = 0;
        this._duration = duration;
        this.callback = callback;
        return this;
    }
    /**
     * Restarts the Alarm
     */
    restart() {
        this._percent = 0;
        return this;
    }
    /**
     * Resumes the Alarm if it was paused
     */
    resume() {
        if (this.percent < 1)
            this.active = true;
        return this;
    }
    /**
     * Pauses the Alarm if it was active
     */
    pause() {
        this.active = false;
        return this;
    }
    /**
     * Updates the Alarm (automatically called during its Entity's update)
     */
    update() {
        if (this.percent < 1 && this.duration > 0) {
            this._percent += engine_1.Engine.delta / this.duration;
            if (this.percent >= 1) {
                this._percent = 1;
                this.active = false;
                this.callback(this);
                if (this.removeOnComplete)
                    this.entity.remove(this);
            }
        }
    }
    /**
     * Creates and adds a new Alarm on the given Entity
     */
    static create(on) {
        const alarm = new Alarm();
        on.add(alarm);
        return alarm;
    }
}
exports.Alarm = Alarm;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const component_1 = __webpack_require__(2);
/**
 * Coroutine Class. This uses generator functions which are only supported in ES6 and is missing in many browsers.
 * More information:https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/function*
 */
class Coroutine extends component_1.Component {
    /**
     * @param call? 	if set, immediately starts he Coroutine with the given Iterator
     */
    constructor(call) {
        super();
        this.wait = 0;
        this.iterator = null;
        this.active = this.visible = false;
        if (call)
            this.start(call);
    }
    /**
     * Starts the Coroutine with the given Iterator
     */
    start(call) {
        this.iterator = call();
        this.active = true;
        return this;
    }
    /**
     * Resumes the current Coroutine (sets this.active to true)
     */
    resume() {
        this.active = true;
        return this;
    }
    /**
     * Pauses the current Coroutine (sets this.active to false)
     */
    pause() {
        this.active = false;
        return this;
    }
    /**
     * Stops the Coroutine, and sets the current Iterator to null
     */
    stop() {
        this.wait = 0;
        this.active = false;
        this.iterator = null;
        return this;
    }
    /**
     * Updates the Coroutine (automatically called its Entity's update)
     */
    update() {
        this.wait -= engine_1.Engine.delta;
        if (this.wait > 0)
            return;
        this.step();
    }
    /**
     * Steps the Coroutine through the Iterator once
     */
    step() {
        if (this.iterator != null) {
            const next = this.iterator.next();
            if (next.done)
                this.end(next.value === "remove");
            else {
                if (next.value == null)
                    this.wait = 0;
                else if ((typeof next.value) === "number")
                    this.wait = parseFloat(next.value);
            }
        }
    }
    /**
     * Calls Coroutine.stop and will optionally remove itself from the Entity
     */
    end(remove) {
        this.stop();
        if (remove)
            this.entity.remove(this);
    }
}
exports.Coroutine = Coroutine;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const colliders_1 = __webpack_require__(22);
const core_1 = __webpack_require__(3);
const util_1 = __webpack_require__(0);
class Physics extends colliders_1.Hitbox {
    constructor(left, top, width, height, tags, solids) {
        super(left, top, width, height, tags);
        this.solids = [];
        this.speed = new util_1.Vector(0, 0);
        this.remainder = new util_1.Vector(0, 0);
        if (solids !== undefined)
            this.solids = solids;
    }
    update() {
        if (this.speed.x !== 0)
            this.moveX(this.speed.x * core_1.Engine.delta);
        if (this.speed.y !== 0)
            this.moveY(this.speed.y * core_1.Engine.delta);
    }
    moveBy(amount) {
        const movedX = this.moveX(amount.x);
        const movedY = this.moveY(amount.y);
        return movedX && movedY;
    }
    move(x, y) {
        const movedX = this.moveX(x);
        const movedY = this.moveY(y);
        return movedX && movedY;
    }
    moveX(amount) {
        let moveBy = amount + this.remainder.x;
        this.remainder.x = moveBy % 1;
        moveBy -= this.remainder.x;
        return this.moveXAbsolute(moveBy);
    }
    moveXAbsolute(amount) {
        if (this.solids.length <= 0) {
            this.entity.x += Math.round(amount);
        }
        else {
            const sign = util_1.Calc.sign(amount);
            amount = Math.abs(Math.round(amount));
            while (amount > 0) {
                const hit = this.collides(this.solids, sign, 0);
                if (hit != null) {
                    this.remainder.x = 0;
                    if (this.onCollideX != null)
                        this.onCollideX(hit);
                    return false;
                }
                else {
                    this.entity.x += sign;
                    amount -= 1;
                }
            }
        }
        return true;
    }
    moveY(amount) {
        let moveBy = amount + this.remainder.y;
        this.remainder.y = moveBy % 1;
        moveBy -= this.remainder.y;
        return this.moveYAbsolute(moveBy);
    }
    moveYAbsolute(amount) {
        if (this.solids.length <= 0) {
            this.entity.y += Math.round(amount);
        }
        else {
            const sign = util_1.Calc.sign(amount);
            amount = Math.abs(Math.round(amount));
            while (amount > 0) {
                const hit = this.collides(this.solids, 0, sign);
                if (hit != null) {
                    this.remainder.y = 0;
                    if (this.onCollideY != null)
                        this.onCollideY(hit);
                    return false;
                }
                else {
                    this.entity.y += sign;
                    amount -= 1;
                }
            }
        }
        return true;
    }
    friction(fx, fy) {
        if (this.speed.x < 0)
            this.speed.x = Math.min(0, this.speed.x + fx * core_1.Engine.delta);
        else if (this.speed.x > 0)
            this.speed.x = Math.max(0, this.speed.x - fx * core_1.Engine.delta);
        if (this.speed.y < 0)
            this.speed.y = Math.min(0, this.speed.y + fy * core_1.Engine.delta);
        else if (this.speed.y > 0)
            this.speed.y = Math.max(0, this.speed.y - fy * core_1.Engine.delta);
        return this;
    }
    maxspeed(mx, my) {
        if (mx !== undefined && mx != null)
            this.speed.x = Math.max(-mx, Math.min(mx, this.speed.x));
        if (my !== undefined && my != null)
            this.speed.y = Math.max(-my, Math.min(my, this.speed.y));
        return this;
    }
    circularMaxspeed(length) {
        if (this.speed.length > length)
            this.speed.normalize().scale(length);
        return this;
    }
    stop() {
        this.speed.x = this.speed.y = 0;
        this.remainder.x = this.remainder.y = 0;
    }
}
exports.Physics = Physics;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = __webpack_require__(1);
const component_1 = __webpack_require__(2);
class Tween extends component_1.Component {
    constructor() {
        super();
        this._percent = 0;
        /**
         * From value of the Tween (when percent is 0)
         */
        this.from = 0;
        /**
         * To value of the Tween (when percent is 1)
         */
        this.to = 0;
        /**
         * Easer function (ex. Linear would be (p) => { return p; })
         * Alternatively, use the static Ease methods
         */
        this.ease = (p) => p;
        /**
         * If the Tween should be removed upon completion
         */
        this.removeOnComplete = false;
        this.active = this.visible = false;
    }
    /**
     * Gets the current Percent of the Tween
     */
    get percent() { return this._percent; }
    /**
     * Gets the current Duration of the Tween
     */
    get duration() { return this._duration; }
    /**
     * The value of the Tween at the current Percent
     */
    get value() { return this.from + (this.to - this.from) * this.ease(this.percent); }
    /**
     * Initializes the Tween and begins running
     */
    start(duration, from, to, ease, step, removeOnComplete) {
        this._percent = 0;
        this._duration = duration;
        this.from = from;
        this.to = to;
        this.ease = ease;
        this.step = step;
        this.removeOnComplete = removeOnComplete;
        return this;
    }
    /**
     * Restarts the current Tween
     */
    restart() {
        this._percent = 0;
        this.active = true;
        return this;
    }
    /**
     * Resumes the current tween if it was paused
     */
    resume() {
        if (this.percent < 1)
            this.active = true;
        return this;
    }
    /**
     * Pauses the current tween if it was active
     */
    pause() {
        this.active = false;
        return this;
    }
    /**
     * Upates the tween (automatically called when its Entity is updated)
     */
    update() {
        if (this.percent < 1 && this.duration > 0) {
            this._percent += engine_1.Engine.delta / this.duration;
            if (this.percent >= 1) {
                this._percent = 1;
                this.step(this.to);
                this.active = false;
                if (this.removeOnComplete)
                    this.entity.remove(this);
            }
            else
                this.step(this.value);
        }
    }
    /**
     * Creates a new tween on an existing entity
     */
    static create(on) {
        const tween = new Tween();
        on.add(tween);
        return tween;
    }
}
exports.Tween = Tween;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var primitiveRenderer_1 = __webpack_require__(62);
exports.PrimitiveRenderer = primitiveRenderer_1.PrimitiveRenderer;
var spriteRenderer_1 = __webpack_require__(21);
exports.SpriteRenderer = spriteRenderer_1.SpriteRenderer;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __webpack_require__(0);
const renderer_1 = __webpack_require__(10);
/**
 * Uses the Primitive Shader when rendering
 */
class PrimitiveRenderer extends renderer_1.Renderer {
    constructor() {
        super();
        this.shader = util_1.Shaders.primitive;
        this.shaderCameraUniformName = "matrix";
    }
}
exports.PrimitiveRenderer = PrimitiveRenderer;


/***/ })
/******/ ]);