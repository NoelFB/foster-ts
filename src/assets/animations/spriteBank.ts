import {SpriteTemplate} from "./spriteTemplate";

/**
 * Sprite Bank holds all the Sprite templates in the game
 */
export class SpriteBank
{
	/**
	 * Reference to all the Animations
	 */
	public static bank:{[name:string]:SpriteTemplate} = {};

	/**
	 * Creates a new Animation Set of the given Name
	 */
	public static create(name:string):SpriteTemplate
	{
		const animSet = new SpriteTemplate(name);
		SpriteBank.bank[name] = animSet;
		return animSet;
	}

	/**
	 * Gets an Animation of the given name
	 */
	public static get(name:string):SpriteTemplate
	{
		return SpriteBank.bank[name];
	}

	/**
	 * Checks if an animation with the given name exists
	 */
	public static has(name:string):boolean
	{
		return SpriteBank.bank[name] !== undefined;
	}
}
