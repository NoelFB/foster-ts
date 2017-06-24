/**
 * Uses the Primitive Shader when rendering
 */
class PrimitiveRenderer extends Renderer
{
	constructor()
	{
		super();
		
		this.shader = Shaders.primitive;
		this.shaderCameraUniformName = "matrix";
	}
}