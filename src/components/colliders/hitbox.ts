/// <reference path="./collider.ts"/>
class Hitbox extends Collider
{
	public left:number;
	public top:number;
	public width:number;
	public height:number;
	
	public get sceneLeft():number { return this.scenePosition.x + this.left; }
	public get sceneRight():number { return this.scenePosition.x + this.left + this.width; }
	public get sceneTop():number { return this.scenePosition.y + this.top; }
	public get sceneBottom():number { return this.scenePosition.y + this.top + this.height; }
	public get sceneBounds():Rectangle { return new Rectangle(this.sceneLeft, this.sceneTop, this.width, this.height); }
	
	constructor(left:number, top:number, width:number, height:number, tags?:string[])
	{
		super();
		
		this.left = left;
		this.top = top;
		this.width = width;
		this.height = height;
		
		if (tags != undefined)
			for (let i = 0; i < tags.length; i ++)
				this.tag(tags[i]);
	}
	
	public debugRender()
	{
		Engine.graphics.hollowRect(this.sceneBounds, 1, Color.red);
	}
}