import {Component} from "./component";
import {Engine} from "./engine";
import {Scene} from "./scene";
import {Camera, Color, ObjectList, Vector} from "./util";

export class Entity
{
	public toString():string { return `<Entity ${this.id} '${this.name || "[noname]"}'>`; }

	private static _next_id = 1;
	id = -1;

	/**
	 * Position of the Entity in the Scene
	 */
	public position:Vector = new Vector(0, 0);

	/**
	 * X position of the Entity in the Scene
	 */
	public get x():number { return this.position.x; }
	public set x(val:number) { this.position.x = val; }

	/**
	 * Y position of the Entity in the Scene
	 */
	public get y():number { return this.position.y; }
	public set y(val:number) { this.position.y = val; }

	/**
	 * If the Entity is visible. If false, Entity.render is not called
	 */
	public visible:boolean = true;

	/**
	 * If the Entity is active. If false, Entity.update is not called
	 */
	public active:boolean = true;

	/**
	 * If the Entity has been created yet (has it ever been added to a scene)
	 */
	public isCreated:boolean = false;

	/**
	 * If the Entity has been started yet (has it been updated in the current scene)
	 */
	public isStarted:boolean = false;

	/**
	 * The current scene that the Entity is in
	 */
	public scene:Scene;

	/**
	 * List of all Entity components
	 */
	public components:ObjectList<Component> = new ObjectList<Component>();

	public componentByName:{[key:string]:Component} = {};

	public getComponentByName<T extends Component>(name:string)
	{
		const c = this.componentByName[name];
		if (!c)
			throw new Error("no component named " + name);
		//if (!(c instanceof T))
			//throw new Error("component " + name + " is not an instanceof of the given class");
		return c as T;
	}

	/**
	 * List of all Groups the Entity is in
	 */
	public groups:string[] = [];

	public name:string;

	/**
	 * The Render-Depth of the Entity (lower = rendered later)
	 */
	get depth():number
	{
		return this._depth;
	}
	set depth(val:number)
	{
		if (this.scene == null)
			throw new Error("Cannot set depth without being attached to a scene");

		if  (this._depth !== val)
		{
			this._depth = val;
			this.scene.entities.unsorted = true;
			for (const group of this.groups)
				this.scene.groups[group].unsorted = true;
		}
	}
	private _depth:number = 0;

	constructor(x?:number, y?:number)
	{
		this.id = Entity._next_id++;
		
		if (x !== undefined)
			this.x = x;
		if (y !== undefined)
			this.y = y;

		this.group("sprite");
	}

	/**
	 * Called the first time the entity is added to a scene (after constructor, before added)
	 */
	created():void
	{

	}

	/**
	 * Called immediately whenever the entity is added to a Scene (after created, before started)
	 */
	added():void
	{

	}

	/**
	 * Called before the first update of the Entity (after added)
	 */
	started():void
	{

	}

	/**
	 * Called immediately whenever the entity is removed from a Scene
	 */
	removed():void
	{

	}

	/**
	 * Called immediately whenever the entity is recycled in a Scene
	 */
	recycled():void
	{

	}

	/**
	 * Called when an entity is permanently destroyed
	 */
	destroyed():void
	{

	}

	destroyLater()
	{
		console.assert(this.scene, "this entity must have a scene to .destroyLater");
		this.scene.destroyLater(this);
	}

	/**
	 * Called every game-step, if this entity is in a Scene and Active
	 */
	update():void
	{
		this.components.each((c) =>
		{
			if (c.active)
				c.update();
		});
	}

	lateUpdate():void
	{
		this.components.each((c) =>
		{
			if (c.active)
				c.lateUpdate();
		});
	}

	/**
	 * Called via a Renderer, if Visible
	 */
	render(camera:Camera):void
	{
		this.components.each((c) =>
		{
			if (c.visible)
				c.render(camera);
		});
	}

	/**
	 * Called via the Debug Renderer
	 */
	debugRender(camera:Camera):void
	{
		Engine.graphics.hollowRect(this.x - 5, this.y - 5, 10, 10, 1, Color.white);

		this.components.each((c) =>
		{
			if (c.visible)
				c.debugRender(camera);
		});
	}

	/**
	 * Adds a Component to this Entity
	 */
	add<T extends Component>(component:T):T
	{
		console.assert(!this.components.contains(component));

		this.components.add(component);
		component.entity = this;
		component.addedToEntity();

		if (this.scene != null)
			this.scene._trackComponent(component);

		return component;
	}

	/**
	 * Removes a Components from this Entity
	 */
	remove<T extends Component>(component:T):T
	{
		this.components.remove(component);
		component.removedFromEntity();
		component.entity = null;
		if (this.scene != null)
			this.scene._untrackComponent(component);

		this._removeNamedComponent(component);

		return component;
	}

	_removeNamedComponent<T extends Component>(component:T)
	{
		let componentsToRemove:string[] = [];
		for (const [key, val] of Object.entries(this.componentByName))
			if (val === component)
				componentsToRemove.push(key);
		for (const key of componentsToRemove)
			delete this.componentByName[key];
	}

	/**
	 * Removes all Components from this Entity
	 */
	removeAll()
	{
		for (let i = this.components.count - 1; i >= 0; i --)
			this.remove(this.components[i]);
		this.componentByName = {};
	}

	/**
	 * Finds the first component in this Entity of the given Class
	 */
	find<T extends Component>(className:Function):T
	{
		let component:T = null;
		this.components.each((c) =>
		{
			if (c instanceof className)
			{
				component = c as T;
				return false;
			}
		});
		return component;
	}

	/**
	 * Finds all components in this Entity of the given Class
	 */
	findAll<T extends Component>(className:Function):T[]
	{
		const list:T[] = [];
		this.components.each((c) =>
		{
			if (c instanceof className)
				list.push(c as T);
		});
		return list;
	}

	/**
	 * Groups this entity into the given Group
	 */
	group(groupType:string):void
	{
		this.groups.push(groupType);
		if (this.scene != null)
			this.scene._groupEntity(this, groupType);
	}

	/**
	 * Removes this Entity from the given Group
	 */
	ungroup(groupType:string):void
	{
		const index = this.groups.indexOf(groupType);
		if (index >= 0)
		{
			this.groups.splice(index, 1);
			if (this.scene != null)
				this.scene._ungroupEntity(this, groupType);
		}
	}

	/**
	 * Checks if this Entity is in the given Group
	 */
	ingroup(groupType:string):boolean
	{
		return (this.groups.indexOf(groupType) >= 0);
	}

}