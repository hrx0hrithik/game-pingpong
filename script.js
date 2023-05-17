//Update loop
import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

const ball = new Ball(document.getElementById("ball"));
const playerPaddle = new Paddle(document.getElementById("player-paddle"));
const computerPaddle = new Paddle(document.getElementById("computer-paddle"));
const playerScoreElem = document.getElementById("player-score");
const playerScoreElem1 = document.getElementById("player-score1");
const computerScoreElem = document.getElementById("computer-score");
const computerScoreElem1 = document.getElementById("computer-score1");
const resetBtn = document.getElementById("reset");
const pauseBtn = document.getElementById("pause")
const pauseScreen = document.getElementById("pause-screen")

let lastTime;

resetBtn.addEventListener("click", reset);

function reset() {
    ball.reset()
    computerPaddle.reset()
    playerScoreElem.textContent = 0
    computerScoreElem.textContent = 0
}

let isPause = false ;
var rfid;

function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()], isPause);
    // Update code
    computerPaddle.update(delta, ball.y);
    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    );

    document.documentElement.style.setProperty("--hue", hue + delta * 0.01);

    if (isLose()) handleLose();
  }
  lastTime = time;
  rfid = window.requestAnimationFrame(update);
}

function isLose() {
  const rect = ball.rect();
  return rect.right >= window.innerWidth || rect.left <= 0;
}

function handleLose() {
  const rect = ball.rect();
  if (rect.right >= window.innerWidth && isPause === false) {
    playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1;
    playerScoreElem1.textContent = parseInt(playerScoreElem.textContent);
  } else {
    computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1;
    computerScoreElem1.textContent = parseInt(computerScoreElem.textContent);
  }

  ball.reset();
  computerPaddle.reset();
}
document.addEventListener("mousemove", positionPaddle)
function positionPaddle(e) {
  playerPaddle.position = (e.y / window.innerHeight) * 100;
};

function removeHandler() {
  document.removeEventListener("mousemove", positionPaddle)
}

pauseBtn.addEventListener("click", function() {
  isPause = !isPause;
    console.log(isPause)
    if(isPause) {
      removeHandler()
      window.cancelAnimationFrame(rfid)
      ball.ballPause();
      pauseScreen.style.setProperty("display", "flex")
      pauseBtn.innerText = "Resume"
      pauseBtn.style.setProperty("color", "white")
      pauseBtn.style.setProperty("opacity", "1")
    }
    else{
      pauseScreen.style.setProperty("display", "none")
      ball.ballPlay()
      document.addEventListener("mousemove", positionPaddle)
      window.requestAnimationFrame(update)
      pauseBtn.innerText = "Pause"
      pauseBtn.style.setProperty("color", "var(--foreground-color)")
      pauseBtn.style.setProperty("opacity", "0.7")

    }
})
window.requestAnimationFrame(update);
