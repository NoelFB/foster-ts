/**
 * Uses the Texture Shader when rendering
 */

import {Renderer} from "../renderer";
import {Shaders} from "../util/shaders";

export class SpriteRenderer extends Renderer
{
	constructor()
	{
		super();

		this.shader = Shaders.texture;
		this.shaderCameraUniformName = "matrix";
	}
}