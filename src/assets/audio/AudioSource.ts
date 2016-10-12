class AudioSource
{

	public static maxInstances:number = 50;

	private path:string;
	private sounds:HTMLAudioElement[] = [];

	constructor(path:string, first?:HTMLAudioElement)
	{
		this.path = path;
		if (first)
			this.sounds.push(first);
	}

	/**
	 * Gets a new instance of the sound from cache or file
	 */
	public requestSound():HTMLAudioElement
	{
		if (this.sounds.length > 0)
		{
			let source = this.sounds[0];
			this.sounds.splice(0, 1);
			return source;
		}
		else if (this.sounds.length < AudioSource.maxInstances)
		{
			let source = new Audio();
			source.src = this.path;
			return source;
		}
		else
			return null;
	}

	/**
	 * Returns the sound instance so it can be used again
	 */
	public returnSound(sound:HTMLAudioElement):void
	{
		this.sounds.push(sound);
	}

	/**
	 * Not Implemented
	 */
	public dispose():void
	{

	}
}