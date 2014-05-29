var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Wallaby;
(function (Wallaby) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            //  Load our actual games assets
            this.load.image('player', '/assets/player.png');
            this.load.image('grass', '/assets/grass.png');
            this.load.image('dirt', '/assets/dirt.png');

            this.load.image('leveltiles', 'assets/spritesheet.png');
            this.load.tilemap('level', 'assets/spritesheet.json', null, Phaser.Tilemap.TILED_JSON);
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
//# sourceMappingURL=Preloader.js.map
