/// <reference path="./../../component.ts"/>
class Rectsprite extends Component
{

	public size:Vector = new Vector(0, 0);
	public scale:Vector = new Vector(1, 1);
	public origin:Vector = new Vector(0, 0);
	public rotation:number = 0;
	public color:Color = Color.white;
	public alpha:number = 1;
	
	public get width():number { return this.size.x }
	public set width(val:number) { this.size.x = val; }
	public get height():number { return this.size.y; }
	public set height(val:number) { this.size.y = val; }
		
	constructor(width:number, height:number, color?:Color)
	{
		super();

		this.size.x = width;
		this.size.y = height;
		this.color = color || Color.white;
	}
	
	public render()
	{
		// draw with a pixel texture (shader is using textures)
		if (Engine.graphics.shader.sampler2d != null && Engine.graphics.pixel != null)
		{
			Engine.graphics.texture
			(
				Engine.graphics.pixel, 
				this.scenePosition.x,
				this.scenePosition.y, 
				null, 
				this.color.mult(this.alpha), 
				new Vector(this.origin.x / this.size.x, this.origin.y / this.size.y), 
				Vector.mult(this.size, this.scale), 
				this.rotation
			);
		}
		// draw primitive (no texture, just a quad with colors) 
		else
		{
			Engine.graphics.quad
			(
				this.scenePosition.x,
				this.scenePosition.y,
				this.size.x,
				this.size.y,
				this.color.mult(this.alpha),
				this.origin,
				this.scale,
				this.rotation
			);
		}
	}
}