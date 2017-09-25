import {Component} from "./../../core";
import {Hitbox} from "./hitbox";
import {Hitgrid} from "./hitgrid";

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

	public collide(tag:string, x:number, y:number):Collider
	{
		let result:Collider = null;
		const against = this.entity.scene.allCollidersInTag(tag);

		this.x += x || 0;
		this.y += y || 0;
		for (const other of against)
			if (Collider.overlap(this, other))
			{
				result = other;
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
		const list:Collider[] = [];
		const against = this.entity.scene.allCollidersInTag(tag);

		this.x += x || 0;
		this.y += y || 0;
		for (const other of against)
			if (Collider.overlap(this, other))
				list.push(other);
		this.x -= x || 0;
		this.y -= y || 0;

		return list;
	}

	public static overlaptest:any = {};
	public static registerOverlapTest(fromType:string, toType:string, test:(a:Collider, b:Collider) => boolean)
	{
		if (Collider.overlaptest[fromType] === undefined)
			Collider.overlaptest[fromType] = {};
		if (Collider.overlaptest[toType] === undefined)
			Collider.overlaptest[toType] = {};
		Collider.overlaptest[fromType][toType] = (a:Collider, b:Collider) => test(a, b);
		Collider.overlaptest[toType][fromType] = (a:Collider, b:Collider) => test(b, a);
	}

	public static overlap(a:Collider, b:Collider):boolean
	{
		return Collider.overlaptest[a.type][b.type](a, b);
	}
}

export function DefaultOverlapTests()
{
	Collider.registerOverlapTest("Hitbox", "Hitbox", (a:Hitbox, b:Hitbox) =>
	{
		return a.sceneRight > b.sceneLeft && a.sceneBottom > b.sceneTop && a.sceneLeft < b.sceneRight && a.sceneTop < b.sceneBottom;
	});

	Collider.registerOverlapTest("Hitbox", "Hitgrid", (a:Hitbox, b:Hitgrid) =>
	{
		const gridPosition = b.scenePosition;
		const left = Math.floor((a.sceneLeft - gridPosition.x) / b.tileWidth);
		const top = Math.floor((a.sceneTop - gridPosition.y) / b.tileHeight);
		const right = Math.ceil((a.sceneRight - gridPosition.x) / b.tileWidth);
		const bottom = Math.ceil((a.sceneBottom - gridPosition.y) / b.tileHeight);

		for (let x = left; x < right; x++)
			for (let y = top; y < bottom; y++)
				if (b.has(x, y))
					return true;
		return false;
	});
}
