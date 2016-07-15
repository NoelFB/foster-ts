enum ResolutionStyle
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
	FillInteger
}

class Graphics
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
	private currentShader:Shader = null;
	private nextShader:Shader = null;

	public get shader():Shader 
	{
		if (this.nextShader != null)
			return this.nextShader; 
		return this.currentShader; 
	}
	public set shader(s:Shader)
	{
		if (this.shader != s && s != null)
			this.nextShader = s;
	}

	// orthographic matrix
	public orthographic:Matrix = new Matrix();
	private toscreen:Matrix = new Matrix();

	// pixel drawing
	private _pixel:Texture = null;
	private _pixelUVs:Vector[];
	
	public set pixel(p:Texture) 
	{ 
		let minX = p.bounds.left / p.texture.width;
		let minY = p.bounds.top / p.texture.height;
		let maxX = p.bounds.right / p.texture.width;
		let maxY = p.bounds.bottom / p.texture.height;
		
		this._pixel = p;
		this._pixelUVs = 
		[
			new Vector(minX, minY),
			new Vector(maxX, minY),
			new Vector(maxX, maxY),
			new Vector(minX, maxY)
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
		this.gl = this.canvas.getContext('experimental-webgl',
		{
			alpha: false, 
			antialias: false
		}) as WebGLRenderingContext;
		Engine.root.appendChild(this.canvas);

		this.gl.enable(this.gl.BLEND);
		this.gl.disable(this.gl.DEPTH_TEST);
		this.gl.disable(this.gl.CULL_FACE);
		this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

		this.vertexBuffer = this.gl.createBuffer();
		this.texcoordBuffer = this.gl.createBuffer();
		this.colorBuffer = this.gl.createBuffer();
	}

	/**
	 * Unloads the Graphics and WebGL stuff
	 */
	public unload()
	{
		this.gl.deleteBuffer(this.vertexBuffer);
		this.gl.deleteBuffer(this.colorBuffer);
		this.gl.deleteBuffer(this.texcoordBuffer);
		this.buffer.dispose();
		this.buffer = null;
		this.canvas.remove();
		this.canvas = null;
		
		// TODO: Implement this properly
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
		if (this.canvas.width != Engine.root.clientWidth || this.canvas.height != Engine.root.clientHeight)
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

		if (this.resolutionStyle == ResolutionStyle.Exact)
		{
			scaleX = this.canvas.width / this.buffer.width;
			scaleY = this.canvas.height / this.buffer.height;
		}
		else if (this.resolutionStyle == ResolutionStyle.Contain)
		{
			scaleX = scaleY = (Math.min(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height)); 
		}
		else if (this.resolutionStyle == ResolutionStyle.ContainInteger)
		{
			scaleX = scaleY = Math.floor(Math.min(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
		}
		else if (this.resolutionStyle == ResolutionStyle.Fill)
		{
			scaleX = scaleY = (Math.max(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
		}
		else if (this.resolutionStyle == ResolutionStyle.FillInteger)
		{
			scaleX = scaleY = Math.ceil(Math.max(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
		}

		let width = this.buffer.width * scaleX;
		let height = this.buffer.height * scaleY;
		
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
		if (this.currentTarget != target)
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
		if (this.nextShader != null || this.currentShader.dirty)
		{
			// flush existing
			if (this.currentShader != null)
				this.flush();
			
			// swap
			let swapped = (this.nextShader != null);
			if (swapped)
			{
				// disable prev. attributes
				if (this.currentShader != null)
					for (let i = 0; i < this.currentShader.attributes.length; i ++)
						this.gl.disableVertexAttribArray(this.currentShader.attributes[i].attribute);
					
				// swap
				this.currentShader = this.nextShader;
				this.nextShader = null;
				this.gl.useProgram(this.currentShader.program);
				
				// enable attributes
				for (let i = 0; i < this.currentShader.attributes.length; i ++)
					this.gl.enableVertexAttribArray(this.currentShader.attributes[i].attribute);
			}
			
			// set shader uniforms
			let textureCounter = 0;
			for (let i = 0; i < this.currentShader.uniforms.length; i ++)
			{
				let uniform = this.currentShader.uniforms[i];
				let location = uniform.uniform;
				
				if (swapped || uniform.dirty)
				{
					// special case for Sampler2D
					if (uniform.type == ShaderUniformType.sampler2D)
					{
						this.gl.activeTexture((<any>this.gl)["TEXTURE" + textureCounter]);
						if (uniform.value instanceof Texture)
							this.gl.bindTexture(this.gl.TEXTURE_2D, (<Texture>uniform.value).texture.webGLTexture);
						else
							this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value);
						this.gl.uniform1i(location, textureCounter);
						textureCounter += 1;
					}
					// otherwise use normal Uniform Set Method
					else
					{
						setGLUniformValue[uniform.type](this.gl, uniform.uniform, uniform.value);
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
			for (let i = 0; i < this.currentShader.attributes.length; i ++)
			{
				let attr = this.currentShader.attributes[i];
				if (attr.type == ShaderAttributeType.Position)
				{
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.vertexBuffer : this.currentTarget.vertexBuffer));
					this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
					this.gl.vertexAttribPointer(attr.attribute, 2, this.gl.FLOAT, false, 0, 0);
				}
				else if (attr.type == ShaderAttributeType.Texcoord)
				{
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.texcoordBuffer : this.currentTarget.texcoordBuffer));
					this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texcoords), this.gl.STATIC_DRAW);
					this.gl.vertexAttribPointer(attr.attribute, 2, this.gl.FLOAT, false, 0, 0);
				}
				else if (attr.type == ShaderAttributeType.Color)
				{
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.colorBuffer : this.currentTarget.colorBuffer));
					this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
					this.gl.vertexAttribPointer(attr.attribute, 4, this.gl.FLOAT, false, 0, 0);
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
		let bounds = this.getOutputBounds();
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
		if (color != undefined && color != null)
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
		if (color != undefined && color != null)
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
			if (uv != undefined && uv != null)
				this.texcoords.push(uv[i].x, uv[i].y);
			if (color != undefined && color != null)
			{
				let c = color[i];
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
		if (crop == undefined || crop == null)
			t = tex;
		else
			t = tex.getSubtexture(crop, this.texToDraw);
		
		// size
		let left = -t.frame.x;
		let top = -t.frame.y;
		let width = t.bounds.width;
		let height = t.bounds.height;

		// relative positions
		this.topleft.set(left, top);
		this.topright.set(left + width, top);
		this.botleft.set(left, top + height);
		this.botright.set(left + width, top + height);
		
		// offset by origin
		if (origin && (origin.x != 0 || origin.y != 0))
		{
			this.topleft.sub(origin);
			this.topright.sub(origin);
			this.botleft.sub(origin);
			this.botright.sub(origin);
		}
		
		// scale
		if (scale && (scale.x != 1 || scale.y != 1))
		{
			this.topleft.mult(scale);
			this.topright.mult(scale);
			this.botleft.mult(scale);
			this.botright.mult(scale);
		}
		
		// rotate
		if (rotation && rotation != 0)
		{
			let s = Math.sin(rotation);
			let c = Math.cos(rotation);
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
			let a = uvMinX;
			uvMinX = uvMaxX;
			uvMaxX = a;
		}
		
		// flip UVs on Y
		if (flipY)
		{
			let a = uvMinY;
			uvMinY = uvMaxY;
			uvMaxY = a;
		}
		
		// color
		let col = (color || Color.white);

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
		let left = 0;
		let top = 0;

		// relative positions
		this.topleft.set(left, top);
		this.topright.set(left + width, top);
		this.botleft.set(left, top + height);
		this.botright.set(left + width, top + height);
		
		// offset by origin
		if (origin && (origin.x != 0 || origin.y != 0))
		{
			this.topleft.sub(origin);
			this.topright.sub(origin);
			this.botleft.sub(origin);
			this.botright.sub(origin);
		}
		
		// scale
		if (scale && (scale.x != 1 || scale.y != 1))
		{
			this.topleft.mult(scale);
			this.topright.mult(scale);
			this.botleft.mult(scale);
			this.botright.mult(scale);
		}
		
		// rotate
		if (rotation && rotation != 0)
		{
			let s = Math.sin(rotation);
			let c = Math.cos(rotation);
			this.topleft.rotate(s, c);
			this.topright.rotate(s, c);
			this.botleft.rotate(s, c);
			this.botright.rotate(s, c);
		}

		// color
		let col = (color || Color.white);
		
		// push vertices
		this.push(posX + this.topleft.x, posY + this.topleft.y, 0, 0, color);
		this.pushUnsafe(posX + this.topright.x, posY + this.topright.y, 0, 0, color);
		this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, 0, 0, color);
		this.pushUnsafe(posX + this.topleft.x, posY + this.topleft.y, 0, 0, color);
		this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, 0, 0, color);
		this.pushUnsafe(posX + this.botleft.x, posY + this.botleft.y, 0, 0, color);
	}
	
	/**
	 * Draws a rectangle with the Graphics.Pixel texture
	 */
	public pixelRect(bounds:Rectangle, color:Color)
	{
		Engine.assert(this._pixel != null, "pixelRect requires the Graphics.pixel Subtexture be set");
		this.setShaderTexture(this._pixel);
			
		let uv = this._pixelUVs;
		this.push(bounds.left, bounds.top, uv[0].x, uv[0].y, color);
		this.pushUnsafe(bounds.right, bounds.top, uv[1].x, uv[1].y, color);
		this.pushUnsafe(bounds.right, bounds.bottom,uv[2].x, uv[2].y, color);
		this.pushUnsafe(bounds.left, bounds.top, uv[0].x, uv[0].y, color);
		this.pushUnsafe(bounds.left, bounds.bottom, uv[3].x, uv[3].y, color);
		this.pushUnsafe(bounds.right, bounds.bottom, uv[2].x, uv[2].y, color);
	}
	
	/**
	 * Draws a triangle with the Graphics.Pixel texture
	 */
	public pixelTriangle(a:Vector, b:Vector, c:Vector, colA:Color, colB?:Color, colC?:Color)
	{
		Engine.assert(this._pixel != null, "pixelTriangle requires the Graphics.pixel Subtexture be set");
		this.setShaderTexture(this._pixel);
		
		if (colB == undefined) colB = colA;
		if (colC == undefined) colC = colA;
		
		let uv = this._pixelUVs;
		this.push(a.x, a.y, uv[0].x, uv[0].y, colA);
		this.pushUnsafe(b.x, b.y, uv[1].x, uv[1].y, colB);
		this.pushUnsafe(c.x, c.y, uv[2].x, uv[2].y, colC);
	}
	
	/**
	 * Draws a circle with the Graphics.Pixel texture
	 */
	public pixelCircle(pos:Vector, rad:number, steps:number, colorA:Color, colorB?:Color)
	{
		Engine.assert(this._pixel != null, "pixelCircle requires the Graphics.pixel Subtexture be set");
		this.setShaderTexture(this._pixel);
			
		if (colorB == undefined)
			colorB = colorA;

		this.checkState();
			
		let uv = this._pixelUVs;
		let last = new Vector(pos.x + rad, pos.y);
		for (let i = 1; i <= steps; i ++)
		{
			let angle = (i / steps) * Math.PI * 2;
			let next = new Vector(pos.x + Math.cos(angle), pos.y + Math.sin(angle));
			
			this.pushUnsafe(pos.x, pos.y, uv[0].x, uv[0].y, colorA);
			this.pushUnsafe(last.x, last.y, uv[1].x, uv[1].y, colorB);
			this.pushUnsafe(next.x, next.y, uv[2].x, uv[2].y, colorB);
			last  = next;
		}
	}
	
	/**
	 * Draws a triangle. Best used with Shaders.Primitive
	 */
	public triangle(a:Vector, b:Vector, c:Vector, colA:Color, colB?:Color, colC?:Color)
	{
		if (colB == undefined) colB = colA;
		if (colC == undefined) colC = colA;
		
		this.push(a.x, a.y, 0, 0, colA);
		this.pushUnsafe(b.x, b.y, 0, 0, colB);
		this.pushUnsafe(c.x, c.y, 0, 0, colC);
	}
	
	/**
	 * Draws a rectangle. Best used with Shaders.Primitive
	 */
	public rect(r:Rectangle, color:Color)
	{
		this.triangle(new Vector(r.left, r.top), new Vector(r.right, r.top), new Vector(r.right, r.bottom), color);
		this.triangle(new Vector(r.left, r.top), new Vector(r.right, r.bottom), new Vector(r.left, r.bottom), color);
	}
	
	public hollowRect(r:Rectangle, stroke:number, color:Color)
	{
		this.rect(new Rectangle(r.left, r.top, r.width, stroke), color);
		this.rect(new Rectangle(r.left, r.top + stroke, stroke, r.height - stroke * 2), color);
		this.rect(new Rectangle(r.right - stroke, r.top + stroke, stroke, r.height - stroke * 2), color);
		this.rect(new Rectangle(r.left, r.bottom - stroke, r.width, stroke), color);
	}
	
	/**
	 * Draws a circle. Best used with Shaders.Primitive
	 */
	public circle(pos:Vector, rad:number, steps:number, colorA:Color, colorB?:Color)
	{		
		if (colorB == undefined)
			colorB = colorA;
		
		this.checkState();

		let uv = this._pixelUVs;
		let last = new Vector(pos.x + rad, pos.y);
		for (let i = 1; i <= steps; i ++)
		{
			let angle = (i / steps) * Math.PI * 2;
			let next = new Vector(pos.x + Math.cos(angle), pos.y + Math.sin(angle));
			
			this.pushUnsafe(pos.x, pos.y, 0, 0, colorA);
			this.pushUnsafe(last.x, last.y, 0, 0, colorB);
			this.pushUnsafe(next.x, next.y, 0, 0, colorB);
			last  = next;
		}
	}
	
}
