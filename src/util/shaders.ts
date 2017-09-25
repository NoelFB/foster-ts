import * as Shader from "./shader";

/**
 * Default 2D shaders
 */

/// <reference path="./shader.ts"/>
export class Shaders
{
	/**
	 * A simple Texture Sahder
	 */
	public static texture:Shader.Program;

	/**
	 * A Texture Shader that fills non-transparent pixels with the specific UV color
	 */
	public static solid:Shader.Program;

	/**
	 * Primitive Shader only has Vertices and Colors, no Texture
	 */
	public static primitive:Shader.Program;

	/**
	 * Initializes Default Shaders (called automatically by the Engine)
	 */
	public static init()
	{
		// Default Texture Shader
		Shaders.texture = new Shader.Program
		(
			// vertex shader
			"attribute vec2 a_position;" +
			"attribute vec2 a_texcoord;" +
			"attribute vec4 a_color;" +

			"uniform mat3 matrix;" +
			"varying vec2 v_texcoord;" +
			"varying vec4 v_color;" +

			"void main()" +
			"{" +
			"	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);" +
			"	v_texcoord = a_texcoord;" +
			"	v_color = vec4(a_color.rgb * a_color.a, a_color.a);" +
			"}",

			// fragment shader
			"precision mediump float;" +
			"varying vec2 v_texcoord;" +
			"varying vec4 v_color;" +
			"uniform sampler2D texture;" +

			"void main() " +
			"{" +
			"	gl_FragColor = texture2D(texture, v_texcoord) * v_color;" +
			"}",
			[
				new Shader.Uniform("matrix", Shader.UniformType.matrix3d),
				new Shader.Uniform("texture", Shader.UniformType.sampler2D),
			],
			[
				new Shader.Attribute("a_position", Shader.AttributeType.Position),
				new Shader.Attribute("a_texcoord", Shader.AttributeType.Texcoord),
				new Shader.Attribute("a_color", Shader.AttributeType.Color),
			],
		);

		// solid color shader over texture
		Shaders.solid = new Shader.Program
		(
			// vertex shader
			"attribute vec2 a_position;" +
			"attribute vec2 a_texcoord;" +
			"attribute vec4 a_color;" +

			"uniform mat3 matrix;" +
			"varying vec2 v_texcoord;" +
			"varying vec4 v_color;" +

			"void main()" +
			"{" +
			"	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);" +
			"	v_texcoord = a_texcoord;" +
			"	v_color = a_color;" +
			"}",

			// fragment shader
			"precision mediump float;" +
			"varying vec2 v_texcoord;" +
			"varying vec4 v_color;" +
			"uniform sampler2D texture;" +

			"void main() " +
			"{" +
			"	gl_FragColor = v_color * texture2D(texture, v_texcoord).a;" +
			"}",
			[
				new Shader.Uniform("matrix", Shader.UniformType.matrix3d),
				new Shader.Uniform("texture", Shader.UniformType.sampler2D),
			],
			[
				new Shader.Attribute("a_position", Shader.AttributeType.Position),
				new Shader.Attribute("a_texcoord", Shader.AttributeType.Texcoord),
				new Shader.Attribute("a_color", Shader.AttributeType.Color),
			],
		);

		// Primitive shader (no texture)
		Shaders.primitive = new Shader.Program
		(
			// vertex shader
			"attribute vec2 a_position;" +
			"attribute vec4 a_color;" +

			"uniform mat3 matrix;" +
			"varying vec4 v_color;" +

			"void main()" +
			"{" +
			"	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);" +
			"	v_color = a_color;" +
			"}",

			// fragment shader
			"precision mediump float;" +
			"varying vec4 v_color;" +

			"void main() " +
			"{" +
			"	gl_FragColor = v_color;" +
			"}",
			[
				new Shader.Uniform("matrix", Shader.UniformType.matrix3d),
			],
			[
				new Shader.Attribute("a_position", Shader.AttributeType.Position),
				new Shader.Attribute("a_color", Shader.AttributeType.Color),
			],
		);
	}
}
