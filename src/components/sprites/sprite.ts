import {Graphic} from "./graphic";
import {SpriteAnimationTemplate, SpriteBank, SpriteTemplate} from "./../../assets";
import {Engine} from "./../../core";
import {Calc, Camera, Color, Rectangle, Vector} from "./../../util";

export class Sprite extends Graphic
{
	private _animation:SpriteTemplate = null;
	private _playing:SpriteAnimationTemplate = null;
	private _frame:number = 0;

	public get animation():SpriteTemplate { return this._animation; }
	public get playing():SpriteAnimationTemplate { return this._playing; }
	public get frame():number { return Math.floor(this._frame); }
	public set frame(n:number)
	{
		this._frame = n;
		if (this.playing != null)
		{
			this._frame = Calc.clamp(n, 0, this.playing.frames.length);
			this.texture = this.playing.frames[this.frame];
		}

	}
	public rate:number = 1;

	constructor(animation:string)
	{
		super(null);

		Engine.assert(SpriteBank.has(animation), "Missing animation '" + animation + "'!");
		this._animation = SpriteBank.get(animation);
		this.texture = this._animation.first.frames[0];
	}

	public play(name:string, restart?:boolean):void
	{
		if (this.animation == null)
			return;

		const next = this.animation.get(name);
		if (next !== null && (this.playing !== next || restart))
		{
			this._playing = next;
			this._frame = 0;
			this.active = true;

			if (this._playing.frames.length > 0)
				this.texture = this._playing.frames[0];
		}
	}

	public has(name:string):boolean
	{
		return this.animation != null && this.animation.has(name);
	}

	public update():void
	{
		if (this.playing != null)
		{
			this._frame += this.playing.speed * this.rate * Engine.delta;
			if (this.frame >= this.playing.frames.length || this.frame < 0)
			{
				// loop this animation
				if (this.playing.loops)
				{
					while (this._frame >= this.playing.frames.length)
						this._frame -= this.playing.frames.length;
					while (this._frame < 0)
						this._frame += this.playing.frames.length;
				}
				// goto next animation
				else if (this.playing.goto != null && this.playing.goto.length > 0)
				{
					const next = this.playing.goto[Math.floor(Math.random() * this.playing.goto.length)];
					this.play(next, true);
				}
				// stop (non-looping animation)
				else
				{
					this.active = false;
					if (this.frame >= this.playing.frames.length)
						this._frame = this.playing.frames.length - 1;
					else
						this._frame = 0;
				}
			}

			if (this.playing != null)
				this.texture = this.playing.frames[this.frame];
		}
	}

	public render(camera:Camera):void
	{
		if (this.texture != null)
			super.render(camera);
	}

}
