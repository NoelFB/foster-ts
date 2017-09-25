/**
 * Default Ease methods for Tweening
 */
export class Ease
{
	public static linear(t:number)
	{
		return t;
	}

	public static quadIn(t:number)
	{
		return t * t;
	}

	public static quadOut(t:number)
	{
		return 1 - Ease.quadIn(1 - t);
	}

	public static quadInOut(t:number)
	{
		return (t <= 0.5) ? Ease.quadIn(t * 2) / 2 :Ease.quadOut(t * 2 - 1) / 2 + 0.5;
	}

	public static cubeIn(t:number)
	{
		return t * t * t;
	}

	public static cubeOut(t:number)
	{
		return 1 - Ease.cubeIn(1 - t);
	}

	public static cubeInOut(t:number)
	{
		return (t <= 0.5) ? Ease.cubeIn(t * 2) / 2 :Ease.cubeOut(t * 2 - 1) / 2 + 0.5;
	}

	public static backIn(t:number)
	{
		return t * t * (2.70158 * t - 1.70158);
	}

	public static backOut(t:number)
	{
		return 1 - Ease.backIn(1 - t);
	}

	public static backInOut(t:number)
	{
		return (t <= 0.5) ? Ease.backIn(t * 2) / 2 :Ease.backOut(t * 2 - 1) / 2 + 0.5;
	}

	public static expoIn(t:number)
	{
		return Math.pow(2, 10 * (t - 1));
	}

	public static expoOut(t:number)
	{
		return 1 - Ease.expoIn(t);
	}

	public static expoInOut(t:number)
	{
		return t < .5 ? Ease.expoIn(t * 2) / 2 :Ease.expoOut(t * 2) / 2;
	}

	public static sineIn(t:number)
	{
		return -Math.cos((Math.PI / 2) * t) + 1;
	}

	public static sineOut(t:number)
	{
		return Math.sin((Math.PI / 2) * t);
	}

	public static sineInOut(t:number)
	{
		return -Math.cos(Math.PI * t) / 2 + .5;
	}

	public static elasticInOut(t:number)
	{
		t /= 0.5;
		if (t === 2)
			return 1;

		const p = (0.3 * 1.5);
		const s = p / 4;

		if (t < 1)
			return -0.5 * (Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
		return Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
	}

	public static arc(t:number, ease:(n:number) => number):number
	{
		if (t < 0.5)
			return 1 - ease(1 - t * 2);
		return (1 - ease((t - 0.5) * 2));
	}
}
