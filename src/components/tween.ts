/// <reference path="./../component.ts"/>
class Tween extends Component
{

	public percent:number = 0;
	public duration:number;
	public from:number;
	public to:number;
	public ease:(number)=>number;
	public step:(number)=>void;
	public removeOnComplete:boolean = false;

	constructor() 
	{ 
		super();
		this.active = this.visible = false; 
	}

	public start(duration:number, from:number, to:number, ease:(number)=>number, step:(number)=>void, removeOnComplete?:boolean):Tween
	{
		this.percent = 0;
		this.duration = duration;
		this.from = from;
		this.to = to;
		this.ease = ease;
		this.step = step;
		this.removeOnComplete = removeOnComplete;
		return this;
	}

	public restart():Tween
	{
		this.percent = 0;
		this.active = true;
		return this;
	}

	public resume():Tween
	{
		if (this.percent < 1)
			this.active = true;
		return this;
	}

	public pause():Tween
	{
		this.active = false;
		return this;
	}

	public update():void
	{
		if (this.percent < 1)
		{
			this.percent += Engine.delta / this.duration;
			if (this.percent >= 1)
			{
				this.percent = 1;
				this.step(this.to);
				this.active = false;
				if (this.removeOnComplete)
					this.entity.remove(this);
			}
			else
				this.step(this.from + (this.to - this.from) * this.ease(this.percent));
		}
	}
}