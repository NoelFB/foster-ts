/**
 * The Scene contains a list of Entities and Renderers that in turn handle Gameplay. There can only be one active Scene at a time
 */
class Scene
{
	
	/**
	 * The Camera in the Scene
	 */
	public camera:Camera = new Camera();

	/**
	 * A list of all the Entities in the Scene
	 */
	public entities:ObjectList<Entity> = new ObjectList<Entity>();

	/**
	 * A list of all the Renderers in the Scene
	 */
	public renderers:ObjectList<Renderer> = new ObjectList<Renderer>();
	
	/**
	 * List of entities organized by Group
	 */
	public groups:{[id:string]:ObjectList<Entity>} = {};
	
	private colliders:{[key:string]:Collider[]} = {};
	private cache:any = {};
	
	constructor()
	{
		this.camera = new Camera();		
		this.addRenderer(new SpriteRenderer());
	}

	/**
	 * Called when this Scene begins (after Engine.scene has been set)
	 */
	public begin():void
	{

	}

	/**
	 * Called when this Scene ends (Engine.scene is going to a new scene)
	 */
	public ended():void
	{

	}

	/**
	 * Disposes this scene
	 */
	public dispose():void
	{
		this.renderers.each((r) => r.dispose());
		this.renderers.clear();
		this.entities.each((e) => this.destroy(e));
		this.entities.clear();

		this.colliders = {};
		this.groups = {};
		this.cache = {};
	}

	/**
	 * Called every frame and updates the Scene
	 */
	public update():void
	{
		// update entities
		this.entities.each((e) =>
		{
			if (!e.isStarted)
			{
				e.isStarted = true;
				e.started();
			}
			if (e.active && e.isStarted)
				e.update();
		});

		// update renderers
		this.renderers.each((r) =>
		{
			if (r.visible)
				r.update();
		});

		// clean dirty lists
		this.entities.clean();
		this.renderers.clean();
		for (let key in this.groups)
			this.groups[key].clean();
	}

	/**
	 * Called when the Scene should be rendered, and renders each of its Renderers
	 */
	public render():void
	{
		// sort entities (only sorts if required)
		this.entities.sort((a, b) => b.depth - a.depth);
		for (let key in this.groups)
			this.groups[key].sort((a, b) => b.depth - a.depth);

		// pre-render
		this.renderers.each((r) =>
		{
			if (r.visible)
				r.preRender();
		});

		// render
		this.renderers.each((r) =>
		{
			if (r.visible)
				r.render();
		});

		// post-render
		this.renderers.each((r) =>
		{
			if (r.visible)
				r.postRender();
		});
				
		// debug render
		if (Engine.debugMode)
		{
			Engine.graphics.setRenderTarget(Engine.graphics.buffer);
			Engine.graphics.shader = Shaders.primitive;
			Engine.graphics.shader.set("matrix", this.camera.matrix);
			
			this.entities.each((e) =>
			{
				if (e.active)
					e.debugRender(this.camera);
			});
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
		this.entities.add(entity);

		if (position != undefined)
			entity.position.set(position.x, position.y);

		// first time for this entity
		if (!entity.isCreated)
		{
			entity.isCreated = true;
			entity.created();
		}

		// group existing groups in the entity
		for (let i = 0; i < entity.groups.length; i ++)
			this._groupEntity(entity, entity.groups[i]);

		// add existing components in the entity
		entity.components.each((c) => this._trackComponent(c));

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
		entity.removed();

		// untrack all components
		entity.components.each((c) => this._untrackComponent(c));

		// ungroup
		for  (let i = 0; i < entity.groups.length; i ++)
			this._ungroupEntity(entity, entity.groups[i]);

		// remove entity
		entity.isStarted = false;
		entity.scene = null;
		this.entities.remove(entity);

	}

	/**
	 * Removes every Entity from the Scene
	 */
	public removeAll():void
	{
		this.entities.each((e) => this.remove(e));
	}

	/**
	 * Destroys the given entity (calls Entity.destroy, sets Entity.instantiated to false)
	 * @param entity 	The entity to destroy
	 */
	public destroy(entity:Entity):void
	{
		if (entity.scene != null)
			this.remove(entity);
		entity.destroyed();
		entity.isCreated = false;
	}

	public find<T extends Entity>(className:Function):T
	{
		let entity:T = null;
		this.entities.each((e) =>
		{
			if (e instanceof className)
			{
				entity = <T>e;
				return false;
			}
		});
		return entity;
	}

	public findEach<T extends Entity>(className:Function, callback:(e:T)=>any):void
	{
		this.entities.each((e) =>
		{
			if (e instanceof className)
				return callback(<T>e);
		});
	}

	public findAll<T extends Entity>(className:Function):T[]
	{
		let list:T[] = [];
		this.entities.each((e) =>
		{
			if (e instanceof className)
				list.push(<T>e);
		});
		return list;
	}

	public firstInGroup(group:string):Entity
	{
		if (this.groups[group] != undefined && this.groups[group].count > 0)
			return this.groups[group].first();
		return null;
	}

	public eachInGroup(group:string, callback:(e:Entity)=>any):void
	{
		if (this.groups[group] != undefined)
			this.groups[group].each(callback);
	}

	public allInGroup(group:string):ObjectList<Entity>
	{
		if (this.groups[group] != undefined)
			return this.groups[group];
		return null;
	}

	public eachInGroups(groups:string[], callback:(e:Entity)=>any):void
	{
		let stop = false;
		for (let i = 0; i < groups.length && !stop; i ++)
		{
			this.eachInGroup(groups[i], (e) =>
			{
				let result = callback(e);
				if (result === false)
					stop = true;
				return result;
			});
		}
	}

	public allInGroups(groups:string[], into:ObjectList<Entity> = null):ObjectList<Entity>
	{
		if (into == null || into == undefined)
			into = new ObjectList<Entity>();

		for (let i = 0; i < groups.length; i ++)
		{
			let list = this.allInGroup(groups[i]);
			if (list != null)
				list.each((e) => into.add(e));
		}

		return into;
	}
	

	public firstColliderInTag(tag:string):Collider
	{
		if (this.colliders[tag] != undefined && this.colliders[tag].length > 0)
			return this.colliders[tag][0];
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
		this.renderers.add(renderer);
		return renderer;
	}

	public removeRenderer(renderer:Renderer, dispose:boolean):Renderer
	{
		this.renderers.remove(renderer);
		if (dispose)
			renderer.dispose();
		renderer.scene = null;
		return renderer;
	}

	public _groupEntity(entity:Entity, group:string)
	{
		if (this.groups[group] == undefined)
			this.groups[group] = new ObjectList<Entity>();

		this.groups[group].add(entity);
	}

	public _ungroupEntity(entity:Entity, group:string)
	{
		if (this.groups[group] != undefined)
			this.groups[group].remove(entity);
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