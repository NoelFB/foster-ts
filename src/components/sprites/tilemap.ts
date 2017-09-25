import {Texture} from "./../../assets";
import {Component, Engine} from "./../../core";
import {Camera, Color, Rectangle, Vector} from "./../../util";

export class Tilemap extends Component
{
	public texture:Texture;
	public tileWidth:number;
	public tileHeight:number;
	public color:Color = Color.white.clone();
	public alpha:number = 1;

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

	public set(tileX:number, tileY:number, mapX:number, mapY:number, mapWidth?:number, mapHeight?:number):Tilemap
	{
		const tileIndex = tileX + tileY * this.tileColumns;
		for (let x = mapX; x < mapX + (mapWidth || 1); x ++)
		{
			if (this.map[x] === undefined)
				this.map[x] = {};
			for (let y = mapY; y < mapY + (mapHeight || 1); y ++)
				this.map[x][y] = tileIndex;
		}
		return this;
	}

	public clear(mapX:number, mapY:number, mapWidth?:number, mapHeight?:number):Tilemap
	{
		for (let x = mapX; x < mapX + (mapWidth || 1); x ++)
			if (this.map[x] !== undefined)
				for (let y = mapY; y < mapY + (mapHeight || 1); y ++)
					if (this.map[x][y] !== undefined)
						delete this.map[x][y];
		return this;
	}

	public has(mapX:number, mapY:number):boolean
	{
		return (this.map[mapX] !== undefined && this.map[mapX][mapY] !== undefined);
	}

	public get(mapX:number, mapY:number):Vector
	{
		if (this.has(mapX, mapY))
		{
			const index = this.map[mapX][mapY];
			return new Vector(index % this.tileColumns, Math.floor(index / this.tileColumns));
		}
		return null;
	}

	public render(camera:Camera):void
	{
		// get bounds of rendering
		const bounds = camera.extents;
		const pos = this.scenePosition;
		const left = Math.floor((bounds.left - pos.x) / this.tileWidth) - 1;
		const right = Math.ceil((bounds.right - pos.x) / this.tileWidth) + 1;
		const top = Math.floor((bounds.top - pos.y) / this.tileHeight) - 1;
		const bottom = Math.ceil((bounds.bottom - pos.y) / this.tileHeight) + 1;

		// tile texture cropping
		this.crop.width = this.tileWidth;
		this.crop.height = this.tileHeight;

		for (let tx = left; tx < right; tx ++)
		{
			if (this.map[tx] === undefined)
				continue;
			for (let ty = top; ty < bottom; ty ++)
			{
				const index = this.map[tx][ty];
				if (index !== undefined)
				{
					this.crop.x = (index % this.tileColumns) * this.tileWidth;
					this.crop.y = Math.floor(index / this.tileColumns) * this.tileHeight;

					Engine.graphics.texture(
						this.texture,
						pos.x + tx * this.tileWidth, pos.y + ty * this.tileHeight,
						this.crop,
						Color.temp.copy(this.color).mult(this.alpha));
				}
			}
		}
	}

}
