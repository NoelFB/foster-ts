class Entity
{
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

	/**
	 * List of all Groups the Entity is in
	 */
	public groups:string[] = [];
	
	/**
	 * The Render-Depth of the Entity (lower = rendered later)
	 */
	get depth():number
	{
		return this._depth;
	}
	set depth(val:number)
	{
		if  (this.scene != null && this._depth != val)
		{
			this._depth = val;
			this.scene.entities.unsorted = true;
			for (let i = 0; i < this.groups.length; i ++)
				this.scene.groups[this.groups[i]].unsorted = true;
		}
	}
	private _depth:number = 0;

	constructor()
	{

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
		return component;
	}

	/**
	 * Removes all Components from this Entity
	 */
	removeAll()
	{
		for (let i = this.components.count - 1; i >= 0; i --)
			this.remove(this.components[i]);
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
				component = <T>c;
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
		let list:T[] = [];
		this.components.each((c) =>
		{
			if (c instanceof className)
				list.push(<T>c);
		})
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
		let index = this.groups.indexOf(groupType);
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