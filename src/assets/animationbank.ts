class AnimationBank
{
	public static bank:{[name:string]: AnimationSet} = {};
	
	public static create(name:string):AnimationSet
	{
		var animSet = new AnimationSet(name);
		AnimationBank.bank[name] = animSet;
		return animSet;
	}
	
	public static get(name:string):AnimationSet
	{
		return AnimationBank.bank[name];
	}
	
	public static has(name:string):boolean
	{
		return AnimationBank.bank[name] != undefined;
	}
}

class AnimationSet
{
	public name:string;
	public animations:{[name:string]: AnimationTemplate} = {};
	
	constructor(name:string)
	{
		this.name = name;
	}
	
	public add(name:string, speed:number, frames:Subtexture[], position?:Vector, origin?:Vector):AnimationSet
	{
		let anim = new AnimationTemplate(name, speed, frames, position, origin);
		this.animations[name] = anim;
		return this;
	}
	
	public get(name:string):AnimationTemplate
	{
		return this.animations[name];
	}
	
	public has(name:string):boolean
	{
		return this.animations[name] != undefined;
	}
}

class AnimationTemplate
{
	public name:string;
	public speed:number;
	public frames:Subtexture[];
	public origin:Vector;
	public position:Vector;
	
	constructor(name:string, speed:number, frames:Subtexture[], position?:Vector, origin?:Vector)
	{
		this.name = name;
		this.speed = speed;
		this.frames = frames;
		this.position = (position || new Vector(0, 0));
		this.origin = (origin || new Vector(0, 0));
	}
}