/// <reference path="./fosterWebGLTexture.ts"/>

/**
 * A Texture used for Rendering
 */
class Texture
{
	/**
	 * The cropped Bounds of the Texture within its WebGL Texture
	 */
	public bounds:Rectangle = null;

	/**
	 * The Frame adds padding around the existing Bounds when rendered
	 */
	public frame:Rectangle = null;

	/**
	 * A reference to the full WebGL Texture
	 */
	public texture:FosterWebGLTexture = null;

	/**
	 * The center point of this texture
	 */
	public center:Vector;

	/**
	 * The width of the Texture when rendered (frame.width)
	 */
	public get width():number { return this.frame.width; }

	/**
	 * The height of the Texture when rendered (frame.height)
	 */
	public get height():number { return this.frame.height; }

	/**
	 * The clipped width of the Texture (bounds.width)
	 */
	public get clippedWidth():number { return this.bounds.width; }

	/**
	 * The clipped height of the Texture (bounds.height)
	 */
	public get clippedHeight():number { return this.bounds.height; }

	/**
	 * Creates a new Texture from the WebGL Texture
	 */
	public constructor(texture:FosterWebGLTexture, bounds?:Rectangle, frame?:Rectangle)
	{
		this.texture = texture;
		this.bounds = bounds || new Rectangle(0, 0, texture.width, texture.height);
		this.frame = frame || new Rectangle(0, 0, this.bounds.width, this.bounds.height);
		this.center = new Vector(this.frame.width / 2, this.frame.height / 2);
	}

	/**
	 * Creates a Subtexture from this texture
	 */
	public getSubtexture(clip:Rectangle, sub?:Texture):Texture
	{
		if (sub == undefined)
			sub = new Texture(this.texture);
		else
			sub.texture = this.texture;
		
		sub.bounds.x = this.bounds.x + Math.max(0, Math.min(this.bounds.width, clip.x + this.frame.x));
		sub.bounds.y = this.bounds.y + Math.max(0, Math.min(this.bounds.height, clip.y + this.frame.y));
		sub.bounds.width = Math.max(0, this.bounds.x + Math.min(this.bounds.width, clip.x + this.frame.x + clip.width) - sub.bounds.x);
		sub.bounds.height = Math.max(0, this.bounds.y + Math.min(this.bounds.height, clip.y + this.frame.y + clip.height) - sub.bounds.y);

		sub.frame.x = Math.min(0, this.frame.x + clip.x);
		sub.frame.y = Math.min(0, this.frame.y + clip.y);
		sub.frame.width = clip.width;
		sub.frame.height = clip.height;
		sub.center = new Vector(sub.frame.width / 2, sub.frame.height / 2);

		return sub;
	}

	/**
	 * Creates a clone of this texture
	 */
	public clone():Texture
	{
		return new Texture(this.texture, this.bounds.clone(), this.frame.clone());
	}
	
	public toString():string
	{
		return (this.texture.path + 
		": [" + this.bounds.x + ", " + this.bounds.y + ", " + this.bounds.width + ", " + this.bounds.height + "]" + 
		"frame["+ this.frame.x + ", " + this.frame.y + ", " + this.frame.width + ", " + this.frame.height +"]");
	}

	/**
	 * Draws this texture
	 */
	public draw(position:Vector, origin?:Vector, scale?:Vector, rotation?:number, color?:Color, flipX?:boolean, flipY?:boolean):void
	{
		Engine.graphics.texture(this, position.x, position.y, null, color, origin, scale, rotation, flipX, flipY);
	}

	/**
	 * Draws a cropped version of this texture
	 */
	public drawCropped(position:Vector, crop:Rectangle, origin?:Vector, scale?:Vector, rotation?:number, color?:Color, flipX?:boolean, flipY?:boolean):void
	{
		Engine.graphics.texture(this, position.x, position.y, crop, color, origin, scale, rotation, flipX, flipY);
	}

	/**
	 * Draws this texture, center aligned
	 */
	public drawCenter(position:Vector, scale?:Vector, rotation?:number, color?:Color, flipX?:boolean, flipY?:boolean):void
	{
		Engine.graphics.texture(this, position.x, position.y, null, color, this.center, scale, rotation, flipX, flipY);
	}
	
	/**
	 * Draws a cropped version of this texture, center aligned
	 */
	public drawCenterCropped(position:Vector, crop:Rectangle, scale?:Vector, rotation?:number, color?:Color, flipX?:boolean, flipY?:boolean):void
	{
		Engine.graphics.texture(this, position.x, position.y, crop, color, new Vector(crop.width / 2, crop.height / 2), scale, rotation, flipX, flipY);
	}

	/**
	 * Draws this texture, justified
	 */
	public drawJustify(position:Vector, justify:Vector, scale?:Vector, rotation?:number, color?:Color, flipX?:boolean, flipY?:boolean):void
	{
		Engine.graphics.texture(this, position.x, position.y, null, color, new Vector(this.width * justify.x, this.height * justify.y), scale, rotation, flipX, flipY);
	}

	/**
	 * Draws a cropped version of this texture, justified
	 */
	public drawJustifyCropped(position:Vector, crop:Rectangle, justify:Vector, scale?:Vector, rotation?:number, color?:Color, flipX?:boolean, flipY?:boolean):void
	{
		Engine.graphics.texture(this, position.x, position.y, crop, color, new Vector(crop.width * justify.x, crop.height * justify.y), scale, rotation, flipX, flipY);
	}

	/**
	 * Disposes this texture and its WebGL Texture
	 */
	public dispose():void
	{
		this.texture.dispose();
		this.texture = null;
	}

	/**
	 * Creats a new Texture from an HTML Image Element
	 */
	public static create(image:HTMLImageElement):Texture
	{
		let gl = Engine.graphics.gl;
		let tex = gl.createTexture();
			
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D, null);

		return new Texture(new FosterWebGLTexture(tex, image.width, image.height));
	}

	/**
	 * Creates a new Texture from the given RGBA array
	 */
	public static createFromData(data:number[], width:number, height:number):Texture
	{
		let gl = Engine.graphics.gl;
		let tex = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(data));
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

		return new Texture(new FosterWebGLTexture(tex, width, height));
	}
}