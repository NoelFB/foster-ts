/// <reference path="./../../bin/foster.d.ts"/>

class Player extends Entity
{
	private physics:Physics;
	private sprite:Sprite;
	private dust:ParticleSystem;
	private sfx:Sound = new Sound("boop");
	
	constructor()
	{
		super();
		
		this.depth = -10;
		this.x = 200;
		this.y = 200;
		
		// physics!
		this.add(this.physics = new Physics(-4, -8, 8, 8, null, ["solid"]));
		this.physics.onCollideX = (hit) => 
		{
			if (Math.abs(this.physics.speed.x) > 50)
				this.sprite.scale.x = Calc.sign(this.sprite.scale.x) * 0.75; 
			this.physics.speed.x = 0; 
		}
		this.physics.onCollideY = (hit) => 
		{
			if (Math.abs(this.physics.speed.y) > 50)
				this.sprite.scale.y = Calc.sign(this.sprite.scale.y) * 0.75; 
			this.physics.speed.y = 0; 
		}

		// sprite!
		this.add(this.sprite = new Sprite("player"));
		this.sprite.play("idle");
		this.sprite.origin.x = this.sprite.width / 2;
		this.sprite.origin.y = this.sprite.height;

		// dust
		this.add(this.dust = new ParticleSystem("dust"));

		// test coroutine
		this.add(new Coroutine(this.routine));
	}
	
	public update()
	{
		if (Keys.mapDown("up"))
			this.physics.speed.y -= 240 * Engine.delta;
		else if (Keys.down(Key.down))
			this.physics.speed.y += 240 * Engine.delta;
		else
			this.physics.friction(0, 180);
			
		if (Keys.mapDown("left"))
		{
			if (Keys.mapPressed("left"))
				this.sfx.play();
			this.physics.speed.x -= 240 * Engine.delta;
			this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
			if (this.physics.speed.x > 0)
				this.dust.burst(this.x, this.y, 0, 4, 0);
		}
		else if (Keys.mapDown("right"))
		{
			if (Keys.mapPressed("right"))
				this.sfx.play();
			this.physics.speed.x += 240 * Engine.delta;
			this.sprite.scale.x = Math.abs(this.sprite.scale.x);
			if (this.physics.speed.x < 0)
				this.dust.burst(this.x, this.y, Math.PI, 4, 0);
		}
		else
			this.physics.friction(180, 0);

		this.physics.circularMaxspeed(100);

		// current animation
		if (this.physics.speed.length > 0.1)
		{
			this.sprite.rate = Calc.clamp(this.physics.speed.length / 100, 0.25, 1.00);
			this.sprite.play("run");
		}
		else
		{
			this.sprite.rate = 1;
			this.sprite.play("idle");
		}

		super.update();

		// ease scale back
		this.sprite.scale.x = Calc.approach(this.sprite.scale.x, Calc.sign(this.sprite.scale.x), 2 * Engine.delta);
		this.sprite.scale.y = Calc.approach(this.sprite.scale.y, Calc.sign(this.sprite.scale.y), 2 * Engine.delta);

		// camera follow
		this.scene.camera.position.x += (this.x - this.scene.camera.position.x) / 10;
		this.scene.camera.position.y += (this.y - this.scene.camera.position.y) / 10;
	}

	private *routine():Iterator<any>
	{
		console.log("test");
		yield 0.5;
		console.log("test2");
		yield 2;
		console.log("test3");
		yield 4;
		console.log("final");
		yield null;
	}
}