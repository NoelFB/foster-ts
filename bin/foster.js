/**
 * An animation template handles a single Animation in an Animation Set (ex. Player.Run)
 */
class AnimationTemplate {
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
        this.position = (position || new Vector(0, 0));
        this.origin = (origin || new Vector(0, 0));
    }
}
/// <reference path="./animationTemplate.ts"/>
/**
 * Animation Set holds a list of Animation Templates, referenced by name
 */
class AnimationSet {
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
        let anim = new AnimationTemplate(name, speed, frames, loops, position, origin);
        this.animations[name] = anim;
        if (this.first == null)
            this.first = anim;
        return this;
    }
    /**
     * Adds a new frame-based Animation Template to this set
     */
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
        return this.animations[name] != undefined;
    }
}
/// <reference path="./animationSet.ts"/>
/**
 * Animation Bank holds all the Animations in the game
 */
class AnimationBank {
    /**
     * Creates a new Animation Set of the given Name
     */
    static create(name) {
        var animSet = new AnimationSet(name);
        AnimationBank.bank[name] = animSet;
        return animSet;
    }
    /**
     * Gets an Animation of the given name
     */
    static get(name) {
        return AnimationBank.bank[name];
    }
    /**
     * Checks if an animation with the given name exists
     */
    static has(name) {
        return AnimationBank.bank[name] != undefined;
    }
}
/**
 * Reference to all the Animations
 */
AnimationBank.bank = {};
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
            throw "Cannot add more assets when already loaded";
        this.textures.push(path);
        this.assets++;
        return this;
    }
    /**
     * Adds the JSON to the loader
     */
    addJson(path) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.jsons.push(path);
        this.assets++;
        return this;
    }
    /**
     * Adds the XML to the loader
     */
    addXml(path) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.xmls.push(path);
        this.assets++;
        return this;
    }
    /**
     * Adds the text to the loader
     */
    addText(path) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.texts.push(path);
        this.assets++;
        return this;
    }
    /**
     * Adds the sound to the loader
     */
    addSound(handle, path) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.sounds.push({ handle: handle, path: path });
        this.assets++;
        return this;
    }
    /**
     * Adds the atlas to the loader
     */
    addAtlas(name, image, data, loader) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.atlases.push({ name: name, image: image, data: data, loader: loader });
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
        for (let i = 0; i < this.textures.length; i++)
            this.loadTexture(FosterIO.join(this.root, this.textures[i]));
        // json files
        for (let i = 0; i < this.jsons.length; i++)
            this.loadJson(FosterIO.join(this.root, this.jsons[i]));
        // xml files
        for (let i = 0; i < this.xmls.length; i++)
            this.loadXml(FosterIO.join(this.root, this.xmls[i]));
        // text files
        for (let i = 0; i < this.texts.length; i++)
            this.loadText(FosterIO.join(this.root, this.texts[i]));
        // sounds
        for (let i = 0; i < this.sounds.length; i++)
            this.loadSound(this.sounds[i].handle, FosterIO.join(this.root, this.sounds[i].path));
        // atlases
        for (let i = 0; i < this.atlases.length; i++)
            this.loadAtlas(this.atlases[i]);
    }
    /**
     * Unloads all the Assets that this Asset Loader loaded
     */
    unload() {
        if (this.loading)
            throw "Cannot unload until finished loading";
        if (!this.loaded)
            throw "Cannot unload before loading";
        // TODO: IMPLEMENT THIS
        throw "Asset Unloading not Implemented";
    }
    loadTexture(path, callback) {
        let gl = Engine.graphics.gl;
        let img = new Image();
        img.addEventListener('load', () => {
            let tex = Texture.create(img);
            tex.texture.path = path;
            Assets.textures[this.pathify(path)] = tex;
            if (callback != undefined)
                callback(tex);
            this.incrementLoader();
        });
        img.src = path;
    }
    loadJson(path, callback) {
        var self = this;
        FosterIO.read(path, (data) => {
            let p = this.pathify(path);
            Assets.json[p] = JSON.parse(data);
            if (callback != undefined)
                callback(Assets.json[p]);
            self.incrementLoader();
        });
    }
    loadXml(path, callback) {
        FosterIO.read(path, (data) => {
            let p = this.pathify(path);
            Assets.xml[p] = (new DOMParser()).parseFromString(data, "text/xml");
            if (callback != undefined)
                callback(Assets.xml[p]);
            this.incrementLoader();
        });
    }
    loadText(path, callback) {
        FosterIO.read(path, (data) => {
            let p = this.pathify(path);
            Assets.text[p] = data;
            if (callback != undefined)
                callback(Assets.text[p]);
            this.incrementLoader();
        });
    }
    loadSound(handle, path, callback) {
        let audio = new Audio();
        audio.addEventListener("loadeddata", () => {
            Assets.sounds[handle] = new AudioSource(path, audio);
            if (callback != undefined)
                callback(Assets.sounds[handle]);
            this.incrementLoader();
        });
        audio.src = path;
    }
    loadAtlas(data) {
        var self = this;
        var texture = null;
        var atlasdata = null;
        // check to see if both the texture and data file are done
        // if they are, then create the atlas object
        function check() {
            if (texture == null || atlasdata == null)
                return;
            let atlas = new Atlas(data.name, texture, atlasdata, data.loader);
            Assets.atlases[atlas.name] = atlas;
            self.incrementLoader();
        }
        // load atlas data file  (XML or JSON)
        if ((/(?:\.([^.]+))?$/).exec(data.data)[1] == "xml")
            this.loadXml(FosterIO.join(this.root, data.data), (xml) => { atlasdata = xml; check(); });
        else
            this.loadJson(FosterIO.join(this.root, data.data), (j) => { atlasdata = j; check(); });
        // load atlas texture file
        this.loadTexture(FosterIO.join(this.root, data.image), (tex) => { texture = tex; check(); });
    }
    incrementLoader() {
        this.assetsLoaded++;
        if (this.assetsLoaded == this.assets) {
            this._loaded = true;
            this._loading = false;
            if (this.callback != undefined)
                this.callback();
        }
    }
    pathify(path) {
        while (path.indexOf("\\") >= 0)
            path = path.replace("\\", "/");
        return path;
    }
}
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
        for (var path in Assets.textures)
            Assets.textures[path].dispose();
        Assets.textures = {};
        for (var path in Assets.sounds)
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
class AudioGroup {
    static volume(group, value) {
        if (value != undefined && AudioGroup.volumes[group] != value) {
            AudioGroup.volumes[group] = value;
            for (let i = 0; i < Sound.active.length; i++)
                if (Sound.active[i].ingroup(group))
                    Sound.active[i].volume = Sound.active[i].volume;
        }
        if (AudioGroup.volumes[group] != undefined)
            return AudioGroup.volumes[group];
        return 1;
    }
    static muted(group, value) {
        if (value != undefined && AudioGroup.mutes[group] != value) {
            AudioGroup.mutes[group] = value;
            for (let i = 0; i < Sound.active.length; i++)
                if (Sound.active[i].ingroup(group))
                    Sound.active[i].muted = Sound.active[i].muted;
        }
        if (AudioGroup.mutes[group] != undefined)
            return AudioGroup.mutes[group];
        return false;
    }
}
AudioGroup.volumes = {};
AudioGroup.mutes = {};
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
            let source = this.sounds[0];
            this.sounds.splice(0, 1);
            return source;
        }
        else if (this.sounds.length < AudioSource.maxInstances) {
            let source = new Audio();
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
    }
}
AudioSource.maxInstances = 50;
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
        this.source = Assets.sounds[handle];
        if (groups && groups.length > 0)
            for (let i = 0; i < groups.length; i++)
                this.group(groups[i]);
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
                    var self = this;
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
            let i = Sound.active.indexOf(this);
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
        let index = this.groups.indexOf(group);
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
        var self = this;
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
            for (let i = 0; i < this.groups.length; i++)
                groupVolume *= AudioGroup.volume(this.groups[i]);
            this.sound.volume = this._volume * groupVolume * Engine.volume;
        }
    }
    internalUpdateMuted() {
        if (this.started) {
            let groupMuted = false;
            for (let i = 0; i < this.groups.length && !groupMuted; i++)
                groupMuted = groupMuted || AudioGroup.muted(this.groups[i]);
            this.sound.muted = Engine.muted || this._muted || groupMuted;
        }
    }
    update() {
        if (this.fadePercent < 1) {
            this.fadePercent = Calc.approach(this.fadePercent, 1, Engine.delta / this.fadeDuration);
            this.volume = this.fadeFrom + (this.fadeTo - this.fadeFrom) * this.fadeEase(this.fadePercent);
        }
    }
    fade(volume, duration, ease) {
        this.fadeFrom = this.volume;
        this.fadeTo = volume;
        this.fadeDuration = Math.max(0.001, duration);
        this.fadeEase = (ease != undefined ? ease : (n) => { return n; });
        this.fadePercent = 0;
        return this;
    }
}
Sound.active = [];
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
        this.data = data;
        this.reader = reader;
        this.reader(this.data, this);
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
        return this.subtextures[name] != undefined;
    }
    /**
     * Gets a list of textures
     */
    list(prefix, names) {
        let listed = [];
        for (let i = 0; i < names.length; i++)
            listed.push(this.get(prefix + names[i]));
        return listed;
    }
    /**
     * Finds all subtextures with the given prefix
     */
    find(prefix) {
        // find all textures
        let found = [];
        for (var key in this.subtextures) {
            if (key.indexOf(prefix) == 0)
                found.push({ name: key, tex: this.subtextures[key] });
        }
        // sort textures by name
        found.sort((a, b) => {
            return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
        });
        // get sorted list
        let listed = [];
        for (let i = 0; i < found.length; i++)
            listed.push(found[i]);
        return listed;
    }
}
class AtlasReaders {
    /**
     * Parses Aseprite data from the atlas
     */
    static Aseprite(data, into) {
        let frames = data["frames"];
        for (var path in frames) {
            var name = path.replace(".ase", "").replace(".png", "");
            var obj = frames[path];
            var bounds = obj.frame;
            if (obj.trimmed) {
                var source = obj["spriteSourceSize"];
                var size = obj["sourceSize"];
                into.subtextures[name] = new Texture(into.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h), new Rectangle(-source.x, -source.y, size.w, size.h));
            }
            else {
                into.subtextures[name] = new Texture(into.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h));
            }
        }
    }
}
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
            let gl = Engine.graphics.gl;
            gl.deleteTexture(this.webGLTexture);
            this.path = "";
            this.webGLTexture = null;
            this.width = 1;
            this.height = 1;
            this.disposed = true;
        }
    }
}
/// <reference path="./fosterWebGLTexture.ts"/>
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
        let gl = Engine.graphics.gl;
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
        let gl = Engine.graphics.gl;
        let frameBuffer = gl.createFramebuffer();
        let tex = gl.createTexture();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        let vertexBuffer = gl.createBuffer();
        let uvBuffer = gl.createBuffer();
        let colorBuffer = gl.createBuffer();
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return new RenderTarget(frameBuffer, new FosterWebGLTexture(tex, width, height), vertexBuffer, colorBuffer, uvBuffer);
    }
}
/// <reference path="./fosterWebGLTexture.ts"/>
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
        this.texture = texture;
        this.bounds = bounds || new Rectangle(0, 0, texture.width, texture.height);
        this.frame = frame || new Rectangle(0, 0, this.bounds.width, this.bounds.height);
        this.center = new Vector(this.frame.width / 2, this.frame.height / 2);
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
        sub.center = new Vector(sub.frame.width / 2, sub.frame.height / 2);
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
            ": [" + this.bounds.x + ", " + this.bounds.y + ", " + this.bounds.width + ", " + this.bounds.height + "]" +
            "frame[" + this.frame.x + ", " + this.frame.y + ", " + this.frame.width + ", " + this.frame.height + "]");
    }
    /**
     * Draws this texture
     */
    draw(position, origin, scale, rotation, color, flipX, flipY) {
        Engine.graphics.texture(this, position.x, position.y, null, color, origin, scale, rotation, flipX, flipY);
    }
    /**
     * Draws a cropped version of this texture
     */
    drawCropped(position, crop, origin, scale, rotation, color, flipX, flipY) {
        Engine.graphics.texture(this, position.x, position.y, crop, color, origin, scale, rotation, flipX, flipY);
    }
    /**
     * Draws this texture, center aligned
     */
    drawCenter(position, scale, rotation, color, flipX, flipY) {
        Engine.graphics.texture(this, position.x, position.y, null, color, this.center, scale, rotation, flipX, flipY);
    }
    /**
     * Draws a cropped version of this texture, center aligned
     */
    drawCenterCropped(position, crop, scale, rotation, color, flipX, flipY) {
        Engine.graphics.texture(this, position.x, position.y, crop, color, new Vector(crop.width / 2, crop.height / 2), scale, rotation, flipX, flipY);
    }
    /**
     * Draws this texture, justified
     */
    drawJustify(position, justify, scale, rotation, color, flipX, flipY) {
        Engine.graphics.texture(this, position.x, position.y, null, color, new Vector(this.width * justify.x, this.height * justify.y), scale, rotation, flipX, flipY);
    }
    /**
     * Draws a cropped version of this texture, justified
     */
    drawJustifyCropped(position, crop, justify, scale, rotation, color, flipX, flipY) {
        Engine.graphics.texture(this, position.x, position.y, crop, color, new Vector(crop.width * justify.x, crop.height * justify.y), scale, rotation, flipX, flipY);
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
        let gl = Engine.graphics.gl;
        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return new Texture(new FosterWebGLTexture(tex, image.width, image.height));
    }
    /**
     * Creates a new Texture from the given RGBA array
     */
    static createFromData(data, width, height) {
        let gl = Engine.graphics.gl;
        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(data));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        return new Texture(new FosterWebGLTexture(tex, width, height));
    }
}
class Component {
    constructor() {
        this._entity = null;
        this._scene = null;
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
        this.position = new Vector(0, 0);
    }
    /**
     * The Entity this Component is a child of
     */
    get entity() { return this._entity; }
    set entity(val) {
        if (this._entity != null && val != null)
            throw "This Component is already attached to an Entity";
        this._entity = val;
    }
    /**
     * The Scene containing this Component
     */
    get scene() { return this._scene; }
    set scene(val) {
        if (this._scene != null && val != null)
            throw "This Component is already attached to a Scene";
        this._scene = val;
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
    /**
     * The position of the Component in the Scene (position + Entity.position)
     */
    get scenePosition() {
        return new Vector((this._entity ? this._entity.x : 0) + this.position.x, (this._entity ? this._entity.y : 0) + this.position.y);
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
/// <reference path="./../component.ts"/>
class Alarm extends Component {
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
            this._percent += Engine.delta / this.duration;
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
        let alarm = new Alarm();
        on.add(alarm);
        return alarm;
    }
}
/// <reference path="./../../component.ts"/>
class Collider extends Component {
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
    collides(tags, x, y) {
        for (let i = 0; i < tags.length; i++) {
            let hit = this.collide(tags[i], x, y);
            if (hit != null)
                return hit;
        }
        return null;
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
    get sceneLeft() { return this.scenePosition.x + this.left; }
    get sceneRight() { return this.scenePosition.x + this.left + this.width; }
    get sceneTop() { return this.scenePosition.y + this.top; }
    get sceneBottom() { return this.scenePosition.y + this.top + this.height; }
    get sceneBounds() { return new Rectangle(this.sceneLeft, this.sceneTop, this.width, this.height); }
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
    debugRender() {
        Engine.graphics.hollowRect(this.sceneLeft, this.sceneTop, this.width, this.height, 1, Color.red);
    }
}
/// <reference path="./collider.ts"/>
class Hitgrid extends Collider {
    constructor(tileWidth, tileHeight, tags) {
        super();
        this.map = {};
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
                    Engine.graphics.rect(px, py, 1, this.tileHeight, l ? Color.red : this.debugSub);
                    Engine.graphics.rect(px, py, this.tileWidth, 1, u ? Color.red : this.debugSub);
                    Engine.graphics.rect(px + this.tileWidth - 1, py, 1, this.tileHeight, r ? Color.red : this.debugSub);
                    Engine.graphics.rect(px, py + this.tileHeight - 1, this.tileWidth, 1, d ? Color.red : this.debugSub);
                }
            }
        }
    }
}
/// <reference path="./../component.ts"/>
/**
 * Coroutine Class. This uses generator functions which are only supported in ES6 and is missing in many browsers.
 * More information: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/function*
 */
class Coroutine extends Component {
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
        this.wait -= Engine.delta;
        if (this.wait > 0)
            return;
        this.step();
    }
    /**
     * Steps the Coroutine through the Iterator once
     */
    step() {
        if (this.iterator != null) {
            let next = this.iterator.next();
            if (next.done)
                this.end(next.value == "remove");
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
class Particle {
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
    static get zero() { return Vector._zero.set(0, 0); }
}
Vector.directions = [
    new Vector(-1, 0),
    new Vector(0, -1),
    new Vector(1, 0),
    new Vector(0, 1)
];
// temporary vectors used wherever
Vector.temp0 = new Vector();
Vector.temp1 = new Vector();
Vector.temp2 = new Vector();
Vector._zero = new Vector();
/// <reference path="./../../component.ts"/>
/// <reference path="./../../util/Color.ts"/>
/// <reference path="./../../util/Vector.ts"/>
class ParticleSystem extends Component {
    constructor(template) {
        super();
        this.renderRelativeToEntity = false;
        this.particles = [];
        this.template = ParticleTemplate.templates[template];
    }
    update() {
        let dt = Engine.delta;
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
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
            p.speedX = Calc.approach(p.speedX, 0, p.frictionX * dt);
            p.speedY = Calc.approach(p.speedY, 0, p.frictionY * dt);
        }
    }
    render(camera) {
        if (Engine.graphics.pixel == null)
            throw "Particle System requires Engine.graphis.pixel to be set";
        let pos = this.position;
        if (this.renderRelativeToEntity)
            pos = this.scenePosition;
        let t = this.template;
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            let lerp = p.percent;
            let x = pos.x + p.x;
            let y = pos.y + p.y;
            let scaleX = p.scaleFromX + (p.scaleToX - p.scaleFromX) * t.scaleXEaser(lerp);
            let scaleY = p.scaleFromY + (p.scaleToY - p.scaleFromY) * t.scaleYEaser(lerp);
            let rotation = p.rotationFrom + (p.rotationTo - p.rotationFrom) * t.rotationEaser(lerp);
            let alpha = p.alphaFrom + (p.alphaTo - p.alphaFrom) * t.alphaEaser(lerp);
            let color = ParticleSystem.color.lerp(p.colorFrom, p.colorTo, t.colorEaser(lerp)).mult(alpha);
            Engine.graphics.texture(Engine.graphics.pixel, x, y, null, color, ParticleSystem.origin, ParticleSystem.scale.set(scaleX, scaleY), rotation);
        }
    }
    burst(x, y, direction, rangeX, rangeY, count) {
        let t = this.template;
        if (rangeX == undefined || rangeX == null)
            rangeX = 0;
        if (rangeY == undefined || rangeY == null)
            rangeY = 0;
        if (count == undefined)
            count = 1;
        for (let i = 0; i < count; i++) {
            let duration = t.durationBase + Calc.range(t.durationRange);
            if (duration <= 0)
                continue;
            // get particle
            let p = null;
            if (ParticleSystem.cache.length > 0) {
                p = ParticleSystem.cache[0];
                ParticleSystem.cache.splice(0, 1);
            }
            else
                p = new Particle();
            let speed = t.speedBase + Calc.range(t.speedRange);
            // spawn particle
            p.percent = 0;
            p.duration = duration;
            p.x = x + Calc.range(rangeX);
            p.y = y + Calc.range(rangeY);
            p.colorFrom = Calc.choose(t.colorsFrom);
            p.colorTo = Calc.choose(t.colorsTo);
            p.speedX = Math.cos(direction) * speed;
            p.speedY = -Math.sin(direction) * speed;
            p.accelX = t.accelBaseX + Calc.range(t.accelRangeX);
            p.accelY = t.accelBaseY + Calc.range(t.accelRangeY);
            p.frictionX = t.frictionBaseX + Calc.range(t.frictionRangeX);
            p.frictionY = t.frictionBaseY + Calc.range(t.frictionRangeY);
            p.scaleFromX = t.scaleFromBaseX + Calc.range(t.scaleFromRangeX);
            p.scaleFromY = t.scaleFromBaseY + Calc.range(t.scaleFromRangeY);
            p.scaleToX = t.scaleToBaseX + Calc.range(t.scaleToRangeX);
            p.scaleToY = t.scaleToBaseY + Calc.range(t.scaleToRangeY);
            p.rotationFrom = t.rotationFromBase + Calc.range(t.rotationFromRange);
            p.rotationTo = t.rotationToBase + Calc.range(t.rotationToRange);
            p.alphaFrom = t.alphaFromBase + Calc.range(t.alphaFromRange);
            p.alphaTo = t.alphaToBase + Calc.range(t.alphaToRange);
            // addd
            this.particles.push(p);
        }
    }
}
ParticleSystem.cache = [];
// temp values used during rendering so we aren't creating new ones every frame
ParticleSystem.color = new Color();
ParticleSystem.origin = new Vector(0.5, 0.5);
ParticleSystem.scale = new Vector(0, 0);
class ParticleTemplate {
    constructor(name) {
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
        this.colorsFrom = [Color.white];
        this.colorsTo = [Color.white];
        this.colorEaser = Ease.linear;
        this.alphaFromBase = 1;
        this.alphaFromRange = 0;
        this.alphaToBase = 1;
        this.alphaToRange = 0;
        this.alphaEaser = Ease.linear;
        this.rotationFromBase = 0;
        this.rotationFromRange = 0;
        this.rotationToBase = 0;
        this.rotationToRange = 0;
        this.rotationEaser = Ease.linear;
        this.scaleFromBaseX = 1;
        this.scaleFromRangeX = 0;
        this.scaleToBaseX = 1;
        this.scaleToRangeX = 0;
        this.scaleXEaser = Ease.linear;
        this.scaleFromBaseY = 1;
        this.scaleFromRangeY = 0;
        this.scaleToBaseY = 1;
        this.scaleToRangeY = 0;
        this.scaleYEaser = Ease.linear;
        this.durationBase = 1;
        this.durationRange = 1;
        this.name = name;
        ParticleTemplate.templates[name] = this;
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
            let sign = Calc.sign(amount);
            amount = Math.abs(Math.round(amount));
            while (amount > 0) {
                let hit = this.collides(this.solids, sign, 0);
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
            let sign = Calc.sign(amount);
            amount = Math.abs(Math.round(amount));
            while (amount > 0) {
                let hit = this.collides(this.solids, 0, sign);
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
/// <reference path="./../../component.ts"/>
class Graphic extends Component {
    constructor(texture, position) {
        super();
        this.scale = new Vector(1, 1);
        this.origin = new Vector(0, 0);
        this.rotation = 0;
        this.flipX = false;
        this.flipY = false;
        this.color = Color.white.clone();
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
    center() {
        this.justify(0.5, 0.5);
    }
    justify(x, y) {
        this.origin.set(this.width * x, this.height * y);
    }
    render(camera) {
        Engine.graphics.texture(this.texture, this.scenePosition.x, this.scenePosition.y, this.crop, Color.temp.copy(this.color).mult(this.alpha), this.origin, this.scale, this.rotation, this.flipX, this.flipY);
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
        this.color = Color.white.clone();
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
        if (Engine.graphics.shader.sampler2d != null) {
            Engine.graphics.texture(Engine.graphics.pixel, this.scenePosition.x, this.scenePosition.y, null, Color.temp.copy(this.color).mult(this.alpha), Vector.temp0.copy(this.origin).div(this.size), Vector.temp1.copy(this.size).mult(this.scale), this.rotation);
        }
        else {
            Engine.graphics.quad(this.scenePosition.x, this.scenePosition.y, this.size.x, this.size.y, Color.temp.copy(this.color).mult(this.alpha), this.origin, this.scale, this.rotation);
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
        this.color = Color.white.clone();
        this.alpha = 1;
        this.map = {};
        this.crop = new Rectangle();
        this.texture = texture;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileColumns = this.texture.width / this.tileWidth;
    }
    set(tileX, tileY, mapX, mapY, mapWidth, mapHeight) {
        let tileIndex = tileX + tileY * this.tileColumns;
        for (let x = mapX; x < mapX + (mapWidth || 1); x++) {
            if (this.map[x] == undefined)
                this.map[x] = {};
            for (let y = mapY; y < mapY + (mapHeight || 1); y++)
                this.map[x][y] = tileIndex;
        }
        return this;
    }
    clear(mapX, mapY, mapWidth, mapHeight) {
        for (let x = mapX; x < mapX + (mapWidth || 1); x++)
            if (this.map[x] != undefined)
                for (let y = mapY; y < mapY + (mapHeight || 1); y++)
                    if (this.map[x][y] != undefined)
                        delete this.map[x][y];
        return this;
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
        for (let tx = left; tx < right; tx++) {
            if (this.map[tx] == undefined)
                continue;
            for (let ty = top; ty < bottom; ty++) {
                let index = this.map[tx][ty];
                if (index != undefined) {
                    this.crop.x = (index % this.tileColumns) * this.tileWidth;
                    this.crop.y = Math.floor(index / this.tileColumns) * this.tileHeight;
                    Engine.graphics.texture(this.texture, pos.x + tx * this.tileWidth, pos.y + ty * this.tileHeight, this.crop, Color.temp.copy(this.color).mult(this.alpha));
                }
            }
        }
    }
}
/// <reference path="./../component.ts"/>
class Tween extends Component {
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
        this.ease = (p) => { return p; };
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
            this._percent += Engine.delta / this.duration;
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
        let tween = new Tween();
        on.add(tween);
        return tween;
    }
}
/**
 * Current game Client
 */
var Client;
(function (Client) {
    /**
     * Running on the desktop (in Electron)
     */
    Client[Client["Desktop"] = 0] = "Desktop";
    /**
     * Running on the Web
     */
    Client[Client["Web"] = 1] = "Web";
})(Client || (Client = {}));
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
        this.client = Client.Web;
        if (window && window.process && window.process.versions && window.process.versions.electron)
            this.client = Client.Desktop;
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
        for (let i = 0; i < Sound.active.length; i++)
            Sound.active[i].volume = Sound.active[i].volume;
    }
    /**
     * Mutes or Unmutes the entire game
     */
    static get muted() { return Engine._muted; }
    static set muted(m) {
        Engine._muted = m;
        for (let i = 0; i < Sound.active.length; i++)
            Sound.active[i].muted = Sound.active[i].muted;
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
            // init
            FosterIO.init();
            Engine.instance.graphics = new Graphics(Engine.instance);
            Engine.instance.graphics.load();
            Engine.resize(width, height);
            Shaders.init();
            Mouse.init();
            Keys.init();
            GamepadManager.init();
            // start update loop
            Engine.instance.step();
            // ready callback for game
            if (ready != undefined)
                ready();
        };
    }
    /**
     * Goes to a new Scene
     * @param scene 	The Scene to go to
     * @param disposeLastScene 	If the last scene should be disposed
     */
    static goto(scene, disposeLastScene) {
        let lastScene = Engine.scene;
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
        var time = Date.now();
        this.elapsed = Math.floor(time - this.startTime) / 1000;
        this.dt = Math.floor(time - this.lastTime) / 1000;
        this.lastTime = time;
        // update graphics
        this.graphics.update();
        // update inputs
        Mouse.update();
        Keys.update();
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
        // begin drawing
        this.graphics.reset();
        // render current scene
        if (this.scene != null)
            this.scene.render();
        // final flush on graphics
        this.graphics.finalize();
        // update sounds
        for (let i = 0; i < Sound.active.length; i++)
            Sound.active[i].update();
        // do it all again!
        if (!Engine.exiting)
            requestAnimationFrame(this.step.bind(this));
    }
    exit() {
        Engine.exiting = true;
        Assets.unload();
        Engine.graphics.unload();
        if (Engine.client == Client.Desktop) {
            var remote = require("electron").remote;
            var win = remote.getCurrentWindow();
            win.close();
        }
    }
}
/**
 * Foster Engine version
 */
Engine.version = "0.1.0";
Engine._volume = 1;
Engine._muted = false;
Engine.instance = null;
Engine.started = false;
Engine.exiting = false;
class Entity {
    constructor() {
        /**
         * Position of the Entity in the Scene
         */
        this.position = new Vector(0, 0);
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
        this.components = [];
        /**
         * List of all Groups the Entity is in
         */
        this.groups = [];
        this._depth = 0;
        this._nextDepth = null;
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
     * Called the first time the entity is added to a scene (after constructor, before added)
     */
    created() {
    }
    /**
     * Called immediately whenever the entity is added to a Scene (after created, before started)
     */
    added() {
    }
    /**
     * Called before the first update of the Entity (after added)
     */
    started() {
    }
    /**
     * Called immediately whenever the entity is removed from a Scene
     */
    removed() {
    }
    /**
     * Called immediately whenever the entity is recycled in a Scene
     */
    recycled() {
    }
    /**
     * Called when an entity is permanently destroyed
     */
    destroyed() {
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
        Engine.graphics.hollowRect(this.x - 5, this.y - 5, 10, 10, 1, Color.white);
        for (let i = 0; i < this.components.length; i++)
            if (this.components[i].visible)
                this.components[i].debugRender(camera);
    }
    /**
     * Adds a Component to this Entity
     */
    add(component) {
        this.components.push(component);
        component.entity = this;
        component.addedToEntity();
        if (this.scene != null)
            this.scene._trackComponent(component);
    }
    /**
     * Removes a Components from this Entity
     */
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
    /**
     * Removes all Components from this Entity
     */
    removeAll() {
        for (let i = this.components.length - 1; i >= 0; i--)
            this.remove(this.components[i]);
    }
    /**
     * Finds the first component in this Entity of the given Class
     */
    find(className) {
        for (let i = 0; i < this.components.length; i++)
            if (this.components[i] instanceof className)
                return this.components[i];
        return null;
    }
    /**
     * Finds all components in this Entity of the given Class
     */
    findAll(className) {
        let list = [];
        for (let i = 0; i < this.components.length; i++)
            if (this.components[i] instanceof className)
                list.push(this.components[i]);
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
        let index = this.groups.indexOf(groupType);
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
/**
 * Handels the Game Window and the differences between Browser / Desktop mode
 */
class GameWindow {
    constructor() {
        if (Engine.client == Client.Desktop) {
            var remote = require("electron").remote;
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
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.setTitle(val);
        else
            document.title = val;
    }
    /**
     * Toggles Fullscreen Mode if running on the Desktop
     */
    static get fullscreen() {
        return Engine.client == Client.Desktop && GameWindow.browserWindow.isFullScreen();
    }
    static set fullscreen(val) {
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.setFullScreen(val);
        else
            console.warn("Can only set Fullscreen in Client.Desktop mode");
    }
    /**
     * Returns the left position of the screen
     */
    static get screenLeft() {
        if (Engine.client == Client.Desktop)
            return GameWindow.browserWindow.getPosition()[0];
        else
            return Engine.graphics.canvas.getBoundingClientRect().left;
    }
    /**
     * Returns the Top position of the screen
     */
    static get screenTop() {
        if (Engine.client == Client.Desktop)
            return GameWindow.browserWindow.getPosition()[1];
        else
            return Engine.graphics.canvas.getBoundingClientRect().top;
    }
    /**
     * Returns the Width of the screen
     */
    static get screenWidth() {
        if (Engine.client == Client.Desktop)
            return GameWindow.browserWindow.getContentSize()[0];
        else
            return Engine.graphics.canvas.getBoundingClientRect().width;
    }
    /**
     * Returns the Height of the screen
     */
    static get screenHeight() {
        if (Engine.client == Client.Desktop)
            return GameWindow.browserWindow.getContentSize()[1];
        else
            return Engine.graphics.canvas.getBoundingClientRect().height;
    }
    /**
     * Resizes the Window if running in Desktop mode
     */
    static resize(width, height) {
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.setContentSize(width, height);
    }
    /**
     * Centers the Window if running in Desktop mode
     */
    static center() {
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.center();
    }
    /**
     * Toggles Developer tools if running in Desktop mode
     */
    static toggleDevTools() {
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.toggleDevTools();
    }
    /**
     * Gets the absolute mouse position in the screen
     */
    static get screenMouse() {
        if (Engine.client == Client.Desktop) {
            var pos = GameWindow.screen.getCursorScreenPoint();
            return new Vector(pos.x, pos.y);
        }
        return Mouse.absolute;
    }
}
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
})(ResolutionStyle || (ResolutionStyle = {}));
class Graphics {
    /**
     * Creates the Engine.Graphics
     */
    constructor(engine) {
        this.resolutionStyle = ResolutionStyle.Contain;
        this.borderColor = Color.black.clone();
        this.clearColor = new Color(0.1, 0.1, 0.3, 1);
        // vertices
        this.vertices = [];
        this.texcoords = [];
        this.colors = [];
        // current render target
        this.currentTarget = null;
        // shader
        this.currentShader = null;
        this.nextShader = null;
        // orthographic matrix
        this.orthographic = new Matrix();
        this.toscreen = new Matrix();
        // pixel drawing
        this._pixel = null;
        this._pixelUVs = [new Vector(0, 0), new Vector(1, 0), new Vector(1, 1), new Vector(0, 1)];
        this._defaultPixel = null;
        // utils
        this.drawCalls = 0;
        // temp. vars used for drawing
        this.topleft = new Vector();
        this.topright = new Vector();
        this.botleft = new Vector();
        this.botright = new Vector();
        this.texToDraw = new Texture(null, new Rectangle(), new Rectangle());
        this.engine = engine;
        // create the screen
        this.canvas = document.createElement("canvas");
        this.gl = this.canvas.getContext('experimental-webgl', {
            alpha: false,
            antialias: false
        });
        Engine.root.appendChild(this.canvas);
        this.gl.enable(this.gl.BLEND);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.CULL_FACE);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
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
        if (this.shader != s && s != null)
            this.nextShader = s;
    }
    set pixel(p) {
        if (p == null)
            p = this._defaultPixel;
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
     * Initial load of Graphics and WebGL components
     */
    load() {
        // creates the default pixel texture
        this.pixel = this._defaultPixel = Texture.createFromData([1, 1, 1, 1], 1, 1);
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
        // TODO: Implement this properly
    }
    /**
     * Called when the Game resolution changes
     */
    resize() {
        // buffer
        if (this.buffer != null)
            this.buffer.dispose();
        this.buffer = RenderTarget.create(Engine.width, Engine.height);
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
        if (this.canvas.width != Engine.root.clientWidth || this.canvas.height != Engine.root.clientHeight) {
            this.canvas.width = Engine.root.clientWidth;
            this.canvas.height = Engine.root.clientHeight;
        }
    }
    /**
     * Gets the rectangle that the game buffer should be drawn to the screen with
     */
    getOutputBounds() {
        let scaleX = 1;
        let scaleY = 1;
        if (this.resolutionStyle == ResolutionStyle.Exact) {
            scaleX = this.canvas.width / this.buffer.width;
            scaleY = this.canvas.height / this.buffer.height;
        }
        else if (this.resolutionStyle == ResolutionStyle.Contain) {
            scaleX = scaleY = (Math.min(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
        }
        else if (this.resolutionStyle == ResolutionStyle.ContainInteger) {
            scaleX = scaleY = Math.floor(Math.min(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
        }
        else if (this.resolutionStyle == ResolutionStyle.Fill) {
            scaleX = scaleY = (Math.max(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
        }
        else if (this.resolutionStyle == ResolutionStyle.FillInteger) {
            scaleX = scaleY = Math.ceil(Math.max(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
        }
        let width = this.buffer.width * scaleX;
        let height = this.buffer.height * scaleY;
        return new Rectangle((this.canvas.width - width) / 2, (this.canvas.height - height) / 2, width, height);
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
        if (this.currentTarget != target) {
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
        if (Engine.assert(this.shader.sampler2d != null, "This shader has no Sampler2D to set the texture to"))
            this.shader.sampler2d.value = tex.texture.webGLTexture;
    }
    /**
     * Checks if the shader was modified, and if so, flushes the current vertices & starts a new draw
     */
    checkState() {
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
                    // special case for Sampler2D
                    if (uniform.type == ShaderUniformType.sampler2D) {
                        this.gl.activeTexture(this.gl["TEXTURE" + textureCounter]);
                        if (uniform.value instanceof Texture)
                            this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value.texture.webGLTexture);
                        else
                            this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value);
                        this.gl.uniform1i(location, textureCounter);
                        textureCounter += 1;
                    }
                    else {
                        setGLUniformValue[uniform.type](this.gl, uniform.uniform, uniform.value);
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
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.vertexBuffer : this.currentTarget.vertexBuffer));
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
                    this.gl.vertexAttribPointer(attr.attribute, 2, this.gl.FLOAT, false, 0, 0);
                }
                else if (attr.type == ShaderAttributeType.Texcoord) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.texcoordBuffer : this.currentTarget.texcoordBuffer));
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texcoords), this.gl.STATIC_DRAW);
                    this.gl.vertexAttribPointer(attr.attribute, 2, this.gl.FLOAT, false, 0, 0);
                }
                else if (attr.type == ShaderAttributeType.Color) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.colorBuffer : this.currentTarget.colorBuffer));
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
                    this.gl.vertexAttribPointer(attr.attribute, 4, this.gl.FLOAT, false, 0, 0);
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
        this.shader = Shaders.texture;
        this.shader.sampler2d.value = this.buffer.texture.webGLTexture;
        this.shader.set("matrix", this.toscreen);
        // draw our buffer centered!
        let bounds = this.getOutputBounds();
        this.push(bounds.left, bounds.top, 0, 0, Color.white);
        this.push(bounds.right, bounds.top, 1, 0, Color.white);
        this.push(bounds.right, bounds.bottom, 1, 1, Color.white);
        this.push(bounds.left, bounds.top, 0, 0, Color.white);
        this.push(bounds.right, bounds.bottom, 1, 1, Color.white);
        this.push(bounds.left, bounds.bottom, 0, 1, Color.white);
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
        if (color != undefined && color != null)
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
        if (color != undefined && color != null)
            this.colors.push(color.r, color.g, color.b, color.a);
    }
    /**
     * Pushes a list of vertices to the screen. If the shader has been modified, this will end and start a new draw call
     */
    pushList(pos, uv, color) {
        this.checkState();
        for (let i = 0; i < pos.length; i++) {
            this.vertices.push(pos[i].x, pos[i].y);
            if (uv != undefined && uv != null)
                this.texcoords.push(uv[i].x, uv[i].y);
            if (color != undefined && color != null) {
                let c = color[i];
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
        this.pushUnsafe(posX + this.topright.x, posY + this.topright.y, uvMaxX, uvMinY, col);
        this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, uvMaxX, uvMaxY, col);
        this.pushUnsafe(posX + this.topleft.x, posY + this.topleft.y, uvMinX, uvMinY, col);
        this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, uvMaxX, uvMaxY, col);
        this.pushUnsafe(posX + this.botleft.x, posY + this.botleft.y, uvMinX, uvMaxY, col);
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
        let uv = this._pixelUVs;
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
        if (colB == undefined)
            colB = colA;
        if (colC == undefined)
            colC = colA;
        let uv = this._pixelUVs;
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
        if (colorB == undefined)
            colorB = colorA;
        this.checkState();
        let uv = this._pixelUVs;
        let last = new Vector(pos.x + rad, pos.y);
        for (let i = 1; i <= steps; i++) {
            let angle = (i / steps) * Math.PI * 2;
            let next = new Vector(pos.x + Math.cos(angle), pos.y + Math.sin(angle));
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
/// <reference path="./../component.ts"/>
/// <reference path="./../util/vector.ts"/>
class GamepadManager {
    static init() {
        window.addEventListener("gamepadconnected", GamepadManager.onAddController, false);
        window.addEventListener("gamepaddisconnected", GamepadManager.onRemoveController, false);
    }
    static onAddController(event) {
        for (var i = 0; i < GamepadManager.controllers.length; i++) {
            if (GamepadManager.controllers[i].gamepad == event.gamepad)
                return; // We already have this controller, must be a reconnect.
        }
        if (event.gamepad.id.includes("Unknown Gamepad"))
            return; // On some platforms each x360 controller was showing up twice and only one of them was queryable. -_-
        GamepadManager.controllers.push(new ControllerInput(event.gamepad));
    }
    static onRemoveController(event) {
        console.log("A gamepad was disconnected, please reconnect.");
    }
    static getController(index) {
        return GamepadManager.controllers[index];
    }
    static numControllers() {
        return GamepadManager.controllers.length;
    }
    static setRemoveControllerBehavior(handler) {
        // let the dev decide how to act when controllers are removed.
        GamepadManager.onRemoveController = handler;
    }
}
GamepadManager.defaultDeadzone = 0.3;
GamepadManager.controllers = [];
class ControllerInput extends Component {
    constructor(pad, deadzone = GamepadManager.defaultDeadzone) {
        super();
        // actual state of the gamepad
        this.leftStick = new Vector();
        this.rightStick = new Vector();
        this.buttons = [];
        this.gamepad = pad;
        this.deadzone = deadzone;
        for (var i = 0; i < pad.buttons.length; i++)
            this.buttons.push(new ButtonState());
    }
    update() {
        var gamepad = this.queryGamepad();
        this.leftStick.x = gamepad.axes[0];
        this.leftStick.y = gamepad.axes[1];
        this.rightStick.x = gamepad.axes[2];
        this.rightStick.y = gamepad.axes[3];
        for (var i = 0; i < this.buttons.length; i++)
            this.buttons[i].update(gamepad.buttons[i].pressed);
    }
    getButton(index) {
        return this.buttons[index];
    }
    getLeftStick() {
        if (this.leftStick.length > this.deadzone)
            return this.leftStick.clone();
        return Vector.zero;
    }
    getRightStick() {
        if (this.rightStick.length > this.deadzone)
            return this.rightStick.clone();
        return Vector.zero;
    }
    getRawLeftStick() {
        return this.leftStick.clone();
    }
    getRawRightStick() {
        return this.rightStick.clone();
    }
    queryGamepad() {
        return navigator.getGamepads()[this.gamepad.index];
    }
}
class ButtonState {
    constructor() {
        this._last = false;
        this._next = false;
    }
    update(val) {
        this._last = this._next;
        this._next = val;
    }
    down() {
        return this._next;
    }
    pressed() {
        return this._next && !this._last;
    }
    released() {
        return this._last && !this._next;
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
    static maps(list) {
        for (let name in list)
            Keys.map(name, list[name]);
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
        let screen = Engine.graphics.canvas.getBoundingClientRect();
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
        this.clearTargetColor = new Color(0, 0, 0, 0);
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
            Engine.graphics.setRenderTarget(this.target);
            Engine.graphics.clear(this.clearTargetColor);
        }
        else
            Engine.graphics.setRenderTarget(Engine.graphics.buffer);
        // set to our shader, and set main Matrix to the camera with fallback to Scene camera
        Engine.graphics.shader = this.shader;
        Engine.graphics.shader.set(this.shaderCameraUniformName, this.getActiveCamera().matrix);
    }
    /**
     * Draws all the entities
     */
    drawEntities() {
        let camera = this.getActiveCamera();
        // draw each entity
        let list = (this.groupsMask.length > 0 ? this.scene.allEntitiesInGroups(this.groupsMask) : this.scene.entities);
        for (let i = list.length - 1; i >= 0; i--)
            if (list[i].visible)
                list[i].render(camera);
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
/// <reference path="./../renderer.ts"/>
/**
 * Uses the Primitive Shader when rendering
 */
class PrimitiveRenderer extends Renderer {
    constructor() {
        super();
        this.shader = Shaders.primitive;
        this.shaderCameraUniformName = "matrix";
    }
}
/// <reference path="./../renderer.ts"/>
/**
 * Uses the Texture Shader when rendering
 */
class SpriteRenderer extends Renderer {
    constructor() {
        super();
        this.shader = Shaders.texture;
        this.shaderCameraUniformName = "matrix";
    }
}
/**
 * The Scene contains a list of Entities and Renderers that in turn handle Gameplay. There can only be one active Scene at a time
 */
class Scene {
    constructor() {
        /**
         * The Camera in the Scene
         */
        this.camera = new Camera();
        /**
         * A list of all the Entities in the Scene
         */
        this.entities = [];
        /**
         * A list of all the Renderers in the Scene
         */
        this.renderers = [];
        /**
         * List of entities about to be sorted by depth
         */
        this.sorting = [];
        this.colliders = {};
        this.groups = {};
        this.cache = {};
        this.camera = new Camera();
        this.addRenderer(new SpriteRenderer());
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
        for (let i = 0; i < this.renderers.length; i++)
            this.renderers[i].dispose();
        while (this.entities.length > 0)
            this.destroy(this.entities[0]);
        this.entities = [];
        this.sorting = [];
        this.renderers = [];
        this.colliders = {};
        this.groups = {};
        this.cache = {};
    }
    /**
     * Called every frame and updates the Scene
     */
    update() {
        // update entities
        let lengthWas = this.entities.length;
        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            if (!entity.isStarted) {
                entity.isStarted = true;
                entity.started();
            }
            if (entity.active && entity.isStarted)
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
    /**
     * Called when the Scene should be rendered, and renders each of its Renderers
     */
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
            Engine.graphics.setRenderTarget(Engine.graphics.buffer);
            Engine.graphics.shader = Shaders.primitive;
            Engine.graphics.shader.set("matrix", this.camera.matrix);
            for (let i = 0; i < this.entities.length; i++)
                if (this.entities[i].active)
                    this.entities[i].debugRender(this.camera);
        }
    }
    /**
     * Adds the given Entity to this Scene
     * @param entity 	The Entity to add
     * @param position 	The optional position to add the Entity at
     */
    add(entity, position) {
        entity.scene = this;
        this._insertEntityInto(entity, this.entities, false);
        if (position != undefined)
            entity.position.set(position.x, position.y);
        // first time for this entity
        if (!entity.isCreated) {
            entity.isCreated = true;
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
    /**
     * Removes the given Entity from the scene
     * @param entity 	The entity to remove
     */
    remove(entity) {
        let index = this.entities.indexOf(entity);
        if (index >= 0)
            this.removeAt(index);
    }
    /**
     * Removes an Entity from Scene.entities at the given index
     * @param index 	The Index to remove at
     */
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
        entity.isStarted = false;
        entity.scene = null;
        this.entities.splice(index, 1);
    }
    /**
     * Removes every Entity from the Scene
     */
    removeAll() {
        for (let i = this.entities.length - 1; i >= 0; i--)
            this.removeAt(i);
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
        for (let i = 0; i < this.entities.length; i++)
            if (this.entities[i] instanceof className)
                return this.entities[i];
        return null;
    }
    findAll(className) {
        let list = [];
        for (let i = 0; i < this.entities.length; i++)
            if (this.entities[i] instanceof className)
                list.push(this.entities[i]);
        return list;
    }
    firstEntityInGroup(group) {
        if (this.groups[group] != undefined && this.groups[group].length > 0)
            return this.groups[group][0];
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
    removeRenderer(renderer, dispose) {
        let index = this.renderers.indexOf(renderer);
        if (index >= 0)
            this.renderers.splice(index, 1);
        if (dispose)
            renderer.dispose();
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
        if (max == undefined)
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
/// <reference path="./vector.ts"/>
/**
 * Camera used to create a Matrix during rendering. Scenes and Renderers may have Cameras
 */
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
        if ((t /= 0.5) == 2)
            return 1;
        let p = (0.3 * 1.5);
        let s = p / 4;
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
/**
 * Handles File IO stuff and the differences between Browser / Desktop mode
 */
class FosterIO {
    static init() {
        if (FosterIO.fs == null && Engine.client == Client.Desktop) {
            FosterIO.fs = require("fs");
            FosterIO.path = require("path");
        }
    }
    static read(path, callback) {
        if (Engine.client == Client.Desktop) {
            FosterIO.fs.readFile(FosterIO.path.join(__dirname, path), 'utf8', function (err, data) {
                if (err)
                    throw err;
                callback(data);
            });
        }
        else {
            let httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = (e) => {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200)
                        callback(httpRequest.responseText);
                    else
                        throw "Unable to read file " + path;
                }
            };
            httpRequest.open('GET', path);
            httpRequest.send();
        }
    }
    static join(...paths) {
        if (paths.length <= 0)
            return ".";
        if (Engine.client == Client.Desktop) {
            let result = paths[0];
            for (let i = 1; i < paths.length; i++)
                result = FosterIO.path.join(result, paths[i]);
            return result;
        }
        else {
            let result = [];
            for (let i = 0; i < paths.length; i++) {
                let sub = paths[i].split("/");
                for (let j = 0; j < sub.length; j++)
                    result.push(sub[j]);
            }
            return result.length > 0 ? result.join("/") : ".";
        }
    }
}
FosterIO.fs = null;
FosterIO.path = null;
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
    fromRotation(rad) {
        var s = Math.sin(rad), c = Math.cos(rad);
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
        if (ref == undefined)
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
/**
 * A Foster Shader used for Rendering
 * For Pre-existing shaders, see Shaders.ts
 */
class Shader {
    /**
     * Creates a new Shader from the given vertex and fragment shader code, with the given uniforms and attributes
     */
    constructor(vertex, fragment, uniforms, attributes) {
        /**
         * If this Shader is dirty and must be updated
         */
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
    /**
     * Sets the Uniform of the given name to the value
     * @param name 	the name of the uniform
     * @param value 	the value to set the uniform to
     */
    set(name, value) {
        this.uniformsByName[name].value = value;
    }
}
/**
 * Shader Uniform Types
 */
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
    // special case for sampler2D
    ShaderUniformType[ShaderUniformType["sampler2D"] = 19] = "sampler2D";
})(ShaderUniformType || (ShaderUniformType = {}));
/**
 * A Shader Uniform instance
 */
class ShaderUniform {
    constructor(name, type, value) {
        this._value = null;
        this.name = name;
        this.type = type;
        this._value = value;
    }
    get value() { return this._value; }
    set value(a) {
        if (this.value != a) {
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
/**
 * Shader Attribute Types
 */
var ShaderAttributeType;
(function (ShaderAttributeType) {
    ShaderAttributeType[ShaderAttributeType["Position"] = 0] = "Position";
    ShaderAttributeType[ShaderAttributeType["Texcoord"] = 1] = "Texcoord";
    ShaderAttributeType[ShaderAttributeType["Color"] = 2] = "Color";
})(ShaderAttributeType || (ShaderAttributeType = {}));
/**
 * A Shader Attribute Instance
 */
class ShaderAttribute {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}
/**
 * Dictionary of Methods to handle setting GL Uniform Values
 */
var setGLUniformValue = {};
// float
setGLUniformValue[ShaderUniformType.float] = (gl, location, value) => {
    gl.uniform1f(location, value);
};
// float 2
setGLUniformValue[ShaderUniformType.float2] = (gl, location, value) => {
    if (value instanceof Vector)
        gl.uniform2f(location, value.x, value.y);
    else
        gl.uniform2f(location, value[0], value[1]);
};
// float 3
setGLUniformValue[ShaderUniformType.float3] = (gl, location, value) => {
    gl.uniform3f(location, value[0], value[1], value[2]);
};
// float 4
setGLUniformValue[ShaderUniformType.float4] = (gl, location, value) => {
    gl.uniform4f(location, value[0], value[1], value[2], value[3]);
};
// float array
setGLUniformValue[ShaderUniformType.floatArray] = (gl, location, value) => {
    gl.uniform1fv(location, value);
};
// float 2 array
setGLUniformValue[ShaderUniformType.float2Array] = (gl, location, value) => {
    gl.uniform2fv(location, value);
};
// float 3 array
setGLUniformValue[ShaderUniformType.float3Array] = (gl, location, value) => {
    gl.uniform3fv(location, value);
};
// float 4 array
setGLUniformValue[ShaderUniformType.float4Array] = (gl, location, value) => {
    gl.uniform4fv(location, value);
};
// int
setGLUniformValue[ShaderUniformType.int] = (gl, location, value) => {
    gl.uniform1i(location, value);
};
// int 2
setGLUniformValue[ShaderUniformType.int2] = (gl, location, value) => {
    if (value instanceof Vector)
        gl.uniform2i(location, Math.round(value.x), Math.round(value.y));
    else
        gl.uniform2i(location, value[0], value[1]);
};
// int 3
setGLUniformValue[ShaderUniformType.int3] = (gl, location, value) => {
    gl.uniform3i(location, value[0], value[1], value[2]);
};
// int 4
setGLUniformValue[ShaderUniformType.int4] = (gl, location, value) => {
    gl.uniform4i(location, value[0], value[1], value[2], value[3]);
};
// int array
setGLUniformValue[ShaderUniformType.intArray] = (gl, location, value) => {
    gl.uniform1iv(location, value);
};
// int 2 array
setGLUniformValue[ShaderUniformType.int2Array] = (gl, location, value) => {
    gl.uniform2iv(location, value);
};
// int 3 array
setGLUniformValue[ShaderUniformType.int3Array] = (gl, location, value) => {
    gl.uniform3iv(location, value);
};
// int 4 array
setGLUniformValue[ShaderUniformType.int4Array] = (gl, location, value) => {
    gl.uniform4iv(location, value);
};
// matrix 2d
setGLUniformValue[ShaderUniformType.matrix2d] = (gl, location, value) => {
    gl.uniformMatrix2fv(location, false, value);
};
// matrix 3d
setGLUniformValue[ShaderUniformType.matrix3d] = (gl, location, value) => {
    if (value instanceof Matrix)
        gl.uniformMatrix3fv(location, false, value.mat);
    else
        gl.uniformMatrix3fv(location, false, value);
};
// matrix 4d
setGLUniformValue[ShaderUniformType.matrix4d] = (gl, location, value) => {
    gl.uniformMatrix2fv(location, false, value);
};
/// <reference path="./shader.ts" />
/**
 * Default 2D shaders
 */
class Shaders {
    /**
     * Initializes Default Shaders (called automatically by the Engine)
     */
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
            '	v_color = vec4(a_color.rgb * a_color.a, a_color.a);' +
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
            new ShaderAttribute('a_texcoord', ShaderAttributeType.Texcoord),
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
            new ShaderAttribute('a_texcoord', ShaderAttributeType.Texcoord),
            new ShaderAttribute('a_color', ShaderAttributeType.Color)
        ]);
        // Primitive shader (no texture)
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
