/// <reference path="../../component.ts"/>
abstract class Collider extends Component
{
	public tags:string[] = [];
	public type:string; // should be the Class.name of the lowest parent collider, ex Hitbox.name or Hitgrid.name, etc
	
	public tag(tag:string):void
	{
		this.tags.push(tag);
		if (this.entity != null && this.entity.scene != null)
			this.entity.scene._trackCollider(this, tag);
	}
	
	public untag(tag:string):void
	{
		let index = this.tags.indexOf(tag);
		if (index >= 0)
		{
			this.tags.splice(index, 1);
			if (this.entity != null && this.entity.scene != null)
				this.entity.scene._untrackCollider(this, tag);
		}
	}
	
	public check(tag:string, x?:number, y?:number):boolean
	{
		return this.collide(tag, x, y) != null;
	}
	
	public checks(tags:string[], x?:number, y?:number):boolean
	{
		for (let i = 0; i < tags.length; i ++)
			if (this.collide(tags[i], x, y) != null)
				return true;
		return false;
	}
	
	public collide(tag:string, x:number, y:number):Collider
	{
		var result:Collider = null;
		var against = this.entity.scene.allCollidersInTag(tag);
		
		this.x += x || 0;
		this.y += y || 0;
		for (let i = 0; i < against.length; i ++)
			if (Collider.overlap(this, against[i]))
			{
				result = against[i];
				break;
			}
		this.x -= x || 0;
		this.y -= y || 0;
		
		return result;	
	}

	public collides(tags:string[], x?:number, y?:number):Collider
	{
		for (let i = 0; i < tags.length; i ++)
		{
			let hit = this.collide(tags[i], x, y);
			if (hit != null)
				return hit;
		}
		return null;
	}
	
	public collideAll(tag:string, x?:number, y?:number):Collider[]
	{
		var list:Collider[] = [];
		var against = this.entity.scene.allCollidersInTag(tag);
		
		this.x += x || 0;
		this.y += y || 0;
		for (let i = 0; i < against.length; i ++)
			if (Collider.overlap(this, against[i]))
				list.push(against[i]);
		this.x -= x || 0;
		this.y -= y || 0;
		
		return list;
	}
	
	public static overlaptest = {};
	public static registerOverlapTest(fromType:Function, toType:Function, test:(a:Collider, b:Collider)=>boolean)
	{
		if (Collider.overlaptest[fromType.name] == undefined)
			Collider.overlaptest[fromType.name] = {};
		if (Collider.overlaptest[toType.name] == undefined)
			Collider.overlaptest[toType.name] = {};
		Collider.overlaptest[fromType.name][toType.name] = (a, b) => { return test(a, b); };
		Collider.overlaptest[toType.name][fromType.name] = (a, b) => { return test(b, a); };
	}
	public static registerDefaultOverlapTests()
	{
		Collider.registerOverlapTest(Hitbox, Hitbox, Collider.overlap_hitbox_hitbox);
		Collider.registerOverlapTest(Hitbox, Hitgrid, Collider.overlap_hitbox_grid);
	}

	public static overlap(a:Collider, b:Collider):boolean
	{
		return Collider.overlaptest[a.type][b.type](a, b);
	}
	
	public static overlap_hitbox_hitbox(a:Hitbox, b:Hitbox):boolean
	{
		return a.sceneRight > b.sceneLeft && a.sceneBottom > b.sceneTop && a.sceneLeft < b.sceneRight && a.sceneTop < b.sceneBottom;
	}

	public static overlap_hitbox_grid(a:Hitbox, b:Hitgrid):boolean
	{
		let gridPosition = b.scenePosition;

		let left = Math.floor((a.sceneLeft - gridPosition.x) / b.tileWidth);
		let top = Math.floor((a.sceneTop - gridPosition.y) / b.tileHeight);
		let right = Math.ceil((a.sceneRight - gridPosition.x) / b.tileWidth);
		let bottom = Math.ceil((a.sceneBottom - gridPosition.y) / b.tileHeight);

		for (let x = left; x < right; x++)
			for (let y = top; y < bottom; y++)
				if (b.has(x, y))
					return true;
		return false;
	}
}