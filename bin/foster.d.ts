declare abstract class Component {
    private _entity;
    entity: Entity;
    private _scene;
    scene: Scene;
    active: boolean;
    visible: boolean;
    position: Vector;
    x: number;
    y: number;
    scenePosition: Vector;
    addedToEntity(): void;
    addedToScene(): void;
    removedFromEntity(): void;
    removedFromScene(): void;
    update(): void;
    render(camera?: Camera): void;
    debugRender(camera?: Camera): void;
}
declare enum Client {
    Desktop = 0,
    Web = 1,
}
declare enum EngineMode {
    Strict = 0,
    Normal = 1,
}
declare class Engine {
    private static instance;
    private static started;
    static root: HTMLElement;
    static mode: EngineMode;
    static client: Client;
    static scene: Scene;
    static width: number;
    static height: number;
    static debugMode: boolean;
    static delta: number;
    static elapsed: number;
    static graphics: Graphics;
    static resize(width: number, height: number): void;
    /**
     * Starts up the Game Engine
     * @param title 	Window Title
     * @param width 	Game Width
     * @param height 	Game Height
     * @param scale 	Scales the Window (on Desktop) to width*scale and height*scale
     * @param ready 	Callback when the Engine is ready
     */
    static start(title: string, width: number, height: number, scale: number, mode: EngineMode, ready?: () => void): void;
    static assert(value: boolean, message: string): boolean;
    private mode;
    private client;
    private scene;
    private nextScene;
    private width;
    private height;
    private dt;
    private elapsed;
    private startTime;
    private lastTime;
    private root;
    private graphics;
    private debuggerEnabled;
    constructor(mode: EngineMode);
    private step();
}
declare class Entity {
    position: Vector;
    x: number;
    y: number;
    visible: boolean;
    active: boolean;
    instantiated: boolean;
    scene: Scene;
    components: Component[];
    groups: string[];
    _depth: number;
    _nextDepth: number;
    depth: number;
    constructor();
    /**
     * Called the first time the entity is created (after constructor)
     */
    created(): void;
    /**
     * Called when the entity is added to a Scene
     */
    added(): void;
    /**
     * Called when the entity is removed from a Scene
     */
    removed(): void;
    /**
     * Called when the entity is recycled in a Scene
     */
    recycled(): void;
    /**
     * Called when an entity is perminantely destroyed
     */
    destroy(): void;
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
    add(component: Component): void;
    remove(component: Component): void;
    removeAll(): void;
    find(className: any): any;
    findAll(componentClassType: any): any[];
    group(groupType: string): void;
    ungroup(groupType: string): void;
    ingroup(groupType: string): boolean;
}
declare class GameWindow {
    private static browserWindow;
    private static titleName;
    private static screen;
    constructor();
    static title: string;
    static fullscreen: boolean;
    static screenLeft: number;
    static screenTop: number;
    static screenWidth: number;
    static screenHeight: number;
    static resize(width: number, height: number): void;
    static center(): void;
    static toggleDevTools(): void;
    static screenMouse: Vector;
}
declare class Graphics {
    private engine;
    private screen;
    private screenContext;
    private buffer;
    private bufferContext;
    private vertexBuffer;
    private uvBuffer;
    private colorBuffer;
    private vertices;
    private uvs;
    private colors;
    private currentShader;
    private nextShader;
    private orthoMatrix;
    clearColor: Color;
    drawCalls: number;
    screenCanvas: HTMLCanvasElement;
    shader: Shader;
    gl: WebGLRenderingContext;
    orthographic: Matrix;
    /**
     * Creates the Engine.Graphics
     */
    constructor(engine: Engine);
    /**
     * Called when the Game resolution changes
     */
    resize(): void;
    /**
     * Updates the Graphics
     */
    update(): void;
    /**
     * Clears the screen
     */
    clear(color: Color): void;
    /**
     * Draws the game to the Screen canvas
     */
    output(): void;
    /**
     * Gets the rectangle that the game buffer should be drawn to the screen with
     */
    getOutputBounds(): Rectangle;
    /**
     * Resets the Graphics rendering
     */
    reset(): void;
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
     * Pushes a list of vertices to the screen. If the shader has been modified, this will end and start a new draw call
     */
    pushList(pos: Vector[], uv: Vector[], color: Color[]): void;
    /**
     * Checks if the shader was modified, and if so, flushes the current vertices & starts a new draw
     */
    check(): void;
    /**
     * Flushes the current vertices to the screen
     */
    flush(): void;
    private topleft;
    private topright;
    private botleft;
    private botright;
    private texToDraw;
    /**
     * Sets the current texture on the shader (if the shader has a sampler2d uniform)
     */
    setShaderTexture(tex: Texture): void;
    /**
     * Draws a texture at the given position. If the current Shader does not take a texture, this will throw an error.
     */
    texture(tex: Texture, posX: number, posY: number, crop?: Rectangle, color?: Color, origin?: Vector, scale?: Vector, rotation?: number, flipX?: boolean, flipY?: boolean): void;
    quad(posX: number, posY: number, width: number, height: number, color?: Color, origin?: Vector, scale?: Vector, rotation?: number): void;
    private _pixel;
    private _pixelUVs;
    /**
     * Sets the current Pixel texture for drawing
     */
    pixel: Texture;
    /**
     * Draws a rectangle with the Graphics.Pixel texture
     */
    pixelRect(bounds: Rectangle, color: Color): void;
    /**
     * Draws a triangle with the Graphics.Pixel texture
     */
    pixelTriangle(a: Vector, b: Vector, c: Vector, colA: Color, colB?: Color, colC?: Color): void;
    /**
     * Draws a circle with the Graphics.Pixel texture
     */
    pixelCircle(pos: Vector, rad: number, steps: number, colorA: Color, colorB?: Color): void;
    /**
     * Draws a triangle. Best used with Shaders.Primitive
     */
    triangle(a: Vector, b: Vector, c: Vector, colA: Color, colB?: Color, colC?: Color): void;
    /**
     * Draws a rectangle. Best used with Shaders.Primitive
     */
    rect(r: Rectangle, color: Color): void;
    hollowRect(r: Rectangle, stroke: number, color: Color): void;
    /**
     * Draws a circle. Best used with Shaders.Primitive
     */
    circle(pos: Vector, rad: number, steps: number, colorA: Color, colorB?: Color): void;
}
declare abstract class Renderer {
    visible: boolean;
    scene: Scene;
    camera: Camera;
    groupsMask: string[];
    shader: Shader;
    shaderMatrixUniformName: string;
    update(): void;
    preRender(): void;
    render(): void;
    postRender(): void;
}
declare class Scene {
    camera: Camera;
    entities: Entity[];
    renderers: Renderer[];
    sorting: Entity[];
    private colliders;
    private groups;
    private cache;
    constructor();
    begin(): void;
    ended(): void;
    update(): void;
    render(): void;
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
    remove(entity: Entity): void;
    removeAt(index: number): void;
    removeAll(): void;
    destroy(entity: Entity): void;
    firstEntityInGroup(group: string): Entity;
    firstEntityOfClass(classType: any): Entity;
    allEntitiesInGroup(group: string): Entity[];
    allEntitiesInGroups(groups: string[]): Entity[];
    allEntitiesOfClass(classType: any): Entity[];
    firstColliderInTag(tag: string): Collider;
    allCollidersInTag(tag: string): Collider[];
    addRenderer(renderer: Renderer): Renderer;
    removeRenderer(renderer: Renderer): Renderer;
    _insertEntityInto(entity: Entity, list: Entity[], removeFrom: boolean): void;
    _groupEntity(entity: Entity, group: string): void;
    _ungroupEntity(entity: Entity, group: string): void;
    _trackComponent(component: Component): void;
    _untrackComponent(component: Component): void;
    _trackCollider(collider: Collider, tag: string): void;
    _untrackCollider(collider: Collider, tag: string): void;
}
declare class AnimationBank {
    static bank: {
        [name: string]: AnimationSet;
    };
    static create(name: string): AnimationSet;
    static get(name: string): AnimationSet;
    static has(name: string): boolean;
}
declare class AnimationSet {
    name: string;
    animations: {
        [name: string]: AnimationTemplate;
    };
    first: AnimationTemplate;
    constructor(name: string);
    add(name: string, speed: number, frames: Texture[], loops: boolean, position?: Vector, origin?: Vector): AnimationSet;
    addFrameAnimation(name: string, speed: number, tex: Texture, frameWidth: number, frameHeight: number, frames: number[], loops: boolean, position?: Vector, origin?: Vector): AnimationSet;
    get(name: string): AnimationTemplate;
    has(name: string): boolean;
}
declare class AnimationTemplate {
    name: string;
    speed: number;
    frames: Texture[];
    origin: Vector;
    position: Vector;
    loops: boolean;
    goto: string[];
    constructor(name: string, speed: number, frames: Texture[], loops?: boolean, position?: Vector, origin?: Vector);
}
declare class Assets {
    static textures: {
        [path: string]: Texture;
    };
    static json: {
        [path: string]: Object;
    };
    static sounds: {
        [path: string]: HTMLAudioElement;
    };
    static atlases: {
        [path: string]: Atlas;
    };
}
declare class AssetLoader {
    loading: boolean;
    loaded: boolean;
    callback: () => void;
    percent: number;
    private assets;
    private assetsLoaded;
    private textures;
    private jsons;
    private sounds;
    private atlases;
    private fs;
    private ps;
    addTexture(path: string): AssetLoader;
    addJson(path: string): AssetLoader;
    addAudio(path: string): AssetLoader;
    addAtlas(name: string, image: string, data: string, type: AtlasType): AssetLoader;
    load(callback?: () => void): void;
    private loadTexture(path, callback?);
    private loadJson(path, callback?);
    private loadAtlas(data);
    private incrementLoader();
}
declare enum AtlasType {
    ASEPRITE = 0,
}
declare class Atlas {
    name: string;
    texture: Texture;
    json: Object;
    type: AtlasType;
    subtextures: {
        [path: string]: Texture;
    };
    constructor(name: string, texture: Texture, json: Object, type: AtlasType);
    get(name: string): Texture;
    list(prefix: string, names: string[]): Texture[];
    private loadAsepriteAtlas();
}
declare class FosterWebGLTexture {
    path: string;
    webGLTexture: WebGLTexture;
    width: number;
    height: number;
}
declare class Texture {
    bounds: Rectangle;
    frame: Rectangle;
    texture: FosterWebGLTexture;
    width: number;
    height: number;
    clippedWidth: number;
    clippedHeight: number;
    constructor(texture: FosterWebGLTexture, bounds?: Rectangle, frame?: Rectangle);
    getSubtexture(clip: Rectangle, sub?: Texture): Texture;
    clone(): Texture;
    toString(): string;
}
declare abstract class Collider extends Component {
    tags: string[];
    tag(tag: string): void;
    untag(tag: string): void;
    check(tag: string, x?: number, y?: number): boolean;
    checks(tags: string[], x?: number, y?: number): boolean;
    collide(tag: string, x: number, y: number): Collider;
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
    sceneLeft: number;
    sceneRight: number;
    sceneTop: number;
    sceneBottom: number;
    sceneBounds: Rectangle;
    constructor(left: number, top: number, width: number, height: number, tags?: string[]);
    debugRender(): void;
}
declare class Physics extends Hitbox {
    solids: string[];
    onCollideX: () => void;
    onCollideY: () => void;
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
declare class Vector {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): Vector;
    add(v: Vector): Vector;
    sub(v: Vector): Vector;
    mult(v: Vector): Vector;
    scale(s: number): Vector;
    rotate(sin: number, cos: number): Vector;
    transform(m: Matrix): Vector;
    clone(): Vector;
    length: number;
    normal: Vector;
    normalize(): Vector;
    static add(a: Vector, b: Vector): Vector;
    static sub(a: Vector, b: Vector): Vector;
    static mult(a: Vector, b: Vector): Vector;
    static transform(a: Vector, m: Matrix): Vector;
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
    static x: number;
    static y: number;
    static position: Vector;
    static absolute: Vector;
    static left: boolean;
    static leftPressed: boolean;
    static leftReleased: boolean;
    static right: boolean;
    static rightPressed: boolean;
    static rightReleased: boolean;
    static init(): void;
    static update(): void;
    private static setNextMouseTo(pageX, pageY);
}
declare class PrimitiveRenderer extends Renderer {
    constructor();
}
declare class SpriteRenderer extends Renderer {
    constructor();
}
declare class Camera {
    position: Vector;
    origin: Vector;
    scale: Vector;
    rotation: number;
    private _matrix;
    private _internal;
    private _mouse;
    private internal;
    matrix: Matrix;
    mouse: Vector;
    private extentsA;
    private extentsB;
    private extentsC;
    private extentsD;
    private extentsRect;
    private getExtents();
    extents: Rectangle;
}
declare class Color {
    private color;
    r: number;
    g: number;
    b: number;
    a: number;
    rgba: number[];
    constructor(r?: number, g?: number, b?: number, a?: number);
    mult(alpha: number): Color;
    static lerpOn(out: Color, a: Color, b: Color, p: number): Color;
    static lerp(a: Color, b: Color, p: number): Color;
    static white: Color;
    static black: Color;
    static red: Color;
    static green: Color;
    static blue: Color;
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
    static fromRotation(rad: number, ref?: Matrix): Matrix;
    static fromScale(x: number, y: number, ref?: Matrix): Matrix;
    static fromTranslation(x: number, y: number, ref?: Matrix): Matrix;
}
declare class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    constructor(x?: number, y?: number, w?: number, h?: number);
    set(x: number, y: number, w: number, h: number): Rectangle;
    cropRect(r: Rectangle): Rectangle;
    crop(x: number, y: number, w: number, h: number): Rectangle;
    clone(): Rectangle;
    copyTo(out: Rectangle): void;
}
declare class Shader {
    program: WebGLProgram;
    uniforms: ShaderUniform[];
    attributes: ShaderAttribute[];
    dirty: boolean;
    sampler2d: ShaderUniform;
    private uniformsByName;
    constructor(vertex: string, fragment: string, uniforms: ShaderUniform[], attributes: ShaderAttribute[]);
    set(name: string, value: any): void;
}
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
    cameraMatrix3d = 20,
}
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
declare enum ShaderAttributeType {
    Position = 0,
    Uv = 1,
    Color = 2,
}
declare class ShaderAttribute {
    name: string;
    type: ShaderAttributeType;
    attribute: number;
    constructor(name: string, type: ShaderAttributeType);
}
declare class Shaders {
    static texture: Shader;
    static solid: Shader;
    static primitive: Shader;
    static init(): void;
}
declare class Hitgrid extends Collider {
    tileWidth: number;
    tileHeight: number;
    private map;
    constructor(tileWidth: number, tileHeight: number, tags?: string[]);
    set(solid: boolean, tx: number, ty: number, columns?: number, rows?: number): void;
    has(tx: number, ty: number, columns?: number, rows?: number): boolean;
    private debugRect;
    private debugSub;
    debugRender(camera: Camera): void;
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
    width: number;
    height: number;
    constructor(texture: Texture, position?: Vector);
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
    animation: AnimationSet;
    playing: AnimationTemplate;
    frame: number;
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
    private map;
    private tileColumns;
    private crop;
    constructor(texture: Texture, tileWidth: number, tileHeight: number);
    set(tileX: number, tileY: number, mapX: number, mapY: number, mapWidth?: number, mapHeight?: number): void;
    has(mapX: number, mapY: number): boolean;
    get(mapX: number, mapY: number): Vector;
    clear(mapX: number, mapY: number, mapWidth?: number, mapHeight?: number): void;
    render(camera: Camera): void;
}
