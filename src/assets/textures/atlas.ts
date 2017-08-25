import {Engine} from "../../engine";
import {Rectangle} from "../../util/rectangle";
import {Texture} from "./texture";

export type AtlasReader = (data:string, into: Atlas) => void;

/**
 * A single Texture which contains subtextures by name
 */
export class Atlas
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

	public metadata:any = {};

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
		const tex = this.subtextures[name];
		if (!tex)
			throw new Error("no texture " + name);
		return tex;
	}

	/**
	 * Checks if a subtexture exists
	 * @param name 	the name/path of the subtexture
	 */
	public has(name:string):boolean
	{
		return this.subtextures[name] !== undefined;
	}

	/**
	 * Gets a list of textures
	 */
	public list(prefix:string, names:string[]):Texture[]
	{
		const listed:Texture[] = [];
		for (const name of names)
			listed.push(this.get(prefix + name));
		return listed;
	}

	/**
	 * Finds all subtextures with the given prefix
	 */
	public find(prefix:string, verbose=false):Texture[]
	{
		// find all textures
		const found:any[] = [];
		for (const key in this.subtextures)
		{
			if (key.indexOf(prefix) === 0)
				found.push({ name: key, tex: this.subtextures[key] });
		}

		// sort textures by name
		found.sort((a, b) =>
		{
			return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
		});

		// get sorted list
		const listed:Texture[] = [];
		for (const {tex} of found)
			listed.push(tex);
		if (verbose) console.log(found.map(a => a.name));
		return listed;
	}
}

export class AtlasReaders
{
	/**
	 * Parses Aseprite data from the atlas
	 */
	public static Aseprite(data:string, into:Atlas):void
	{
		const json = JSON.parse(data);
		const frames = json["frames"];
		for (const [path, obj] of Object.entries(frames))
		{
			const name = path.replace(".ase", "").replace(".png", "");
			const bounds = obj.frame;
			let tex:Texture;

			if (obj.trimmed)
			{
				const source = obj["spriteSourceSize"];
				const size = obj["sourceSize"];
				tex = new Texture(into.texture.texture,
					new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h),
					new Rectangle(-source.x, -source.y, size.w, size.h));
			}
			else
			{
				tex = new Texture(into.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h));
			}

			if (obj.duration !== undefined)
				tex.metadata["duration"] = parseInt(obj.duration, 10);

			into.subtextures[name] = tex;
		}
		into.metadata = json["meta"];
	}
}