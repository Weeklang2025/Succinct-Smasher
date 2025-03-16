main_menu_music.mp3console.log("Checking lastScoreElement:", document.getElementById("lastScore"));
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const mainScreen = document.getElementById("mainScreen");
const mainMenuMusic = document.getElementById("mainMenuMusic");
const backgroundMusic = document.getElementById("backgroundMusic");
const deathSound = document.getElementById("deathSound");
const jumpSound = document.getElementById("jumpSound");
const howToPlayBtn = document.getElementById("howToPlayBtn");
const howToPlayModal = document.getElementById("howToPlayModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const gameOverModal = document.getElementById("gameOverModal");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const lastScoreElement = document.getElementById("lastScore");
const mainLastScoreElement = document.getElementById("mainLastScore");

const W = 1200;
const H = 800;
const GROUND_H = 80;

let lastFrameTime = null;
let lastScore = 0;

const backgroundWithGround = new Image();
backgroundWithGround.src = "background_with_ground.png";

const playerImage = new Image();
playerImage.src = "freakybird.png";

const playerImageLeft = new Image();
playerImageLeft.src = "freakybird_left.png";

const enemyImage = new Image();
enemyImage.src = "crab.png";

const enemyDeadImage = new Image();
enemyDeadImage.src = "crab_dead.png";

const enemyImage2 = new Image();
enemyImage2.src = "ostrich.png";

const enemyDeadImage2 = new Image();
enemyDeadImage2.src = "ostrich_dead.png";

const enemyImage3 = new Image();
enemyImage3.src = "images/goon.png";

const enemyDeadImage3 = new Image();
enemyDeadImage3.src = "images/goon_dead.png";

const shooterImage = new Image();
shooterImage.src = "shooter.png";

const barrelImage = new Image();
barrelImage.src = "barrel.png";

class Entity {
    constructor(image, width, height) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.speed = 7;
        this.jumpSpeed = -15;
        this.gravity = 0.7;
        this.isGrounded = false;
        this.isDead = false;
        this.isOut = false;
    }

    update(deltaTime) {
        this.x += this.xSpeed * deltaTime * 60;
        this.y += this.ySpeed * deltaTime * 60;
        this.ySpeed += this.gravity * deltaTime * 60;

        if (!this.isDead && this.y + this.height > H - GROUND_H) {
            this.isGrounded = true;
            this.ySpeed = 0;
            this.y = H - GROUND_H - this.height;
        } else {
            this.isGrounded = false;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class Player extends Entity {
    constructor() {
        super(playerImage, 100, 100);
        this.x = W / 2 - this.width / 2;
        this.y = H - GROUND_H - this.height;
        this.imageRight = playerImage;
        this.imageLeft = playerImageLeft;
    }

    handleInput(keys) {
        if (this.isDead) return;

        this.xSpeed = 0;
        if (keys["KeyA"]) {
            this.xSpeed = -this.speed;
            this.image = this.imageLeft;
        }
        if (keys["KeyD"]) {
            this.xSpeed = this.speed;
            this.image = this.imageRight;
        }
        if (!keys["KeyA"] && !keys["KeyD"]) {
            this.image = this.imageRight;
        }
        if (this.isGrounded && keys["Space"]) {
            this.isGrounded = false;
            this.ySpeed = this.jumpSpeed;
            jumpSound.currentTime = 0;
            jumpSound.play();
        }
    }

    update(deltaTime) {
        this.x += this.xSpeed * deltaTime * 60;
        this.y += this.ySpeed * deltaTime * 60;
        this.ySpeed += this.gravity * deltaTime * 60;

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > W) this.x = W - this.width;

        if (!this.isDead && this.y + this.height > H - GROUND_H) {
            this.isGrounded = true;
            this.ySpeed = 0;
            this.y = H - GROUND_H - this.height;
        } else {
            this.isGrounded = false;
        }
    }

    kill() {
        this.isDead = true;
        this.xSpeed = 0;
        this.ySpeed = -10;
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        deathSound.currentTime = 0;
        deathSound.play();
    }

    respawn() {
        this.isDead = false;
        this.x = W / 2 - this.width / 2;
        this.y = H - GROUND_H - this.height;
        this.ySpeed = 0;
        this.image = this.imageRight;
    }
}

class Crab extends Entity {
    constructor() {
        super(enemyImage, 90, 90);
        this.deadImage = enemyDeadImage;
        this.spawn();
    }

    spawn() {
        const direction = Math.random() < 0.5 ? 0 : 1;
        if (direction === 0) {
            this.x = -this.width;
            this.xSpeed = this.speed;
        } else {
            this.x = W;
            this.xSpeed = -this.speed;
        }
        this.y = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (this.x > W || this.x + this.width < 0) {
            this.isOut = true;
        }
    }

    kill() {
        this.isDead = true;
        this.image = this.deadImage;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }
}

class Ostrich extends Entity {
    constructor() {
        super(enemyImage2, 90, 90);
        this.deadImage = enemyDeadImage2;
        this.spawn();
    }

    spawn() {
        const direction = Math.random() < 0.5 ? 0 : 1;
        if (direction === 0) {
            this.x = -this.width;
            this.xSpeed = this.speed;
        } else {
            this.x = W;
            this.xSpeed = -this.speed;
        }
        this.y = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (this.x > W || this.x + this.width < 0) {
            this.isOut = true;
        }
    }

    kill() {
        this.isDead = true;
        this.image = this.deadImage;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }
}

class Goon extends Entity {
    constructor() {
        super(enemyImage3, 80, 80);
        this.deadImage = enemyDeadImage3;
        this.spawn();
    }

    spawn() {
        const direction = Math.random() < 0.5 ? 0 : 1;
        if (direction === 0) {
            this.x = -this.width;
            this.xSpeed = this.speed;
        } else {
            this.x = W;
            this.xSpeed = -this.speed;
        }
        this.y = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (this.x > W || this.x + this.width < 0) {
            this.isOut = true;
        }
    }

    kill() {
        this.isDead = true;
        this.image = this.deadImage;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }
}

class BarrelShooter extends Entity {
    constructor() {
        super(shooterImage, 80, 80);
        this.x = Math.random() * (W - this.width);
        this.y = -this.height;
        this.shootInterval = 2000;
        this.lastShotTime = Date.now();
        this.shotsLeft = Math.floor(Math.random() * 5) + 1;
        this.isLeaving = false;
    }

    update(deltaTime) {
        if (!this.isLeaving) {
            if (this.y < 100) {
                this.y += this.speed * deltaTime * 60;
            }

            const now = Date.now();
            if (this.shotsLeft > 0 && now - this.lastShotTime > this.shootInterval) {
                const barrel = new Barrel(this.x + this.width / 2 - 40 / 2);
                barrels.push(barrel);
                this.lastShotTime = now;
                this.shotsLeft--;

                if (this.shotsLeft === 0) {
                    this.isLeaving = true;
                }
            }
        } else {
            this.y -= this.speed * deltaTime * 60;
            if (this.y + this.height < 0) {
                this.isOut = true;
            }
        }
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 6;
        ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    }
}

class Barrel extends Entity {
    constructor(x) {
        super(barrelImage, 60, 60);
        this.x = x;
        this.y = 100;
        this.ySpeed = 0;
        this.isOut = false;
    }

    update(deltaTime) {
        this.y += this.ySpeed * deltaTime * 60;
        this.ySpeed += this.gravity * deltaTime * 60;

        if (this.y > H) {
            this.isOut = true;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "#FC0FC0";
        ctx.lineWidth = 4;
        ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    }
}

const player = new Player();
const crabs = [];
const ostrichs = [];
const enemies3 = [];
const barrelShooters = [];
const barrels = [];
let score = 0;
let spawnDelay = 2000;
let shooterSpawnDelay = 5000;
let lastSpawnTime = Date.now();
let lastShooterSpawnTime = Date.now();
let gameStartTime = Date.now();
let difficultyIncreaseInterval = 10000;
let deathTime = null;

const keys = {};
window.addEventListener("keydown", (e) => (keys[e.code] = true));
window.addEventListener("keyup", (e) => (keys[e.code] = false));

document.addEventListener("click", function() {
    console.log("Попытка воспроизвести mainMenuMusic");
    mainMenuMusic.play()
        .then(() => console.log("Музыка главного меню воспроизводится"))
        .catch(error => console.log("Ошибка воспроизведения музыки главного меню:", error));
}, { once: true });

howToPlayBtn.addEventListener("click", () => {
    howToPlayModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
    howToPlayModal.style.display = "none";
});

restartBtn.addEventListener("click", () => {
    console.log("Restart button clicked");
    restartGame();
});

function gameLoop(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const deltaTime = (timestamp - lastFrameTime) / 1000;
    lastFrameTime = timestamp;

    ctx.drawImage(backgroundWithGround, 0, 0, W, H);

    player.handleInput(keys);
    player.update(deltaTime);
    player.draw();

    const now = Date.now();
    const gameTime = now - gameStartTime;
    if (gameTime > difficultyIncreaseInterval) {
        spawnDelay = Math.max(500, spawnDelay * 0.9);
        shooterSpawnDelay = Math.max(2000, shooterSpawnDelay * 0.9);
        difficultyIncreaseInterval += 10000;
    }

    if (now - lastSpawnTime > spawnDelay) {
        const enemyType = Math.random();
        let newEnemy;
        if (enemyType < 0.33) {
            newEnemy = new Crab();
            crabs.push(newEnemy);
        } else if (enemyType < 0.66) {
            newEnemy = new Ostrich();
            ostrichs.push(newEnemy);
        } else {
            newEnemy = new Goon();
            enemies3.push(newEnemy);
        }
        newEnemy.speed += Math.floor(gameTime / 10000) * 0.2;
        lastSpawnTime = now;
    }

    if (now - lastShooterSpawnTime > shooterSpawnDelay) {
        const newShooter = new BarrelShooter();
        barrelShooters.push(newShooter);
        lastShooterSpawnTime = now;
    }

    for (let i = crabs.length - 1; i >= 0; i--) {
        const crab = crabs[i];
        crab.update(deltaTime);
        crab.draw();

        if (crab.isOut) {
            crabs.splice(i, 1);
            continue;
        }

        if (!player.isDead && !crab.isDead && isColliding(player, crab)) {
            if (player.y + player.height - player.ySpeed < crab.y) {
                crab.kill();
                player.ySpeed = player.jumpSpeed;
                score++;
            } else {
                player.kill();
                deathTime = now;
            }
        }
    }

    for (let i = ostrichs.length - 1; i >= 0; i--) {
        const ostrich = ostrichs[i];
        ostrich.update(deltaTime);
        ostrich.draw();

        if (ostrich.isOut) {
            ostrichs.splice(i, 1);
            continue;
        }

        if (!player.isDead && !ostrich.isDead && isColliding(player, ostrich)) {
            if (player.y + player.height - player.ySpeed < ostrich.y) {
                ostrich.kill();
                player.ySpeed = player.jumpSpeed;
                score++;
            } else {
                player.kill();
                deathTime = now;
            }
        }
    }

    for (let i = enemies3.length - 1; i >= 0; i--) {
        const enemy = enemies3[i];
        enemy.update(deltaTime);
        enemy.draw();

        if (enemy.isOut) {
            enemies3.splice(i, 1);
            continue;
        }

        if (!player.isDead && !enemy.isDead && isColliding(player, enemy)) {
            if (player.y + player.height - player.ySpeed < enemy.y) {
                enemy.kill();
                player.ySpeed = player.jumpSpeed;
                score++;
            } else {
                player.kill();
                deathTime = now;
            }
        }
    }

    for (let i = barrelShooters.length - 1; i >= 0; i--) {
        const shooter = barrelShooters[i];
        shooter.update(deltaTime);
        shooter.draw();

        if (shooter.isOut) {
            barrelShooters.splice(i, 1);
            continue;
        }

        if (!player.isDead && isColliding(player, shooter)) {
            player.kill();
            deathTime = now;
        }
    }

    for (let i = barrels.length - 1; i >= 0; i--) {
        const barrel = barrels[i];
        barrel.update(deltaTime);
        barrel.draw();

        if (barrel.isOut) {
            barrels.splice(i, 1);
            continue;
        }

        if (!player.isDead && isColliding(player, barrel)) {
            player.kill();
            deathTime = now;
        }
    }

    const scoreX = W / 2 - 70;
    const scoreY = 20;
    const boxWidth = 140;
    const boxHeight = 60;

    ctx.strokeStyle = "#ff69b4";
    ctx.lineWidth = 4;
    ctx.strokeRect(scoreX, scoreY, boxWidth, boxHeight);

    ctx.fillStyle = "white";
    ctx.font = "20px SuperMario";
    ctx.textAlign = "center";
    ctx.fillText("SCORE", scoreX + boxWidth / 2, scoreY + 25);

    ctx.font = "28px SuperMario";
    ctx.fillText(score, scoreX + boxWidth / 2, scoreY + 50);

    if (player.isDead) {
        if (player.y > H || (deathTime && now - deathTime > 1000)) {
            showGameOverModal();
        } else {
            requestAnimationFrame(gameLoop);
        }
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function showGameOverModal() {
    console.log("Showing game over, score:", score);
    finalScore.textContent = score;
    gameOverModal.style.display = "flex";
    canvas.style.display = "none";
    window.addEventListener("keydown", restartGame, { once: true });
}

function restartGame() {
    console.log("Restarting game, current score:", score);
    lastScore = score;
    if (lastScoreElement) {
        lastScoreElement.textContent = lastScore;
        console.log("lastScoreElement updated to:", lastScoreElement.textContent);
    } else {
        console.error("lastScoreElement is null");
    }
    if (mainLastScoreElement) {
        mainLastScoreElement.textContent = lastScore;
        console.log("mainLastScoreElement updated to:", mainLastScoreElement.textContent);
    } else {
        console.error("mainLastScoreElement is null");
    }
    score = 0;
    spawnDelay = 2000;
    shooterSpawnDelay = 5000;
    lastSpawnTime = Date.now();
    lastShooterSpawnTime = Date.now();
    gameStartTime = Date.now();
    difficultyIncreaseInterval = 10000;
    lastFrameTime = null;
    deathTime = null;
    player.respawn();
    crabs.length = 0;
    ostrichs.length = 0;
    enemies3.length = 0;
    barrelShooters.length = 0;
    barrels.length = 0;
    deathSound.pause();
    deathSound.currentTime = 0;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    mainMenuMusic.play()
    .then(() => console.log("Музыка главного меню запущена после рестарта"))
    .catch(error => console.error("Ошибка при запуске музыки главного меню:", error));
    mainScreen.style.display = "flex";
    canvas.style.display = "none";
    gameOverModal.style.display = "none";
    window.removeEventListener("keydown", restartGame);
    window.addEventListener("keydown", startGame, { once: true });
}

function startGame() {
    console.log("Starting game");
    mainScreen.style.display = "none";
    howToPlayModal.style.display = "none";
    gameOverModal.style.display = "none";
    canvas.style.display = "block";
    mainMenuMusic.pause();
    mainMenuMusic.currentTime = 0;
    backgroundMusic.play();
    gameStartTime = Date.now();
    lastFrameTime = null;
    deathTime = null;
    requestAnimationFrame(gameLoop);
}

let imagesLoaded = 0;
const totalImages = 11;

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        if (mainLastScoreElement) {
            mainLastScoreElement.textContent = lastScore;
        }
        window.addEventListener("keydown", startGame, { once: true });
    }
}

backgroundWithGround.onload = imageLoaded;
playerImage.onload = imageLoaded;
playerImageLeft.onload = imageLoaded;
enemyImage.onload = imageLoaded;
enemyDeadImage.onload = imageLoaded;
enemyImage2.onload = imageLoaded;
enemyDeadImage2.onload = imageLoaded;
shooterImage.onload = imageLoaded;
barrelImage.onload = imageLoaded;
enemyImage3.onload = imageLoaded;
enemyDeadImage3.onload = imageLoaded;
