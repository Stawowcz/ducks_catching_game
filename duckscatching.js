const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// load images
let bird = new Image();
let bg = new Image();
let redy = new Image();
let black = new Image();
let snake = new Image();
let gameoverimg = new Image();

bird.src = "images/bird.png";
bg.src = "images/road.png";
redy.src = "images/redy.png";
black.src = "images/black.png";
snake.src = "images/snaky.png";
gameoverimg.src = "images/go.png";

// some variables
let cX = 240;
let cY = 440;
let gravity = 1.5;
let gravity_blacky = 1;
let score = 0;
let life = 3;

// audio files
const fly = new Audio();
const scor = new Audio();
const die = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";
die.src = "sounds/sfx_die.mp3";
    
function gameover() {
    ctx.drawImage(gameoverimg,  120, 220);
    die.play();  
    setTimeout(function(){ location.reload(); }, 2000);    
}

function moveUp() {
    cY -= 25;
    fly.play();
}

function moveDown() {
    cY += 25;
    fly.play();
}

function moveRight() {
    cX += 15;
    fly.play();
}

function moveLeft() {
    cX -= 15;
    fly.play();
}

// adding button events
function name(event) {
    event.preventDefault();
    const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    switch (key) { // change to event.key to key to use the above variable
      case "ArrowLeft":
        // Left pressed
        moveLeft();
        break;
      case "ArrowRight":
        // Right pressed
        moveRight();
        break;
      case "ArrowUp":
        // Up pressed
        moveUp();
        break;
      case "ArrowDown":
        // Down pressed
        moveDown();
        break;
    }
}

document.addEventListener("keydown", name)


// objects coordinates
let duck = [];

duck[0] = {
    x : Math.floor(Math.random()*500),
    y : 0    
};

let blacky = [];

blacky[0] = {
    x: Math.floor(Math.random()*500),
    y: 0
};

let snaky = [];

snaky[0] = {
    x: 0,
    y: Math.floor(Math.random()*500)
};

let snaky2 = [];

snaky2[0] = {
    x: 500,
    y: Math.floor(Math.random()*500)
};

// drawing elements
function draw2() {
    ctx.drawImage(bg,0,0);

    // movement of ducks
    for(let i = 0; i < duck.length; i++) {
        ctx.drawImage(bird, duck[i].x, duck[i].y);
        duck[i].y++;

        if(duck[i].y == 200){
            duck.push({
                x : Math.floor(Math.random() * (bg.width - 2 * bird.width)),
                y : 0
            });
        }

        if(cX + redy.width >= duck[i].x && cX <= duck[i].x + bird.width
             && cY <= duck[i].y + bird.height && cY + redy.width >= duck[i].y) {
            scor.play();
            score++;
            duck[i].x =  Math.floor(Math.random()*500);
            duck[i].y = -bird.height;
        } 
    }

    // movement of blacks object
    for (let j = 0; j < blacky.length; j++) {
        ctx.drawImage(black, blacky[j].x, blacky[j].y);
        blacky[j].y ++

        if(blacky[j].y == 250) {
            blacky.push({
                x : Math.floor(Math.random() * (bg.width - 2 * black.width)),
                y : 0
            });
        }

        // collision 
        if(cX + redy.width >= blacky[j].x && cX <= blacky[j].x + black.width 
            && cY + redy.height >= blacky[j].y && cY <= blacky[j].y + black.height) {
            blacky[j].x =  Math.floor(Math.random() * 500);
            blacky[j].y = -black.height;
            die.play();
            if(life == 1) {
                life -= 1;
                gravity_blacky = 0;
                gravity = 0;
                gameover();
                document.removeEventListener("keydown", name);
            } else { life -= 1; }
        }
    }

    // movement of left snaky
    for (let k = 0; k < snaky.length; k++) {
        ctx.drawImage(snake, snaky[k].x, snaky[k].y);
        snaky[k].x++;

        if(snaky[k].x == 400) {
            snaky.push({
                x : 0,
                y : Math.floor(Math.random()  *(bg.height - 2 * snake.height))
            });    
        }
        
        //collision
        if(cX + redy.width >= snaky[k].x && cX <= snaky[k].x + snake.width 
            && cY + redy.height >= snaky[k].y && cY <= snaky[k].y + snake.height) {
            snaky[k].x = -snake.width;
            snaky[k].y = Math.floor(Math.random()*500);
            die.play();
            if(life == 1) {
                life -= 1;
                snaky[k].x--;
                gravity = 0;
                gameover();
                document.removeEventListener("keydown", name);
                } else { life -= 1;} 
        }
    }

    // movement of right snaky
    for (let l = 0; l < snaky2.length; l++) {
        ctx.drawImage(snake, snaky2[l].x, snaky2[l].y);
        snaky2[l].x--;

        if(snaky2[l].x == 100) {
            snaky2.push({
                x : 500,
                y : Math.floor(Math.random() * (bg.height - 2 * snake.height))
            });    
        }

        // collision
        if(cX + redy.width >= snaky2[l].x && cX <= snaky2[l].x + snake.width 
            && cY + redy.height >= snaky2[l].y && cY <= snaky2[l].y + snake.height) {
            snaky2[l].x = bg.width;
            snaky2[l].y = Math.floor(Math.random()*500);
            die.play();
            if(life == 1) {
                life -= 1;
                snaky2[l].x++;
                gravity = 0;
                gameover();
                document.removeEventListener("keydown", name);
            } else { life -=1; }    
        }
    }
    
    // collision with walls
    if(cX <= 0 || cX >= cvs.width-redy.width || cY <= 0 || cY >= cvs.height - redy.height + 10) {
        gravity = 0;
        document.removeEventListener("keydown", name);
        gameover();       
    }

    ctx.drawImage(redy, cX, cY);

    // movement of redy
    cY -= gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, cvs.height - 20);

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Life : "+ life, 10, cvs.height - 40);

    requestAnimationFrame(draw2);
}

draw2()
