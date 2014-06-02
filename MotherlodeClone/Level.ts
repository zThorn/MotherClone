﻿module Wallaby {

    export class Level extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        player: Wallaby.Player;
        map: Phaser.Tilemap;
        sky: Phaser.TilemapLayer;
        ground: Phaser.TilemapLayer;
        fuelText: Phaser.Text;
        scoreText: Phaser.Text;
        fpsText: Phaser.Text;
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
            this.player.body.tilePadding.x = 50;
            this.player.body.tilePadding.y = 50;
            this.player.body.maxVelocity.y = 250;
            this.game.input.onDown.add(this.removeTile, this);

            //Fuel Text
            this.txt = this.game.add.group();
            this.fuelText = this.game.add.text(this.game.world.centerX+190, 0, 'Fuel: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 },this.txt);
            this.txt.bringToTop(this.fuelText);

            //Score Text
            this.scoreText = this.game.add.text(this.game.world.centerX + 190, 50, 'Cash: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            this.txt.fixedToCamera = true;

            //FPS
            this.fpsText = this.game.add.text(this.game.world.centerX + 190, 100, 'FPS: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            this.game.time.advancedTiming = true;

            this.populateWorld();
        }

        removeTile() {
            var x = Math.floor(this.player.x/32);
            var y = Math.ceil((this.player.y / 32)+1);
            var tile = this.map.getTile(x, y).index;

            if (this.game.input.mousePointer.timeDown - this.game.input.mousePointer.timeUp >= 100 && this.player.fuel>0) {
                this.player.score = this.player.score + this.getTileValue(tile);
                //this.player.fuel -= 5;
                this.map.putTile(4, x, y);
            }
        }

        populateWorld() {
            var chance = 0;
            for (var i = 0; i < 30; i++) {
                for (var j = 8; j < 100; j++) {
                    chance = Math.random();

                    if (chance >= .98 && j >= 50)
                        this.map.putTile(8, i, j);
                    else if (chance >= .94 && j >= 30)
                        this.map.putTile(3, i, j);
                    else if (chance >= .9 && j >= 25)
                        this.map.putTile(2, i, j);
                    else if (chance >= .9)
                        this.map.putTile(6, i, j)
                    else if (chance > .8) 
                        this.map.putTile(1, i, j);
                }
            }
        }

        //Gets the amount that each tile should be worth
        getTileValue(index: number) {
            var total = 0;

            switch (index) {
                case 1: //Tin
                    total = 5;
                    break;
                case 2: //Gold
                    total = 25;
                    break;
                case 3: //Emerald
                    total = 35;
                    break;
                case 4:   //Sky tile
                  break;
                case 5:   //Dirt
                    total = 1;
                    break;
                case 6:   //Iron
                    total = 10;
                    break;
                case 7: //Grass
                    total = 1;
                    break;
                case 8: //Diamond
                    total = 100;
                    break
            }
            if(total != 0)  //Sky
                this.displayTotal(total);
            return total;
        }

        //Handles neat tweening effect when blocks get destroyed
        displayTotal(total: number) {
            var i = this.game.add.text(this.player.x-10 , this.player.y - 35,"+"+total.toString(), { fontSize: '12px', fill: 'white', stroke: "black", strokeThickness: 5 });
            i.alpha = 1;
            this.game.add.tween(i).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.game.add.tween(i).to({ x: this.player.x - 200, y: this.player.y - 250 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);

        }

        update() {

            this.game.physics.arcade.collide(this.player, this.ground);
            this.player.body.velocity.x = 0;

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.player.fuel>0) {
                this.player.body.velocity.y = -250;
                this.player.fuel--;
            }


            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.player.body.velocity.x = -150;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D)){
                this.player.body.velocity.x = 150;

            }
            else if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.restart();
            }
            this.fuelText.setText("Fuel: "+this.player.fuel.toString());
            this.txt.bringToTop(this);

            this.scoreText.setText("Cash: $"+this.player.score.toString());
            this.txt.bringToTop(this);

            this.fpsText.setText("FPS: "+this.game.time.fps.toString());
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