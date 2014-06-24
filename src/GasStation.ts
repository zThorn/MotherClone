module Wallaby {

    export class GasStation extends Phaser.Sprite {

        fuel_fill_rate: number = 5;
        score: number = 0;
        cash: number = 0;
        drillLevel: number = 2;

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'gasStation', 0);

            this.anchor.setTo(0.5, 0);

            this.game.add.existing(this);

        }

        fill(player: Wallaby.Player){
                player.fuel += 5;
                player.cash -= 2;
        }
    }
} 