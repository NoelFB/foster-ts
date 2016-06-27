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
	public first:AnimationTemplate;
	
	constructor(name:string)
	{
		this.name = name;
	}
	
	public add(name:string, speed:number, frames:Texture[], loops:boolean, position?:Vector, origin?:Vector):AnimationSet
	{
		let anim = new AnimationTemplate(name, speed, frames, loops, position, origin);
		
		this.animations[name] = anim;
		if (this.first == null)
			this.first = anim;

		return this;
	}
	
	public addFrameAnimation(name:string, speed:number, tex:Texture, frameWidth:number, frameHeight:number, frames:number[], loops:boolean, position?:Vector, origin?:Vector):AnimationSet
	{
		let columns = Math.floor(tex.width / frameWidth);
		let texFrames:Texture[] = [];
		for (let i = 0; i < frames.length; i ++)
		{
			let index = frames[i]
			let tx = (index % columns) * frameWidth;
			let ty = Math.floor(index / columns) * frameWidth;
			texFrames.push(tex.getSubtexture(new Rectangle(tx, ty, frameWidth, frameHeight)));
		}
		let anim = new AnimationTemplate(name, speed, texFrames, loops, position, origin);

		this.animations[name] = anim;
		if (this.first == null)
			this.first = anim;

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
	public frames:Texture[];
	public origin:Vector;
	public position:Vector;
	public loops:boolean = false;
	public goto:string[] = null;
	
	constructor(name:string, speed:number, frames:Texture[], loops?:boolean, position?:Vector, origin?:Vector)
	{
		this.name = name;
		this.speed = speed;
		this.frames = frames;
		this.loops = loops || false;
		this.position = (position || new Vector(0, 0));
		this.origin = (origin || new Vector(0, 0));
	}
}