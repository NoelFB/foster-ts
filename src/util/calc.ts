/**
 * Helper class for math related functions
 */
export class Calc
{
	/**
	 * Returns the Sign of the number (-1, 0, or 1)
	 */
	public static sign(n:number):number
	{
		return (n < 0 ? -1 : (n > 0 ? 1 : 0));
	}

	public static cmp(a:any, b:any):number
	{
		return a < b ? -1 : (a > b ? 1 : 0);
	}

	/**
	 * Clamps the value between a min and max value
	 */
	public static clamp(n:number, min:number, max:number):number
	{
		return Math.max(min, Math.min(max, n));
	}

	/**
	 * Approaches N towards the target value by the step, without going past it
	 */
	public static approach(n:number, target:number, step:number):number
	{
		return n > target ? Math.max(n - step, target) : Math.min(n + step, target);
	}

	/**
	 * Returns a random value within the range. If no Maximum is provided, it returns within the range -min to +min
	 */
	public static range(min:number, max?:number):number
	{
		if (max === undefined)
			return -min + Math.random() * min * 2;
		return min + Math.random() * (max - min);
	}

	/**
	 * Chooses a random value from the given list
	 */
	public static choose<T>(list:T[]):T
	{
		return list[Math.floor(Math.random() * list.length)];
	}
}