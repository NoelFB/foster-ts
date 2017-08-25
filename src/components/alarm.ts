import {Component} from "../component";
import {Engine} from "../engine";
import {Entity} from "../entity";

export class Alarm extends Component
{
	/**
	 * Gets the current Percent of the Alarm
	 */
	public get percent():number { return this._percent; }
	private _percent:number = 0;

	/**
	 * Gets the current Duration of the Alarm
	 */
	public get duration():number { return this._duration; }
	private _duration:number;

	/**
	 * Called when the Alarm is finished
	 */
	public callback:(alarm: Alarm)=>void;

	/**
	 * If the Alarm should be removed from the Entity upon completion
	 */
	public removeOnComplete:boolean = false;

	constructor()
	{
		super();
		this.active = this.visible = false;
	}

	/**
	 * Starts the Alarm
	 */
	public start(duration:number, callback:(alarm: Alarm)=>void):Alarm
	{
		this._percent = 0;
		this._duration = duration;
		this.callback = callback;
		this.active = true;
		return this;
	}

	/**
	 * Restarts the Alarm
	 */
	public restart():Alarm
	{
		this._percent = 0;
		return this;
	}

	/**
	 * Resumes the Alarm if it was paused
	 */
	public resume():Alarm
	{
		if (this.percent < 1)
			this.active = true;
		return this;
	}

	/**
	 * Pauses the Alarm if it was active
	 */
	public pause():Alarm
	{
		this.active = false;
		return this;
	}

	/**
	 * Updates the Alarm (automatically called during its Entity's update)
	 */
	public update():void
	{
		if (this.percent < 1 && this.duration > 0)
		{
			this._percent += Engine.delta / this.duration;
			if (this.percent >= 1)
			{
				this._percent = 1;
				this.active = false;
				this.callback(this);

				if (this.removeOnComplete)
					this.entity.remove(this);
			}
		}
	}

	/**
	 * Creates and adds a new Alarm on the given Entity
	 */
	public static create(on:Entity):Alarm
	{
		return on.add(new Alarm());
	}
}
