var __extends=this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)if(t.hasOwnProperty(n))e[n]=t[n];r.prototype=t.prototype;e.prototype=new r};var Wallaby;(function(e){var t=function(t){function n(){t.call(this,800,600,Phaser.AUTO,"content",null);this.state.add("Boot",e.Boot,false);this.state.add("Preloader",e.Preloader,false);this.state.add("MainMenu",e.MainMenu,false);this.state.add("Level",e.Level,false);this.state.start("Boot")}__extends(n,t);return n}(Phaser.Game);e.Game=t})(Wallaby||(Wallaby={}));window.onload=function(){var e=new Wallaby.Game};var __extends=this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)if(t.hasOwnProperty(n))e[n]=t[n];r.prototype=t.prototype;e.prototype=new r};var Wallaby;(function(e){var t=function(e){function t(){e.apply(this,arguments)}__extends(t,e);t.prototype.preload=function(){};t.prototype.create=function(){this.input.maxPointers=1;this.stage.disableVisibilityChange=true;if(this.game.device.desktop){this.scale.pageAlignHorizontally=true}else{}this.game.state.start("Preloader",true,false)};return t}(Phaser.State);e.Boot=t})(Wallaby||(Wallaby={}));var __extends=this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)if(t.hasOwnProperty(n))e[n]=t[n];r.prototype=t.prototype;e.prototype=new r};var Wallaby;(function(e){var t=function(e){function t(){e.apply(this,arguments)}__extends(t,e);t.prototype.create=function(){this.startGame()};t.prototype.fadeOut=function(){};t.prototype.startGame=function(){this.game.state.start("Level",true,false)};return t}(Phaser.State);e.MainMenu=t})(Wallaby||(Wallaby={}));var __extends=this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)if(t.hasOwnProperty(n))e[n]=t[n];r.prototype=t.prototype;e.prototype=new r};var Wallaby;(function(e){var t;var n=function(t){function n(){t.apply(this,arguments);this.numberOfCols=32;this.numberOfRows=32}__extends(n,t);n.prototype.create=function(){this.game.physics.startSystem(Phaser.Physics.ARCADE);this.game.physics.arcade.gravity.y=500;this.map=this.add.tilemap("level");this.map.addTilesetImage("Tiles");this.map.setCollisionBetween(1,3);this.map.setCollisionBetween(5,8);this.ground=this.map.createLayer("Ground");this.ground.resizeWorld();this.player=new e.Player(this.game,32,32);this.physics.enable(this.player);this.player.body.bounce.y=.2;this.player.body.linearDamping=1;this.player.body.collideWorldBounds=true;this.camera.follow(this.player);this.game.input.onDown.add(this.removeTile,this);this.txt=this.game.add.group();this.fuelText=this.game.add.text(this.game.world.centerX+270,0,"Fuel: ",{fontSize:"32px",fill:"white",stroke:"black",strokeThickness:5},this.txt);this.txt.bringToTop(this.fuelText);this.scoreText=this.game.add.text(this.game.world.centerX+297,50,"Score: ",{fontSize:"32px",fill:"white",stroke:"black",strokeThickness:5},this.txt);this.txt.fixedToCamera=true};n.prototype.removeTile=function(){var e=Math.floor(this.player.x/32);var t=Math.ceil(this.player.y/32+1);var n=this.map.getTile(e,t).index;this.player.score=this.player.score+this.getTileValue(n);this.map.putTile(4,Math.floor(this.player.x/32),Math.ceil(this.player.y/32+1))};n.prototype.getTileValue=function(e){var t=0;switch(e){case 1:t=5;break;case 2:t=25;break;case 3:t=35;break;case 4:break;case 5:t=1;break;case 6:t=10;break;case 7:t=1;break;case 8:t=100;break}if(t!=0)this.displayTotal(t);return t};n.prototype.displayTotal=function(e){var t=this.game.add.text(this.player.x-10,this.player.y-35,"+"+e.toString(),{fontSize:"12px",fill:"white",stroke:"black",strokeThickness:5});t.alpha=1;this.game.add.tween(t).to({alpha:0},500,Phaser.Easing.Linear.None,true,0,0,false);this.game.add.tween(t).to({x:this.player.x-200,y:this.player.y-250},1e3,Phaser.Easing.Linear.None,true,0,0,false)};n.prototype.update=function(){this.game.physics.arcade.collide(this.player,this.ground);this.player.body.velocity.x=0;if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)&&this.player.fuel>0){this.player.body.velocity.y=-250;this.player.fuel--}if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){this.player.body.velocity.x=-150}else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){this.player.body.velocity.x=150}else if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)){this.restart()}this.fuelText.setText(this.player.fuel.toString());this.txt.bringToTop(this);this.scoreText.setText(this.player.score.toString());this.txt.bringToTop(this)};n.prototype.restart=function(){this.player.x=30;this.player.y=30;this.player.fuel=150;this.player.score=0};return n}(Phaser.State);e.Level=n})(Wallaby||(Wallaby={}));var __extends=this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)if(t.hasOwnProperty(n))e[n]=t[n];r.prototype=t.prototype;e.prototype=new r};var Wallaby;(function(e){var t=function(e){function t(t,n,r){e.call(this,t,n,r,"player",0);this.fuel=150;this.score=0;this.cash=0;this.anchor.setTo(.5,0);this.game.add.existing(this)}__extends(t,e);return t}(Phaser.Sprite);e.Player=t})(Wallaby||(Wallaby={}));var __extends=this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)if(t.hasOwnProperty(n))e[n]=t[n];r.prototype=t.prototype;e.prototype=new r};var Wallaby;(function(e){var t=function(e){function t(){e.apply(this,arguments)}__extends(t,e);t.prototype.preload=function(){this.game.load.image("player","/assets/player.png");this.game.load.image("grass","/assets/grass.png");this.game.load.image("dirt","/assets/dirt.png");this.game.load.image("sky","/assets/sky.png");this.game.load.tilemap("level","/assets/spritesheet.json",null,Phaser.Tilemap.TILED_JSON);this.game.load.image("Tiles","/assets/Tiles.png")};t.prototype.create=function(){this.startMainMenu()};t.prototype.startMainMenu=function(){this.game.state.start("MainMenu",true,false)};return t}(Phaser.State);e.Preloader=t})(Wallaby||(Wallaby={}))