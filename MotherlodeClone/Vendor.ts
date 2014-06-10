module Wallaby {

    export class Vendor extends Phaser.Sprite {

        drill_upgrades: number = 1;
        multiplier: number = 1.5;
        initial_cost: number = 100;
        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'vendor', 0);

            this.anchor.setTo(0.5, 0);

            this.game.add.existing(this);

        }





    }

}  