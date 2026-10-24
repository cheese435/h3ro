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

document.getElementById("tank").textContent = ("~".repeat(window.innerWidth < 600 ? 15 : 30))
let direction = 0
let pos = 1
setInterval(() => {
  const fish = ["><>", "<><"]
  const length = window.innerWidth < 600 ? 15 : 30
  document.getElementById("tank").textContent = ("~".repeat(pos) + fish[direction] + "~".repeat(length - pos - fish[direction].length))
  if (Math.floor(Math.random() * 20) == 1) {
  	if (direction == 0) direction++; else direction--;
  }
  if (direction == 0) pos++; else pos--;
  if (pos >= length - fish[direction].length) { pos = length - fish[direction].length; direction = 1 }
  if (pos <= 0) { pos = 0; direction = 0 }
}, 700)

const popup = document.getElementById("popup")
function showPopup(type) {
  popup.style.opacity = 1
  popup.style.pointerEvents = "all"
  popup.querySelector("#popupTitle").textContent = type
  document.getElementById("archives").style.visibility = "hidden"
  document.getElementById("projects").style.visibility = "hidden"
  document.getElementById("programs").style.visibility = "hidden"
  document.getElementById(type).style.visibility = "visible"
}

const banner = document.getElementById("banner")
const fadeIn = ["pins", "welcome", "hackatime"]
document.getElementById("profile").addEventListener("transitionend", (x) => {
  if (x.propertyName === "transform") {
    for (let i = 0; i < (fadeIn.length); i++) {
      element = document.getElementById(fadeIn[i])
      element.style.transitionDelay = (i * 0.3) + "s"
      element.style.opacity = 1
      element.style.transform = "translateY(0px)"
    }
    banner.style.transitionDelay = "2s"
    banner.classList.add("open")
  }
})

document.getElementById("lightSwitch").addEventListener("click", () => {
  const bgImg = document.getElementById("bgImg")
  const lightIcon = document.getElementById("lightIcon")
  if (document.documentElement.getAttribute("data-theme") == "light") {
    document.cookie = "theme=dark";
    document.documentElement.removeAttribute("data-theme");
    bgImg.src = "assets/img/dark.webp"
    lightIcon.style.maskImage = 'url("assets/img/lightIcon.webp")'
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    document.cookie = "theme=light";
    bgImg.src = "assets/img/light.webp"
    lightIcon.style.maskImage = 'url("assets/img/darkIcon.webp")'
  }
})
let bannerOn = true
document.getElementById("hideBanner").addEventListener("click", () => {
  const downIcon = document.getElementById("downIcon")
  banner.style.transitionDelay = "0s"
  if (bannerOn == true) {
    bannerOn = false
    downIcon.style.transform = "rotate(180deg)"
  } else {
    bannerOn = true
    downIcon.style.transform = "rotate(0deg)"
  }
  banner.classList.toggle("open")
})
document.getElementById("exitHolder").addEventListener("click", () => {
  popup.style.opacity = 0
  popup.style.pointerEvents = "none"
});

if (document.cookie) {
  if (document.cookie == "theme=light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

//fetch hackatime data

(async function () {
  try {
    const startTime = new Date(Date.now() - 364 * 24 * 60 * 60 * 1000)
    const response = await fetch("/api/hackatime/summaries?start=" + startTime.toISOString().slice(0, 10) + "&end=" + new Date().toISOString().slice(0, 10))
    if (!response.ok) {
      throw new Error("Status: " + response.status)
    }
    const data = await response.json()

    const totalTime = data.cumulative_total.text.split(" ").slice(0, -1).join(" ")
    const timeToday = data.data[data.data.length - 1].grand_total.text.split(" ").slice(0, -1).join(" ")
    document.getElementById("totalTime").textContent = totalTime
    document.getElementById("timeToday").textContent = timeToday

    // TOTAL DAY AND STREAK CHECK LOOP
    let days = 0
    for (const d of data.data) {
      if (d.grand_total.total_seconds > 0) {
        days++
      }
    }
    document.getElementById("daysCoded").textContent = days + " days"

    let streak = 0
    for (let i = data.data.length - 1; i >= 0; i = i - 1) {
      if (i === data.data.length - 1 && data.data[i].grand_total.total_seconds === 0) {
        continue
      }
      if (data.data[i].grand_total.total_seconds > 0) {
        streak++
      } else {
        break
      }
    }
    document.getElementById("streak").textContent = streak + " days"

    // get this project
    const projectResponse = await fetch("/api/hackatime/summaries?start=" + startTime.toISOString().slice(0, 10) + "&end=" + new Date().toISOString().slice(0, 10) + "&project=h3ro-dev")
    if (!projectResponse.ok) {
      throw new Error("Status: " + projectResponse.status)
    }
    const projectData = await projectResponse.json()
    const projectTime = projectData.cumulative_total.text.split(" ").slice(0, -1).join(" ") + " - 0% ai code <3"
    document.getElementById("websiteTime").textContent = projectTime
  } catch (error) {
    console.warn("OH NO! Http error when getting hackatime data! ", error)
    for (const el of document.getElementsByClassName("hackatimeInfo")) {
      el.textContent = "something went wrong  :("
    }
  }
})();
