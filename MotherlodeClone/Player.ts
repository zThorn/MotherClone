﻿module Wallaby {

    export class Player extends Phaser.Sprite {

        fuel: number = 2;
        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'player', 0);

            this.anchor.setTo(0.5, 0);

            this.game.add.existing(this);

        }

       

        

    }

}