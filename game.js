let game;
let gameOptions = {

    playerGravity: 1000,

    playerGrip: 100,

    playerSpeed: 250,

    playerJump: 400,

    playerDoubleJump: 400,
}
let width = 640;
let height = 384;

window.onload = function () {
    let gameConfig = {
        type: Phaser.CANVAS,
        width: 640,
        height: 384,
        physics: {
            default: "arcade",
            arcade: {
                debug: false,
                gravity: {
                    y: 0
                },
            }
        },
        scene: [preloadGame, startScreen, playGame]
    }
    game = new Phaser.Game(gameConfig);
}
class preloadGame extends Phaser.Scene {
    constructor() {
        super("PreloadGame");
    }
    preload() {

        this.load.spritesheet("coin", "coin_gold.png", {
            frameWidth: 16,
            frameHeight:16,
            margin: 0,
            spacing: 0
        });

        this.load.spritesheet("enemy", "enemy.png", {
            frameWidth: 48,
            frameheigth: 48,
            margin: 0,
            spacing:0
        });

        this.load.spritesheet('player', 'player.png', {
            frameWidth: 32,
            frameHeight: 32,
            margin: 0,
            spacing: 0
        });
  

        this.load.tilemapTiledJSON("level", "level0.json");

        this.load.image("tile", "tile.png");

        // LOAD BACKGROUND
        this.load.image("bgp1", "bg1.png")
        this.load.image("bgp2", "bg2.png")
        this.load.image("bgp3", "bg3.png")
        this.load.image("bgp4", "bg4.png")

        // LOAD ASSETS
        this.load.image("door", "door.png")
        this.load.image("heart", "heart.png")

        // LOAD AUDIO
        this.load.audio('jump', "jump.wav");
        this.load.audio('coin', "coin-sound.mp3");
        this.load.audio('music', "backgroundMusic.wav");
        this.load.audio('oneUp', "add_life.mp3");

        // LOAD TEXT
        this.load.bitmapFont("pixFont", "font/font.png", "font/font.xml");
    }
    create() {

        // ANIMATIONS

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNames("player", {
                start: 0, end: 7
            }),
            frameRate: 10,
            yoyo: false,
            repeat: -1
        })

        this.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNames("player", {
                start: 8, end: 9
            }),
            frameRate: 10,
            yoyo: false,
            repeat: -1
        })

        this.anims.create({
            key: "wallslide",
            frames: this.anims.generateFrameNames("player", {
                start: 10, end: 11
            }),
            frameRate: 10,
            yoyo: false,
            repeat: -1
        })

        this.anims.create({
            key: "coinspin",
            frames: this.anims.generateFrameNames("coin", {
                start: 1, end: 5
            }),
            frameRate: 10,
            yoyo: false,
            repeat: -1
        })

        this.anims.create({
            key: "enemyIdle",
            frames: this.anims.generateFrameNames("enemy", {
                start: 1, end: 6
            }),
            frameRate: 10,
            yoyo: false,
            repeat: -1
        })

        this.scene.start("startScreen");
    }
}

class startScreen extends Phaser.Scene {
    constructor() {
        super("startScreen");
    }

    preload() {

        this.bgp1 = this.add.tileSprite(0, 0, 640, 384, "bgp1");
        this.bgp1.setOrigin(0, 0);
        this.bgp1.setScrollFactor(0);
        this.bgp2 = this.add.tileSprite(0, 0, 640, 384, "bgp2");
        this.bgp2.setOrigin(0, 0);
        this.bgp2.setScrollFactor(0);
        this.bgp3 = this.add.tileSprite(0, 0, 640, 384, "bgp3");
        this.bgp3.setOrigin(0, 0);
        this.bgp3.setScrollFactor(0);
        this.add.bitmapText(53, 50, "pixFont", '"RUNNING REINHOLD"', 64);
        this.add.bitmapText(230, 150, "pixFont", 'Tap to jump!', 32);
        this.add.bitmapText(125, 210, "pixFont", 'Reinhold can doublejump and jump from walls...', 18);
        this.add.bitmapText(225, 300, "pixFont", 'Tap to start!', 32)
        };
    
    create()    {
        this.input.on("pointerdown", this.startGame, this)
    };

    startGame() {
    this.scene.start("PlayGame");
    };
}

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
        
    }

    create() {

        // LOAD THE LEVEL
        this.map = this.make.tilemap({
            key: "level"
        });

        // MUSIC & LOOPMARKER
        let loopMarker = {
            name: 'loop',
            start: 0,
            duration: 73.5,
            config: {
                loop: true
            }
        };

        let bgMusic = this.sound.add("music");
        bgMusic.addMarker(loopMarker);
        bgMusic.play("loop", {delay: 0});


        // PARALLAX SCROLLING

        this.bgp1 = this.add.tileSprite(0, 0, 640, 384, "bgp1");
        this.bgp1.setOrigin(0, 0);
        this.bgp1.setScrollFactor(0);
        this.bgp2 = this.add.tileSprite(0, 0, 640, 384, "bgp2");
        this.bgp2.setOrigin(0, 0);
        this.bgp2.setScrollFactor(0);
        this.bgp3 = this.add.tileSprite(0, 0, 640, 384, "bgp3");
        this.bgp3.setOrigin(0, 0);
        this.bgp3.setScrollFactor(0);
        this.bgp4 = this.add.tileSprite(0, 0, 640, 384, "bgp4");
        this.bgp4.setOrigin(0,0);
        this.bgp4.setScrollFactor(0);
        
        let tile = this.map.addTilesetImage("tileset", "tile");
        this.layer = this.map.createStaticLayer("layer01", tile);
        
        // COLLISION

        this.layer.setCollisionBetween(1,23);
        this.layer.setCollisionBetween(38,40);
        this.layer.setCollisionBetween(62,63);
        this.layer.setCollisionBetween(70,71);
        this.layer.setCollisionBetween(76,77);
        this.layer.setCollisionBetween(78,79);
        this.layer.setCollision(50);

        //PLAYER

        this.player = this.physics.add.sprite(150, 1200, "player");
        this.player.setSize(20,20); // <-- REDUCE HITBOX

        // COINS SETUP

        this.coins = this.physics.add.staticGroup();
        this.coins.enableBody = true;
        
        this.coins.create(860, 1166, "coin");
        this.coins.create(1226, 1088, "coin");
        this.coins.create(1525, 873, "coin");
        this.coins.create(334, 708, "coin");
        this.coins.create(1150, 410, "coin");
        this.coins.create(1461, 256, "coin");
        this.coins.create(962, 110, "coin");
        this.coins.create(521, 118, "coin");
        
        this.coins.children.getArray().forEach(coin => {
            coin.anims.play("coinspin");
        });

        // ENEMIES

        this.enemies = this.physics.add.staticGroup();
        this.enemies.enableBody = true;

        this.enemies.create(500, 1100, "enemy");
        this.enemies.create(600, 1100, "enemy");
        this.enemies.create(1245, 1158, "enemy");
        this.enemies.create(762, 900, "enemy");
        this.enemies.create(1249, 102, "enemy");
        this.enemies.create(1493, 60, "enemy");

        this.enemies.children.getArray().forEach(enemy => {
            enemy.anims.play("enemyIdle");
            enemy.setSize(25,25);
            enemy.setOffset(10,10);
        })

        // DOORS

        this.doors = this.physics.add.staticGroup();
        this.doors.enableBody = true;
        this.doors.create(278, 190, "door");
        this.doors.children.getArray().forEach(door => {
            door.visible = false;
        })

        // HEARTS

        this.hearts = this.physics.add.staticGroup();
        this.hearts.enableBody = true;
        this.hearts.create(1642,661, "heart");
        this.hearts.create(1493,150, "heart");

        this.hearts.children.getArray().forEach(heart =>    {
           heart.setSize(25,25); 
        })
     
        // OVERLAPPING
        
        this.physics.add.overlap(this.player, this.coins, (player, coin) =>  {
            coin.disableBody(true, true);
            this.sound.play("coin", {volume: 0.1});
            this.score = this.score + 50;
            this.scoreLabel.text = "SCORE: " + this.score;
            this.coins++
            this.coinsLabel.text = "COINS: " + this.coins + "/" + this.coinsNeeded
        }, null);  

        this.physics.add.overlap(this.player, this.enemies, (player, enemy) =>  {
            this.lives--
            this.liveLabel.text = "LIVES: " + this.lives;
            this.cameras.main.shake(500);
            this.cameras.main.fadeOut(300);
            this.cameras.main.fadeIn(300);
            this.player.x = 100;
            this.player.y = 1100;
            return;
        }, null);

        this.physics.add.overlap(this.player, this.doors, (player, door) =>  {
            this.endGame();
        }, null);  

        this.physics.add.overlap(this.player, this.hearts, (player, heart) =>  {
            heart.disableBody(true, true);
            this.sound.play("oneUp", {volume: 0.1});   
            this.lives++
            this.liveLabel.text = "LIVES: " + this.lives;
        }, null);  
            
         // SCORE

         this.score = 0;
         this.scoreLabel = this.add.bitmapText(15,10, "pixFont", "SCORE:", 32);
         this.scoreLabel.setScrollFactor(0);
         this.scoreLabel.text = "SCORE: " + this.score;
         
         // LIVES
         this.lives = 5;
         this.liveLabel = this.add.bitmapText(530,10, "pixFont", "LIVES:", 32);
         this.liveLabel.setScrollFactor(0);
         this.liveLabel.text = "LIVES: " + this.lives;

        // COINS

        this.coins = 0;
        this.coinsNeeded = 8;
        this.coinsLabel = this.add.bitmapText(240,10, "pixFont", "Coins:", 32);
        this.coinsLabel.setScrollFactor(0);
        this.coinsLabel.text = "COINS: " + this.coins + "/" + this.coinsNeeded
        
        // SET SPEED
        this.player.body.velocity.x = gameOptions.playerSpeed;

        // JUMP
        this.canJump = true;

        // DOUBLE JUMP
        this.canDoubleJump = false;

        // ONWALL
        this.onWall = false;

        // ADD KEYS
        //this.cursors = this.input.keyboard.createCursorKeys();

        // STATE AT BEGINNING
        this.state = "run";
        this.player.anims.play("run");

        // SPACEBAR CALLS BUTTON INPUT

        this.input.on("pointerdown", this.buttonInput, this);
        
        // ADD SOUND

        this.sound.add("jump");
        this.sound.add("music");
        this.sound.add("coin");

        // ADD CAMERAS

        this.cameras.main.setBounds(0, 0, 1920, 1440);
        this.cameras.main.startFollow(this.player);
    }

    buttonInput() {

        if (this.state === "run") {
            this.player.body.velocity.y = -gameOptions.playerJump;
            this.state = "jump";
            this.player.anims.play("jump");
            this.sound.play("jump", {volume: 0.1});
        } else if (this.state === "wallslide") {
            this.player.body.velocity.x = gameOptions.playerSpeed * (this.player.flipX ? -1 : 1)
            this.player.body.velocity.y = -gameOptions.playerJump;
            this.state = "jump";
            this.player.anims.play("jump");
            this.sound.play("jump",{volume: 0.1})
        } else if (this.state === "jump") {
            this.player.body.velocity.y = -gameOptions.playerDoubleJump;
            this.state = "fall";
            this.player.anims.play("jump");
            this.sound.play("jump",{volume: 0.1})
        } else if (this.state === "pause")    {
            
        }
    }

    update() {

        if (this.lives === 0) {
            this.physics.pause();
            this.player.anims.stop();
           
            // TEXT

            this.gameOverLabel = this.add.bitmapText(320, 200, "pixFont", "GAME OVER", 64);
            this.gameOverLabel.text = "GAME OVER"
            this.gameOverLabel.setOrigin(.5);
            this.gameOverLabel.setScrollFactor(0);
            this.highscoreLabel = this.add.bitmapText(320, 130, "pixFont", "YOUR HIGHSCORE: " + this.score, 32);
            this.highscoreLabel.setOrigin(.5);
            this.highscoreLabel.setScrollFactor(0);
            this.replayLabel = this.add.bitmapText(320, 280, "pixFont", "TAP TO RESTART", 32);
            this.replayLabel.text = "TAP TO RESTART"
            this.replayLabel.setOrigin(.5);
            this.replayLabel.setScrollFactor(0);
            this.input.on("pointerdown", this.restartGame, this);
            return;
        };

        if (this.coins === this.coinsNeeded)    {
            
            // DOOR VISIBLE IF ALL COINS COLLECTED

            this.doors.children.getArray().forEach(door => {
                door.visible = true;
            });

        };

    
        // DEFAULTS
         
        this.setDefaultValues();

        this.bgp1.tilePositionX = this.cameras.main.scrollX * 0.1;
        this.bgp2.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.bgp3.tilePositionX = this.cameras.main.scrollX * 0.5;
        this.bgp4.tilePositionX = this.cameras.main.scrollX * 0.7;

        this.physics.world.collide(this.player, this.layer, (player, layer) => {

            let blockedDown = player.body.blocked.down;
            let blockedLeft = player.body.blocked.left;
            let blockedRight = player.body.blocked.right;

            // STATE HANDLING

            if (blockedDown && this.state !== "run") {
                this.player.body.velocity.x = gameOptions.playerSpeed * (this.player.flipX ? -1 : 1)
                this.state = "run";
                this.player.anims.play("run");
            } else if ((blockedLeft || blockedRight) && this.state === "run") {
                this.player.flipX = blockedRight;
                this.player.body.velocity.x = gameOptions.playerSpeed * (this.player.flipX ? -1 : 1)
            } else if ((blockedLeft || blockedRight) && this.state !== "run") {
                this.player.flipX = blockedRight
                this.player.body.gravity.y = 0;
                this.player.body.velocity.y = gameOptions.playerGrip;
                this.state = "wallslide";
                this.player.anims.play("wallslide");
            };

            // PLAYER HITS SPIKES OR INVISBLE BLOCKS

            if (layer.index == 50 || layer.index == 76)   {
                
                this.lives--;  
                this.liveLabel.text = "LIVES:" + this.lives;

                // CAMERA EFFECT

                this.cameras.main.shake(300);
                this.cameras.main.fadeOut(300);
                this.cameras.main.fadeIn(300);

                // RESET POSITION

                this.player.x = 100;
                this.player.y = 1100;

                return;

            };
         }, null);
    };
    
    setDefaultValues() {
        this.player.body.gravity.y = gameOptions.playerGravity;
    }

    restartGame()   {
        window.location.reload()
    }

    endGame() {
        this.scene.pause();
        this.bgp1 = this.add.tileSprite(0, 0, 640, 384, "bgp1");
        this.bgp1.setOrigin(0, 0);
        this.bgp1.setScrollFactor(0);
        this.bgp2 = this.add.tileSprite(0, 0, 640, 384, "bgp2");
        this.bgp2.setOrigin(0, 0);
        this.bgp2.setScrollFactor(0);
        this.bgp3 = this.add.tileSprite(0, 0, 640, 384, "bgp3");
        this.bgp3.setOrigin(0, 0);
        this.bgp3.setScrollFactor(0);
        this.add.bitmapText(75, 50, "pixFont", 'CONGRATULATIONS', 64);
        this.add.bitmapText(195, 200, "pixFont", 'YOUR SCORE: ' + this.score, 32);
        this.add.bitmapText(200, 350, "pixFont", 'TAP TO RESTART', 32);
        this.input.on("pointerdown", this.restartGame, this);
    }
}


 