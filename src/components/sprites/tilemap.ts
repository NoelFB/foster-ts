import {Texture} from "../../assets/textures/texture";
import {Component} from "../../component";
import {Engine} from "../../engine";
import {Camera} from "../../util/camera";
import {Color} from "../../util/color";
import {Rectangle} from "../../util/rectangle";
import {Vector} from "../../util/vector";

type TileIndex = number;
interface TileMapColumn { [key:string]:TileIndex; }
export interface TileMapGrid { [key:string]:TileMapColumn; }

export class Tilemap extends Component
{
	public texture:Texture;
	public tileWidth:number;
	public tileHeight:number;
	public color:Color = Color.white.clone();
	public alpha:number = 1;

	private map:TileMapGrid = {};
	private tileColumns:number;
	private crop:Rectangle = new Rectangle();

	private _minTileX:number;
	private _minTileY:number;
	private _maxTileX:number;
	private _maxTileY:number;

	private _vec = new Vector();

	public get sceneLeft() { return this.getScenePosition(this._vec).x; }
	public get sceneTop() { return this.getScenePosition(this._vec).y; }
	public get width() { return this._minTileX === undefined ? 0 : (this._maxTileX - this._minTileX + 1) * this.tileWidth; }
	public get height() { return this._minTileY === undefined ? 0 : (this._maxTileY - this._minTileY + 1) * this.tileHeight; }

	public getSceneBounds(rect:Rectangle):Rectangle
	{
		return rect.set(this.sceneLeft, this.sceneTop, this.width, this.height);
	}

	constructor(texture:Texture, tileWidth:number, tileHeight:number)
	{
		super();

		this.texture = texture;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.tileColumns = Math.floor(this.texture.width / this.tileWidth);
	}

	public set(tileX:number, tileY:number, mapX:number, mapY:number, mapWidth?:number, mapHeight?:number):Tilemap
	{
		const tileIndex = tileX + tileY * this.tileColumns;
		return this.setIndex(tileIndex, mapX, mapY, mapWidth, mapHeight);
	}

	public setIndex(tileIndex:number, mapX:number, mapY:number, mapWidth?:number, mapHeight?:number):Tilemap
	{
		if (this._minTileX === undefined || mapX < this._minTileX) this._minTileX = mapX;
		if (this._minTileY === undefined || mapY < this._minTileY) this._minTileY = mapY;
		if (this._maxTileX === undefined || mapX > this._maxTileX) this._maxTileX = mapX;
		if (this._maxTileY === undefined || mapY > this._maxTileY) this._maxTileY = mapY;

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

	public getTileSubtexture(tileIndex: number, sub?:Texture):Texture
	{
		console.assert(tileIndex >= 0);
		const x = (Math.floor(tileIndex % this.tileColumns)) * this.tileWidth;
		const y = Math.floor(tileIndex / this.tileColumns) * this.tileHeight;
		console.assert(x >= 0 && y >= 0);
		const rect = new Rectangle(x, y, this.tileWidth, this.tileHeight);
		return this.texture.getSubtexture(rect, sub);
	}

	public render(camera:Camera):void
	{
		// get bounds of rendering
		const bounds = camera.extents;
		const posX = this.sceneX;
		const posY = this.sceneY;
		const left = Math.floor((bounds.left - posX) / this.tileWidth) - 1;
		const right = Math.ceil((bounds.right - posX) / this.tileWidth) + 1;
		const top = Math.floor((bounds.top - posY) / this.tileHeight) - 1;
		const bottom = Math.ceil((bounds.bottom - posY) / this.tileHeight) + 1;

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
				if (index === undefined)
					continue;

				this.crop.x = (index % this.tileColumns) * this.tileWidth;
				this.crop.y = Math.floor(index / this.tileColumns) * this.tileHeight;

				Engine.graphics.texture(
					this.texture,
					posX + tx * this.tileWidth, posY + ty * this.tileHeight,
					this.crop,
					Color.temp.copy(this.color).mult(this.alpha));
			}
		}
	}
}
