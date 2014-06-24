﻿/// <reference path="reference.ts" />
module Wallaby {

    export class Vendor extends Phaser.Sprite {

        drill_upgrades: number = 1;
        multiplier: number = 1.5;
        drillCost: number = 100;
        fuelCost: number = 100;
        drillBuyButton: Phaser.Button;  //Upgrades drill
        fuelBuyButton: Phaser.Button; //Upgrades fueltank
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

            this.drillBuyButton = new Phaser.Button(this.game, 585, 275, 'buy');
            this.drillBuyButton.visible = false;
            this.drillBuyButton.fixedToCamera = true;
            this.game.add.existing(this.drillBuyButton);
            this.drillBuyButton.inputEnabled = true;
            this.drillBuyButton.events.onInputDown.add(function () { this.drillButtonClick(player) }, this);

            this.drillIcon = new Phaser.Sprite(this.game,400, 275, 'drillUpgrade');
            this.drillIcon.visible = false;
            this.drillIcon.fixedToCamera = true;
            this.game.add.existing(this.drillIcon);

             this.fuelBuyButton = new Phaser.Button(this.game, 585, 355, 'buy');
            this.fuelBuyButton.visible = false;
            this.fuelBuyButton.fixedToCamera = true;
            this.game.add.existing(this.fuelBuyButton);
            this.fuelBuyButton.inputEnabled = true;
            this.fuelBuyButton.events.onInputDown.add(function () { this.fuelButtonClick(player) }, this);

            this.game.add.existing(this);

        }

        drillButtonClick(player: Wallaby.Player): Function {
            if (player.cash >= this.multiplier * this.drillCost) {
                player.cash -= Math.floor(this.multiplier * this.drillCost);
                this.drillCost  = Math.floor(this.multiplier*this.drillCost);
                this.drill_upgrades += 1;
                player.drillLevel += 1
                }

            return;
        }

         fuelButtonClick(player: Wallaby.Player): Function {
            if (player.cash >= this.multiplier * this.fuelCost) {
                player.cash -= Math.floor(this.multiplier * this.fuelCost);
                this.fuelCost = Math.floor(this.fuelCost*this.multiplier);
                player.fuelTank = Math.floor(player.fuelTank*this.multiplier);
                }

            return;
        }

        isVisible(param: boolean){
            if(param){
                this.shopBackground.visible = true;
                this.fuelBuyButton.visible = true;
                this.drillBuyButton.visible = true;
                this.drillIcon.visible = true;
            }
            else{
                this.shopBackground.visible = false;
                this.fuelBuyButton.visible = false;
                this.drillBuyButton.visible  = false;
                this.drillIcon.visible = false;
            }
        }
    }

}  