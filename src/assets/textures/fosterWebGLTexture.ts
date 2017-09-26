import {Engine} from "./../../core/engine";

/**
 * Internal Texture used for Foster during Rendering
 */
export class FosterWebGLTexture
{
	public path:string;
	public webGLTexture:WebGLTexture;
	public width:number;
	public height:number;
	public disposed:boolean = false;

	constructor(texture:WebGLTexture, width:number, height:number)
	{
		this.webGLTexture = texture;
		this.width = width;
		this.height = height;
	}

	public dispose():void
	{
		if (!this.disposed)
		{
			const gl = Engine.graphics.gl;
			gl.deleteTexture(this.webGLTexture);
			this.path = "";
			this.webGLTexture = null;
			this.width = 1;
			this.height = 1;
			this.disposed = true;
		}
	}
}
