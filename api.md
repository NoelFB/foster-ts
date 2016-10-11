# Foster API Documentation
Work in Progress documentation, that should eventually probably be moved out of a giant.md file

||||||
|---|---|---|---|---|
| [Alarm](#class-alarm) | [AnimationBank](#class-animationbank) | [AnimationSet](#class-animationset) | [AnimationTemplate](#class-animationtemplate) | [AssetLoader](#class-assetloader) |
| [Assets](#class-assets) | [Atlas](#class-atlas) | [AtlasReaders](#class-atlasreaders) | [ButtonState](#class-buttonstate) | [Calc](#class-calc) |
| [Camera](#class-camera) | [Client](#enum-client) | [Collider](#class-collider) | [Color](#class-color) | [Component](#class-component) |
| [ControllerInput](#class-controllerinput) | [Coroutine](#class-coroutine) | [Ease](#class-ease) | [Engine](#class-engine) | [Entity](#class-entity) |
| [FosterIO](#class-fosterio) | [FosterWebGLTexture](#class-fosterwebgltexture) | [GameWindow](#class-gamewindow) | [GamepadManager](#class-gamepadmanager) | [Graphic](#class-graphic) |
| [Graphics](#class-graphics) | [Hitbox](#class-hitbox) | [Hitgrid](#class-hitgrid) | [Key](#enum-key) | [Keys](#class-keys) |
| [Matrix](#class-matrix) | [Mouse](#class-mouse) | [Particle](#class-particle) | [ParticleSystem](#class-particlesystem) | [ParticleTemplate](#class-particletemplate) |
| [Physics](#class-physics) | [PrimitiveRenderer](#class-primitiverenderer) | [Rectangle](#class-rectangle) | [Rectsprite](#class-rectsprite) | [RenderTarget](#class-rendertarget) |
| [Renderer](#class-renderer) | [ResolutionStyle](#enum-resolutionstyle) | [Scene](#class-scene) | [Shader](#class-shader) | [ShaderAttribute](#class-shaderattribute) |
| [ShaderAttributeType](#enum-shaderattributetype) | [ShaderUniform](#class-shaderuniform) | [ShaderUniformType](#enum-shaderuniformtype) | [Shaders](#class-shaders) | [Sprite](#class-sprite) |
| [SpriteRenderer](#class-spriterenderer) | [Texture](#class-texture) | [Tilemap](#class-tilemap) | [Tween](#class-tween) | [Vector](#class-vector) |
| [setGLUniformValue](#var-setgluniformvalue) |||||
# class Alarm
##### extends [Component](#class-component)
### Members
 - **percent**:`number`

	Gets the current Percent of the Alarm

 - **duration**:`number`

	Gets the current Duration of the Alarm

 - **callback**:`(Alarm)=>void`

	Called when the Alarm is finished

 - **removeOnComplete**:`boolean`

	If the Alarm should be removed from the Entity upon completion


### Methods
 - **constructor**():`void`
 - **start**(`duration:number, callback:(Alarm)=>void`):`Alarm`

	Starts the Alarm

 - **restart**():`Alarm`

	Restarts the Alarm

 - **resume**():`Alarm`

	Resumes the Alarm if it was paused

 - **pause**():`Alarm`

	Pauses the Alarm if it was active

 - **update**():`void`

	Updates the Alarm (automatically called during its Entity's update)

 - **Alarm.create**(`on:Entity`):`Alarm`

	Creates and adds a new Alarm on the given Entity


# class AnimationBank
### Members
 - **AnimationBank.bank**:`{[name:string]:AnimationSet;}`

### Methods
 - **AnimationBank.create**(`name:string`):`AnimationSet`
 - **AnimationBank.get**(`name:string`):`AnimationSet`
 - **AnimationBank.has**(`name:string`):`boolean`

# class AnimationSet
### Members
 - **name**:`string`
 - **animations**:`{[name:string]:AnimationTemplate;}`
 - **first**:`AnimationTemplate`

### Methods
 - **constructor**(`name:string`):`void`
 - **add**(`name:string, speed:number, frames:Texture[], loops:boolean, position?:Vector, origin?:Vector`):`AnimationSet`
 - **addFrameAnimation**(`name:string, speed:number, tex:Texture, frameWidth:number, frameHeight:number, frames:number[], loops:boolean, position?:Vector, origin?:Vector`):`AnimationSet`
 - **get**(`name:string`):`AnimationTemplate`
 - **has**(`name:string`):`boolean`

# class AnimationTemplate
### Members
 - **name**:`string`
 - **speed**:`number`
 - **frames**:`Texture[]`
 - **origin**:`Vector`
 - **position**:`Vector`
 - **loops**:`boolean`
 - **goto**:`string[]`

### Methods
 - **constructor**(`name:string, speed:number, frames:Texture[], loops?:boolean, position?:Vector, origin?:Vector`):`void`

# class AssetLoader
### Members
 - **root**:`string`
 - **loading**:`boolean`
 - **loaded**:`boolean`
 - **callback**:`()=>void`
 - **percent**:`number`

### Methods
 - **constructor**(`root?:string`):`void`
 - **addTexture**(`path:string`):`AssetLoader`
 - **addJson**(`path:string`):`AssetLoader`
 - **addXml**(`path:string`):`AssetLoader`
 - **addText**(`path:string`):`AssetLoader`
 - **addSound**(`path:string`):`AssetLoader`
 - **addAtlas**(`name:string, image:string, data:string, loader:AtlasReader`):`AssetLoader`
 - **load**(`callback?:()=>void`):`void`
 - **unload**():`void`

# class Assets
### Members
 - **Assets.textures**:`{[path:string]:Texture;}`
 - **Assets.json**:`{[path:string]:Object;}`
 - **Assets.xml**:`{[path:string]:Object;}`
 - **Assets.text**:`{[path:string]:string;}`
 - **Assets.sounds**:`{[path:string]:HTMLAudioElement;}`
 - **Assets.atlases**:`{[path:string]:Atlas;}`

### Methods
 - **Assets.unload**():`void`

	Unloads all the assets in the entire game


# class Atlas
### Members
 - **name**:`string`

	Name of the Atlas

 - **texture**:`Texture`

	Reference to the atlas texture

 - **data**:`Object`

	Raw Atlas Data, in whatever format the atlas was loaded in

 - **reader**:`AtlasReader`

	The Atlas Data Reader (a method parses the raw data and creates the subtextures)

 - **subtextures**:`{[path:string]:Texture;}`

	Dictionary of the Subtextures within this atlas


### Methods
 - **constructor**(`name:string, texture:Texture, data:Object, reader:AtlasReader`):`void`
 - **get**(`name:string`):`Texture`

	Gets a specific subtexture from the atlas
	 - **name**:`string` the name/path of the subtexture

 - **has**(`name:string`):`boolean`

	Checks if a subtexture exists
	 - **name**:`string` the name/path of the subtexture

 - **list**(`prefix:string, names:string[]`):`Texture[]`

	Gets a list of textures

 - **find**(`prefix:string`):`Texture[]`

	Finds all subtextures with the given prefix


# class AtlasReaders
### Methods
 - **AtlasReaders.Aseprite**(`data:any, into:Atlas`):`void`

	Parses Aseprite data from the atlas


# class ButtonState
### Methods
 - **constructor**():`void`
 - **update**(`val:boolean`):`void`
 - **down**():`boolean`
 - **pressed**():`boolean`
 - **released**():`boolean`

# class Calc
### Methods
 - **Calc.sign**(`n:number`):`number`
 - **Calc.clamp**(`n:number, min:number, max:number`):`number`
 - **Calc.approach**(`n:number, target:number, step:number`):`number`
 - **Calc.range**(`min:number, max?:number`):`number`
 - **Calc.choose**`<T>`(`list:T[]`):`T`

# class Camera
### Members
 - **position**:`Vector`
 - **origin**:`Vector`
 - **scale**:`Vector`
 - **rotation**:`number`
 - **matrix**:`Matrix`
 - **mouse**:`Vector`
 - **extents**:`Rectangle`

# enum Client
	Current game Client

 - **Desktop** = `0`	Running on the desktop (in Electron)
 - **Web** = `1`	Running on the Web

# class Collider
##### extends [Component](#class-component)
### Members
 - **tags**:`string[]`

### Methods
 - **tag**(`tag:string`):`void`
 - **untag**(`tag:string`):`void`
 - **check**(`tag:string, x?:number, y?:number`):`boolean`
 - **checks**(`tags:string[], x?:number, y?:number`):`boolean`
 - **collide**(`tag:string, x:number, y:number`):`Collider`
 - **collides**(`tags:string[], x?:number, y?:number`):`Collider`
 - **collideAll**(`tag:string, x?:number, y?:number`):`Collider[]`
 - **Collider.overlap**(`a:Collider, b:Collider`):`boolean`
 - **Collider.overlap_hitbox_hitbox**(`a:Hitbox, b:Hitbox`):`boolean`
 - **Collider.overlap_hitbox_grid**(`a:Hitbox, b:Hitgrid`):`boolean`

# class Color
### Members
 - **r**:`number`
 - **g**:`number`
 - **b**:`number`
 - **a**:`number`
 - **rgba**:`number[]`
 - **Color.white**:`Color`
 - **Color.black**:`Color`
 - **Color.red**:`Color`
 - **Color.green**:`Color`
 - **Color.blue**:`Color`
 - **Color.temp**:`Color`

### Methods
 - **constructor**(`r?:number, g?:number, b?:number, a?:number`):`void`
 - **set**(`r:number, g:number, b:number, a:number`):`Color`
 - **copy**(`color:Color`):`Color`
 - **lerp**(`a:Color, b:Color, p:number`):`Color`
 - **clone**():`Color`
 - **mult**(`alpha:number`):`Color`

# class Component
### Members
 - **entity**:`Entity`
 - **scene**:`Scene`
 - **active**:`boolean`
 - **visible**:`boolean`
 - **position**:`Vector`
 - **x**:`number`
 - **y**:`number`
 - **scenePosition**:`Vector`

### Methods
 - **addedToEntity**():`void`
 - **addedToScene**():`void`
 - **removedFromEntity**():`void`
 - **removedFromScene**():`void`
 - **update**():`void`
 - **render**(`camera?:Camera`):`void`
 - **debugRender**(`camera?:Camera`):`void`

# class ControllerInput
##### extends [Component](#class-component)
### Members
 - **gamepad**:`Gamepad`

### Methods
 - **constructor**(`pad:Gamepad, deadzone?:number`):`void`
 - **update**():`void`
 - **getButton**(`index:number`):`ButtonState`
 - **getLeftStick**():`Vector`
 - **getRightStick**():`Vector`
 - **getRawLeftStick**():`Vector`
 - **getRawRightStick**():`Vector`

# class Coroutine
##### extends [Component](#class-component)
	Coroutine Class. This uses generator functions which are only supported in ES6 and is missing in many browsers.
 More information: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/function*

### Methods
 - **constructor**(`call?:()=>Iterator`):`void`

	@param call? 	if set, immediately starts he Coroutine with the given Iterator

 - **start**(`call:()=>Iterator`):`Coroutine`

	Starts the Coroutine with the given Iterator

 - **resume**():`Coroutine`

	Resumes the current Coroutine (sets this.active to true)

 - **pause**():`Coroutine`

	Pauses the current Coroutine (sets this.active to false)

 - **stop**():`Coroutine`

	Stops the Coroutine, and sets the current Iterator to null

 - **update**():`void`

	Updates the Coroutine (automatically called its Entity's update)

 - **step**():`void`

	Steps the Coroutine through the Iterator once

 - **end**(`remove:boolean`):`void`

	Calls Coroutine.stop and will optionally remove itself from the Entity


# class Ease
### Methods
 - **Ease.linear**(`t:number`):`number`
 - **Ease.quadIn**(`t:number`):`number`
 - **Ease.quadOut**(`t:number`):`number`
 - **Ease.quadInOut**(`t:number`):`number`
 - **Ease.cubeIn**(`t:number`):`number`
 - **Ease.cubeOut**(`t:number`):`number`
 - **Ease.cubeInOut**(`t:number`):`number`
 - **Ease.backIn**(`t:number`):`number`
 - **Ease.backOut**(`t:number`):`number`
 - **Ease.backInOut**(`t:number`):`number`
 - **Ease.expoIn**(`t:number`):`number`
 - **Ease.expoOut**(`t:number`):`number`
 - **Ease.expoInOut**(`t:number`):`number`
 - **Ease.sineIn**(`t:number`):`number`
 - **Ease.sineOut**(`t:number`):`number`
 - **Ease.sineInOut**(`t:number`):`number`
 - **Ease.elasticInOut**(`t:number`):`number`
 - **Ease.arc**(`t:number, ease:(number)=>number`):`number`

# class Engine
	Core of the Foster Engine. Initializes and Runs the game.

### Members
 - **Engine.version**:`string`

	Foster Engine version

 - **Engine.root**:`HTMLElement`

	The root HTML event that the game Canvas is created in (for the actual Canvas element, see Engine.graphics.screen)

 - **Engine.client**:`Client`

	Current Client (Client.Desktop if in Electron and Client.Web if in the browser)

 - **Engine.scene**:`Scene`

	Gets the current game Scene

 - **Engine.width**:`number`

	Gets the Game Width, before being scaled up / down to fit in the screen

 - **Engine.height**:`number`

	Gets the Game Height, before being scaled up / down to fit in the screen

 - **Engine.debugMode**:`boolean`

	Toggles Debug Mode, which shows hitboxes and allows entities to be dragged around

 - **Engine.delta**:`number`

	Delta Time (time, in seconds, since the last frame)

 - **Engine.elapsed**:`number`

	Total elapsed game time (time, in seconds, since the Engine was started)

 - **Engine.graphics**:`Graphics`

	Gets the current Engine graphics (used for all rendering)


### Methods
 - **Engine.start**(`title:string, width:number, height:number, scale:number, ready:()=>void`):`void`

	Starts up the Game Engine
	 - **title**:`string` Window Title
	 - **width**:`number` Game Width
	 - **height**:`number` Game Height
	 - **scale**:`number` Scales the Window (on Desktop) to width * scale and height * scale
	 - **ready**:`()=>void` Callback when the Engine is ready

 - **Engine.goto**(`scene:Scene, disposeLastScene:boolean`):`Scene`
 - **Engine.exit**():`void`
 - **Engine.resize**(`width:number, height:number`):`void`

	Resizes the game to the given size
	 - **width**:`number` new Game Width
	 - **height**:`number` new Game Height

 - **Engine.assert**(`value:boolean, message:string`):`boolean`

	Checks that the given value is true, otherwise throws an error

 - **constructor**():`void`

# class Entity
### Members
 - **position**:`Vector`

	Position of the Entity in the Scene

 - **x**:`number`

	X position of the Entity in the Scene

 - **y**:`number`

	Y position of the Entity in the Scene

 - **visible**:`boolean`

	If the Entity is visible. If false, Entity.render is not called

 - **active**:`boolean`

	If the Entity is active. If false, Entity.update is not called

 - **isCreated**:`boolean`

	If the Entity has been created yet (has it ever been added to a scene)

 - **isStarted**:`boolean`

	If the Entity has been started yet (has it been updated in the current scene)

 - **scene**:`Scene`

	The current scene that the Entity is in

 - **components**:`Component[]`

	List of all Entity components

 - **groups**:`string[]`

	List of all Groups the Entity is in

 - **depth**:`number`

	The Render-Depth of the Entity (lower = rendered later)


### Methods
 - **constructor**():`void`
 - **created**():`void`

	Called the first time the entity is added to a scene (after constructor, before added)

 - **added**():`void`

	Called immediately whenever the entity is added to a Scene (after created, before started)

 - **started**():`void`

	Called before the first update of the Entity (after added)

 - **removed**():`void`

	Called immediately whenever the entity is removed from a Scene

 - **recycled**():`void`

	Called immediately whenever the entity is recycled in a Scene

 - **destroyed**():`void`

	Called when an entity is permanently destroyed

 - **update**():`void`

	Called every game-step, if this entity is in a Scene and Active

 - **render**(`camera:Camera`):`void`

	Called via a Renderer, if Visible

 - **debugRender**(`camera:Camera`):`void`

	Called via the Debug Renderer

 - **add**(`component:Component`):`void`

	Adds a Component to this Entity

 - **remove**(`component:Component`):`void`

	Removes a Components from this Entity

 - **removeAll**():`void`

	Removes all Components from this Entity

 - **find**`<T extends Component>`(`className:Function`):`T`

	Finds the first component in this Entity of the given Class

 - **findAll**`<T extends Component>`(`className:Function`):`T[]`

	Finds all components in this Entity of the given Class

 - **group**(`groupType:string`):`void`

	Groups this entity into the given Group

 - **ungroup**(`groupType:string`):`void`

	Removes this Entity from the given Group

 - **ingroup**(`groupType:string`):`boolean`

	Checks if this Entity is in the given Group


# class FosterIO
### Methods
 - **FosterIO.init**():`void`
 - **FosterIO.read**(`path:string, callback:(string)=>void`):`void`
 - **FosterIO.join**(`.:undefined`):`string`

# class FosterWebGLTexture
### Members
 - **path**:`string`
 - **webGLTexture**:`WebGLTexture`
 - **width**:`number`
 - **height**:`number`
 - **disposed**:`boolean`

### Methods
 - **constructor**(`texture:WebGLTexture, width:number, height:number`):`void`
 - **dispose**():`void`

# class GameWindow
### Members
 - **GameWindow.title**:`string`
 - **GameWindow.fullscreen**:`boolean`
 - **GameWindow.screenLeft**:`number`
 - **GameWindow.screenTop**:`number`
 - **GameWindow.screenWidth**:`number`
 - **GameWindow.screenHeight**:`number`
 - **GameWindow.screenMouse**:`Vector`

### Methods
 - **constructor**():`void`
 - **GameWindow.resize**(`width:number, height:number`):`void`
 - **GameWindow.center**():`void`
 - **GameWindow.toggleDevTools**():`void`

# class GamepadManager
### Members
 - **GamepadManager.defaultDeadzone**:`number`

### Methods
 - **GamepadManager.init**():`void`
 - **GamepadManager.onAddController**(`event:any`):`void`
 - **GamepadManager.getController**(`index:number`):`ControllerInput`
 - **GamepadManager.numControllers**():`number`
 - **GamepadManager.setRemoveControllerBehavior**(`handler:any`):`void`

# class Graphic
##### extends [Component](#class-component)
### Members
 - **texture**:`Texture`
 - **crop**:`Rectangle`
 - **scale**:`Vector`
 - **origin**:`Vector`
 - **rotation**:`number`
 - **flipX**:`boolean`
 - **flipY**:`boolean`
 - **color**:`Color`
 - **alpha**:`number`
 - **width**:`number`
 - **height**:`number`

### Methods
 - **constructor**(`texture:Texture, position?:Vector`):`void`
 - **center**():`void`
 - **justify**(`x:number, y:number`):`void`
 - **render**(`camera:Camera`):`void`

# class Graphics
### Members
 - **canvas**:`HTMLCanvasElement`
 - **gl**:`WebGLRenderingContext`
 - **buffer**:`RenderTarget`
 - **resolutionStyle**:`ResolutionStyle`
 - **borderColor**:`Color`
 - **clearColor**:`Color`
 - **shader**:`Shader`
 - **orthographic**:`Matrix`
 - **pixel**:`Texture`
 - **drawCalls**:`number`

### Methods
 - **constructor**(`engine:Engine`):`void`

	Creates the Engine.Graphics

 - **unload**():`void`

	Unloads the Graphics and WebGL stuff

 - **resize**():`void`

	Called when the Game resolution changes

 - **update**():`void`

	Updates the Graphics

 - **getOutputBounds**():`Rectangle`

	Gets the rectangle that the game buffer should be drawn to the screen with

 - **clear**(`color:Color`):`void`

	Clears the screen

 - **reset**():`void`

	Resets the Graphics rendering

 - **setRenderTarget**(`target:RenderTarget`):`void`

	Sets the current Render Target

 - **setShaderTexture**(`tex:Texture`):`void`

	Sets the current texture on the shader (if the shader has a sampler2d uniform)

 - **checkState**():`void`

	Checks if the shader was modified, and if so, flushes the current vertices & starts a new draw

 - **flush**():`void`

	Flushes the current vertices to the screen

 - **finalize**():`void`

	Draws the game to the Screen and does cleanup

 - **push**(`x:number, y:number, u:number, v:number, color?:Color`):`void`

	Pushes vertices to the screen. If the shader has been modified, this will end and start a new draw call
	 - **x**:`number` X position of the vertex
	 - **y**:`number` Y position of the vertex
	 - **u**:`number` X position in the texture (u) (only used in shaders with sampler2d)
	 - **v**:`number` Y position in the texture (v) (only used in shaders with sampler2d)
	 - **color** optional color for the vertex

 - **pushUnsafe**(`x:number, y:number, u:number, v:number, color?:Color`):`void`

	Same as Graphics.push, but this method assumes the shader was NOT modified. Don't use this unless you know what you're doing
	 - **x**:`number` X position of the vertex
	 - **y**:`number` Y position of the vertex
	 - **u**:`number` X position in the texture (u) (only used in shaders with sampler2d)
	 - **v**:`number` Y position in the texture (v) (only used in shaders with sampler2d)
	 - **color** optional color for the vertex

 - **pushList**(`pos:Vector[], uv:Vector[], color:Color[]`):`void`

	Pushes a list of vertices to the screen. If the shader has been modified, this will end and start a new draw call

 - **texture**(`tex:Texture, posX:number, posY:number, crop?:Rectangle, color?:Color, origin?:Vector, scale?:Vector, rotation?:number, flipX?:boolean, flipY?:boolean`):`void`

	Draws a texture at the given position. If the current Shader does not take a texture, this will throw an error.

 - **quad**(`posX:number, posY:number, width:number, height:number, color?:Color, origin?:Vector, scale?:Vector, rotation?:number`):`void`
 - **pixelRect**(`bounds:Rectangle, color:Color`):`void`

	Draws a rectangle with the Graphics.Pixel texture

 - **pixelTriangle**(`a:Vector, b:Vector, c:Vector, colA:Color, colB?:Color, colC?:Color`):`void`

	Draws a triangle with the Graphics.Pixel texture

 - **pixelCircle**(`pos:Vector, rad:number, steps:number, colorA:Color, colorB?:Color`):`void`

	Draws a circle with the Graphics.Pixel texture

 - **triangle**(`a:Vector, b:Vector, c:Vector, colA:Color, colB?:Color, colC?:Color`):`void`

	Draws a triangle. Best used with Shaders.Primitive

 - **rect**(`r:Rectangle, color:Color`):`void`

	Draws a rectangle. Best used with Shaders.Primitive

 - **hollowRect**(`r:Rectangle, stroke:number, color:Color`):`void`
 - **circle**(`pos:Vector, rad:number, steps:number, colorA:Color, colorB?:Color`):`void`

	Draws a circle. Best used with Shaders.Primitive


# class Hitbox
##### extends [Collider](#class-collider)
### Members
 - **left**:`number`
 - **top**:`number`
 - **width**:`number`
 - **height**:`number`
 - **sceneLeft**:`number`
 - **sceneRight**:`number`
 - **sceneTop**:`number`
 - **sceneBottom**:`number`
 - **sceneBounds**:`Rectangle`

### Methods
 - **constructor**(`left:number, top:number, width:number, height:number, tags?:string[]`):`void`
 - **debugRender**():`void`

# class Hitgrid
##### extends [Collider](#class-collider)
### Members
 - **tileWidth**:`number`
 - **tileHeight**:`number`

### Methods
 - **constructor**(`tileWidth:number, tileHeight:number, tags?:string[]`):`void`
 - **set**(`solid:boolean, tx:number, ty:number, columns?:number, rows?:number`):`void`
 - **has**(`tx:number, ty:number, columns?:number, rows?:number`):`boolean`
 - **debugRender**(`camera:Camera`):`void`

# enum Key
 - **backspace** = `8`
 - **tab** = `9`
 - **enter** = `13`
 - **shift** = `16`
 - **ctrl** = `17`
 - **alt** = `18`
 - **pause** = `19`
 - **capslock** = `20`
 - **escape** = `27`
 - **space** = `32`
 - **pageUp** = `33`
 - **pageDown** = `34`
 - **end** = `35`
 - **home** = `36`
 - **left** = `37`
 - **up** = `38`
 - **right** = `39`
 - **down** = `40`
 - **insert** = `45`
 - **del** = `46`
 - **zero** = `48`
 - **one** = `49`
 - **two** = `50`
 - **three** = `51`
 - **four** = `52`
 - **five** = `53`
 - **six** = `54`
 - **seven** = `55`
 - **eight** = `56`
 - **nine** = `57`
 - **a** = `65`
 - **b** = `66`
 - **c** = `67`
 - **d** = `68`
 - **e** = `69`
 - **f** = `70`
 - **g** = `71`
 - **h** = `72`
 - **i** = `73`
 - **j** = `74`
 - **k** = `75`
 - **l** = `76`
 - **m** = `77`
 - **n** = `78`
 - **o** = `79`
 - **p** = `80`
 - **q** = `81`
 - **r** = `82`
 - **s** = `83`
 - **t** = `84`
 - **u** = `85`
 - **v** = `86`
 - **w** = `87`
 - **x** = `88`
 - **y** = `89`
 - **z** = `90`
 - **leftWindow** = `91`
 - **rightWindow** = `92`
 - **select** = `93`
 - **numpad0** = `96`
 - **numpad1** = `97`
 - **numpad2** = `98`
 - **numpad3** = `99`
 - **numpad4** = `100`
 - **numpad5** = `101`
 - **numpad6** = `102`
 - **numpad7** = `103`
 - **numpad8** = `104`
 - **numpad9** = `105`
 - **multiply** = `106`
 - **add** = `107`
 - **subtract** = `109`
 - **decimal** = `110`
 - **divide** = `111`
 - **f1** = `112`
 - **f2** = `113`
 - **f3** = `114`
 - **f4** = `115`
 - **f5** = `116`
 - **f6** = `117`
 - **f7** = `118`
 - **f8** = `119`
 - **f9** = `120`
 - **f10** = `121`
 - **f11** = `122`
 - **f12** = `123`
 - **numlock** = `144`
 - **scrollLock** = `145`
 - **semicolon** = `186`
 - **equal** = `187`
 - **comma** = `188`
 - **dash** = `189`
 - **period** = `190`
 - **forwardSlash** = `191`
 - **graveAccent** = `192`
 - **openBracket** = `219`
 - **backSlash** = `220`
 - **closeBraket** = `221`
 - **singleQuote** = `222`

# class Keys
### Methods
 - **Keys.init**():`void`
 - **Keys.update**():`void`
 - **Keys.down**(`key:Key`):`boolean`
 - **Keys.pressed**(`key:Key`):`boolean`
 - **Keys.released**(`key:Key`):`boolean`
 - **Keys.map**(`name:string, keys:Key[]`):`void`
 - **Keys.maps**(`list:{[name:string]:Key[];}`):`void`
 - **Keys.mapDown**(`key:string`):`boolean`
 - **Keys.mapPressed**(`key:string`):`boolean`
 - **Keys.mapReleased**(`key:string`):`boolean`

# class Matrix
### Members
 - **mat**:`Float32Array`

### Methods
 - **constructor**():`void`
 - **identity**():`Matrix`
 - **copy**(`o:Matrix`):`Matrix`
 - **set**(`a:number, b:number, c:number, d:number, tx:number, ty:number`):`Matrix`
 - **add**(`o:Matrix`):`Matrix`
 - **sub**(`o:Matrix`):`Matrix`
 - **scaler**(`s:number`):`Matrix`
 - **invert**():`Matrix`
 - **multiply**(`o:Matrix`):`Matrix`
 - **rotate**(`rad:number`):`Matrix`
 - **scale**(`x:number, y:number`):`Matrix`
 - **translate**(`x:number, y:number`):`Matrix`
 - **fromRotation**(`rad:number`):`Matrix`
 - **fromScale**(`x:number, y:number`):`Matrix`
 - **fromTranslation**(`x:number, y:number`):`Matrix`

# class Mouse
### Members
 - **Mouse.x**:`number`
 - **Mouse.y**:`number`
 - **Mouse.position**:`Vector`
 - **Mouse.absolute**:`Vector`
 - **Mouse.left**:`boolean`
 - **Mouse.leftPressed**:`boolean`
 - **Mouse.leftReleased**:`boolean`
 - **Mouse.right**:`boolean`
 - **Mouse.rightPressed**:`boolean`
 - **Mouse.rightReleased**:`boolean`

### Methods
 - **Mouse.init**():`void`
 - **Mouse.update**():`void`

# class Particle
### Members
 - **x**:`number`
 - **y**:`number`
 - **percent**:`number`
 - **duration**:`number`
 - **colorFrom**:`Color`
 - **colorTo**:`Color`
 - **scaleFromX**:`number`
 - **scaleToX**:`number`
 - **scaleFromY**:`number`
 - **scaleToY**:`number`
 - **rotationFrom**:`number`
 - **rotationTo**:`number`
 - **alphaFrom**:`number`
 - **alphaTo**:`number`
 - **speedX**:`number`
 - **speedY**:`number`
 - **accelX**:`number`
 - **accelY**:`number`
 - **frictionX**:`number`
 - **frictionY**:`number`

# class ParticleSystem
##### extends [Component](#class-component)
### Members
 - **template**:`ParticleTemplate`
 - **renderRelativeToEntity**:`boolean`

### Methods
 - **constructor**(`template:string`):`void`
 - **update**():`void`
 - **render**(`camera:Camera`):`void`
 - **burst**(`x:number, y:number, direction:number, rangeX?:number, rangeY?:number, count?:number`):`void`

# class ParticleTemplate
### Members
 - **ParticleTemplate.templates**:`{[name:string]:ParticleTemplate;}`
 - **name**:`string`
 - **speedBase**:`number`
 - **speedRange**:`number`
 - **accelBaseX**:`number`
 - **accelRangeX**:`number`
 - **accelBaseY**:`number`
 - **accelRangeY**:`number`
 - **frictionBaseX**:`number`
 - **frictionRangeX**:`number`
 - **frictionBaseY**:`number`
 - **frictionRangeY**:`number`
 - **colorsFrom**:`Color[]`
 - **colorsTo**:`Color[]`
 - **colorEaser**:`(number)=>number`
 - **alphaFromBase**:`number`
 - **alphaFromRange**:`number`
 - **alphaToBase**:`number`
 - **alphaToRange**:`number`
 - **alphaEaser**:`(number)=>number`
 - **rotationFromBase**:`number`
 - **rotationFromRange**:`number`
 - **rotationToBase**:`number`
 - **rotationToRange**:`number`
 - **rotationEaser**:`(number)=>number`
 - **scaleFromBaseX**:`number`
 - **scaleFromRangeX**:`number`
 - **scaleToBaseX**:`number`
 - **scaleToRangeX**:`number`
 - **scaleXEaser**:`(number)=>number`
 - **scaleFromBaseY**:`number`
 - **scaleFromRangeY**:`number`
 - **scaleToBaseY**:`number`
 - **scaleToRangeY**:`number`
 - **scaleYEaser**:`(number)=>number`
 - **durationBase**:`number`
 - **durationRange**:`number`

### Methods
 - **constructor**(`name:string`):`void`
 - **speed**(`Base:number, Range?:number`):`ParticleTemplate`
 - **accelX**(`Base:number, Range?:number`):`ParticleTemplate`
 - **accelY**(`Base:number, Range?:number`):`ParticleTemplate`
 - **frictionX**(`Base:number, Range?:number`):`ParticleTemplate`
 - **frictionY**(`Base:number, Range?:number`):`ParticleTemplate`
 - **colors**(`from:Color[], to?:Color[]`):`ParticleTemplate`
 - **colorEase**(`easer:(number)=>number`):`ParticleTemplate`
 - **alpha**(`Base:number, Range?:number`):`ParticleTemplate`
 - **alphaFrom**(`Base:number, Range?:number`):`ParticleTemplate`
 - **alphaTo**(`Base:number, Range?:number`):`ParticleTemplate`
 - **alphaEase**(`easer:(number)=>number`):`ParticleTemplate`
 - **rotation**(`Base:number, Range?:number`):`ParticleTemplate`
 - **rotationFrom**(`Base:number, Range?:number`):`ParticleTemplate`
 - **rotationTo**(`Base:number, Range?:number`):`ParticleTemplate`
 - **rotationEase**(`easer:(number)=>number`):`ParticleTemplate`
 - **scale**(`Base:number, Range?:number`):`ParticleTemplate`
 - **scaleFrom**(`Base:number, Range?:number`):`ParticleTemplate`
 - **scaleTo**(`Base:number, Range?:number`):`ParticleTemplate`
 - **scaleEase**(`easer:(number)=>number`):`ParticleTemplate`
 - **scaleX**(`Base:number, Range?:number`):`ParticleTemplate`
 - **scaleFromX**(`Base:number, Range?:number`):`ParticleTemplate`
 - **scaleToX**(`Base:number, Range?:number`):`ParticleTemplate`
 - **scaleY**(`Base:number, Range?:number`):`ParticleTemplate`
 - **scaleXEase**(`easer:(number)=>number`):`ParticleTemplate`
 - **scaleFromY**(`Base:number, Range?:number`):`ParticleTemplate`
 - **scaleToY**(`Base:number, Range?:number`):`ParticleTemplate`
 - **scaleYEase**(`easer:(number)=>number`):`ParticleTemplate`
 - **duration**(`Base:number, Range?:number`):`ParticleTemplate`

# class Physics
##### extends [Hitbox](#class-hitbox)
### Members
 - **solids**:`string[]`
 - **onCollideX**:`(hit:Collider)=>void`
 - **onCollideY**:`(hit:Collider)=>void`
 - **speed**:`Vector`

### Methods
 - **constructor**(`left:number, top:number, width:number, height:number, tags?:string[], solids?:string[]`):`void`
 - **update**():`void`
 - **move**(`x:number, y:number`):`boolean`
 - **moveX**(`amount:number`):`boolean`
 - **moveXAbsolute**(`amount:number`):`boolean`
 - **moveY**(`amount:number`):`boolean`
 - **moveYAbsolute**(`amount:number`):`boolean`
 - **friction**(`fx:number, fy:number`):`Physics`
 - **maxspeed**(`mx?:number, my?:number`):`Physics`
 - **circularMaxspeed**(`length:number`):`Physics`
 - **stop**():`void`

# class PrimitiveRenderer
##### extends [Renderer](#class-renderer)
	Uses the Primitive Shader when rendering

### Methods
 - **constructor**():`void`

# class Rectangle
### Members
 - **x**:`number`
 - **y**:`number`
 - **width**:`number`
 - **height**:`number`
 - **left**:`number`
 - **right**:`number`
 - **top**:`number`
 - **bottom**:`number`

### Methods
 - **constructor**(`x?:number, y?:number, w?:number, h?:number`):`void`
 - **set**(`x:number, y:number, w:number, h:number`):`Rectangle`
 - **cropRect**(`r:Rectangle`):`Rectangle`
 - **crop**(`x:number, y:number, w:number, h:number, ref?:Rectangle`):`Rectangle`
 - **clone**():`Rectangle`
 - **copy**(`from:Rectangle`):`Rectangle`

# class Rectsprite
##### extends [Component](#class-component)
### Members
 - **size**:`Vector`
 - **scale**:`Vector`
 - **origin**:`Vector`
 - **rotation**:`number`
 - **color**:`Color`
 - **alpha**:`number`
 - **width**:`number`
 - **height**:`number`

### Methods
 - **constructor**(`width:number, height:number, color?:Color`):`void`
 - **render**():`void`

# class RenderTarget
### Members
 - **texture**:`FosterWebGLTexture`
 - **frameBuffer**:`WebGLFramebuffer`
 - **vertexBuffer**:`WebGLBuffer`
 - **texcoordBuffer**:`WebGLBuffer`
 - **colorBuffer**:`WebGLBuffer`
 - **width**:`number`
 - **height**:`number`

### Methods
 - **constructor**(`buffer:WebGLFramebuffer, texture:FosterWebGLTexture, vertexBuffer:WebGLBuffer, colorBuffer:WebGLBuffer, texcoordBuffer:WebGLBuffer`):`void`
 - **dispose**():`void`
 - **RenderTarget.create**(`width:number, height:number`):`RenderTarget`

# class Renderer
	Used by the Scene to render. A Scene can have multiple renderers that essentially act as separate layers / draw calls

### Members
 - **visible**:`boolean`

	If this renderer is visible

 - **target**:`RenderTarget`

	Current Render Target. null means it will draw to the screen

 - **clearTargetColor**:`Color`

	Clear color when drawing (defaults to transparent)

 - **scene**:`Scene`

	The scene we're in

 - **camera**:`Camera`

	Camera that is applied to the shader during rendering. Falls back to Scene.camera if null

 - **groupsMask**:`string[]`

	Only draws entities of the given mask, if set (otherwise draws all entities)

 - **shader**:`Shader`

	Current Shader used by the Renderer

 - **shaderCameraUniformName**:`string`

	Shader Camera Matrix uniform (applies the camera matrix to this when rendering)


### Methods
 - **update**():`void`

	Called during Scene.update

 - **preRender**():`void`

	Called before Render

 - **render**():`void`

	Renders the Renderer

 - **postRender**():`void`

	Called after Render

 - **dispose**():`void`

	Called when the Scene is disposed (cleans up our Target, if we have one)


# enum ResolutionStyle
 - **None** = `0`	Renders the buffer at the Center of the Screen with no scaling
 - **Exact** = `1`	Renders the buffer to an exact fit of the Screen (stretching)
 - **Contain** = `2`	Renders the buffer so that it is contained within the Screen
 - **ContainInteger** = `3`	Renders the buffer so that it is contained within the Screen, rounded to an Integer scale
 - **Fill** = `4`	Renders the buffer so that it fills the Screen (cropping the buffer)
 - **FillInteger** = `5`	Renders the buffer so that it fills the Screen (cropping the buffer), rounded to an Integer scale

# class Scene
### Members
 - **camera**:`Camera`

	The Camera in the Scene

 - **entities**:`Entity[]`

	A list of all the Entities in the Scene

 - **renderers**:`Renderer[]`

	A list of all the Renderers in the Scene

 - **sorting**:`Entity[]`

	List of entities about to be sorted by depth


### Methods
 - **constructor**():`void`
 - **begin**():`void`

	Called when this Scene begins (after Engine.scene has been set)

 - **ended**():`void`

	Called when this Scene ends (Engine.scene is going to a new scene)

 - **dispose**():`void`

	Disposes this scene

 - **update**():`void`

	Called every frame and updates the Scene

 - **render**():`void`

	Called when the Scene should be rendered, and renders each of its Renderers

 - **add**(`entity:Entity, position?:Vector`):`Entity`

	Adds the given Entity to this Scene
	 - **entity**:`Entity` The Entity to add
	 - **position** The optional position to add the Entity at

 - **recreate**(`bucket:string`):`Entity`

	Recreates and adds an Entity from the cache in the given bucket. If there are no entities cache'd in that bucket, NULL is returned
	 - **bucket**:`string` The bucket to pull from

 - **recycle**(`bucket:string, entity:Entity`):`void`

	Recycles an entity into the given bucket & removes it from the Scene
	 - **bucket**:`string` The bucket to recycle the entity into
	 - **entity**:`Entity` The entity to recycle & remove

 - **remove**(`entity:Entity`):`void`

	Removes the given Entity from the scene
	 - **entity**:`Entity` The entity to remove

 - **removeAt**(`index:number`):`void`

	Removes an Entity from Scene.entities at the given index
	 - **index**:`number` The Index to remove at

 - **removeAll**():`void`

	Removes every Entity from the Scene

 - **destroy**(`entity:Entity`):`void`

	Destroys the given entity (calls Entity.destroy, sets Entity.instantiated to false)
	 - **entity**:`Entity` The entity to destroy

 - **find**`<T extends Entity>`(`className:Function`):`T`
 - **findAll**`<T extends Entity>`(`className:Function`):`T[]`
 - **firstEntityInGroup**(`group:string`):`Entity`
 - **allEntitiesInGroup**(`group:string`):`Entity[]`
 - **allEntitiesInGroups**(`groups:string[]`):`Entity[]`
 - **firstColliderInTag**(`tag:string`):`Collider`
 - **allCollidersInTag**(`tag:string`):`Collider[]`
 - **addRenderer**(`renderer:Renderer`):`Renderer`
 - **removeRenderer**(`renderer:Renderer, dispose:boolean`):`Renderer`

# class Shader
### Members
 - **program**:`WebGLProgram`
 - **uniforms**:`ShaderUniform[]`
 - **attributes**:`ShaderAttribute[]`
 - **dirty**:`boolean`
 - **sampler2d**:`ShaderUniform`

### Methods
 - **constructor**(`vertex:string, fragment:string, uniforms:ShaderUniform[], attributes:ShaderAttribute[]`):`void`
 - **set**(`name:string, value:any`):`void`

# class ShaderAttribute
### Members
 - **name**:`string`
 - **type**:`ShaderAttributeType`
 - **attribute**:`number`

### Methods
 - **constructor**(`name:string, type:ShaderAttributeType`):`void`

# enum ShaderAttributeType
 - **Position** = `0`
 - **Texcoord** = `1`
 - **Color** = `2`

# class ShaderUniform
### Members
 - **name**:`string`
 - **type**:`ShaderUniformType`
 - **uniform**:`WebGLUniformLocation`
 - **dirty**:`boolean`
 - **value**:`any`
 - **shader**:`Shader`

### Methods
 - **constructor**(`name:string, type:ShaderUniformType, value?:any`):`void`

# enum ShaderUniformType
 - **float** = `0`
 - **floatArray** = `1`
 - **float2** = `2`
 - **float2Array** = `3`
 - **float3** = `4`
 - **float3Array** = `5`
 - **float4** = `6`
 - **float4Array** = `7`
 - **matrix2d** = `8`
 - **matrix3d** = `9`
 - **matrix4d** = `10`
 - **int** = `11`
 - **intArray** = `12`
 - **int2** = `13`
 - **int2Array** = `14`
 - **int3** = `15`
 - **int3Array** = `16`
 - **int4** = `17`
 - **int4Array** = `18`
 - **sampler2D** = `19`

# class Shaders
### Members
 - **Shaders.texture**:`Shader`
 - **Shaders.solid**:`Shader`
 - **Shaders.primitive**:`Shader`

### Methods
 - **Shaders.init**():`void`

# class Sprite
##### extends [Graphic](#class-graphic)
### Members
 - **animation**:`AnimationSet`
 - **playing**:`AnimationTemplate`
 - **frame**:`number`
 - **rate**:`number`

### Methods
 - **constructor**(`animation:string`):`void`
 - **play**(`name:string, restart?:boolean`):`void`
 - **has**(`name:string`):`boolean`
 - **update**():`void`
 - **render**(`camera:Camera`):`void`

# class SpriteRenderer
##### extends [Renderer](#class-renderer)
	Uses the Texture Shader when rendering

### Methods
 - **constructor**():`void`

# class Texture
### Members
 - **bounds**:`Rectangle`
 - **frame**:`Rectangle`
 - **texture**:`FosterWebGLTexture`
 - **center**:`Vector`
 - **width**:`number`
 - **height**:`number`
 - **clippedWidth**:`number`
 - **clippedHeight**:`number`

### Methods
 - **constructor**(`texture:FosterWebGLTexture, bounds?:Rectangle, frame?:Rectangle`):`void`
 - **getSubtexture**(`clip:Rectangle, sub?:Texture`):`Texture`
 - **clone**():`Texture`
 - **toString**():`string`
 - **draw**(`position:Vector, origin?:Vector, scale?:Vector, rotation?:number, color?:Color, flipX?:boolean, flipY?:boolean`):`void`
 - **drawCropped**(`position:Vector, crop:Rectangle, origin?:Vector, scale?:Vector, rotation?:number, color?:Color, flipX?:boolean, flipY?:boolean`):`void`
 - **drawCenter**(`position:Vector, scale?:Vector, rotation?:number, color?:Color, flipX?:boolean, flipY?:boolean`):`void`
 - **drawCenterCropped**(`position:Vector, crop:Rectangle, scale?:Vector, rotation?:number, color?:Color, flipX?:boolean, flipY?:boolean`):`void`
 - **drawJustify**(`position:Vector, justify:Vector, scale?:Vector, rotation?:number, color?:Color, flipX?:boolean, flipY?:boolean`):`void`
 - **drawJustifyCropped**(`position:Vector, crop:Rectangle, justify:Vector, scale?:Vector, rotation?:number, color?:Color, flipX?:boolean, flipY?:boolean`):`void`
 - **dispose**():`void`
 - **Texture.create**(`image:HTMLImageElement`):`Texture`

# class Tilemap
##### extends [Component](#class-component)
### Members
 - **texture**:`Texture`
 - **tileWidth**:`number`
 - **tileHeight**:`number`
 - **color**:`Color`
 - **alpha**:`number`

### Methods
 - **constructor**(`texture:Texture, tileWidth:number, tileHeight:number`):`void`
 - **set**(`tileX:number, tileY:number, mapX:number, mapY:number, mapWidth?:number, mapHeight?:number`):`Tilemap`
 - **clear**(`mapX:number, mapY:number, mapWidth?:number, mapHeight?:number`):`Tilemap`
 - **has**(`mapX:number, mapY:number`):`boolean`
 - **get**(`mapX:number, mapY:number`):`Vector`
 - **render**(`camera:Camera`):`void`

# class Tween
##### extends [Component](#class-component)
### Members
 - **percent**:`number`

	Gets the current Percent of the Tween

 - **duration**:`number`

	Gets the current Duration of the Tween

 - **value**:`number`

	The value of the Tween at the current Percent

 - **from**:`number`

	From value of the Tween (when percent is 0)

 - **to**:`number`

	To value of the Tween (when percent is 1)

 - **ease**:`(number)=>number`

	Easer function (ex. Linear would be (p) => { return p; })
 Alternatively, use the static Ease methods

 - **step**:`(number)=>void`

	Callback when the Tween is updated, returning the current Value

 - **removeOnComplete**:`boolean`

	If the Tween should be removed upon completion


### Methods
 - **constructor**():`void`
 - **start**(`duration:number, from:number, to:number, ease:(number)=>number, step:(number)=>void, removeOnComplete?:boolean`):`Tween`

	Initializes the Tween and begins running

 - **restart**():`Tween`

	Restarts the current Tween

 - **resume**():`Tween`

	Resumes the current tween if it was paused

 - **pause**():`Tween`

	Pauses the current tween if it was active

 - **update**():`void`

	Upates the tween (automatically called when its Entity is updated)

 - **Tween.create**(`on:Entity`):`Tween`

	Creates a new tween on an existing entity


# class Vector
### Members
 - **x**:`number`
 - **y**:`number`
 - **length**:`number`
 - **normal**:`Vector`
 - **Vector.directions**:`Vector[]`
 - **Vector.temp0**:`Vector`
 - **Vector.temp1**:`Vector`
 - **Vector.temp2**:`Vector`
 - **Vector.zero**:`Vector`

### Methods
 - **constructor**(`x?:number, y?:number`):`void`
 - **set**(`x:number, y:number`):`Vector`
 - **copy**(`v:Vector`):`Vector`
 - **add**(`v:Vector`):`Vector`
 - **sub**(`v:Vector`):`Vector`
 - **mult**(`v:Vector`):`Vector`
 - **div**(`v:Vector`):`Vector`
 - **scale**(`s:number`):`Vector`
 - **rotate**(`sin:number, cos:number`):`Vector`
 - **transform**(`m:Matrix`):`Vector`
 - **clone**():`Vector`
 - **normalize**():`Vector`

# var setGLUniformValue
	Dictionary of Methods to handle setting GL Uniform Values

type:`{[type:number]:(gl:WebGLRenderingContext,location:WebGLUniformLocation,value:any)=>void;}`
