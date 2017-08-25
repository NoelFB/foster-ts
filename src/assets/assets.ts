import {AudioSource} from "./audio/AudioSource";
import {Atlas} from "./textures/atlas";
import {Texture} from "./textures/texture";

/**
 * A static reference to all the Assets currently loaded in the game
 */
export class Assets
{
	public static textures:{[path: string]:Texture;} = {};
	public static json:{[path:string]:object;} = {};
	public static xml:{[path:string]:Document;} = {};
	public static text:{[path:string]:string;} = {};
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
		for (const texturePath in Assets.textures)
			Assets.textures[texturePath].dispose();
		Assets.textures = {};

		for (const texturePath in Assets.sounds)
			Assets.sounds[texturePath].dispose();
		Assets.sounds = {};
	}

}