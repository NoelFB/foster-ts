import {Component} from "../component";
import {Engine} from "../engine";
import {Entity} from "../entity";

export class Tween extends Component
{

	/**
	 * Gets the current Percent of the Tween
	 */
	public get percent():number { return this._percent; }
	private _percent:number = 0;

	/**
	 * Gets the current Duration of the Tween
	 */
	public get duration():number { return this._duration; }
	private _duration:number;

	/**
	 * The value of the Tween at the current Percent
	 */
	public get value():number { return this.from + (this.to - this.from) * this.ease(this.percent); }

	/**
	 * From value of the Tween (when percent is 0)
	 */
	public from:number = 0;

	/**
	 * To value of the Tween (when percent is 1)
	 */
	public to:number = 0;

	/**
	 * Easer function (ex. Linear would be (p) => { return p; })
	 * Alternatively, use the static Ease methods
	 */
	public ease:(t:number)=>number = p => p;

	/**
	 * Callback when the Tween is updated, returning the current Value
	 */
	public step:(val:number)=>void;

	public onComplete:()=>void;

	public setOnComplete(onComplete:()=>void):Tween { this.onComplete = onComplete; return this; }

	/**
	 * If the Tween should be removed upon completion
	 */
	public removeOnComplete:boolean = false;

	constructor()
	{
		super();
		this.active = this.visible = false;
	}

	/**
	 * Initializes the Tween and begins running
	 */
	public start(
		duration:number, from:number, to:number, ease:(t:number)=>number,
		step:(val:number)=>void, removeOnComplete?:boolean):Tween
	{
		this._percent = 0;
		this._duration = duration;
		this.from = from;
		this.to = to;
		this.ease = ease;
		this.step = step;
		this.removeOnComplete = removeOnComplete;
		return this;
	}

	/**
	 * Restarts the current Tween
	 */
	public restart():Tween
	{
		this._percent = 0;
		this.active = true;
		return this;
	}

	/**
	 * Resumes the current tween if it was paused
	 */
	public resume():Tween
	{
		if (this.percent < 1)
			this.active = true;
		return this;
	}

	/**
	 * Pauses the current tween if it was active
	 */
	public pause():Tween
	{
		this.active = false;
		return this;
	}

	/**
	 * Upates the tween (automatically called when its Entity is updated)
	 */
	public update():void
	{
		if (this.percent < 1 && this.duration > 0)
		{
			this._percent += Engine.delta / this.duration;
			if (this.percent >= 1)
			{
				this._percent = 1;
				this.step(this.to);
				this.active = false;
				if (this.onComplete)
					this.onComplete();
				if (this.removeOnComplete)
					this.entity.remove(this);
			}
			else
				this.step(this.value);
		}
	}

	/**
	 * Creates a new tween on an existing entity
	 */
	public static create(on:Entity):Tween
	{
		const tween = new Tween();
		on.add(tween);
		return tween;
	}
}
