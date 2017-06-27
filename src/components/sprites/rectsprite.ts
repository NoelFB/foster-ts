/// <reference path="./../../component.ts"/>
class Rectsprite extends Component
{

	public size:Vector = new Vector(0, 0);
	public scale:Vector = new Vector(1, 1);
	public origin:Vector = new Vector(0, 0);
	public rotation:number = 0;
	public color:Color = Color.white.clone();
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
		if (Engine.graphics.shader.sampler2d != null)
		{
			Engine.graphics.texture
			(
				Engine.graphics.pixel, 
				this.scenePosition.x,
				this.scenePosition.y, 
				null, 
				Color.temp.copy(this.color).mult(this.alpha), 
				Vector.temp0.copy(this.origin).div(this.size),
				Vector.temp1.copy(this.size).mult(this.scale),
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
				Color.temp.copy(this.color).mult(this.alpha),
				this.origin,
				this.scale,
				this.rotation
			);
		}
	}
}