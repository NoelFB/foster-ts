class Calc
{
	public static sign(n:number):number
	{
		return (n < 0 ? -1 : (n > 0 ? 1 : 0));
	}

	public static clamp(n:number, min:number, max:number):number
	{
		return Math.max(min, Math.min(max, n));
	}

	public static approach(n:number, target:number, step:number):number
	{
		return n > target ? Math.max(n - step, target) : Math.min(n + step, target);
	}
}