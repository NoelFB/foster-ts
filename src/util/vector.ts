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

	public mult(v:Vector):Vector
	{
		this.x *= v.x;
		this.y *= v.y;
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
		const ox = this.x, oy = this.y;
		this.x = ox * cos - oy * sin;
		this.y = ox * sin + oy * cos;
		return this;
	}

	public transform(m:Matrix):Vector
	{
		const ax = this.x, ay = this.y;
		this.x = m.mat[0] * ax + m.mat[3] * ay + m.mat[6];
		this.y = m.mat[1] * ax + m.mat[4] * ay + m.mat[7];
		return this;
	}

	public approach(target:Vector, step:number)
	{
		const normal = Vector.temp0.copy(target).sub(this).normalize();
		this.x = Calc.approach(this.x, target.x, normal.x * step);
		this.y = Calc.approach(this.y, target.y, normal.y * step);
	}

	public approachXY(x:number, y:number, step:number)
	{
		const normal = Vector.temp0.set(x, y).sub(this).normalize();
		this.x = Calc.approach(this.x, x, normal.x * step);
		this.y = Calc.approach(this.y, y, normal.y * step);
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

	private static _zero:Vector = new Vector();
	public static get zero():Vector { return Vector._zero.set(0, 0); }

}
