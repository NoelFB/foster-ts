import {Assets, Atlas, AtlasReader, AudioSource, Texture} from "./";
import {Engine, IO} from "./../core";

/**
 * Loads a set of assets
 */
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
	public callback:() => void;

	/**
	 * The Percentage towards being finished loading
	 */
	public get percent():number { return this.assetsLoaded / this.assets; }

	private assets:number = 0;
	private assetsLoaded:number = 0;
	private textures:string[] = [];
	private jsons:string[] = [];
	private xmls:string[] = [];
	private sounds:any[] = [];
	private atlases:any[] = [];
	private texts:string[] = [];

	constructor(root?:string)
	{
		this.root = root || "";
	}

	/**
	 * Adds the Texture to the loader
	 */
	public addTexture(path:string):AssetLoader
	{
		if (this.loading || this.loaded)
			throw new Error("Cannot add more assets when already loaded");
		this.textures.push(path);
		this.assets ++;
		return this;
	}

	/**
	 * Adds the JSON to the loader
	 */
	public addJson(path:string):AssetLoader
	{
		if (this.loading || this.loaded)
			throw new Error("Cannot add more assets when already loaded");
		this.jsons.push(path);
		this.assets ++;
		return this;
	}

	/**
	 * Adds the XML to the loader
	 */
	public addXml(path:string):AssetLoader
	{
		if (this.loading || this.loaded)
			throw new Error("Cannot add more assets when already loaded");
		this.xmls.push(path);
		this.assets ++;
		return this;
	}

	/**
	 * Adds the text to the loader
	 */
	public addText(path:string):AssetLoader
	{
		if (this.loading || this.loaded)
			throw new Error("Cannot add more assets when already loaded");
		this.texts.push(path);
		this.assets ++;
		return this;
	}

	/**
	 * Adds the sound to the loader
	 */
	public addSound(handle:string, path:string):AssetLoader
	{
		if (this.loading || this.loaded)
			throw new Error("Cannot add more assets when already loaded");
		this.sounds.push({handle, path });
		this.assets ++;
		return this;
	}

	/**
	 * Adds the atlas to the loader
	 */
	public addAtlas(name:string, image:string, data:string, loader:AtlasReader):AssetLoader
	{
		if (this.loading || this.loaded)
			throw new Error("Cannot add more assets when already loaded");
		this.atlases.push({ name, image, data, loader });
		this.assets += 3;
		return this;
	}

	/**
	 * Begins loading all the assets and invokes Callback upon completion
	 */
	public load(callback?:() => void):void
	{
		this._loading = true;
		this.callback = callback;

		// textures
		for (const texture of this.textures)
			this.loadTexture(IO.join(this.root, texture));

		// json files
		for (const json of this.jsons)
			this.loadJson(IO.join(this.root, json));

		// xml files
		for (const xml of this.xmls)
			this.loadXml(IO.join(this.root, xml));

		// text files
		for (const text of this.texts)
			this.loadText(IO.join(this.root, text));

		// sounds
		for (const sound of this.sounds)
			this.loadSound(sound.handle, IO.join(this.root, sound.path));

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

		// TODO:IMPLEMENT THIS
		throw new Error("Asset Unloading not Implemented");
	}

	private loadTexture(path:string, callback?:(texture:Texture) => void):void
	{
		const gl = Engine.graphics.gl;
		const img = new Image();

		img.addEventListener("load", () =>
		{
			const tex = Texture.create(img);
			tex.texture.path = path;
			Assets.textures[this.pathify(path)] = tex;

			if (callback !== undefined)
				callback(tex);

			this.incrementLoader();
		});
		img.src = path;
	}

	private loadJson(path:string, callback?:(json:object) => void):void
	{
		const self = this;
		IO.read(path, (data) =>
		{
			const p = this.pathify(path);
			Assets.json[p] = JSON.parse(data);

			if (callback !== undefined)
				callback(Assets.json[p]);

			self.incrementLoader();
		});
	}

	private loadXml(path:string, callback?:(xml:object) => void):void
	{
		IO.read(path, (data) =>
		{
			const p = this.pathify(path);
			Assets.xml[p] = (new DOMParser()).parseFromString(data, "text/xml");

			if (callback !== undefined)
				callback(Assets.xml[p]);

			this.incrementLoader();
		});
	}

	private loadText(path:string, callback?:(text:string) => void):void
	{
		IO.read(path, (data) =>
		{
			const p = this.pathify(path);
			Assets.text[p] = data;

			if (callback !== undefined)
				callback(Assets.text[p]);

			this.incrementLoader();
		});
	}

	private loadSound(handle:string, path:string, callback?:(sound:AudioSource) => void):void
	{
		const audio = new Audio();
		audio.addEventListener("loadeddata", () =>
		{
			Assets.sounds[handle] = new AudioSource(path, audio);
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
		this.loadText(IO.join(this.root, data.data), (text) => { atlasdata = text; check(); });
		this.loadTexture(IO.join(this.root, data.image), (tex) => { texture = tex; check(); });
	}

	private incrementLoader()
	{
		this.assetsLoaded ++;
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
