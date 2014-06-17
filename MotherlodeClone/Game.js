window.onload = function () {
    var game = new Wallaby.Game();
};
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Wallaby;
(function (Wallaby) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            //this.load.image('preloadBar', 'assets/loader.png');
        };

        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                this.scale.pageAlignHorizontally = true;
            } else {
                //Mobile specific settings
            }

            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    Wallaby.Boot = Boot;
})(Wallaby || (Wallaby = {}));
var Wallaby;
(function (Wallaby) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 600, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Wallaby.Boot, false);
            this.state.add('Preloader', Wallaby.Preloader, false);
            this.state.add('MainMenu', Wallaby.MainMenu, false);
            this.state.add('Level', Wallaby.Level, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Wallaby.Game = Game;
})(Wallaby || (Wallaby = {}));
var Wallaby;
(function (Wallaby) {
    var GasStation = (function (_super) {
        __extends(GasStation, _super);
        function GasStation(game, x, y) {
            _super.call(this, game, x, y, 'gasStation', 0);
            this.fuel_fill_rate = 5;
            this.score = 0;
            this.cash = 0;
            this.drillLevel = 2;

            this.anchor.setTo(0.5, 0);

            this.game.add.existing(this);
        }
        return GasStation;
    })(Phaser.Sprite);
    Wallaby.GasStation = GasStation;
})(Wallaby || (Wallaby = {}));
var Wallaby;
(function (Wallaby) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            _super.apply(this, arguments);
        }
        Level.prototype.create = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 500;

            this.map = this.add.tilemap('level');
            this.map.addTilesetImage('Tiles');

            this.map.setCollisionBetween(1, 3);
            this.map.setCollisionBetween(5, 8);

            this.ground = this.map.createLayer('Ground');
            this.ground.resizeWorld();

            this.gasStation = new Wallaby.GasStation(this.game, 128, 160);
            this.vendor = new Wallaby.Vendor(this.game, 256, 192);
            this.player = new Wallaby.Player(this.game, 32, 32);

            this.physics.enable(this.player);
            this.player.body.bounce.y = 0.2;
            this.player.body.linearDamping = 1;
            this.player.body.collideWorldBounds = true;
            this.player.body.tilePadding.x = 50;
            this.player.body.tilePadding.y = 50;
            this.player.body.maxVelocity.y = 250;

            this.camera.follow(this.player);

            //Fuel Text
            this.txt = this.game.add.group();
            this.txt.fixedToCamera = true;
            this.fuelText = this.game.add.text(this.game.world.centerX + 190, 0, 'Fuel: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);

            //Score Text
            this.scoreText = this.game.add.text(this.game.world.centerX + 190, 50, 'Cash: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);

            //FPS
            this.fpsText = this.game.add.text(this.game.world.centerX + 190, 100, 'FPS: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            this.game.time.advancedTiming = true;

            //Drill Level
            this.drillText = this.game.add.text(this.game.world.centerX + 180, 150, 'Drill: ', { fontSize: '32px', fill: 'white', stroke: 'black', strokeThickness: 5 }, this.txt);

            this.shopBackground = new Phaser.Sprite(this.game, this.player.x + 100, this.player.y + 100, 'shopbackground');
            this.shopBackground.visible = false;
            this.shopBackground.fixedToCamera = true;
            this.game.add.existing(this.shopBackground);

            this.buyButton = new Phaser.Button(this.game, this.player.x + 130, this.player.y + 130, 'buy');
            this.buyButton.visible = false;
            this.buyButton.fixedToCamera = true;
            this.game.add.existing(this.buyButton);
            this.buyButton.inputEnabled = true;
            this.buyButton.events.onInputDown.add(function () {
                this.vendor.buyButtonClick(this.player);
            }, this);

            this.populateWorld();
        };

        //This is the primary method to add in a "Blank"(Currently sky) tile at a
        //location located directly below the player
        Level.prototype.removeTile = function () {
            var x = Math.floor(this.player.x / 32);
            var y = Math.ceil((this.player.y / 32) + 1);
            var tile = this.map.getTile(x, y).index;

            //Prevents rapid block removal
            if (this.game.input.mousePointer.timeDown - this.game.input.mousePointer.timeUp >= 100 && this.player.fuel > 0) {
                this.player.cash = this.player.cash + this.getTileValue(tile);
                this.player.fuel -= 5;
                this.map.putTile(4, x, y);
            }
        };

        Level.prototype.populateWorld = function () {
            var chance = 0;

            for (var i = 0; i < 30; i++) {
                for (var j = 8; j < 100; j++) {
                    chance = Math.random();

                    if (chance >= .98 && j >= 50)
                        this.map.putTile(8, i, j); //Spawn Diamond
                    else if (chance >= .94 && j >= 30)
                        this.map.putTile(3, i, j); //Spawn "Emerald"
                    else if (chance >= .9 && j >= 25)
                        this.map.putTile(2, i, j); //Spawn Gold
                    else if (chance >= .9)
                        this.map.putTile(6, i, j);
                    else if (chance > .8)
                        this.map.putTile(1, i, j); //Spawn Tin
                }
            }
        };

        //Gets the amount that each tile should be worth(Added to this.player.cash)
        Level.prototype.getTileValue = function (index) {
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
                    break;
            }
            if (total != 0)
                this.displayTotal(total);
            return total;
        };

        //Handles neat tweening effect when blocks get destroyed
        Level.prototype.displayTotal = function (total) {
            var i = this.game.add.text(this.player.x - 10, this.player.y - 35, "+" + total.toString(), { fontSize: '12px', fill: 'white', stroke: "black", strokeThickness: 5 });
            i.alpha = 1;
            this.game.add.tween(i).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.game.add.tween(i).to({ x: this.player.x - 200, y: this.player.y - 250 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        };

        Level.prototype.update = function () {
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
            } else if (this.vendor.x + 100 < this.player.x || this.vendor.x - 100 > this.player.x) {
                this.shopBackground.visible = false;
                this.buyButton.visible = false;
            }
            this.fuelText.setText("Fuel: " + this.player.fuel.toString());

            this.scoreText.setText("Cash: $" + this.player.cash.toString());

            this.fpsText.setText("FPS: " + this.game.time.fps.toString());

            this.drillText.setText("Drill: " + this.player.drillLevel.toString());
        };
        return Level;
    })(Phaser.State);
    Wallaby.Level = Level;
})(Wallaby || (Wallaby = {}));
var Wallaby;
(function (Wallaby) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            this.startGame();
        };

        MainMenu.prototype.fadeOut = function () {
        };

        MainMenu.prototype.startGame = function () {
            this.game.state.start('Level', true, false);
        };
        return MainMenu;
    })(Phaser.State);
    Wallaby.MainMenu = MainMenu;
})(Wallaby || (Wallaby = {}));
var Wallaby;
(function (Wallaby) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'player', 0);
            this.fuel = 500;
            this.score = 0;
            this.cash = 0;
            this.drillLevel = 2;

            this.anchor.setTo(0.5, 0);

            this.game.add.existing(this);
        }
        Player.prototype.update = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.fuel > 0) {
                this.body.velocity.y = -250;
                this.fuel--;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.body.velocity.x = -150;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.body.velocity.x = 150;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.restart();
            }
        };

        Player.prototype.restart = function () {
            this.x = 30;
            this.y = 30;
            this.fuel = 150;
            this.cash = 1000;
        };
        return Player;
    })(Phaser.Sprite);
    Wallaby.Player = Player;
})(Wallaby || (Wallaby = {}));
var Wallaby;
(function (Wallaby) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.game.load.image('player', '/assets/player.png');
            this.game.load.image('grass', '/assets/grass.png');
            this.game.load.image('dirt', '/assets/dirt.png');
            this.game.load.image('sky', '/assets/sky.png');

            this.game.load.image('vendor', '/assets/vendor.png');
            this.game.load.image('gasStation', '/assets/gas_station0.png');
            this.game.load.tilemap('level', '/assets/spritesheet.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('Tiles', '/assets/Tiles.png');
            this.game.load.image('shopbackground', '/assets/sbg.png');
            this.game.load.image('buy', '/assets/buybutton.png');
        };

        Preloader.prototype.create = function () {
            this.startMainMenu();
        };

        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    Wallaby.Preloader = Preloader;
})(Wallaby || (Wallaby = {}));
var Wallaby;
(function (Wallaby) {
    var Vendor = (function (_super) {
        __extends(Vendor, _super);
        function Vendor(game, x, y) {
            _super.call(this, game, x, y, 'vendor', 0);
            this.drill_upgrades = 1;
            this.multiplier = 1.5;
            this.initial_cost = 100;

            this.anchor.setTo(0.5, 0);

            this.game.add.existing(this);
        }
        Vendor.prototype.buyButtonClick = function (player) {
            if (player.cash >= this.multiplier * this.initial_cost) {
                player.cash -= this.multiplier * this.initial_cost;
                this.drill_upgrades += 1;
                player.drillLevel += 1;
            }

            return;
        };
        return Vendor;
    })(Phaser.Sprite);
    Wallaby.Vendor = Vendor;
})(Wallaby || (Wallaby = {}));
