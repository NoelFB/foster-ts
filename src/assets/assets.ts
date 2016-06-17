class Assets
{
	public static textures:{[path: string]:Texture;} = {};
	public static json:{[path:string]:Object;} = {};
	public static sounds:{[path:string]:HTMLAudioElement} = {};
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
	
	public addTexture(path:string):void
	{
		if (this.loading || this.loaded)
			throw "Cannot add more assets when already loaded";
		this.textures.push(path);
		this.assets ++;
	}
	
	public addJson(path:string):void
	{
		if (this.loading || this.loaded)
			throw "Cannot add more assets when already loaded";
	}
	
	public addAudio(path:string):void
	{
		if (this.loading || this.loaded)
			throw "Cannot add more assets when already loaded";
	}
	
	public load(callback?:()=>void):void
	{
		this.loading = true;
		this.callback = callback;
		
		var self = this;
		let gl = Engine.graphics.gl;
		for (let i = 0; i < this.textures.length; i ++)
		{
			let fglt = new FosterWebGLTexture();
			fglt.path = this.textures[i];
			
			let img = new Image();
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
				self.incrementLoader();
			})
			img.src = fglt.path;
		}
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