class Scene
{
	
	/**
	 * The Camera in the Scene
	 */
	public camera:Camera = new Camera();

	/**
	 * A list of all the Entities in the Scene
	 */
	public entities:Entity[] = [];

	/**
	 * A list of all the Renderers in the Scene
	 */
	public renderers:Renderer[] = [];

	/**
	 * List of entities about to be sorted by depth
	 */
	public sorting:Entity[] = [];
	
	private colliders:any = {};
	private groups:any = {};
	private cache:any = {};
	
	constructor()
	{
		this.camera = new Camera();		
		this.addRenderer(new SpriteRenderer());
	}

	/**
	 * Called when this Scene begins (after Engine.scene has been set)
	 */
	public begin()
	{

	}

	/**
	 * Called when this Scene ends (Engine.scene is going to a new scene)
	 */
	public ended()
	{

	}

	/**
	 * Called every frame and updates the Scene
	 */
	public update()
	{
		// update entities
		let lengthWas = this.entities.length;
		for (let i = 0; i < this.entities.length; i ++)
		{
			let entity = this.entities[i];
			if (entity.active)
				entity.update();

			// in case stuff was removed
			if (lengthWas > this.entities.length)
			{
				i -= (lengthWas - this.entities.length);
				lengthWas = this.entities.length;
			}
		}

		// update renderers
		for (let i = 0; i < this.renderers.length; i ++)
			if (this.renderers[i].visible)
				this.renderers[i].update();
	}

	/**
	 * Called when the Scene should be rendered, and renders each of its Renderers
	 */
	public render()
	{
		// sort entities
		for (let i = 0; i < this.sorting.length; i ++)
		{
			let entity = this.sorting[i];
			entity._depth = entity._nextDepth;
			entity._nextDepth = null;

			this._insertEntityInto(entity, this.entities, true);
			for (let j = 0; j < entity.groups.length; j ++)
				this._insertEntityInto(entity, this.groups[entity.groups[j]], true);
		}
		this.sorting = [];

		// pre-render
		for (let i = 0; i < this.renderers.length; i ++)
			if (this.renderers[i].visible)
				this.renderers[i].preRender();

		// render
		for (let i = 0; i < this.renderers.length; i ++)
			if (this.renderers[i].visible)
				this.renderers[i].render();

		// post-render
		for (let i = 0; i < this.renderers.length; i ++)
			if (this.renderers[i].visible)
				this.renderers[i].postRender();
				
		// debug render
		if (Engine.debugMode)
		{
			Engine.graphics.shader = Shaders.primitive;
			Engine.graphics.shader.set("matrix", this.camera.matrix);
			
			for (let i = 0; i < this.entities.length; i ++)
				if (this.entities[i].active)
					this.entities[i].debugRender(this.camera);
		}
	}

	/**
	 * Adds the given Entity to this Scene
	 * @param entity 	The Entity to add
	 * @param position 	The optional position to add the Entity at
	 */
	public add(entity:Entity, position?:Vector):Entity
	{
		entity.scene = this;
		this._insertEntityInto(entity, this.entities, false);

		if (position != undefined)
			entity.position = position;

		// first time for this entity
		if (!entity.instantiated)
		{
			entity.instantiated = true;
			entity.created();
		}

		// group existing groups in the entity
		for (let i = 0; i < entity.groups.length; i ++)
			this._groupEntity(entity, entity.groups[i]);

		// add existing components in the entity
		for (let i = 0; i < entity.components.length; i ++)
			this._trackComponent(entity.components[i]);

		// add entity
		entity.added();
		return entity;
	}

	/**
	 * Recreates and adds an Entity from the cache in the given bucket. If there are no entities cache'd in that bucket, NULL is returned
	 * @param bucket	The bucket to pull from
	 */
	public recreate(bucket:string):Entity
	{
		if (Array.isArray(this.cache[bucket]) && this.cache[bucket].length > 0)
		{
			var entity = this.cache[bucket][0];
			this.cache[bucket].splice(0, 1);
			return this.add(<Entity>entity);
		}
		return null;
	}

	/**
	 * Recycles an entity into the given bucket & removes it from the Scene
	 * @param bucket	The bucket to recycle the entity into
	 * @param entity	The entity to recycle & remove
	 */
	public recycle(bucket:string, entity:Entity):void
	{
		this.remove(entity);
		if (this.cache[bucket] == undefined)
			this.cache[bucket] = [];
		this.cache[bucket].push(entity);
		entity.recycled();
	}

	/**
	 * Removes the given Entity from the scene
	 * @param entity 	The entity to remove
	 */
	public remove(entity:Entity):void
	{
		let index = this.entities.indexOf(entity);
		if (index >= 0)
			this.removeAt(index);
	}

	/**
	 * Removes an Entity from Scene.entities at the given index
	 * @param index 	The Index to remove at
	 */
	public removeAt(index:number):void
	{
		let entity = this.entities[index];
		entity.removed();

		// untrack all components
		for (let i = 0; i < entity.components.length; i ++)
			this._untrackComponent(entity.components[i]);

		// ungroup
		for  (let i = 0; i < entity.groups.length; i ++)
			this._ungroupEntity(entity, entity.groups[i]);

		// remove entity
		entity.scene = null;
		this.entities.splice(index, 1);
	}

	/**
	 * Removes every Entity from the Scene
	 */
	public removeAll():void
	{
		for (let i = this.entities.length - 1; i >= 0; i --)
			this.entities.splice(i, 1);
	}

	/**
	 * Destroys the given entity (calls Entity.destroy, sets Entity.instantiated to false)
	 * @param entity 	The entity to destroy
	 */
	public destroy(entity:Entity):void
	{
		if (entity.scene != null)
			this.remove(entity);
		entity.destroy();
		entity.instantiated = false;
	}

	public firstEntityInGroup(group:string):Entity
	{
		if (this.groups[group] != undefined && this.groups[group].length > 0)
			return this.groups[group][0];
		return null;
	}

	public firstEntityOfClass(classType:any):Entity
	{
		for (let i = 0; i < this.entities.length; i ++)
			if (this.entities[i] instanceof classType)
				return this.entities[i];
		return null;
	}

	public allEntitiesInGroup(group:string):Entity[]
	{
		if (this.groups[group] != undefined)
			return this.groups[group];
		return [];
	}

	public allEntitiesInGroups(groups:string[]):Entity[]
	{
		let lists:Entity[] = [];
		for (let i = 0; i < groups.length; i ++)
			lists.concat(this.allEntitiesInGroup(groups[i]));
		return lists;
	}

	public allEntitiesOfClass(classType:any):Entity[]
	{
		let list:Entity[] = [];
		for (let i = 0; i < this.entities.length; i ++)
			if (this.entities[i] instanceof classType)
				list.push(this.entities[i]);
		return list;
	}

	public firstColliderInTag(tag:string):Collider
	{
		if (this.colliders[tag] != undefined && this.colliders[tag].length > 0)
			return this.colliders[tag];
		return null;
	}

	public allCollidersInTag(tag:string):Collider[]
	{
		if (this.colliders[tag] != undefined)
			return this.colliders[tag];
		return [];
	}

	public addRenderer(renderer:Renderer):Renderer
	{
		renderer.scene = this;
		this.renderers.push(renderer);
		return renderer;
	}

	public removeRenderer(renderer:Renderer):Renderer
	{
		let index = this.renderers.indexOf(renderer);
		if (index >= 0)
			this.renderers.splice(index, 1);
		renderer.scene = null;
		return renderer;
	}

	public _insertEntityInto(entity:Entity, list:Entity[], removeFrom:boolean)
	{
		if (removeFrom)
		{
			let index = list.indexOf(entity);
			if (index >= 0)
				list.splice(index, 1);
		}

		if (list.length == 0)
			list.push(entity);
		else
		{
			let i = 0;
			for (i = 0; i < list.length && list[i]._depth < entity._depth; i ++)
				continue;
			list.splice(i, 0, entity);
		}
	}

	public _groupEntity(entity:Entity, group:string)
	{
		if (this.groups[group] == undefined)
			this.groups[group] = [];

		this._insertEntityInto(entity, this.groups[group], false);
	}

	public _ungroupEntity(entity:Entity, group:string)
	{
		if (this.groups[group] != undefined)
		{
			let index = this.groups[group].indexOf(entity);
			if (index >= 0)
			{
				this.groups[group].splice(index, 1);
				if (this.groups[group].length <= 0)
					delete this.groups[group];
			}
		}
	}

	public _trackComponent(component:Component)
	{
		if (component.entity == null || component.entity.scene != this)
			throw "Component must be added through an existing entity";

		if (component instanceof Collider)
		{
			for (let i = 0; i < component.tags.length; i ++)
				this._trackCollider(component, component.tags[i]);
		}

		component.scene = this;
		component.addedToScene();
	}

	public _untrackComponent(component:Component)
	{
		component.removedFromScene();

		if (component instanceof Collider)
		{
			for (let i = 0; i < component.tags.length; i ++)
				this._untrackCollider(component, component.tags[i]);
		}

		component.scene = null;
	}

	public _trackCollider(collider:Collider, tag:string)
	{
		if (this.colliders[tag] == undefined)
			this.colliders[tag] = [];
		this.colliders[tag].push(collider);
	}

	public _untrackCollider(collider:Collider, tag:string):void
	{
		if (this.colliders[tag] != undefined)
		{
			let index = this.colliders[tag].indexOf(collider);
			if (index >= 0)
			{
				this.colliders[tag].splice(index, 1);
				if (this.colliders[tag].length <= 0)
					delete this.colliders[tag];
			}
		}
	}
    
}