import {Assets} from "./assets/assets"
import {Sound} from "./assets/audio/Sound";
import {Collider} from "./components/colliders/collider";
import * as ColliderTests from "./components/colliders/collidertests";
import {GameWindow} from "./gameWindow";
import {Graphics} from "./graphics";
import {GamepadManager, Keyboard, Mouse} from "./input";
import {Scene} from "./scene";
import {FosterIO} from "./util/io";
import {Shaders} from "./util/shaders";

/// <reference path="../lib/node.d.ts" />

/**
 * Current game Client
 */
export enum Client
{
	/**
	 * Running on the desktop (in Electron)
	 */
	Desktop,
	/**
	 * Running on the Web
	 */
	Web,
}

/**
 * Core of the Foster Engine. Initializes and Runs the game.
 */
export class Engine
{
	/**
	 * Foster Engine version
	 * major.minor.build
	 */
	public static version:string = "0.1.11";

	/**
	 * The root HTML event that the game Canvas is created in (for the actual Canvas element, see Engine.graphics.canvas)
	 */
	public static get root():HTMLElement { return Engine.instance.root; }

	/**
	 * Current Client (Client.Desktop if in Electron and Client.Web if in the browser)
	 */
	public static get client():Client { return Engine.instance.client; }

	/**
	 * Gets the current game Scene
	 */
	public static get scene():Scene
	{
		return (Engine.instance.nextScene != null ? Engine.instance.nextScene : Engine.instance.scene);
	}

	/**
	 * Gets the Game Width, before being scaled up / down to fit in the screen
	 */
	public static get width():number { return Engine.instance.width; }

	/**
	 * Gets the Game Height, before being scaled up / down to fit in the screen
	 */
	public static get height():number { return Engine.instance.height; }

	/**
	 * Toggles Debug Mode, which shows hitboxes and allows entities to be dragged around
	 */
	public static get debugMode():boolean { return Engine.instance.debuggerEnabled; }
	public static set debugMode(v:boolean) { Engine.instance.debuggerEnabled = v; }

	/**
	 * Delta Time (time, in seconds, since the last frame)
	 */
	public static get delta():number { return Engine.instance.paused ? 0 : Engine.instance.dt; }

	/**
	 * Total elapsed game time (time, in seconds, since the Engine was started)
	 */
	public static get elapsed():number { return Engine.instance.elapsed; }

	public static get paused():boolean { return this._hidden || Engine.instance.paused; }
	public static set paused(v:boolean) { Engine.instance.paused = v; }

	public static get timeScale():number { return Engine.instance.timeScale; }
	public static set timeScale(v:number) { Engine.instance.timeScale = v; }

	public static get frameCount():number { return Engine.instance.frameCount; }

	/**
	 * Gets the current Engine graphics (used for all rendering)
	 */
	public static get graphics():Graphics { return Engine.instance.graphics; }

	/**
	 * Gets or sets the global sound volume multiplier
	 */
	public static get volume():number { return Engine._volume; }
	public static set volume(n:number)
	{
		Engine._volume = n;
		for (const sound of Sound.active)
			sound.volume = sound.volume;
	}
	private static _volume:number = 1;

	/**
	 * Mutes or Unmutes the entire game
	 */
	public static get muted():boolean { return Engine._muted; }
	public static set muted(m:boolean)
	{
		Engine._muted = m;
		for (const sound of Sound.active)
			sound.muted = sound.muted;
	}
	private static _muted:boolean = false;

	/**
	 * Starts up the Game Engine
	 * @param title 	Window Title
	 * @param width 	Game Width
	 * @param height 	Game Height
	 * @param scale 	Scales the Window (on Desktop) to width * scale and height * scale
	 * @param ready 	Callback when the Engine is ready
	 */

	private static _hidden = false;
	public static start(title:string, width:number, height:number, scale:number, ready:() => void):void
	{
		// instantiate
		Engine.started = true;
		new Engine();
		new GameWindow();

		// pause when tabbing away
		document.addEventListener("visibilitychange", function() {
			if (document.hidden)
				Engine._hidden = true;
			else
			{
				Engine._hidden = false;
				if (Engine.instance)
					Engine.instance.lastTime = Date.now();
			}
		});

		// window
		GameWindow.title = title;
		GameWindow.resize(width * scale, height * scale);
		GameWindow.center();

		// wait for window
		const onloadFunc = () =>
		{
			const c = String.fromCharCode(0x25cf);
			console.log("%c " + c + " ENGINE START " + c + " ", "background: #222; color: #ff44aa;");
			Engine.instance.root = document.getElementsByTagName("body")[0];

			// init
			ColliderTests.registerDefaultOverlapTests();
			FosterIO.init();
			Engine.instance.graphics = new Graphics(Engine.instance);
			Engine.instance.graphics.load();
			Engine.resize(width, height);
			Shaders.init();
			Mouse.init();
			Keyboard.init();
			GamepadManager.init();

			// start update loop
			Engine.instance.step();

			// ready callback for game
			if (ready !== undefined)
				ready();
		};

		if (document.readyState === "complete" || document.readyState === "interactive") // TODO: is this correct?
			onloadFunc();
		else
			document.addEventListener("DOMContentLoaded", onloadFunc);
	}

	/**
	 * Goes to a new Scene
	 * @param scene 	The Scene to go to
	 * @param disposeLastScene 	If the last scene should be disposed
	 */
	public static goto(scene:Scene, disposeLastScene:boolean):Scene
	{
		const lastScene = Engine.scene;
		Engine.instance.nextScene = scene;
		Engine.instance.disposeLastScene = disposeLastScene;
		return scene;
	}

	/**
	 * Ends the Game
	 */
	public static exit():void
	{
		if (Engine.started && !Engine.exiting)
			Engine.instance.exit();
	}

	/**
	 * Resizes the game to the given size
	 * @param width 	new Game Width
	 * @param height 	new Game Height
	 */
	public static resize(width:number, height:number):void
	{
		Engine.instance.width = width;
		Engine.instance.height = height;
		Engine.instance.graphics.resize();
	}

	static get isMobile() { return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); }

	/**
	 * Checks that the given value is true, otherwise throws an error
	 */
	public static assert(value:boolean, message:string):boolean
	{
		if (!value)
			throw message;
		return value;
	}

	private static instance:Engine = null;
	private static started:boolean = false;
	private static exiting:boolean = false;

	private client:Client;
	private scene:Scene = null;
	private nextScene:Scene = null;
	private disposeLastScene:boolean;
	private width:number;
	private height:number;
	private dt:number = 0;
	private elapsed:number = 0;
	private paused:boolean = false;
	private frameCount:number = 0;
	private startTime:number;
	private lastTime:number = 0;
	private timeScale:number = 1;
	private root:HTMLElement;
	private graphics:Graphics;
	private debuggerEnabled:boolean;

	constructor()
	{
		if (Engine.instance != null)
			throw new Error("Engine has already been instantiated");
		if (!Engine.started)
			throw new Error("Engine must be instantiated through static Engine.start");

		Engine.instance = this;
		this.client = Client.Web;
		if (window &&
			(window as any).process && (window as any).process.versions && (window as any).process.versions.electron)
			this.client = Client.Desktop;
		this.startTime = Date.now();
		this.lastTime = Date.now();
	}


	private step():void
	{
		// time management!
		const time = Date.now();
		this.dt = this.paused ? 0 : Math.floor(time - this.lastTime) / 1000 * this.timeScale;
		//this.elapsed = this.elapsed + this.dt;//Math.floor(time - this.startTime) / 1000;
		this.lastTime = time;
		this.frameCount++;
		this.elapsed += this.dt;

		// update graphics
		this.graphics.update();

		// update inputs
		Mouse.update();
		Keyboard.update();
		GamepadManager.update();

		// swap scenes
		if (this.nextScene != null)
		{
			if (this.scene != null)
			{
				this.scene.ended();
				if (this.disposeLastScene)
					this.scene.dispose();
			}
			this.scene = this.nextScene;
			this.nextScene = null;
			this.scene.begin();
		}

		// update scene
		if (this.scene != null) {
			this.scene.update();
		}

		if (this.nextScene == null)
		{
			// begin drawing
			this.graphics.reset();

			// render current scene
			if (this.scene != null)
				this.scene.render();

			// final flush on graphics
			this.graphics.finalize();
		}

		// update sounds
		for (const sound of Sound.active)
			sound.update();

		// do it all again!
		if (!Engine.exiting)
			requestAnimationFrame(this.step.bind(this));
	}

	private exit()
	{
		Engine.exiting = true;
		Assets.unload();
		Engine.graphics.unload();

		if (Engine.client === Client.Desktop)
		{
			const remote = require("electron").remote;
			const win = remote.getCurrentWindow();
			win.close();
		}
	}

}
