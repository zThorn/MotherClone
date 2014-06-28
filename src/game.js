var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="reference.ts" />
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
        GasStation.prototype.fill = function (player) {
            player.fuel += 1;
            player.cash -= 1;
        };
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

            this.player = new Wallaby.Player(this.game, 32, 32);
            this.gasStation = new Wallaby.GasStation(this.game, 128, 160);
            this.vendor = new Wallaby.Vendor(this.game, this.player, 256, 192);
            this.player.bringToTop();

            //Fuel Text
            this.txt = this.game.add.group();
            this.txt.fixedToCamera = true;
            this.fuelText = this.game.add.text(this.game.world.centerX - 475, 0, 'Fuel: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);

            //Cash Text
            this.scoreText = this.game.add.text(this.game.world.centerX - 475, 50, 'Cash: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);

            //FPS
            this.fpsText = this.game.add.text(this.game.world.centerX - 475, 100, 'FPS: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            this.game.time.advancedTiming = true;

            //Drill Level
            this.drillText = this.game.add.text(this.game.world.centerX - 475, 150, 'Drill: ', { fontSize: '32px', fill: 'white', stroke: 'black', strokeThickness: 5 }, this.txt);

            //Will only be drawn if the game is paused
            this.pauseText = this.game.add.text(this.game.world.centerX, 150, '', { fontSize: '64px', fill: 'red' }, this.txt);

            this.camera.follow(this.player);
            this.populateWorld();
        };

        Level.prototype.update = function () {
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
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.E) && this.gasStation.overlap(this.player) && this.player.cash >= 5 && this.player.fuel < this.player.fuelTank) {
                this.gasStation.fill(this.player);
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.E) && this.vendor.overlap(this.player)) {
                this.vendor.isVisible(true);
            } else if (this.vendor.x + 100 < this.player.x || this.vendor.x - 100 > this.player.x || this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.vendor.isVisible(false);
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.pauseText.text = 'Paused';
                this.player.pause = true;
                this.game.physics.arcade.gravity.y = 0;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.P)) {
                this.pauseText.text = '';
                this.player.pause = false;
                this.game.physics.arcade.gravity.y = 500;
            }

            this.fuelText.setText("Fuel: " + Math.floor(this.player.fuel).toString() + " / " + this.player.fuelTank.toString());
            this.scoreText.setText("Cash: $" + this.player.cash.toString());
            this.fpsText.setText("FPS: " + this.game.time.fps.toString());

            this.drillText.setText("Drill: " + this.player.drillLevel.toString());
        };

        //This is the primary method to add in a "Blank"(Currently sky) tile at a
        //location located directly below the player
        Level.prototype.removeTile = function (x, y) {
            x = Math.floor(x / 32);
            y = Math.floor(y / 32);

            var tileIndex = this.map.getTile(x, y).index;
            this.tile = this.map.getTile(x, y);

            if (this.player.fuel > 0 && (this.tile.index != 9 && this.tile.index != 4) && ((32 <= this.player.x - x * 32) || (32 >= x * 32 - this.player.x)) && ((32 >= this.player.y - y * 32) || (32 <= y * 32 - this.player.y))) {
                console.log(this.tile.index);
                this.player.cash = this.player.cash + this.getTileValue(tileIndex);
                this.player.fuel -= 2;
                this.map.putTile(9, x, y);
            }
        };

        Level.prototype.populateWorld = function () {
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
                        this.map.putTile(6, i, j);
else if (chance > .8)
                        this.map.putTile(1, i, j);
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
            this.fuel = 50;
            this.fuelTank = 50;
            this.score = 0;
            this.cash = 0;
            this.drillLevel = 10;
            this.pause = false;

            this.anchor.setTo(0.5, 0);

            game.physics.enable(this);
            this.body.linearDamping = 1;
            this.body.collideWorldBounds = true;
            this.body.tilePadding.x = 50;
            this.body.tilePadding.y = 50;
            this.body.maxVelocity.y = 250;
            this.game.add.existing(this);
        }
        Player.prototype.update = function () {
            if (!this.pause) {
                this.body.maxVelocity.y = 250;
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.fuel > 1) {
                    this.body.velocity.y = -250;
                    this.fuel -= .1;
                }
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                    this.body.velocity.x = -150;
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                    this.body.velocity.x = 150;
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.TILDE)) {
                    this.restart();
                }
            }

            if (this.fuel < 1)
                this.restart();

            if (this.pause) {
                this.body.maxVelocity.y = 0;
                this.body.bounce = 0;
            }
        };

        //Just a debug method
        Player.prototype.restart = function () {
            this.x = 30;
            this.y = 30;
            this.fuel = this.fuelTank;
            this.cash = 0;
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
            this.game.load.image('player', 'assets/player.png');
            this.game.load.image('grass', 'assets/grass.png');
            this.game.load.image('dirt', 'assets/dirt.png');
            this.game.load.image('sky', 'assets/sky.png');
            this.game.load.image('blank', 'assets/blank.png');
            this.game.load.image('drillUpgrade', 'assets/drill_upgrade_icon.png');

            this.game.load.image('vendor', 'assets/vendor.png');
            this.game.load.image('gasStation', 'assets/gas_station0.png');
            this.game.load.tilemap('level', 'assets/spritesheet.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('Tiles', 'assets/Tiles.png');
            this.game.load.image('shopbackground', 'assets/sbg.png');
            this.game.load.image('buy', 'assets/buybutton.png');
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
/// <reference path="reference.ts" />
var Wallaby;
(function (Wallaby) {
    var Vendor = (function (_super) {
        __extends(Vendor, _super);
        function Vendor(game, player, x, y) {
            _super.call(this, game, x, y, 'vendor', 0);
            this.drill_upgrades = 1;
            this.multiplier = 1.5;
            this.drillCost = 100;
            this.fuelCost = 100;
            this.subAmount = 0;

            this.anchor.setTo(0.5, 0);

            //Shop Assets
            this.shopBackground = new Phaser.Sprite(this.game, 250, 250, 'shopbackground');
            this.shopBackground.visible = false;
            this.shopBackground.fixedToCamera = true;
            this.game.add.existing(this.shopBackground);

            this.drillBuyButton = new Phaser.Button(this.game, 585, 275, 'buy');
            this.drillBuyButton.visible = false;
            this.drillBuyButton.fixedToCamera = true;
            this.game.add.existing(this.drillBuyButton);
            this.drillBuyButton.inputEnabled = true;
            this.drillBuyButton.events.onInputDown.add(function () {
                this.drillButtonClick(player);
            }, this);

            this.drillIcon = new Phaser.Sprite(this.game, 400, 275, 'drillUpgrade');
            this.drillIcon.visible = false;
            this.drillIcon.fixedToCamera = true;
            this.game.add.existing(this.drillIcon);

            this.fuelBuyButton = new Phaser.Button(this.game, 585, 355, 'buy');
            this.fuelBuyButton.visible = false;
            this.fuelBuyButton.fixedToCamera = true;
            this.game.add.existing(this.fuelBuyButton);
            this.fuelBuyButton.inputEnabled = true;
            this.fuelBuyButton.events.onInputDown.add(function () {
                this.fuelButtonClick(player);
            }, this);

            this.game.add.existing(this);
        }
        Vendor.prototype.drillButtonClick = function (player) {
            if (player.cash >= this.multiplier * this.drillCost && player.drillLevel >= 3) {
                this.subAmount = Math.floor(this.multiplier * this.drillCost);
                player.cash -= this.subAmount;
                this.drillCost = Math.floor(this.multiplier * this.drillCost);
                this.drill_upgrades += 1;
                player.drillLevel -= 1;
                this.subtractEffect(this.subAmount);
            }

            return;
        };

        Vendor.prototype.fuelButtonClick = function (player) {
            if (player.cash >= this.multiplier * this.fuelCost) {
                this.subAmount = Math.floor(this.multiplier * this.fuelCost);
                player.cash -= this.subAmount;
                this.fuelCost = Math.floor(this.fuelCost * this.multiplier);
                player.fuelTank = Math.floor(player.fuelTank * this.multiplier);
                this.subtractEffect(this.subAmount);
            }

            return;
        };

        Vendor.prototype.isVisible = function (param) {
            if (param) {
                this.shopBackground.visible = true;
                this.fuelBuyButton.visible = true;
                this.drillBuyButton.visible = true;
                this.drillIcon.visible = true;
            } else {
                this.shopBackground.visible = false;
                this.fuelBuyButton.visible = false;
                this.drillBuyButton.visible = false;
                this.drillIcon.visible = false;
            }
        };

        Vendor.prototype.subtractEffect = function (total) {
            var i = this.game.add.text(this.game.world.centerX - 325, 50, "-" + total.toString(), { fontSize: '12px', fill: 'white', stroke: "black", strokeThickness: 5 });
            i.alpha = 1;
            this.game.add.tween(i).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.game.add.tween(i).to({ x: this.game.world.centerX - 305, y: 50 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        };
        return Vendor;
    })(Phaser.Sprite);
    Wallaby.Vendor = Vendor;
})(Wallaby || (Wallaby = {}));
/// <reference path="reference.ts" />
window.onload = function () {
    var game = new Wallaby.Game();
};
//# sourceMappingURL=game.js.map
