class Alarm extends Component
{

	public percent:number;
	public duration:number;
	public callback:(Alarm)=>void;

	constructor() 
	{ 
		super();
		this.active = this.visible = false; 
	}

	public start(duration:number, callback:(Alarm)=>void):Alarm
	{
		this.percent = 0;
		this.duration = duration;
		this.callback = callback;
		return this;
	}

	public restart():Alarm
	{
		this.percent = 0;
		return this;
	}

	public resume():Alarm
	{
		if (this.percent < 1)
			this.active = true;
		return this;
	}

	public pause():Alarm
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
				this.active = false;
				this.callback(this);
			}
		}
	}
}