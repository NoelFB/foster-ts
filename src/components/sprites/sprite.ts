import {SpriteAnimationTemplate} from "../../assets/animations/spriteAnimationTemplate";
import {SpriteBank} from "../../assets/animations/spriteBank";
import {SpriteTemplate} from "../../assets/animations/spriteTemplate";
import {Engine} from "../../engine";
import {Calc} from "../../util/calc";
import {Camera} from "../../util/camera";
import {Graphic} from "./graphic";

export const enum Origin
{
	center = "center",
	topLeft = "topLeft",
}

interface SpriteOpts
{
	animation: string;
	visible?: boolean;
	origin?: Origin;
	scale?: {x:number, y:number};
	play?: string;
	flipX?: boolean;
	flipY?: boolean;
	x?: number;
	y?: number;
	rate?: number;
	alpha?: number;
	randomStartFrame?: boolean
}

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

	constructor({animation, origin, scale, play, flipX, flipY, x, y, rate, alpha, randomStartFrame, visible}:SpriteOpts)
	{
		super(null);

		if (rate !== undefined) this.rate = rate;
		if (x !== undefined) this.x = x;
		if (y !== undefined) this.y = y;
		if (alpha !== undefined) this.alpha = alpha;
		if (visible !== undefined) this.visible = visible;

		if (scale && scale.x !== undefined)
			this.scale.set(scale.x, scale.y);

		if (flipX !== undefined)
			this.flipX = flipX;
		if (flipY !== undefined)
			this.flipY = flipY;

		Engine.assert(SpriteBank.has(animation), "Missing animation '" + animation + "'!");
		this._animation = SpriteBank.get(animation);
		this.texture = this._animation.first.frames[0];
		if (origin === Origin.center)
			this.justify(.5, .5);

		this.randomStartFrame = randomStartFrame;

		if (play)
			this.play(play, false, {randomFrame: randomStartFrame});
	}

	randomStartFrame = false;

	public play(name:string, restart?:boolean, opts?:{randomFrame?: boolean}):void
	{
		if (this.animation == null)
			return;

		const next = this.animation.get(name);
		if (next == null)
			console.warn(`No animation track '${name}' in ${this._animation.toString()}`);

		if (next != null && (this.playing !== next || restart))
		{
			this._playing = next;
			this._frame = opts && opts.randomFrame ? Math.floor(Calc.range(0, this._playing.frames.length)) : 0;
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
