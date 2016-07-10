class Assets
{
	public static textures:{[path: string]:Texture;} = {};
	public static json:{[path:string]:Object;} = {};
	public static xml:{[path:string]:Object;} = {};
	public static text:{[path:string]:string;} = {};
	public static sounds:{[path:string]:HTMLAudioElement} = {};
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

		// textures actually need to be unloaded properly
		for (var path in Assets.textures)
			Assets.textures[path].texture.unload();
		Assets.textures = {};

		// TODO: implement sound unloading
		// ...
		Assets.sounds = {};
	}

}