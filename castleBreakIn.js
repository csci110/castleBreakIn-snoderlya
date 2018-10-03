import { game, Sprite } from "./sgc/sgc.js";

game.setBackground("grass.png");


class Wall extends Sprite {
    constructor(x, y, name, image) {
        super();
        this.x = x;
        this.y = y;
        this.name = name;
        this.setImage(image);
        this.accelerateOnBounce = false;
    }
}

new Wall(0, 0, "A spooky castle wall", "castle.png");

let leftWall = new Wall(0, 200, "Left side wall", "wall.png");


let rightWall = new Wall(game.displayWidth - 48, 200, "Right side wall", "wall.png");

class Princess extends Sprite {
    constructor() {
        super();
        this.name = "Princess Ann";
        this.setImage("ann.png");
        this.height = 48;
        this.width = 48;
        this.x = game.displayWidth / 2;
        this.y = game.displayHeight - 48;
        this.speedWhenWalking = 150;
        this.lives = 1;
        this.accelerateOnBounce = false;
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);
        this.lives = 3;
    }
    LoseALife() {
        this.lives = this.lives - 1;
        this.updateLivesDisplay();
        if (this.lives > 0) {
            new Ball(game.displayWidth / 2, game.displayHeight / 2, "this.name", "ball.png");
        }
        if (this.lives === 0) {
            game.end('The mysterious stranger has escaped\nPrincess Ann for now!\n\nBetter luck next time');
        }
    }
    addALife(){ 
        this.lives = this.lives + 1;
        this.updateLivesDisplay();
    }
    handleFirstGameLoop() {
        //Set up a text area to display the number of lives remaining.
        this.livesDisplay = game.createTextArea(game.displayWidth - (48 * 2), 20);
        this.updateLivesDisplay();
    }
    updateLivesDisplay() {
        game.writeToTextArea(this.livesDisplay, "Lives =" + this.lives);
    }
    handleLeftArrowKey() {
        this.playAnimation("left");
        this.speed = this.speedWhenWalking;
        this.angle = 180;
    }
    handleRightArrowKey() {
        this.playAnimation("right");
        this.speed = this.speedWhenWalking;
        this.angle = 0;
    }
    handleGameLoop() {
        this.x = Math.max(48, this.x);
        this.x = Math.min(702, this.x);
        this.speed = 0;
    }
    handleCollision(otherSprite) {
        //horizontially, Ann's image file is about one-third blank, one-third Ann, and 
        //one-third blank.
        //Veritically, there is very little blank space. Ann's head is about one-fourth 
        //the height
        // The other sprite (Ball) should change angle if:
        //1. it hits the middle horizontal third of the image, which is not blank, AND
        // 2. it hits the upper fourth, which is Ann's head.
        let horizontalOffset = this.x - otherSprite.x;
        let verticalOffset = this.y - otherSprite.y;
        if (Math.abs(horizontalOffset) < this.width / 3 &&
            verticalOffset > this.height / 4) {
            //The new angle dpends on the horizontal difference between sprites.
            otherSprite.angle = 90 + 2 * horizontalOffset;
        }
        return false;
    }
}



let ann = new Princess();

class Ball extends Sprite {
    constructor(x, y, name, image) {
        super();
        this.x = game.displayWidth / 2;
        this.y = game.displayHeight / 2;
        this.height = 48;
        this.width = 48;
        this.name = "ball";
        this.setImage("ball.png");
        this.defineAnimation("spin", 0, 12);
        this.playAnimation("spin", true);
        this.speed = 100;
        this.angle = 50 + Math.random() * 80;
        this.ballsInPlay = Ball.ballsInPlay + 1;
    }
    handleBoundaryContact() {
        game.removeSprite(this);
        if (Ball.ballsInPlay > 0) {
            Ball.ballsInPlay = Ball.ballsInPlay -1;
        }
        if (Ball.ballsInPlay === 0) {
            ann.LoseALife();
        }
    }
    handleGameLoop() {
        if (this.speed < 200) {
            let speed = this.speed + 2;
        }

    }
    addALife() {
        this.lives = this.lives+1;
        this.updateLivesDisplay();
    }
}

Ball.ballsInPlay = 0

new Ball(game.displayWidth / 2, game.displayHeight / 2, "this.name", "ball.png");

class Block extends Sprite {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.name = "The Block";
        this.setImage("block1.png");
        this.accelerateOnBounce = false;
        Block.blocksToDestry = Block.blocksToDestry + 1; 
    }
    handleCollision() {
        game.removeSprite(this);
        if (Block.blocksToDestry > 0) {
            Block.blocksToDestry = Block.blocksToDestry - 1;
        }
        if (Block.blocksToDestry <= 0) {
            game.end('Congratulations!\n\nPrincess Ann can continue her pursuit\nof the mysterious stranger!');
        }
        return true;
    }
}

Block.blocksToDestry = 0;

for (let i = 0; i < 5; i = i + 1) {
    new Block(200 + i * 48, 200);
}

class ExtraLifeBlock extends Block {
    constructor(x,y) {
        super(x,y);
        this.setImage('block2.png');
        Block.blocksToDestry = Block.blocksToDestry - 1; 
    }
    handleCollision() {
        ann.addALife();
        return true;
    }
}

let extraLifeBlock = new ExtraLifeBlock(200, 250);

class ExtraBallBlock extends Block {
    constructor(x,y){
        super(x,y);
        this.setImage('block3.png');
        Block.blocksToDestry = Block.blocksToDestry -1;
    }
    handleCollision() {
        super.handleCollision(); // call function in superclass
        new Ball(); // extends superclass behavior
        return true;
    }
}

let extraBallBlock = new ExtraBallBlock(300,250);
