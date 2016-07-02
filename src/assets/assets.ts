class Assets
{
	public static textures:{[path: string]:Texture;} = {};
	public static json:{[path:string]:Object;} = {};
	public static xml:{[path:string]:Object;} = {};
	public static text:{[path:string]:string;} = {};
	public static sounds:{[path:string]:HTMLAudioElement} = {};
	public static atlases:{[path:string]:Atlas} = {};
}