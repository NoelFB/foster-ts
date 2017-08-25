import {Vector} from "./vector";

const tmp = new Vector();

export class Rectangle
{
	public x:number;
	public y:number;
	public width:number;
	public height:number;

	get left():number { return this.x; }
	set left(val:number) {
		const right = this.x + this.width;
		this.x = val;
		this.width = right - this.x;
	}

	get right():number { return this.x + this.width; }
	set right(val:number) { this.width = val - this.x; }

	get top():number { return this.y; }
	set top(val:number) {
		const bottom = this.y + this.height;
		this.y = val
		this.height = bottom - this.y;
	}

	get bottom():number { return this.y + this.height; }
	set bottom(val:number) { this.height = val - this.y; }

	get centerX():number { return this.x + this.width/2; }
	get centerY():number { return this.y + this.height/2; }
	getCenter(pt:Vector):Vector { pt.set(this.centerX, this.centerY); return pt; }

	encompassPoint(pt:Vector)
	{
		if (pt.x < this.left) this.left = pt.x;
		else if (pt.x > this.right) this.right = pt.x;

		if (pt.y < this.top) this.top = pt.y;
		else if (pt.y > this.bottom) this.bottom = pt.y;
	}

	encompassRect(r:Rectangle)
	{
		for (const pt of r.corners())
			this.encompassPoint(pt);
	}

	*corners() {
		yield new Vector(this.x, this.y);
		yield new Vector(this.x + this.width, this.y);
		yield new Vector(this.x, this.y + this.height);
		yield new Vector(this.x + this.width, this.y + this.height);
	}

	public toString():string
	{
		return `<Rectangle ${this.x}, ${this.y}, ${this.width}, ${this.height}>`;
	}

	constructor(x?:number, y?:number, w?:number, h?:number)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.width = w || 1;
		this.height = h || 1;
	}

	public set(x:number, y:number, w:number, h:number):Rectangle
	{
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		return this;
	}

	public containsPoint(point:Vector):boolean
	{
		return this.x <= point.x && this.right > point.x && this.y <= point.y && this.bottom > point.y;
	}

	public overlapsVertically(rect:Rectangle):boolean
	{
		return (rect.top > this.top && rect.top < this.bottom) ||
			(rect.bottom > this.top && rect.bottom < this.bottom);
	}

	public overlapsHorizontally(rect:Rectangle):boolean
	{
		return (rect.left > this.left && rect.left < this.right) ||
			(rect.right > this.left && rect.right < this.right);
	}

	public expand(width:number, height:number)
	{
		this.x -= width / 2;
		this.width += width * 2;
		this.y -= height / 2;
		this.height += height * 2;
	}

	public intersectsRect(r:Rectangle):boolean
	{
		const p = tmp;
		return this.containsPoint(p.set(r.x, r.y)) ||
			this.containsPoint(p.set(r.x + r.width, r.y)) ||
			this.containsPoint(p.set(r.x, r.y + r.height)) ||
			this.containsPoint(p.set(r.x + r.width, r.y + r.height));

	}

	public cropRect(r:Rectangle):Rectangle
	{
		if (r.x < this.x)
		{
			r.width += (r.x - this.x);
			r.x = this.x;
		}

		if (r.y < this.x)
		{
			r.height += (r.y - this.y);
			r.y = this.y;
		}

		if (r.x > this.right)
		{
			r.x = this.right;
			r.width = 0;
		}

		if (r.y > this.bottom)
		{
			r.y = this.bottom;
			r.height = 0;
		}

		if (r.right > this.right)
			r.width = this.right - r.x;
		if (r.bottom > this.bottom)
			r.height = this.bottom - r.y;
		return r;
	}

	public crop(x:number, y:number, w:number, h:number, ref?:Rectangle):Rectangle
	{
		if (ref === undefined)
			ref = new Rectangle();
		ref.set(x, y, w, h);
		this.cropRect(ref);
		return ref;
	}

	public clone():Rectangle
	{
		return new Rectangle().copy(this);
	}

	public copy(from:Rectangle):Rectangle
	{
		this.x = from.x;
		this.y = from.y;
		this.width = from.width;
		this.height = from.height;
		return this;
	}

	public static temp0:Rectangle = new Rectangle();
	public static temp1:Rectangle = new Rectangle();
	public static temp2:Rectangle = new Rectangle();
}
