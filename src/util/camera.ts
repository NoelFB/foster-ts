import {Matrix} from "./matrix";
import {Vector} from "./vector";
import {Rectangle} from "./rectangle";
import {Engine} from "./../core";
import {Mouse} from "./../input";

/**
 * Camera used to create a Matrix during rendering. Scenes and Renderers may have Cameras
 */
export class Camera
{
	public position:Vector = new Vector(0, 0);
	public origin:Vector = new Vector(0, 0);
	public scale:Vector = new Vector(1, 1);
	public rotation:number = 0;

	public get x():number { return this.position.x; }
	public set x(n:number) { this.position.x = n; }

	public get y():number { return this.position.y; }
	public set y(n:number) { this.position.y = n; }

	private _matrix:Matrix = new Matrix();
	private _internal:Matrix = new Matrix();
	private _mouse:Vector = new Vector();

	private get internal():Matrix
	{
		return this._internal.identity()
			.translate(this.origin.x, this.origin.y)
			.rotate(this.rotation)
			.scale(this.scale.x, this.scale.y)
			.translate(-this.position.x, -this.position.y);
	}

	public get matrix():Matrix
	{
		return this._matrix
			.copy(Engine.graphics.orthographic)
			.multiply(this.internal);
	}

	public get mouse():Vector
	{
		return this._mouse.set(
			Mouse.x + this.position.x - this.origin.x,
			Mouse.y + this.position.y - this.origin.y,
		).transform(this.internal.invert());
	}

	private extentsA:Vector = new Vector();
	private extentsB:Vector = new Vector();
	private extentsC:Vector = new Vector();
	private extentsD:Vector = new Vector();
	private extentsRect:Rectangle = new Rectangle();

	private getExtents()
	{
		const inverse = this.internal.invert();
		this.extentsA.set(0, 0).transform(inverse);
		this.extentsB.set(Engine.width, 0).transform(inverse);
		this.extentsC.set(0, Engine.height).transform(inverse);
		this.extentsD.set(Engine.width, Engine.height).transform(inverse);
	}

	public get extents():Rectangle
	{
		this.getExtents();
		const r = this.extentsRect;
		r.x = Math.min(this.extentsA.x, this.extentsB.x, this.extentsC.x, this.extentsD.x);
		r.y = Math.min(this.extentsA.y, this.extentsB.y, this.extentsC.y, this.extentsD.y);
		r.width = Math.max(this.extentsA.x, this.extentsB.x, this.extentsC.x, this.extentsD.x) - r.x;
		r.height = Math.max(this.extentsA.y, this.extentsB.y, this.extentsC.y, this.extentsD.y) - r.y;
		return r;
	}
}
