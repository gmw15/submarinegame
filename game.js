let submarine = document.getElementById('submarine');
let gameScreen = document.getElementById('gameScreen');
let scoreElement = document.getElementById('score');
let upButton = document.getElementById('upButton');
let downButton = document.getElementById('downButton');
let counter = 0;
let obstacles = [];
let score = 0;
let moveUp = false;
let moveDown = false;
var isGameOver = false;

var backgroundMusic = new Audio('background.mp3'); // Replace with the path to your background music file
var backgroundMusicStarted = false;

function startGame() {
    isGameOver = false;
    score = 0;
    document.getElementById('submarine').style.backgroundImage = "url('submarine.png')";
    document.getElementById('gameScreen').innerHTML = '<div id="submarine"></div>';
    backgroundMusic.play();
    gameInterval = setInterval(moveGame, 30);
}

function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;
    document.getElementById('submarine').style.backgroundImage = "url('explosion.png')";
    document.getElementById('submarine').style.width = '200px';
    document.getElementById('submarine').style.height = '80px';
    var gameOverSound = new Audio('gameover.wav'); // Add your game over sound file url here
    gameOverSound.play();
    backgroundMusic.pause();
    setTimeout(function() {
        alert('Game Over! Your score was ' + Math.floor(score));
        window.location.reload();
    }, 100);
}

function gameLoop() {
  // Move submarine
  let top = parseInt(submarine.style.top);
  if (isNaN(top)) top = gameScreen.offsetHeight / 2;
  if (moveUp) top -= 5; 
  if (moveDown) top += 5; 
  submarine.style.top = `${top}px`;

  // Generate obstacles
  if (counter % 100 === 0) {
    let obstacleTop = document.createElement('div');
    obstacleTop.classList.add('obstacle');
    obstacleTop.style.top = '0';
    obstacleTop.style.height = `${Math.random() * gameScreen.offsetHeight / 2}px`;
    gameScreen.appendChild(obstacleTop);

    let obstacleBottom = document.createElement('div');
    obstacleBottom.classList.add('obstacle');
    obstacleBottom.style.bottom = '0';
    obstacleBottom.style.height = `${Math.random() * gameScreen.offsetHeight / 2}px`;
    gameScreen.appendChild(obstacleBottom);

    obstacles.push(obstacleTop);
    obstacles.push(obstacleBottom);
  }

  // Move obstacles
  for (let obstacle of obstacles) {
    let right = parseInt(obstacle.style.right);
    if (isNaN(right)) right = 0;
    right += 5;
    obstacle.style.right = `${right}px`;

    // Check collision
    let rect1 = submarine.getBoundingClientRect();
    let rect2 = obstacle.getBoundingClientRect();
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
      // Collision detected!
      gameOver();
    }

    // Check if obstacle has been successfully navigated and increase score
    if (!obstacle.passed && rect1.x > rect2.x + rect2.width) {
      obstacle.passed = true;
      //score++;
      score=score+0.5;
    }
  }

  // Cleanup offscreen obstacles
  while (obstacles.length > 0 && parseInt(obstacles[0].style.right) > gameScreen.offsetWidth) {
    gameScreen.removeChild(obstacles[0]);
    obstacles.shift();
  }

  // Update the score
  scoreElement.innerHTML = 'Score: ' + score;

  counter++;

}

function handleKey(event) {
  if (event.type === 'keydown') {
    if (event.code === 'ArrowUp') moveUp = true;
    if (event.code === 'ArrowDown') moveDown = true;
  } else if (event.type === 'keyup') {
    if (event.code === 'ArrowUp') moveUp = false;
    if (event.code === 'ArrowDown') moveDown = false;
  }
  backgroundMusic.play();
}

function moveSubmarineUp() {
    if (submarine.offsetTop > 0) { // Up
        submarine.style.top = (submarine.offsetTop - 10) + 'px';
    }
    if (!backgroundMusicStarted) {
        backgroundMusic.play().catch(function(error) {
            console.error("Failed to play:", error);
        });
        backgroundMusicStarted = true; // set the flag to true so the music doesn't start again
    }
}

function moveSubmarineDown() {
    if (submarine.offsetTop < gameScreen.offsetHeight - submarine.offsetHeight) { // Down
        submarine.style.top = (submarine.offsetTop + 10) + 'px';
    }
    if (!backgroundMusicStarted) {
        backgroundMusic.play().catch(function(error) {
            console.error("Failed to play:", error);
        });
        backgroundMusicStarted = true; // set the flag to true so the music doesn't start again
    }
}

document.addEventListener('keydown', handleKey);
document.addEventListener('keyup', handleKey);
document.getElementById('upBtn').addEventListener('click', moveSubmarineUp);
document.getElementById('downBtn').addEventListener('click', moveSubmarineDown);
let gameInterval = setInterval(gameLoop, 20);