class Graphics
{
	// core
    private engine:Engine;
    private screen:HTMLCanvasElement;
	private screenContext:CanvasRenderingContext2D;
    private buffer:HTMLCanvasElement;
    private bufferContext:WebGLRenderingContext;
	public get gl():WebGLRenderingContext { return this.bufferContext; }
	public get screenCanvas():HTMLCanvasElement { return this.screen; }
	
	// vertices
	private vertexBuffer:WebGLBuffer;
	private uvBuffer:WebGLBuffer;
	private colorBuffer:WebGLBuffer;
	private vertices:number[] = [];
	private uvs:number[] = [];
	private colors:number[] = [];
	
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
	private orthoMatrix:Matrix;
	public get orthographic():Matrix { return this.orthoMatrix; }

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
	public clearColor:Color = new Color(0.1, 0.1, 0.3, 1);
	public drawCalls:number = 0;
   
    /**
	 * Creates the Engine.Graphics
	 */
    constructor(engine:Engine)
    {
        this.engine = engine;
        
        // create the screen
        this.screen = document.createElement("canvas");
		this.screenContext = this.screen.getContext('2d');
        Engine.root.appendChild(this.screen);
        
        // create the buffer
        this.buffer = document.createElement("canvas");
        this.bufferContext = this.buffer.getContext("experimental-webgl", 
		{
			alpha: false, 
			antialias: false
		}) as WebGLRenderingContext;
		
		this.gl.enable(this.gl.BLEND);
		this.gl.disable(this.gl.DEPTH_TEST);
		this.gl.disable(this.gl.CULL_FACE);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
		
		this.vertexBuffer = this.gl.createBuffer();
		this.uvBuffer = this.gl.createBuffer();
		this.colorBuffer = this.gl.createBuffer();
        
		this.resize();
    }
    
	/**
	 * Called when the Game resolution changes
	 */
    public resize():void
    {
		// buffer
        this.buffer.width = Engine.width;
        this.buffer.height = Engine.height;
        this.gl.viewport(0, 0, this.buffer.width, this.buffer.height);
		
		// orthographic matrix
		this.orthoMatrix = new Matrix();
		this.orthoMatrix.translate(-1, 1);
		this.orthoMatrix.scale(1 / this.buffer.width * 2, -1 / this.buffer.height * 2);
    }
	
	/**
	 * Updates the Graphics
	 */
	public update():void
	{
		// resizing
		if (this.screen.width != Engine.root.clientWidth || this.screen.height != Engine.root.clientHeight)
		{
			this.screen.width = Engine.root.clientWidth;
			this.screen.height = Engine.root.clientHeight;
		}
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
	 * Draws the game to the Screen canvas
	 */
	public output()
	{
		this.screenContext.clearRect(0, 0, this.screen.width, this.screen.height);
		(this.screenContext as any).imageSmoothingEnabled = false;
		
		let bounds = this.getOutputBounds();
		this.screenContext.drawImage(this.buffer, bounds.x, bounds.y, bounds.width, bounds.height);
	}
	
	/**
	 * Gets the rectangle that the game buffer should be drawn to the screen with
	 */
	public getOutputBounds():Rectangle
	{	
		let scale = (Math.min(this.screen.width / this.buffer.width, this.screen.height / this.buffer.height));
		let width = this.buffer.width * scale;
		let height = this.buffer.height * scale;
		
		return new Rectangle((this.screen.width - width) / 2, (this.screen.height - height) / 2, width, height);
	}
	
	/**
	 * Resets the Graphics rendering
	 */
	public reset()
	{
		this.drawCalls = 0;
		this.currentShader = null;
		this.nextShader = null;
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
		this.check();
		
		// append
		this.vertices.push(x, y);
		this.uvs.push(u, v);
		if (color != undefined && color != null)
			this.colors.push(color.r, color.g, color.b, color.a);
	}
	
	/**
	 * Pushes a list of vertices to the screen. If the shader has been modified, this will end and start a new draw call
	 */
	public pushList(pos:Vector[], uv:Vector[], color:Color[])
	{
		this.check();
		
		for (let i = 0; i < pos.length; i ++)
		{
			this.vertices.push(pos[i].x, pos[i].y);
			if (uv != undefined && uv != null)
				this.uvs.push(uv[i].x, uv[i].y);
			if (color != undefined && color != null)
			{
				let c = color[i];
				this.colors.push(c.r, c.g, c.b, c.a);
			}
		}
	}
	
	/**
	 * Checks if the shader was modified, and if so, flushes the current vertices & starts a new draw
	 */
	public check()
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
					if (uniform.type == ShaderUniformType.float)
					{
						this.gl.uniform1f(location, uniform.value);
					}
					else if (uniform.type == ShaderUniformType.sampler2D)
					{
						this.gl.activeTexture((<any>this.gl)["TEXTURE" + textureCounter]);
						this.gl.bindTexture(this.gl.TEXTURE_2D, (uniform.value as Texture).texture.webGLTexture);
						this.gl.uniform1i(location, 0);
						textureCounter += 1;
					}
					else if (uniform.type == ShaderUniformType.matrix3d)
					{
						if (uniform.value instanceof Matrix)
							this.gl.uniformMatrix3fv(location, false, (uniform.value as Matrix).mat);
						else
							this.gl.uniformMatrix2fv(location, false, uniform.value);
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
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
					this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
					this.gl.vertexAttribPointer(attr.attribute, 2, this.gl.FLOAT, false, 0, 0);
				}
				else if (attr.type == ShaderAttributeType.Uv)
				{
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
					this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.uvs), this.gl.STATIC_DRAW);
					this.gl.vertexAttribPointer(attr.attribute, 2, this.gl.FLOAT, false, 0, 0);
				}
				else if (attr.type == ShaderAttributeType.Color)
				{
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
					this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
					this.gl.vertexAttribPointer(attr.attribute, 4, this.gl.FLOAT, false, 0, 0);
				}
			}
			
			// draw vertices
			this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 2);
			this.drawCalls ++;
			
			// clear	
			this.vertices = [];
			this.uvs = [];
			this.colors = [];
		}
	}
	
	// temp. vars used for drawing
	private topleft:Vector = new Vector();
	private topright:Vector = new Vector();
	private botleft:Vector = new Vector();
	private botright:Vector = new Vector();
	private texToDraw:Texture = new Texture(null, new Rectangle(), new Rectangle());
	
	/**
	 * Sets the current texture on the shader (if the shader has a sampler2d uniform)
	 */
	public setShaderTexture(tex:Texture):void
	{
		if (Engine.assert(this.shader.sampler2d != null, "This shader has no Sampler2D to set the texture to"))
			this.shader.sampler2d.value = tex;
	}
	
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
		this.push(posX + this.topright.x, posY + this.topright.y, uvMaxX, uvMinY, col);
		this.push(posX + this.botright.x, posY + this.botright.y, uvMaxX, uvMaxY, col);
		this.push(posX + this.topleft.x, posY + this.topleft.y, uvMinX, uvMinY, col);
		this.push(posX + this.botright.x, posY + this.botright.y, uvMaxX, uvMaxY, col);
		this.push(posX + this.botleft.x, posY + this.botleft.y, uvMinX, uvMaxY, col);
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
		this.push(posX + this.topright.x, posY + this.topright.y, 0, 0, color);
		this.push(posX + this.botright.x, posY + this.botright.y, 0, 0, color);
		this.push(posX + this.topleft.x, posY + this.topleft.y, 0, 0, color);
		this.push(posX + this.botright.x, posY + this.botright.y, 0, 0, color);
		this.push(posX + this.botleft.x, posY + this.botleft.y, 0, 0, color);
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
		this.push(bounds.right, bounds.top, uv[1].x, uv[1].y, color);
		this.push(bounds.right, bounds.bottom,uv[2].x, uv[2].y, color);
		this.push(bounds.left, bounds.top, uv[0].x, uv[0].y, color);
		this.push(bounds.left, bounds.bottom, uv[3].x, uv[3].y, color);
		this.push(bounds.right, bounds.bottom, uv[2].x, uv[2].y, color);
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
		this.push(b.x, b.y, uv[1].x, uv[1].y, colB);
		this.push(c.x, c.y, uv[2].x, uv[2].y, colC);
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
			
		let uv = this._pixelUVs;
		let last = new Vector(pos.x + rad, pos.y);
		for (let i = 1; i <= steps; i ++)
		{
			let angle = (i / steps) * Math.PI * 2;
			let next = new Vector(pos.x + Math.cos(angle), pos.y + Math.sin(angle));
			
			this.push(pos.x, pos.y, uv[0].x, uv[0].y, colorA);
			this.push(last.x, last.y, uv[1].x, uv[1].y, colorB);
			this.push(next.x, next.y, uv[2].x, uv[2].y, colorB);
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
		this.push(b.x, b.y, 0, 0, colB);
		this.push(c.x, c.y, 0, 0, colC);
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
			
		let uv = this._pixelUVs;
		let last = new Vector(pos.x + rad, pos.y);
		for (let i = 1; i <= steps; i ++)
		{
			let angle = (i / steps) * Math.PI * 2;
			let next = new Vector(pos.x + Math.cos(angle), pos.y + Math.sin(angle));
			
			this.push(pos.x, pos.y, 0, 0, colorA);
			this.push(last.x, last.y, 0, 0, colorB);
			this.push(next.x, next.y, 0, 0, colorB);
			last  = next;
		}
	}
	
}
