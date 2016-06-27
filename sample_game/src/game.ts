/// <reference path="./../../bin/foster.d.ts"/>

class Game 
{
    public static main():void
    {
        Engine.start("Game Title", 480, 270, 3, EngineMode.Strict, function()
        {
			// load sprites
			let loader = new AssetLoader();
			loader.addTexture("assets/sprite.png");
			loader.addTexture("assets/pixel.png");
			loader.load(function()
			{
				// create animation
				AnimationBank.create("player")
					.addFrameAnimation("idle", 10, Assets.textures["assets/sprite.png"], 32, 32, [0, 2, 3, 4, 7], true);

				// begin game
				Engine.scene = new GameScene();
			});
        });
    }
}

class GameScene extends Scene
{
	private entity:Entity;
	
	public begin():void
	{
		super.begin();
		
		Engine.graphics.pixel = Assets.textures["assets/pixel.png"];
		Engine.debugMode = true;
		
		Keys.map("left", [Key.left]);
		Keys.map("right", [Key.right]);
		Keys.map("up", [Key.up]);
		Keys.map("down", [Key.down]);
		
		this.camera.origin = new Vector(Engine.width / 2, Engine.height / 2);
		this.camera.position = new Vector(Engine.width / 2, Engine.height / 2);
		
		// some entity
		{
			let hitbox = new Hitbox(-8, -16, 16, 16);
			let sprite = new Graphic(Assets.textures["assets/sprite.png"].getSubtexture(new Rectangle(35, 30, 20, 30)));
			sprite.origin = new Vector(10, 30);
			sprite.position = new Vector(0, 0);
			sprite.flipX = true;
			sprite.rotation = 1.2;
			
			this.entity = this.add(new Entity());
			this.entity.add(hitbox);
			this.entity.add(sprite);
		}

		// another entity
		{
			let another = this.add(new Entity(), new Vector(Engine.width / 2 - 64, Engine.height / 2 - 8));
			another.add(new Rectsprite(128, 16, Color.green));
			another.add(new Hitbox(0, 0, 128, 16, ["solid"]));

			let tilemap = new Tilemap(Assets.textures["assets/sprite.png"], 16, 16);
			tilemap.set(3, 3, 0, 0, 128, 4);
			another.add(tilemap);
		}
		
		this.add(new Player());
	}
	
	public update():void
	{
		super.update();

		this.entity.position = this.camera.mouse;
		this.entity.find(Graphic).rotation = (this.camera.mouse.x / 32) % (Math.PI * 2);

		if(Keys.down(Key.r))
			this.camera.rotation += Engine.delta;
	}
	
}

class Player extends Entity
{
	private physics:Physics;
	private sprite:Sprite;
	
	constructor()
	{
		super();
		
		this.depth = -10;
		this.x = 200;
		this.y = 200;
		
		// physics!
		this.add(this.physics = new Physics(-4, -4, 8, 8, null, ["solid"]));
		this.physics.onCollideX = () => { this.physics.speed.x = 0; }
		this.physics.onCollideY = () => { this.physics.speed.y = 0; }

		// sprite!
		this.add(this.sprite = new Sprite("player"));
		this.sprite.play("idle");
		this.sprite.origin.x = this.sprite.width / 2;
		this.sprite.origin.y = this.sprite.height;
	}
	
	public update()
	{
		if (Keys.mapDown("up"))
			this.physics.speed.y -= 12 * Engine.delta;
		else if (Keys.down(Key.down))
			this.physics.speed.y += 12 * Engine.delta;
		else
			this.physics.friction(0, 8);
			
		if (Keys.mapDown("left"))
			this.physics.speed.x -= 12 * Engine.delta;
		else if (Keys.mapDown("right"))
			this.physics.speed.x += 12 * Engine.delta;
		else
			this.physics.friction(8, 0);

		this.physics.circularMaxspeed(8);

		super.update();
	}
}

Game.main();