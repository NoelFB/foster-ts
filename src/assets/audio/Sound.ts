import {Engine} from "../../engine";
import {Calc} from "../../util";
import {Assets} from "../assets";
import {AudioGroup} from "./AudioGroup";
import {AudioSource} from "./AudioSource";

export class Sound
{
	public static active:Sound[] = [];

	private source:AudioSource;
	private sound:HTMLAudioElement = null;
	private endEvent:()=>void;
	private loadedEvent:()=>void;
	private started:boolean = false;
	private groups:string[] = [];

	private fadeFrom:number;
	private fadeTo:number;
	private fadePercent:number = 1;
	private fadeDuration:number = 1;
	private fadeEase:(n:number)=>number;

	/**
	 * Gets if the sound is currently playing
	 */
	public get playing():boolean { return this.started && !this._paused; }

	/**
	 * Gets or sets whether the sound is looping
	 */
	public get loop():boolean { return this._loop; }
	public set loop(v:boolean)
	{
		this._loop = v;
		if (this.started)
			this.sound.loop = this._loop;
	}
	private _loop:boolean = false;

	/**
	 * Gets if the sound is paused
	 */
	public get paused():boolean { return this._paused; }
	private _paused:boolean = false;

	/**
	 * Gets or sets whether the current sound is muted
	 */
	public get muted():boolean { return this._muted; }
	public set muted(m:boolean)
	{
		this._muted = m;
		this.internalUpdateMuted();
	}
	private _muted:boolean = false;

	/**
	 * Gets or sets the volume of this sound
	 */
	public get volume():number { return this._volume; }
	public set volume(n:number)
	{
		this._volume = n;
		this.internalUpdateVolume();
	}
	private _volume:number = 1;

	/**
	 * Creates a new sound of the given handle
	 */
	constructor(handle:string, groups?:string[])
	{
		this.source = Assets.sounds[handle];
		if (groups && groups.length > 0)
			for (const group of groups)
				this.group(group);
	}

	/**
	 * Plays the sound
	 */
	public play(loop?:boolean):Sound
	{
		// should this sound loop?
		this.loop = loop;

		// reset current sound if we're playing something already
		if (this.sound != null && this.started)
		{
			this.sound.currentTime = 0;
			if (this._paused)
				this.resume();
		}
		// request a new sound instance & play it (or wait until it's loaded)
		else
		{
			this.sound = this.source.requestSound();
			if (this.sound != null)
			{
				if (this.sound.readyState < 3)
				{
					const self = this;
					self.loadedEvent = () =>
					{
						if (self.sound != null)
							self.internalPlay();
						self.sound.removeEventListener("loadeddata", self.loadedEvent);
						self.loadedEvent = null;
					};
					this.sound.addEventListener("loadeddata", self.loadedEvent);
				}
				else
					this.internalPlay();
			}
		}

		return this;
	}

	/**
	 * Resumes if the sound was paused
	 */
	public resume():Sound
	{
		if (this.started && this._paused)
			this.sound.play();
		this._paused = false;
		return this;
	}

	/**
	 * Pauses a sound
	 */
	public pause():Sound
	{
		if (this.started && !this._paused)
			this.sound.pause();
		this._paused = true;
		return this;
	}

	/**
	 * Completely stops a sound
	 */
	public stop():Sound
	{
		if (this.sound != null)
		{
			this.source.returnSound(this.sound);

			if (this.started)
			{
				this.sound.pause();
				this.sound.currentTime = 0;
				this.sound.volume = 1;
				this.sound.muted = false;
				this.sound.removeEventListener("ended", this.endEvent);
				if (this.loadedEvent != null)
					this.sound.removeEventListener("loadeddata", this.loadedEvent);
			}

			this.sound = null;
			this.started = false;
			this._paused = false;
			this.fadePercent = 1;

			const i = Sound.active.indexOf(this);
			if (i >= 0)
				Sound.active.splice(i, 1);
		}
		return this;
	}

	public group(group:string):Sound
	{
		this.groups.push(group);
		this.internalUpdateVolume();
		this.internalUpdateMuted();
		return this;
	}

	public ungroup(group:string):Sound
	{
		const index = this.groups.indexOf(group);
		if (index >= 0)
		{
			this.groups.splice(index, 1);
			this.internalUpdateVolume();
			this.internalUpdateMuted();
		}
		return this;
	}

	public ungroupAll():Sound
	{
		this.groups = [];
		this.internalUpdateVolume();
		this.internalUpdateMuted();
		return this;
	}

	public ingroup(group:string):boolean
	{
		return this.groups.indexOf(group) >= 0;
	}

	private internalPlay()
	{
		this.started = true;
		Sound.active.push(this);

		const self = this;
		this.endEvent = () => { self.stop(); };

		this.sound.addEventListener("ended", this.endEvent);
		this.sound.loop = this.loop;
		this.internalUpdateVolume();
		this.internalUpdateMuted();

		if (!this._paused)
			this.sound.play();
	}

	private internalUpdateVolume()
	{
		if  (this.started)
		{
			let groupVolume = 1;
			for  (const group of this.groups)
				groupVolume *= AudioGroup.volume(group);
			this.sound.volume = this._volume * groupVolume * Engine.volume;
		}
	}

	private internalUpdateMuted()
	{
		if (this.started)
		{
			let groupMuted = false;
			for  (let i = 0; i < this.groups.length && !groupMuted; i ++)
				groupMuted = groupMuted || AudioGroup.muted(this.groups[i]);
			this.sound.muted = Engine.muted || this._muted || groupMuted;
		}
	}

	public update():void
	{
		if (this.fadePercent < 1)
		{
			this.fadePercent = Calc.approach(this.fadePercent, 1, Engine.delta / this.fadeDuration);
			this.volume = this.fadeFrom + (this.fadeTo - this.fadeFrom) * this.fadeEase(this.fadePercent);
		}
	}

	public fade(volume:number, duration:number, ease?:(n:number)=>number):Sound
	{
		this.fadeFrom = this.volume;
		this.fadeTo = volume;
		this.fadeDuration = Math.max(0.001, duration);
		this.fadeEase = (ease != undefined ? ease : (n) => { return n; });
		this.fadePercent = 0;
		return this;
	}
}