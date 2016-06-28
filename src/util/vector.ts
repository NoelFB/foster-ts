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

	public copy(v:Vector):Vector
	{
		this.x = v.x;
		this.y = v.y;
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

	public transform(m:Matrix):Vector
	{
		let ax = this.x, ay = this.y;
		this.x = m.mat[0] * ax + m.mat[3] * ay + m.mat[6];
		this.y = m.mat[1] * ax + m.mat[4] * ay + m.mat[7];
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

	public normalize():Vector
	{
		let dist = this.length;
		this.x /= dist;
		this.y /= dist;
		return this;
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

	public static transform(a:Vector, m:Matrix):Vector
	{
		let result:Vector = new Vector();
		result.x = m.mat[0] * a.x + m.mat[3] * a.y + m.mat[6];
		result.y = m.mat[1] * a.x + m.mat[4] * a.y + m.mat[7];
		return result;
	}

	public static directions:Vector[] = 
	[
		new Vector(-1, 0),
		new Vector(0, -1),
		new Vector(1, 0),
		new Vector(0, 1)
	];

}