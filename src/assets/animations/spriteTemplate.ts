import {Rectangle} from "../../util/rectangle";
import {Vector} from "../../util/vector";
import {Texture} from "../textures/texture";
import {SpriteAnimationTemplate} from "./spriteAnimationTemplate";

/**
 * Sprite Template holds a list of Animation Templates, referenced by name
 */
export class SpriteTemplate
{
	toString() { return `<SpriteTemplate '${this.name}'>`; }

	/**
	 * The Sprite Template name
	 */
	public name:string;

	/**
	 * A list of all the animation template, by their name
	 */
	public animations:{[name:string]: SpriteAnimationTemplate} = {};

	/**
	 * First animation template
	 */
	public first:SpriteAnimationTemplate;

	constructor(name:string)
	{
		this.name = name;
	}
	
	/**
	 * Adds a new Animation Template to this set
	 */
	public add(name:string, speed:number, frames:Texture[], loops:boolean, position?:Vector, origin?:Vector):SpriteTemplate
	{
		const anim = new SpriteAnimationTemplate(name, speed, frames, loops, position, origin);

		this.animations[name] = anim;
		if (this.first == null)
			this.first = anim;

		return this;
	}

	/**
	 * Adds a new frame-based Animation Template to this set
	 */
	public addFrameAnimation(name:string, speed:number, tex:Texture, frameWidth:number, frameHeight:number, frames:number[], loops:boolean, position?:Vector, origin?:Vector):SpriteTemplate
	{
		const columns = Math.floor(tex.width / frameWidth);
		const texFrames:Texture[] = [];
		for (let i = 0; i < frames.length; i ++)
		{
			let index = frames[i];
			const tx = (index % columns) * frameWidth;
			const ty = Math.floor(index / columns) * frameWidth;
			texFrames.push(tex.getSubtexture(new Rectangle(tx, ty, frameWidth, frameHeight)));
		}
		const anim = new SpriteAnimationTemplate(name, speed, texFrames, loops, position, origin);

		this.animations[name] = anim;
		if (this.first == null)
			this.first = anim;

		return this;
	}

	/**
	 * Gets an animation template by its name
	 */
	public get(name:string):SpriteAnimationTemplate
	{
		return this.animations[name];
	}

	/**
	 * Checks if an animation template exists by the given name
	 */
	public has(name:string):boolean
	{
		return this.animations[name] !== undefined;
	}
}
