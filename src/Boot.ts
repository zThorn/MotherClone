/// <reference path="reference.ts" />
module Wallaby {

    export class Boot extends Phaser.State {

        preload() {
            //this.load.image('preloadBar', 'assets/loader.png');
        }

        create() {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {

                this.scale.pageAlignHorizontally = true;

            }

            else {
                //Mobile specific settings 
            }

            this.game.state.start('Preloader', true, false);

        }






    }

}