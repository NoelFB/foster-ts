/// <reference path="./vector.ts"/>
class Camera
{
	public position:Vector = new Vector(0, 0);
	public origin:Vector = new Vector(0, 0);
	public scale:Vector = new Vector(1, 1);
	public rotation:number = 0;
	
	private _matrix:Matrix = new Matrix();
	public get matrix():Matrix
	{
		this._matrix.identity();
		this._matrix.copy(Engine.graphics.orthographic);
		this._matrix.translate(this.origin.x, this.origin.y);
		this._matrix.rotate(this.rotation);
		this._matrix.scale(this.scale.x, this.scale.y);
		this._matrix.translate(-this.position.x, -this.position.y);
		return this._matrix;
	}
	
	public get mouse():Vector
	{
		// TODO: make this use the Matrix transformation so this still works after rotation / scale
		return new Vector(Mouse.x + this.position.x - this.origin.x, Mouse.y + this.position.y - this.origin.y);
	}
}