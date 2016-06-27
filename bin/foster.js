class Component {
    constructor() {
        this._entity = null;
        this._scene = null;
        this.active = true;
        this.visible = true;
        this.position = new Vector(0, 0);
    }
    get entity() { return this._entity; }
    set entity(val) {
        if (this._entity != null)
            throw "This Component is already attached to an Entity";
        this._entity = val;
    }
    get scene() { return this._scene; }
    set scene(val) {
        if (this._scene != null)
            throw "This Component is already attached to a Scene";
        this._scene = val;
    }
    get x() { return this.position.x; }
    set x(val) { this.position.x = val; }
    get y() { return this.position.y; }
    set y(val) { this.position.y = val; }
    get scenePosition() {
        return new Vector((this._entity ? this._entity.x : 0) + this.position.x, (this._entity ? this._entity.y : 0) + this.position.y);
    }
    addedToEntity() { }
    addedToScene() { }
    removedFromEntity() { }
    removedFromScene() { }
    update() { }
    render(camera) { }
    debugRender(camera) { }
}
var Client;
(function (Client) {
    Client[Client["Desktop"] = 0] = "Desktop";
    Client[Client["Web"] = 1] = "Web";
})(Client || (Client = {}));
var EngineMode;
(function (EngineMode) {
    EngineMode[EngineMode["Strict"] = 0] = "Strict";
    EngineMode[EngineMode["Normal"] = 1] = "Normal";
})(EngineMode || (EngineMode = {}));
class Engine {
    constructor(mode) {
        this.scene = null;
        this.nextScene = null;
        if (Engine.instance != null)
            throw "Engine has already been instantiated";
        if (!Engine.started)
            throw "Engine must be instantiated through static Engine.start";
        Engine.instance = this;
        this.mode = mode;
        this.client = (typeof require === 'function' ? Client.Desktop : Client.Web);
        this.startTime = Date.now();
    }
    // properties
    static get root() { return Engine.instance.root; }
    static get mode() { return Engine.instance.mode; }
    static get client() { return Engine.instance.client; }
    static get scene() { return (Engine.instance.nextScene != null ? Engine.instance.nextScene : Engine.instance.scene); }
    static set scene(val) { Engine.instance.nextScene = val; }
    static get width() { return Engine.instance.width; }
    static get height() { return Engine.instance.height; }
    static get debugMode() { return Engine.instance.debuggerEnabled; }
    static set debugMode(v) { Engine.instance.debuggerEnabled = v; }
    // time
    static get delta() { return Engine.instance.dt; }
    static get elapsed() { return Engine.instance.elapsed; }
    // graphics
    static get graphics() { return Engine.instance.graphics; }
    static resize(width, height) {
        Engine.instance.width = width;
        Engine.instance.height = height;
        Engine.instance.graphics.resize();
    }
    /**
     * Starts up the Game Engine
     * @param title 	Window Title
     * @param width 	Game Width
     * @param height 	Game Height
     * @param scale 	Scales the Window (on Desktop) to width*scale and height*scale
     * @param ready 	Callback when the Engine is ready
     */
    static start(title, width, height, scale, mode, ready) {
        // instantiate
        Engine.started = true;
        new Engine(mode);
        new GameWindow();
        // window
        GameWindow.title = title;
        GameWindow.resize(width * scale, height * scale);
        GameWindow.center();
        // wait for window
        window.onload = function () {
            var c = String.fromCharCode(0x25cf);
            console.log("%c " + c + " ENGINE START " + c + " ", "background: #222; color: #ff44aa;");
            Engine.instance.root = document.getElementsByTagName("body")[0];
            // graphics
            Engine.instance.graphics = new Graphics(Engine.instance);
            Engine.resize(width, height);
            Shaders.init();
            Mouse.init();
            Keys.init();
            // start update loop
            Engine.instance.step();
            // ready callback for game
            if (ready != undefined)
                ready();
        };
    }
    static assert(value, message) {
        if (!value) {
            if (Engine.mode == EngineMode.Strict)
                throw message;
            else {
                console.warn("%c " + message, "background: #222; color: #ff1144;");
            }
        }
        return value;
    }
    step() {
        // time management!
        var time = Date.now();
        this.elapsed = Math.floor(time - this.startTime) / 1000;
        this.dt = Math.floor(time - this.lastTime) / 1000;
        this.lastTime = time;
        // reset graphics
        this.graphics.clear(this.graphics.clearColor);
        this.graphics.update();
        // update inputs
        Mouse.update();
        Keys.update();
        // swap scenes
        if (this.nextScene != null) {
            if (this.scene != null)
                this.scene.ended();
            this.scene = this.nextScene;
            this.nextScene = null;
            this.scene.begin();
        }
        // update scene
        if (this.scene != null)
            this.scene.update();
        // begin drawing
        this.graphics.reset();
        // render current scene
        if (this.scene != null)
            this.scene.render();
        // final flush on graphics
        this.graphics.flush();
        this.graphics.output();
        // do it all again!
        requestAnimationFrame(this.step.bind(this));
    }
}
Engine.instance = null;
Engine.started = false;
class Entity {
    constructor() {
        this.position = new Vector(0, 0);
        this.visible = true;
        this.active = true;
        this.instantiated = false;
        this.components = [];
        this.groups = [];
        this._depth = 0;
        this._nextDepth = null;
    }
    get x() { return this.position.x; }
    set x(val) { this.position.x = val; }
    get y() { return this.position.y; }
    set y(val) { this.position.y = val; }
    get depth() {
        if (this._nextDepth != null)
            return this._nextDepth;
        return this._depth;
    }
    set depth(val) {
        if (this.scene != null) {
            if (this._nextDepth != null)
                this.scene.sorting.push(this);
            this._nextDepth = val;
        }
        else
            this._depth = val;
    }
    /**
     * Called the first time the entity is created (after constructor)
     */
    created() {
    }
    /**
     * Called when the entity is added to a Scene
     */
    added() {
    }
    /**
     * Called when the entity is removed from a Scene
     */
    removed() {
    }
    /**
     * Called when the entity is recycled in a Scene
     */
    recycled() {
    }
    /**
     * Called when an entity is perminantely destroyed
     */
    destroy() {
    }
    /**
     * Called every game-step, if this entity is in a Scene and Active
     */
    update() {
        for (let i = 0; i < this.components.length; i++)
            if (this.components[i].active)
                this.components[i].update();
    }
    /**
     * Called via a Renderer, if Visible
     */
    render(camera) {
        for (let i = 0; i < this.components.length; i++)
            if (this.components[i].visible)
                this.components[i].render(camera);
    }
    /**
     * Called via the Debug Renderer
     */
    debugRender(camera) {
        Engine.graphics.hollowRect(new Rectangle(this.x - 5, this.y - 5, 10, 10), 1, Color.white);
        for (let i = 0; i < this.components.length; i++)
            if (this.components[i].visible)
                this.components[i].debugRender(camera);
    }
    add(component) {
        this.components.push(component);
        component.entity = this;
        component.addedToEntity();
        if (this.scene != null)
            this.scene._trackComponent(component);
    }
    remove(component) {
        let index = this.components.indexOf(component);
        if (index >= 0) {
            this.components.splice(index, 1);
            component.removedFromEntity();
            component.entity = null;
            if (this.scene != null)
                this.scene._untrackComponent(component);
        }
    }
    removeAll() {
        for (let i = this.components.length - 1; i >= 0; i--)
            this.remove(this.components[i]);
    }
    find(className) {
        for (let i = 0; i < this.components.length; i++)
            if (this.components[i] instanceof className)
                return this.components[i];
        return null;
    }
    findAll(componentClassType) {
        let list = [];
        for (let i = 0; i < this.components.length; i++)
            if (this.components[i] instanceof componentClassType)
                list.push(this.components[i]);
        return list;
    }
    group(groupType) {
        this.groups.push(groupType);
        if (this.scene != null)
            this.scene._groupEntity(this, groupType);
    }
    ungroup(groupType) {
        let index = this.groups.indexOf(groupType);
        if (index >= 0) {
            this.groups.splice(index, 1);
            if (this.scene != null)
                this.scene._ungroupEntity(this, groupType);
        }
    }
    ingroup(groupType) {
        return (this.groups.indexOf(groupType) >= 0);
    }
}
class GameWindow {
    constructor() {
        if (Engine.client == Client.Desktop) {
            var remote = require("electron").remote;
            GameWindow.browserWindow = remote.getCurrentWindow();
            GameWindow.screen = remote.screen;
        }
    }
    static get title() {
        return GameWindow.titleName;
    }
    static set title(val) {
        GameWindow.titleName = val;
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.setTitle(val);
        else
            console.warn("Can only set Title in Client.Desktop mode");
    }
    static get fullscreen() {
        return Engine.client == Client.Desktop && GameWindow.browserWindow.isFullScreen();
    }
    static set fullscreen(val) {
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.setFullScreen(val);
        else
            console.warn("Can only set Fullscreen in Client.Desktop mode");
    }
    static get screenLeft() {
        if (Engine.client == Client.Desktop)
            return GameWindow.browserWindow.getPosition()[0];
        else
            return Engine.graphics.screenCanvas.getBoundingClientRect().top;
    }
    static get screenTop() {
        if (Engine.client == Client.Desktop)
            return GameWindow.browserWindow.getPosition()[1];
        else
            return Engine.graphics.screenCanvas.getBoundingClientRect().left;
    }
    static get screenWidth() {
        if (Engine.client == Client.Desktop)
            return GameWindow.browserWindow.getContentSize()[0];
        else
            return Engine.graphics.screenCanvas.getBoundingClientRect().width;
    }
    static get screenHeight() {
        if (Engine.client == Client.Desktop)
            return GameWindow.browserWindow.getContentSize()[1];
        else
            return Engine.graphics.screenCanvas.getBoundingClientRect().height;
    }
    static resize(width, height) {
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.setContentSize(width, height);
    }
    static center() {
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.center();
    }
    static toggleDevTools() {
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.toggleDevTools();
    }
    static get screenMouse() {
        if (Engine.client == Client.Desktop) {
            var pos = GameWindow.screen.getCursorScreenPoint();
            return new Vector(pos.x, pos.y);
        }
        return Mouse.absolute;
    }
}
class Graphics {
    /**
     * Creates the Engine.Graphics
     */
    constructor(engine) {
        this.vertices = [];
        this.uvs = [];
        this.colors = [];
        this.currentShader = null;
        this.nextShader = null;
        this.clearColor = new Color(0.1, 0.1, 0.3, 1);
        this.drawCalls = 0;
        // temp. vars used for drawing
        this.topleft = new Vector();
        this.topright = new Vector();
        this.botleft = new Vector();
        this.botright = new Vector();
        this.texToDraw = new Texture(null, new Rectangle(), new Rectangle());
        // pixel drawing
        this._pixel = null;
        this.engine = engine;
        // create the screen
        this.screen = document.createElement("canvas");
        this.screenContext = this.screen.getContext('2d');
        Engine.root.appendChild(this.screen);
        // create the buffer
        this.buffer = document.createElement("canvas");
        this.bufferContext = this.buffer.getContext("experimental-webgl", {
            alpha: false,
            antialias: false
        });
        this.gl.enable(this.gl.BLEND);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.CULL_FACE);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        this.vertexBuffer = this.gl.createBuffer();
        this.uvBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
        this.resize();
    }
    get screenCanvas() { return this.screen; }
    get shader() {
        if (this.nextShader != null)
            return this.nextShader;
        return this.currentShader;
    }
    set shader(s) {
        if (this.shader != s && s != null)
            this.nextShader = s;
    }
    get gl() { return this.bufferContext; }
    get orthographic() { return this.orthoMatrix; }
    /**
     * Called when the Game resolution changes
     */
    resize() {
        // buffer
        this.buffer.width = Engine.width;
        this.buffer.height = Engine.height;
        this.gl.viewport(0, 0, this.buffer.width, this.buffer.height);
        // orthographic matrix
        this.orthoMatrix = new Matrix();
        this.orthoMatrix.translate(-1, 1);
        this.orthoMatrix.scale(1 / this.buffer.width * 2, -1 / this.buffer.height * 2);
    }
    /**
     * Updates the Graphics
     */
    update() {
        // resizing
        if (this.screen.width != Engine.root.clientWidth || this.screen.height != Engine.root.clientHeight) {
            this.screen.width = Engine.root.clientWidth;
            this.screen.height = Engine.root.clientHeight;
        }
    }
    /**
     * Clears the screen
     */
    clear(color) {
        this.gl.clearColor(color.r, color.g, color.b, color.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    /**
     * Draws the game to the Screen canvas
     */
    output() {
        this.screenContext.clearRect(0, 0, this.screen.width, this.screen.height);
        this.screenContext.imageSmoothingEnabled = false;
        let bounds = this.getOutputBounds();
        this.screenContext.drawImage(this.buffer, bounds.x, bounds.y, bounds.width, bounds.height);
    }
    /**
     * Gets the rectangle that the game buffer should be drawn to the screen with
     */
    getOutputBounds() {
        let scale = (Math.min(this.screen.width / this.buffer.width, this.screen.height / this.buffer.height));
        let width = this.buffer.width * scale;
        let height = this.buffer.height * scale;
        return new Rectangle((this.screen.width - width) / 2, (this.screen.height - height) / 2, width, height);
    }
    /**
     * Resets the Graphics rendering
     */
    reset() {
        this.drawCalls = 0;
        this.currentShader = null;
        this.nextShader = null;
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
        this.check();
        // append
        this.vertices.push(x, y);
        this.uvs.push(u, v);
        if (color != undefined && color != null)
            this.colors.push(color.r, color.g, color.b, color.a);
    }
    /**
     * Pushes a list of vertices to the screen. If the shader has been modified, this will end and start a new draw call
     */
    pushList(pos, uv, color) {
        this.check();
        for (let i = 0; i < pos.length; i++) {
            this.vertices.push(pos[i].x, pos[i].y);
            if (uv != undefined && uv != null)
                this.uvs.push(uv[i].x, uv[i].y);
            if (color != undefined && color != null) {
                let c = color[i];
                this.colors.push(c.r, c.g, c.b, c.a);
            }
        }
    }
    /**
     * Checks if the shader was modified, and if so, flushes the current vertices & starts a new draw
     */
    check() {
        if (this.nextShader != null || this.currentShader.dirty) {
            // flush existing
            if (this.currentShader != null)
                this.flush();
            // swap
            let swapped = (this.nextShader != null);
            if (swapped) {
                // disable prev. attributes
                if (this.currentShader != null)
                    for (let i = 0; i < this.currentShader.attributes.length; i++)
                        this.gl.disableVertexAttribArray(this.currentShader.attributes[i].attribute);
                // swap
                this.currentShader = this.nextShader;
                this.nextShader = null;
                this.gl.useProgram(this.currentShader.program);
                // enable attributes
                for (let i = 0; i < this.currentShader.attributes.length; i++)
                    this.gl.enableVertexAttribArray(this.currentShader.attributes[i].attribute);
            }
            // set shader uniforms
            let textureCounter = 0;
            for (let i = 0; i < this.currentShader.uniforms.length; i++) {
                let uniform = this.currentShader.uniforms[i];
                let location = uniform.uniform;
                if (swapped || uniform.dirty) {
                    if (uniform.type == ShaderUniformType.float) {
                        this.gl.uniform1f(location, uniform.value);
                    }
                    else if (uniform.type == ShaderUniformType.sampler2D) {
                        this.gl.activeTexture(this.gl["TEXTURE" + textureCounter]);
                        this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value.texture.webGLTexture);
                        this.gl.uniform1i(location, 0);
                        textureCounter += 1;
                    }
                    else if (uniform.type == ShaderUniformType.matrix3d) {
                        if (uniform.value instanceof Matrix)
                            this.gl.uniformMatrix3fv(location, false, uniform.value.mat);
                        else
                            this.gl.uniformMatrix2fv(location, false, uniform.value);
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
            for (let i = 0; i < this.currentShader.attributes.length; i++) {
                let attr = this.currentShader.attributes[i];
                if (attr.type == ShaderAttributeType.Position) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
                    this.gl.vertexAttribPointer(attr.attribute, 2, this.gl.FLOAT, false, 0, 0);
                }
                else if (attr.type == ShaderAttributeType.Uv) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.uvs), this.gl.STATIC_DRAW);
                    this.gl.vertexAttribPointer(attr.attribute, 2, this.gl.FLOAT, false, 0, 0);
                }
                else if (attr.type == ShaderAttributeType.Color) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
                    this.gl.vertexAttribPointer(attr.attribute, 4, this.gl.FLOAT, false, 0, 0);
                }
            }
            // draw vertices
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 2);
            this.drawCalls++;
            // clear	
            this.vertices = [];
            this.uvs = [];
            this.colors = [];
        }
    }
    /**
     * Sets the current texture on the shader (if the shader has a sampler2d uniform)
     */
    setShaderTexture(tex) {
        if (Engine.assert(this.shader.sampler2d != null, "This shader has no Sampler2D to set the texture to"))
            this.shader.sampler2d.value = tex;
    }
    /**
     * Draws a texture at the given position. If the current Shader does not take a texture, this will throw an error.
     */
    texture(tex, posX, posY, crop, color, origin, scale, rotation, flipX, flipY) {
        this.setShaderTexture(tex);
        // get the texture (or subtexture if crop is passed)
        let t = null;
        if (crop == undefined || crop == null)
            t = tex;
        else
            t = tex.getSubtexture(crop, this.texToDraw);
        // size
        let left = -t.frame.x;
        let top = -t.frame.y;
        let width = t.bounds.width;
        let height = t.bounds.height;
        // relative positions
        this.topleft.set(left, top);
        this.topright.set(left + width, top);
        this.botleft.set(left, top + height);
        this.botright.set(left + width, top + height);
        // offset by origin
        if (origin && (origin.x != 0 || origin.y != 0)) {
            this.topleft.sub(origin);
            this.topright.sub(origin);
            this.botleft.sub(origin);
            this.botright.sub(origin);
        }
        // scale
        if (scale && (scale.x != 1 || scale.y != 1)) {
            this.topleft.mult(scale);
            this.topright.mult(scale);
            this.botleft.mult(scale);
            this.botright.mult(scale);
        }
        // rotate
        if (rotation && rotation != 0) {
            let s = Math.sin(rotation);
            let c = Math.cos(rotation);
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
            let a = uvMinX;
            uvMinX = uvMaxX;
            uvMaxX = a;
        }
        // flip UVs on Y
        if (flipY) {
            let a = uvMinY;
            uvMinY = uvMaxY;
            uvMaxY = a;
        }
        // color
        let col = (color || Color.white);
        // push vertices
        this.push(posX + this.topleft.x, posY + this.topleft.y, uvMinX, uvMinY, col);
        this.push(posX + this.topright.x, posY + this.topright.y, uvMaxX, uvMinY, col);
        this.push(posX + this.botright.x, posY + this.botright.y, uvMaxX, uvMaxY, col);
        this.push(posX + this.topleft.x, posY + this.topleft.y, uvMinX, uvMinY, col);
        this.push(posX + this.botright.x, posY + this.botright.y, uvMaxX, uvMaxY, col);
        this.push(posX + this.botleft.x, posY + this.botleft.y, uvMinX, uvMaxY, col);
    }
    quad(posX, posY, width, height, color, origin, scale, rotation) {
        let left = 0;
        let top = 0;
        // relative positions
        this.topleft.set(left, top);
        this.topright.set(left + width, top);
        this.botleft.set(left, top + height);
        this.botright.set(left + width, top + height);
        // offset by origin
        if (origin && (origin.x != 0 || origin.y != 0)) {
            this.topleft.sub(origin);
            this.topright.sub(origin);
            this.botleft.sub(origin);
            this.botright.sub(origin);
        }
        // scale
        if (scale && (scale.x != 1 || scale.y != 1)) {
            this.topleft.mult(scale);
            this.topright.mult(scale);
            this.botleft.mult(scale);
            this.botright.mult(scale);
        }
        // rotate
        if (rotation && rotation != 0) {
            let s = Math.sin(rotation);
            let c = Math.cos(rotation);
            this.topleft.rotate(s, c);
            this.topright.rotate(s, c);
            this.botleft.rotate(s, c);
            this.botright.rotate(s, c);
        }
        // color
        let col = (color || Color.white);
        // push vertices
        this.push(posX + this.topleft.x, posY + this.topleft.y, 0, 0, color);
        this.push(posX + this.topright.x, posY + this.topright.y, 0, 0, color);
        this.push(posX + this.botright.x, posY + this.botright.y, 0, 0, color);
        this.push(posX + this.topleft.x, posY + this.topleft.y, 0, 0, color);
        this.push(posX + this.botright.x, posY + this.botright.y, 0, 0, color);
        this.push(posX + this.botleft.x, posY + this.botleft.y, 0, 0, color);
    }
    /**
     * Sets the current Pixel texture for drawing
     */
    set pixel(p) {
        let minX = p.bounds.left / p.texture.width;
        let minY = p.bounds.top / p.texture.height;
        let maxX = p.bounds.right / p.texture.width;
        let maxY = p.bounds.bottom / p.texture.height;
        this._pixel = p;
        this._pixelUVs =
            [
                new Vector(minX, minY),
                new Vector(maxX, minY),
                new Vector(maxX, maxY),
                new Vector(minX, maxY)
            ];
    }
    get pixel() { return this._pixel; }
    /**
     * Draws a rectangle with the Graphics.Pixel texture
     */
    pixelRect(bounds, color) {
        Engine.assert(this._pixel != null, "pixelRect requires the Graphics.pixel Subtexture be set");
        this.setShaderTexture(this._pixel);
        let uv = this._pixelUVs;
        this.push(bounds.left, bounds.top, uv[0].x, uv[0].y, color);
        this.push(bounds.right, bounds.top, uv[1].x, uv[1].y, color);
        this.push(bounds.right, bounds.bottom, uv[2].x, uv[2].y, color);
        this.push(bounds.left, bounds.top, uv[0].x, uv[0].y, color);
        this.push(bounds.left, bounds.bottom, uv[3].x, uv[3].y, color);
        this.push(bounds.right, bounds.bottom, uv[2].x, uv[2].y, color);
    }
    /**
     * Draws a triangle with the Graphics.Pixel texture
     */
    pixelTriangle(a, b, c, colA, colB, colC) {
        Engine.assert(this._pixel != null, "pixelTriangle requires the Graphics.pixel Subtexture be set");
        this.setShaderTexture(this._pixel);
        if (colB == undefined)
            colB = colA;
        if (colC == undefined)
            colC = colA;
        let uv = this._pixelUVs;
        this.push(a.x, a.y, uv[0].x, uv[0].y, colA);
        this.push(b.x, b.y, uv[1].x, uv[1].y, colB);
        this.push(c.x, c.y, uv[2].x, uv[2].y, colC);
    }
    /**
     * Draws a circle with the Graphics.Pixel texture
     */
    pixelCircle(pos, rad, steps, colorA, colorB) {
        Engine.assert(this._pixel != null, "pixelCircle requires the Graphics.pixel Subtexture be set");
        this.setShaderTexture(this._pixel);
        if (colorB == undefined)
            colorB = colorA;
        let uv = this._pixelUVs;
        let last = new Vector(pos.x + rad, pos.y);
        for (let i = 1; i <= steps; i++) {
            let angle = (i / steps) * Math.PI * 2;
            let next = new Vector(pos.x + Math.cos(angle), pos.y + Math.sin(angle));
            this.push(pos.x, pos.y, uv[0].x, uv[0].y, colorA);
            this.push(last.x, last.y, uv[1].x, uv[1].y, colorB);
            this.push(next.x, next.y, uv[2].x, uv[2].y, colorB);
            last = next;
        }
    }
    /**
     * Draws a triangle. Best used with Shaders.Primitive
     */
    triangle(a, b, c, colA, colB, colC) {
        if (colB == undefined)
            colB = colA;
        if (colC == undefined)
            colC = colA;
        this.push(a.x, a.y, 0, 0, colA);
        this.push(b.x, b.y, 0, 0, colB);
        this.push(c.x, c.y, 0, 0, colC);
    }
    /**
     * Draws a rectangle. Best used with Shaders.Primitive
     */
    rect(r, color) {
        this.triangle(new Vector(r.left, r.top), new Vector(r.right, r.top), new Vector(r.right, r.bottom), color);
        this.triangle(new Vector(r.left, r.top), new Vector(r.right, r.bottom), new Vector(r.left, r.bottom), color);
    }
    hollowRect(r, stroke, color) {
        this.rect(new Rectangle(r.left, r.top, r.width, stroke), color);
        this.rect(new Rectangle(r.left, r.top + stroke, stroke, r.height - stroke * 2), color);
        this.rect(new Rectangle(r.right - stroke, r.top + stroke, stroke, r.height - stroke * 2), color);
        this.rect(new Rectangle(r.left, r.bottom - stroke, r.width, stroke), color);
    }
    /**
     * Draws a circle. Best used with Shaders.Primitive
     */
    circle(pos, rad, steps, colorA, colorB) {
        if (colorB == undefined)
            colorB = colorA;
        let uv = this._pixelUVs;
        let last = new Vector(pos.x + rad, pos.y);
        for (let i = 1; i <= steps; i++) {
            let angle = (i / steps) * Math.PI * 2;
            let next = new Vector(pos.x + Math.cos(angle), pos.y + Math.sin(angle));
            this.push(pos.x, pos.y, 0, 0, colorA);
            this.push(last.x, last.y, 0, 0, colorB);
            this.push(next.x, next.y, 0, 0, colorB);
            last = next;
        }
    }
}
class Renderer {
    constructor() {
        this.visible = true;
        this.scene = null;
        this.groupsMask = [];
    }
    update() { }
    preRender() { }
    render() {
        let currentCamera = (this.camera || this.scene.camera);
        // set to our shader, and set main Matrix to the camera with fallback to Scene camera
        Engine.graphics.shader = this.shader;
        Engine.graphics.shader.set(this.shaderMatrixUniformName, currentCamera.matrix);
        // draw each entity
        let list = (this.groupsMask.length > 0 ? this.scene.allEntitiesInGroups(this.groupsMask) : this.scene.entities);
        for (let i = list.length - 1; i >= 0; i--)
            if (list[i].visible)
                list[i].render(currentCamera);
    }
    postRender() { }
}
class Scene {
    constructor() {
        this.camera = new Camera();
        this.entities = [];
        this.renderers = [];
        this.sorting = [];
        this.colliders = {};
        this.groups = {};
        this.cache = {};
        this.camera = new Camera();
        this.addRenderer(new SpriteRenderer());
    }
    begin() {
    }
    ended() {
    }
    update() {
        // update entities
        let lengthWas = this.entities.length;
        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            if (entity.active)
                entity.update();
            // in case stuff was removed
            if (lengthWas > this.entities.length) {
                i -= (lengthWas - this.entities.length);
                lengthWas = this.entities.length;
            }
        }
        // update renderers
        for (let i = 0; i < this.renderers.length; i++)
            if (this.renderers[i].visible)
                this.renderers[i].update();
    }
    render() {
        // sort entities
        for (let i = 0; i < this.sorting.length; i++) {
            let entity = this.sorting[i];
            entity._depth = entity._nextDepth;
            entity._nextDepth = null;
            this._insertEntityInto(entity, this.entities, true);
            for (let j = 0; j < entity.groups.length; j++)
                this._insertEntityInto(entity, this.groups[entity.groups[j]], true);
        }
        this.sorting = [];
        // pre-render
        for (let i = 0; i < this.renderers.length; i++)
            if (this.renderers[i].visible)
                this.renderers[i].preRender();
        // render
        for (let i = 0; i < this.renderers.length; i++)
            if (this.renderers[i].visible)
                this.renderers[i].render();
        // post-render
        for (let i = 0; i < this.renderers.length; i++)
            if (this.renderers[i].visible)
                this.renderers[i].postRender();
        // debug render
        if (Engine.debugMode) {
            Engine.graphics.shader = Shaders.primitive;
            Engine.graphics.shader.set("matrix", this.camera.matrix);
            for (let i = 0; i < this.entities.length; i++)
                if (this.entities[i].active)
                    this.entities[i].debugRender(this.camera);
        }
    }
    add(entity, position) {
        entity.scene = this;
        this._insertEntityInto(entity, this.entities, false);
        if (position != undefined)
            entity.position = position;
        // first time for this entity
        if (!entity.instantiated) {
            entity.instantiated = true;
            entity.created();
        }
        // group existing groups in the entity
        for (let i = 0; i < entity.groups.length; i++)
            this._groupEntity(entity, entity.groups[i]);
        // add existing components in the entity
        for (let i = 0; i < entity.components.length; i++)
            this._trackComponent(entity.components[i]);
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
            var entity = this.cache[bucket][0];
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
        if (this.cache[bucket] == undefined)
            this.cache[bucket] = [];
        this.cache[bucket].push(entity);
        entity.recycled();
    }
    remove(entity) {
        let index = this.entities.indexOf(entity);
        if (index >= 0)
            this.removeAt(index);
    }
    removeAt(index) {
        let entity = this.entities[index];
        entity.removed();
        // untrack all components
        for (let i = 0; i < entity.components.length; i++)
            this._untrackComponent(entity.components[i]);
        // ungroup
        for (let i = 0; i < entity.groups.length; i++)
            this._ungroupEntity(entity, entity.groups[i]);
        // remove entity
        entity.scene = null;
        this.entities.splice(index, 1);
    }
    removeAll() {
        for (let i = this.entities.length - 1; i >= 0; i--)
            this.entities.splice(i, 1);
    }
    destroy(entity) {
        if (entity.scene != null)
            this.remove(entity);
        entity.destroy();
        entity.instantiated = false;
    }
    firstEntityInGroup(group) {
        if (this.groups[group] != undefined && this.groups[group].length > 0)
            return this.groups[group][0];
        return null;
    }
    firstEntityOfClass(classType) {
        for (let i = 0; i < this.entities.length; i++)
            if (this.entities[i] instanceof classType)
                return this.entities[i];
        return null;
    }
    allEntitiesInGroup(group) {
        if (this.groups[group] != undefined)
            return this.groups[group];
        return [];
    }
    allEntitiesInGroups(groups) {
        let lists = [];
        for (let i = 0; i < groups.length; i++)
            lists.concat(this.allEntitiesInGroup(groups[i]));
        return lists;
    }
    allEntitiesOfClass(classType) {
        let list = [];
        for (let i = 0; i < this.entities.length; i++)
            if (this.entities[i] instanceof classType)
                list.push(this.entities[i]);
        return list;
    }
    firstColliderInTag(tag) {
        if (this.colliders[tag] != undefined && this.colliders[tag].length > 0)
            return this.colliders[tag];
        return null;
    }
    allCollidersInTag(tag) {
        if (this.colliders[tag] != undefined)
            return this.colliders[tag];
        return [];
    }
    addRenderer(renderer) {
        renderer.scene = this;
        this.renderers.push(renderer);
        return renderer;
    }
    removeRenderer(renderer) {
        let index = this.renderers.indexOf(renderer);
        if (index >= 0)
            this.renderers.splice(index, 1);
        renderer.scene = null;
        return renderer;
    }
    _insertEntityInto(entity, list, removeFrom) {
        if (removeFrom) {
            let index = list.indexOf(entity);
            if (index >= 0)
                list.splice(index, 1);
        }
        if (list.length == 0)
            list.push(entity);
        else {
            let i = 0;
            for (i = 0; i < list.length && list[i]._depth < entity._depth; i++)
                continue;
            list.splice(i, 0, entity);
        }
    }
    _groupEntity(entity, group) {
        if (this.groups[group] == undefined)
            this.groups[group] = [];
        this._insertEntityInto(entity, this.groups[group], false);
    }
    _ungroupEntity(entity, group) {
        if (this.groups[group] != undefined) {
            let index = this.groups[group].indexOf(entity);
            if (index >= 0) {
                this.groups[group].splice(index, 1);
                if (this.groups[group].length <= 0)
                    delete this.groups[group];
            }
        }
    }
    _trackComponent(component) {
        if (component.entity == null || component.entity.scene != this)
            throw "Component must be added through an existing entity";
        if (component instanceof Collider) {
            for (let i = 0; i < component.tags.length; i++)
                this._trackCollider(component, component.tags[i]);
        }
        component.scene = this;
        component.addedToScene();
    }
    _untrackComponent(component) {
        component.removedFromScene();
        if (component instanceof Collider) {
            for (let i = 0; i < component.tags.length; i++)
                this._untrackCollider(component, component.tags[i]);
        }
        component.scene = null;
    }
    _trackCollider(collider, tag) {
        if (this.colliders[tag] == undefined)
            this.colliders[tag] = [];
        this.colliders[tag].push(collider);
    }
    _untrackCollider(collider, tag) {
        if (this.colliders[tag] != undefined) {
            let index = this.colliders[tag].indexOf(collider);
            if (index >= 0) {
                this.colliders[tag].splice(index, 1);
                if (this.colliders[tag].length <= 0)
                    delete this.colliders[tag];
            }
        }
    }
}
class AnimationBank {
    static create(name) {
        var animSet = new AnimationSet(name);
        AnimationBank.bank[name] = animSet;
        return animSet;
    }
    static get(name) {
        return AnimationBank.bank[name];
    }
    static has(name) {
        return AnimationBank.bank[name] != undefined;
    }
}
AnimationBank.bank = {};
class AnimationSet {
    constructor(name) {
        this.animations = {};
        this.name = name;
    }
    add(name, speed, frames, loops, position, origin) {
        let anim = new AnimationTemplate(name, speed, frames, loops, position, origin);
        this.animations[name] = anim;
        if (this.first == null)
            this.first = anim;
        return this;
    }
    addFrameAnimation(name, speed, tex, frameWidth, frameHeight, frames, loops, position, origin) {
        let columns = Math.floor(tex.width / frameWidth);
        let texFrames = [];
        for (let i = 0; i < frames.length; i++) {
            let index = frames[i];
            let tx = (index % columns) * frameWidth;
            let ty = Math.floor(index / columns) * frameWidth;
            texFrames.push(tex.getSubtexture(new Rectangle(tx, ty, frameWidth, frameHeight)));
        }
        let anim = new AnimationTemplate(name, speed, texFrames, loops, position, origin);
        this.animations[name] = anim;
        if (this.first == null)
            this.first = anim;
        return this;
    }
    get(name) {
        return this.animations[name];
    }
    has(name) {
        return this.animations[name] != undefined;
    }
}
class AnimationTemplate {
    constructor(name, speed, frames, loops, position, origin) {
        this.loops = false;
        this.goto = null;
        this.name = name;
        this.speed = speed;
        this.frames = frames;
        this.loops = loops || false;
        this.position = (position || new Vector(0, 0));
        this.origin = (origin || new Vector(0, 0));
    }
}
class Assets {
}
Assets.textures = {};
Assets.json = {};
Assets.sounds = {};
Assets.atlases = {};
class AssetLoader {
    constructor() {
        this.loading = false;
        this.loaded = false;
        this.assets = 0;
        this.assetsLoaded = 0;
        this.textures = [];
        this.jsons = [];
        this.sounds = [];
        this.atlases = [];
    }
    get percent() { return this.assetsLoaded / this.assets; }
    addTexture(path) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.textures.push(path);
        this.assets++;
        return this;
    }
    addJson(path) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.jsons.push(path);
        this.assets++;
        return this;
    }
    addAudio(path) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        return this;
    }
    addAtlas(name, image, data, type) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.atlases.push({ name: name, image: image, data: data, type: type });
        this.assets += 3;
        return this;
    }
    load(callback) {
        var self = this;
        this.loading = true;
        this.callback = callback;
        // setup for loading
        if (Engine.client == Client.Desktop) {
            this.fs = require("fs");
            this.ps = require("path");
        }
        // textures
        for (let i = 0; i < this.textures.length; i++)
            this.loadTexture(this.textures[i]);
        // jsons
        for (let i = 0; i < this.jsons.length; i++)
            this.loadJson(this.jsons[i]);
        // atlases
        for (let i = 0; i < this.atlases.length; i++)
            this.loadAtlas(this.atlases[i]);
    }
    loadTexture(path, callback) {
        var self = this;
        let gl = Engine.graphics.gl;
        let fglt = new FosterWebGLTexture();
        let img = new Image();
        fglt.path = path;
        img.addEventListener('load', function () {
            fglt.width = img.width;
            fglt.height = img.height;
            fglt.webGLTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, fglt.webGLTexture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, null);
            Assets.textures[fglt.path] = new Texture(fglt);
            if (callback != undefined)
                callback(Assets.textures[fglt.path]);
            self.incrementLoader();
        });
        img.src = fglt.path;
    }
    loadJson(path, callback) {
        var self = this;
        if (Engine.client == Client.Desktop) {
            this.fs.readFile(this.ps.join(__dirname, path), 'utf8', function (err, data) {
                if (err)
                    throw err;
                Assets.json[path] = JSON.parse(data);
                if (callback != undefined)
                    callback(Assets.json[path]);
                self.incrementLoader();
            });
        }
    }
    loadAtlas(data) {
        var self = this;
        var texture = null;
        var json = null;
        function check() {
            if (texture == null || json == null)
                return;
            let atlas = new Atlas(data.name, texture, json, data.type);
            Assets.atlases[atlas.name] = atlas;
            self.incrementLoader();
        }
        this.loadTexture(data.image, (tex) => { texture = tex; check(); });
        this.loadJson(data.data, (j) => { json = j; check(); });
    }
    incrementLoader() {
        this.assetsLoaded++;
        if (this.assetsLoaded == this.assets) {
            this.loaded = true;
            this.loading = false;
            if (this.callback != undefined)
                this.callback();
        }
    }
}
var AtlasType;
(function (AtlasType) {
    AtlasType[AtlasType["ASEPRITE"] = 0] = "ASEPRITE";
})(AtlasType || (AtlasType = {}));
class Atlas {
    constructor(name, texture, json, type) {
        this.subtextures = {};
        this.name = name;
        this.texture = texture;
        this.json = json;
        this.type = type;
        if (type == AtlasType.ASEPRITE)
            this.loadAsepriteAtlas();
    }
    get(name) {
        return this.subtextures[name];
    }
    list(prefix, names) {
        let listed = [];
        for (let i = 0; i < names.length; i++)
            listed.push(this.get(prefix + names[i]));
        return listed;
    }
    loadAsepriteAtlas() {
        let frames = this.json["frames"];
        for (var path in frames) {
            var name = path.replace(".ase", "");
            var obj = frames[path];
            var bounds = obj.frame;
            if (obj.trimmed) {
                var source = obj["spriteSourceSize"];
                var size = obj["sourceSize"];
                this.subtextures[name] = new Texture(this.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h), new Rectangle(-source.x, -source.y, size.w, size.h));
            }
            else {
                this.subtextures[name] = new Texture(this.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h));
            }
        }
    }
}
class FosterWebGLTexture {
}
class Texture {
    constructor(texture, bounds, frame) {
        this.bounds = null;
        this.frame = null;
        this.texture = null;
        this.texture = texture;
        this.bounds = bounds || new Rectangle(0, 0, texture.width, texture.height);
        this.frame = frame || new Rectangle(0, 0, this.bounds.width, this.bounds.height);
    }
    get width() { return this.frame.width; }
    get height() { return this.frame.height; }
    get clippedWidth() { return this.bounds.width; }
    get clippedHeight() { return this.bounds.height; }
    getSubtexture(clip, sub) {
        if (sub == undefined)
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
        return sub;
    }
    clone() {
        return new Texture(this.texture, this.bounds.clone(), this.frame.clone());
    }
    toString() {
        return (this.texture.path +
            ": [" + this.bounds.x + ", " + this.bounds.y + ", " + this.bounds.width + ", " + this.bounds.height + "]" +
            "frame[" + this.frame.x + ", " + this.frame.y + ", " + this.frame.width + ", " + this.frame.height + "]");
    }
}
/// <reference path="./../../component.ts"/>
class Collider extends Component {
    constructor(...args) {
        super(...args);
        this.tags = [];
    }
    tag(tag) {
        this.tags.push(tag);
        if (this.entity != null && this.entity.scene != null)
            this.entity.scene._trackCollider(this, tag);
    }
    untag(tag) {
        let index = this.tags.indexOf(tag);
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
        for (let i = 0; i < tags.length; i++)
            if (this.collide(tags[i], x, y) != null)
                return true;
        return false;
    }
    collide(tag, x, y) {
        var result = null;
        var against = this.entity.scene.allCollidersInTag(tag);
        this.x += x || 0;
        this.y += y || 0;
        for (let i = 0; i < against.length; i++)
            if (Collider.overlap(this, against[i])) {
                result = against[i];
                break;
            }
        this.x -= x || 0;
        this.y -= y || 0;
        return result;
    }
    collideAll(tag, x, y) {
        var list = [];
        var against = this.entity.scene.allCollidersInTag(tag);
        this.x += x || 0;
        this.y += y || 0;
        for (let i = 0; i < against.length; i++)
            if (Collider.overlap(this, against[i]))
                list.push(against[i]);
        this.x -= x || 0;
        this.y -= y || 0;
        return list;
    }
    static overlap(a, b) {
        if (a instanceof Hitbox && b instanceof Hitbox) {
            return Collider.overlap_hitbox_hitbox(a, b);
        }
        else if (a instanceof Hitbox && b instanceof Hitgrid) {
            return Collider.overlap_hitbox_grid(a, b);
        }
        else if (a instanceof Hitgrid && b instanceof Hitbox) {
            return Collider.overlap_hitbox_grid(b, a);
        }
        return false;
    }
    static overlap_hitbox_hitbox(a, b) {
        return a.sceneRight >= b.sceneLeft && a.sceneBottom >= b.sceneTop && a.sceneLeft < b.sceneRight && a.sceneTop < b.sceneBottom;
    }
    static overlap_hitbox_grid(a, b) {
        let gridPosition = b.scenePosition;
        let left = Math.floor((a.sceneLeft - gridPosition.x) / b.tileWidth);
        let top = Math.floor((a.sceneTop - gridPosition.y) / b.tileHeight);
        let right = Math.ceil((a.sceneRight - gridPosition.x) / b.tileWidth);
        let bottom = Math.ceil((a.sceneBottom - gridPosition.y) / b.tileHeight);
        for (let x = left; x < right; x++)
            for (let y = top; y < bottom; y++)
                if (b.has(x, y))
                    return true;
        return false;
    }
}
/// <reference path="./collider.ts"/>
class Hitbox extends Collider {
    constructor(left, top, width, height, tags) {
        super();
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        if (tags != undefined)
            for (let i = 0; i < tags.length; i++)
                this.tag(tags[i]);
    }
    get sceneLeft() { return this.scenePosition.x + this.left; }
    get sceneRight() { return this.scenePosition.x + this.left + this.width; }
    get sceneTop() { return this.scenePosition.y + this.top; }
    get sceneBottom() { return this.scenePosition.y + this.top + this.height; }
    get sceneBounds() { return new Rectangle(this.sceneLeft, this.sceneTop, this.width, this.height); }
    debugRender() {
        Engine.graphics.hollowRect(this.sceneBounds, 1, Color.red);
    }
}
/// <reference path="./colliders/hitbox.ts"/>
class Physics extends Hitbox {
    constructor(left, top, width, height, tags, solids) {
        super(left, top, width, height, tags);
        this.solids = [];
        this.speed = new Vector(0, 0);
        this.remainder = new Vector(0, 0);
        if (solids != undefined)
            this.solids = solids;
    }
    update() {
        if (this.speed.x != 0)
            this.moveX(this.speed.x * Engine.delta);
        if (this.speed.y != 0)
            this.moveY(this.speed.y * Engine.delta);
    }
    move(x, y) {
        var movedX = this.moveX(x);
        var movedY = this.moveY(y);
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
            let sign = Math.sign(amount);
            amount = Math.abs(Math.round(amount));
            while (amount > 0) {
                if (this.checks(this.solids, sign, 0)) {
                    this.remainder.x = 0;
                    if (this.onCollideX != null)
                        this.onCollideX();
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
            let sign = Math.sign(amount);
            amount = Math.abs(Math.round(amount));
            while (amount > 0) {
                if (this.checks(this.solids, 0, sign)) {
                    this.remainder.y = 0;
                    if (this.onCollideY != null)
                        this.onCollideY();
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
            this.speed.x = Math.min(0, this.speed.x + fx * Engine.delta);
        else if (this.speed.x > 0)
            this.speed.x = Math.max(0, this.speed.x - fx * Engine.delta);
        if (this.speed.y < 0)
            this.speed.y = Math.min(0, this.speed.y + fy * Engine.delta);
        else if (this.speed.y > 0)
            this.speed.y = Math.max(0, this.speed.y - fy * Engine.delta);
        return this;
    }
    maxspeed(mx, my) {
        if (mx != undefined && mx != null)
            this.speed.x = Math.max(-mx, Math.min(mx, this.speed.x));
        if (my != undefined && my != null)
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
class Keys {
    static init() {
        window.addEventListener("keydown", function (e) {
            Keys._next[e.keyCode] = true;
        });
        window.addEventListener("keyup", function (e) {
            Keys._next[e.keyCode] = false;
        });
    }
    static update() {
        for (let i = 0; i < 256; i++) {
            Keys._last[i] = Keys._down[i];
            Keys._down[i] = Keys._next[i];
        }
    }
    static down(key) {
        return (Keys._down[key] == true);
    }
    static pressed(key) {
        return (Keys._down[key] == true && !Keys._last[key]);
    }
    static released(key) {
        return (!Keys._down[key] && Keys._last[key] == true);
    }
    static map(name, keys) {
        if (!Keys._map[name])
            Keys._map[name] = [];
        for (let i = 0; i < keys.length; i++)
            Keys._map[name].push(keys[i]);
    }
    static mapDown(key) {
        if (Keys._map[key] != undefined)
            for (let i = 0; i < Keys._map[key].length; i++)
                if (Keys.down(Keys._map[key][i]))
                    return true;
        return false;
    }
    static mapPressed(key) {
        if (Keys._map[key] != undefined)
            for (let i = 0; i < Keys._map[key].length; i++)
                if (Keys.pressed(Keys._map[key][i]))
                    return true;
        return false;
    }
    static mapReleased(key) {
        if (Keys._map[key] != undefined)
            for (let i = 0; i < Keys._map[key].length; i++)
                if (Keys.released(Keys._map[key][i]))
                    return true;
        return false;
    }
}
Keys._down = [];
Keys._last = [];
Keys._next = [];
Keys._map = {};
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
})(Key || (Key = {}));
class Vector {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        if (x != undefined)
            this.x = x;
        if (y != undefined)
            this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
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
    scale(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    rotate(sin, cos) {
        let ox = this.x, oy = this.y;
        this.x = ox * cos - oy * sin;
        this.y = ox * sin + oy * cos;
        return this;
    }
    transform(m) {
        let ax = this.x, ay = this.y;
        this.x = m.mat[0] * ax + m.mat[3] * ay + m.mat[6];
        this.y = m.mat[1] * ax + m.mat[4] * ay + m.mat[7];
        return this;
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    get length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    get normal() {
        let dist = this.length;
        return new Vector(this.x / dist, this.y / dist);
    }
    normalize() {
        let dist = this.length;
        this.x /= dist;
        this.y /= dist;
        return this;
    }
    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }
    static sub(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    }
    static mult(a, b) {
        return new Vector(a.x * b.x, a.y * b.y);
    }
    static transform(a, m) {
        let result = new Vector();
        result.x = m.mat[0] * a.x + m.mat[3] * a.y + m.mat[6];
        result.y = m.mat[1] * a.x + m.mat[4] * a.y + m.mat[7];
        return result;
    }
}
/// <reference path="./../util/vector.ts"/>
class Mouse {
    static get x() { return this._position.x; }
    static get y() { return this._position.y; }
    static get position() { return new Vector(this._position.x, this._position.y); }
    static get left() { return this._left; }
    static get leftPressed() { return this._left && !this._leftWas; }
    static get leftReleased() { return !this._left && this._leftWas; }
    static get right() { return this._right; }
    static get rightPressed() { return this._right && !this._rightWas; }
    static get rightReleased() { return !this._right && this._rightWas; }
    static init() {
        Engine.root.addEventListener("mousemove", function (e) {
            Mouse.absolute = new Vector(e.pageX, e.pageY);
            Mouse.setNextMouseTo(e.pageX, e.pageY);
        });
        Engine.root.addEventListener("mousedown", function (e) {
            if (e.button == 0)
                Mouse._leftNext = true;
            else
                Mouse._rightNext = true;
        });
        Engine.root.addEventListener("mouseup", function (e) {
            if (e.button == 0)
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
        // TODO: SOLVE THIS?
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
        let screen = Engine.graphics.screenCanvas.getBoundingClientRect();
        let scaled = Engine.graphics.getOutputBounds();
        let scale = new Vector(scaled.width / Engine.width, scaled.height / Engine.height);
        // mouse position in the gameplay view
        var was = Mouse._positionNext;
        Mouse._positionNext = new Vector((pageX - screen.left - scaled.left) / scale.x, (pageY - screen.top - scaled.top) / scale.y);
    }
}
Mouse._position = new Vector(0, 0);
Mouse._positionNext = new Vector(0, 0);
Mouse.absolute = new Vector(0, 0);
class PrimitiveRenderer extends Renderer {
    constructor() {
        super();
        this.shader = Shaders.primitive;
        this.shaderMatrixUniformName = "matrix";
    }
}
class SpriteRenderer extends Renderer {
    constructor() {
        super();
        this.shader = Shaders.texture;
        this.shaderMatrixUniformName = "matrix";
    }
}
/// <reference path="./vector.ts"/>
class Camera {
    constructor() {
        this.position = new Vector(0, 0);
        this.origin = new Vector(0, 0);
        this.scale = new Vector(1, 1);
        this.rotation = 0;
        this._matrix = new Matrix();
        this._internal = new Matrix();
        this._mouse = new Vector();
        this.extentsA = new Vector();
        this.extentsB = new Vector();
        this.extentsC = new Vector();
        this.extentsD = new Vector();
        this.extentsRect = new Rectangle();
    }
    get internal() {
        return this._internal.identity()
            .translate(this.origin.x, this.origin.y)
            .rotate(this.rotation)
            .scale(this.scale.x, this.scale.y)
            .translate(-this.position.x, -this.position.y);
    }
    get matrix() {
        return this._matrix
            .copy(Engine.graphics.orthographic)
            .multiply(this.internal);
    }
    get mouse() {
        return this._mouse.set(Mouse.x + this.position.x - this.origin.x, Mouse.y + this.position.y - this.origin.y).transform(this.internal.invert());
    }
    getExtents() {
        let inverse = this.internal.invert();
        this.extentsA.set(0, 0).transform(inverse);
        this.extentsB.set(Engine.width, 0).transform(inverse);
        this.extentsC.set(0, Engine.height).transform(inverse);
        this.extentsD.set(Engine.width, Engine.height).transform(inverse);
    }
    get extents() {
        this.getExtents();
        let r = this.extentsRect;
        r.x = Math.min(this.extentsA.x, this.extentsB.x, this.extentsC.x, this.extentsD.x);
        r.y = Math.min(this.extentsA.y, this.extentsB.y, this.extentsC.y, this.extentsD.y);
        r.width = Math.max(this.extentsA.x, this.extentsB.x, this.extentsC.x, this.extentsD.x) - r.x;
        r.height = Math.max(this.extentsA.y, this.extentsB.y, this.extentsC.y, this.extentsD.y) - r.y;
        return r;
    }
}
class Color {
    constructor(r, g, b, a) {
        this.color = [0, 0, 0, 1];
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 1;
    }
    get r() { return this.color[0]; }
    set r(v) { this.color[0] = Math.min(1, Math.max(0, v)); }
    get g() { return this.color[1]; }
    set g(v) { this.color[1] = Math.min(1, Math.max(0, v)); }
    get b() { return this.color[2]; }
    set b(v) { this.color[2] = Math.min(1, Math.max(0, v)); }
    get a() { return this.color[3]; }
    set a(v) { this.color[3] = Math.min(1, Math.max(0, v)); }
    get rgba() { return this.color; }
    mult(alpha) {
        return new Color(this.r, this.g, this.b, this.a * alpha);
    }
    static lerpOn(out, a, b, p) {
        out.r = a.r + (b.r - a.r) * p;
        out.g = a.g + (b.g - a.g) * p;
        out.b = a.b + (b.b - a.b) * p;
        out.a = a.a + (b.a - a.a) * p;
        return out;
    }
    static lerp(a, b, p) {
        return Color.lerpOn(new Color(), a, b, p);
    }
}
Color.white = new Color(1, 1, 1, 1);
Color.black = new Color(0, 0, 0, 1);
Color.red = new Color(1, 0, 0, 1);
Color.green = new Color(0, 1, 0, 1);
Color.blue = new Color(0, 0, 1, 1);
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
        var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2], a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, det = a00 * b01 + a01 * b11 + a02 * b21;
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
        var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2], a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8], b00 = o.mat[0], b01 = o.mat[1], b02 = o.mat[2], b10 = o.mat[3], b11 = o.mat[4], b12 = o.mat[5], b20 = o.mat[6], b21 = o.mat[7], b22 = o.mat[8];
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
        var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2], a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], s = Math.sin(rad), c = Math.cos(rad);
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
        let a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2], a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8];
        this.mat[6] = x * a00 + y * a10 + a20;
        this.mat[7] = x * a01 + y * a11 + a21;
        this.mat[8] = x * a02 + y * a12 + a22;
        return this;
    }
    static fromRotation(rad, ref) {
        if (ref == undefined)
            ref = new Matrix();
        else
            ref.identity();
        var s = Math.sin(rad), c = Math.cos(rad);
        ref.mat[0] = c;
        ref.mat[1] = -s;
        ref.mat[3] = s;
        ref.mat[4] = c;
        return ref;
    }
    static fromScale(x, y, ref) {
        if (ref == undefined)
            ref = new Matrix();
        else
            ref.identity();
        ref.mat[0] = x;
        ref.mat[4] = y;
        return ref;
    }
    static fromTranslation(x, y, ref) {
        if (ref == undefined)
            ref = new Matrix();
        else
            ref.identity();
        ref.mat[6] = x;
        ref.mat[7] = y;
        return ref;
    }
}
class Rectangle {
    constructor(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 1;
        this.height = h || 1;
    }
    get left() { return this.x; }
    get right() { return this.x + this.width; }
    get top() { return this.y; }
    get bottom() { return this.y + this.height; }
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
    crop(x, y, w, h) {
        let out = new Rectangle(x, y, w, h);
        this.cropRect(out);
        return out;
    }
    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }
    copyTo(out) {
        out.x = this.x;
        out.y = this.y;
        out.width = this.width;
        out.height = this.height;
    }
}
class Shader {
    constructor(vertex, fragment, uniforms, attributes) {
        this.dirty = true;
        this.uniformsByName = {};
        let gl = Engine.graphics.gl;
        // vertex shader
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertex);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
            throw "An error occurred compiling the shaders: " + gl.getShaderInfoLog(vertexShader);
        // fragment shader
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragment);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
            throw "An error occurred compiling the shaders: " + gl.getShaderInfoLog(fragmentShader);
        // program
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
            throw "Unable to initialize the shader program.";
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        // attributes
        this.attributes = attributes;
        for (let i = 0; i < this.attributes.length; i++)
            this.attributes[i].attribute = gl.getAttribLocation(this.program, this.attributes[i].name);
        // uniforms
        this.uniforms = uniforms;
        for (let i = 0; i < this.uniforms.length; i++) {
            let uniform = this.uniforms[i];
            this.uniformsByName[uniform.name] = uniform;
            uniform.shader = this;
            uniform.uniform = gl.getUniformLocation(this.program, uniform.name);
            // first sampler2D gets set
            if (uniform.type == ShaderUniformType.sampler2D && this.sampler2d == null)
                this.sampler2d = uniform;
        }
    }
    set(name, value) {
        this.uniformsByName[name].value = value;
    }
}
var ShaderUniformType;
(function (ShaderUniformType) {
    // normal ones
    ShaderUniformType[ShaderUniformType["float"] = 0] = "float";
    ShaderUniformType[ShaderUniformType["floatArray"] = 1] = "floatArray";
    ShaderUniformType[ShaderUniformType["float2"] = 2] = "float2";
    ShaderUniformType[ShaderUniformType["float2Array"] = 3] = "float2Array";
    ShaderUniformType[ShaderUniformType["float3"] = 4] = "float3";
    ShaderUniformType[ShaderUniformType["float3Array"] = 5] = "float3Array";
    ShaderUniformType[ShaderUniformType["float4"] = 6] = "float4";
    ShaderUniformType[ShaderUniformType["float4Array"] = 7] = "float4Array";
    ShaderUniformType[ShaderUniformType["matrix2d"] = 8] = "matrix2d";
    ShaderUniformType[ShaderUniformType["matrix3d"] = 9] = "matrix3d";
    ShaderUniformType[ShaderUniformType["matrix4d"] = 10] = "matrix4d";
    ShaderUniformType[ShaderUniformType["int"] = 11] = "int";
    ShaderUniformType[ShaderUniformType["intArray"] = 12] = "intArray";
    ShaderUniformType[ShaderUniformType["int2"] = 13] = "int2";
    ShaderUniformType[ShaderUniformType["int2Array"] = 14] = "int2Array";
    ShaderUniformType[ShaderUniformType["int3"] = 15] = "int3";
    ShaderUniformType[ShaderUniformType["int3Array"] = 16] = "int3Array";
    ShaderUniformType[ShaderUniformType["int4"] = 17] = "int4";
    ShaderUniformType[ShaderUniformType["int4Array"] = 18] = "int4Array";
    // special cases
    ShaderUniformType[ShaderUniformType["sampler2D"] = 19] = "sampler2D";
    ShaderUniformType[ShaderUniformType["cameraMatrix3d"] = 20] = "cameraMatrix3d";
})(ShaderUniformType || (ShaderUniformType = {}));
class ShaderUniform {
    constructor(name, type, value) {
        this._value = null;
        this.name = name;
        this.type = type;
        this._value = value;
    }
    get value() { return this._value; }
    set value(a) {
        let willBeDirty = (this.value != a);
        // special case for textures
        if (this.type == ShaderUniformType.sampler2D && this._value != null && a != null)
            if (this._value.texture.webGLTexture == a.texture.webGLTexture)
                willBeDirty = false;
        if (willBeDirty) {
            this._value = a;
            this._shader.dirty = true;
            this.dirty = true;
        }
    }
    set shader(s) {
        if (this._shader != null)
            throw "This Uniform is already attached to a shader";
        this._shader = s;
    }
}
var ShaderAttributeType;
(function (ShaderAttributeType) {
    ShaderAttributeType[ShaderAttributeType["Position"] = 0] = "Position";
    ShaderAttributeType[ShaderAttributeType["Uv"] = 1] = "Uv";
    ShaderAttributeType[ShaderAttributeType["Color"] = 2] = "Color";
})(ShaderAttributeType || (ShaderAttributeType = {}));
class ShaderAttribute {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}
/// <reference path="./shader.ts" />
// Default 2D shaders
class Shaders {
    static init() {
        // Default Texture Shader
        Shaders.texture = new Shader(
        // vertex shader
        'attribute vec2 a_position;' +
            'attribute vec2 a_texcoord;' +
            'attribute vec4 a_color;' +
            'uniform mat3 matrix;' +
            'varying vec2 v_texcoord;' +
            'varying vec4 v_color;' +
            'void main()' +
            '{' +
            '	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);' +
            '	v_texcoord = a_texcoord;' +
            '	v_color = a_color;' +
            '}', 
        // fragment shader
        'precision mediump float;' +
            'varying vec2 v_texcoord;' +
            'varying vec4 v_color;' +
            'uniform sampler2D texture;' +
            'void main() ' +
            '{' +
            '	gl_FragColor = texture2D(texture, v_texcoord) * v_color;' +
            '}', [
            new ShaderUniform("matrix", ShaderUniformType.matrix3d),
            new ShaderUniform("texture", ShaderUniformType.sampler2D)
        ], [
            new ShaderAttribute('a_position', ShaderAttributeType.Position),
            new ShaderAttribute('a_texcoord', ShaderAttributeType.Uv),
            new ShaderAttribute('a_color', ShaderAttributeType.Color)
        ]);
        // solid color shader over texture
        Shaders.solid = new Shader(
        // vertex shader
        'attribute vec2 a_position;' +
            'attribute vec2 a_texcoord;' +
            'attribute vec4 a_color;' +
            'uniform mat3 matrix;' +
            'varying vec2 v_texcoord;' +
            'varying vec4 v_color;' +
            'void main()' +
            '{' +
            '	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);' +
            '	v_texcoord = a_texcoord;' +
            '	v_color = a_color;' +
            '}', 
        // fragment shader
        'precision mediump float;' +
            'varying vec2 v_texcoord;' +
            'varying vec4 v_color;' +
            'uniform sampler2D texture;' +
            'void main() ' +
            '{' +
            '	gl_FragColor = v_color * texture2D(texture, v_texcoord).a;' +
            '}', [
            new ShaderUniform("matrix", ShaderUniformType.matrix3d),
            new ShaderUniform("texture", ShaderUniformType.sampler2D)
        ], [
            new ShaderAttribute('a_position', ShaderAttributeType.Position),
            new ShaderAttribute('a_texcoord', ShaderAttributeType.Uv),
            new ShaderAttribute('a_color', ShaderAttributeType.Color)
        ]);
        // Primitive texture
        Shaders.primitive = new Shader(
        // vertex shader
        'attribute vec2 a_position;' +
            'attribute vec4 a_color;' +
            'uniform mat3 matrix;' +
            'varying vec4 v_color;' +
            'void main()' +
            '{' +
            '	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);' +
            '	v_color = a_color;' +
            '}', 
        // fragment shader
        'precision mediump float;' +
            'varying vec4 v_color;' +
            'void main() ' +
            '{' +
            '	gl_FragColor = v_color;' +
            '}', [
            new ShaderUniform("matrix", ShaderUniformType.matrix3d)
        ], [
            new ShaderAttribute('a_position', ShaderAttributeType.Position),
            new ShaderAttribute('a_color', ShaderAttributeType.Color)
        ]);
    }
}
/// <reference path="./collider.ts"/>
class Hitgrid extends Collider {
    constructor(tileWidth, tileHeight, tags) {
        super();
        this.map = {};
        this.debugRect = new Rectangle();
        this.debugSub = new Color(200, 200, 200, 0.5);
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        if (tags != undefined)
            for (let i = 0; i < tags.length; i++)
                this.tag(tags[i]);
    }
    set(solid, tx, ty, columns, rows) {
        for (let x = tx; x < tx + (columns || 1); x++) {
            if (this.map[x] == undefined)
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
            if (this.map[x] != undefined)
                for (let y = ty; y < ty + (rows || 1); y++)
                    if (this.map[x][y] == true)
                        return true;
        return false;
    }
    debugRender(camera) {
        // get bounds of rendering
        let bounds = camera.extents;
        let pos = this.scenePosition;
        let left = Math.floor((bounds.left - pos.x) / this.tileWidth) - 1;
        let right = Math.ceil((bounds.right - pos.x) / this.tileWidth) + 1;
        let top = Math.floor((bounds.top - pos.y) / this.tileHeight) - 1;
        let bottom = Math.ceil((bounds.bottom - pos.y) / this.tileHeight) + 1;
        for (let tx = left; tx < right; tx++) {
            if (this.map[tx] == undefined)
                continue;
            for (let ty = top; ty < bottom; ty++) {
                if (this.map[tx][ty] == true) {
                    let l = this.has(tx - 1, ty);
                    let r = this.has(tx + 1, ty);
                    let u = this.has(tx, ty - 1);
                    let d = this.has(tx, ty + 1);
                    let px = pos.x + tx * this.tileWidth;
                    let py = pos.y + ty * this.tileHeight;
                    Engine.graphics.rect(this.debugRect.set(px, py, 1, this.tileHeight), l ? Color.red : this.debugSub);
                    Engine.graphics.rect(this.debugRect.set(px, py, this.tileWidth, 1), u ? Color.red : this.debugSub);
                    Engine.graphics.rect(this.debugRect.set(px + this.tileWidth - 1, py, 1, this.tileHeight), r ? Color.red : this.debugSub);
                    Engine.graphics.rect(this.debugRect.set(px, py + this.tileHeight - 1, this.tileWidth, 1), d ? Color.red : this.debugSub);
                }
            }
        }
    }
}
/// <reference path="./../../component.ts"/>
class Graphic extends Component {
    constructor(texture, position) {
        super();
        this.scale = new Vector(1, 1);
        this.origin = new Vector(0, 0);
        this.rotation = 0;
        this.flipX = false;
        this.flipY = false;
        this.color = Color.white;
        this.alpha = 1;
        if (texture != null) {
            this.texture = texture;
            this.crop = new Rectangle(0, 0, texture.width, texture.height);
        }
        if (position)
            this.position = position;
    }
    get width() { return this.crop ? this.crop.width : (this.texture ? this.texture.width : 0); }
    get height() { return this.crop ? this.crop.height : (this.texture ? this.texture.height : 0); }
    render(camera) {
        Engine.graphics.texture(this.texture, this.scenePosition.x, this.scenePosition.y, this.crop, this.color.mult(this.alpha), this.origin, this.scale, this.rotation, this.flipX, this.flipY);
    }
}
/// <reference path="./../../component.ts"/>
class Rectsprite extends Component {
    constructor(width, height, color) {
        super();
        this.size = new Vector(0, 0);
        this.scale = new Vector(1, 1);
        this.origin = new Vector(0, 0);
        this.rotation = 0;
        this.color = Color.white;
        this.alpha = 1;
        this.size.x = width;
        this.size.y = height;
        this.color = color || Color.white;
    }
    get width() { return this.size.x; }
    set width(val) { this.size.x = val; }
    get height() { return this.size.y; }
    set height(val) { this.size.y = val; }
    render() {
        // draw with a pixel texture (shader is using textures)
        if (Engine.graphics.shader.sampler2d != null && Engine.graphics.pixel != null) {
            Engine.graphics.texture(Engine.graphics.pixel, this.scenePosition.x, this.scenePosition.y, null, this.color.mult(this.alpha), new Vector(this.origin.x / this.size.x, this.origin.y / this.size.y), Vector.mult(this.size, this.scale), this.rotation);
        }
        else {
            Engine.graphics.quad(this.scenePosition.x, this.scenePosition.y, this.size.x, this.size.y, this.color.mult(this.alpha), this.origin, this.scale, this.rotation);
        }
    }
}
/// <reference path="./graphic.ts"/>
class Sprite extends Graphic {
    constructor(animation) {
        super(null);
        this._animation = null;
        this._playing = null;
        this._frame = 0;
        this.rate = 1;
        Engine.assert(AnimationBank.has(animation), "Missing animation '" + animation + "'!");
        this._animation = AnimationBank.get(animation);
        this.texture = this._animation.first.frames[0];
    }
    get animation() { return this._animation; }
    get playing() { return this._playing; }
    get frame() { return Math.floor(this._frame); }
    play(name, restart) {
        if (this.animation == null)
            return;
        let next = this.animation.get(name);
        if (next != null && (this.playing != next || restart)) {
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
            this._frame += this.playing.speed * this.rate * Engine.delta;
            if (this.frame >= this.playing.frames.length) {
                // loop this animation
                if (this.playing.loops) {
                    while (this._frame >= this.playing.frames.length)
                        this._frame -= this.playing.frames.length;
                }
                else if (this.playing.goto != null && this.playing.goto.length > 0) {
                    let next = this.playing.goto[Math.floor(Math.random() * this.playing.goto.length)];
                    this.play(next, true);
                }
                else {
                    this.active = false;
                    this._frame = this.playing.frames.length - 1;
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
/// <reference path="./../../component.ts"/>
class Tilemap extends Component {
    constructor(texture, tileWidth, tileHeight) {
        super();
        this.map = {};
        this.crop = new Rectangle();
        this.texture = texture;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileColumns = this.texture.width / this.tileWidth;
    }
    set(tileX, tileY, mapX, mapY, mapWidth, mapHeight) {
        let tileIndex = tileX + tileY * this.tileColumns;
        for (let x = mapX; x < mapX + (mapWidth || 1); x++)
            for (let y = mapY; y < mapY + (mapHeight || 1); y++) {
                if (this.map[x] == undefined)
                    this.map[x] = {};
                this.map[x][y] = tileIndex;
            }
    }
    has(mapX, mapY) {
        return (this.map[mapX] != undefined && this.map[mapX][mapY] != undefined);
    }
    get(mapX, mapY) {
        if (this.has(mapX, mapY)) {
            var index = this.map[mapX][mapY];
            return new Vector(index % this.tileColumns, Math.floor(index / this.tileColumns));
        }
        return null;
    }
    clear(mapX, mapY, mapWidth, mapHeight) {
        for (let x = mapX; x < mapX + (mapWidth || 1); x++)
            for (let y = mapY; y < mapY + (mapHeight || 1); y++) {
                if (this.map[x] != undefined && this.map[x][y] != undefined)
                    delete this.map[x][y];
            }
    }
    render(camera) {
        // get bounds of rendering
        let bounds = camera.extents;
        let pos = this.scenePosition;
        let left = Math.floor((bounds.left - pos.x) / this.tileWidth) - 1;
        let right = Math.ceil((bounds.right - pos.x) / this.tileWidth) + 1;
        let top = Math.floor((bounds.top - pos.y) / this.tileHeight) - 1;
        let bottom = Math.ceil((bounds.bottom - pos.y) / this.tileHeight) + 1;
        // tile texture cropping
        this.crop.width = this.tileWidth;
        this.crop.height = this.tileHeight;
        for (let tx = left; tx < right; tx++)
            for (let ty = top; ty < bottom; ty++) {
                if (this.map[tx] == undefined)
                    continue;
                let index = this.map[tx][ty];
                if (index != undefined) {
                    this.crop.x = (index % this.tileColumns) * this.tileWidth;
                    this.crop.y = Math.floor(index / this.tileColumns) * this.tileHeight;
                    Engine.graphics.texture(this.texture, pos.x + tx * this.tileWidth, pos.y + ty * this.tileHeight, this.crop);
                }
            }
    }
}
