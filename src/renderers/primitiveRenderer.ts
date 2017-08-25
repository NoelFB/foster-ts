/**
 * Uses the Primitive Shader when rendering
 */

import {Renderer} from "../renderer";
import {Shaders} from "../util/shaders";

class PrimitiveRenderer extends Renderer
{
	constructor()
	{
		super();

		this.shader = Shaders.primitive;
		this.shaderCameraUniformName = "matrix";
	}
}