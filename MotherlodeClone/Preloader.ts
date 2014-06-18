module Wallaby {

    export class Preloader extends Phaser.State {


        preload() {
           

            this.game.load.image('player', '/assets/player.png');
            this.game.load.image('grass', '/assets/grass.png');
            this.game.load.image('dirt', '/assets/dirt.png');
            this.game.load.image('sky', '/assets/sky.png');
            this.game.load.image('blank', '/assets/blank.png');
            this.game.load.image('drillUpgrade', '/assets/drill_upgrade_icon.png');

            this.game.load.image('vendor', '/assets/vendor.png');
            this.game.load.image('gasStation', '/assets/gas_station0.png');
            this.game.load.tilemap('level', '/assets/spritesheet.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('Tiles', '/assets/Tiles.png');
            this.game.load.image('shopbackground', '/assets/sbg.png');
            this.game.load.image('buy', '/assets/buybutton.png');

        }

        create() {

            this.startMainMenu();
        }

        startMainMenu() {

            this.game.state.start('MainMenu', true, false);

        }

    }

}