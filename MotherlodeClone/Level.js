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
            this.player = new Wallaby.Player(this.game, 32, 32);

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.map = this.add.tilemap('level');
            this.map.addTilesetImage('Tiles', 'levelTiles');

            layer = this.map.createLayer('Ground');

            layer.resizeWorld();

            this.player = new Wallaby.Player(this.game, 32, 32);

            this.physics.enable(this.player);
            this.camera.follow(this.player);
            this.generateMap();
        };

        Level.prototype.update = function () {
            this.game.physics.arcade.collide(this.player, layer);
            this.player.body.velocity.x = 0;

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.player.body.velocity.x = -150;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.player.body.velocity.x = 150;
            }
        };

        Level.prototype.generateMap = function () {
            this.map.fill(3, 0, 0, 32, 8); //Should fill sky tiles...
        };
        return Level;
    })(Phaser.State);
    Wallaby.Level = Level;
})(Wallaby || (Wallaby = {}));
//# sourceMappingURL=Level.js.map
