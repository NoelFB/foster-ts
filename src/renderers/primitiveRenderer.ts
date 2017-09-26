import {Shaders} from "./../util";
import {Renderer} from "./../core/renderer";

/**
 * Uses the Primitive Shader when rendering
 */
export class PrimitiveRenderer extends Renderer
{
	constructor()
	{
		super();

		this.shader = Shaders.primitive;
		this.shaderCameraUniformName = "matrix";
	}
}
