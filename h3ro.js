// Made for Terra! (https://terra.hackclub.com/)
const chars = "1234567890!@#$%^&*()-=_+[]{}~<>/?!@#$%&*()qwertyuiopasdfghjklzxcvbnm"
function reveal(element, endText) {
  let lastTimeRec = 0
  let runs = 0
  function runFrame(time) {
    const timeSinceRan = time - lastTimeRec
    if (timeSinceRan >= 50) {
      runs++
      element.textContent = endText.slice(0, endText.length - (endText.length - Math.floor(runs/10)))
      for (let i = 0; i < (endText.length - Math.floor(runs/10)); i++) {
        element.textContent += chars.split("")[Math.floor(Math.random() * chars.length)]
      }
      lastTimeRec = time
    }
    if (!(Math.floor(runs / 10) >= endText.length)) {
      requestAnimationFrame(runFrame)
    }
  }
  requestAnimationFrame(runFrame)
}
reveal(document.getElementById("username"), "hero")

let direction = 0
let pos = 1
setInterval(() => {
  const fish = ["><>", "<><"]
  const length = 20
  document.getElementById("tank").textContent = ("~".repeat(pos) + fish[direction] + "~".repeat(length - pos - fish[direction].length))
  if (Math.floor(Math.random() * 20) == 1) {
  	if (direction == 0) direction++; else direction--;
  }
  if (direction == 0) pos++; else pos--;
  if (pos >= length - fish[direction].length) { pos = length - fish[direction].length; direction = 1 }
  if (pos <= 0) { pos = 0; direction = 0 }
}, 700)

const fadeIn = ["pins", "welcome", "hackatime"]
document.getElementById("profile").addEventListener('transitionend', (x) => {
  if (x.propertyName === "transform") {
    for (let i = 0; i < (fadeIn.length); i++) {
      element = document.getElementById(fadeIn[i])
      element.style.transitionDelay = (i * 0.3) + "s"
      element.style.opacity = 1
      element.style.transform = "translateY(0px)"
    }
    element = document.getElementById("banner")
    element.style.transitionDelay = "2s"
    element.style.opacity = 1
    element.style.transform = "translateY(0px)"
  }
})
