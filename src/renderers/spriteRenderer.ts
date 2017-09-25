import {Shaders} from "./../util";
import {Renderer} from "./../core";

/**
 * Uses the Texture Shader when rendering
 */
export class SpriteRenderer extends Renderer
{
	constructor()
	{
		super();

		this.shader = Shaders.texture;
		this.shaderCameraUniformName = "matrix";
	}
}
