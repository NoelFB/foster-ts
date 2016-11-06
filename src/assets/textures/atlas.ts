
interface AtlasReader { (data:string, into: Atlas): void; }

/**
 * A single Texture which contains subtextures by name
 */
class Atlas
{
	/**
	 * Name of the Atlas
	 */
	public name:string;

	/**
	 * Reference to the atlas texture
	 */
	public texture:Texture;

	/**
	 * Raw Atlas Data, in whatever format the atlas was loaded in
	 */
	public data:string;

	/**
	 * The Atlas Data Reader (a method parses the raw data and creates the subtextures)
	 */
	public reader:AtlasReader;

	/**
	 * Dictionary of the Subtextures within this atlas
	 */
	public subtextures:{[path:string]:Texture} = {};

	constructor(name:string, texture:Texture, data:string, reader:AtlasReader)
	{
		this.name = name;
		this.texture = texture;
		this.reader = reader;
		this.data = data;
		this.reader(data, this);
	}

	/**
	 * Gets a specific subtexture from the atlas
	 * @param name 	the name/path of the subtexture
	 */
	public get(name:string):Texture
	{
		return this.subtextures[name];
	}

	/**
	 * Checks if a subtexture exists
	 * @param name 	the name/path of the subtexture
	 */
	public has(name:string):boolean
	{
		return this.subtextures[name] != undefined;
	}

	/**
	 * Gets a list of textures
	 */
	public list(prefix:string, names:string[]):Texture[]
	{
		let listed:Texture[] = [];
		for (let i = 0; i < names.length; i ++)
			listed.push(this.get(prefix + names[i]));
		return listed;
	}

	/**
	 * Finds all subtextures with the given prefix
	 */
	public find(prefix:string):Texture[]
	{
		// find all textures
		let found:any[] = [];
		for (var key in this.subtextures)
		{
			if (key.indexOf(prefix) == 0)
				found.push({ name: key, tex: this.subtextures[key] });
		}

		// sort textures by name
		found.sort((a, b) =>
		{
			return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
		});

		// get sorted list
		let listed:Texture[] = [];
		for (let i = 0; i < found.length; i ++)
			listed.push(found[i]);
		return listed;
	}
}


class AtlasReaders
{
	/**
	 * Parses Aseprite data from the atlas
	 */
	public static Aseprite(data:string, into:Atlas):void
	{
		let json = JSON.parse(data);
		let frames = json["frames"];
		for (var path in frames)
		{
			var name = path.replace(".ase", "").replace(".png", "");
			var obj = frames[path];
			var bounds = obj.frame;
			
			if (obj.trimmed)
			{
				var source = obj["spriteSourceSize"];
				var size = obj["sourceSize"];
				into.subtextures[name] = new Texture(into.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h), new Rectangle(-source.x, -source.y, size.w, size.h));
			}
			else
			{
				into.subtextures[name] = new Texture(into.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h));
			}
		}
	}
}