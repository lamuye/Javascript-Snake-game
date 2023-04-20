
const gameBoard = document.querySelector("#canvas");
let lastRenderTime = 0;
const SNAKE_SPEED = 10;
const Grid_SIZE = 21
const snakeBody = [{ x: 3, y: 5 }];
let inputDirection = { x: 0, y: 0 };
let food = getRandomFoodPosition();
const EXPANTION_RATE = 1;
let newSegments = 0;
let gameOver = false
function main(currentTime) {
  if (gameOver) {
    if (confirm('You lost. Press ok to restart.')) {
      window.location = '/'
    }
    return
  }
  window.requestAnimationFrame(main);
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;
  console.log("render");
  update();
  draw();
  lastRenderTime = currentTime;
}
window.requestAnimationFrame(main);

window.addEventListener("keydown", (ev) => {
  switch (ev.key) {
    case "ArrowUp":
      inputDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      inputDirection = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      inputDirection = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      inputDirection = { x: 1, y: 0 };
      break;

    default:
      break;
  }
});

function update() {
  addSegments();
  if (onSnake(food)) {
    expandSnake(EXPANTION_RATE);
    food = getRandomFoodPosition()
  }
}

function draw() {
  drawSnake();
  drawFood();
  checkDeath()
}

function drawSnake() {
  gameBoard.innerHTML = "";
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;

  snakeBody.forEach((segment) => {
    const snakeELement = document.createElement("div");
    snakeELement.style.gridColumnStart = segment.x;
    snakeELement.style.gridRowStart = segment.y;
    snakeELement.classList.add("snake");
    gameBoard.appendChild(snakeELement);
  });
}
function drawFood() {
  const foodElement = document.createElement("div");
  foodElement.style.gridColumnStart = food.x;
  foodElement.style.gridRowStart = food.y;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
}

function expandSnake(amount) {
  newSegments += amount;
}
function onSnake(position, { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) return false;
    return equalPostion(segment, position);
  });
}

function equalPostion(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

function addSegments() {
  for (let i = 0; i < newSegments; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegments = 0;
}

function getRandomFoodPosition() {
  let newFoodPostion 
  while (newFoodPostion == null || onSnake(newFoodPostion)) {
   newFoodPostion = randomGridPosition() 
   return newFoodPostion
  }
}

function randomGridPosition() {
  return {
    x:Math.floor(Math.random() * Grid_SIZE ) + 1,
    y:Math.floor(Math.random() * Grid_SIZE ) + 1
  }
}

function checkDeath(){
  gameOver = outsideGrid(getSnakeHead()) || snakeInteraction()
}
function getSnakeHead(){
  return snakeBody[0];
}

function outsideGrid(position){
  return (
    position.x < 1 || position.x > Grid_SIZE ||
    position.y < 1 || position.y > Grid_SIZE
  )
}
function snakeInteraction(){
  return onSnake(snakeBody[0],{ ignoreHead: true})
}