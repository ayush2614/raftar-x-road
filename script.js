const car = document.getElementById("car");
const enemies = document.querySelectorAll(".enemy");
const lines = document.querySelectorAll(".roadLine");
const coin = document.getElementById("coin");

const scoreText = document.getElementById("score");
const coinsText = document.getElementById("coins");
const highScoreText = document.getElementById("highScore");
const finalScore = document.getElementById("finalScore");
const finalCoins = document.getElementById("finalCoins");

const startScreen = document.getElementById("startScreen");
const pauseScreen = document.getElementById("pauseScreen");
const gameOverBox = document.getElementById("gameOver");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const pauseBtn = document.getElementById("pauseBtn");

let carLeft = 180;
let score = 0;
let coins = 0;

let speed = 4;
let maxSpeed = 13;
let speedIncrease = 0.0018;

let gameRunning = false;
let paused = false;

let highScore = localStorage.getItem("carHighScore") || 0;
highScoreText.textContent = highScore;

let keys = {
  ArrowLeft: false,
  ArrowRight: false
};

document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    keys[e.key] = true;
  }

  if (e.key.toLowerCase() === "p" && gameRunning) {
    togglePause();
  }
});

document.addEventListener("keyup", function(e) {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    keys[e.key] = false;
  }
});

leftBtn.addEventListener("touchstart", () => keys.ArrowLeft = true);
leftBtn.addEventListener("touchend", () => keys.ArrowLeft = false);
rightBtn.addEventListener("touchstart", () => keys.ArrowRight = true);
rightBtn.addEventListener("touchend", () => keys.ArrowRight = false);

leftBtn.addEventListener("mousedown", () => keys.ArrowLeft = true);
leftBtn.addEventListener("mouseup", () => keys.ArrowLeft = false);
rightBtn.addEventListener("mousedown", () => keys.ArrowRight = true);
rightBtn.addEventListener("mouseup", () => keys.ArrowRight = false);

if (pauseBtn) {
  pauseBtn.addEventListener("click", togglePause);
}

function startGame() {
  startScreen.style.display = "none";
  gameRunning = true;
  paused = false;
  gameLoop();
}

function togglePause() {
  if (!gameRunning) return;

  paused = !paused;
  pauseScreen.style.display = paused ? "flex" : "none";

  if (pauseBtn) {
    pauseBtn.textContent = paused ? "▶️" : "⏸";
  }

  if (!paused) {
    gameLoop();
  }
}

function increaseSpeedNaturally() {
  if (speed < maxSpeed) {
    speed += speedIncrease;
  }
}

function moveCar() {
  const gameWidth = document.getElementById("gameArea").offsetWidth;

  if (keys.ArrowLeft && carLeft > 10) {
    carLeft -= 7;
  }

  if (keys.ArrowRight && carLeft < gameWidth - 75) {
    carLeft += 7;
  }

  car.style.left = carLeft + "px";
}

function moveRoadLines() {
  lines.forEach(line => {
    let top = parseFloat(window.getComputedStyle(line).top);
    top += speed;

    if (top > window.innerHeight) {
      top = -120;
    }

    line.style.top = top + "px";
  });
}

function moveEnemies() {
  enemies.forEach(enemy => {
    let top = parseFloat(window.getComputedStyle(enemy).top);
    top += speed;

    if (top > window.innerHeight) {
      top = -220;
      enemy.style.left = randomLane() + "px";

      score += 10;
      scoreText.textContent = score;
    }

    enemy.style.top = top + "px";

    if (isCollide(car, enemy)) {
      endGame();
    }
  });
}

function moveCoin() {
  let top = parseFloat(window.getComputedStyle(coin).top);
  top += speed;

  if (top > window.innerHeight) {
    top = -300;
    coin.style.left = randomLane() + "px";
  }

  coin.style.top = top + "px";

  if (isCollide(car, coin)) {
    coins++;
    score += 25;

    coinsText.textContent = coins;
    scoreText.textContent = score;

    coin.style.top = "-300px";
    coin.style.left = randomLane() + "px";
  }
}

function randomLane() {
  const gameWidth = document.getElementById("gameArea").offsetWidth;
  return Math.floor(Math.random() * (gameWidth - 90) + 20);
}

function isCollide(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function gameLoop() {
  if (!gameRunning || paused) return;

  increaseSpeedNaturally();

  moveCar();
  moveRoadLines();
  moveEnemies();
  moveCoin();

  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("carHighScore", highScore);
    highScoreText.textContent = highScore;
  }

  finalScore.textContent = score;
  finalCoins.textContent = coins;
  gameOverBox.style.display = "flex";
}

function restartGame() {
  location.reload();
}