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

	public static range(min:number, max?:number):number
	{
		if (max == undefined)
			return -min + Math.random() * min * 2;
		return min + Math.random() * (max - min);
	}

	public static choose<T>(list:T[]):T
	{
		return list[Math.floor(Math.random() * list.length)];
	}
}