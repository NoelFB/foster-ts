
interface AtlasLoader { (atlas: Atlas): void; }

class Atlas
{

	public name:string;
	public texture:Texture;
	public data:Object;
	public loader:AtlasLoader;

	public subtextures:{[path:string]:Texture} = {};

	constructor(name:string, texture:Texture, data:Object, loader:AtlasLoader)
	{
		this.name = name;
		this.texture = texture;
		this.data = data;
		this.loader = loader;
		this.loader(this);
	}

	public get(name:string):Texture
	{
		return this.subtextures[name];
	}

	public has(name:string):boolean
	{
		return this.subtextures[name] != undefined;
	}

	public list(prefix:string, names:string[]):Texture[]
	{
		let listed:Texture[] = [];
		for (let i = 0; i < names.length; i ++)
			listed.push(this.get(prefix + names[i]));
		return listed;
	}
}


class AtlasLoaders
{
	public static Aseprite(atlas:Atlas):void
	{
		let frames = atlas.data["frames"];
		for (var path in frames)
		{
			var name = path.replace(".ase", "");
			var obj = frames[path];
			var bounds = obj.frame;
			
			if (obj.trimmed)
			{
				var source = obj["spriteSourceSize"];
				var size = obj["sourceSize"];
				atlas.subtextures[name] = new Texture(atlas.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h), new Rectangle(-source.x, -source.y, size.w, size.h));
			}
			else
			{
				atlas.subtextures[name] = new Texture(atlas.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h));
			}
		}
	}
}