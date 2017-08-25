export class Color
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

	toString() { return `Color(${this.r}, ${this.g}, ${this.b}, ${this.a})`; }

	static fromHex(hex:string, alpha=1)
	{
		hex = hex.replace('#', '');
		const r = parseInt(hex.length === 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
		const g = parseInt(hex.length === 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
		const b = parseInt(hex.length === 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
		return new Color(r/255, g/255, b/255, alpha);
	}

	public set(r:number, g:number, b:number, a:number):Color
	{
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		return this;
	}

	public copy(color:Color):Color
	{
		this.r = color.r;
		this.g = color.g;
		this.b = color.b;
		this.a = color.a;
		return this;
	}

	public lerp(a:Color, b:Color, p:number):Color
	{
		this.r  = a.r + (b.r - a.r) * p;
		this.g  = a.g + (b.g - a.g) * p;
		this.b  = a.b + (b.b - a.b) * p;
		this.a  = a.a + (b.a - a.a) * p;
		return this;
	}

	public clone():Color
	{
		return new Color().copy(this);
	}

	public mult(alpha:number):Color
	{
		return this.set(this.r, this.g, this.b, this.a * alpha);
	}

	public static white:Color = new Color(1, 1, 1, 1);
	public static black:Color = new Color(0, 0, 0, 1);
	public static red:Color = new Color(1, 0, 0, 1);
	public static green:Color = new Color(0, 1, 0, 1);
	public static blue:Color = new Color(0, 0, 1, 1);
	public static temp:Color = new Color();
}
