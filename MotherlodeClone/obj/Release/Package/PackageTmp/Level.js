var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Wallaby;
(function (Wallaby) {
    var layer;

    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            _super.apply(this, arguments);
            this.numberOfCols = 32;
            this.numberOfRows = 32;
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
            this.physics.enable(this.player);
            this.player.body.bounce.y = 0.2;
            this.player.body.linearDamping = 1;
            this.player.body.collideWorldBounds = true;
            this.camera.follow(this.player);

            this.game.input.onDown.add(this.removeTile, this);

            this.txt = this.game.add.group();
            this.fuelText = this.game.add.text(this.game.world.centerX + 270, 0, 'Fuel: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            this.txt.bringToTop(this.fuelText);

            this.scoreText = this.game.add.text(this.game.world.centerX + 297, 50, 'Score: ', { fontSize: '32px', fill: 'white', stroke: "black", strokeThickness: 5 }, this.txt);
            this.txt.fixedToCamera = true;
        };

        Level.prototype.removeTile = function () {
            var x = Math.floor(this.player.x / 32);
            var y = Math.ceil((this.player.y / 32) + 1);
            var tile = this.map.getTile(x, y).index;
            this.player.score = this.player.score + this.getTileValue(tile);

            this.map.putTile(4, Math.floor((this.player.x / 32)), Math.ceil((this.player.y / 32) + 1));
        };

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

        Level.prototype.displayTotal = function (total) {
            var i = this.game.add.text(this.player.x - 10, this.player.y - 35, "+" + total.toString(), { fontSize: '12px', fill: 'white', stroke: "black", strokeThickness: 5 });
            i.alpha = 1;
            this.game.add.tween(i).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.game.add.tween(i).to({ x: this.player.x - 200, y: this.player.y - 250 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        };

        Level.prototype.update = function () {
            this.game.physics.arcade.collide(this.player, this.ground);
            this.player.body.velocity.x = 0;

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.player.fuel > 0) {
                this.player.body.velocity.y = -250;
                this.player.fuel--;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.player.body.velocity.x = -150;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.player.body.velocity.x = 150;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.restart();
            }
            this.fuelText.setText(this.player.fuel.toString());
            this.txt.bringToTop(this);

            this.scoreText.setText(this.player.score.toString());
            this.txt.bringToTop(this);
        };

        Level.prototype.restart = function () {
            this.player.x = 30;
            this.player.y = 30;
            this.player.fuel = 150;
            this.player.score = 0;
        };
        return Level;
    })(Phaser.State);
    Wallaby.Level = Level;
})(Wallaby || (Wallaby = {}));
