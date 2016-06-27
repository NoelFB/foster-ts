class Assets
{
	public static textures:{[path: string]:Texture;} = {};
	public static json:{[path:string]:Object;} = {};
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
	private sounds:string[] = [];
	private atlases:any[] = [];

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
	
	public addAudio(path:string):AssetLoader
	{
		if (this.loading || this.loaded)
			throw "Cannot add more assets when already loaded";
		return this;
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
		var self = this;
		this.loading = true;
		this.callback = callback;
		
		// textures
		for (let i = 0; i < this.textures.length; i ++)
			this.loadTexture(this.textures[i]);

		// jsons
		for (let i = 0; i < this.jsons.length; i ++)
			this.loadJson(this.jsons[i]);

		// atlases
		for (let i = 0; i < this.atlases.length; i ++)
			this.loadAtlas(this.atlases[i]);
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

	private loadAtlas(data:any):void
	{
		var self = this;
		var texture:Texture = null;
		var json:Object = null;

		function check()
		{
			if (texture == null || json == null)
				return;
			
			let atlas = new Atlas(data.name, texture, json, data.type);
			Assets.atlases[atlas.name] = atlas;
			self.incrementLoader();
		}

		this.loadTexture(data.image, (tex) => { texture = tex; check(); });
		this.loadJson(data.data, (j) => { json = j; check(); });
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