/// <reference path="./../../bin/foster.d.ts"/>
class Game {
    static main() {
        Engine.start("Game Title", 480, 270, 3, () => {
            // load assets
            new AssetLoader()
                .addAtlas("gfx", "assets/atlas.png", "assets/atlas.json", AtlasType.ASEPRITE)
                .load(() => {
                var atlas = Assets.atlases["gfx"];
                Engine.graphics.pixel = atlas.get("pixel");
                Game.block = atlas.get("brick");
                // player animation
                AnimationBank.create("player")
                    .add("idle", 0, [atlas.get("player 0")], false)
                    .add("run", 10, atlas.list("player ", ["1", "2", "3", "0"]), true);
                // dust particles
                Game.dust = new ParticleTemplate()
                    .speed(120, 20)
                    .frictionX(300, 80)
                    .accelY(-40, 10)
                    .colors([new Color(0.8, 0.8, 0.8), new Color(1, 1, 1)])
                    .alphaFrom(1, 0)
                    .alphaTo(0, 0)
                    .duration(1, 0.2)
                    .scaleFrom(2, 0.2)
                    .scaleTo(0, 0);
                // begin game
                Engine.scene = new GameScene();
            });
        });
    }
}
class GameScene extends Scene {
    begin() {
        super.begin();
        //Engine.debugMode = true;
        Keys.map("left", [Key.left]);
        Keys.map("right", [Key.right]);
        Keys.map("up", [Key.up]);
        Keys.map("down", [Key.down]);
        this.camera.origin = new Vector(Engine.width / 2, Engine.height / 2);
        this.camera.position = new Vector(Engine.width / 2, Engine.height / 2);
        this.add(this.blockEntity = new Entity());
        this.blockEntity.add(new Hitgrid(16, 16, ["solid"]));
        this.block(0, 0, 24, 1);
        this.block(0, 1, 1, 12);
        this.block(0, 13, 24, 1);
        this.block(24, 0, 1, 14);
        this.block(4, 5, 2, 3);
        this.add(new Player());
    }
    block(tx, ty, columns, rows) {
        for (let x = tx; x < tx + columns; x++)
            for (let y = ty; y < ty + rows; y++) {
                this.blockEntity.add(new Graphic(Game.block, new Vector(x * 16, y * 16)));
                this.blockEntity.find(Hitgrid).set(true, x, y);
            }
    }
    update() {
        super.update();
        if (Keys.down(Key.r))
            this.camera.rotation += Engine.delta;
    }
}
class Player extends Entity {
    constructor() {
        super();
        this.depth = -10;
        this.x = 200;
        this.y = 200;
        // physics!
        this.add(this.physics = new Physics(-4, -8, 8, 8, null, ["solid"]));
        this.physics.onCollideX = () => {
            if (Math.abs(this.physics.speed.x) > 50)
                this.sprite.scale.x = Calc.sign(this.sprite.scale.x) * 0.75;
            this.physics.speed.x = 0;
        };
        this.physics.onCollideY = () => {
            if (Math.abs(this.physics.speed.y) > 50)
                this.sprite.scale.y = Calc.sign(this.sprite.scale.y) * 0.75;
            this.physics.speed.y = 0;
        };
        // sprite!
        this.add(this.sprite = new Sprite("player"));
        this.sprite.play("idle");
        this.sprite.origin.x = this.sprite.width / 2;
        this.sprite.origin.y = this.sprite.height;
        // dust
        this.add(this.dust = new ParticleSystem(Game.dust));
        // test coroutine
        this.add(new Coroutine(this.routine));
    }
    update() {
        if (Keys.mapDown("up"))
            this.physics.speed.y -= 240 * Engine.delta;
        else if (Keys.down(Key.down))
            this.physics.speed.y += 240 * Engine.delta;
        else
            this.physics.friction(0, 180);
        if (Keys.mapDown("left")) {
            this.physics.speed.x -= 240 * Engine.delta;
            this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
            if (this.physics.speed.x > 0)
                this.dust.burst(this.x, this.y, 0, 4, 0);
        }
        else if (Keys.mapDown("right")) {
            this.physics.speed.x += 240 * Engine.delta;
            this.sprite.scale.x = Math.abs(this.sprite.scale.x);
            if (this.physics.speed.x < 0)
                this.dust.burst(this.x, this.y, Math.PI, 4, 0);
        }
        else
            this.physics.friction(180, 0);
        this.physics.circularMaxspeed(100);
        // current animation
        if (this.physics.speed.length > 0.1) {
            this.sprite.rate = Calc.clamp(this.physics.speed.length / 100, 0.25, 1.00);
            this.sprite.play("run");
        }
        else {
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
    *routine() {
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
Game.main();
