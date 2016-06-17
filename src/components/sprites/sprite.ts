/// <reference path="./../../component.ts"/>
class Sprite extends Component
{

	public texture:Texture;	
	public crop:Rectangle;
	public scale:Vector = new Vector(1, 1);
	public origin:Vector = new Vector(0, 0);
	public rotation:number = 0;
	public flipX:boolean = false;
	public flipY:boolean = false;
	public color:Color = Color.white;
	public alpha:number = 1;
	
	public get width() { return this.crop.width; }
	public get height() { return this.crop.height; }
	
	constructor(texture:Texture)
	{
		super();
		
		this.texture = texture;
		this.crop = new Rectangle(0, 0, texture.width, texture.height);
	}
	
	public render()
	{
		// only draw if the current shader actually takes a texture
		if (Engine.graphics.shader.sampler2d != null)
			Engine.graphics.texture
			(
				this.texture, 
				this.scenePosition.x,
				this.scenePosition.y, 
				this.crop, 
				this.color.mult(this.alpha), 
				this.origin, 
				this.scale, 
				this.rotation, 
				this.flipX, 
				this.flipY
			);
	}
}