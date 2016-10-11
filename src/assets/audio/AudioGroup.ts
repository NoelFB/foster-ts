class AudioGroup
{

	private static volumes:{[group:string]:number} = {};
	private static mutes:{[group:string]:boolean} = {};

	public static volume(group:string, value?:number):number
	{
		if (value != undefined && AudioGroup.volumes[group] != value)
		{
			AudioGroup.volumes[group] = value;
			for (let i = 0; i < Sound.active.length; i ++)
				if  (Sound.active[i].ingroup(group))
					Sound.active[i].volume = Sound.active[i].volume;
		}
		if (AudioGroup.volumes[group] != undefined)
			return AudioGroup.volumes[group];
		return 1;
	}

	public static muted(group:string, value?:boolean):boolean
	{
		if (value != undefined && AudioGroup.mutes[group] != value)
		{
			AudioGroup.mutes[group] = value;
			for (let i = 0; i < Sound.active.length; i ++)
				if  (Sound.active[i].ingroup(group))
					Sound.active[i].muted = Sound.active[i].muted;
		}
		if (AudioGroup.mutes[group] != undefined)
			return AudioGroup.mutes[group];
		return false;
	}
}