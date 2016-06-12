/// <reference path="./shader.ts" />

// Default 2D shaders
class Shaders
{
	public static texture:Shader;
	public static solid:Shader;
	public static primitive:Shader;
	
	public static init()
	{
		// Default Texture Shader
		Shaders.texture = new Shader
		(
			// vertex shader
			'attribute vec2 a_position;' +
			'attribute vec2 a_texcoord;' +
			'attribute vec4 a_color;' + 
			
			'uniform mat3 matrix;' +
			'varying vec2 v_texcoord;' +
			'varying vec4 v_color;' +
			
			'void main()' +
			'{' +
			'	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);' +
			'	v_texcoord = a_texcoord;' +
			'	v_color = a_color;' +
			'}',
			
			// fragment shader
			'precision mediump float;' +
			'varying vec2 v_texcoord;' +
			'varying vec4 v_color;' +
			'uniform sampler2D texture;' +

			'void main() ' +
			'{' +
			'	gl_FragColor = texture2D(texture, v_texcoord) * v_color;' +
			'}',
			[
				new ShaderUniform("matrix", ShaderUniformType.matrix3d),
				new ShaderUniform("texture", ShaderUniformType.sampler2D)
			],
			[
				new ShaderAttribute('a_position', ShaderAttributeType.Position),
				new ShaderAttribute('a_texcoord', ShaderAttributeType.Uv),
				new ShaderAttribute('a_color', ShaderAttributeType.Color)
			]
		);
		
		// solid color shader over texture
		Shaders.solid = new Shader
		(
			// vertex shader
			'attribute vec2 a_position;' +
			'attribute vec2 a_texcoord;' +
			'attribute vec4 a_color;' + 
			
			'uniform mat3 matrix;' +
			'varying vec2 v_texcoord;' +
			'varying vec4 v_color;' +
			
			'void main()' +
			'{' +
			'	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);' +
			'	v_texcoord = a_texcoord;' +
			'	v_color = a_color;' +
			'}',
			
			// fragment shader
			'precision mediump float;' +
			'varying vec2 v_texcoord;' +
			'varying vec4 v_color;' +
			'uniform sampler2D texture;' +

			'void main() ' +
			'{' +
			'	gl_FragColor = v_color * texture2D(texture, v_texcoord).a;' +
			'}',
			[
				new ShaderUniform("matrix", ShaderUniformType.matrix3d),
				new ShaderUniform("texture", ShaderUniformType.sampler2D)
			],
			[
				new ShaderAttribute('a_position', ShaderAttributeType.Position),
				new ShaderAttribute('a_texcoord', ShaderAttributeType.Uv),
				new ShaderAttribute('a_color', ShaderAttributeType.Color)
			]
		);
		
		// Primitive texture
		Shaders.primitive = new Shader
		(
			// vertex shader
			'attribute vec2 a_position;' +
			'attribute vec4 a_color;' + 
			
			'uniform mat3 matrix;' +
			'varying vec4 v_color;' +
			
			'void main()' +
			'{' +
			'	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);' +
			'	v_color = a_color;' +
			'}',
			
			// fragment shader
			'precision mediump float;' +
			'varying vec4 v_color;' +

			'void main() ' +
			'{' +
			'	gl_FragColor = v_color;' +
			'}',
			[
				new ShaderUniform("matrix", ShaderUniformType.matrix3d)
			],
			[
				new ShaderAttribute('a_position', ShaderAttributeType.Position),
				new ShaderAttribute('a_color', ShaderAttributeType.Color)
			]
		);
	}
}