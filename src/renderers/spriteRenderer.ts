/// <reference path="./../renderer.ts"/>
class SpriteRenderer extends Renderer
{
	constructor()
	{
		super();
		
		this.shader = Shaders.texture;
		this.shaderMatrixUniformName = "matrix";
	}
}