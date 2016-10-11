/**
 * A Foster Shader used for Rendering
 * For Pre-existing shaders, see Shaders.ts
 */
class Shader
{
	/**
	 * The WebGL Shader Program
	 */
	public program:WebGLProgram;

	/**
	 * The Shader Uniforms
	 */
	public uniforms:ShaderUniform[];

	/**
	 * The Shader Attributes
	 */
	public attributes:ShaderAttribute[];

	/**
	 * If this Shader is dirty and must be updated
	 */
	public dirty:boolean = true;

	/**
	 * A direct reference to the Sampler2D Uniform
	 */
	public sampler2d:ShaderUniform;
	
	private uniformsByName:any = {};
	
	/**
	 * Creates a new Shader from the given vertex and fragment shader code, with the given uniforms and attributes
	 */
	constructor(vertex:string, fragment:string, uniforms:ShaderUniform[], attributes:ShaderAttribute[])
	{
		let gl = Engine.graphics.gl;
		
		// vertex shader
		let vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, vertex);
		gl.compileShader(vertexShader);
		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
			throw "An error occurred compiling the shaders: " + gl.getShaderInfoLog(vertexShader);
			
		// fragment shader
		let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, fragment);
		gl.compileShader(fragmentShader);
		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
			throw "An error occurred compiling the shaders: " + gl.getShaderInfoLog(fragmentShader);
			
		// program
		this.program = gl.createProgram();
		gl.attachShader(this.program, vertexShader);
		gl.attachShader(this.program, fragmentShader);
		gl.linkProgram(this.program);
		
		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
			throw "Unable to initialize the shader program.";
			
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
			
		// attributes
		this.attributes = attributes;
		for (let i = 0; i < this.attributes.length; i ++)
			this.attributes[i].attribute = gl.getAttribLocation(this.program, this.attributes[i].name);
			
		// uniforms
		this.uniforms = uniforms;
		for (let i = 0; i < this.uniforms.length; i ++)
		{
			let uniform = this.uniforms[i];
			this.uniformsByName[uniform.name] = uniform;
			uniform.shader = this;
			uniform.uniform = gl.getUniformLocation(this.program, uniform.name);
			
			// first sampler2D gets set
			if (uniform.type == ShaderUniformType.sampler2D && this.sampler2d == null)
				this.sampler2d = uniform;
		}
	}
	
	/**
	 * Sets the Uniform of the given name to the value
	 * @param name 	the name of the uniform
	 * @param value 	the value to set the uniform to
	 */
	set(name:string, value:any)
	{
		this.uniformsByName[name].value = value;
	}
}

/**
 * Shader Uniform Types
 */
enum ShaderUniformType
{
	// normal ones
	float,
	floatArray,
	float2,
	float2Array,
	float3,
	float3Array,
	float4,
	float4Array,
	matrix2d,
	matrix3d,
	matrix4d,
	int,
	intArray,
	int2,
	int2Array,
	int3,
	int3Array,
	int4,
	int4Array,
	
	// special case for sampler2D
	sampler2D
}

/**
 * A Shader Uniform instance
 */
class ShaderUniform
{
	private _shader:Shader;
	private _value:any = null;
	
	public name:string;
	public type:ShaderUniformType;
	public uniform:WebGLUniformLocation;
	public dirty:boolean;
	
	public get value():any { return this._value; }
	public set value(a:any)
	{
		if (this.value != a)
		{
			this._value = a;
			this._shader.dirty = true;
			this.dirty = true;
		}
	}
	
	public set shader(s:Shader)
	{
		if (this._shader != null)
			throw "This Uniform is already attached to a shader";
		this._shader = s;
	}
	
	constructor(name:string, type:ShaderUniformType, value?:any)
	{
		this.name = name;
		this.type = type;
		this._value = value;
	}
}

/**
 * Shader Attribute Types
 */
enum ShaderAttributeType
{
	Position,
	Texcoord,
	Color
}

/**
 * A Shader Attribute Instance
 */
class ShaderAttribute
{
	public name:string;
	public type:ShaderAttributeType;
	public attribute:number;
	
	constructor(name:string, type:ShaderAttributeType)
	{
		this.name = name;
		this.type = type;
	}
}

/**
 * Dictionary of Methods to handle setting GL Uniform Values
 */
var setGLUniformValue:{[type:number]:(gl:WebGLRenderingContext, location:WebGLUniformLocation, value:any)=>void} = {};

// float
setGLUniformValue[ShaderUniformType.float] = (gl, location, value) => 
	{ 
		gl.uniform1f(location, value); 
	}

// float 2
setGLUniformValue[ShaderUniformType.float2] = (gl, location, value) =>
	{
		if (value instanceof Vector)
			gl.uniform2f(location, value.x, value.y);
		else
			gl.uniform2f(location, value[0], value[1]);
	}

// float 3
setGLUniformValue[ShaderUniformType.float3] = (gl, location, value) =>
	{
		gl.uniform3f(location, value[0], value[1], value[2]);
	}

// float 4
setGLUniformValue[ShaderUniformType.float4] = (gl, location, value) =>
	{
		gl.uniform4f(location, value[0], value[1], value[2], value[3]);
	}

// float array
setGLUniformValue[ShaderUniformType.floatArray] = (gl, location, value) =>
	{
		gl.uniform1fv(location, value);
	}

// float 2 array
setGLUniformValue[ShaderUniformType.float2Array] = (gl, location, value) =>
	{
		gl.uniform2fv(location, value);
	}

// float 3 array
setGLUniformValue[ShaderUniformType.float3Array] = (gl, location, value) =>
	{
		gl.uniform3fv(location, value);
	}

// float 4 array
setGLUniformValue[ShaderUniformType.float4Array] = (gl, location, value) =>
	{
		gl.uniform4fv(location, value);
	}

// int
setGLUniformValue[ShaderUniformType.int] = (gl, location, value) => 
	{ 
		gl.uniform1i(location, value); 
	}

// int 2
setGLUniformValue[ShaderUniformType.int2] = (gl, location, value) =>
	{
		if (value instanceof Vector)
			gl.uniform2i(location, Math.round(value.x), Math.round(value.y));
		else
			gl.uniform2i(location, value[0], value[1]);
	}

// int 3
setGLUniformValue[ShaderUniformType.int3] = (gl, location, value) =>
	{
		gl.uniform3i(location, value[0], value[1], value[2]);
	}

// int 4
setGLUniformValue[ShaderUniformType.int4] = (gl, location, value) =>
	{
		gl.uniform4i(location, value[0], value[1], value[2], value[3]);
	}

// int array
setGLUniformValue[ShaderUniformType.intArray] = (gl, location, value) =>
	{
		gl.uniform1iv(location, value);
	}

// int 2 array
setGLUniformValue[ShaderUniformType.int2Array] = (gl, location, value) =>
	{
		gl.uniform2iv(location, value);
	}

// int 3 array
setGLUniformValue[ShaderUniformType.int3Array] = (gl, location, value) =>
	{
		gl.uniform3iv(location, value);
	}

// int 4 array
setGLUniformValue[ShaderUniformType.int4Array] = (gl, location, value) =>
	{
		gl.uniform4iv(location, value);
	}

// matrix 2d
setGLUniformValue[ShaderUniformType.matrix2d] = (gl, location, value) =>
	{
		gl.uniformMatrix2fv(location, false, value);
	}

// matrix 3d
setGLUniformValue[ShaderUniformType.matrix3d] = (gl, location, value) =>
	{
		if (value instanceof Matrix)
			gl.uniformMatrix3fv(location, false, (value as Matrix).mat);
		else
			gl.uniformMatrix3fv(location, false, value);
	}

// matrix 4d
setGLUniformValue[ShaderUniformType.matrix4d] = (gl, location, value) =>
	{
		gl.uniformMatrix2fv(location, false, value);
	}