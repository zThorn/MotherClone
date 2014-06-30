/// <reference path="reference.ts" />
module Wallaby {

    export class Vendor extends Phaser.Sprite {

        drill_upgrades: number = 1;
        multiplier: number = 1.5;
        drillCost: number = 100;
        fuelCost: number = 100;
        drillBuyButton: Phaser.Button;  //Upgrades drill
        fuelBuyButton: Phaser.Button; //Upgrades fueltank
        shopBackground: Phaser.Sprite;
        eHover: Phaser.Sprite;
        drillIcon: Phaser.Sprite;
        subAmount: number = 0;
        player: Wallaby.Player;

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

            this.eHover = new Phaser.Sprite(this.game, this.x-8, this.y-32, 'e');
            this.game.add.existing(this.eHover);
            this.eHover.visible = false;
            this.eHover.alpha = 0;
            this.player = player;

            this.game.add.existing(this);

        }

        update(){
             if ( this.overlap(this.player)){
                this.eHover.visible = true;
                //this.game.add.tween(this.eHover).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);
                  if(this.game.input.keyboard.isDown(Phaser.Keyboard.E)) {
                       this.isVisible(true);
                  } 
               }else if (this.x + 100 < this.player.x || this.x - 100 > this.player.x ||
                       this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.isVisible(false);
            } 

             if(!this.overlap(this.player))
                this.eHover.visible = false;
        }

        drillButtonClick(player: Wallaby.Player): Function {
            if (player.cash >= this.multiplier * this.drillCost && player.drillLevel>=3) {
                this.subAmount = Math.floor(this.multiplier * this.drillCost);
                player.cash -= this.subAmount;
                this.drillCost  = Math.floor(this.multiplier*this.drillCost);
                this.drill_upgrades += 1;
                player.drillLevel -= 1
                this.subtractEffect(this.subAmount);
                }

            return;
        }

         fuelButtonClick(player: Wallaby.Player): Function {
            if (player.cash >= this.multiplier * this.fuelCost) {
                this.subAmount = Math.floor(this.multiplier * this.fuelCost);
                player.cash -= this.subAmount;
                this.fuelCost = Math.floor(this.fuelCost*this.multiplier);
                player.fuelTank = Math.floor(player.fuelTank*this.multiplier);
                this.subtractEffect(this.subAmount);
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

        subtractEffect(total: number){
            var i = this.game.add.text(this.game.world.centerX - 325, 50,"-"+total.toString(), { fontSize: '12px', fill: 'white', stroke: "black", strokeThickness: 5 });
            i.alpha = 1;
            this.game.add.tween(i).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.game.add.tween(i).to({ x: this.game.world.centerX - 305, y: 50 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        }


    }

}  