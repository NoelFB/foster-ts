abstract class Renderer
{
	public visible:boolean = true;

	public scene:Scene = null;
	public camera:Camera;
	public groupsMask:string[] = [];
	
	public shader:Shader;
	public shaderMatrixUniformName:string;
	
	public update() {}
	public preRender() {}
	public render()
	{
		let currentCamera = (this.camera || this.scene.camera);

		// set to our shader, and set main Matrix to the camera with fallback to Scene camera
		Engine.graphics.shader = this.shader;
		Engine.graphics.shader.set(this.shaderMatrixUniformName, currentCamera.matrix);
		
		// draw each entity
		let list = (this.groupsMask.length > 0 ? this.scene.allEntitiesInGroups(this.groupsMask) : this.scene.entities);
		for (let i = list.length - 1; i >= 0; i --)
			if (list[i].visible)
				list[i].render(currentCamera);
	}
	public postRender() {}
}