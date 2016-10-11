/// <reference path="./animationSet.ts"/>

/**
 * Animation Bank holds all the Animations in the game
 */
class AnimationBank
{
	/**
	 * Reference to all the Animations
	 */
	public static bank:{[name:string]: AnimationSet} = {};
	
	/**
	 * Creates a new Animation Set of the given Name
	 */
	public static create(name:string):AnimationSet
	{
		var animSet = new AnimationSet(name);
		AnimationBank.bank[name] = animSet;
		return animSet;
	}
	
	/**
	 * Gets an Animation of the given name
	 */
	public static get(name:string):AnimationSet
	{
		return AnimationBank.bank[name];
	}
	
	/**
	 * Checks if an animation with the given name exists
	 */
	public static has(name:string):boolean
	{
		return AnimationBank.bank[name] != undefined;
	}
}