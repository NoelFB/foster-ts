/**
 * Coroutine Class. Warning, this uses some pretty modern JS features and may not work on most browsers
 */
class Coroutine extends Component
{
	public wait:number = 0;
	private iterator:any = null;

	public constructor(call?:any)
	{
		super();
		this.active = this.visible = false;
		if (call)
			this.start(call);
	}

	public start(call:any):Coroutine
	{
		this.iterator = call();
		this.active = true;
		return this;
	}

	public resume():Coroutine
	{
		this.active = true;
		return this;
	}

	public pause():Coroutine
	{
		this.active = false;
		return this;
	}

	public stop():Coroutine
	{
		this.wait = 0;
		this.active = false;
		this.iterator = null;
		return this;
	}

	public update():void
	{
		this.wait  -= Engine.delta;
		if (this.wait > 0)
			return;

		this.step();
	}

	public step():void
	{
		if (this.iterator != null)
		{
			let next =  this.iterator.next();
			if (next.done)
				this.end(next.value == "remove");
			else
			{
				if (next.value == null)
					this.wait = 0;
				else if ((typeof next.value) === "number")
					this.wait = parseFloat(next.value);
			}
		}
	}

	public end(remove:boolean):void
	{
		this.stop();
		if (remove)
			this.entity.remove(this);
	}
}