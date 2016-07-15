abstract class Renderer
{
	public visible:boolean = true;
	public target:RenderTarget = null;
	public clearTargetColor:Color = new Color(0, 0, 0, 0);

	public scene:Scene = null;
	public camera:Camera;
	public groupsMask:string[] = [];
	
	public shader:Shader;
	public shaderCameraUniformName:string;
	
	public update():void {}
	public preRender():void {}
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
	public postRender():void {}

	public dispose():void
	{
		if (this.target != null)
			this.target.dispose();
		this.target = null;
	}
}