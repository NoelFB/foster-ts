import {Engine} from "./../../core/engine";
import {Camera, Color, Rectangle} from "./../../util";
import {Collider} from "./collider";

export class Hitgrid extends Collider
{
	public tileWidth:number;
	public tileHeight:number;

	private map:any = {};

	constructor(tileWidth:number, tileHeight:number, tags?:string[])
	{
		super();

		this.type = "Hitgrid";
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

		if (tags !== undefined)
			for (const tag of tags)
				this.tag(tag);
	}

	public set(solid:boolean, tx:number, ty:number, columns?:number, rows?:number):void
	{
		for (let x = tx; x < tx + (columns || 1); x ++)
		{
			if (this.map[x] === undefined)
				this.map[x] = {};
			for (let y = ty; y < ty + (rows || 1); y ++)
				if (solid)
					this.map[x][y] = solid;
				else
					delete this.map[x][y];
		}
	}

	public has(tx:number, ty:number, columns?:number, rows?:number):boolean
	{
		for (let x = tx; x < tx + (columns || 1); x ++)
			if (this.map[x] !== undefined)
				for (let y = ty; y < ty + (rows || 1); y ++)
					if (this.map[x][y] === true)
						return true;
		return false;
	}

	private debugSub:Color = new Color(200, 200, 200, 0.5);
	public debugRender(camera:Camera):void
	{
		// get bounds of rendering
		const bounds = camera.extents;
		const pos = this.scenePosition;
		const left = Math.floor((bounds.left - pos.x) / this.tileWidth) - 1;
		const right = Math.ceil((bounds.right - pos.x) / this.tileWidth) + 1;
		const top = Math.floor((bounds.top - pos.y) / this.tileHeight) - 1;
		const bottom = Math.ceil((bounds.bottom - pos.y) / this.tileHeight) + 1;

		for (let tx = left; tx < right; tx ++)
		{
			if (this.map[tx] === undefined)
				continue;
			for (let ty = top; ty < bottom; ty ++)
			{
				if (this.map[tx][ty] === true)
				{
					const l = this.has(tx - 1, ty);
					const r = this.has(tx + 1, ty);
					const u = this.has(tx, ty - 1);
					const d = this.has(tx, ty + 1);
					const px = pos.x + tx * this.tileWidth;
					const py = pos.y + ty * this.tileHeight;

					Engine.graphics.rect(px, py, 1, this.tileHeight, l ? Color.red :this.debugSub);
					Engine.graphics.rect(px, py, this.tileWidth, 1, u ? Color.red :this.debugSub);
					Engine.graphics.rect(px + this.tileWidth - 1, py, 1, this.tileHeight, r ? Color.red :this.debugSub);
					Engine.graphics.rect(px, py + this.tileHeight - 1, this.tileWidth, 1, d ? Color.red :this.debugSub);
				}
			}
		}
	}

}
