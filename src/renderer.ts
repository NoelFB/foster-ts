/**
 * Used by the Scene to render. A Scene can have multiple renderers that essentially act as separate layers / draw calls
 */
abstract class Renderer
{
	/**
	 * If this renderer is visible
	 */
	public visible:boolean = true;

	/**
	 * Current Render Target. null means it will draw to the screen
	 */
	public target:RenderTarget = null;

	/**
	 * Clear color when drawing (defaults to transparent)
	 */
	public clearTargetColor:Color = new Color(0, 0, 0, 0);

	/**
	 * The scene we're in
	 */
	public scene:Scene = null;

	/**
	 * Camera that is applied to the shader during rendering. Falls back to Scene.camera if null
	 */
	public camera:Camera;

	/**
	 * Only draws entities of the given mask, if set (otherwise draws all entities)
	 */
	public groupsMask:string[] = [];
	
	/**
	 * Current Shader used by the Renderer
	 */
	public shader:Shader;

	/**
	 * Shader Camera Matrix uniform (applies the camera matrix to this when rendering)
	 */
	public shaderCameraUniformName:string;
	
	/**
	 * Called during Scene.update
	 */
	public update():void {}

	/**
	 * Called before Render
	 */
	public preRender():void {}

	/**
	 * Renders the Renderer
	 */
	public render():void
	{
		// set target
		if (this.target != null)
		{
			Engine.graphics.setRenderTarget(this.target);
			Engine.graphics.clear(this.clearTargetColor);
		}
		else
			Engine.graphics.setRenderTarget(Engine.graphics.buffer);
		
		// set to our shader, and set main Matrix to the camera with fallback to Scene camera
		let currentCamera = (this.camera || this.scene.camera);
		Engine.graphics.shader = this.shader;
		Engine.graphics.shader.set(this.shaderCameraUniformName, currentCamera.matrix);
		
		// draw each entity
		let list = (this.groupsMask.length > 0 ? this.scene.allEntitiesInGroups(this.groupsMask) : this.scene.entities);
		for (let i = list.length - 1; i >= 0; i --)
			if (list[i].visible)
				list[i].render(currentCamera);
	}

	/**
	 * Called after Render
	 */
	public postRender():void {}

	/**
	 * Called when the Scene is disposed (cleans up our Target, if we have one)
	 */
	public dispose():void
	{
		if (this.target != null)
			this.target.dispose();
		this.target = null;
	}
}