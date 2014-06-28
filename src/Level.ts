module Wallaby {

    export class Level extends Phaser.State {

        isPaused: boolean;

        player: Wallaby.Player;
        gasStation: Wallaby.GasStation;
        vendor: Wallaby.Vendor;

        tile: Phaser.Tile;
        map: Phaser.Tilemap;
        ground: Phaser.TilemapLayer;

        txt: Phaser.Group;  //Contains all text denoted below.

        fuelText: Phaser.Text;
        scoreText: Phaser.Text;
        drillText: Phaser.Text;
        fpsText: Phaser.Text;
        pauseText: Phaser.Text;
      
        timeCheck: number;  //Used to determine how long the mouse should be pressed
        
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
            this.gasStation = new GasStation(this.game, 128, 160);
            this.vendor = new Vendor(this.game,this.player, 256, 192);
            this.player.bringToTop();

            //Fuel Text
            this.txt = this.game.add.group();
            this.txt.fixedToCamera = true;
            this.fuelText = this.game.add.text(this.game.world.centerX - 475, 0, 'Fuel: ',
                            { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            //Cash Text
            this.scoreText = this.game.add.text(this.game.world.centerX - 475, 50, 'Cash: ',
                            { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            //FPS
            this.fpsText = this.game.add.text(this.game.world.centerX - 475, 100, 'FPS: ',
                            { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            this.game.time.advancedTiming = true;

            //Drill Level
            this.drillText = this.game.add.text(this.game.world.centerX - 475, 150, 'Drill: ',
                            { fontSize: '32px', fill: 'white', stroke: 'black', strokeThickness: 5 }, this.txt);
            //Will only be drawn if the game is paused
            this.pauseText = this.game.add.text(this.game.world.centerX,150,'',
                            { fontSize:'64px', fill:'red'},this.txt);

            this.camera.follow(this.player);
            this.populateWorld();
        }

        update() {
            var iterations = 1;

            this.game.physics.arcade.collide(this.player, this.ground);
            this.player.body.velocity.x = 0;
            this.player.update();    

            if (this.game.input.mousePointer.isDown && this.game.input.mousePointer.duration > 100 * this.player.drillLevel) {
                if (this.game.input.mousePointer.duration > 100 * this.player.drillLevel && this.game.input.mousePointer.duration < 100 * this.player.drillLevel + 50) {
                    this.removeTile(this.game.input.mousePointer.worldX, this.game.input.mousePointer.worldY);
                    this.timeCheck = this.game.time.time;
                } else if (this.game.time.time - this.timeCheck > 100 * this.player.drillLevel) {
                    this.removeTile(this.game.input.mousePointer.worldX, this.game.input.mousePointer.worldY);
                    this.timeCheck = this.game.time.time;
                }
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.E) && this.gasStation.overlap(this.player) &&
                 this.player.cash >= 5 && this.player.fuel< this.player.fuelTank) {
                         this.gasStation.fill(this.player);

            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.E) && this.vendor.overlap(this.player)) {
                this.vendor.isVisible(true);
              
            } else if (this.vendor.x + 100 < this.player.x || this.vendor.x - 100 > this.player.x ||
                       this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.vendor.isVisible(false);
            } 
             if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)){
                    this.pauseText.text = 'Paused';
                    this.player.pause = true;
                    this.game.physics.arcade.gravity.y = 0;
            }

            if(this.game.input.keyboard.isDown(Phaser.Keyboard.P)){
                this.pauseText.text = '';
                this.player.pause = false;
                 this.game.physics.arcade.gravity.y = 500;
            }

            this.fuelText.setText("Fuel: "+Math.floor(this.player.fuel).toString()+" / "+this.player.fuelTank.toString());
            this.scoreText.setText("Cash: $"+this.player.cash.toString());
            this.fpsText.setText("FPS: " + this.game.time.fps.toString());

            this.drillText.setText("Drill: " + this.player.drillLevel.toString());
        }

        //This is the primary method to add in a "Blank"(Currently sky) tile at a 
        //location located directly below the player
        removeTile(x: number, y:number) {
            x = Math.floor(x/32);
            y = Math.floor(y/32);

            var tileIndex = this.map.getTile(x,y).index;
            this.tile = this.map.getTile(x,y);

            if (this.player.fuel>0 &&(this.tile.index != 9 && this.tile.index != 4) && ((32<= this.player.x-x*32) || (32>=x*32-this.player.x))&& 
               ((32>= this.player.y-y*32) || (32<=y*32-this.player.y))){
                
                console.log(this.tile.index);
                this.player.cash = this.player.cash + this.getTileValue(tileIndex);
                this.player.fuel-=2;
                this.map.putTile(9,x,y);
                
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
            var i = this.game.add.text(this.player.x-10 , this.player.y - 35,"+"+total.toString(), 
                        { fontSize: '12px', fill: 'white', stroke: "black", strokeThickness: 5 });
            i.alpha = 1;
            this.game.add.tween(i).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.game.add.tween(i).to({ x: this.player.x - 200, y: this.player.y - 250 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        }
    }
} 