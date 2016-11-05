/**
 * An animation template handles a single Animation in an Animation Set (ex. Player.Run)
 */
declare class AnimationTemplate {
    /**
     * The name of the Animation
     */
    name: string;
    /**
     * The Speed the animation runs (frame index += speed * delta)
     */
    speed: number;
    /**
     * The frames of this animation
     */
    frames: Texture[];
    /**
     * The origin to render with
     */
    origin: Vector;
    /**
     * The position to render at
     */
    position: Vector;
    /**
     * If this animation should loop
     */
    loops: boolean;
    /**
     * What animation(s) the Sprite should go to next upon completion
     */
    goto: string[];
    constructor(name: string, speed: number, frames: Texture[], loops?: boolean, position?: Vector, origin?: Vector);
}
/**
 * Animation Set holds a list of Animation Templates, referenced by name
 */
declare class AnimationSet {
    /**
     * The animation set name
     */
    name: string;
    /**
     * A list of all the animation template, by their name
     */
    animations: {
        [name: string]: AnimationTemplate;
    };
    /**
     * First animation template
     */
    first: AnimationTemplate;
    constructor(name: string);
    /**
     * Adds a new Animation Template to this set
     */
    add(name: string, speed: number, frames: Texture[], loops: boolean, position?: Vector, origin?: Vector): AnimationSet;
    /**
     * Adds a new frame-based Animation Template to this set
     */
    addFrameAnimation(name: string, speed: number, tex: Texture, frameWidth: number, frameHeight: number, frames: number[], loops: boolean, position?: Vector, origin?: Vector): AnimationSet;
    /**
     * Gets an animation template by its name
     */
    get(name: string): AnimationTemplate;
    /**
     * Checks if an animation template exists by the given name
     */
    has(name: string): boolean;
}
/**
 * Animation Bank holds all the Animations in the game
 */
declare class AnimationBank {
    /**
     * Reference to all the Animations
     */
    static bank: {
        [name: string]: AnimationSet;
    };
    /**
     * Creates a new Animation Set of the given Name
     */
    static create(name: string): AnimationSet;
    /**
     * Gets an Animation of the given name
     */
    static get(name: string): AnimationSet;
    /**
     * Checks if an animation with the given name exists
     */
    static has(name: string): boolean;
}
/**
 * Loads a set of assets
 */
declare class AssetLoader {
    /**
     * The root directory to load from
     */
    root: string;
    /**
     * If the Asset Loader is loading
     */
    readonly loading: boolean;
    private _loading;
    /**
     * If the Asset Loader has finished loading
     */
    readonly loaded: boolean;
    _loaded: boolean;
    /**
     * Called when the Asset Loader has finished loading
     */
    callback: () => void;
    /**
     * The Percentage towards being finished loading
     */
    readonly percent: number;
    private assets;
    private assetsLoaded;
    private textures;
    private jsons;
    private xmls;
    private sounds;
    private atlases;
    private texts;
    constructor(root?: string);
    /**
     * Adds the Texture to the loader
     */
    addTexture(path: string): AssetLoader;
    /**
     * Adds the JSON to the loader
     */
    addJson(path: string): AssetLoader;
    /**
     * Adds the XML to the loader
     */
    addXml(path: string): AssetLoader;
    /**
     * Adds the text to the loader
     */
    addText(path: string): AssetLoader;
    /**
     * Adds the sound to the loader
     */
    addSound(handle: string, path: string): AssetLoader;
    /**
     * Adds the atlas to the loader
     */
    addAtlas(name: string, image: string, data: string, loader: AtlasReader): AssetLoader;
    /**
     * Begins loading all the assets and invokes Callback upon completion
     */
    load(callback?: () => void): void;
    /**
     * Unloads all the Assets that this Asset Loader loaded
     */
    unload(): void;
    private loadTexture(path, callback?);
    private loadJson(path, callback?);
    private loadXml(path, callback?);
    private loadText(path, callback?);
    private loadSound(handle, path, callback?);
    private loadAtlas(data);
    private incrementLoader();
    private pathify(path);
}
/**
 * A static reference to all the Assets currently loaded in the game
 */
declare class Assets {
    static textures: {
        [path: string]: Texture;
    };
    static json: {
        [path: string]: Object;
    };
    static xml: {
        [path: string]: Object;
    };
    static text: {
        [path: string]: string;
    };
    static sounds: {
        [path: string]: AudioSource;
    };
    static atlases: {
        [path: string]: Atlas;
    };
    /**
     * Unloads all the assets in the entire game
     */
    static unload(): void;
}
declare class AudioGroup {
    private static volumes;
    private static mutes;
    static volume(group: string, value?: number): number;
    static muted(group: string, value?: boolean): boolean;
}
declare class AudioSource {
    static maxInstances: number;
    private path;
    private sounds;
    constructor(path: string, first?: HTMLAudioElement);
    /**
     * Gets a new instance of the sound from cache or file
     */
    requestSound(): HTMLAudioElement;
    /**
     * Returns the sound instance so it can be used again
     */
    returnSound(sound: HTMLAudioElement): void;
    /**
     * Not Implemented
     */
    dispose(): void;
}
declare class Sound {
    static active: Sound[];
    private source;
    private sound;
    private endEvent;
    private loadedEvent;
    private started;
    private groups;
    private fadeFrom;
    private fadeTo;
    private fadePercent;
    private fadeDuration;
    private fadeEase;
    /**
     * Gets if the sound is currently playing
     */
    readonly playing: boolean;
    /**
     * Gets or sets whether the sound is looping
     */
    loop: boolean;
    private _loop;
    /**
     * Gets if the sound is paused
     */
    readonly paused: boolean;
    private _paused;
    /**
     * Gets or sets whether the current sound is muted
     */
    muted: boolean;
    private _muted;
    /**
     * Gets or sets the volume of this sound
     */
    volume: number;
    private _volume;
    /**
     * Creates a new sound of the given handle
     */
    constructor(handle: string, groups?: string[]);
    /**
     * Plays the sound
     */
    play(loop?: boolean): Sound;
    /**
     * Resumes if the sound was paused
     */
    resume(): Sound;
    /**
     * Pauses a sound
     */
    pause(): Sound;
    /**
     * Completely stops a sound
     */
    stop(): Sound;
    group(group: string): Sound;
    ungroup(group: string): Sound;
    ungroupAll(): Sound;
    ingroup(group: string): boolean;
    private internalPlay();
    private internalUpdateVolume();
    private internalUpdateMuted();
    update(): void;
    fade(volume: number, duration: number, ease?: (n: number) => number): Sound;
}
interface AtlasReader {
    (data: any, into: Atlas): void;
}
/**
 * A single Texture which contains subtextures by name
 */
declare class Atlas {
    /**
     * Name of the Atlas
     */
    name: string;
    /**
     * Reference to the atlas texture
     */
    texture: Texture;
    /**
     * Raw Atlas Data, in whatever format the atlas was loaded in
     */
    data: Object;
    /**
     * The Atlas Data Reader (a method parses the raw data and creates the subtextures)
     */
    reader: AtlasReader;
    /**
     * Dictionary of the Subtextures within this atlas
     */
    subtextures: {
        [path: string]: Texture;
    };
    constructor(name: string, texture: Texture, data: Object, reader: AtlasReader);
    /**
     * Gets a specific subtexture from the atlas
     * @param name 	the name/path of the subtexture
     */
    get(name: string): Texture;
    /**
     * Checks if a subtexture exists
     * @param name 	the name/path of the subtexture
     */
    has(name: string): boolean;
    /**
     * Gets a list of textures
     */
    list(prefix: string, names: string[]): Texture[];
    /**
     * Finds all subtextures with the given prefix
     */
    find(prefix: string): Texture[];
}
declare class AtlasReaders {
    /**
     * Parses Aseprite data from the atlas
     */
    static Aseprite(data: any, into: Atlas): void;
}
/**
 * Internal Texture used for Foster during Rendering
 */
declare class FosterWebGLTexture {
    path: string;
    webGLTexture: WebGLTexture;
    width: number;
    height: number;
    disposed: boolean;
    constructor(texture: WebGLTexture, width: number, height: number);
    dispose(): void;
}
/**
 * The Render Target is used for rendering graphics to
 */
declare class RenderTarget {
    /**
     * its texture to draw to
     */
    texture: FosterWebGLTexture;
    /**
     * its frame buffer
     */
    frameBuffer: WebGLFramebuffer;
    /**
     * its Vertex buffer
     */
    vertexBuffer: WebGLBuffer;
    /**
     * its Texture Coordinate buffer
     */
    texcoordBuffer: WebGLBuffer;
    /**
     * its Color UV buffer
     */
    colorBuffer: WebGLBuffer;
    /**
     * The width of the Render Target
     */
    readonly width: number;
    /**
     * The height of the Render Target
     */
    readonly height: number;
    /**
     * Creates a new Render Target. use RenderTarget.create() for quick access
     */
    constructor(buffer: WebGLFramebuffer, texture: FosterWebGLTexture, vertexBuffer: WebGLBuffer, colorBuffer: WebGLBuffer, texcoordBuffer: WebGLBuffer);
    /**
     * Disposes the Render Target and all its textures and buffers
     */
    dispose(): void;
    /**
     * Creates a new Render Target of the given width and height
     */
    static create(width: number, height: number): RenderTarget;
}
/**
 * A Texture used for Rendering
 */
declare class Texture {
    /**
     * The cropped Bounds of the Texture within its WebGL Texture
     */
    bounds: Rectangle;
    /**
     * The Frame adds padding around the existing Bounds when rendered
     */
    frame: Rectangle;
    /**
     * A reference to the full WebGL Texture
     */
    texture: FosterWebGLTexture;
    /**
     * The center point of this texture
     */
    center: Vector;
    /**
     * The width of the Texture when rendered (frame.width)
     */
    readonly width: number;
    /**
     * The height of the Texture when rendered (frame.height)
     */
    readonly height: number;
    /**
     * The clipped width of the Texture (bounds.width)
     */
    readonly clippedWidth: number;
    /**
     * The clipped height of the Texture (bounds.height)
     */
    readonly clippedHeight: number;
    /**
     * Creates a new Texture from the WebGL Texture
     */
    constructor(texture: FosterWebGLTexture, bounds?: Rectangle, frame?: Rectangle);
    /**
     * Creates a Subtexture from this texture
     */
    getSubtexture(clip: Rectangle, sub?: Texture): Texture;
    /**
     * Creates a clone of this texture
     */
    clone(): Texture;
    toString(): string;
    /**
     * Draws this texture
     */
    draw(position: Vector, origin?: Vector, scale?: Vector, rotation?: number, color?: Color, flipX?: boolean, flipY?: boolean): void;
    /**
     * Draws a cropped version of this texture
     */
    drawCropped(position: Vector, crop: Rectangle, origin?: Vector, scale?: Vector, rotation?: number, color?: Color, flipX?: boolean, flipY?: boolean): void;
    /**
     * Draws this texture, center aligned
     */
    drawCenter(position: Vector, scale?: Vector, rotation?: number, color?: Color, flipX?: boolean, flipY?: boolean): void;
    /**
     * Draws a cropped version of this texture, center aligned
     */
    drawCenterCropped(position: Vector, crop: Rectangle, scale?: Vector, rotation?: number, color?: Color, flipX?: boolean, flipY?: boolean): void;
    /**
     * Draws this texture, justified
     */
    drawJustify(position: Vector, justify: Vector, scale?: Vector, rotation?: number, color?: Color, flipX?: boolean, flipY?: boolean): void;
    /**
     * Draws a cropped version of this texture, justified
     */
    drawJustifyCropped(position: Vector, crop: Rectangle, justify: Vector, scale?: Vector, rotation?: number, color?: Color, flipX?: boolean, flipY?: boolean): void;
    /**
     * Disposes this texture and its WebGL Texture
     */
    dispose(): void;
    /**
     * Creats a new Texture from an HTML Image Element
     */
    static create(image: HTMLImageElement): Texture;
    /**
     * Creates a new Texture from the given RGBA array
     */
    static createFromData(data: number[], width: number, height: number): Texture;
}
declare abstract class Component {
    /**
     * The Entity this Component is a child of
     */
    entity: Entity;
    private _entity;
    /**
     * The Scene containing this Component
     */
    scene: Scene;
    private _scene;
    /**
     * Whether this Component should be updated
     */
    active: boolean;
    /**
     * Whether this Component should be rendered
     */
    visible: boolean;
    /**
     * The Local position of the Component, relative to the Entity
     */
    position: Vector;
    /**
     * The Local X position of the Component, relative to the Entity
     */
    x: number;
    /**
     * The Local Y position of the Component, relative to the Entity
     */
    y: number;
    /**
     * The position of the Component in the Scene (position + Entity.position)
     */
    readonly scenePosition: Vector;
    /**
     * Called when the Component was Added to the Entity
     */
    addedToEntity(): void;
    /**
     * Called when the Component was Added to the Scene
     */
    addedToScene(): void;
    /**
     * Called when the Component was Removed from the Entity
     */
    removedFromEntity(): void;
    /**
     * Called when the Component was Removed from the Scene
     */
    removedFromScene(): void;
    /**
     * Called when the Component is Updated from its Entity
     */
    update(): void;
    /**
     * Called when the component is Rendered from its Entity
     */
    render(camera?: Camera): void;
    /**
     * Called when the Engine is in Debug mode, at the end of the Scene Render from its Entity
     */
    debugRender(camera?: Camera): void;
}
declare class Alarm extends Component {
    /**
     * Gets the current Percent of the Alarm
     */
    readonly percent: number;
    private _percent;
    /**
     * Gets the current Duration of the Alarm
     */
    readonly duration: number;
    private _duration;
    /**
     * Called when the Alarm is finished
     */
    callback: (Alarm) => void;
    /**
     * If the Alarm should be removed from the Entity upon completion
     */
    removeOnComplete: boolean;
    constructor();
    /**
     * Starts the Alarm
     */
    start(duration: number, callback: (Alarm) => void): Alarm;
    /**
     * Restarts the Alarm
     */
    restart(): Alarm;
    /**
     * Resumes the Alarm if it was paused
     */
    resume(): Alarm;
    /**
     * Pauses the Alarm if it was active
     */
    pause(): Alarm;
    /**
     * Updates the Alarm (automatically called during its Entity's update)
     */
    update(): void;
    /**
     * Creates and adds a new Alarm on the given Entity
     */
    static create(on: Entity): Alarm;
}
declare abstract class Collider extends Component {
    tags: string[];
    tag(tag: string): void;
    untag(tag: string): void;
    check(tag: string, x?: number, y?: number): boolean;
    checks(tags: string[], x?: number, y?: number): boolean;
    collide(tag: string, x: number, y: number): Collider;
    collides(tags: string[], x?: number, y?: number): Collider;
    collideAll(tag: string, x?: number, y?: number): Collider[];
    static overlap(a: Collider, b: Collider): boolean;
    static overlap_hitbox_hitbox(a: Hitbox, b: Hitbox): boolean;
    static overlap_hitbox_grid(a: Hitbox, b: Hitgrid): boolean;
}
declare class Hitbox extends Collider {
    left: number;
    top: number;
    width: number;
    height: number;
    readonly sceneLeft: number;
    readonly sceneRight: number;
    readonly sceneTop: number;
    readonly sceneBottom: number;
    readonly sceneBounds: Rectangle;
    constructor(left: number, top: number, width: number, height: number, tags?: string[]);
    debugRender(): void;
}
declare class Hitgrid extends Collider {
    tileWidth: number;
    tileHeight: number;
    private map;
    constructor(tileWidth: number, tileHeight: number, tags?: string[]);
    set(solid: boolean, tx: number, ty: number, columns?: number, rows?: number): void;
    has(tx: number, ty: number, columns?: number, rows?: number): boolean;
    private debugSub;
    debugRender(camera: Camera): void;
}
/**
 * Coroutine Class. This uses generator functions which are only supported in ES6 and is missing in many browsers.
 * More information: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/function*
 */
declare class Coroutine extends Component {
    private wait;
    private iterator;
    /**
     * @param call? 	if set, immediately starts he Coroutine with the given Iterator
     */
    constructor(call?: () => Iterator<any>);
    /**
     * Starts the Coroutine with the given Iterator
     */
    start(call: () => Iterator<any>): Coroutine;
    /**
     * Resumes the current Coroutine (sets this.active to true)
     */
    resume(): Coroutine;
    /**
     * Pauses the current Coroutine (sets this.active to false)
     */
    pause(): Coroutine;
    /**
     * Stops the Coroutine, and sets the current Iterator to null
     */
    stop(): Coroutine;
    /**
     * Updates the Coroutine (automatically called its Entity's update)
     */
    update(): void;
    /**
     * Steps the Coroutine through the Iterator once
     */
    step(): void;
    /**
     * Calls Coroutine.stop and will optionally remove itself from the Entity
     */
    end(remove: boolean): void;
}
declare class Particle {
    x: number;
    y: number;
    percent: number;
    duration: number;
    colorFrom: Color;
    colorTo: Color;
    scaleFromX: number;
    scaleToX: number;
    scaleFromY: number;
    scaleToY: number;
    rotationFrom: number;
    rotationTo: number;
    alphaFrom: number;
    alphaTo: number;
    speedX: number;
    speedY: number;
    accelX: number;
    accelY: number;
    frictionX: number;
    frictionY: number;
}
declare class Color {
    private color;
    r: number;
    g: number;
    b: number;
    a: number;
    readonly rgba: number[];
    constructor(r?: number, g?: number, b?: number, a?: number);
    set(r: number, g: number, b: number, a: number): Color;
    copy(color: Color): Color;
    lerp(a: Color, b: Color, p: number): Color;
    clone(): Color;
    mult(alpha: number): Color;
    static white: Color;
    static black: Color;
    static red: Color;
    static green: Color;
    static blue: Color;
    static temp: Color;
}
declare class Vector {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): Vector;
    copy(v: Vector): Vector;
    add(v: Vector): Vector;
    sub(v: Vector): Vector;
    mult(v: Vector): Vector;
    div(v: Vector): Vector;
    scale(s: number): Vector;
    rotate(sin: number, cos: number): Vector;
    transform(m: Matrix): Vector;
    clone(): Vector;
    readonly length: number;
    readonly normal: Vector;
    normalize(): Vector;
    static directions: Vector[];
    static temp0: Vector;
    static temp1: Vector;
    static temp2: Vector;
    private static _zero;
    static readonly zero: Vector;
}
declare class ParticleSystem extends Component {
    template: ParticleTemplate;
    renderRelativeToEntity: boolean;
    private particles;
    private static cache;
    private static color;
    private static origin;
    private static scale;
    constructor(template: string);
    update(): void;
    render(camera: Camera): void;
    burst(x: number, y: number, direction: number, rangeX?: number, rangeY?: number, count?: number): void;
}
declare class ParticleTemplate {
    static templates: {
        [name: string]: ParticleTemplate;
    };
    name: string;
    speedBase: number;
    speedRange: number;
    accelBaseX: number;
    accelRangeX: number;
    accelBaseY: number;
    accelRangeY: number;
    frictionBaseX: number;
    frictionRangeX: number;
    frictionBaseY: number;
    frictionRangeY: number;
    colorsFrom: Color[];
    colorsTo: Color[];
    colorEaser: (number) => number;
    alphaFromBase: number;
    alphaFromRange: number;
    alphaToBase: number;
    alphaToRange: number;
    alphaEaser: (number) => number;
    rotationFromBase: number;
    rotationFromRange: number;
    rotationToBase: number;
    rotationToRange: number;
    rotationEaser: (number) => number;
    scaleFromBaseX: number;
    scaleFromRangeX: number;
    scaleToBaseX: number;
    scaleToRangeX: number;
    scaleXEaser: (number) => number;
    scaleFromBaseY: number;
    scaleFromRangeY: number;
    scaleToBaseY: number;
    scaleToRangeY: number;
    scaleYEaser: (number) => number;
    durationBase: number;
    durationRange: number;
    constructor(name: string);
    speed(Base: number, Range?: number): ParticleTemplate;
    accelX(Base: number, Range?: number): ParticleTemplate;
    accelY(Base: number, Range?: number): ParticleTemplate;
    frictionX(Base: number, Range?: number): ParticleTemplate;
    frictionY(Base: number, Range?: number): ParticleTemplate;
    colors(from: Color[], to?: Color[]): ParticleTemplate;
    colorEase(easer: (number) => number): ParticleTemplate;
    alpha(Base: number, Range?: number): ParticleTemplate;
    alphaFrom(Base: number, Range?: number): ParticleTemplate;
    alphaTo(Base: number, Range?: number): ParticleTemplate;
    alphaEase(easer: (number) => number): ParticleTemplate;
    rotation(Base: number, Range?: number): ParticleTemplate;
    rotationFrom(Base: number, Range?: number): ParticleTemplate;
    rotationTo(Base: number, Range?: number): ParticleTemplate;
    rotationEase(easer: (number) => number): ParticleTemplate;
    scale(Base: number, Range?: number): ParticleTemplate;
    scaleFrom(Base: number, Range?: number): ParticleTemplate;
    scaleTo(Base: number, Range?: number): ParticleTemplate;
    scaleEase(easer: (number) => number): ParticleTemplate;
    scaleX(Base: number, Range?: number): ParticleTemplate;
    scaleFromX(Base: number, Range?: number): ParticleTemplate;
    scaleToX(Base: number, Range?: number): ParticleTemplate;
    scaleY(Base: number, Range?: number): ParticleTemplate;
    scaleXEase(easer: (number) => number): ParticleTemplate;
    scaleFromY(Base: number, Range?: number): ParticleTemplate;
    scaleToY(Base: number, Range?: number): ParticleTemplate;
    scaleYEase(easer: (number) => number): ParticleTemplate;
    duration(Base: number, Range?: number): ParticleTemplate;
}
declare class Physics extends Hitbox {
    solids: string[];
    onCollideX: (hit: Collider) => void;
    onCollideY: (hit: Collider) => void;
    speed: Vector;
    private remainder;
    constructor(left: number, top: number, width: number, height: number, tags?: string[], solids?: string[]);
    update(): void;
    move(x: number, y: number): boolean;
    moveX(amount: number): boolean;
    moveXAbsolute(amount: number): boolean;
    moveY(amount: number): boolean;
    moveYAbsolute(amount: number): boolean;
    friction(fx: number, fy: number): Physics;
    maxspeed(mx?: number, my?: number): Physics;
    circularMaxspeed(length: number): Physics;
    stop(): void;
}
declare class Graphic extends Component {
    texture: Texture;
    crop: Rectangle;
    scale: Vector;
    origin: Vector;
    rotation: number;
    flipX: boolean;
    flipY: boolean;
    color: Color;
    alpha: number;
    readonly width: number;
    readonly height: number;
    constructor(texture: Texture, position?: Vector);
    center(): void;
    justify(x: number, y: number): void;
    render(camera: Camera): void;
}
declare class Rectsprite extends Component {
    size: Vector;
    scale: Vector;
    origin: Vector;
    rotation: number;
    color: Color;
    alpha: number;
    width: number;
    height: number;
    constructor(width: number, height: number, color?: Color);
    render(): void;
}
declare class Sprite extends Graphic {
    private _animation;
    private _playing;
    private _frame;
    readonly animation: AnimationSet;
    readonly playing: AnimationTemplate;
    readonly frame: number;
    rate: number;
    constructor(animation: string);
    play(name: string, restart?: boolean): void;
    has(name: string): boolean;
    update(): void;
    render(camera: Camera): void;
}
declare class Tilemap extends Component {
    texture: Texture;
    tileWidth: number;
    tileHeight: number;
    color: Color;
    alpha: number;
    private map;
    private tileColumns;
    private crop;
    constructor(texture: Texture, tileWidth: number, tileHeight: number);
    set(tileX: number, tileY: number, mapX: number, mapY: number, mapWidth?: number, mapHeight?: number): Tilemap;
    clear(mapX: number, mapY: number, mapWidth?: number, mapHeight?: number): Tilemap;
    has(mapX: number, mapY: number): boolean;
    get(mapX: number, mapY: number): Vector;
    render(camera: Camera): void;
}
declare class Tween extends Component {
    /**
     * Gets the current Percent of the Tween
     */
    readonly percent: number;
    private _percent;
    /**
     * Gets the current Duration of the Tween
     */
    readonly duration: number;
    private _duration;
    /**
     * The value of the Tween at the current Percent
     */
    readonly value: number;
    /**
     * From value of the Tween (when percent is 0)
     */
    from: number;
    /**
     * To value of the Tween (when percent is 1)
     */
    to: number;
    /**
     * Easer function (ex. Linear would be (p) => { return p; })
     * Alternatively, use the static Ease methods
     */
    ease: (number) => number;
    /**
     * Callback when the Tween is updated, returning the current Value
     */
    step: (number) => void;
    /**
     * If the Tween should be removed upon completion
     */
    removeOnComplete: boolean;
    constructor();
    /**
     * Initializes the Tween and begins running
     */
    start(duration: number, from: number, to: number, ease: (number) => number, step: (number) => void, removeOnComplete?: boolean): Tween;
    /**
     * Restarts the current Tween
     */
    restart(): Tween;
    /**
     * Resumes the current tween if it was paused
     */
    resume(): Tween;
    /**
     * Pauses the current tween if it was active
     */
    pause(): Tween;
    /**
     * Upates the tween (automatically called when its Entity is updated)
     */
    update(): void;
    /**
     * Creates a new tween on an existing entity
     */
    static create(on: Entity): Tween;
}
/**
 * Current game Client
 */
declare enum Client {
    /**
     * Running on the desktop (in Electron)
     */
    Desktop = 0,
    /**
     * Running on the Web
     */
    Web = 1,
}
/**
 * Core of the Foster Engine. Initializes and Runs the game.
 */
declare class Engine {
    /**
     * Foster Engine version
     */
    static version: string;
    /**
     * The root HTML event that the game Canvas is created in (for the actual Canvas element, see Engine.graphics.screen)
     */
    static readonly root: HTMLElement;
    /**
     * Current Client (Client.Desktop if in Electron and Client.Web if in the browser)
     */
    static readonly client: Client;
    /**
     * Gets the current game Scene
     */
    static readonly scene: Scene;
    /**
     * Gets the Game Width, before being scaled up / down to fit in the screen
     */
    static readonly width: number;
    /**
     * Gets the Game Height, before being scaled up / down to fit in the screen
     */
    static readonly height: number;
    /**
     * Toggles Debug Mode, which shows hitboxes and allows entities to be dragged around
     */
    static debugMode: boolean;
    /**
     * Delta Time (time, in seconds, since the last frame)
     */
    static readonly delta: number;
    /**
     * Total elapsed game time (time, in seconds, since the Engine was started)
     */
    static readonly elapsed: number;
    /**
     * Gets the current Engine graphics (used for all rendering)
     */
    static readonly graphics: Graphics;
    /**
     * Gets or sets the global sound volume multiplier
     */
    static volume: number;
    private static _volume;
    /**
     * Mutes or Unmutes the entire game
     */
    static muted: boolean;
    private static _muted;
    /**
     * Starts up the Game Engine
     * @param title 	Window Title
     * @param width 	Game Width
     * @param height 	Game Height
     * @param scale 	Scales the Window (on Desktop) to width * scale and height * scale
     * @param ready 	Callback when the Engine is ready
     */
    static start(title: string, width: number, height: number, scale: number, ready: () => void): void;
    /**
     * Goes to a new Scene
     * @param scene 	The Scene to go to
     * @param disposeLastScene 	If the last scene should be disposed
     */
    static goto(scene: Scene, disposeLastScene: boolean): Scene;
    /**
     * Ends the Game
     */
    static exit(): void;
    /**
     * Resizes the game to the given size
     * @param width 	new Game Width
     * @param height 	new Game Height
     */
    static resize(width: number, height: number): void;
    /**
     * Checks that the given value is true, otherwise throws an error
     */
    static assert(value: boolean, message: string): boolean;
    private static instance;
    private static started;
    private static exiting;
    private client;
    private scene;
    private nextScene;
    private disposeLastScene;
    private width;
    private height;
    private dt;
    private elapsed;
    private startTime;
    private lastTime;
    private root;
    private graphics;
    private debuggerEnabled;
    constructor();
    private step();
    private exit();
}
declare class Entity {
    /**
     * Position of the Entity in the Scene
     */
    position: Vector;
    /**
     * X position of the Entity in the Scene
     */
    x: number;
    /**
     * Y position of the Entity in the Scene
     */
    y: number;
    /**
     * If the Entity is visible. If false, Entity.render is not called
     */
    visible: boolean;
    /**
     * If the Entity is active. If false, Entity.update is not called
     */
    active: boolean;
    /**
     * If the Entity has been created yet (has it ever been added to a scene)
     */
    isCreated: boolean;
    /**
     * If the Entity has been started yet (has it been updated in the current scene)
     */
    isStarted: boolean;
    /**
     * The current scene that the Entity is in
     */
    scene: Scene;
    /**
     * List of all Entity components
     */
    components: Component[];
    /**
     * List of all Groups the Entity is in
     */
    groups: string[];
    _depth: number;
    _nextDepth: number;
    /**
     * The Render-Depth of the Entity (lower = rendered later)
     */
    depth: number;
    constructor();
    /**
     * Called the first time the entity is added to a scene (after constructor, before added)
     */
    created(): void;
    /**
     * Called immediately whenever the entity is added to a Scene (after created, before started)
     */
    added(): void;
    /**
     * Called before the first update of the Entity (after added)
     */
    started(): void;
    /**
     * Called immediately whenever the entity is removed from a Scene
     */
    removed(): void;
    /**
     * Called immediately whenever the entity is recycled in a Scene
     */
    recycled(): void;
    /**
     * Called when an entity is permanently destroyed
     */
    destroyed(): void;
    /**
     * Called every game-step, if this entity is in a Scene and Active
     */
    update(): void;
    /**
     * Called via a Renderer, if Visible
     */
    render(camera: Camera): void;
    /**
     * Called via the Debug Renderer
     */
    debugRender(camera: Camera): void;
    /**
     * Adds a Component to this Entity
     */
    add(component: Component): void;
    /**
     * Removes a Components from this Entity
     */
    remove(component: Component): void;
    /**
     * Removes all Components from this Entity
     */
    removeAll(): void;
    /**
     * Finds the first component in this Entity of the given Class
     */
    find<T extends Component>(className: Function): T;
    /**
     * Finds all components in this Entity of the given Class
     */
    findAll<T extends Component>(className: Function): T[];
    /**
     * Groups this entity into the given Group
     */
    group(groupType: string): void;
    /**
     * Removes this Entity from the given Group
     */
    ungroup(groupType: string): void;
    /**
     * Checks if this Entity is in the given Group
     */
    ingroup(groupType: string): boolean;
}
/**
 * Handels the Game Window and the differences between Browser / Desktop mode
 */
declare class GameWindow {
    private static browserWindow;
    private static titleName;
    private static screen;
    constructor();
    /**
     * Gets or Sets the Window Title
     */
    static title: string;
    /**
     * Toggles Fullscreen Mode if running on the Desktop
     */
    static fullscreen: boolean;
    /**
     * Returns the left position of the screen
     */
    static readonly screenLeft: number;
    /**
     * Returns the Top position of the screen
     */
    static readonly screenTop: number;
    /**
     * Returns the Width of the screen
     */
    static readonly screenWidth: number;
    /**
     * Returns the Height of the screen
     */
    static readonly screenHeight: number;
    /**
     * Resizes the Window if running in Desktop mode
     */
    static resize(width: number, height: number): void;
    /**
     * Centers the Window if running in Desktop mode
     */
    static center(): void;
    /**
     * Toggles Developer tools if running in Desktop mode
     */
    static toggleDevTools(): void;
    /**
     * Gets the absolute mouse position in the screen
     */
    static readonly screenMouse: Vector;
}
declare enum ResolutionStyle {
    /** Renders the buffer at the Center of the Screen with no scaling */
    None = 0,
    /** Renders the buffer to an exact fit of the Screen (stretching) */
    Exact = 1,
    /** Renders the buffer so that it is contained within the Screen */
    Contain = 2,
    /** Renders the buffer so that it is contained within the Screen, rounded to an Integer scale */
    ContainInteger = 3,
    /** Renders the buffer so that it fills the Screen (cropping the buffer) */
    Fill = 4,
    /** Renders the buffer so that it fills the Screen (cropping the buffer), rounded to an Integer scale */
    FillInteger = 5,
}
declare class Graphics {
    private engine;
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    buffer: RenderTarget;
    resolutionStyle: ResolutionStyle;
    borderColor: Color;
    clearColor: Color;
    private vertices;
    private texcoords;
    private colors;
    private currentTarget;
    private vertexBuffer;
    private texcoordBuffer;
    private colorBuffer;
    private currentShader;
    private nextShader;
    shader: Shader;
    orthographic: Matrix;
    private toscreen;
    private _pixel;
    private _pixelUVs;
    private _defaultPixel;
    pixel: Texture;
    drawCalls: number;
    /**
     * Creates the Engine.Graphics
     */
    constructor(engine: Engine);
    /**
     * Initial load of Graphics and WebGL components
     */
    load(): void;
    /**
     * Unloads the Graphics and WebGL stuff
     */
    unload(): void;
    /**
     * Called when the Game resolution changes
     */
    resize(): void;
    /**
     * Updates the Graphics
     */
    update(): void;
    /**
     * Gets the rectangle that the game buffer should be drawn to the screen with
     */
    getOutputBounds(): Rectangle;
    /**
     * Clears the screen
     */
    clear(color: Color): void;
    /**
     * Resets the Graphics rendering
     */
    reset(): void;
    /**
     * Sets the current Render Target
     */
    setRenderTarget(target: RenderTarget): void;
    /**
     * Sets the current texture on the shader (if the shader has a sampler2d uniform)
     */
    setShaderTexture(tex: Texture): void;
    /**
     * Checks if the shader was modified, and if so, flushes the current vertices & starts a new draw
     */
    checkState(): void;
    /**
     * Flushes the current vertices to the screen
     */
    flush(): void;
    /**
     * Draws the game to the Screen and does cleanup
     */
    finalize(): void;
    /**
     * Pushes vertices to the screen. If the shader has been modified, this will end and start a new draw call
     * @param x 	X position of the vertex
     * @param y		Y position of the vertex
     * @param u		X position in the texture (u) (only used in shaders with sampler2d)
     * @param v		Y position in the texture (v) (only used in shaders with sampler2d)
     * @param color optional color for the vertex
     */
    push(x: number, y: number, u: number, v: number, color?: Color): void;
    /**
     * Same as Graphics.push, but this method assumes the shader was NOT modified. Don't use this unless you know what you're doing
     * @param x 	X position of the vertex
     * @param y		Y position of the vertex
     * @param u		X position in the texture (u) (only used in shaders with sampler2d)
     * @param v		Y position in the texture (v) (only used in shaders with sampler2d)
     * @param color optional color for the vertex
     */
    pushUnsafe(x: number, y: number, u: number, v: number, color?: Color): void;
    /**
     * Pushes a list of vertices to the screen. If the shader has been modified, this will end and start a new draw call
     */
    pushList(pos: Vector[], uv: Vector[], color: Color[]): void;
    private topleft;
    private topright;
    private botleft;
    private botright;
    private texToDraw;
    /**
     * Draws a texture at the given position. If the current Shader does not take a texture, this will throw an error.
     */
    texture(tex: Texture, posX: number, posY: number, crop?: Rectangle, color?: Color, origin?: Vector, scale?: Vector, rotation?: number, flipX?: boolean, flipY?: boolean): void;
    quad(posX: number, posY: number, width: number, height: number, color?: Color, origin?: Vector, scale?: Vector, rotation?: number): void;
    /**
     * Draws a rectangle. If the current shader has a Sampler2D it uses the Graphics.Pixel texture
     */
    rect(x: number, y: number, width: number, height: number, color: Color): void;
    /**
     * Draws a triangle. If the current shader has a Sampler2D it uses the Graphics.Pixel texture
     */
    triangle(a: Vector, b: Vector, c: Vector, colA: Color, colB?: Color, colC?: Color): void;
    /**
     * Draws a circle. If the current shader has a Sampler2D it uses the Graphics.Pixel texture
     */
    circle(pos: Vector, rad: number, steps: number, colorA: Color, colorB?: Color): void;
    hollowRect(x: number, y: number, width: number, height: number, stroke: number, color: Color): void;
}
declare class GamepadManager {
    static defaultDeadzone: number;
    private static controllers;
    static init(): void;
    static onAddController(event: any): void;
    private static onRemoveController(event);
    static getController(index: number): ControllerInput;
    static numControllers(): number;
    static setRemoveControllerBehavior(handler: any): void;
}
declare class ControllerInput extends Component {
    gamepad: Gamepad;
    private deadzone;
    private leftStick;
    private rightStick;
    private buttons;
    constructor(pad: Gamepad, deadzone?: number);
    update(): void;
    getButton(index: number): ButtonState;
    getLeftStick(): Vector;
    getRightStick(): Vector;
    getRawLeftStick(): Vector;
    getRawRightStick(): Vector;
    private queryGamepad();
}
declare class ButtonState {
    private _last;
    private _next;
    constructor();
    update(val: boolean): void;
    down(): boolean;
    pressed(): boolean;
    released(): boolean;
}
declare class Keys {
    private static _down;
    private static _last;
    private static _next;
    private static _map;
    static init(): void;
    static update(): void;
    static down(key: Key): boolean;
    static pressed(key: Key): boolean;
    static released(key: Key): boolean;
    static map(name: string, keys: Key[]): void;
    static maps(list: {
        [name: string]: Key[];
    }): void;
    static mapDown(key: string): boolean;
    static mapPressed(key: string): boolean;
    static mapReleased(key: string): boolean;
}
declare enum Key {
    backspace = 8,
    tab = 9,
    enter = 13,
    shift = 16,
    ctrl = 17,
    alt = 18,
    pause = 19,
    capslock = 20,
    escape = 27,
    space = 32,
    pageUp = 33,
    pageDown = 34,
    end = 35,
    home = 36,
    left = 37,
    up = 38,
    right = 39,
    down = 40,
    insert = 45,
    del = 46,
    zero = 48,
    one = 49,
    two = 50,
    three = 51,
    four = 52,
    five = 53,
    six = 54,
    seven = 55,
    eight = 56,
    nine = 57,
    a = 65,
    b = 66,
    c = 67,
    d = 68,
    e = 69,
    f = 70,
    g = 71,
    h = 72,
    i = 73,
    j = 74,
    k = 75,
    l = 76,
    m = 77,
    n = 78,
    o = 79,
    p = 80,
    q = 81,
    r = 82,
    s = 83,
    t = 84,
    u = 85,
    v = 86,
    w = 87,
    x = 88,
    y = 89,
    z = 90,
    leftWindow = 91,
    rightWindow = 92,
    select = 93,
    numpad0 = 96,
    numpad1 = 97,
    numpad2 = 98,
    numpad3 = 99,
    numpad4 = 100,
    numpad5 = 101,
    numpad6 = 102,
    numpad7 = 103,
    numpad8 = 104,
    numpad9 = 105,
    multiply = 106,
    add = 107,
    subtract = 109,
    decimal = 110,
    divide = 111,
    f1 = 112,
    f2 = 113,
    f3 = 114,
    f4 = 115,
    f5 = 116,
    f6 = 117,
    f7 = 118,
    f8 = 119,
    f9 = 120,
    f10 = 121,
    f11 = 122,
    f12 = 123,
    numlock = 144,
    scrollLock = 145,
    semicolon = 186,
    equal = 187,
    comma = 188,
    dash = 189,
    period = 190,
    forwardSlash = 191,
    graveAccent = 192,
    openBracket = 219,
    backSlash = 220,
    closeBraket = 221,
    singleQuote = 222,
}
declare class Mouse {
    private static _left;
    private static _leftWas;
    private static _leftNext;
    private static _right;
    private static _rightWas;
    private static _rightNext;
    private static _position;
    private static _positionNext;
    static readonly x: number;
    static readonly y: number;
    static readonly position: Vector;
    static absolute: Vector;
    static readonly left: boolean;
    static readonly leftPressed: boolean;
    static readonly leftReleased: boolean;
    static readonly right: boolean;
    static readonly rightPressed: boolean;
    static readonly rightReleased: boolean;
    static init(): void;
    static update(): void;
    private static setNextMouseTo(pageX, pageY);
}
/**
 * Used by the Scene to render. A Scene can have multiple renderers that essentially act as separate layers / draw calls
 */
declare abstract class Renderer {
    /**
     * If this renderer is visible
     */
    visible: boolean;
    /**
     * Current Render Target. null means it will draw to the screen
     */
    target: RenderTarget;
    /**
     * Clear color when drawing (defaults to transparent)
     */
    clearTargetColor: Color;
    /**
     * The scene we're in
     */
    scene: Scene;
    /**
     * Camera that is applied to the shader during rendering. Falls back to Scene.camera if null
     */
    camera: Camera;
    /**
     * Only draws entities of the given mask, if set (otherwise draws all entities)
     */
    groupsMask: string[];
    /**
     * Current Shader used by the Renderer
     */
    shader: Shader;
    /**
     * Shader Camera Matrix uniform (applies the camera matrix to this when rendering)
     */
    shaderCameraUniformName: string;
    /**
     * Called during Scene.update
     */
    update(): void;
    /**
     * Called before Render
     */
    preRender(): void;
    /**
     * Renders the Renderer. Calls drawBegin and then drawEntities
     */
    render(): void;
    /**
     * Sets up the current render target and shader
     */
    drawBegin(): void;
    /**
     * Draws all the entities
     */
    drawEntities(): void;
    private getActiveCamera();
    /**
     * Called after Render
     */
    postRender(): void;
    /**
     * Called when the Scene is disposed (cleans up our Target, if we have one)
     */
    dispose(): void;
}
/**
 * Uses the Primitive Shader when rendering
 */
declare class PrimitiveRenderer extends Renderer {
    constructor();
}
/**
 * Uses the Texture Shader when rendering
 */
declare class SpriteRenderer extends Renderer {
    constructor();
}
/**
 * The Scene contains a list of Entities and Renderers that in turn handle Gameplay. There can only be one active Scene at a time
 */
declare class Scene {
    /**
     * The Camera in the Scene
     */
    camera: Camera;
    /**
     * A list of all the Entities in the Scene
     */
    entities: Entity[];
    /**
     * A list of all the Renderers in the Scene
     */
    renderers: Renderer[];
    /**
     * List of entities about to be sorted by depth
     */
    sorting: Entity[];
    private colliders;
    private groups;
    private cache;
    constructor();
    /**
     * Called when this Scene begins (after Engine.scene has been set)
     */
    begin(): void;
    /**
     * Called when this Scene ends (Engine.scene is going to a new scene)
     */
    ended(): void;
    /**
     * Disposes this scene
     */
    dispose(): void;
    /**
     * Called every frame and updates the Scene
     */
    update(): void;
    /**
     * Called when the Scene should be rendered, and renders each of its Renderers
     */
    render(): void;
    /**
     * Adds the given Entity to this Scene
     * @param entity 	The Entity to add
     * @param position 	The optional position to add the Entity at
     */
    add(entity: Entity, position?: Vector): Entity;
    /**
     * Recreates and adds an Entity from the cache in the given bucket. If there are no entities cache'd in that bucket, NULL is returned
     * @param bucket	The bucket to pull from
     */
    recreate(bucket: string): Entity;
    /**
     * Recycles an entity into the given bucket & removes it from the Scene
     * @param bucket	The bucket to recycle the entity into
     * @param entity	The entity to recycle & remove
     */
    recycle(bucket: string, entity: Entity): void;
    /**
     * Removes the given Entity from the scene
     * @param entity 	The entity to remove
     */
    remove(entity: Entity): void;
    /**
     * Removes an Entity from Scene.entities at the given index
     * @param index 	The Index to remove at
     */
    removeAt(index: number): void;
    /**
     * Removes every Entity from the Scene
     */
    removeAll(): void;
    /**
     * Destroys the given entity (calls Entity.destroy, sets Entity.instantiated to false)
     * @param entity 	The entity to destroy
     */
    destroy(entity: Entity): void;
    find<T extends Entity>(className: Function): T;
    findAll<T extends Entity>(className: Function): T[];
    firstEntityInGroup(group: string): Entity;
    allEntitiesInGroup(group: string): Entity[];
    allEntitiesInGroups(groups: string[]): Entity[];
    firstColliderInTag(tag: string): Collider;
    allCollidersInTag(tag: string): Collider[];
    addRenderer(renderer: Renderer): Renderer;
    removeRenderer(renderer: Renderer, dispose: boolean): Renderer;
    _insertEntityInto(entity: Entity, list: Entity[], removeFrom: boolean): void;
    _groupEntity(entity: Entity, group: string): void;
    _ungroupEntity(entity: Entity, group: string): void;
    _trackComponent(component: Component): void;
    _untrackComponent(component: Component): void;
    _trackCollider(collider: Collider, tag: string): void;
    _untrackCollider(collider: Collider, tag: string): void;
}
/**
 * Helper class for math related functions
 */
declare class Calc {
    /**
     * Returns the Sign of the number (-1, 0, or 1)
     */
    static sign(n: number): number;
    /**
     * Clamps the value between a min and max value
     */
    static clamp(n: number, min: number, max: number): number;
    /**
     * Approaches N towards the target value by the step, without going past it
     */
    static approach(n: number, target: number, step: number): number;
    /**
     * Returns a random value within the range. If no Maximum is provided, it returns within the range -min to +min
     */
    static range(min: number, max?: number): number;
    /**
     * Chooses a random value from the given list
     */
    static choose<T>(list: T[]): T;
}
/**
 * Camera used to create a Matrix during rendering. Scenes and Renderers may have Cameras
 */
declare class Camera {
    position: Vector;
    origin: Vector;
    scale: Vector;
    rotation: number;
    private _matrix;
    private _internal;
    private _mouse;
    private readonly internal;
    readonly matrix: Matrix;
    readonly mouse: Vector;
    private extentsA;
    private extentsB;
    private extentsC;
    private extentsD;
    private extentsRect;
    private getExtents();
    readonly extents: Rectangle;
}
/**
 * Default Ease methods for Tweening
 */
declare class Ease {
    static linear(t: number): number;
    static quadIn(t: number): number;
    static quadOut(t: number): number;
    static quadInOut(t: number): number;
    static cubeIn(t: number): number;
    static cubeOut(t: number): number;
    static cubeInOut(t: number): number;
    static backIn(t: number): number;
    static backOut(t: number): number;
    static backInOut(t: number): number;
    static expoIn(t: number): number;
    static expoOut(t: number): number;
    static expoInOut(t: number): number;
    static sineIn(t: number): number;
    static sineOut(t: number): number;
    static sineInOut(t: number): number;
    static elasticInOut(t: number): number;
    static arc(t: number, ease: (number) => number): number;
}
/**
 * Handles File IO stuff and the differences between Browser / Desktop mode
 */
declare class FosterIO {
    private static fs;
    private static path;
    static init(): void;
    static read(path: string, callback: (string) => void): void;
    static join(...paths: string[]): string;
}
declare class Matrix {
    mat: Float32Array;
    constructor();
    identity(): Matrix;
    copy(o: Matrix): Matrix;
    set(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
    add(o: Matrix): Matrix;
    sub(o: Matrix): Matrix;
    scaler(s: number): Matrix;
    invert(): Matrix;
    multiply(o: Matrix): Matrix;
    rotate(rad: number): Matrix;
    scale(x: number, y: number): Matrix;
    translate(x: number, y: number): Matrix;
    fromRotation(rad: number): Matrix;
    fromScale(x: number, y: number): Matrix;
    fromTranslation(x: number, y: number): Matrix;
}
declare class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly bottom: number;
    constructor(x?: number, y?: number, w?: number, h?: number);
    set(x: number, y: number, w: number, h: number): Rectangle;
    cropRect(r: Rectangle): Rectangle;
    crop(x: number, y: number, w: number, h: number, ref?: Rectangle): Rectangle;
    clone(): Rectangle;
    copy(from: Rectangle): Rectangle;
}
/**
 * A Foster Shader used for Rendering
 * For Pre-existing shaders, see Shaders.ts
 */
declare class Shader {
    /**
     * The WebGL Shader Program
     */
    program: WebGLProgram;
    /**
     * The Shader Uniforms
     */
    uniforms: ShaderUniform[];
    /**
     * The Shader Attributes
     */
    attributes: ShaderAttribute[];
    /**
     * If this Shader is dirty and must be updated
     */
    dirty: boolean;
    /**
     * A direct reference to the Sampler2D Uniform
     */
    sampler2d: ShaderUniform;
    private uniformsByName;
    /**
     * Creates a new Shader from the given vertex and fragment shader code, with the given uniforms and attributes
     */
    constructor(vertex: string, fragment: string, uniforms: ShaderUniform[], attributes: ShaderAttribute[]);
    /**
     * Sets the Uniform of the given name to the value
     * @param name 	the name of the uniform
     * @param value 	the value to set the uniform to
     */
    set(name: string, value: any): void;
}
/**
 * Shader Uniform Types
 */
declare enum ShaderUniformType {
    float = 0,
    floatArray = 1,
    float2 = 2,
    float2Array = 3,
    float3 = 4,
    float3Array = 5,
    float4 = 6,
    float4Array = 7,
    matrix2d = 8,
    matrix3d = 9,
    matrix4d = 10,
    int = 11,
    intArray = 12,
    int2 = 13,
    int2Array = 14,
    int3 = 15,
    int3Array = 16,
    int4 = 17,
    int4Array = 18,
    sampler2D = 19,
}
/**
 * A Shader Uniform instance
 */
declare class ShaderUniform {
    private _shader;
    private _value;
    name: string;
    type: ShaderUniformType;
    uniform: WebGLUniformLocation;
    dirty: boolean;
    value: any;
    shader: Shader;
    constructor(name: string, type: ShaderUniformType, value?: any);
}
/**
 * Shader Attribute Types
 */
declare enum ShaderAttributeType {
    Position = 0,
    Texcoord = 1,
    Color = 2,
}
/**
 * A Shader Attribute Instance
 */
declare class ShaderAttribute {
    name: string;
    type: ShaderAttributeType;
    attribute: number;
    constructor(name: string, type: ShaderAttributeType);
}
/**
 * Dictionary of Methods to handle setting GL Uniform Values
 */
declare var setGLUniformValue: {
    [type: number]: (gl: WebGLRenderingContext, location: WebGLUniformLocation, value: any) => void;
};
/**
 * Default 2D shaders
 */
declare class Shaders {
    /**
     * A simple Texture Sahder
     */
    static texture: Shader;
    /**
     * A Texture Shader that fills non-transparent pixels with the specific UV color
     */
    static solid: Shader;
    /**
     * Primitive Shader only has Vertices and Colors, no Texture
     */
    static primitive: Shader;
    /**
     * Initializes Default Shaders (called automatically by the Engine)
     */
    static init(): void;
}
