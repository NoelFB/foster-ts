import {Matrix} from "./matrix";
import {Calc} from "./calc";

export class Vector
{
	public x:number = 0;
	public y:number = 0;

	constructor(x?:number, y?:number)
	{
		if (x !== undefined)
			this.x = x;
		if (y !== undefined)
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

	public max(v:Vector):Vector
	{
		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);
		return this;
	}

	public min(v:Vector):Vector
	{
		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);
		return this;
	}

	public mult(s:number):Vector;
	public mult(s:Vector):Vector;
	public mult(s: Vector|number):Vector
	{
		if (typeof s === "number")
		{
			this.x *= s;
			this.y *= s;
		}
		else
		{
			this.x *= s.x;
			this.y *= s.y;
		}

		return this;
	}

	public div(v:Vector):Vector
	{
		this.x /= v.x;
		this.y /= v.y;
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
		const ox = this.x;
		const oy = this.y;
		this.x = ox * cos - oy * sin;
		this.y = ox * sin + oy * cos;
		return this;
	}

	public approach(v:Vector, step:number)
	{
		this.x = Calc.approach(this.x, v.x, step);
		this.y = Calc.approach(this.y, v.y, step);
	}

	public transform(m:Matrix):Vector
	{
		const ax = this.x;
		const ay = this.y;
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

	public get angle():number
	{
		return Math.atan2(this.y, this.x);
	}

	public get normal():Vector
	{
		const dist = this.length;
		return new Vector(this.x / dist, this.y / dist);
	}

	public normalize(length:number = 1):Vector
	{
		const dist = this.length;
		this.x = (this.x / dist) * length;
		this.y = (this.y / dist) * length;
		return this;
	}

	private static _dist_temp = new Vector();
	public static distance(v1:Vector, v2:Vector)
	{
		return Vector._dist_temp.copy(v1).sub(v2).length;
	}

	public static directions:Vector[] =
	[
		new Vector(-1, 0),
		new Vector(0, -1),
		new Vector(1, 0),
		new Vector(0, 1),
	];

	// temporary vectors used wherever
	public static temp0:Vector = new Vector();
	public static temp1:Vector = new Vector();
	public static temp2:Vector = new Vector();
	public static temp3:Vector = new Vector();
	public static temp4:Vector = new Vector();
	public static temp5:Vector = new Vector();

	public static up:Vector = new Vector(0, -1);
	public static down:Vector = new Vector(0, 1);
	public static left:Vector = new Vector(-1, 0);
	public static right:Vector = new Vector(1, 0);

	private static _zero:Vector = new Vector();
	public static get zero():Vector { return Vector._zero.set(0, 0); }

}