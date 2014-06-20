﻿module Wallaby {

    export class Level extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        player: Wallaby.Player;
        gasStation: Wallaby.GasStation;
        map: Phaser.Tilemap;
        sky: Phaser.TilemapLayer;
        ground: Phaser.TilemapLayer;
        fuelText: Phaser.Text;
        scoreText: Phaser.Text;
        drillText: Phaser.Text;
        fpsText: Phaser.Text;
        txt: Phaser.Group;
        timeCheck: number;
        vendor: Wallaby.Vendor;
        buyButton: Phaser.Button;
        shopBackground: Phaser.Sprite;
        drillIcon: Phaser.Sprite;


        create() {       
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 500;
            this.map = this.add.tilemap('level');
            this.map.addTilesetImage('Tiles');
            this.map.setCollisionBetween(1, 3);
            this.map.setCollisionBetween(5, 8);
            this.ground = this.map.createLayer('Ground');
            this.ground.resizeWorld();   

            this.gasStation = new GasStation(this.game, 128, 160);
            this.vendor = new Vendor(this.game, 256, 192);
            this.player = new Player(this.game, 32, 32);

            //Shop Assets
            this.shopBackground = new Phaser.Sprite(this.game, this.player.x + 100, this.player.y + 100, 'shopbackground');
            this.shopBackground.visible = false;
            this.shopBackground.fixedToCamera = true;
            this.game.add.existing(this.shopBackground);

            this.buyButton = new Phaser.Button(this.game, this.player.x + 410, this.player.y + 130, 'buy');
            this.buyButton.visible = false;
            this.buyButton.fixedToCamera = true;
            this.game.add.existing(this.buyButton);
            this.buyButton.inputEnabled = true;
            this.buyButton.events.onInputDown.add(function () { this.vendor.buyButtonClick(this.player) }, this);

            this.drillIcon = new Phaser.Sprite(this.game, this.player.x + 130, this.player.y + 130, 'drillUpgrade');
            this.drillIcon.visible = false;
            this.drillIcon.fixedToCamera = true;
            this.game.add.existing(this.drillIcon);
            
            
            //Fuel Text
            this.txt = this.game.add.group();
            this.txt.fixedToCamera = true;
            this.fuelText = this.game.add.text(this.game.world.centerX - 475, 0, 'Fuel: ',
                            { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            //Score Text
            this.scoreText = this.game.add.text(this.game.world.centerX - 475, 50, 'Cash: ',
                            { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            //FPS
            this.fpsText = this.game.add.text(this.game.world.centerX - 475, 100, 'FPS: ',
                            { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            this.game.time.advancedTiming = true;

            //Drill Level
            this.drillText = this.game.add.text(this.game.world.centerX - 475, 150, 'Drill: ',
                            { fontSize: '32px', fill: 'white', stroke: 'black', strokeThickness: 5 }, this.txt);
            this.camera.follow(this.player);
            this.populateWorld();
        }

      
        //This is the primary method to add in a "Blank"(Currently sky) tile at a 
        //location located directly below the player
        removeTile() {
            var x = Math.floor(this.player.x/32);
            var y = Math.ceil((this.player.y / 32)+1);
            var tile = this.map.getTile(x, y).index;

            //Prevents rapid block removal
            if (this.game.input.mousePointer.timeDown - this.game.input.mousePointer.timeUp >= 100 && this.player.fuel>0) {
                this.player.cash = this.player.cash + this.getTileValue(tile);
                this.player.fuel -= 5;
                this.map.putTile(4,x,y);
            }
        }


 

        populateWorld() {
            var chance = 0;
            //Generates world 30x100 game tiles.(32x32)
            for (var i = 0; i < 30; i++) {
                for (var j = 8; j < 100; j++) {
                    chance = Math.random();
                    if (chance >= .98 && j >= 50)
                        this.map.putTile(8, i, j);  //Spawn Diamond
                    else if (chance >= .94 && j >= 30)
                        this.map.putTile(3, i, j);  //Spawn Emerald
                    else if (chance >= .9 && j >= 25)
                        this.map.putTile(2, i, j);  //Spawn Gold
                    else if (chance >= .9)
                        this.map.putTile(6, i, j)  //Spawn Iron
                    else if (chance > .8) 
                        this.map.putTile(1, i, j);  //Spawn Tin
                }
            }
        }

        //Gets the amount that each tile should be worth(Added to this.player.cash)
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
            var iterations = 1;

            this.game.physics.arcade.collide(this.player, this.ground);
            this.player.body.velocity.x = 0;
            this.player.update();
            

            if (this.game.input.mousePointer.isDown && this.game.input.mousePointer.duration > 100 * this.player.drillLevel) {
                if (this.game.input.mousePointer.duration > 100 * this.player.drillLevel && this.game.input.mousePointer.duration < 100 * this.player.drillLevel + 50) {
                    this.removeTile();
                    this.timeCheck = this.game.time.time;
                } else if (this.game.time.time - this.timeCheck > 100 * this.player.drillLevel) {
                    this.removeTile();
                    this.timeCheck = this.game.time.time;
                }
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.E) && this.gasStation.overlap(this.player) && this.player.cash >= 5) {
                this.player.fuel += 5;
                this.player.cash -= 2;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.E) && this.vendor.overlap(this.player)) {
                this.shopBackground.visible = true;
                this.buyButton.visible = true;
                this.drillIcon.visible = true;
            } else if (this.vendor.x + 100 < this.player.x || this.vendor.x - 100 > this.player.x ||
                       this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.shopBackground.visible = false;
                this.buyButton.visible = false;
                this.drillIcon.visible = false;
            } 

            this.fuelText.setText("Fuel: "+this.player.fuel.toString());
            this.scoreText.setText("Cash: $"+this.player.cash.toString());
            this.fpsText.setText("FPS: " + this.game.time.fps.toString());

            this.drillText.setText("Drill: " + this.player.drillLevel.toString());
        }
    }
} 