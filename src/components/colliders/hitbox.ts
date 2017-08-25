import {Engine} from "../../engine";
import {Color} from "../../util/color";
import {Rectangle} from "../../util/rectangle";
import {Vector} from "../../util/vector";
import {Collider} from "./collider";

const vec = new Vector();

export class Hitbox extends Collider
{
	public left:number;
	public top:number;
	public width:number;
	public height:number;

	public setTop(n:number)
	{
		const bottom = this.top + this.height;
		this.top = n;
		this.height = bottom - this.top;
	}

	public setLeft(n:number)
	{
		const right = this.left + this.width;
		this.left = n;
		this.width = right - this.left;
	}


	public get sceneCenterX():number
	{
		return this.getScenePosition(vec).x + this.left + this.width / 2;
	}

	public get sceneCenterY():number
	{
		return this.getScenePosition(vec).y + this.top + this.height / 2;
	}

	public get sceneLeft():number { return this.sceneX + this.left; }
	public get sceneRight():number { return this.sceneX + this.left + this.width; }
	public get sceneTop():number { return this.sceneY + this.top; }
	public get sceneBottom():number { return this.sceneY + this.top + this.height; }
	public get sceneBounds():Rectangle { return new Rectangle(this.sceneLeft, this.sceneTop, this.width, this.height); }
	public getSceneBounds(r:Rectangle):Rectangle
	{
		r.set(this.sceneLeft, this.sceneTop, this.width, this.height);
		return r;
	}

	// constructor(left:number, top:number, width:number, height:number, tags?:string[])
	constructor({left, top, width, height, tags}:{left:number, top:number, width:number, height:number, tags?:string[]})
	{
		super();

		this.type = Hitbox.name;

		console.assert(!isNaN(left) && !isNaN(top) && !isNaN(width) && !isNaN(height));

		this.left = left;
		this.top = top;
		this.width = width;
		this.height = height;

		if (tags !== undefined)
			for (const tag of tags)
				this.tag(tag);
	}

	public debugRender()
	{
		Engine.graphics.hollowRect(this.sceneLeft, this.sceneTop, this.width, this.height, 1, Color.red);
	}
}
