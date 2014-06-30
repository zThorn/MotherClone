module Wallaby {

    export class Player extends Phaser.Sprite {

        fuel: number = 50;
        fuelTank: number = 50;
        score: number = 0;
        cash: number = 0;
        drillLevel: number = 10;
        pause: boolean = false;
        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'player', 0);

            this.anchor.setTo(0.5, 0);
  
            game.physics.enable(this);
            this.body.linearDamping = 1;
            this.body.collideWorldBounds = true;
            this.body.tilePadding.x = 50;
            this.body.tilePadding.y = 50;
            this.body.maxVelocity.y = 250;
            this.game.add.existing(this);

        }

        update() {
           if(!this.pause){
                this.body.maxVelocity.y = 250;
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.fuel > 1) {
                    this.body.velocity.y = -250;
                    this.fuel-= .1;
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

            if(this.fuel < 1)
                this.restart();

            if(this.pause){
                this.body.maxVelocity.y = 0;
            }
        }
       
       //Just a debug method
        restart() {
            this.x = 30;
            this.y = 30;
            this.fuel = this.fuelTank;
            this.cash = 0;
        }
        

    }

}