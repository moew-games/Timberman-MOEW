// Load Progress 
let loadProgress = 0, countSprites = 25;

// Level
const levelMenu = 1;
const levelPlay = 2;
const levelGameOver = 3;
let level = 0; 

// Score
let levelscore = 1;
let score = 0;
const number = [];
let bestscore = 0;

// Trunk
let trunk = [], TrunkHeight = 243;

// Screen
openScreen("game", 0, 0, 1080, 1800);
initMouse();
initKeyboard();
resizeScreen(true);

// Load sprites
const background = loadSprite("assets/image/background.jpg", onReady);
const title = loadSprite("assets/image/title.png", onReady);

// Intro
const left = loadSprite("assets/image/left.png", onReady, cutTheTree);
const right = loadSprite("assets/image/right.png", onReady, cutTheTree);
const bottom = loadSprite("assets/image/bottom.jpg", onReady);

// Trunk
const stump = loadSprite("assets/image/stump.png", onReady);
const trunk1 = loadSprite("assets/image/trunk1.png", onReady);
const branchleft = loadSprite("assets/image/branch1.png", onReady);
const branchright = loadSprite("assets/image/branch2.png", onReady);

// Game Over
const rip = loadSprite("assets/image/rip.png", onReady);
const gameover = loadSprite("assets/image/gameover.png", onReady);
const play = loadSprite("assets/image/play.png", onReady, restartGame);

// Timberman
const man = loadSprite("assets/image/man.png", onReady);

// Score
for (let n = 0; n < 10; n++) {
    number[n] = loadSprite("assets/image/numbers.png", onReady);
}

// Progress bar
const timecontainer = loadSprite("assets/image/time-container.png", onReady);
const timebar = loadSprite("assets/image/time-bar.png", onReady);

// Load Sound
const cut = loadSound("assets/sound/cut.mp3");
const death = loadSound("assets/sound/death.mp3");
const menubar = loadSound("assets/sound/menu.mp3");

function onReady() {
    loadProgress++;

    if (loadProgress === countSprites) {
        // Changement du point d'ancrage du bucheron et ajout des animations
        anchorSprite(man, 0.5, 0.5);
        man.x = 263;

        addAnimation(man, "breath", [2, 3], 527, 413, 350);
        addAnimation(man, "cut", [0, 1, 0], 527, 413, 15);

        // Creation de l'arbre
        trunk1.data = "trunk1";
        branchleft.data = "branchleft";
        branchright.data = "branchright";

        initTrunk();

        // Creation des images représentant chaque chiffre 
        clipSprite(number[0], 5, 5, 66, 91);
        clipSprite(number[1], 81, 5, 50, 91);
        clipSprite(number[2], 141, 5, 66, 91);
        clipSprite(number[3], 217, 5, 66, 91);
        clipSprite(number[4], 293, 5, 66, 91);
        clipSprite(number[5], 369, 5, 66, 91);
        clipSprite(number[6], 445, 5, 66, 91);
        clipSprite(number[7], 521, 5, 66, 91);
        clipSprite(number[8], 597, 5, 66, 91);
        clipSprite(number[9], 673, 5, 66, 91);

        // Position niveau load
        level = levelMenu;

        // Mémorisation du meilleur score
        if (localStorage.bestscore) {
            bestscore = Number(localStorage.bestscore);
        }

        // Visualisation du jeu
        renderGame();
    }
}

function cutTheTree() {
    level = levelPlay
    if (mouseButton()) {
        man.action = true;
        if (mouseX() <= screenWidth() / 2) {
            man.data = "left";
            man.x = 263;
            flipSprite(man, 1, 1);
        } else {
            man.data = "right";
            man.x = 800;
            flipSprite(man, -1, 1);
        }
        man.action = true;
               
        
    }
}

function initTrunk() {
    trunk = [0, 0, 0, 0, 0, 0, 0];
    trunk[0] = copySprite(trunk1);
    trunk[1] = copySprite(trunk1);
    addTrunk();

    score = 0;
    timescore = 150;
    levelscore = 1;
}

function addTrunk() {
    for (let i = 1; i < 7; i++) {
        if (trunk[i] === 0) {
            if (trunk[i - 1].data === "trunk1") {
                if (Math.random() * 4 <= 1) {
                    trunk[i] = copySprite(trunk1);
                } else {
                    trunk[i] = Math.random() * 2 < 1 ? copySprite(branchleft) : copySprite(branchright);
                }
            } else {
                trunk[i] = copySprite(trunk1);
            }
        }
    }
}

function restartGame() {
    initTrunk();
    level = levelPlay;
    man.data = "left";
    man.x = 263;
    flipSprite(man, 1, 1);
}

function gameOver() {
    level = levelGameOver;
    
    playSound(death);

    if (score > bestscore) {
        bestscore = score;
        localStorage.bestscore = bestscore;
    }
}

function renderGame() {
    let p = 0, m = 0;
    clearScreen("black");

    // Display Background
    displaySprite(background, 0, -290);
    displaySprite(bottom,0,1490)

    // Display Trunk
    displaySprite(stump, 352, 1394);
    for (let i = 0; i < 6; i++) {
        displaySprite(trunk[i], 37, stump.y - TrunkHeight * (i + 2) + TrunkHeight);
    }

    // Display Timberman
    if (level === levelPlay || level === levelMenu) {
        displaySprite(man, man.x, 1270);
    }

    // Display Level Game Over
    if (level === levelGameOver ) {
        displaySprite(rip, 550, man.y);
        if(man.data == "left") {
            flipSprite(rip,-1, 1)
        } else {
            flipSprite(rip,1, 1)
        }
        
        displaySprite(gameover, 110, -250);
        displaySprite(play, 350, 900);
        displaySprite(left, 2000, 2000);
        displaySprite(right, 2000, 2000);

        for (let i = 0; i < bestscore.toString().length; i++) {
            p = bestscore.toString().substring(i, i + 1);
            m = screenWidth() / 2 - 35 * bestscore.toString().length;
            displaySprite(number[p], m + 67 * i, 480);
        }
    } else {
        displaySprite(left, 0, 1500);
        displaySprite(right, 865, 1500);
        displaySprite(play, 2000, 2000);
    }
    if (level == levelMenu) {
        // title screen
        displaySprite(title, 280, 200); 
    } else  {
        //score
        for (let i = 0; i < score.toString().length; i++) {
            p = score.toString().substring(i, i + 1);
            m = screenWidth() / 2 - 35 * score.toString().length;
            displaySprite(number[p], m + 67 * i, 700);
        }
    }

    // Display Progress Bar
    
    if (level === levelPlay) {
        if (timescore > 0) {
            timescore -= levelscore / 10;
        } else {
            gameOver();
            level = levelGameOver;
        }
        displaySprite(timecontainer, 255, 100);
        displaySprite(timebar, 285, 130, timescore);
        displaySprite(man)
    }


    // Animation status
    if (!animationActive(man, "cut")) {
        playAnimation(man, "breath");
    } else {
        playAnimation(man, "cut");
    }

    // Action
    if (man.action) {
        // Joue le son "cut"
        playAnimation(man, "cut");
        playSound(cut);

        if (
            (man.data === "left" && trunk[0].data === "branchleft") ||
            (man.data === "right" && trunk[0].data === "branchright")
        ) {
            gameOver();
        }

        score++;
        if (score % 20 === 0) {
            levelscore++;
        }

        if (timescore < 508) {
            timescore += 10;
        }

        for (let i = 0; i < 6; i++) {
            trunk[i] = trunk[i + 1];
        }

        trunk[6] = 0;
        addTrunk();

        if (
            (man.data === "left" && trunk[0].data === "branchleft") ||
            (man.data === "right" && trunk[0].data === "branchright")
        ) {
            gameOver();
        }

        man.action = false;
    }

    requestAnimationFrame(renderGame);
}
