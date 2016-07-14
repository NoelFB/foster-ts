/// <reference path="./fosterWebGLTexture.ts"/>
class RenderTarget
{

	public texture:FosterWebGLTexture;
	public frameBuffer:WebGLFramebuffer;
	public vertexBuffer:WebGLBuffer;
	public uvBuffer:WebGLBuffer;
	public colorBuffer:WebGLBuffer;

	public get width():number { return this.texture.width; }
	public get height():number { return this.texture.height; }

	public constructor(buffer:WebGLFramebuffer, texture:FosterWebGLTexture, vertexBuffer:WebGLBuffer, colorBuffer:WebGLBuffer, uvBuffer:WebGLBuffer)
	{
		this.texture = texture;
		this.frameBuffer = buffer;
		this.vertexBuffer = vertexBuffer;
		this.colorBuffer = colorBuffer;
		this.uvBuffer = uvBuffer;
	}
}