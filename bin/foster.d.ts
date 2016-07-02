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
declare class Engine {
    /**
     * The root HTML event that the game Canvas is created in (for the actual Canvas element, see Engine.graphics.screen)
     */
    static root: HTMLElement;
    /**
     * Current Client (Client.Desktop if in Electron and Client.Web if in the browser)
     */
    static client: Client;
    /**
     * The current game Scene
     */
    static scene: Scene;
    /**
     * Gets the Game Width, before being scaled up / down to fit in the screen
     */
    static width: number;
    /**
     * Gets the Game Height, before being scaled up / down to fit in the screen
     */
    static height: number;
    /**
     * Toggles Debug Mode, which shows hitboxes and allows entities to be dragged around
     */
    static debugMode: boolean;
    /**
     * Delta Time (time, in seconds, since the last frame)
     */
    static delta: number;
    /**
     * Total elapsed game time (time, in seconds, since the Engine was started)
     */
    static elapsed: number;
    /**
     * Gets the current Engine graphics (used for all rendering)
     */
    static graphics: Graphics;
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
    constructor();
    private step();
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
     * If the Entity has been instantiated yet (has it ever been added to a scene)
     */
    instantiated: boolean;
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
    find(className: any): any;
    /**
     * Finds all components in this Entity of the given Class
     */
    findAll(componentClassType: any): any[];
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
    gl: WebGLRenderingContext;
    screenCanvas: HTMLCanvasElement;
    private vertexBuffer;
    private uvBuffer;
    private colorBuffer;
    private vertices;
    private uvs;
    private colors;
    private currentShader;
    private nextShader;
    shader: Shader;
    private orthoMatrix;
    orthographic: Matrix;
    private _pixel;
    private _pixelUVs;
    pixel: Texture;
    clearColor: Color;
    drawCalls: number;
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
    /**
     * Checks if the shader was modified, and if so, flushes the current vertices & starts a new draw
     */
    checkState(): void;
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
declare class AssetLoader {
    loading: boolean;
    loaded: boolean;
    callback: () => void;
    percent: number;
    private assets;
    private assetsLoaded;
    private textures;
    private jsons;
    private xmls;
    private sounds;
    private atlases;
    private texts;
    addTexture(path: string): AssetLoader;
    addJson(path: string): AssetLoader;
    addXml(path: string): AssetLoader;
    addText(path: string): AssetLoader;
    addSound(path: string): AssetLoader;
    addAtlas(name: string, image: string, data: string, type: AtlasType): AssetLoader;
    load(callback?: () => void): void;
    unload(): void;
    private loadTexture(path, callback?);
    private loadJson(path, callback?);
    private loadXml(path, callback?);
    private loadText(path, callback?);
    private loadSound(path, callback?);
    private loadAtlas(data);
    private incrementLoader();
}
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
        [path: string]: HTMLAudioElement;
    };
    static atlases: {
        [path: string]: Atlas;
    };
}
declare class Alarm extends Component {
    percent: number;
    duration: number;
    callback: (Alarm) => void;
    constructor();
    start(duration: number, callback: (Alarm) => void): Alarm;
    restart(): Alarm;
    resume(): Alarm;
    pause(): Alarm;
    update(): void;
}
/**
 * Coroutine Class. Warning, this uses some pretty modern JS features and may not work on most browsers
 */
declare class Coroutine extends Component {
    wait: number;
    private iterator;
    constructor(call?: any);
    start(call: any): Coroutine;
    resume(): Coroutine;
    pause(): Coroutine;
    stop(): Coroutine;
    update(): void;
    step(): void;
    end(remove: boolean): void;
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
declare class Tween extends Component {
    percent: number;
    duration: number;
    from: number;
    to: number;
    ease: (number) => number;
    step: (number) => void;
    removeOnComplete: boolean;
    constructor();
    start(duration: number, from: number, to: number, ease: (number) => number, step: (number) => void, removeOnComplete?: boolean): Tween;
    restart(): Tween;
    resume(): Tween;
    pause(): Tween;
    update(): void;
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
    copy(v: Vector): Vector;
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
    static directions: Vector[];
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
declare class Calc {
    static sign(n: number): number;
    static clamp(n: number, min: number, max: number): number;
    static approach(n: number, target: number, step: number): number;
    static range(min: number, max?: number): number;
    static choose<T>(list: T[]): T;
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
    set(r: number, g: number, b: number, a: number): Color;
    mult(alpha: number, out?: Color): Color;
    static lerp(a: Color, b: Color, p: number, out?: Color): Color;
    static white: Color;
    static black: Color;
    static red: Color;
    static green: Color;
    static blue: Color;
}
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
declare class FosterIO {
    private static fs;
    private static path;
    static read(path: string, callback: (string) => void): void;
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
declare class AnimationBank {
    static bank: {
        [name: string]: AnimationSet;
    };
    static create(name: string): AnimationSet;
    static get(name: string): AnimationSet;
    static has(name: string): boolean;
}
declare enum AtlasType {
    ASEPRITE = 0,
}
declare class Atlas {
    name: string;
    texture: Texture;
    data: Object;
    type: AtlasType;
    subtextures: {
        [path: string]: Texture;
    };
    constructor(name: string, texture: Texture, data: Object, type: AtlasType);
    get(name: string): Texture;
    has(name: string): boolean;
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
declare class ParticleSystem extends Component {
    template: ParticleTemplate;
    renderRelativeToEntity: boolean;
    private particles;
    private static cache;
    private static color;
    private static origin;
    private static scale;
    constructor(template: ParticleTemplate);
    update(): void;
    render(camera: Camera): void;
    burst(x: number, y: number, direction: number, rangeX?: number, rangeY?: number, count?: number): void;
}
declare class ParticleTemplate {
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
    private static tempColor;
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
    set(tileX: number, tileY: number, mapX: number, mapY: number, mapWidth?: number, mapHeight?: number): Tilemap;
    clear(mapX: number, mapY: number, mapWidth?: number, mapHeight?: number): Tilemap;
    has(mapX: number, mapY: number): boolean;
    get(mapX: number, mapY: number): Vector;
    render(camera: Camera): void;
}
