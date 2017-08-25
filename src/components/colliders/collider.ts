import {Component} from "../../component";
import {Entity} from "../../entity";

export interface OverlapTest {
	[key: string]: any;
}

export abstract class Collider extends Component
{
	public tags:string[] = [];
	public type:string; // should be the Class.name of the lowest parent collider, ex Hitbox.name or Hitgrid.name, etc

	public tag(tag:string):void
	{
		this.tags.push(tag);
		if (this.entity != null && this.entity.scene != null)
			this.entity.scene._trackCollider(this, tag);
	}

	public untagAll()
	{
		while (this.tags.length)
			this.untag(this.tags[0]);
	}

	public untag(tag:string):void
	{
		const index = this.tags.indexOf(tag);
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
		for (const tag of tags)
			if (this.collide(tag, x, y) != null)
				return true;
		return false;
	}

	blacklistedEntities: Entity[] = [];

	public collide(tag:string, x:number, y:number):Collider
	{
		let result:Collider = null;
		const against = this.entity.scene.allCollidersInTag(tag);

		this.x += x || 0;
		this.y += y || 0;
		for (const col of against)
			if (col.active && col.entity !== this.entity && this.blacklistedEntities.indexOf(col.entity) === -1 && Collider.overlap(this, col))
			{
				result = col;
				break;
			}
		this.x -= x || 0;
		this.y -= y || 0;

		return result;
	}

	public collides(tags:string[], x?:number, y?:number):Collider
	{
		for (const tag of tags)
		{
			const hit = this.collide(tag, x, y);
			if (hit != null)
				return hit;
		}
		return null;
	}

	public collideAll(tag:string, x?:number, y?:number):Collider[]
	{
		return this.collideAllMulti([tag], x, y);
	}

	public collideAllMulti(tags:string[], x?:number, y?:number):Collider[]
	{
		const against:Collider[] = [];
		for (const tag of tags)
			against.push(...this.entity.scene.allCollidersInTag(tag));


		const list:Collider[] = [];
		this.x += x || 0;
		this.y += y || 0;
		for (const col of against)
			if (col.active && col.entity !== this.entity && this.blacklistedEntities.indexOf(col.entity) === -1 && Collider.overlap(this, col))
				list.push(col);
		this.x -= x || 0;
		this.y -= y || 0;

		return list;
	}

	public static overlaptest : OverlapTest = {};

	public static registerOverlapTest(fromType:Function, toType:Function, test:(a:Collider, b:Collider)=>boolean)
	{
		console.assert(fromType);
		console.assert(toType);

		if (Collider.overlaptest[fromType.name] === undefined)
			Collider.overlaptest[fromType.name] = {};
		if (Collider.overlaptest[toType.name] === undefined)
			Collider.overlaptest[toType.name] = {};
		Collider.overlaptest[fromType.name][toType.name] = (a:Collider, b:Collider) => test(a, b);
		Collider.overlaptest[toType.name][fromType.name] = (a:Collider, b:Collider) => test(b, a);
	}

	public static overlap(a:Collider, b:Collider):boolean
	{
		return Collider.overlaptest[a.type][b.type](a, b);
	}

}
