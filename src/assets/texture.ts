class Texture
{
	public path:string;
	public bounds:Rectangle = null;
	public texture:WebGLTexture = null;
	
	public get width():number { return this.bounds.width; }
	public get height():number { return this.bounds.height; }
}

class Subtexture
{
	public texture:Texture;
	public crop:Rectangle;
	
	public get width():number { return this.crop.width; }
	public get height():number { return this.crop.height; }
	
	constructor(texture:Texture, crop?:Rectangle)
	{
		this.texture = texture;
		
		if (crop)
			this.crop  = this.texture.bounds.cropRect(crop.clone());
		else
			this.crop = new Rectangle(0, 0, texture.width, texture.height);
	}
}
