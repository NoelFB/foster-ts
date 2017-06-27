/**
 * Uses the Texture Shader when rendering
 */
/// <reference path="./../renderer.ts"/>
class SpriteRenderer extends Renderer
{
	constructor()
	{
		super();
		
		this.shader = Shaders.texture;
		this.shaderCameraUniformName = "matrix";
	}
}