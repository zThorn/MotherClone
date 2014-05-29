module Wallaby {
    var layer;
    
    export class Level extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        player: Wallaby.Player;
        numberOfCols: number = 32;
        numberOfRows: number = 32;
        map: Phaser.Tilemap;

        create() {


            this.player = new Player(this.game, 32, 32);

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.map = this.add.tilemap('level');
            this.map.addTilesetImage('Tiles');

            layer = this.map.createLayer('Ground');

            layer.resizeWorld();

            this.player = new Player(this.game, 32, 32);

            this.physics.enable(this.player);
            this.camera.follow(this.player);
            this.generateMap();
        }

        update() {

            this.game.physics.arcade.collide(this.player, layer);
            this.player.body.velocity.x = 0;

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {

                this.player.body.velocity.x = -150;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

                this.player.body.velocity.x = 150;

            }
        }

        generateMap() {

       this.map.fill(3, 0, 0, 32, 8);   //Should fill sky tiles...
   

        }
    }

} 