module Wallaby {
    var layer;
    
    export class Level extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        player: Wallaby.Player;
        numberOfCols: number = 32;
        numberOfRows: number = 32;
        map: Phaser.Tilemap;
        sky: Phaser.TilemapLayer;
        ground: Phaser.TilemapLayer;

        create() {


            this.player = new Player(this.game, 32, 32);

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.map = this.add.tilemap('level');
            this.map.addTilesetImage('Tiles');

            this.map.setCollisionBetween(2, 4);

            this.ground = this.map.createLayer('Ground');

            this.ground.resizeWorld();

            this.player = new Player(this.game, 32, 32);
            

            this.physics.enable(this.player);
            this.game.physics.arcade.gravity.y = 250;

            this.player.body.bounce.y = 0.2;
            this.player.body.linearDamping = 1;
            this.player.body.collideWorldBounds = true;

            this.camera.follow(this.player);

            this.game.input.onDown.add(this.removeTile, this);
            
        }

        removeTile() {
            var x = this.player.x;
            var y = this.player.y;


            this.map.putTile(1, Math.floor((this.player.x / 32)), Math.ceil((this.player.y / 32) + 1));
        }

        update() {

            this.game.physics.arcade.collide(this.player, this.ground);
            this.player.body.velocity.x = 0;

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.player.fuel>0) {
                this.player.body.velocity.y = -250;
                this.player.fuel--;
            }
               

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {

                this.player.body.velocity.x = -150;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

                this.player.body.velocity.x = 150;

            }
        }

    }

} 