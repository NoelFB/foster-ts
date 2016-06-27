abstract class Component
{	
	
	private _entity:Entity = null;
	get entity():Entity { return this._entity; }
	set entity(val:Entity)
	{
		if (this._entity != null)
			throw "This Component is already attached to an Entity";
		this._entity = val;
	}
	
	private _scene:Scene = null;
	get scene() { return this._scene; }
	set scene(val:Scene)
	{
		if (this._scene != null)
			throw "This Component is already attached to a Scene";
		this._scene = val;
	}
	
	public active:boolean = true;
	public visible:boolean = true;
	public position:Vector = new Vector(0, 0);
	
	public get x():number { return this.position.x; }
	public set x(val:number) { this.position.x = val; }
	public get y():number { return this.position.y; }
	public set y(val:number) { this.position.y = val; }
	
	public get scenePosition():Vector
	{
		return new Vector((this._entity ? this._entity.x : 0) + this.position.x,
						  (this._entity ? this._entity.y : 0) + this.position.y);
	}
	
	public addedToEntity():void {}
	public addedToScene():void {}
	public removedFromEntity():void {}
	public removedFromScene():void {}
	public update():void {}
	public render(camera?:Camera) {}
	public debugRender(camera?:Camera):void {}

}