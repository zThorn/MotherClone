module Wallaby {

    export class Player extends Phaser.Sprite {

        fuel: number = 250;
        fuelTank: number = 250;
        score: number = 0;
        cash: number = 0;
        drillLevel: number = 2;
        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'player', 0);

            this.anchor.setTo(0.5, 0);
  
            game.physics.enable(this);
            this.body.bounce.y = 0.2;
            this.body.linearDamping = 1;
            this.body.collideWorldBounds = true;
            this.body.tilePadding.x = 50;
            this.body.tilePadding.y = 50;
            this.body.maxVelocity.y = 250;
            this.game.add.existing(this);

        }

        update() {
           
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.fuel > 0) {
                this.body.velocity.y = -250;
                this.fuel--;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.body.velocity.x = -150;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
                || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.body.velocity.x = 150;

            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.TILDE)) {
                this.restart();
            }

        }
       
       //Just a debug method
        restart() {
            this.x = 30;
            this.y = 30;
            this.fuel = 150;
            this.cash = 1000;
        }
        

    }

}