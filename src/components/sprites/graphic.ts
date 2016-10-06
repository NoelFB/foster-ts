/// <reference path="./../../component.ts"/>
class Graphic extends Component
{

	public texture:Texture;	
	public crop:Rectangle;
	public scale:Vector = new Vector(1, 1);
	public origin:Vector = new Vector(0, 0);
	public rotation:number = 0;
	public flipX:boolean = false;
	public flipY:boolean = false;
	public color:Color = Color.white.clone();
	public alpha:number = 1;
	
	public get width() { return this.crop ? this.crop.width : (this.texture ? this.texture.width : 0); }
	public get height() { return this.crop ? this.crop.height : (this.texture ? this.texture.height : 0); }
	
	constructor(texture:Texture, position?:Vector)
	{
		super();
		
		if (texture != null)
		{
			this.texture = texture;
			this.crop = new Rectangle(0, 0, texture.width, texture.height);
		}

		if (position)
			this.position = position;
	}

	public center():void
	{
		this.justify(0.5, 0.5);
	}

	public justify(x:number, y:number):void
	{
		this.origin.set(this.width * x, this.height * y);
	}
	
	public render(camera:Camera):void
	{
		Engine.graphics.texture
		(
			this.texture, 
			this.scenePosition.x,
			this.scenePosition.y, 
			this.crop, 
			Color.temp.copy(this.color).mult(this.alpha), 
			this.origin, 
			this.scale, 
			this.rotation, 
			this.flipX, 
			this.flipY
		);
	}
}