module Wallaby {
    export class MainMenu extends Phaser.State {


        create() {


            this.startGame();

        }

        fadeOut() {

        }

        startGame() {

            this.game.state.start('Level', true, false);


        }




    }
}