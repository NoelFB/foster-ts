/**
 * Loads a set of assets
 */
class AssetLoader
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
			throw "Cannot add more assets when already loaded";
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
			throw "Cannot add more assets when already loaded";
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
			throw "Cannot add more assets when already loaded";
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
			throw "Cannot add more assets when already loaded";
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
			throw "Cannot add more assets when already loaded";
		this.sounds.push({handle: handle, path: path });
		this.assets ++;
		return this;
	}

	/**
	 * Adds the atlas to the loader
	 */
	public addAtlas(name:string, image:string, data:string, loader:AtlasReader):AssetLoader
	{
		if (this.loading || this.loaded)
			throw "Cannot add more assets when already loaded";
		this.atlases.push({ name: name, image: image, data: data, loader: loader });
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
		for (let i = 0; i < this.textures.length; i ++)
			this.loadTexture(FosterIO.join(this.root, this.textures[i]));

		// json files
		for (let i = 0; i < this.jsons.length; i ++)
			this.loadJson(FosterIO.join(this.root, this.jsons[i]));

		// xml files
		for (let i = 0; i < this.xmls.length; i ++)
			this.loadXml(FosterIO.join(this.root, this.xmls[i]));

		// text files
		for (let i = 0; i < this.texts.length; i ++)
			this.loadText(FosterIO.join(this.root, this.texts[i]));

		// sounds
		for (let i = 0; i < this.sounds.length; i ++)
			this.loadSound(this.sounds[i].handle, FosterIO.join(this.root, this.sounds[i].path));

		// atlases
		for (let i = 0; i < this.atlases.length; i ++)
			this.loadAtlas(this.atlases[i]);
	}

	/**
	 * Unloads all the Assets that this Asset Loader loaded
	 */
	public unload():void
	{
		if (this.loading)
			throw "Cannot unload until finished loading";
		if (!this.loaded)
			throw "Cannot unload before loading";

		// TODO: IMPLEMENT THIS
		throw "Asset Unloading not Implemented";
	}
	
	private loadTexture(path:string, callback?:(texture:Texture)=>void):void
	{
		let gl = Engine.graphics.gl;
		let img = new Image();

		img.addEventListener('load', () =>
		{
			let tex = Texture.create(img);
			tex.texture.path = path;
			Assets.textures[this.pathify(path)] = tex;
			
			if (callback != undefined)
				callback(tex);

			this.incrementLoader();
		})
		img.src = path;
	}

	private loadJson(path:string, callback?:(json:Object)=>void):void
	{
		var self = this;
		FosterIO.read(path, (data) =>
		{
			let p = this.pathify(path);
			Assets.json[p] = JSON.parse(data);

			if (callback != undefined)
				callback(Assets.json[p]);
				
			self.incrementLoader();
		});
	}

	private loadXml(path:string, callback?:(xml:Object)=>void):void
	{
		FosterIO.read(path, (data) =>
		{
			let p = this.pathify(path);
			Assets.xml[p] = (new DOMParser()).parseFromString(data, "text/xml");
			
			if (callback != undefined)
				callback(Assets.xml[p]);
				
			this.incrementLoader();
		});
	}
	
	private loadText(path:string, callback?:(text:string)=>void):void
	{
		FosterIO.read(path, (data) =>
		{
			let p = this.pathify(path);
			Assets.text[p] = data;
			
			if (callback != undefined)
				callback(Assets.text[p]);
				
			this.incrementLoader();
		});
	}

	private loadSound(handle:string, path:string, callback?:(sound:AudioSource)=>void):void
	{
		let audio = new Audio();
		audio.addEventListener("loadeddata", () =>
		{
			Assets.sounds[handle] = new AudioSource(path, audio);
			if (callback != undefined)
				callback(Assets.sounds[handle]);
			this.incrementLoader();
		});
		audio.src = path;
	}

	private loadAtlas(data:any):void
	{
		var self = this;
		var texture:Texture = null;
		var atlasdata:string = null;

		// check to see if both the texture and data file are done
		// if they are, then create the atlas object
		function check()
		{
			if (texture == null || atlasdata == null)
				return;
			
			let atlas = new Atlas(data.name, texture, atlasdata, data.loader);
			Assets.atlases[atlas.name] = atlas;
			self.incrementLoader();
		}
		
		// load atlas texture file
		this.loadText(FosterIO.join(this.root, data.data), (text) => { atlasdata = text; check(); });
		this.loadTexture(FosterIO.join(this.root, data.image), (tex) => { texture = tex; check(); });
	}

	private incrementLoader()
	{
		this.assetsLoaded ++;
		if (this.assetsLoaded == this.assets)
		{
			this._loaded = true;
			this._loading = false;
			if (this.callback != undefined)
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