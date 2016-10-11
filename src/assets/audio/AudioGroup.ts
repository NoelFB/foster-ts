class AudioGroup
{

	private static active:{[group: string]:Sound[];} = {};
	private static volumes:{[group:string]:number} = {};
	private static mutes:{[group:string]:boolean} = {};

	public static volume(group:string, value?:number):number
	{
		if (value != undefined)
		{
			AudioGroup.volumes[group] = value;
			if (AudioGroup.active[group] != undefined)
				for (let i = 0; i < AudioGroup.active[group].length; i ++)
					AudioGroup.active[group][i].volume = AudioGroup.active[group][i].volume;
		}
		if (AudioGroup.volumes[group] != undefined)
			return AudioGroup.volumes[group];
		return 1;
	}

	public static muted(group:string, value?:boolean):boolean
	{
		if (value != undefined)
		{
			AudioGroup.mutes[group] = value;
			if (AudioGroup.active[group] != undefined)
				for (let i = 0; i < AudioGroup.active[group].length; i ++)
					AudioGroup.active[group][i].muted = AudioGroup.active[group][i].muted;
		}
		if (AudioGroup.mutes[group] != undefined)
			return AudioGroup.mutes[group];
		return false;
	}

	public static groupSound(group:string, sound:Sound):void
	{
		if (AudioGroup.active[group] == undefined)
			AudioGroup.active[group] = [];
		AudioGroup.active[group].push(sound);
	}

	public static ungroupSound(group:string, sound:Sound):void
	{
		if (AudioGroup.active[group] != undefined)
		{
			let index = AudioGroup.active[group].indexOf(sound);
			if (index >= 0)
				AudioGroup.active[group].splice(index, 1);
		}
	}
}