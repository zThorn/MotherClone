module Wallaby {

    export class Player extends Phaser.Sprite {

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'player', 0);

            this.anchor.setTo(0.5, 0);

            game.add.existing(this);

        }

       

        

    }

}