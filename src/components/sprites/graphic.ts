import {Texture} from "../../assets/textures/texture";
import {Component} from "../../component";
import {Engine} from "../../engine";
import {Camera} from "../../util/camera";
import {Color} from "../../util/color";
import {Rectangle} from "../../util/rectangle";
import {Vector} from "../../util/vector";

export class Graphic extends Component
{
	public toString():string { return `<Graphic ${this.texture.bounds} of ${this.texture.texture.path}>`; }
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

	public get sceneBounds() { return new Rectangle(this.sceneX, this.sceneY, this.width, this.height); }

	private static sp = new Vector();
	public get sceneCenterX() { return this.getScenePosition(Graphic.sp).x + this.width/2; }
	public get sceneCenterY() { return this.getScenePosition(Graphic.sp).y + this.height/2; }

	public set sceneCenterX(x:number)
	{
		this.position.x = x - (this.entity ? this.entity.x : 0) + this.width/2;
	}

	public set sceneCenterY(y:number)
	{
		this.position.y = y - (this.entity ? this.entity.y : 0) + this.height/2;
	}

	constructor(texture:Texture, position?:Vector)
	{
		super();

		if (texture != null)
		{
			this.texture = texture;
			this.crop = new Rectangle(0, 0, texture.width, texture.height);
		}

		if (position)
			this.position.copy(position);
	}

	public center():void
	{
		this.justify(0.5, 0.5);
	}

	public justify(x:number, y:number):void
	{
		this.origin.set(this.width * x, this.height * y);
	}

	public render(camera:Camera, z=0):void
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
			this.flipY,
			this.texture.bounds.width,
			this.texture.bounds.height,
			z
		);
	}
}
