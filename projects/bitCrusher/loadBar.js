let animationFrame = 1;
let lastTime = 0;
function loadBar(timeStamp) {
  const timeElapsed = timeStamp - lastTime;
  if (timeElapsed >= 180) {
    lastTime = timeStamp;
    document.getElementById("loadBar").src =
      "assets/img/menu/loadBar/loadBar" + animationFrame.toString() + ".png";
    animationFrame++;
  }
  if (animationFrame > 14) {
    animationFrame = 1;
  }
  requestAnimationFrame(loadBar);
}
requestAnimationFrame(loadBar);
