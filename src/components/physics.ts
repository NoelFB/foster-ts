/// <reference path="./colliders/hitbox.ts"/>
class Physics extends Hitbox
{
	public solids:string[] = [];
	public onCollideX:() => void;
	public onCollideY:() => void;
	public speed:Vector = new Vector(0, 0);
	
	private remainder:Vector = new Vector(0, 0);
	
	constructor(left:number, top:number, width:number, height:number, tags?:string[], solids?:string[])
	{
		super(left, top, width, height, tags);
		if (solids != undefined)
			this.solids = solids;
	}
	
	public update()
	{
		if (this.speed.x != 0)
			this.moveX(this.speed.x);
		if (this.speed.y != 0)
			this.moveY(this.speed.y);
	}
	
	public move(x:number, y:number):boolean
	{
		var movedX = this.moveX(x);
		var movedY = this.moveY(y);
		return movedX && movedY;
	}
	
	public moveX(amount:number):boolean
	{
		let moveBy = amount + this.remainder.x;
		this.remainder.x = moveBy % 1;
		moveBy -= this.remainder.x;
		return this.moveXAbsolute(moveBy);
	}
	
	public moveXAbsolute(amount:number):boolean
	{
		if (this.solids.length <= 0)
		{
			this.entity.x += Math.round(amount);
		}
		else
		{
			let sign = Math.sign(amount);
			amount = Math.abs(Math.round(amount));
			
			while (amount > 0)
			{
				if (this.checks(this.solids, sign, 0))
				{
					this.remainder.x = 0;
					if (this.onCollideX != null)
						this.onCollideX();
					return false;
				}
				else
				{
					this.entity.x += sign;
					amount -= 1;
				}
			}
		}
		
		return true;
	}
	
	public moveY(amount:number):boolean
	{
		let moveBy = amount + this.remainder.y;
		this.remainder.y = moveBy % 1;
		moveBy -= this.remainder.y;
		return this.moveYAbsolute(moveBy);
	}
	
	public moveYAbsolute(amount:number):boolean
	{
		if (this.solids.length <= 0)
		{
			this.entity.y += Math.round(amount);
		}
		else
		{
			let sign = Math.sign(amount);
			amount = Math.abs(Math.round(amount));
			
			while (amount > 0)
			{
				if (this.checks(this.solids, 0, sign))
				{
					this.remainder.y = 0;
					if (this.onCollideY != null)
						this.onCollideX();
					return false;
				}
				else
				{
					this.entity.y += sign;
					amount -= 1;
				}
			}
		}
		
		return true;
	}
	
	public friction(fx:number, fy:number):Physics
	{
		if (this.speed.x < 0)
			this.speed.x = Math.min(0, this.speed.x + fx * Engine.delta);
		else if (this.speed.x > 0)
			this.speed.x = Math.max(0, this.speed.x - fx * Engine.delta);
		if (this.speed.y < 0)
			this.speed.y = Math.min(0, this.speed.y + fy * Engine.delta);
		else if (this.speed.y > 0)
			this.speed.y = Math.max(0, this.speed.y - fy * Engine.delta);
		return this;
	}

	public maxspeed(mx?:number, my?:number):Physics
	{
		if (mx != undefined && mx != null)
			this.speed.x = Math.max(-mx, Math.min(mx, this.speed.x));
		if (my != undefined && my != null)
			this.speed.y = Math.max(-my, Math.min(my, this.speed.y));
		return this;
	}

	public circularMaxspeed(length:number):Physics
	{
		if (this.speed.length > length)
			this.speed.normalize().scale(length);
		return this;
	}

	public stop():void
	{
		this.speed.x = this.speed.y = 0;
		this.remainder.x = this.remainder.y = 0;
	}
}