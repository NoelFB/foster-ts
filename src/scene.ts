import {Component} from "./component";
import {Collider} from "./components/colliders/collider";
import {Engine} from "./engine";
import {Entity} from "./entity";
import {Renderer} from "./renderer";
import {SpriteRenderer} from "./renderers/spriteRenderer";
import {Calc, Camera, ObjectList, Shaders, Vector} from "./util";

/**
 * The Scene contains a list of Entities and Renderers that in turn handle Gameplay.
 * There can only be one active Scene at a time.
 */
export class Scene
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

	private colliders:any = {};
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

	earlyUpdate:Array<()=>void> = [];

	/**
	 * Called every frame and updates the Scene
	 */
	public update():void
	{
		for (const cb of this.earlyUpdate)
			cb();

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

		this.entities.each((e) =>
		{
			if (e.active && e.isStarted)
				e.lateUpdate();
		})

		for (const e of this._markedForDestruction)
			this.destroy(e);

		// update renderers
		this.renderers.each((r) =>
		{
			if (r.visible)
				r.update();
		});

		// clean dirty lists
		this.entities.clean();
		this.renderers.clean();
		for (const key in this.groups)
			this.groups[key].clean();
	}

	/**
	 * Called when the Scene should be rendered, and renders each of its Renderers
	 */
	public render():void
	{
		// sort entities (only sorts if required)
		this.entities.sort((a, b) => b.depth - a.depth);
		for (const key in this.groups)
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

			this.debugRender(this.camera);

			this.entities.each((e) =>
			{
				if (e.active)
					e.debugRender(this.camera);
			});
		}
	}

	public debugRender(camera:Camera) {}

	/**
	 * Adds the given Entity to this Scene
	 * @param entity 	The Entity to add
	 * @param position 	The optional position to add the Entity at
	 */
	public add(entity:Entity, position?:Vector):Entity
	{
		entity.scene = this;
		this.entities.add(entity);

		if (position !== undefined)
			entity.position.set(position.x, position.y);

		// first time for this entity
		if (!entity.isCreated)
		{
			entity.isCreated = true;
			entity.created();
		}

		// group existing groups in the entity
		for (const group of entity.groups)
			this._groupEntity(entity, group);

		// add existing components in the entity
		entity.components.each((c:Component) => this._trackComponent(c));

		// add entity
		entity.added();
		return entity;
	}

	/**
	 * Recreates and adds an Entity from the cache in the given bucket.
	 * If there are no entities cache'd in that bucket, NULL is returned
	 * @param bucket	The bucket to pull from
	 */
	public recreate(bucket:string):Entity
	{
		if (Array.isArray(this.cache[bucket]) && this.cache[bucket].length > 0)
		{
			const entity = this.cache[bucket][0];
			this.cache[bucket].splice(0, 1);
			return this.add(entity as Entity);
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
		if (this.cache[bucket] === undefined)
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
		for  (const group of entity.groups)
			this._ungroupEntity(entity, group);

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

	destroyLater(entity:Entity)
	{
		if (this._markedForDestruction.indexOf(entity) === -1)
			this._markedForDestruction.push(entity);
	}

	private _markedForDestruction:Entity[] = [];

	/**
	 * Finds all Components of the given class in the scene.
	 */
	public findAllComponents<T extends Component>(className:Function):T[]
	{
		const components:T[] = [];
		this.entities.each((e) => { components.push(...e.findAll<T>(className)); });
		return components;
	}

	public find<T extends Entity>(className:Function):T
	{
		let entity:T = null;
		this.entities.each((e) =>
		{
			if (e instanceof className)
			{
				entity = e as T;
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
				return callback(e as T);
		});
	}

	public findAll<T extends Entity>(className:Function):T[]
	{
		const list:T[] = [];
		this.entities.each((e) =>
		{
			if (e instanceof className)
				list.push(e as T);
		});
		return list;
	}

	public firstInGroup(group:string):Entity
	{
		if (this.groups[group] !== undefined && this.groups[group].count > 0)
			return this.groups[group].first();
		return null;
	}

	public eachInGroup(group:string, callback:(e:Entity)=>any):void
	{
		if (this.groups[group] !== undefined)
			this.groups[group].each(callback);
	}

	public allInGroup(group:string):ObjectList<Entity>
	{
		if (this.groups[group] !== undefined)
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
				const result = callback(e);
				if (result === false)
					stop = true;
				return result;
			});
		}
	}

	public allInGroups(groups:string[], into:ObjectList<Entity> = null):ObjectList<Entity>
	{
		if (into == null || into === undefined)
			into = new ObjectList<Entity>();

		for (const group of groups)
		{
			const list = this.allInGroup(group);
			if (list != null)
				list.each((e) => into.add(e));
		}

		return into;
	}

	public firstColliderInTag(tag:string):Collider
	{
		if (this.colliders[tag] !== undefined && this.colliders[tag].length > 0)
			return this.colliders[tag][0];
		return null;
	}

	public allCollidersInTag(tag:string):Collider[]
	{
		if (this.colliders[tag] !== undefined)
			return this.colliders[tag];
		return [];
	}

	public addRenderer(renderer:Renderer):Renderer
	{
		renderer.scene = this;
		this.renderers.add(renderer);
		this.renderers.sort((a, b) => Calc.cmp(a.sortOrder, b.sortOrder));
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
		if (this.groups[group] === undefined)
			this.groups[group] = new ObjectList<Entity>();

		this.groups[group].add(entity);
	}

	public _ungroupEntity(entity:Entity, group:string)
	{
		if (this.groups[group] !== undefined)
			this.groups[group].remove(entity);
	}

	public _trackComponent(component:Component)
	{
		if (component.entity == null || component.entity.scene !== this)
			throw new Error("Component must be added through an existing entity");

		if (component instanceof Collider)
		{
			for (const tag of component.tags)
				this._trackCollider(component, tag);
		}

		component.scene = this;
		component.addedToScene();
	}

	public _untrackComponent(component:Component)
	{
		component.removedFromScene();

		if (component instanceof Collider)
		{
			for (const tag of component.tags)
				this._untrackCollider(component, tag);
		}

		component.scene = null;
	}

	public _trackCollider(collider:Collider, tag:string)
	{
		if (this.colliders[tag] === undefined)
			this.colliders[tag] = [];
		this.colliders[tag].push(collider);
	}

	public _untrackCollider(collider:Collider, tag:string):void
	{
		if (this.colliders[tag] !== undefined)
		{
			const index = this.colliders[tag].indexOf(collider);
			if (index >= 0)
			{
				this.colliders[tag].splice(index, 1);
				if (this.colliders[tag].length <= 0)
					delete this.colliders[tag];
			}
		}
	}
}
