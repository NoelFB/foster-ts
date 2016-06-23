class Entity
{
	public position:Vector = new Vector(0, 0);
	public get x():number { return this.position.x; }
	public set x(val:number) { this.position.x = val; }
	public get y():number { return this.position.y; }
	public set y(val:number) { this.position.y = val; }
	
	public visible:boolean = true;
	public active:boolean = true;
	public instantiated:boolean = false;
	
	public scene:Scene;
	public components:Component[] = [];
	public groups:string[] = [];
	
	public _depth:number = 0;
	public _nextDepth:number = null;
	
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
	created()
	{

	}

	/**
	 * Called when the entity is added to a Scene
	 */
	added()
	{

	}

	/**
	 * Called when the entity is removed from a Scene
	 */
	removed()
	{

	}

	/**
	 * Called when the entity is recycled in a Scene
	 */
	recycled()
	{

	}

	/**
	 * Called when an entity is perminantely destroyed
	 */
	destroy()
	{

	}

	/**
	 * Called every game-step, if this entity is in a Scene and Active
	 */
	update()
	{

	}

	/**
	 * Called via a Renderer, if Visible
	 */
	render()
	{
		for (let i = 0; i < this.components.length; i ++)
			if (this.components[i].visible)
				this.components[i].render();
	}

	/**
	 * Called via the Debug Renderer
	 */
	debugRender()
	{
		Engine.graphics.hollowRect(new Rectangle(this.x - 5, this.y - 5, 10, 10), 1, Color.white);
		
		for (let i = 0; i < this.components.length; i ++)
			if (this.components[i].visible)
				this.components[i].debugRender();
	}

	add(component:Component):void
	{
		this.components.push(component);
		component.entity = this;
		component.addedToEntity();

		if (this.scene != null)
			this.scene._trackComponent(component);
	}

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

	removeAll()
	{
		for (let i = this.components.length - 1; i >= 0; i --)
			this.remove(this.components[i]);
	}
	
	find(className:any):any
	{
		for (let i = 0; i < this.components.length; i ++)
			if (this.components[i] instanceof className)
				return this.components[i];
		return null;
	}

	findAll(componentClassType:any):any[]
	{
		let list:any = [];
		for (let i = 0; i < this.components.length; i ++)
			if (this.components[i] instanceof componentClassType)
				list.push(this.components[i]);
		return list;
	}

	group(groupType:string):void
	{
		this.groups.push(groupType);
		if (this.scene != null)
			this.scene._groupEntity(this, groupType);
	}

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

	ingroup(groupType:string):boolean
	{
		return (this.groups.indexOf(groupType) >= 0);
	}

}