class Vector
{
	public x:number = 0;
	public y:number = 0;
	
	constructor(x?:number, y?:number)
	{
		if (x != undefined)
			this.x = x;
		if (y != undefined)
			this.y  = y;
	}
	
	public set(x:number, y:number):Vector
	{
		this.x = x;
		this.y = y;
		return this;
	}
	
	public add(v:Vector):Vector
	{
		this.x += v.x;
		this.y += v.y;
		return this;
	}
	
	public sub(v:Vector):Vector
	{
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}
	
	public mult(v:Vector):Vector
	{
		this.x *= v.x;
		this.y *= v.y;
		return this;
	}
	
	public scale(s:number):Vector
	{
		this.x *= s;
		this.y *= s;
		return this;
	}
	
	public rotate(sin:number, cos:number):Vector
	{
		let ox = this.x, oy = this.y;
		this.x = ox * cos - oy * sin;
		this.y = ox * sin + oy * cos;
		return this;
	}
	
	public clone():Vector
	{
		return new Vector(this.x, this.y);
	}
	
	public get length():number
	{
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	}
	
	public get normal():Vector
	{
		let dist = this.length;
		return new Vector(this.x / dist, this.y / dist);
	}
	
	public static add(a:Vector, b:Vector):Vector
	{
		return new Vector(a.x + b.x, a.y + b.y);
	}
	
	public static sub(a:Vector, b:Vector):Vector
	{
		return new Vector(a.x - b.x, a.y - b.y);
	}
	
	public static mult(a:Vector, b:Vector):Vector
	{
		return new Vector(a.x * b.x, a.y * b.y);
	}
}