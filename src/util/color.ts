class Color
{
	private color:number[] = [0, 0, 0, 1];
	
	public get r():number { return this.color[0]; }
	public set r(v:number) { this.color[0] = Math.min(1, Math.max(0, v)); }
	public get g():number { return this.color[1]; }
	public set g(v:number) { this.color[1] = Math.min(1, Math.max(0, v)); }
	public get b():number { return this.color[2]; }
	public set b(v:number) { this.color[2] = Math.min(1, Math.max(0, v)); }
	public get a():number { return this.color[3]; }
	public set a(v:number) { this.color[3] = Math.min(1, Math.max(0, v)); }
	public get rgba():number[] { return this.color; }
	
	constructor(r?:number, g?:number, b?:number, a?:number)
	{
		this.r = r || 0;
		this.g = g || 0;
		this.b = b || 0;
		this.a = a || 1;
	}

	public set(r:number, g:number, b:number, a:number):Color
	{
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		return this;
	}
	
	public mult(alpha:number, out?:Color):Color
	{
		if (out == undefined)
			out = new Color();
		return out.set(this.r, this.g, this.b, this.a * alpha);
	}

	public static lerp(a:Color, b:Color, p:number, out?:Color):Color
	{	
		if (out == undefined)
			out = new Color();
		out.r  = a.r + (b.r - a.r) * p;
		out.g  = a.g + (b.g - a.g) * p;
		out.b  = a.b + (b.b - a.b) * p;
		out.a  = a.a + (b.a - a.a) * p;
		return out;
	}
	
	public static white:Color = new Color(1, 1, 1, 1);
	public static black:Color = new Color(0, 0, 0, 1);
	public static red:Color = new Color(1, 0, 0, 1);
	public static green:Color = new Color(0, 1, 0, 1);
	public static blue:Color = new Color(0, 0, 1, 1);
}