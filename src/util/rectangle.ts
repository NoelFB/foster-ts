class Rectangle
{
	public x:number;
	public y:number;
	public width:number;
	public height:number;
	
	get left():number { return this.x; }
	get right():number { return this.x + this.width; }
	get top():number { return this.y; }
	get bottom():number { return this.y + this.height; }
	
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
	
	public crop(x:number, y:number, w:number, h:number):Rectangle
	{
		let out = new Rectangle(x, y, w, h);
		this.cropRect(out);
		return out;
	}
	
	public clone():Rectangle
	{
		return new Rectangle(this.x, this.y, this.width, this.height);
	}
	
	public copyTo(out:Rectangle):void
	{
		out.x = this.x;
		out.y = this.y;
		out.width = this.width;
		out.height = this.height;
	}
}