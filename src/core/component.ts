import {Engine, Entity, Scene} from "./../core";
import {Camera, Vector} from "./../util";

export abstract class Component
{

	/**
	 * The Entity this Component is a child of
	 */
	get entity():Entity { return this._entity; }
	set entity(val:Entity)
	{
		if (this._entity != null && val != null)
			throw new Error("This Component is already attached to an Entity");
		this._entity = val;
	}
	private _entity:Entity = null;

	/**
	 * The Scene containing this Component
	 */
	public scene:Scene = null;

	/**
	 * Whether this Component should be updated
	 */
	public active:boolean = true;

	/**
	 * Whether this Component should be rendered
	 */
	public visible:boolean = true;

	/**
	 * The Local position of the Component, relative to the Entity
	 */
	public position:Vector = new Vector(0, 0);

	/**
	 * The Local X position of the Component, relative to the Entity
	 */
	public get x():number { return this.position.x; }
	public set x(val:number) { this.position.x = val; }

	/**
	 * The Local Y position of the Component, relative to the Entity
	 */
	public get y():number { return this.position.y; }
	public set y(val:number) { this.position.y = val; }

	/**
	 * The position of the Component in the Scene (position + Entity.position)
	 */
	private _scenePosition:Vector = new Vector();
	public get scenePosition():Vector
	{
		return this._scenePosition.set(this._entity ? this._entity.x :0, this._entity ? this._entity.y :0).add(this.position);
	}

	/**
	 * Called when the Component was Added to the Entity
	 */
	public addedToEntity():void {}

	/**
	 * Called when the Component was Added to the Scene
	 */
	public addedToScene():void {}

	/**
	 * Called when the Component was Removed from the Entity
	 */
	public removedFromEntity():void {}

	/**
	 * Called when the Component was Removed from the Scene
	 */
	public removedFromScene():void {}

	/**
	 * Called when the Component is Updated from its Entity
	 */
	public update():void {}

	/**
	 * Called when the component is Rendered from its Entity
	 */
	public render(camera?:Camera) {}

	/**
	 * Called when the Engine is in Debug mode, at the end of the Scene Render from its Entity
	 */
	public debugRender(camera?:Camera):void {}

}
