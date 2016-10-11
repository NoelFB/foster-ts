class Sound
{

	private source:AudioSource;
	private sound:HTMLAudioElement = null;
	private endEvent:()=>void;
	private loadedEvent:()=>void;
	private started:boolean = false;
	private num:number = 0;

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
		if (this.sound != null && this.started)
			this.sound.loop = this._loop;
	}
	private _loop:boolean = false;

	/**
	 * Gets if the sound is paused
	 */
	public get paused():boolean { return this._paused; }
	private _paused:boolean = false;

	/**
	 * Gets or sets the current Group this sound is a part of
	 */
	public get group():string { return this._group; }
	public set group(val:string)
	{
		if (this._group.length > 0)
			AudioGroup.ungroupSound(this._group, this);
		this._group = val;
		if (this.started)
			AudioGroup.groupSound(this._group, this);
	}
	private _group:string = "";

	/**
	 * Gets or sets whether the current sound is muted
	 */
	public get muted():boolean { return this._muted; }
	public set muted(m:boolean)
	{
		this._muted = m;
		if (this.started)
			this.sound.muted = this._muted || AudioGroup.muted(this._group);
	}
	private _muted:boolean = false;

	/**
	 * Gets or sets the volume of this sound
	 */
	public get volume():number { return this._volume; }
	public set volume(n:number)
	{
		this._volume = n;
		if (this.started)
			this.sound.volume = this._volume * AudioGroup.volume(this._group);
	}
	private _volume:number = 1;

	/**
	 * Creates a new sound of the given handle
	 */
	constructor(handle:string, group?:string)
	{
		this.source = Assets.sounds[handle];
		if (group)
			this.group = group;
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
					var self = this;
					self.loadedEvent = () =>
					{
						if (self.sound != null)
							self.internalPlay();
						self.sound.removeEventListener("loadeddata", self.loadedEvent);
						self.loadedEvent = null;
					}
					this.sound.addEventListener("loadeddata", self.loadedEvent);
				}
				else
					this.internalPlay();
			}
		}
		
		return this;
	}

	private internalPlay()
	{
		AudioGroup.groupSound(this._group, this);
		this.started = true;
		
		var self = this;
		this.endEvent = () => { self.stop(); };

		this.sound.addEventListener("ended", this.endEvent);
		this.sound.loop = this.loop;
		this.sound.volume = this._volume * AudioGroup.volume(this._group);
		this.sound.muted = this._muted || AudioGroup.muted(this._group);
		
		if (!this._paused)
			this.sound.play();
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

			if (this._group.length > 0)
				AudioGroup.ungroupSound(this._group, this);
		}
		return this;
	}
}