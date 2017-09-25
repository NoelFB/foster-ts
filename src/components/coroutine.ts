import {Component, Engine} from "./../core";

/**
 * Coroutine Class. This uses generator functions which are only supported in ES6 and is missing in many browsers.
 * More information:https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/function*
 */
export class Coroutine extends Component
{
	private wait:number = 0;
	private iterator:Iterator<any> = null;

	/**
	 * @param call? 	if set, immediately starts he Coroutine with the given Iterator
	 */
	public constructor(call?:() => Iterator<any>)
	{
		super();
		this.active = this.visible = false;
		if (call)
			this.start(call);
	}

	/**
	 * Starts the Coroutine with the given Iterator
	 */
	public start(call:() => Iterator<any>):Coroutine
	{
		this.iterator = call();
		this.active = true;
		return this;
	}

	/**
	 * Resumes the current Coroutine (sets this.active to true)
	 */
	public resume():Coroutine
	{
		this.active = true;
		return this;
	}

	/**
	 * Pauses the current Coroutine (sets this.active to false)
	 */
	public pause():Coroutine
	{
		this.active = false;
		return this;
	}

	/**
	 * Stops the Coroutine, and sets the current Iterator to null
	 */
	public stop():Coroutine
	{
		this.wait = 0;
		this.active = false;
		this.iterator = null;
		return this;
	}

	/**
	 * Updates the Coroutine (automatically called its Entity's update)
	 */
	public update():void
	{
		this.wait  -= Engine.delta;
		if (this.wait > 0)
			return;

		this.step();
	}

	/**
	 * Steps the Coroutine through the Iterator once
	 */
	public step():void
	{
		if (this.iterator != null)
		{
			const next =  this.iterator.next();
			if (next.done)
				this.end(next.value === "remove");
			else
			{
				if (next.value == null)
					this.wait = 0;
				else if ((typeof next.value) === "number")
					this.wait = parseFloat(next.value);
			}
		}
	}

	/**
	 * Calls Coroutine.stop and will optionally remove itself from the Entity
	 */
	public end(remove:boolean):void
	{
		this.stop();
		if (remove)
			this.entity.remove(this);
	}
}
