enum Client
{
	Desktop,
	Web
}

enum EngineMode
{
	Strict,
	Normal
}

class Engine
{

	private static instance:Engine = null;
	private static started:boolean = false;
	
	// properties
	public static get root():HTMLElement { return Engine.instance.root; }
	public static get mode():EngineMode { return Engine.instance.mode; }
	public static get client():Client { return Engine.instance.client; }
	public static get scene():Scene { return (Engine.instance.nextScene != null ? Engine.instance.nextScene : Engine.instance.scene); }
	public static set scene(val:Scene) { Engine.instance.nextScene = val; }
	public static get width():number { return Engine.instance.width; }
	public static get height():number { return Engine.instance.height; }
	public static get debugMode():boolean { return Engine.instance.debuggerEnabled; }
	public static set debugMode(v:boolean) { Engine.instance.debuggerEnabled = v; }

	// time
	public static get delta():number { return Engine.instance.dt; }
	public static get elapsed():number { return Engine.instance.elapsed; }

	// graphics
	public static get graphics():Graphics { return Engine.instance.graphics; }
	public static resize(width:number, height:number):void
	{
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
	public static start(title:string, width:number, height:number, scale:number, mode:EngineMode, ready?:() => void):void
	{
		// instantiate
		Engine.started = true;
		new Engine(mode);
		new GameWindow();

		// window
		GameWindow.title = title;
		GameWindow.resize(width * scale, height * scale);
		GameWindow.center();

		// wait for window
		window.onload = function()
		{
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
		}
	}
	
	public static assert(value:boolean, message:string):boolean
	{
		if (!value)
		{
			if (Engine.mode == EngineMode.Strict)
				throw message;
			else
			{
				console.warn("%c " + message, "background: #222; color: #ff1144;");
			}
		}
		
		return value;
	}
	
	private mode:EngineMode;
	private client:Client;
	private scene:Scene = null;
	private nextScene:Scene = null;
	private width:number;
	private height:number;
	private dt:number;
	private elapsed:number;
	private startTime:number;
	private lastTime:number;
	private root:HTMLElement;
	private graphics:Graphics;
	private debuggerEnabled:boolean;

	constructor(mode:EngineMode)
	{
		if (Engine.instance != null)
			throw "Engine has already been instantiated";
		if (!Engine.started)
			throw "Engine must be instantiated through static Engine.start";

		Engine.instance = this;
		this.mode = mode;
		this.client = Client.Web;
		if (window && (<any>window).process && (<any>window).process.versions && (<any>window).process.versions.electron)
			this.client = Client.Desktop;
		this.startTime = Date.now();
	}

	private step():void
	{
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
		if (this.nextScene != null)
		{
			if (this.scene != null)
				this.scene.ended();
			this.scene = this.nextScene;
			this.nextScene = null;
			this.scene.begin();
		}

		// update scene
		if (this.scene != null)
			this.scene.update()

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