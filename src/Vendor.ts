/// <reference path="reference.ts" />
module Wallaby {

    export class Vendor extends Phaser.Sprite {

        drill_upgrades: number = 1;
        multiplier: number = 1.5;
        initial_cost: number = 100;
        buyButton: Phaser.Button;
        shopBackground: Phaser.Sprite;
        drillIcon: Phaser.Sprite;

        constructor(game: Phaser.Game, player: Wallaby.Player, x: number, y: number) {

            super(game, x, y, 'vendor', 0);

            this.anchor.setTo(0.5, 0);
                        //Shop Assets
            this.shopBackground = new Phaser.Sprite(this.game, 250, 250, 'shopbackground');
            this.shopBackground.visible = false;
            this.shopBackground.fixedToCamera = true;
            this.game.add.existing(this.shopBackground);

            this.buyButton = new Phaser.Button(this.game, 585, 275, 'buy');
            this.buyButton.visible = false;
            this.buyButton.fixedToCamera = true;
            this.game.add.existing(this.buyButton);
            this.buyButton.inputEnabled = true;
            this.buyButton.events.onInputDown.add(function () { this.vendor.buyButtonClick(player) }, this);

            this.drillIcon = new Phaser.Sprite(this.game,400, 275, 'drillUpgrade');
            this.drillIcon.visible = false;
            this.drillIcon.fixedToCamera = true;
            this.game.add.existing(this.drillIcon);

            this.game.add.existing(this);

        }

        buyButtonClick(player: Wallaby.Player): Function {
            if (player.cash >= this.multiplier * this.initial_cost) {
                player.cash -= this.multiplier * this.initial_cost;
                this.drill_upgrades += 1;
                player.drillLevel += 1
                }

            return;
        }

        isVisible(param: boolean){
            if(param){
                this.shopBackground.visible = true;
                this.buyButton.visible = true;
                this.drillIcon.visible = true;
            }
            else{
                this.shopBackground.visible = false;
                this.buyButton.visible = false;
                this.drillIcon.visible = false;
            }
        }
    }

}  