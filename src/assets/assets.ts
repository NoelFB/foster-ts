import {Atlas} from "./textures/atlas";
import {Texture} from "./textures/texture";
import {AudioSource} from "./audio/audioSource";

/**
 * A static reference to all the Assets currently loaded in the game
 */
export class Assets
{
	public static textures:{[path:string]:Texture; } = {};
	public static json:{[path:string]:object; } = {};
	public static xml:{[path:string]:object; } = {};
	public static text:{[path:string]:string; } = {};
	public static sounds:{[path:string]:AudioSource} = {};
	public static atlases:{[path:string]:Atlas} = {};

	/**
	 * Unloads all the assets in the entire game
	 */
	public static unload():void
	{
		// most of these can just lose reference
		Assets.json = {};
		Assets.xml = {};
		Assets.text = {};
		Assets.atlases = {};

		// textures actually need to be unloaded
		for (const path in Assets.textures)
			Assets.textures[path].dispose();
		Assets.textures = {};

		for (const path in Assets.sounds)
			Assets.sounds[path].dispose();
		Assets.sounds = {};
	}

}
