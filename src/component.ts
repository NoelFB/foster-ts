import "reflect-metadata";

import {Entity} from "./entity";
import {Scene} from "./scene";
import {Camera} from "./util/camera";
import {Color} from "./util/color";
import {Vector} from "./util/vector";

function _assign(val:any, newVal:any) {
	// set current value. returns false if value is copyable and could not be set here.
	if (val instanceof Vector)
		val.copy(newVal as Vector);
	else if (val instanceof Color)
		val.copy(newVal as Color);
	else
		return false;

	return true;
}

export interface ComponentConstructor
{
	new(args:any): Component;
}

export abstract class Component
{
	public prefabLink: any;

	constructor(opts?:{active?:boolean})
	{
		if (opts && opts.active !== undefined)
			this.active = opts.active;
	}

	public toString():string
	{
		return `<${(this as any).constructor.name} of ${this.entity}>`;
	}

	setPrefabValues(vals:object)
	{
		if (this.prefabLink)
		{
			console.assert(typeof this.prefabLink === "object", "prefab needs to be {args}");
			const args = this.prefabLink;

			for (const [name, val] of Object.entries(vals))
				if (name in args)
					if (!_assign(args[name], val))
						args[name] = val;
		}

		// set current value.
		for (const [name, val] of Object.entries(vals))
		{
			const currentVal = (this as any)[name];
			if (!_assign(currentVal, val))
				(this as any)[name] = val;
		}
	}

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

	setActive(active=true):void { this.active = active; }

	setVisible(visible=true) { this.visible = visible; }

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
	public get scenePosition():Vector { return this.getScenePosition(new Vector()); }

	public get sceneX():number { return (this._entity ? this._entity.x : 0) + this.position.x; }
	public get sceneY():number { return (this._entity ? this._entity.y : 0) + this.position.y; }

	public getScenePosition(v:Vector):Vector { return v.set(this.sceneX, this.sceneY); }

	/**
	 * Called when the Component was Added to the Entity
	 */
	public addedToEntity():void {}

	static registeredComponents: {[key:string]: ComponentConstructor} = {};

	public static register(target:ComponentConstructor)
	{
		if (target.name in Component.registeredComponents)
			throw new Error("already a Component named " + target.name);

		Component.registeredComponents[target.name] = target;
	}

	// @Component.require decorator populates this with {propertyName: constructor}
	// for each component link
	siblings: {[key:string]: () => Component};

	public static require(target:any, key:string):void
	{
		const type = Reflect.getMetadata("design:type", target, key);
		if (!type)
		{
			let msg = `no design:type metadata found for key ${key.toString()}`;
			msg += ` - is experimentalDecorators and emitDecoratorMetadata on in tsconfig.json?`;
			throw msg;
		}
		(target.siblings || (target.siblings = {}))[key] = type;
	}

	/**
	 * Called when the Component was Added to the Scene
	 */
	public addedToScene():void
	{
		if (this.siblings !== undefined)
			for (const [name, ctor] of Object.entries(this.siblings))
			{
				const siblingComponent = this.entity.find(ctor);
				if (!siblingComponent)
					throw new Error("@Component.require needs " + ctor.name + " but it is missing");
				(this as any)[name] = siblingComponent; // TODO: remove any
			}
	}

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

	public lateUpdate():void {}

	/**
	 * Called when the component is Rendered from its Entity
	 */
	public render(camera?:Camera) {}

	/**
	 * Called when the Engine is in Debug mode, at the end of the Scene Render from its Entity
	 */
	public debugRender(camera?:Camera):void {}

}