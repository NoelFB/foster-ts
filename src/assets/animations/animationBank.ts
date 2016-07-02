/// <reference path="./animationSet.ts"/>
class AnimationBank
{
	public static bank:{[name:string]: AnimationSet} = {};
	
	public static create(name:string):AnimationSet
	{
		var animSet = new AnimationSet(name);
		AnimationBank.bank[name] = animSet;
		return animSet;
	}
	
	public static get(name:string):AnimationSet
	{
		return AnimationBank.bank[name];
	}
	
	public static has(name:string):boolean
	{
		return AnimationBank.bank[name] != undefined;
	}
}