import {Sound} from "./../";

export class AudioGroup
{

	private static volumes:{[group:string]:number} = {};
	private static mutes:{[group:string]:boolean} = {};

	public static volume(group:string, value?:number):number
	{
		if (value !== undefined && AudioGroup.volumes[group] !== value)
		{
			AudioGroup.volumes[group] = value;
			for (const sound of Sound.active)
				if (sound.ingroup(group))
					sound.volume = sound.volume;
		}
		if (AudioGroup.volumes[group] !== undefined)
			return AudioGroup.volumes[group];
		return 1;
	}

	public static muted(group:string, value?:boolean):boolean
	{
		if (value !== undefined && AudioGroup.mutes[group] !== value)
		{
			AudioGroup.mutes[group] = value;
			for (const sound of Sound.active)
				if (sound.ingroup(group))
					sound.muted = sound.muted;
		}
		if (AudioGroup.mutes[group] !== undefined)
			return AudioGroup.mutes[group];
		return false;
	}
}
