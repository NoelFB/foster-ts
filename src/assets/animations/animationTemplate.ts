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