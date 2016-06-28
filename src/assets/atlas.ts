
enum AtlasType
{
	ASEPRITE = 0
}

class Atlas
{

	public name:string;
	public texture:Texture;
	public json:Object;
	public type:AtlasType;

	public subtextures:{[path:string]:Texture} = {};

	constructor(name:string, texture:Texture, json:Object, type:AtlasType)
	{
		this.name = name;
		this.texture = texture;
		this.json = json;
		this.type = type;

		if (type == AtlasType.ASEPRITE)
			this.loadAsepriteAtlas();
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

	private loadAsepriteAtlas()
	{
		let frames = this.json["frames"];
		for (var path in frames)
		{
			var name = path.replace(".ase", "");
			var obj = frames[path];
			var bounds = obj.frame;
			
			if (obj.trimmed)
			{
				var source = obj["spriteSourceSize"];
				var size = obj["sourceSize"];
				this.subtextures[name] = new Texture(this.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h), new Rectangle(-source.x, -source.y, size.w, size.h));
			}
			else
			{
				this.subtextures[name] = new Texture(this.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h));
			}
		}
	}
}