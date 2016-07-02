class Assets
{
	public static textures:{[path: string]:Texture;} = {};
	public static json:{[path:string]:Object;} = {};
	public static xml:{[path:string]:Object;} = {};
	public static text:{[path:string]:string;} = {};
	public static sounds:{[path:string]:HTMLAudioElement} = {};
	public static atlases:{[path:string]:Atlas} = {};
}

class AssetLoader
{
	
	public loading:boolean = false;
	public loaded:boolean = false;
	public callback:()=>void;
	public get percent():number { return this.assetsLoaded / this.assets; }
	
	private assets:number = 0;
	private assetsLoaded:number = 0;
	
	private textures:string[] = [];
	private jsons:string[] = [];
	private xmls:string[] = [];
	private sounds:string[] = [];
	private atlases:any[] = [];
	private texts:string[] = [];

	public addTexture(path:string):AssetLoader
	{
		if (this.loading || this.loaded)
			throw "Cannot add more assets when already loaded";
		this.textures.push(path);
		this.assets ++;
		return this;
	}
	
	public addJson(path:string):AssetLoader
	{
		if (this.loading || this.loaded)
			throw "Cannot add more assets when already loaded";
		this.jsons.push(path);
		this.assets ++;
		return this;
	}

	public addXml(path:string):AssetLoader
	{
		if (this.loading || this.loaded)
			throw "Cannot add more assets when already loaded";
		this.xmls.push(path);
		this.assets ++;
		return this;
	}
	
	public addText(path:string):AssetLoader
	{
		if (this.loading || this.loaded)
			throw "Cannot add more assets when already loaded";
		this.texts.push(path);
		this.assets ++;
		return this;
	}

	public addSound(path:string):AssetLoader
	{
		throw "Audio not implemented yet"
		/*
		if (this.loading || this.loaded)
			throw "Cannot add more assets when already loaded";
		this.sounds.push(path);
		this.assets ++;
		return this;*/
	}

	public addAtlas(name:string, image:string, data:string, type:AtlasType):AssetLoader
	{
		if (this.loading || this.loaded)
			throw "Cannot add more assets when already loaded";
		this.atlases.push({ name: name, image: image, data: data, type: type });
		this.assets += 3;
		return this;
	}
	
	public load(callback?:()=>void):void
	{
		this.loading = true;
		this.callback = callback;
		
		// textures
		for (let i = 0; i < this.textures.length; i ++)
			this.loadTexture(this.textures[i]);

		// json files
		for (let i = 0; i < this.jsons.length; i ++)
			this.loadJson(this.jsons[i]);

		// xml files
		for (let i = 0; i < this.xmls.length; i ++)
			this.loadXml(this.xmls[i]);

		// text files
		for (let i = 0; i < this.texts.length; i ++)
			this.loadText(this.texts[i]);

		// sounds
		for (let i = 0; i < this.sounds.length; i ++)
			this.loadSound(this.sounds[i]);

		// atlases
		for (let i = 0; i < this.atlases.length; i ++)
			this.loadAtlas(this.atlases[i]);
	}

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
		var self = this;

		let gl = Engine.graphics.gl;
		let fglt = new FosterWebGLTexture();
		let img = new Image();

		fglt.path = path;
		img.addEventListener('load', function()
		{
			fglt.width = img.width;
			fglt.height = img.height;
			fglt.webGLTexture = gl.createTexture();
			
			gl.bindTexture(gl.TEXTURE_2D, fglt.webGLTexture);
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_2D, null);
			
			Assets.textures[fglt.path] = new Texture(fglt);
			
			if (callback != undefined)
				callback(Assets.textures[fglt.path]);

			self.incrementLoader();
		})
		img.src = fglt.path;
	}

	private loadJson(path:string, callback?:(json:Object)=>void):void
	{
		var self = this;
		FosterIO.read(path, (data) =>
		{
			Assets.json[path] = JSON.parse(data);

			if (callback != undefined)
				callback(Assets.json[path]);
				
			self.incrementLoader();
		});
	}

	private loadXml(path:string, callback?:(xml:Object)=>void):void
	{
		var self = this;
		FosterIO.read(path, (data) =>
		{
			Assets.xml[path] = (new DOMParser()).parseFromString(data, "text/xml");
			
			if (callback != undefined)
				callback(Assets.xml[path]);
				
			self.incrementLoader();
		});
	}
	
	private loadText(path:string, callback?:(text:string)=>void):void
	{
		var self = this;
		FosterIO.read(path, (data) =>
		{
			Assets.text[path] = data;
			
			if (callback != undefined)
				callback(Assets.text[path]);
				
			self.incrementLoader();
		});
	}

	private loadSound(path:string, callback?:(sound:HTMLAudioElement)=>void):void
	{
		var self = this;
		// todo: LOAD SOUND
		self.incrementLoader();
	}

	private loadAtlas(data:any):void
	{
		var self = this;
		var texture:Texture = null;
		var atlasdata:Object = null;

		// check to see if both the texture and data file are done
		// if they are, then create the atlas object
		function check()
		{
			if (texture == null || atlasdata == null)
				return;
			
			let atlas = new Atlas(data.name, texture, atlasdata, data.type);
			Assets.atlases[atlas.name] = atlas;
			self.incrementLoader();
		}

		// load atlas data file  (XML or JSON)
		if ((/(?:\.([^.]+))?$/).exec(data.data)[1] == "xml")
			this.loadXml(data.data, (xml) => { atlasdata = xml; check(); })
		else
			this.loadJson(data.data, (j) => { atlasdata = j; check(); });

		// load atlas texture file
		this.loadTexture(data.image, (tex) => { texture = tex; check(); });
	}

	private incrementLoader()
	{
		this.assetsLoaded ++;
		if (this.assetsLoaded == this.assets)
		{
			this.loaded = true;
			this.loading = false;
			if (this.callback != undefined)
				this.callback();
		}
	}
}