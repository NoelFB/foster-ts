import {Engine} from "./../core";
import {Matrix} from "./matrix";
import {Vector} from "./vector";

/**
 * A Foster Shader used for Rendering
 * For Pre-existing shaders, see Shaders.ts
 */
export class Program
{
	/**
	 * The WebGL Shader Program
	 */
	public program:WebGLProgram;

	/**
	 * The Shader Uniforms
	 */
	public uniforms:Uniform[];

	/**
	 * The Shader Attributes
	 */
	public attributes:Attribute[];

	/**
	 * If this Shader is dirty and must be updated
	 */
	public dirty:boolean = true;

	/**
	 * A direct reference to the Sampler2D Uniform
	 */
	public sampler2d:Uniform;

	private uniformsByName:any = {};

	/**
	 * Creates a new Shader from the given vertex and fragment shader code, with the given uniforms and attributes
	 */
	constructor(vertex:string, fragment:string, uniforms:Uniform[], attributes:Attribute[])
	{
		const gl = Engine.graphics.gl;

		// vertex shader
		const vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, vertex);
		gl.compileShader(vertexShader);
		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
			throw new Error("An error occurred compiling the shaders:" + gl.getShaderInfoLog(vertexShader));

		// fragment shader
		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, fragment);
		gl.compileShader(fragmentShader);
		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
			throw new Error("An error occurred compiling the shaders:" + gl.getShaderInfoLog(fragmentShader));

		// program
		this.program = gl.createProgram();
		gl.attachShader(this.program, vertexShader);
		gl.attachShader(this.program, fragmentShader);
		gl.linkProgram(this.program);

		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
			throw new Error("Unable to initialize the shader program.");

		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);

		// attributes
		this.attributes = attributes;
		for  (const attribute of this.attributes)
			attribute.location = gl.getAttribLocation(this.program, attribute.name);

		// uniforms
		this.uniforms = uniforms;
		for (const uniform of this.uniforms)
		{
			this.uniformsByName[uniform.name] = uniform;
			uniform.shader = this;
			uniform.location = gl.getUniformLocation(this.program, uniform.name);

			// first sampler2D gets set
			if (uniform.type === UniformType.sampler2D && this.sampler2d == null)
				this.sampler2d = uniform;
		}
	}

	/**
	 * Sets the Uniform of the given name to the value
	 * @param name 	the name of the uniform
	 * @param value 	the value to set the uniform to
	 */
	public set(name:string, value:any)
	{
		this.uniformsByName[name].value = value;
	}
}

/**
 * Shader Uniform Types
 */
export enum UniformType
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
	sampler2D,
}

/**
 * A Shader Uniform instance
 */
export class Uniform
{
	private _shader:Program;
	private _value:any = null;

	public name:string;
	public type:UniformType;
	public location:WebGLUniformLocation;
	public dirty:boolean;

	public get value():any { return this._value; }
	public set value(a:any)
	{
		if (this.value !== a)
		{
			this._value = a;
			this._shader.dirty = true;
			this.dirty = true;
		}
	}

	public set shader(s:Program)
	{
		if (this._shader != null)
			throw new Error("This Uniform is already attached to a shader");
		this._shader = s;
	}

	constructor(name:string, type:UniformType, value?:any)
	{
		this.name = name;
		this.type = type;
		this._value = value;
	}
}

/**
 * Shader Attribute Types
 */
export enum AttributeType
{
	Position,
	Texcoord,
	Color,
}

/**
 * A Shader Attribute Instance
 */
export class Attribute
{
	public name:string;
	public type:AttributeType;
	public location:number;

	constructor(name:string, type:AttributeType)
	{
		this.name = name;
		this.type = type;
	}
}

/**
 * Dictionary of Methods to handle setting GL Uniform Values
 */
export let setGLUniformValue:{[type:number]:(gl:WebGLRenderingContext, location:WebGLUniformLocation, value:any) => void} = {};

// float
setGLUniformValue[UniformType.float] = (gl, location, value) =>
	{
		gl.uniform1f(location, value);
	};

// float 2
setGLUniformValue[UniformType.float2] = (gl, location, value) =>
	{
		if (value instanceof Vector)
			gl.uniform2f(location, value.x, value.y);
		else
			gl.uniform2f(location, value[0], value[1]);
	};

// float 3
setGLUniformValue[UniformType.float3] = (gl, location, value) =>
	{
		gl.uniform3f(location, value[0], value[1], value[2]);
	};

// float 4
setGLUniformValue[UniformType.float4] = (gl, location, value) =>
	{
		gl.uniform4f(location, value[0], value[1], value[2], value[3]);
	};

// float array
setGLUniformValue[UniformType.floatArray] = (gl, location, value) =>
	{
		gl.uniform1fv(location, value);
	};

// float 2 array
setGLUniformValue[UniformType.float2Array] = (gl, location, value) =>
	{
		gl.uniform2fv(location, value);
	};

// float 3 array
setGLUniformValue[UniformType.float3Array] = (gl, location, value) =>
	{
		gl.uniform3fv(location, value);
	};

// float 4 array
setGLUniformValue[UniformType.float4Array] = (gl, location, value) =>
	{
		gl.uniform4fv(location, value);
	};

// int
setGLUniformValue[UniformType.int] = (gl, location, value) =>
	{
		gl.uniform1i(location, value);
	};

// int 2
setGLUniformValue[UniformType.int2] = (gl, location, value) =>
	{
		if (value instanceof Vector)
			gl.uniform2i(location, Math.round(value.x), Math.round(value.y));
		else
			gl.uniform2i(location, value[0], value[1]);
	};

// int 3
setGLUniformValue[UniformType.int3] = (gl, location, value) =>
	{
		gl.uniform3i(location, value[0], value[1], value[2]);
	};

// int 4
setGLUniformValue[UniformType.int4] = (gl, location, value) =>
	{
		gl.uniform4i(location, value[0], value[1], value[2], value[3]);
	};

// int array
setGLUniformValue[UniformType.intArray] = (gl, location, value) =>
	{
		gl.uniform1iv(location, value);
	};

// int 2 array
setGLUniformValue[UniformType.int2Array] = (gl, location, value) =>
	{
		gl.uniform2iv(location, value);
	};

// int 3 array
setGLUniformValue[UniformType.int3Array] = (gl, location, value) =>
	{
		gl.uniform3iv(location, value);
	};

// int 4 array
setGLUniformValue[UniformType.int4Array] = (gl, location, value) =>
	{
		gl.uniform4iv(location, value);
	};

// matrix 2d
setGLUniformValue[UniformType.matrix2d] = (gl, location, value) =>
	{
		gl.uniformMatrix2fv(location, false, value);
	};

// matrix 3d
setGLUniformValue[UniformType.matrix3d] = (gl, location, value) =>
	{
		if (value instanceof Matrix)
			gl.uniformMatrix3fv(location, false, (value as Matrix).mat);
		else
			gl.uniformMatrix3fv(location, false, value);
	};

// matrix 4d
setGLUniformValue[UniformType.matrix4d] = (gl, location, value) =>
	{
		gl.uniformMatrix2fv(location, false, value);
	};
