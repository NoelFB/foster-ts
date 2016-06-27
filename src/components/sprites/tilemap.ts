/// <reference path="./../../component.ts"/>
class Tilemap extends Component
{
	public texture:Texture;
	public tileWidth:number;
	public tileHeight:number;

	private map:any = {};
	private tileColumns:number;
	private crop:Rectangle = new Rectangle();

	constructor(texture:Texture, tileWidth:number, tileHeight:number)
	{
		super();

		this.texture = texture;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.tileColumns = this.texture.width / this.tileWidth;
	}

	public set(tileX:number, tileY:number, mapX:number, mapY:number, mapWidth?:number, mapHeight?:number):void
	{
		let tileIndex = tileX + tileY * this.tileColumns;
		for (let x = mapX; x < mapX + (mapWidth || 1); x ++)
			for (let y = mapY; y < mapY + (mapHeight || 1); y ++)
			{
				if (this.map[x] == undefined)
					this.map[x] = {};
				this.map[x][y] = tileIndex;
			}
	}

	public has(mapX:number, mapY:number):boolean
	{
		return (this.map[mapX] != undefined && this.map[mapX][mapY] != undefined);
	}

	public get(mapX:number, mapY:number):Vector
	{
		if (this.has(mapX, mapY))
		{
			var index = this.map[mapX][mapY];
			return new Vector(index % this.tileColumns, Math.floor(index / this.tileColumns));
		}
		return null;
	}

	public clear(mapX:number, mapY:number, mapWidth?:number, mapHeight?:number):void
	{
		for (let x = mapX; x < mapX + (mapWidth || 1); x ++)
			for (let y = mapY; y < mapY + (mapHeight || 1); y ++)
			{
				if (this.map[x] != undefined && this.map[x][y] != undefined)
					delete this.map[x][y];
			}
	}

	public render(camera:Camera):void
	{
		// get bounds of rendering
		let bounds = camera.extents;
		let pos = this.scenePosition;
		let left = Math.floor((bounds.left - pos.x) / this.tileWidth) - 1;
		let right = Math.ceil((bounds.right - pos.x) / this.tileWidth) + 1;
		let top = Math.floor((bounds.top - pos.y) / this.tileHeight) - 1;
		let bottom = Math.ceil((bounds.bottom - pos.y) / this.tileHeight) + 1;

		// tile texture cropping
		this.crop.width = this.tileWidth;
		this.crop.height = this.tileHeight;

		for (let tx = left; tx < right; tx ++)
			for (let ty = top; ty < bottom; ty ++)
			{
				if (this.map[tx] == undefined)
					continue;

				let index = this.map[tx][ty];
				if (index != undefined)
				{
					this.crop.x = (index % this.tileColumns) * this.tileWidth;
					this.crop.y = Math.floor(index / this.tileColumns) * this.tileHeight;

					Engine.graphics.texture(
						this.texture, 
						pos.x + tx * this.tileWidth, pos.y + ty * this.tileHeight, 
						this.crop);
				}
			}
	}

}