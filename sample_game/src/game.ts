/// <reference path="./../../bin/foster.d.ts"/>

class Game 
{
    public static main():void
    {
        Engine.start("Game Title", 480, 270, 3, EngineMode.Strict, function()
        {
			let loader = new AssetLoader();
			loader.addTexture("assets/sprite.png");
			loader.addTexture("assets/pixel.png");
			loader.load(function()
			{
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
		
		Engine.graphics.pixel = new Subtexture(Assets.textures["assets/pixel.png"]);
		Engine.debugMode = true;
		
		Keys.map("left", [Key.left]);
		Keys.map("right", [Key.right]);
		Keys.map("up", [Key.up]);
		Keys.map("down", [Key.down]);
		
		this.camera.origin = new Vector(Engine.width / 2, Engine.height / 2);
		this.camera.position = new Vector(Engine.width / 2, Engine.height / 2);
		
		this.entity = new Entity();
		this.add(this.entity);
		
		let sprite = new Sprite(Assets.textures["assets/sprite.png"], new Rectangle(35, 30, 20, 30));
		sprite.origin = new Vector(10, 30);
		sprite.position = new Vector(0, 0);
		sprite.flipX = true;
		sprite.rotation = 1.2;
		
		let hitbox = new Hitbox(-8, -16, 16, 16);
		this.entity.add(hitbox);
		
		this.entity.add(sprite);
		
		this.add(new Player());
	}
	
	public update():void
	{
		super.update();
		//this.camera.rotation += Engine.delta;
		
		this.entity.position = this.camera.mouse;
		this.entity.find(Sprite).rotation = (this.camera.mouse.x / 32) % (Math.PI * 2);
	}
	
}

class Player extends Entity
{
	private physics:Physics;
	private sprite:Sprite;
	
	constructor()
	{
		super();
		
		this.x = 200;
		this.y = 200;
		
		this.add(this.physics = new Physics(-4, -4, 8, 8));
		this.add(this.sprite = new Sprite(Assets.textures["assets/sprite.png"], new Rectangle(30, 40, 30, 80)));
		this.sprite.crop.height -= 4;
		this.sprite.origin.x = this.sprite.width / 2;
		this.sprite.origin.y = this.sprite.height;
	}
	
	public update()
	{
		if (Keys.mapDown("up"))
			this.physics.speed.y -= 32 * Engine.delta;
		else if (Keys.down(Key.down))
			this.physics.speed.y += 32 * Engine.delta;
		else
			this.physics.friction(0, 300);
			
		if (Keys.mapDown("left"))
			this.physics.speed.x -= 32 * Engine.delta;
		else if (Keys.mapDown("right"))
			this.physics.speed.x += 32 * Engine.delta;
		else
			this.physics.friction(300, 0);
	}
}

Game.main();