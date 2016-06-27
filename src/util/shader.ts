class Shader
{
	public program:WebGLProgram;
	public uniforms:ShaderUniform[];
	public attributes:ShaderAttribute[];
	public dirty:boolean = true;
	public sampler2d:ShaderUniform;
	
	private uniformsByName:any = {};
	
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
	
	set(name:string, value:any)
	{
		this.uniformsByName[name].value = value;
	}
}

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
	
	// special cases
	sampler2D,
	cameraMatrix3d
}

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
		let willBeDirty = (this.value != a);

		// special case for textures
		if (this.type == ShaderUniformType.sampler2D && this._value != null && a != null)
			if ((this._value as Texture).texture.webGLTexture == (a as Texture).texture.webGLTexture)
				willBeDirty = false;

		if (willBeDirty)
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

enum ShaderAttributeType
{
	Position,
	Uv,
	Color
}

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