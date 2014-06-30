module Wallaby {

    export class GasStation extends Phaser.Sprite {

        fuel_fill_rate: number = 5;
        score: number = 0;
        cash: number = 0;
        drillLevel: number = 2;
        eHover: Phaser.Sprite;
        player: Wallaby.Player;

        constructor(game: Phaser.Game, x: number, y: number, player: Wallaby.Player) {

            super(game, x, y, 'gasStation', 0);

            this.anchor.setTo(0.5, 0);

            this.game.add.existing(this);

            this.eHover = new Phaser.Sprite(game, this.x+8, this.y-32, 'e');
            this.game.add.existing(this.eHover);
            this.eHover.visible = false;

            this.player = player;

        }
        update(){
                if(this.overlap(this.player)){
                    this.eHover.visible = true;
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.E) && this.player.cash >= 5 && this.player.fuel< this.player.fuelTank) {
                                 this.fill(this.player);
                             }
             } 

               if(!this.overlap(this.player))
                this.eHover.visible = false;
        }

        fill(player: Wallaby.Player){
                player.fuel += 1;
                player.cash -= 1;
        }
    }
} 