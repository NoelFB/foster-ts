import {Engine} from "../../engine";
import {Camera} from "../../util/camera";
import {Color} from "../../util/color";
import {Collider} from "./collider";

const DRAW_DEBUG = false;

export class Hitgrid extends Collider
{
	public tileWidth:number;
	public tileHeight:number;
	public map:any = {};

	constructor(tileWidth:number, tileHeight:number, tags?:string[])
	{
		super();

		this.type = Hitgrid.name;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

		if (tags !== undefined)
			for (const tag of tags)
				this.tag(tag);
	}

	*tiles() {
		for (let x in this.map)
			for (let y in this.map[x])
				if (this.map[x][y])
					yield [parseInt(x, 10), parseInt(y, 10)];
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
					if (this.map[x][y] == true)
						return true;
		return false;
	}

	private debugSub:Color = new Color(200, 200, 200, 0.5);
	private lineColor:Color = new Color(1, 0, 0, .5);
	public debugRender(camera:Camera):void
	{
		if (!DRAW_DEBUG)
			return;
		
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
				if (this.map[tx][ty])
				{
					const l = this.has(tx - 1, ty);
					const r = this.has(tx + 1, ty);
					const u = this.has(tx, ty - 1);
					const d = this.has(tx, ty + 1);
					const px = pos.x + tx * this.tileWidth;
					const py = pos.y + ty * this.tileHeight;

					Engine.graphics.rect(px, py, 1, this.tileHeight, l ? this.lineColor : this.debugSub);
					Engine.graphics.rect(px, py, this.tileWidth, 1, u ? this.lineColor : this.debugSub);
					Engine.graphics.rect(px + this.tileWidth - 1, py, 1, this.tileHeight, r ? this.lineColor : this.debugSub);
					Engine.graphics.rect(px, py + this.tileHeight - 1, this.tileWidth, 1, d ? this.lineColor : this.debugSub);
				}
			}
		}
	}

}