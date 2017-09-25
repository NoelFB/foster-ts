import {Engine} from "./";
import {RenderTarget, Texture } from "./../assets";
import {Camera, Color, Matrix, Rectangle, Shader, Shaders, Vector} from "./../util";

export enum ResolutionStyle
{
	/** Renders the buffer at the Center of the Screen with no scaling */
	None,
	/** Renders the buffer to an exact fit of the Screen (stretching) */
	Exact,
	/** Renders the buffer so that it is contained within the Screen */
	Contain,
	/** Renders the buffer so that it is contained within the Screen, rounded to an Integer scale */
	ContainInteger,
	/** Renders the buffer so that it fills the Screen (cropping the buffer) */
	Fill,
	/** Renders the buffer so that it fills the Screen (cropping the buffer), rounded to an Integer scale */
	FillInteger,
}

export class BlendMode
{
	public source:number;
	public dest:number;

	constructor(source:number, dest:number) { this.source = source; this.dest = dest; }
}

export class BlendModes
{
	public static normal:BlendMode;
	public static add:BlendMode;
	public static multiply:BlendMode;
	public static screen:BlendMode;
}

export class Graphics
{
	// core
	private engine:Engine;
	public canvas:HTMLCanvasElement;
	public gl:WebGLRenderingContext;
	public buffer:RenderTarget;

	public resolutionStyle:ResolutionStyle = ResolutionStyle.Contain;
	public borderColor:Color = Color.black.clone();
	public clearColor:Color = new Color(0.1, 0.1, 0.3, 1);

	// vertices
	private vertices:number[] = [];
	private texcoords:number[] = [];
	private colors:number[] = [];

	// current render target
	private currentTarget:RenderTarget = null;

	// buffers for the NULL target (screen)
	private vertexBuffer:WebGLBuffer;
	private texcoordBuffer:WebGLBuffer;
	private colorBuffer:WebGLBuffer;

	// shader
	private currentShader:Shader.Program = null;
	private nextShader:Shader.Program = null;

	public get shader():Shader.Program
	{
		if (this.nextShader != null)
			return this.nextShader;
		return this.currentShader;
	}
	public set shader(s:Shader.Program)
	{
		if (this.shader !== s && s != null)
			this.nextShader = s;
	}

	// blendmode
	private currentBlendmode:BlendMode = null;
	private nextBlendmode:BlendMode = null;

	public get blendmode():BlendMode
	{
		if (this.nextBlendmode != null)
			return this.nextBlendmode;
		return this.currentBlendmode;
	}
	public set blendmode(bm:BlendMode)
	{
		if (this.currentBlendmode !== bm && bm != null)
			this.nextBlendmode = bm;
	}

	// orthographic matrix
	public orthographic:Matrix = new Matrix();
	private toscreen:Matrix = new Matrix();

	// pixel drawing
	private _pixel:Texture = null;
	private _pixelUVs:Vector[] = [new Vector(0, 0), new Vector(1, 0), new Vector(1, 1), new Vector(0, 1)];
	private _defaultPixel:Texture = null;

	public set pixel(p:Texture)
	{
		if (p == null)
			p = this._defaultPixel;

		const minX = p.bounds.left / p.texture.width;
		const minY = p.bounds.top / p.texture.height;
		const maxX = p.bounds.right / p.texture.width;
		const maxY = p.bounds.bottom / p.texture.height;

		this._pixel = p;
		this._pixelUVs =
		[
			new Vector(minX, minY),
			new Vector(maxX, minY),
			new Vector(maxX, maxY),
			new Vector(minX, maxY),
		];
	}
	public get pixel():Texture { return this._pixel; }

	// utils
	public drawCalls:number = 0;

	/**
	 * Creates the Engine.Graphics
	 */
	constructor(engine:Engine)
	{
		this.engine = engine;

		// create the screen
		this.canvas = document.createElement("canvas");
		this.gl = this.canvas.getContext("experimental-webgl",
		{
			alpha:false,
			antialias:false,
		}) as WebGLRenderingContext;
		Engine.root.appendChild(this.canvas);

		this.gl.enable(this.gl.BLEND);
		this.gl.disable(this.gl.DEPTH_TEST);
		this.gl.disable(this.gl.CULL_FACE);
		this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

		BlendModes.normal = new BlendMode(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
		BlendModes.add = new BlendMode(this.gl.ONE, this.gl.DST_ALPHA);
		BlendModes.multiply = new BlendMode(this.gl.DST_COLOR, this.gl.ONE_MINUS_SRC_ALPHA);
		BlendModes.screen = new BlendMode(this.gl.ONE, this.gl.ONE_MINUS_SRC_COLOR);
		this.currentBlendmode = BlendModes.normal;

		this.vertexBuffer = this.gl.createBuffer();
		this.texcoordBuffer = this.gl.createBuffer();
		this.colorBuffer = this.gl.createBuffer();
	}

	/**
	 * Initial load of Graphics and WebGL components
	 */
	public load()
	{
		// creates the default pixel texture
		this.pixel = this._defaultPixel = Texture.createFromData([1, 1, 1, 1], 1, 1);
	}

	/**
	 * Unloads the Graphics and WebGL stuff
	 */
	public unload()
	{
		this._defaultPixel.dispose();
		this.gl.deleteBuffer(this.vertexBuffer);
		this.gl.deleteBuffer(this.colorBuffer);
		this.gl.deleteBuffer(this.texcoordBuffer);
		this.buffer.dispose();
		this.buffer = null;
		this.canvas.remove();
		this.canvas = null;

		// TODO:Implement this properly
	}

	/**
	 * Called when the Game resolution changes
	 */
	public resize():void
	{
		// buffer
		if (this.buffer != null)
			this.buffer.dispose();
		this.buffer = RenderTarget.create(Engine.width, Engine.height);

		// orthographic matrix
		this.orthographic
			.identity()
			.translate(-1, 1)
			.scale(1 / this.buffer.width * 2, -1 / this.buffer.height * 2);
	}

	/**
	 * Updates the Graphics
	 */
	public update():void
	{
		// resizing
		if (this.canvas.width !== Engine.root.clientWidth || this.canvas.height !== Engine.root.clientHeight)
		{
			this.canvas.width = Engine.root.clientWidth;
			this.canvas.height = Engine.root.clientHeight;
		}
	}

	/**
	 * Gets the rectangle that the game buffer should be drawn to the screen with
	 */
	public getOutputBounds():Rectangle
	{
		let scaleX = 1;
		let scaleY = 1;

		if (this.resolutionStyle === ResolutionStyle.Exact)
		{
			scaleX = this.canvas.width / this.buffer.width;
			scaleY = this.canvas.height / this.buffer.height;
		}
		else if (this.resolutionStyle === ResolutionStyle.Contain)
		{
			scaleX = scaleY = (Math.min(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
		}
		else if (this.resolutionStyle === ResolutionStyle.ContainInteger)
		{
			scaleX = scaleY = Math.floor(Math.min(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
		}
		else if (this.resolutionStyle === ResolutionStyle.Fill)
		{
			scaleX = scaleY = (Math.max(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
		}
		else if (this.resolutionStyle === ResolutionStyle.FillInteger)
		{
			scaleX = scaleY = Math.ceil(Math.max(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
		}

		const width = this.buffer.width * scaleX;
		const height = this.buffer.height * scaleY;

		return new Rectangle((this.canvas.width - width) / 2, (this.canvas.height - height) / 2, width, height);
	}

	/**
	 * Clears the screen
	 */
	public clear(color:Color)
	{
		this.gl.clearColor(color.r, color.g, color.b, color.a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	/**
	 * Resets the Graphics rendering
	 */
	public reset()
	{
		this.drawCalls = 0;
		this.currentShader = null;
		this.nextShader = null;
		this.vertices = [];
		this.colors = [];
		this.texcoords = [];
		this.setRenderTarget(this.buffer);
		this.clear(this.clearColor);
	}

	/**
	 * Sets the current Render Target
	 */
	public setRenderTarget(target:RenderTarget):void
	{
		if (this.currentTarget !== target)
		{
			this.flush();
			if (target == null)
			{
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
				this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
			}
			else
			{
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target.frameBuffer);
				this.gl.viewport(0, 0, target.width, target.height);
			}
			this.currentTarget = target;
		}
	}

	/**
	 * Sets the current texture on the shader (if the shader has a sampler2d uniform)
	 */
	public setShaderTexture(tex:Texture):void
	{
		if (Engine.assert(this.shader.sampler2d != null, "This shader has no Sampler2D to set the texture to"))
			this.shader.sampler2d.value = tex.texture.webGLTexture;
	}

	/**
	 * Checks if the shader was modified, and if so, flushes the current vertices & starts a new draw
	 */
	public checkState()
	{
		if (this.nextShader != null || this.currentShader.dirty || this.nextBlendmode != null)
		{
			// flush existing
			if (this.currentShader != null)
				this.flush();

			// swap
			const swapped = (this.nextShader != null);
			if (swapped)
			{
				// disable prev. attributes
				if (this.currentShader != null)
					for (const attribute of this.currentShader.attributes)
						this.gl.disableVertexAttribArray(attribute.location);

				// swap
				this.currentShader = this.nextShader;
				this.nextShader = null;
				this.gl.useProgram(this.currentShader.program);

				// enable attributes
				for (const attribute of this.currentShader.attributes)
					this.gl.enableVertexAttribArray(attribute.location);
			}

			// blendmode
			if (this.nextBlendmode != null)
			{
				this.currentBlendmode = this.nextBlendmode;
				this.nextBlendmode = null;
				this.gl.blendFunc(this.currentBlendmode.source, this.currentBlendmode.dest);
			}

			// set shader uniforms
			let textureCounter = 0;
			for (const uniform of this.currentShader.uniforms)
			{
				if (swapped || uniform.dirty)
				{
					// special case for Sampler2D
					if (uniform.type === Shader.UniformType.sampler2D)
					{
						this.gl.activeTexture((this.gl as any)["TEXTURE" + textureCounter]);
						if (uniform.value instanceof Texture)
							this.gl.bindTexture(this.gl.TEXTURE_2D, (uniform.value as Texture).texture.webGLTexture);
						else if (uniform.value instanceof RenderTarget)
							this.gl.bindTexture(this.gl.TEXTURE_2D, (uniform.value as RenderTarget).texture.webGLTexture);
						else
							this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value);
						this.gl.uniform1i(uniform.location, textureCounter);
						textureCounter += 1;
					}
					// otherwise use normal Uniform Set Method
					else
					{
						Shader.setGLUniformValue[uniform.type](this.gl, uniform.location, uniform.value);
					}

					uniform.dirty = false;
				}
			}

			this.currentShader.dirty = false;
		}
	}

	/**
	 * Flushes the current vertices to the screen
	 */
	public flush()
	{
		if (this.vertices.length > 0)
		{
			// set buffer data via shader attributes
			for (const attribute of this.currentShader.attributes)
			{
				if (attribute.type === Shader.AttributeType.Position)
				{
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.vertexBuffer :this.currentTarget.vertexBuffer));
					this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
					this.gl.vertexAttribPointer(attribute.location, 2, this.gl.FLOAT, false, 0, 0);
				}
				else if (attribute.type === Shader.AttributeType.Texcoord)
				{
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.texcoordBuffer :this.currentTarget.texcoordBuffer));
					this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texcoords), this.gl.STATIC_DRAW);
					this.gl.vertexAttribPointer(attribute.location, 2, this.gl.FLOAT, false, 0, 0);
				}
				else if (attribute.type === Shader.AttributeType.Color)
				{
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.colorBuffer :this.currentTarget.colorBuffer));
					this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
					this.gl.vertexAttribPointer(attribute.location, 4, this.gl.FLOAT, false, 0, 0);
				}
			}

			// draw vertices
			this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 2);
			this.drawCalls ++;

			// clear
			this.vertices = [];
			this.texcoords = [];
			this.colors = [];
		}
	}

	/**
	 * Draws the game to the Screen and does cleanup
	 */
	public finalize()
	{
		// set target back to the Screen Canvas (null)
		this.setRenderTarget(null);
		this.clear(this.borderColor);

		// create the matrix for rendering back to the Screen
		this.toscreen
			.identity()
			.translate(-1, -1)
			.scale(1 / this.canvas.width * 2, 1 / this.canvas.height * 2);

		// use the default texture shader
		this.shader = Shaders.texture;
		this.shader.sampler2d.value = this.buffer.texture.webGLTexture;
		this.shader.set("matrix", this.toscreen);

		// draw our buffer centered!
		const bounds = this.getOutputBounds();
		this.push(bounds.left, bounds.top, 0, 0, Color.white);
		this.push(bounds.right, bounds.top, 1, 0, Color.white);
		this.push(bounds.right, bounds.bottom, 1, 1, Color.white);
		this.push(bounds.left, bounds.top, 0, 0, Color.white);
		this.push(bounds.right, bounds.bottom, 1, 1, Color.white);
		this.push(bounds.left, bounds.bottom, 0, 1, Color.white);
		this.flush();
	}

	/**
	 * Pushes vertices to the screen. If the shader has been modified, this will end and start a new draw call
	 * @param x 	X position of the vertex
	 * @param y		Y position of the vertex
	 * @param u		X position in the texture (u) (only used in shaders with sampler2d)
	 * @param v		Y position in the texture (v) (only used in shaders with sampler2d)
	 * @param color optional color for the vertex
	 */
	public push(x:number, y:number, u:number, v:number, color?:Color)
	{
		// shader was changed
		this.checkState();

		// append
		this.vertices.push(x, y);
		this.texcoords.push(u, v);
		if (color !== undefined && color != null)
			this.colors.push(color.r, color.g, color.b, color.a);
	}

	/**
	 * Same as Graphics.push, but this method assumes the shader was NOT modified. Don't use this unless you know what you're doing
	 * @param x 	X position of the vertex
	 * @param y		Y position of the vertex
	 * @param u		X position in the texture (u) (only used in shaders with sampler2d)
	 * @param v		Y position in the texture (v) (only used in shaders with sampler2d)
	 * @param color optional color for the vertex
	 */
	public pushUnsafe(x:number, y:number, u:number, v:number, color?:Color)
	{
		this.vertices.push(x, y);
		this.texcoords.push(u, v);
		if (color !== undefined && color != null)
			this.colors.push(color.r, color.g, color.b, color.a);
	}

	/**
	 * Pushes a list of vertices to the screen. If the shader has been modified, this will end and start a new draw call
	 */
	public pushList(pos:Vector[], uv:Vector[], color:Color[])
	{
		this.checkState();

		for (let i = 0; i < pos.length; i ++)
		{
			this.vertices.push(pos[i].x, pos[i].y);
			if (uv !== undefined && uv != null)
				this.texcoords.push(uv[i].x, uv[i].y);
			if (color !== undefined && color != null)
			{
				const c = color[i];
				this.colors.push(c.r, c.g, c.b, c.a);
			}
		}
	}

	// temp. vars used for drawing
	private topleft:Vector = new Vector();
	private topright:Vector = new Vector();
	private botleft:Vector = new Vector();
	private botright:Vector = new Vector();
	private texToDraw:Texture = new Texture(null, new Rectangle(), new Rectangle());

	/**
	 * Draws a texture at the given position. If the current Shader does not take a texture, this will throw an error.
	 */
	public texture(tex:Texture, posX:number, posY:number, crop?:Rectangle, color?:Color, origin?:Vector, scale?:Vector, rotation?:number, flipX?:boolean, flipY?:boolean)
	{
		this.setShaderTexture(tex);

		// get the texture (or subtexture if crop is passed)
		let t:Texture = null;
		if (crop === undefined || crop == null)
			t = tex;
		else
			t = tex.getSubtexture(crop, this.texToDraw);

		// size
		const left = -t.frame.x;
		const top = -t.frame.y;
		const width = t.bounds.width;
		const height = t.bounds.height;

		// relative positions
		this.topleft.set(left, top);
		this.topright.set(left + width, top);
		this.botleft.set(left, top + height);
		this.botright.set(left + width, top + height);

		// offset by origin
		if (origin && (origin.x !== 0 || origin.y !== 0))
		{
			this.topleft.sub(origin);
			this.topright.sub(origin);
			this.botleft.sub(origin);
			this.botright.sub(origin);
		}

		// scale
		if (scale && (scale.x !== 1 || scale.y !== 1))
		{
			this.topleft.mult(scale);
			this.topright.mult(scale);
			this.botleft.mult(scale);
			this.botright.mult(scale);
		}

		// rotate
		if (rotation && rotation !== 0)
		{
			const s = Math.sin(rotation);
			const c = Math.cos(rotation);
			this.topleft.rotate(s, c);
			this.topright.rotate(s, c);
			this.botleft.rotate(s, c);
			this.botright.rotate(s, c);
		}

		// uv positions
		let uvMinX = t.bounds.x / t.texture.width;
		let uvMinY = t.bounds.y / t.texture.height;
		let uvMaxX = uvMinX + (width / t.texture.width);
		let uvMaxY = uvMinY + (height / t.texture.height);

		// flip UVs on X
		if (flipX)
		{
			const a = uvMinX;
			uvMinX = uvMaxX;
			uvMaxX = a;
		}

		// flip UVs on Y
		if (flipY)
		{
			const a = uvMinY;
			uvMinY = uvMaxY;
			uvMaxY = a;
		}

		// color
		const col = (color || Color.white);

		// push vertices
		this.push(posX + this.topleft.x, posY + this.topleft.y, uvMinX, uvMinY, col);
		this.pushUnsafe(posX + this.topright.x, posY + this.topright.y, uvMaxX, uvMinY, col);
		this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, uvMaxX, uvMaxY, col);
		this.pushUnsafe(posX + this.topleft.x, posY + this.topleft.y, uvMinX, uvMinY, col);
		this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, uvMaxX, uvMaxY, col);
		this.pushUnsafe(posX + this.botleft.x, posY + this.botleft.y, uvMinX, uvMaxY, col);
	}

	public quad(posX:number, posY:number, width:number, height:number, color?:Color, origin?:Vector, scale?:Vector, rotation?:number)
	{
		const left = 0;
		const top = 0;

		// relative positions
		this.topleft.set(left, top);
		this.topright.set(left + width, top);
		this.botleft.set(left, top + height);
		this.botright.set(left + width, top + height);

		// offset by origin
		if (origin && (origin.x !== 0 || origin.y !== 0))
		{
			this.topleft.sub(origin);
			this.topright.sub(origin);
			this.botleft.sub(origin);
			this.botright.sub(origin);
		}

		// scale
		if (scale && (scale.x !== 1 || scale.y !== 1))
		{
			this.topleft.mult(scale);
			this.topright.mult(scale);
			this.botleft.mult(scale);
			this.botright.mult(scale);
		}

		// rotate
		if (rotation && rotation !== 0)
		{
			const s = Math.sin(rotation);
			const c = Math.cos(rotation);
			this.topleft.rotate(s, c);
			this.topright.rotate(s, c);
			this.botleft.rotate(s, c);
			this.botright.rotate(s, c);
		}

		// color
		const col = (color || Color.white);

		// push vertices
		this.push(posX + this.topleft.x, posY + this.topleft.y, 0, 0, color);
		this.pushUnsafe(posX + this.topright.x, posY + this.topright.y, 0, 0, color);
		this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, 0, 0, color);
		this.pushUnsafe(posX + this.topleft.x, posY + this.topleft.y, 0, 0, color);
		this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, 0, 0, color);
		this.pushUnsafe(posX + this.botleft.x, posY + this.botleft.y, 0, 0, color);
	}

	/**
	 * Draws a rectangle. If the current shader has a Sampler2D it uses the Graphics.Pixel texture
	 */
	public rect(x:number, y:number, width:number, height:number, color:Color)
	{
		if (this.shader.sampler2d != null)
			this.setShaderTexture(this._pixel);

		const uv = this._pixelUVs;
		this.push(x, y, uv[0].x, uv[0].y, color);
		this.pushUnsafe(x + width, y, uv[1].x, uv[1].y, color);
		this.pushUnsafe(x + width, y + height, uv[2].x, uv[2].y, color);
		this.pushUnsafe(x, y, uv[0].x, uv[0].y, color);
		this.pushUnsafe(x, y + height, uv[3].x, uv[3].y, color);
		this.pushUnsafe(x + width, y + height, uv[2].x, uv[2].y, color);
	}

	/**
	 * Draws a triangle. If the current shader has a Sampler2D it uses the Graphics.Pixel texture
	 */
	public triangle(a:Vector, b:Vector, c:Vector, colA:Color, colB?:Color, colC?:Color)
	{
		if (this.shader.sampler2d != null)
			this.setShaderTexture(this._pixel);

		if (colB === undefined) colB = colA;
		if (colC === undefined) colC = colA;

		const uv = this._pixelUVs;
		this.push(a.x, a.y, uv[0].x, uv[0].y, colA);
		this.pushUnsafe(b.x, b.y, uv[1].x, uv[1].y, colB);
		this.pushUnsafe(c.x, c.y, uv[2].x, uv[2].y, colC);
	}

	/**
	 * Draws a circle. If the current shader has a Sampler2D it uses the Graphics.Pixel texture
	 */
	public circle(pos:Vector, rad:number, steps:number, colorA:Color, colorB?:Color)
	{
		if (this.shader.sampler2d != null)
			this.setShaderTexture(this._pixel);

		if (colorB === undefined)
			colorB = colorA;

		this.checkState();

		const uv = this._pixelUVs;
		let last = new Vector(pos.x + rad, pos.y);
		for (let i = 1; i <= steps; i ++)
		{
			const angle = (i / steps) * Math.PI * 2;
			const next = new Vector(pos.x + Math.cos(angle), pos.y + Math.sin(angle));

			this.pushUnsafe(pos.x, pos.y, uv[0].x, uv[0].y, colorA);
			this.pushUnsafe(last.x, last.y, uv[1].x, uv[1].y, colorB);
			this.pushUnsafe(next.x, next.y, uv[2].x, uv[2].y, colorB);
			last  = next;
		}
	}

	public hollowRect(x:number, y:number, width:number, height:number, stroke:number, color:Color)
	{
		this.rect(x, y, width, stroke, color);
		this.rect(x, y + stroke, stroke, height - stroke * 2, color);
		this.rect(x + width - stroke, y + stroke, stroke, height - stroke * 2, color);
		this.rect(x, y + height - stroke, width, stroke, color);
	}

}
