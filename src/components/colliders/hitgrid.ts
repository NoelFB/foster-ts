class Hitgrid extends Collider
{
	public tileWidth:number;
	public tileHeight:number;

	private map:any = {};

	constructor(tileWidth:number, tileHeight:number, tags?:string[])
	{
		super();

		this.type = Hitgrid.name;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

		if (tags != undefined)
			for (let i = 0; i < tags.length; i ++)
				this.tag(tags[i]);
	}

	public set(solid:boolean, tx:number, ty:number, columns?:number, rows?:number):void
	{
		for (let x = tx; x < tx + (columns || 1); x ++)
		{
			if (this.map[x] == undefined)
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
			if (this.map[x] != undefined)
				for (let y = ty; y < ty + (rows || 1); y ++)
					if (this.map[x][y] == true)
						return true;
		return false;
	}
	
	private debugSub:Color = new Color(200, 200, 200, 0.5);
	public debugRender(camera:Camera):void
	{
		// get bounds of rendering
		let bounds = camera.extents;
		let pos = this.scenePosition;
		let left = Math.floor((bounds.left - pos.x) / this.tileWidth) - 1;
		let right = Math.ceil((bounds.right - pos.x) / this.tileWidth) + 1;
		let top = Math.floor((bounds.top - pos.y) / this.tileHeight) - 1;
		let bottom = Math.ceil((bounds.bottom - pos.y) / this.tileHeight) + 1;

		for (let tx = left; tx < right; tx ++)
		{
			if (this.map[tx] == undefined)
				continue;
			for (let ty = top; ty < bottom; ty ++)
			{
				if (this.map[tx][ty] == true)
				{
					let l = this.has(tx - 1, ty);
					let r = this.has(tx + 1, ty);
					let u = this.has(tx, ty - 1);
					let d = this.has(tx, ty + 1);
					let px = pos.x + tx * this.tileWidth;
					let py = pos.y + ty * this.tileHeight;

					Engine.graphics.rect(px, py, 1, this.tileHeight, l ? Color.red : this.debugSub);
					Engine.graphics.rect(px, py, this.tileWidth, 1, u ? Color.red : this.debugSub);
					Engine.graphics.rect(px + this.tileWidth - 1, py, 1, this.tileHeight, r ? Color.red : this.debugSub);
					Engine.graphics.rect(px, py + this.tileHeight - 1, this.tileWidth, 1, d ? Color.red : this.debugSub);
				}
			}
		}
	}

}