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
                    .add("run", 10, atlas.list("player ", ["0", "1", "2", "3"]), true);
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
        this.physics.onCollideX = () => { this.physics.speed.x = 0; };
        this.physics.onCollideY = () => { this.physics.speed.y = 0; };
        // sprite!
        this.add(this.sprite = new Sprite("player"));
        this.sprite.play("idle");
        this.sprite.origin.x = this.sprite.width / 2;
        this.sprite.origin.y = this.sprite.height;
    }
    update() {
        if (Keys.mapDown("up"))
            this.physics.speed.y -= 240 * Engine.delta;
        else if (Keys.down(Key.down))
            this.physics.speed.y += 240 * Engine.delta;
        else
            this.physics.friction(0, 180);
        if (Keys.mapDown("left"))
            this.physics.speed.x -= 240 * Engine.delta;
        else if (Keys.mapDown("right"))
            this.physics.speed.x += 240 * Engine.delta;
        else
            this.physics.friction(180, 0);
        this.physics.circularMaxspeed(100);
        // current animation
        if (this.physics.speed.length > 0.1)
            this.sprite.play("run");
        else
            this.sprite.play("idle");
        // facing
        if (this.physics.speed.x != 0)
            this.sprite.scale.x = (this.physics.speed.x < 0 ? -1 : 1);
        super.update();
    }
}
Game.main();
