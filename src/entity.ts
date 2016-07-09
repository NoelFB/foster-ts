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
	 * If the Entity has been instantiated yet (has it ever been added to a scene)
	 */
	public instantiated:boolean = false;
	
	/**
	 * The current scene that the Entity is in
	 */
	public scene:Scene;

	/**
	 * List of all Entity components
	 */
	public components:Component[] = [];

	/**
	 * List of all Groups the Entity is in
	 */
	public groups:string[] = [];
	
	public _depth:number = 0;
	public _nextDepth:number = null;
	
	/**
	 * The Render-Depth of the Entity (lower = rendered later)
	 */
	get depth() 
	{
		if (this._nextDepth != null)
			return this._nextDepth; 
		return this._depth; 
	}
	set depth(val)
	{
		if (this.scene != null)
		{
			if (this._nextDepth != null)
				this.scene.sorting.push(this);
			this._nextDepth = val;
		}
		else
			this._depth = val;
	}

	constructor()
	{

	}

	/**
	 * Called the first time the entity is created (after constructor)
	 */
	created():void
	{

	}

	/**
	 * Called when the entity is added to a Scene
	 */
	added():void
	{

	}

	/**
	 * Called when the entity is removed from a Scene
	 */
	removed():void
	{

	}

	/**
	 * Called when the entity is recycled in a Scene
	 */
	recycled():void
	{

	}

	/**
	 * Called when an entity is perminantely destroyed
	 */
	destroy():void
	{

	}

	/**
	 * Called every game-step, if this entity is in a Scene and Active
	 */
	update():void
	{
		for (let i = 0; i < this.components.length; i ++)
			if (this.components[i].active)
				this.components[i].update();
	}

	/**
	 * Called via a Renderer, if Visible
	 */
	render(camera:Camera):void
	{
		for (let i = 0; i < this.components.length; i ++)
			if (this.components[i].visible)
				this.components[i].render(camera);
	}

	/**
	 * Called via the Debug Renderer
	 */
	debugRender(camera:Camera):void
	{
		Engine.graphics.hollowRect(new Rectangle(this.x - 5, this.y - 5, 10, 10), 1, Color.white);
		
		for (let i = 0; i < this.components.length; i ++)
			if (this.components[i].visible)
				this.components[i].debugRender(camera);
	}

	/**
	 * Adds a Component to this Entity
	 */
	add(component:Component):void
	{
		this.components.push(component);
		component.entity = this;
		component.addedToEntity();

		if (this.scene != null)
			this.scene._trackComponent(component);
	}

	/**
	 * Removes a Components from this Entity
	 */
	remove(component:Component):void
	{
		let index = this.components.indexOf(component);
		if (index >= 0)
		{
			this.components.splice(index, 1);
			component.removedFromEntity();
			component.entity = null;
			if (this.scene != null)
				this.scene._untrackComponent(component);
		}
	}

	/**
	 * Removes all Components from this Entity
	 */
	removeAll()
	{
		for (let i = this.components.length - 1; i >= 0; i --)
			this.remove(this.components[i]);
	}
	
	/**
	 * Finds the first component in this Entity of the given Class
	 */
	find<T extends Component>(className:Function):T
	{
		for (let i = 0; i < this.components.length; i ++)
			if (this.components[i] instanceof className)
				return <T>this.components[i];
		return null;
	}

	/**
	 * Finds all components in this Entity of the given Class
	 */
	findAll<T extends Component>(className:Function):T[]
	{
		let list:T[] = [];
		for (let i = 0; i < this.components.length; i ++)
			if (this.components[i] instanceof className)
				list.push(<T>this.components[i]);
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