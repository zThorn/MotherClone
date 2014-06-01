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
        fuelText: Phaser.Text;
        scoreText: Phaser.Text;
        txt: Phaser.Group;

        create() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 500;

           

            this.map = this.add.tilemap('level');
            this.map.addTilesetImage('Tiles');

            this.map.setCollisionBetween(1, 3);
            this.map.setCollisionBetween(5, 8);
            this.ground = this.map.createLayer('Ground');
            this.ground.resizeWorld();   

            this.player = new Player(this.game, 32, 32);
            this.physics.enable(this.player);
            this.player.body.bounce.y = 0.2;
            this.player.body.linearDamping = 1;
            this.player.body.collideWorldBounds = true;
            this.camera.follow(this.player);

            this.game.input.onDown.add(this.removeTile, this);

            //Fuel Text
            this.txt = this.game.add.group();
            this.fuelText = this.game.add.text(this.game.world.centerX+270, 0, 'Fuel: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 },this.txt);
            this.txt.bringToTop(this.fuelText);

            //Score Text
            this.scoreText = this.game.add.text(this.game.world.centerX + 297, 50, 'Score: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            this.txt.fixedToCamera = true;
        }

        removeTile() {
            var x = Math.floor(this.player.x/32);
            var y = Math.ceil((this.player.y / 32)+1);
            var tile = this.map.getTile(x, y).index;
            this.player.score = this.player.score + this.getTileValue(tile);

            this.map.putTile(4, Math.floor((this.player.x / 32)), Math.ceil((this.player.y / 32) + 1));
        }

        getTileValue(index: number) {
            var total = 0;

            switch (index) {
                case 1:
                    total = 5;
                    break;
                case 2:
                    total = 25;
                    break;
                case 3:
                    total = 35;
                    break;

                case 4:   
                  break;
                case 5:
                    total = 1;
                    break;
                case 6:
                    total = 10;
                    break;
                case 7:
                    total = 1;
                    break;
                case 8:
                    total = 100;
                    break
            }
            this.displayTotal(total);
            return total;
        }

        displayTotal(total: number) {
       

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
            else if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.restart();
            }
            this.fuelText.setText(this.player.fuel.toString());
            this.txt.bringToTop(this);

            this.scoreText.setText(this.player.score.toString());
            this.txt.bringToTop(this);
        }


        //Resets player 
        restart() {
            this.player.x = 30;
            this.player.y = 30;
            this.player.fuel = 150;
            this.player.score = 0;
        }

    }

} 