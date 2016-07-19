/// <reference path="./fosterWebGLTexture.ts"/>
class RenderTarget
{

	public texture:FosterWebGLTexture;
	public frameBuffer:WebGLFramebuffer;
	public vertexBuffer:WebGLBuffer;
	public texcoordBuffer:WebGLBuffer;
	public colorBuffer:WebGLBuffer;

	public get width():number { return this.texture.width; }
	public get height():number { return this.texture.height; }

	public constructor(buffer:WebGLFramebuffer, texture:FosterWebGLTexture, vertexBuffer:WebGLBuffer, colorBuffer:WebGLBuffer, texcoordBuffer:WebGLBuffer)
	{
		this.texture = texture;
		this.frameBuffer = buffer;
		this.vertexBuffer = vertexBuffer;
		this.colorBuffer = colorBuffer;
		this.texcoordBuffer = texcoordBuffer;
	}

	public dispose():void
	{
		this.texture.dispose();
		this.texture = null;
		
		let gl = Engine.graphics.gl;
		gl.deleteFramebuffer(this.frameBuffer);
		gl.deleteBuffer(this.vertexBuffer);
		gl.deleteBuffer(this.texcoordBuffer);
		gl.deleteBuffer(this.colorBuffer);
		this.frameBuffer = null;
		this.vertexBuffer = null;
		this.texcoordBuffer = null;
		this.colorBuffer = null;
	}

	public static create(width:number, height:number):RenderTarget
	{
		let gl = Engine.graphics.gl;
		let frameBuffer = gl.createFramebuffer();
		let tex = gl.createTexture();
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

		let vertexBuffer = gl.createBuffer();
		let uvBuffer = gl.createBuffer();
		let colorBuffer = gl.createBuffer();

		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		return new RenderTarget(frameBuffer, new FosterWebGLTexture(tex, width, height), vertexBuffer, colorBuffer, uvBuffer);
	}
}