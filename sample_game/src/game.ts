/// <reference path="./../../bin/foster.d.ts"/>

// entry point
Engine.start("Game Title", 480, 270, 3, () =>
{
	// load assets
	new AssetLoader()
		.addAtlas("gfx", "assets/atlas.png", "assets/atlas.json", AtlasType.ASEPRITE)
		.load(() =>
		{
			var atlas = Assets.atlases["gfx"];
			Engine.graphics.pixel = atlas.get("pixel");

			// player animation
			AnimationBank.create("player")
				.add("idle", 0, [atlas.get("player 0")], false)
				.add("run", 10, atlas.list("player ", ["1", "2", "3", "0"]), true);

			// dust particles
			new ParticleTemplate("dust")
				.speed(120, 20)
				.frictionX(300, 80)
				.accelY(-40, 10)
				.colors([new Color(0.8, 0.8, 0.8), new Color(1, 1, 1)])
				.alphaFrom(1, 0)
				.alphaTo(0, 0)
				.duration(1, 0.2)
				.scaleFrom(2, 0.2)
				.scaleTo(0, 0);
			
			// control mappings
			Keys.maps(
			{
				"left": [Key.left, Key.a],
				"right": [Key.right, Key.d],
				"up": [Key.up, Key.w],
				"down": [Key.down, Key.s]
			});

			// begin game
			Engine.scene = new GameScene();
		});
});

class GameScene extends Scene
{

	private brickEntity:Entity;

	public begin():void
	{
		super.begin();
		
		this.camera.origin.set(Engine.width / 2, Engine.height / 2);
		this.camera.position.set(Engine.width / 2, Engine.height / 2);

		this.add(this.brickEntity = new Entity());
		this.brickEntity.add(new Hitgrid(16, 16, ["solid"]));
		this.brick(0, 0, 24, 1);
		this.brick(0, 1, 1, 12);
		this.brick(0, 13, 24, 1);
		this.brick(24, 0, 1, 14);
		this.brick(4, 5, 2, 3);
		
		this.add(new Player());
	}

	private brick(tx:number, ty:number, columns:number, rows:number):void
	{
		for (let x = tx; x < tx + columns; x ++)
			for (let y = ty; y < ty + rows; y ++)
			{
				this.brickEntity.add(new Graphic(Assets.atlases["gfx"].get("brick"), new Vector(x * 16, y * 16)));
				this.brickEntity.find<Hitgrid>(Hitgrid).set(true, x, y);
			}
	}
	
	public update():void
	{
		super.update();

		if(Keys.down(Key.r))
			this.camera.rotation += Engine.delta;
	}
	
}