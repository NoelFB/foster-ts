/**
 * Loads a set of assets
 */
import {AudioSource} from "../assets/audio/AudioSource";
import {Engine} from "../engine";
import {Color} from "../util/color";
import {FosterIO} from "../util/io";
import {Assets} from "./assets";
import {Atlas, AtlasReader} from "./textures/atlas";
import {Texture} from "./textures/texture";

export class AssetLoader
{
	/**
	 * The root directory to load from
	 */
	public root:string = "";

	/**
	 * If the Asset Loader is loading
	 */
	public get loading():boolean { return this._loading; }
	private _loading:boolean = false;

	/**
	 * If the Asset Loader has finished loading
	 */
	public get loaded():boolean { return this._loaded; }
	public _loaded:boolean = false;

	/**
	 * Called when the Asset Loader has finished loading
	 */
	public callback:()=>void;

	progressCallback:(n:number)=>void;

	/**
	 * The Percentage towards being finished loading
	 */
	public get percent():number { return this.assetsLoaded / this.assets; }

	private assets:number = 0;
	private assetsLoaded:number = 0;
	private textures:Array<{path:string; colorKey:Color}> = [];
	private jsons:string[] = [];
	private xmls:string[] = [];
	private sounds:any[] = [];
	private atlases:any[] = [];
	private texts:string[] = [];

	constructor(root?:string)
	{
		this.root = root || "";
	}

	checkLoading():void
	{
		if (this.loading || this.loaded)
			throw new Error("Cannot add more assets when already loaded");
	}

	/**
	 * Adds the Texture to the loader
	 */
	public addTexture(path:string, colorKey:Color = null):AssetLoader
	{
		this.checkLoading();
		this.textures.push({path, colorKey});
		this.assets ++;
		return this;
	}

	/**
	 * Adds the JSON to the loader
	 */
	public addJson(path:string):AssetLoader
	{
		this.checkLoading();
		this.jsons.push(path);
		this.assets ++;
		return this;
	}

	/**
	 * Adds the XML to the loader
	 */
	public addXml(path:string):AssetLoader
	{
		this.checkLoading();
		this.xmls.push(path);
		this.assets ++;
		return this;
	}

	/**
	 * Adds the text to the loader
	 */
	public addText(path:string):AssetLoader
	{
		this.checkLoading();
		this.texts.push(path);
		this.assets ++;
		return this;
	}

	/**
	 * Adds the sound to the loader
	 */
	public addSound(handle:string, path:string):AssetLoader
	{
		this.checkLoading();
		this.sounds.push({handle, path});
		this.assets ++;
		return this;
	}

	/**
	 * Adds the atlas to the loader
	 */
	public addAtlas(name:string, image:string, data:string, loader:AtlasReader):AssetLoader
	{
		this.checkLoading();
		this.atlases.push({name, image, data, loader});
		this.assets += 3;
		return this;
	}

	/**
	 * Begins loading all the assets and invokes Callback upon completion
	 */
	public load(callback?:()=>void):void
	{
		this._loading = true;
		this.callback = callback;

		// textures
		for (const texture of this.textures)
		{
			const fullPath = FosterIO.join(this.root, texture.path);
			this.loadTexture({path: fullPath, colorKey: texture.colorKey});
		}

		// json files
		for (const json of this.jsons)
			this.loadJson(FosterIO.join(this.root, json));

		// xml files
		for (const xml of this.xmls)
			this.loadXml(FosterIO.join(this.root, xml));

		// text files
		for (const text of this.texts)
			this.loadText(FosterIO.join(this.root, text));

		// sounds
		for (const sound of this.sounds)
			this.loadSound(sound.handle, FosterIO.join(this.root, sound.path));

		// atlases
		for (const atlas of this.atlases)
			this.loadAtlas(atlas);
	}

	/**
	 * Unloads all the Assets that this Asset Loader loaded
	 */
	public unload():void
	{
		if (this.loading)
			throw new Error("Cannot unload until finished loading");
		if (!this.loaded)
			throw new Error("Cannot unload before loading");

		// TODO: IMPLEMENT THIS
		throw new Error("Asset Unloading not Implemented");
	}

	pending: {[key:string]:string[]} = {};
	markPending(type:string, path:string, pending=true)
	{
		(window as any).assetLoader = this;
		const p = this.pending[type] || (this.pending[type] = []);
		if (pending)
		{
			p.push(path);
		}
		else
		{
			console.assert(p.indexOf(path) !== -1);
			p.splice(p.indexOf(path), 1)
		}

		let called = false;

		return () => {
			if (called)
				console.warn("finished() called twice for", type, path);
			else
			{
				called = true;
				this.markPending(type, path, false);
			}
		}
	}

	private loadTexture(info:{path:string, colorKey:Color}, callback?:(texture:Texture)=>void):void
	{
		const path = info.path;

		const gl = Engine.graphics.gl;
		const img = new Image();

		const finished = this.markPending("texture", path);

		img.addEventListener("load", () =>
		{
			const tex = Texture.create(img, info.colorKey);
			tex.texture.path = path;
			Assets.textures[this.pathify(path)] = tex;

			finished();

			if (callback !== undefined)
				callback(tex);

			this.incrementLoader();
		});

		img.src = path;
	}

	private loadJson(path:string, callback?:(json:object)=>void):void
	{
		const self = this;
		const finished = this.markPending("json", path);
		FosterIO.read(path, (data) =>
		{
			const p = this.pathify(path);
			Assets.json[p] = JSON.parse(data);

			finished();

			if (callback !== undefined)
				callback(Assets.json[p]);

			self.incrementLoader();
		});
	}

	private loadXml(path:string, callback?:(xml:object)=>void):void
	{
		const finished = this.markPending("xml", path);
		FosterIO.read(path, (data) =>
		{
			const p = this.pathify(path);
			Assets.xml[p] = (new DOMParser()).parseFromString(data, "text/xml");
			finished();

			if (callback !== undefined)
				callback(Assets.xml[p]);

			this.incrementLoader();
		});
	}

	private loadText(path:string, callback?:(text:string)=>void):void
	{
		const finished = this.markPending("text", path);
		FosterIO.read(path, (data) =>
		{
			const p = this.pathify(path);
			Assets.text[p] = data;
			finished();

			if (callback !== undefined)
				callback(Assets.text[p]);

			this.incrementLoader();
		});
	}

	private loadSound(handle:string, path:string, callback?:(sound:AudioSource)=>void):void
	{
		const audio = new Audio();
		const finished = this.markPending("sound", path);
		audio.addEventListener("canplaythrough", () =>
		{
			Assets.sounds[handle] = new AudioSource(path, audio);
			finished();
			if (callback !== undefined)
				callback(Assets.sounds[handle]);
			this.incrementLoader();
		});
		audio.src = path;
	}

	private loadAtlas(data:any):void
	{
		const self = this;
		let texture:Texture = null;
		let atlasdata:string = null;

		// check to see if both the texture and data file are done
		// if they are, then create the atlas object
		function check()
		{
			if (texture == null || atlasdata == null)
				return;

			const atlas = new Atlas(data.name, texture, atlasdata, data.loader);
			Assets.atlases[atlas.name] = atlas;
			self.incrementLoader();
		}

		// load atlas texture file
		this.loadText(FosterIO.join(this.root, data.data), (text) => { atlasdata = text; check(); });
		this.loadTexture({path: FosterIO.join(this.root, data.image), colorKey: null}, (tex) => { texture = tex; check(); });
	}

	private incrementLoader()
	{
		this.assetsLoaded ++;
		if (this.progressCallback)
			this.progressCallback(this.assetsLoaded / this.assets)
		if (this.assetsLoaded === this.assets)
		{
			this._loaded = true;
			this._loading = false;
			if (this.callback !== undefined)
				this.callback();
		}
	}

	private pathify(path:string):string
	{
		while (path.indexOf("\\") >= 0)
			path = path.replace("\\", "/");
		return path;
	}
}
