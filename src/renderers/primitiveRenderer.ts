/// <reference path="./../renderer.ts"/>
class PrimitiveRenderer extends Renderer
{
	constructor()
	{
		super();
		
		this.shader = Shaders.primitive;
		this.shaderCameraUniformName = "matrix";
	}
}