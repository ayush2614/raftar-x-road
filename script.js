const gameArea = document.getElementById("gameArea");
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

let carLeft = 0;
let score = 0;
let coins = 0;

let speed = 4;
let maxSpeed = 13;
let speedIncrease = 0.0018;

let gameRunning = false;
let paused = false;
let animationId = null;

let highScore = localStorage.getItem("carHighScore") || 0;
highScoreText.textContent = highScore;

let keys = {
  left: false,
  right: false
};

function setInitialPositions() {
  const gameWidth = gameArea.offsetWidth;

  carLeft = gameWidth / 2 - car.offsetWidth / 2;
  car.style.left = "0px";
  car.style.transform = `translateX(${carLeft}px)`;

  enemies.forEach((enemy, index) => {
    enemy.style.left = randomLane() + "px";
    enemy.style.top = index === 0 ? "-180px" : "-520px";
  });

  coin.style.left = randomLane() + "px";
  coin.style.top = "-300px";
}

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;

  if (e.key.toLowerCase() === "p" && gameRunning) {
    togglePause();
  }
});

document.addEventListener("keyup", function (e) {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});

function holdButton(button, direction) {
  button.addEventListener("touchstart", function (e) {
    e.preventDefault();
    keys[direction] = true;
  });

  button.addEventListener("touchend", function (e) {
    e.preventDefault();
    keys[direction] = false;
  });

  button.addEventListener("touchcancel", function (e) {
    e.preventDefault();
    keys[direction] = false;
  });

  button.addEventListener("mousedown", function () {
    keys[direction] = true;
  });

  button.addEventListener("mouseup", function () {
    keys[direction] = false;
  });

  button.addEventListener("mouseleave", function () {
    keys[direction] = false;
  });
}

holdButton(leftBtn, "left");
holdButton(rightBtn, "right");

pauseBtn.addEventListener("click", togglePause);

function startGame() {
  startScreen.style.display = "none";
  pauseScreen.style.display = "none";
  gameOverBox.style.display = "none";

  score = 0;
  coins = 0;
  speed = 4;

  scoreText.textContent = score;
  coinsText.textContent = coins;

  setInitialPositions();

  gameRunning = true;
  paused = false;
  pauseBtn.textContent = "⏸";

  gameLoop();
}

function togglePause() {
  if (!gameRunning) return;

  paused = !paused;
  pauseScreen.style.display = paused ? "flex" : "none";
  pauseBtn.textContent = paused ? "▶️" : "⏸";

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
  const gameWidth = gameArea.offsetWidth;
  const carWidth = car.offsetWidth;

  if (keys.left && carLeft > 8) {
    carLeft -= 10;
  }

  if (keys.right && carLeft < gameWidth - carWidth - 8) {
    carLeft += 10;
  }

  car.style.transform = `translateX(${carLeft}px)`;
}

function moveRoadLines() {
  lines.forEach(line => {
    let top = parseFloat(line.style.top || window.getComputedStyle(line).top);
    top += speed;

    if (top > gameArea.offsetHeight) {
      top = -120;
    }

    line.style.top = top + "px";
  });
}

function moveEnemies() {
  enemies.forEach(enemy => {
    let top = parseFloat(enemy.style.top || window.getComputedStyle(enemy).top);
    top += speed;

    if (top > gameArea.offsetHeight) {
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
  let top = parseFloat(coin.style.top || window.getComputedStyle(coin).top);
  top += speed;

  if (top > gameArea.offsetHeight) {
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
  const gameWidth = gameArea.offsetWidth;
  return Math.floor(Math.random() * (gameWidth - 80) + 10);
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

  animationId = requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  cancelAnimationFrame(animationId);

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
  startGame();
}

window.addEventListener("resize", function () {
  if (!gameRunning) {
    setInitialPositions();
  }
});

setInitialPositions();