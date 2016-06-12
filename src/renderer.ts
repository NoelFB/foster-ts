abstract class Renderer
{
	public scene:Scene = null;
	public visible:boolean = true;
	
	public shader:Shader;
	public shaderMatrixUniformName:string;
	public camera:Camera;
	public groupsMask:string[] = [];
	public useGroupMask:boolean = false;
	
	public update() {}
	public preRender() {}
	public render()
	{
		// set to texture shader
		Engine.graphics.shader = this.shader;
		Engine.graphics.shader.set(this.shaderMatrixUniformName, (this.camera || this.scene.camera).matrix);
		
		// draw each entity
		let list = (this.useGroupMask ? this.scene.allEntitiesInGroups(this.groupsMask) : this.scene.entities);
		for (let i = 0; i < this.scene.entities.length; i ++)
		{
			let entity = this.scene.entities[i];
			if (entity.visible)
				entity.render();
		}
	}
	public postRender() {}
}