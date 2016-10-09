/// <reference path="./../renderer.ts"/>

/**
 * Uses the Texture Shader when rendering
 */
class SpriteRenderer extends Renderer
{
	constructor()
	{
		super();
		
		this.shader = Shaders.texture;
		this.shaderCameraUniformName = "matrix";
	}
}