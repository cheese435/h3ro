//Note: If you want downloads to work correct do this:
// python -m http.server 8000 in the BitCrusher folder

//STATS
let totalWindowsClosed = 0;
let currentOpenWindows = 0;
let currentWindows = 0;
let totalMoneySpent = 0;
let totalMoneyEarned = 0;
let money = 0;
let shopItemsBought = 0;
let phaseNum = 1;

let windowItem = document.getElementById("window");
let bodyContainer = document.getElementById("bodyContainer");
let moneyItem = document.getElementById("mainMoney");
let moneyCounterText = document.getElementById("moneyDisplayText");
let moneyCounterImage = document.getElementById("moneyDisplay");
let virusX = 0;
let virusY = 0;
let finalUnlocked = false;
let allowClick = false;
let allowHover = false;
let allowBuying = false;
let windowsDefender = false;
let virusOpacity = 1;
let memoryBarHeight = 0;
let stopLoops = false;
let animationFrame = 0;
let windowsMadeThisStorm = 0;
let randomSelectionsThisPhase = 0;
let loop = 0;
let phase = "phase1";
let moneyCount = 0;
let lastState = "none";
let time2Wait = 0;
let mouseX = 0;
let mouseY = 0;
let lastTime = 0;
let lastTimeMoneyAnimation = 0;
let timeElapsedMoneyAnimation = 0;
let moneyRotation = 0;
let lastTimeMoney = 0;
let windowMake = 0;
let textIdsToShrink = [];
let moneyRotationForward = true;
let virusElement = document.getElementById("virusElement");
let virus = "noneSelected";
let state = "none";
const bonziPhaseEffects = {
  //0: amount of windows to make per window storm
  //1: time per window (window storm) (in ms)
  //2: amount of random things before moving on to window storm
  //3: money gained from ending phase
  //4: effects possible with randomState
  phase1: [30, 1000, 2, 150, ["juggle", "download"]],
  phase2: [50, 750, 4, 300, ["juggle", "download", "teleport"]],
  phase3: [90, 550, 6, 500, ["juggle", "download", "teleport", "moveThings"]],
  phase4: [
    100,
    450,
    8,
    700,
    ["juggle", "download", "teleport", "moveThings", "rapidTeleport"],
  ],
  phase5: [120, 400, 10, 0, ["teleport", "moveThingsWs", "rapidTeleport"]],
};
const clippyPhaseEffects = {
  phase1: [30, 800, 2, 100, ["askQuestion", "download"]],
  phase2: [50, 700, 4, 250, ["askQuestion", "download", "teleport"]],
  phase3: [
    90,
    550,
    6,
    650,
    ["askQuestion", "download", "teleport", "moveThings", "spin"],
  ],
  phase4: [100, 450, 8, 800, ["teleport", "moveThings", "spin"]],
  phase5: [120, 350, 10, 0, ["rapidTeleport", "moveThingsWs", "spin"]],
};
let shopBuffs = {
  windowMoveSpeed: 20,
  desktopItemSuffleSpeed: 480, //base 480 as there are 480ms in a frame for this animation, to add one frame simply add 480
  moneyGainMultiplier: 1,
  moneyGainFromWindowsBase: 2,
  moneyGainFromMovingWindowsBase: 10,
  moneyGainFromTextboxBase: 1,
  moneyGainFromNoDownloads: 0, //for makeNewWindow, always will be 0 or else no one will ever use the downloads lol
  windowStormLessWindows: 0, //window storm window amount - windowStormLessWindows
  windowStormTimeBetweenWindows: 0, //window storm time per windows (ms) + windowStormTimeBetweenWindows
  memoryIncrease: 1, //calculation is currentOpenWindows / memoryIncrease
};
const stateSpeeds = {
  //BonziBuddy
  bonziWave: 180, // ms per frame
  bonzijump: 180,
  bonzijuggle: 180,
  bonziTeleport: 80,
  bonziRapidTeleport: 20,
  //clippit/clippy
  clippyZoom: 180,
  clippySpin: 100,
  clippyBike: 180,
  clippyTeleport: 80,
  clippyRapidTeleport: 20,
};
const phaseEffectsMap = {
  bonzi: bonziPhaseEffects,
  clippy: clippyPhaseEffects,
};
let settingsData = {
  downloads: true,
  sound: true,
};

document.addEventListener("mousemove", function (event) {
  //adds listener for mouse movement
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function downloadFile(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const globalStates = [
  "windowStorm",
  "selectRandom",
  "teleport",
  "rapidTeleport",
  "normal",
  "moveThings",
  "moveThingsWs",
  "download",
];
function startMainLoop(timeStamp) {
  const timeElapsed = timeStamp - lastTime;
  if (globalStates.includes(state)) {
    if (
      state == "windowStorm" &&
      timeElapsed >= phaseEffectsMap[virus][phase][1]
    ) {
      lastTime = timeStamp;
      windowsMadeThisStorm++;
      if (virus == "clippy") {
        if (Math.floor(Math.random() * 3) + 1 == 3) {
          if (Math.floor(Math.random() * 2) + 1 == 1) {
            makeMovingWindow();
          } else {
            makeBombWindow();
          }
        } else {
          makeNewWindow(
            "assets/img/desktop/popups/" +
              (Math.round(Math.random() * 4) + 1).toString() +
              ".png",
            "assets/snd/notify" +
              (Math.round(Math.random() * 2) + 1).toString() +
              ".mp3",
            "moneyGainFromWindowsBase",
          );
        }
      } else {
        if (Math.floor(Math.random() * 5) + 1 == 3) {
          if (Math.floor(Math.random() * 2) + 1 == 1) {
            makeMovingWindow();
          } else {
            makeBombWindow();
          }
        } else {
          makeNewWindow(
            "assets/img/desktop/popups/" +
              (Math.round(Math.random() * 4) + 1).toString() +
              ".png",
            "assets/snd/notify" +
              (Math.round(Math.random() * 2) + 1).toString() +
              ".mp3",
            "moneyGainFromWindowsBase",
          );
        }
      }
      if (windowsMadeThisStorm >= phaseEffectsMap[virus][phase][0]) {
        if (phase == "phase5") {
          if (finalUnlocked != true) {
            importantNotify(
              "a new item has appeared in the shop... maybe this will help you defeat " +
                virus +
                "!",
            );
            finalUnlocked = true;
            if (
              document.getElementById("shopSpan").style.visibility == "visible"
            ) {
              let unlock = document.getElementById("shopItem9");
              unlock.style.visibility = "visible";
            }
          }
          randomSelectionsThisPhase = 0;
          lastState = state;
          windowsMadeThisStorm = 0;
          state = "selectRandom";
        } else {
          money +=
            phaseEffectsMap[virus][phase][3] * shopBuffs.moneyGainMultiplier;
          totalMoneyEarned +=
            phaseEffectsMap[virus][phase][3] * shopBuffs.moneyGainMultiplier;
          randomSelectionsThisPhase = 0;
          importantNotify(
            "You have defeated a phase and earned $" +
              (
                phaseEffectsMap[virus][phase][3] * shopBuffs.moneyGainMultiplier
              ).toString() +
              "!",
          );
          phaseNum++;
          phase = "phase" + (Number(phase.slice(5, 6)) + 1).toString(); //phase = current phase + 1
          lastState = state;
          windowsMadeThisStorm = 0;
          moneyCounterText.textContent = "$" + money.toString();
          state = "selectRandom";
        }
      }
    } //window storm
    if (state == "selectRandom") {
      if (randomSelectionsThisPhase >= phaseEffectsMap[virus][phase][2]) {
        state = "windowStorm";
      } else {
        let possibleRandomStates = phaseEffectsMap[virus][phase][4];
        let filteredRandomStates = possibleRandomStates.filter(
          (randomState) => randomState != lastState,
        );
        state =
          filteredRandomStates[
            Math.floor(Math.random() * filteredRandomStates.length)
          ];
        randomSelectionsThisPhase++;
        windowMake = 0;
      }
    }
    if (state == "teleport" && timeElapsed >= stateSpeeds[virus + "Teleport"]) {
      if (animationFrame == 5) {
        if (virus == "clippy") {
          if (Math.floor(Math.random() * 3) + 1 == 3) {
            if (Math.floor(Math.random() * 2) + 1 == 1) {
              makeMovingWindow();
            } else {
              makeBombWindow();
            }
          } else {
            makeNewWindow(
              "assets/img/desktop/popups/" +
                (Math.round(Math.random() * 4) + 1).toString() +
                ".png",
              "assets/snd/error-trimmed.mp3",
              "moneyGainFromWindowsBase",
            );
          }
        }
        //if already fully transparent, make visible
        virusX = Math.floor(Math.random() * 81); //0-80 range (including 0 & 80)
        virusY = Math.floor(Math.random() * 81);
        virusElement.style.right = virusX + "%";
        virusElement.style.bottom = virusY + "%";
      }
      if (animationFrame >= 5) {
        virusOpacity += 0.2;
        if (animationFrame >= 10) {
          if (virus == "bonzi") {
            //then begin jumping
            animationFrame = -1; //-1 since it gets added after this
            state = "jump";
          } else {
            state = "selectRandom";
          }
        }
      } else {
        //else, make invisible
        virusOpacity -= 0.2;
      }
      lastTime = timeStamp;
      animationFrame++;
      virusElement.style.opacity = virusOpacity.toString();
    } //teleport
    if (
      state == "rapidTeleport" &&
      timeElapsed >= stateSpeeds[virus + "RapidTeleport"]
    ) {
      if (animationFrame == 5) {
        //if already fully transparent, make visible
        virusX = Math.floor(Math.random() * 81); //0-80 range (including 0 & 80)
        virusY = Math.floor(Math.random() * 81);
        virusElement.style.right = virusX + "%";
        virusElement.style.bottom = virusY + "%";
      }
      if (animationFrame >= 5) {
        virusOpacity += 0.2;
        if (animationFrame >= 10) {
          animationFrame = -1;
          if (loop == 5) {
            if (virus == "bonzi") {
              state = "jump";
            } else {
              state = "selectRandom";
            }
            loop = 0;
          }
          loop++;
        }
      } else {
        //else, make invisible
        virusOpacity -= 0.2;
      }
      lastTime = timeStamp;
      animationFrame++;
      virusElement.style.opacity = virusOpacity.toString();
      windowMake++;
      if (virus == "clippy") {
        if (windowMake % 3 == 0) {
          makeNewWindow(
            "rapid",
            "assets/snd/error-trimmed.mp3",
            "moneyGainFromTextboxBase",
          );
        }
      } else {
        if (windowMake % 6 == 0) {
          makeNewWindow(
            "rapid",
            "assets/snd/error-trimmed.mp3",
            "moneyGainFromTextboxBase",
          );
        }
      }
    } //rapid teleport
    if (state == "normal") {
      if (virus == "bonzi") {
        virusElement.src = "assets/img/bonzi/bonziBuddy.png";
      } else {
        virusElement.src = "assets/img/clippy/clippy.png";
      }
    }
    if (
      state == "moveThings" &&
      timeElapsed >= shopBuffs.desktopItemSuffleSpeed
    ) {
      windowMake++;
      animationFrame++;
      lastTime = timeStamp;
      if (virus == "bonzi") {
        virusElement.src = "assets/img/bonzi/bonziFinished.png";
      } else {
        virusElement.src = "assets/img/clippy/expressions/stare/careless.png";
        if (windowMake % 4 == 0) {
          if (Math.floor(Math.random() * 3) + 1 == 3) {
            if (Math.floor(Math.random() * 2) + 1 == 1) {
              makeMovingWindow();
            } else {
              makeBombWindow();
            }
          } else {
            makeNewWindow(
              "assets/img/desktop/popups/" +
                (Math.round(Math.random() * 4) + 1).toString() +
                ".png",
              "assets/snd/error-trimmed.mp3",
              "moneyGainFromWindowsBase",
            );
          }
        }
      }
      let toMove = document.getElementsByClassName("icon");
      for (let elementToMove of toMove) {
        let randomInt = Math.floor(Math.random() * 100 + 1);
        elementToMove.style.right = randomInt.toString() + "%";
        randomInt = Math.floor(Math.random() * 100 + 1);
        elementToMove.style.bottom = randomInt.toString() + "%";
      }
      if (animationFrame == 20) {
        state = "selectRandom";
        lastTime = timeStamp;
        animationFrame = 0;
        lastState = state;
      }
    } //move things
    if (
      state == "moveThingsWs" &&
      timeElapsed >= shopBuffs.desktopItemSuffleSpeed / 2
    ) {
      if (windowMake % 2 == 0) {
        if (virus == "clippy") {
          if (Math.floor(Math.random() * 3) + 1 == 3) {
            if (Math.floor(Math.random() * 2) + 1 == 1) {
              makeMovingWindow();
            } else {
              makeBombWindow();
            }
          } else {
            makeNewWindow(
              "assets/img/desktop/popups/" +
                (Math.round(Math.random() * 4) + 1).toString() +
                ".png",
              "assets/snd/error-trimmed.mp3",
              "moneyGainFromWindowsBase",
            );
          }
        } else {
          if (Math.floor(Math.random() * 5) + 1 == 3) {
            if (Math.floor(Math.random() * 2) + 1 == 1) {
              makeMovingWindow();
            } else {
              makeBombWindow();
            }
          } else {
            makeNewWindow(
              "assets/img/desktop/popups/" +
                (Math.round(Math.random() * 4) + 1).toString() +
                ".png",
              "assets/snd/error-trimmed.mp3",
              "moneyGainFromWindowsBase",
            );
          }
        }
      }
      windowMake++;
      animationFrame++;
      lastTime = timeStamp;
      if (virus == "bonzi") {
        virusElement.src = "assets/img/bonzi/bonziFinished.png";
      } else {
        virusElement.src = "assets/img/clippy/expressions/stare/careless.png";
      }
      let toMove = document.getElementsByClassName("icon");
      for (let elementToMove of toMove) {
        let randomInt = Math.floor(Math.random() * 100 + 1);
        elementToMove.style.right = randomInt.toString() + "%";
        randomInt = Math.floor(Math.random() * 100 + 1);
        elementToMove.style.bottom = randomInt.toString() + "%";
      }
      if (animationFrame == 20) {
        lastTime = timeStamp;
        animationFrame = 0;
        lastState = state;
        state = "selectRandom";
      }
    } //move things ws
    if (state == "download") {
      lastState = state;
      state = "selectRandom";
      if (settingsData.downloads == true) {
        file2Download = Math.floor(Math.random() * 5 + 1);
        if (file2Download == 1) {
          if (virus == "bonzi") {
            downloadFile(
              "assets/img/bonzi/downloads/BonziBuddy.exe",
              "BonziBuddy.exe",
            );
          } else {
            downloadFile(
              "assets/img/bonzi/downloads/BonziBuddy.exe",
              "Clippy.exe",
            );
          }
        }
        if (file2Download == 2) {
          downloadFile(
            "assets/img/bonzi/downloads/AntiVirus.setup",
            "AntiVirus.setup",
          );
        }
        if (file2Download == 3) {
          downloadFile("assets/img/bonzi/downloads/win.11", "win.11");
        }
        if (file2Download == 4) {
          downloadFile(
            "assets/img/bonzi/downloads/IPAddress.txt",
            "IP Address.txt",
          );
        }
        if (file2Download == 5) {
          downloadFile(
            "assets/img/bonzi/downloads/GoogleChrome.exe",
            "Google Chrome.exe",
          );
        }
      } else {
        makeNewWindow(
          "assets/img/desktop/popups/downloadsOff.png",
          "assets/snd/chord.mp3",
          "moneyGainFromNoDownloads",
        );
      }
    }
  } else {
    if (virus == "bonzi") {
      if (state == "none") {
        virusX = 50;
        virusY = 50;
        virusElement.style.right = virusX.toString() + "%";
        virusElement.style.bottom = virusY.toString() + "%";
        virusElement.style.width = "15%";
        virusElement.style.visibility = "visible";
        virusElement.src = "assets/img/bonzi/bonziBuddy.png";
        lastTime = timeStamp;
        state = "wave";
      }

      if (state == "wave" && timeElapsed >= stateSpeeds.bonziWave) {
        animationFrame++;
        lastTime = timeStamp;
        virusElement.src =
          "assets/img/bonzi/wave/bonziWave" +
          animationFrame.toString() +
          ".png";
        if (animationFrame == 6) {
          animationFrame = 0;
          lastTime = timeStamp;
          virusElement.src = "assets/img/bonzi/bonziBuddy.png";
          makeBossWindow("bonzi");
          state = "normal";
        }
      }

      if (state == "jump" && timeElapsed >= stateSpeeds.bonzijump) {
        if (virusY - 10 > 0 || virusY - 10 == 0) {
          animationFrame++;
          lastTime = timeStamp;
          virusElement.src =
            "assets/img/bonzi/jump/bonziJump" +
            animationFrame.toString() +
            ".png";
          if (animationFrame == 10) {
            virusY = virusY - 10;
            virusElement.style.bottom = virusY.toString() + "%";
            if (settingsData.sound == true) {
              const newSound = new Audio("assets/snd/bonzi/bonziThud.mp3");
              newSound.play();
            }
          }
          if (animationFrame == 13) {
            animationFrame = 0;
            if (virusY - 10 < 0) {
              lastState = state;
              state = "selectRandom";
              lastTime = timeStamp;
            }
          }
        } else {
          lastState = state;
          state = "selectRandom";
          lastTime = timeStamp;
        }
      }

      if (state == "juggle" && timeElapsed >= stateSpeeds.bonzijuggle) {
        animationFrame++;
        lastTime = timeStamp;
        virusElement.src =
          "assets/img/bonzi/juggle/bonziJuggle" +
          animationFrame.toString() +
          ".png";
        if (animationFrame == 13) {
          animationFrame = 9;
          loop++;
          if (loop % 2 == 0) {
            if (Math.floor(Math.random() * 5) + 1 == 3) {
              if (Math.floor(Math.random() * 2) + 1 == 1) {
                makeMovingWindow();
              } else {
                makeBombWindow();
              }
            } else {
              makeNewWindow(
                "assets/img/desktop/popups/" +
                  (Math.round(Math.random() * 4) + 1).toString() +
                  ".png",
                "assets/snd/notify" +
                  (Math.round(Math.random() * 2) + 1).toString() +
                  ".mp3",
                "moneyGainFromWindowsBase",
              );
            }
          }
          if (loop >= 5) {
            lastState = state;
            state = "selectRandom";
            animationFrame = 0;
            loop = 0;
            lastTime = timeStamp;
          }
        }
      }
    } else {
      if (virus == "clippy") {
        if (state == "none") {
          virusX = 50;
          virusY = 50;
          virusElement.style.right = virusX.toString() + "%";
          virusElement.style.bottom = virusY.toString() + "%";
          virusElement.style.width = "15%";
          virusElement.style.visibility = "visible";
          virusElement.src = "assets/img/clippy/clippy.png";
          lastTime = timeStamp;
          state = "zoom";
        }

        if (state == "zoom" && timeElapsed >= stateSpeeds.clippyZoom) {
          animationFrame++;
          lastTime = timeStamp;
          virusElement.src =
            "assets/img/clippy/zoom/clippyZoom" +
            animationFrame.toString() +
            ".png";
          if (animationFrame == 18) {
            animationFrame = 0;
            lastTime = timeStamp;
            virusElement.src = "assets/img/clippy/clippy.png";
            makeBossWindow("clippy");
            state = "normal";
          }
        }

        if (state == "spin" && timeElapsed >= stateSpeeds.clippySpin) {
          animationFrame++;
          lastTime = timeStamp;
          virusElement.src =
            "assets/img/clippy/spin/clippySpin" +
            animationFrame.toString() +
            ".png";
          virusX += Math.floor(Math.random() * 9) - 3;
          virusY += Math.floor(Math.random() * 9) - 3;
          if (virusX < 30) {
            virusX = 35;
          }
          if (virusY < 30) {
            virusY = 35;
          }
          if (virusX > 50) {
            virusX = 45;
          }
          if (virusY > 50) {
            virusY = 45;
          }
          virusElement.style.right = virusX.toString() + "%";
          virusElement.style.bottom = virusY.toString() + "%";
          if (animationFrame % 3 == 0) {
            if (Math.floor(Math.random() * 5) != 0) {
              if (Math.floor(Math.random() * 3) + 1 == 3) {
                if (Math.floor(Math.random() * 2) + 1 == 1) {
                  makeMovingWindow();
                } else {
                  makeBombWindow();
                }
              } else {
                makeNewWindow(
                  "assets/img/desktop/popups/" +
                    (Math.round(Math.random() * 4) + 1).toString() +
                    ".png",
                  "assets/snd/notify" +
                    (Math.round(Math.random() * 2) + 1).toString() +
                    ".mp3",
                  "moneyGainFromWindowsBase",
                );
              }
            }
          }
          if (animationFrame == 23) {
            loop++;
            animationFrame = 2;
          }
          if (loop >= 4) {
            lastState = state;
            state = "selectRandom";
            animationFrame = 0;
            loop = 0;
            lastTime = timeStamp;
          }
        }

        if (state == "askQuestion") {
          virusElement.src = "assets/img/clippy/clippy.png";
          makeSpeechBubble();
          lastState = state;
          state = "normal";
          lastTime = timeStamp;
        }
      } else {
        console.log("Error! startMainLoop virus type is invalid!");
      }
    }
  }
  if (stopLoops != true) {
    requestAnimationFrame(startMainLoop);
  }
}

function importantNotify(text) {
  let notify = document.getElementById("notify");
  notify.textContent = text;
  notify.style.visibility = "visible";
}

function clickedVirus(type) {
  if (allowClick != false) {
    virus = type;
    if (virus == "bonzi") {
      let toHide = document.getElementsByClassName("virus");
      for (let elementToHide of toHide) {
        elementToHide.style.visibility = "hidden";
      }
      if (settingsData.sound == true) {
        const newSound = new Audio("assets/snd/bonzi/bonziHello.mp3");
        newSound.play();
      }
      requestAnimationFrame(startMainLoop);
    } else {
      if (virus == "clippy") {
        let toHide = document.getElementsByClassName("virus");
        for (let elementToHide of toHide) {
          elementToHide.style.visibility = "hidden";
        }
        if (settingsData.sound == true) {
          const newSound = new Audio("assets/snd/print-complete.mp3");
          newSound.play();
        }
        requestAnimationFrame(startMainLoop);
      } else {
        console.log("Error! clickedVirus type is invalid!");
      }
    }
  }
}

function makeBossWindow(type) {
  const newWindow = windowItem.cloneNode(true);
  currentWindows++;
  currentOpenWindows++;
  const currentWindowString = currentWindows.toString();
  newWindow.id = "window" + currentWindowString;
  const randomX = Math.floor(Math.random() * 20) + 1;
  const randomY = Math.floor(Math.random() * 20) + 40;
  let bonziWindowNum = 1;
  newWindow.style.right = randomX.toString() + "%";
  newWindow.style.bottom = randomY.toString() + "%";
  newWindow.style.width = "15%";
  newWindow.style.visibility = "visible";
  newWindow.src = "assets/img/" + type + "/notify/1.png";
  if (settingsData.sound == true) {
    const newSound = new Audio("assets/snd/notify1.mp3");
    newSound.play();
  }
  newWindow.onclick = function removeWindow() {
    if (stopLoops != true) {
      if (bonziWindowNum == 5) {
        newWindow.remove();
        currentOpenWindows--;
        totalWindowsClosed++;
        if (type == "bonzi") {
          state = "jump";
        } else if (type == "clippy") {
          state = "spin";
        }
      } else {
        bonziWindowNum++;
        newWindow.src =
          "assets/img/" +
          type +
          "/notify/" +
          bonziWindowNum.toString() +
          ".png";
        if (settingsData.sound == true) {
          const newSound = new Audio("assets/snd/notify1.mp3");
          newSound.play();
        }
      }
      gainMoney(shopBuffs.moneyGainFromTextboxBase);
    }
  };
  bodyContainer.append(newWindow);
}

function makePhasePopup() {
  const newWindow = windowItem.cloneNode(true);
  currentWindows++;
  const currentWindowString = currentWindows.toString();
  newWindow.id = "window" + currentWindowString;
  newWindow.src = "assets/img/desktop/popups/phase.png";
  newWindow.style.left = "1%";
  newWindow.style.bottom = "6%";
  newWindow.style.visibility = "visible";
  if (settingsData.sound == true) {
    const newSound = new Audio("assets/snd/click2.mp3");
    newSound.play();
  }
  newWindow.onclick = function removeWindow() {
    if (stopLoops != true) {
      newWindow.remove();
    }
  };
  bodyContainer.append(newWindow);
}

function makeSpeechBubble() {
  const newWindow = windowItem.cloneNode(true);
  currentWindows++;
  currentOpenWindows++;
  const currentWindowString = currentWindows.toString();
  newWindow.id = "speechBubble" + currentWindowString;
  newWindow.style.right = (virusX + 8).toString() + "%";
  newWindow.style.bottom = (virusY + 15).toString() + "%";
  newWindow.style.width = "10%";
  newWindow.style.visibility = "visible";
  newWindow.src = "assets/img/clippy/notify/bubblePopup.png";
  if (settingsData.sound == true) {
    const newSound = new Audio("assets/snd/error.mp3");
    newSound.play();
  }
  newWindow.onclick = function removeWindow() {
    if (stopLoops != true) {
      newWindow.remove();
      let makeWindow = 0;
      while (makeWindow <= 5) {
        makeWindow++;
        if (Math.floor(Math.random() * 3) + 1 == 3) {
          if (Math.floor(Math.random() * 2) + 1 == 1) {
            makeMovingWindow();
          } else {
            makeBombWindow();
          }
        } else {
          makeNewWindow(
            "assets/img/desktop/popups/" +
              (Math.round(Math.random() * 4) + 1).toString() +
              ".png",
            "assets/snd/error-trimmed.mp3",
            "moneyGainFromWindowsBase",
          );
        }
      }
      currentOpenWindows--;
      totalWindowsClosed++;
      state = "selectRandom";
      gainMoney(shopBuffs.moneyGainFromTextboxBase);
    }
  };
  bodyContainer.append(newWindow);
}

let bombClicked;
function makeBombWindow() {
  newWindow = document.getElementById("bombWindow").cloneNode(true);
  currentWindows++;
  const currentWindowString = currentWindows.toString();
  newWindow.id = "bombWindow" + currentWindowString;
  if (settingsData.sound == true) {
    const newSound = new Audio("assets/snd/error-trimmed.mp3");
    newSound.play();
  }
  const randomX = Math.floor(Math.random() * 90) + 1;
  const randomY = Math.floor(Math.random() * 90) + 1;
  newWindow.style.right = randomX.toString() + "%";
  newWindow.style.bottom = randomY.toString() + "%";
  newWindow.style.visibility = "visible";
  newWindow.onclick = function removeWindow() {
    if (stopLoops != true) {
      bombClicked = this.id; //the current thing clicked
      requestAnimationFrame(bombAnim);
      if (settingsData.sound == true) {
        const newSound = new Audio("assets/snd/explosion.mp3");
        newSound.play();
      }
      stopAnimations("lose");
    }
  };
  bombs[bombs.length] = newWindow.id;
  if (bombs.length == 1) {
    requestAnimationFrame(shrinkBombs);
  }
  bodyContainer.append(newWindow);
}

let currentMovingWindows = 0;
let movingWindowsEver = 0;
let movingWindows = {};
function makeMovingWindow() {
  newWindow = document.getElementById("window").cloneNode(true);
  currentMovingWindows++;
  movingWindowsEver++;
  currentOpenWindows++;
  newWindow.id = "movingWindow" + currentMovingWindows.toString();
  if (settingsData.sound == true) {
    const newSound = new Audio("assets/snd/error-trimmed.mp3");
    newSound.play();
  }
  const randomX = Math.floor(Math.random() * 90) + 1;
  const randomY = Math.floor(Math.random() * 90) + 1;
  movingWindows["movingWindow" + currentMovingWindows.toString()] = [
    randomX,
    randomY,
    "forwardX",
    "forwardY",
  ];
  newWindow.src =
    "assets/img/desktop/popups/" +
    (Math.round(Math.random() * 4) + 1).toString() +
    ".png";
  newWindow.style.right = randomX.toString() + "%";
  newWindow.style.bottom = randomY.toString() + "%";
  newWindow.style.visibility = "visible";
  newWindow.onclick = function removeWindow() {
    if (stopLoops != true) {
      this.remove();
      currentMovingWindows--;
      currentOpenWindows--;
    }
    gainMoney(shopBuffs.moneyGainFromMovingWindowsBase);
  };
  if (movingWindowsEver == 1) {
    requestAnimationFrame(moveWindows);
  }
  bodyContainer.append(newWindow);
}

let lastTimeWindows = 0;
function moveWindows(timeStamp) {
  const timeElapsedWindows = timeStamp - lastTimeWindows;
  let counterWindows = 0;
  let windowsCounted = 0;
  if (timeElapsedWindows >= 90) {
    lastTimeWindows = timeStamp;
    while (
      windowsCounted <= Object.keys(movingWindows).length - 1 &&
      counterWindows < movingWindowsEver
    ) {
      counterWindows++;
      let entryId = "movingWindow" + counterWindows.toString();
      const itemToMove = document.getElementById(
        "movingWindow" + counterWindows.toString(),
      );
      if (itemToMove != null) {
        windowsCounted++;
        if (movingWindows[entryId][2] == "forwardX") {
          itemToMove.style.right =
            (
              Number(
                itemToMove.style.right.slice(
                  0,
                  itemToMove.style.right.length - 1,
                ),
              ) + 2
            ).toString() + "%";
          if (
            Number(
              itemToMove.style.right.slice(
                0,
                itemToMove.style.right.length - 1,
              ),
            ) >= 90
          ) {
            movingWindows[entryId][2] = "backwardX";
          }
        } else {
          itemToMove.style.right =
            (
              Number(
                itemToMove.style.right.slice(
                  0,
                  itemToMove.style.right.length - 1,
                ),
              ) - 2
            ).toString() + "%";
          if (
            Number(
              itemToMove.style.right.slice(
                0,
                itemToMove.style.right.length - 1,
              ),
            ) <= 0
          ) {
            movingWindows[entryId][2] = "forwardX";
          }
        }
        movingWindows[entryId][0] = Number(
          itemToMove.style.right.slice(0, itemToMove.style.right.length - 1),
        );
        if (movingWindows[entryId][3] == "forwardY") {
          itemToMove.style.bottom =
            (
              Number(
                itemToMove.style.bottom.slice(
                  0,
                  itemToMove.style.bottom.length - 1,
                ),
              ) + 2
            ).toString() + "%";
          if (
            Number(
              itemToMove.style.bottom.slice(
                0,
                itemToMove.style.bottom.length - 1,
              ),
            ) >= 92
          ) {
            movingWindows[entryId][3] = "backwardY";
          }
        } else {
          itemToMove.style.bottom =
            (
              Number(
                itemToMove.style.bottom.slice(
                  0,
                  itemToMove.style.bottom.length - 1,
                ),
              ) - 2
            ).toString() + "%";
          if (
            Number(
              itemToMove.style.bottom.slice(
                0,
                itemToMove.style.bottom.length - 1,
              ),
            ) <= 0
          ) {
            movingWindows[entryId][3] = "forwardY";
          }
        }
        movingWindows[entryId][1] = Number(
          itemToMove.style.bottom.slice(0, itemToMove.style.bottom.length - 1),
        );
      }
    }
  }
  if (Object.keys(movingWindows).length != 0 && stopLoops != true) {
    requestAnimationFrame(moveWindows); //keep calling so long as there is at least one on-screen moving window
  } else {
    lastTimeWindows = timeStamp;
  }
}

function makeNewWindow(type, soundType, moneyGain) {
  const newWindow = windowItem.cloneNode(true);
  currentWindows++;
  currentOpenWindows++;
  const currentWindowString = currentWindows.toString();
  newWindow.id = "window" + currentWindowString;
  let randomX;
  let randomY;
  if (type == "rapid") {
    randomX = virusX + Math.floor(Math.random() * 5) + 1;
    randomY = virusY + Math.floor(Math.random() * 5) + 1;
    newWindow.src =
      "assets/img/desktop/popups/" +
      (Math.round(Math.random() * 4) + 1).toString() +
      ".png";
  } else {
    randomX = Math.floor(Math.random() * 90) + 1;
    randomY = Math.floor(Math.random() * 90) + 1;
    newWindow.src = type;
  }
  newWindow.style.right = randomX.toString() + "%";
  newWindow.style.bottom = randomY.toString() + "%";
  newWindow.style.visibility = "visible";
  if (settingsData.sound == true && soundType != false) {
    const newSound = new Audio(soundType);
    newSound.play();
  }
  newWindow.onclick = function removeWindow() {
    if (stopLoops != true) {
      if (shopBuffs[moneyGain] != 0) {
        gainMoney(shopBuffs[moneyGain]);
      }
      currentOpenWindows--;
      newWindow.remove();
      totalWindowsClosed++;
    }
  };
  bodyContainer.append(newWindow);
}

let bombs = [];
let lastTimeBombShrink = 0;
function shrinkBombs(timeStamp) {
  const timeElapsedBombShrink = timeStamp - lastTimeBombShrink;
  if (timeElapsedBombShrink >= 240) {
    for (
      //going backwards so that no messy things happen when we remove stuff midway
      let backwardsBombIds = bombs.length - 1; //idToShrink is the length of total ids - 1
      backwardsBombIds >= 0; //stop if idToShrink is at the end of total ids
      backwardsBombIds-- //take one away each time
    ) {
      const bombToShrink = document.getElementById(bombs[backwardsBombIds]);
      const currentSize = Number(
        bombToShrink.style.width.slice(0, bombToShrink.style.width.length - 1),
      );
      bombToShrink.style.width = (currentSize - 0.025).toString() + "%";
      if (bombToShrink.style.width == "0%") {
        bombs.splice(backwardsBombIds, 1); //remove from list
        bombToShrink.remove(); //remove from html
      }
    }
  }
  if (bombs.length != 0 && stopLoops != true) {
    requestAnimationFrame(shrinkBombs); //keep calling so long as there is at least one on-screen money counter
  } else {
    lastTimeBombShrink = timeStamp;
  }
}

boughtItems = [];
function buyItem(
  itemId,
  cost,
  effectName,
  effectAmount,
  keep,
  increasePriceIfKeep,
) {
  if (allowBuying != false) {
    if (money >= cost) {
      shopItemsBought++;
      totalMoneySpent += cost;
      if (keep == true) {
        let boughtItemText = document.getElementById(itemId + "Price");
        boughtItemText.textContent =
          "$" + (cost + increasePriceIfKeep).toString();
        document.getElementById(
          "shopItem" + itemId.slice(7, itemId.length - 6),
        ).onclick = () =>
          buyItem(
            itemId,
            cost + increasePriceIfKeep,
            effectName,
            effectAmount,
            keep,
            increasePriceIfKeep,
          );
        let boughtItemHover = document.getElementById(
          itemId.slice(0, itemId.length - 6),
        );
        boughtItemHover.onmouseenter = () =>
          shopHover(
            "8",
            "enter",
            6,
            "Upgrade 8",
            "Clears all non-bomb windows! Increase in price by $500 each time bought.",
            "Cost: $" + (cost + increasePriceIfKeep).toString(),
          );
      } else {
        document
          .getElementById(itemId.slice(7, itemId.length - 6) + "ShopHover")
          .remove();
        let boughtItem = document.getElementById(
          "shopItem" + itemId.slice(7, 8),
        );
        boughtItem.remove();
      }
      boughtItems[boughtItems.length] = itemId.slice(7, 8);
      money = money - cost;
      if (effectName == "miniTaskManager") {
        let taskManagerChanger = document.getElementById("taskManagerIcon");
        taskManagerChanger.onclick = () => toggleVisibility("miniTaskManager");
        let taskManagerVisibility = document.getElementById("taskManager");
        taskManagerVisibility.style.visibility = "hidden";
      } else if (effectName == "winDefender") {
        let winDefenderButton = document.getElementById("winDefenderButton");
        winDefenderButton.style.visibility = "visible";
      } else if (effectName == "clearWindows") {
        for (let elementToHide of Array.from(
          document.getElementsByClassName("basicWindowPopup"),
        )) {
          if (
            elementToHide.id != "window" &&
            elementToHide.id.includes("speechBubble") == false
          ) {
            currentOpenWindows--;
            elementToHide.remove();
          }
        }
      } else {
        shopBuffs[effectName] = shopBuffs[effectName] + effectAmount;
      }
      moneyCounterText.textContent = "$" + money.toString();
    } else {
      if (settingsData.sound == true) {
        const newSound = new Audio("assets/snd/battery-critical.mp3");
        newSound.play();
      }
    }
  }
}

function shrinkTextSize(timeStampMoney) {
  const timeElapsedMoney = timeStampMoney - lastTimeMoney;
  if (timeElapsedMoney >= 12) {
    for (
      //going backwards so that no messy things happen when we remove stuff midway
      let backwardstextIds = textIdsToShrink.length - 1; //idToShrink is the length of total ids - 1
      backwardstextIds >= 0; //stop if idToShrink is at the end of total ids
      backwardstextIds-- //take one away each time
    ) {
      let idToShrink = textIdsToShrink[backwardstextIds];
      //(Number(idToShrink.style.fontSize.slice(0, idToShrink.style.fontSize.length - 1)) - 10).toString() + "%";
      const itemToShrink = document.getElementById(idToShrink);
      itemToShrink.style.fontSize = //shockingly, all my code
        (
          Number(
            itemToShrink.style.fontSize.slice(
              //gets fontsize, slices it to remove the % so only "100" remains
              0,
              itemToShrink.style.fontSize.length - 1,
            ), //converts to a number (removing "")
          ) - 4
        ) //takes away 10
          .toString() + "%"; //converts back into a string, adds back the % symbol and now is "90%"!
      if (itemToShrink.style.fontSize == "0%") {
        textIdsToShrink.splice(backwardstextIds, 1); //remove from list
        itemToShrink.remove(); //remove from html
      }
    }
  }
  if (textIdsToShrink.length != 0 && stopLoops != true) {
    requestAnimationFrame(shrinkTextSize); //keep calling so long as there is at least one on-screen money counter
  } else {
    lastTimeMoney = timeStampMoney;
  }
}

function gainMoney(amount) {
  if (stopLoops != true) {
    amount = amount * shopBuffs.moneyGainMultiplier;
    const newMoneyItem = moneyItem.cloneNode(true);
    totalMoneyEarned += amount;
    money = money + amount;
    moneyCounterText.textContent = "$" + money.toString();
    moneyCount++;
    newMoneyItem.style.visibility = "visible";
    newMoneyItem.textContent = "$" + amount.toString();
    newMoneyItem.style.left =
      (mouseX + Math.floor(Math.random() * 5 - 2) * 10).toString() + "px"; //slightly ofset the new item
    newMoneyItem.style.top =
      (mouseY + Math.floor(Math.random() * 5 - 2) * 10).toString() + "px";
    newMoneyItem.style.fontSize = "200%"; //set fontSize HERE so that it is inline and shrinkTextSize() works
    newMoneyItem.id = "money" + moneyCount.toString(); //set id to money1 (1 is replaced with total ever money counters made)
    textIdsToShrink[textIdsToShrink.length] = newMoneyItem.id; //add id to idlist for shrinking
    bodyContainer.append(newMoneyItem); //add to html
    if (textIdsToShrink.length == 1) {
      requestAnimationFrame(shrinkTextSize); //if the textId has only one item in it (we have just added one) then call, otherwise do not (it is already calling)
    }
  }
}

function moneyAnimation(timeStampMoneyAnimation) {
  const timeElapsedMoneyAnimation =
    timeStampMoneyAnimation - lastTimeMoneyAnimation;
  if (timeElapsedMoneyAnimation >= 40) {
    if (moneyRotation < 60 && moneyRotationForward) {
      lastTimeMoneyAnimation = timeStampMoneyAnimation;
      moneyRotation++;
      moneyCounterImage.style.transform =
        "rotate(" + moneyRotation.toString() + "deg)";
    } else {
      moneyRotationForward = false;
      if (moneyRotation < -20) {
        moneyRotationForward = true;
      }
      lastTimeMoneyAnimation = timeStampMoneyAnimation;
      moneyRotation--;
      moneyCounterImage.style.transform =
        "rotate(" + moneyRotation.toString() + "deg)";
    }
  }
  if (stopLoops != true) {
    requestAnimationFrame(moneyAnimation);
  }
}
requestAnimationFrame(moneyAnimation);

function toggleVisibility(id) {
  if (allowClick != false) {
    if (stopLoops != true) {
      if (settingsData.sound == true) {
        const newSound = new Audio("assets/snd/click.mp3");
        newSound.play();
      }
      let elementToMakeVisible = document.getElementById(id);
      if (
        id == "shopSpan" &&
        finalUnlocked == true &&
        elementToMakeVisible != null
      ) {
        let unlock = document.getElementById("shopItem9");
        if (elementToMakeVisible.style.visibility == "visible") {
          elementToMakeVisible.style.visibility = "hidden";
          unlock.style.visibility = "hidden";
        } else {
          elementToMakeVisible.style.visibility = "visible";
          unlock.style.visibility = "visible";
        }
      } else {
        if (elementToMakeVisible != null) {
          if (elementToMakeVisible.style.visibility == "visible") {
            elementToMakeVisible.style.visibility = "hidden";
          } else {
            elementToMakeVisible.style.visibility = "visible";
          }
        }
      }
      if (id == "winDefender") {
        windowsDefender = true;
      }
    }
  }
}

const hints = [
  "Open the Task Manager to see how much memory you have left!",
  "Buy upgrades in the Microslop store to make defeating bosses easier!",
  "Closing pop-ups will cause your memory to go down!",
  "If your memory reaches its max, you lose!",
  "After defeating a phase you gain money!",
  "You can buy some items in the Microslop store multiple times!",
  "Your money is displayed in the bottom left corner!",
  "Attacks get harder as you progress!",
  "You can turn off downloads in the stat menu!",
  "Turning off downloads will cause you to get a popup instead! This popup DOES count towards the total.",
  "Check how many windows you have open in the stat menu!",
  "Closing pop-ups gives you money you can spend in the Microslop store!",
  "This website downloads things to your computer! While harmless, they may take up space, so make sure to delete them if you need to!",
  "Don't click the bombs!",
];
function stopAnimations(winOrLose) {
  stopLoops = true;
  let toChange = document.getElementById("winOrLoseText");
  toChange.style.visibility = "visible";
  if (winOrLose == "win") {
    toChange.style.color = "seagreen";
    toChange.textContent = "YOU WIN!";
    toChange.style.backgroundColor = "rgba(50, 205, 50, 0.2)";
  } else {
    toChange.style.color = "firebrick";
    toChange.textContent = "YOU LOSE!";
    toChange.style.backgroundColor = "rgba(240, 128, 128, 0.5)";
  }
  toChange = document.getElementById("restartButtonImg");
  toChange.src = "assets/img/desktop/buttons/" + winOrLose + "Button.png";
  toChange = document.getElementById("restartButton");
  toChange.style.visibility = "visible";
  toChange = document.getElementById("hints");
  if (winOrLose == "win") {
    toChange.style.color = "seagreen";
  } else {
    toChange.style.color = "firebrick";
  }
  toChange.style.visibility = "visible";
  toChange.textContent = hints[Math.floor(Math.random() * hints.length)];
}

function trackMemoryProgess() {
  if (allowHover != false) {
    let memoryProgessBar = document.getElementById("memoryProgess");
    let miniMemoryProgessBar = document.getElementById("miniMemoryProgess");
    memoryBarHeight = currentOpenWindows / shopBuffs.memoryIncrease;
    if (memoryBarHeight >= 26) {
      stopAnimations("lose");
    }
    if (memoryBarHeight > 24) {
      importantNotify("Extreme memory load! Close pop-ups!");
    } else if (memoryBarHeight > 20) {
      importantNotify("High memory load! Close pop-ups!");
    } else if (memoryBarHeight > 16 && phaseNum <= 2) {
      importantNotify("Moderate memory load! Close pop-ups!");
    }
    miniMemoryProgessBar.style.height =
      (memoryBarHeight * 1.77).toString() + "%";
    memoryProgessBar.style.height = memoryBarHeight.toString() + "%";
    if (stopLoops != true) {
      requestAnimationFrame(trackMemoryProgess);
    }
  }
}
requestAnimationFrame(trackMemoryProgess);

function settings(setting) {
  if (setting == "downloadToggle") {
    if (settingsData.downloads == true) {
      settingsData.downloads = false;
      document.getElementById(setting).src =
        "assets/img/desktop/windows/settings/noDownloads.png";
    } else {
      settingsData.downloads = true;
      document.getElementById(setting).src =
        "assets/img/desktop/windows/settings/downloads.png";
    }
  }
  if (setting == "soundToggle") {
    if (settingsData.sound == true) {
      settingsData.sound = false;
      document.getElementById(setting).src =
        "assets/img/desktop/windows/settings/noSound.png";
    } else {
      settingsData.sound = true;
      document.getElementById(setting).src =
        "assets/img/desktop/windows/settings/sound.png";
    }
  }
  if (settingsData.sound == true) {
    const newSound = new Audio("assets/snd/click.mp3");
    newSound.play();
  }
  document.cookie = "downloads=" + settingsData.downloads.toString();
  document.cookie = "sound=" + settingsData.sound.toString();
}

function shopHover(
  hoverElement,
  enterOrExit,
  moveAmount,
  titleText,
  bodyText,
  cost,
) {
  if (allowClick != false) {
    if (enterOrExit == "enter") {
      const newHover = document
        .getElementById("hoverElementSpanShop")
        .cloneNode(true);
      let newHoverWindow = newHover.querySelector("#hoverElementShop"); //only gets the child item with that id
      newHover.style.visibility = "visible";
      newHover.id = hoverElement + "ShopHover";
      const rect = document
        .getElementById("upgrade" + hoverElement)
        .getBoundingClientRect();
      newHoverWindow.style.left =
        ((rect.left / window.innerWidth) * 100 + moveAmount - 2.5).toString() +
        "%";
      newHoverWindow.style.top =
        ((rect.top / window.innerHeight) * 100 + moveAmount).toString() + "%";
      let hoverStuffs = newHover.querySelector("#hoverStuffs");
      let newHoverTexts = hoverStuffs.querySelector(".hoverTitle");
      hoverStuffs.style.left = newHoverWindow.style.left;
      hoverStuffs.style.top = newHoverWindow.style.top;
      newHoverTexts.textContent = titleText;
      newHoverTexts = hoverStuffs.querySelector(".hoverText");
      newHoverTexts.textContent = bodyText;
      newHoverTexts = hoverStuffs.querySelector(".hoverMoney");
      newHoverTexts.textContent = cost;
      bodyContainer.append(newHover);
    } else {
      hoverItem = document.getElementById(hoverElement + "ShopHover");
      hoverItem.remove();
    }
  }
}

function hover(
  hoverElement,
  enterOrExit,
  xy1,
  xy2,
  xy1MoveAmount,
  xy2MoveAmount,
  titleText,
  bodyText,
  difficulty,
) {
  if (allowClick != false) {
    let hoverItem = document.getElementById(hoverElement);
    if (enterOrExit == "enter") {
      const newHover = document
        .getElementById("hoverElementSpan")
        .cloneNode(true);
      let newHoverWindow = newHover.querySelector("#hoverElement");
      newHover.id = hoverElement + "Hover";
      newHover.style.visibility = "visible";
      //looks complex, but really all it does is remove the "%" and turn it into a number then back into a string with and add a "%"
      newHoverWindow.style[xy1] =
        (
          Number(
            hoverItem.style[xy1].slice(0, hoverItem.style[xy1].length - 1),
          ) - xy1MoveAmount
        ).toString() + "%";
      newHoverWindow.style[xy2] =
        (
          Number(
            hoverItem.style[xy2].slice(0, hoverItem.style[xy2].length - 1),
          ) - xy2MoveAmount
        ).toString() + "%";
      let hoverStuffs = newHover.querySelector("#hoverStuffs");
      hoverStuffs.style[xy1] = newHoverWindow.style[xy1];
      hoverStuffs.style[xy2] = newHoverWindow.style[xy2];
      let newHoverTexts = hoverStuffs.querySelector(".hoverTitle");
      newHoverTexts.textContent = titleText;
      newHoverTexts = hoverStuffs.querySelector(".hoverText");
      newHoverTexts.textContent = bodyText;
      newHoverTexts = hoverStuffs.querySelector(".starImage");
      if (difficulty == "") {
        newHoverTexts.remove();
      } else {
        newHoverTexts.src = difficulty;
      }
      newHover.style.visibility = "visible";
      bodyContainer.append(newHover);
    } else {
      hoverItem = document.getElementById(hoverElement + "Hover");
      hoverItem.remove();
    }
  }
}

function settingsHover(
  hoverElement,
  enterOrExit,
  moveAmount,
  titleText,
  bodyText,
) {
  if (allowClick != false) {
    if (enterOrExit == "enter") {
      const newHover = document
        .getElementById("hoverElementSpanShop")
        .cloneNode(true);
      let newHoverWindow = newHover.querySelector("#hoverElementShop"); //only gets the child item with that id
      newHover.style.visibility = "visible";
      newHover.id = hoverElement + "SettingsHover";
      newHoverWindow.style.left =
        (31 + 6.5 * ((Number(hoverElement) - 1) % 6) + moveAmount).toString() +
        "%";
      newHoverWindow.style.top =
        (
          32 +
          11 * Math.floor((Number(hoverElement) - 1) / 6) -
          moveAmount
        ).toString() + "%";
      let hoverStuffs = newHover.querySelector("#hoverStuffs");
      hoverStuffs.style.left = newHoverWindow.style.left;
      hoverStuffs.style.top = newHoverWindow.style.top;
      let newHoverTexts = hoverStuffs.querySelector(".hoverTitle");
      newHoverTexts.textContent = titleText;
      newHoverTexts = hoverStuffs.querySelector(".hoverText");
      newHoverTexts.textContent = bodyText;
      bodyContainer.append(newHover);
    } else {
      hoverItem = document.getElementById(hoverElement + "SettingsHover");
      hoverItem.remove();
    }
  }
}

let slide = 1;
function intro() {
  slide++;
  let toChange;
  if (slide == 2) {
    toChange = document.getElementById("fileExplorer");
    toChange.style.zIndex = 1;
    toChange = document.getElementById("shopButton");
    toChange.style.zIndex = 101;

    toChange = document.getElementById("introText");
    toChange.textContent =
      "This is the shop. Buying upgrades here will make defeating bosses easier!";
    toChange.style.top = "14.5%";
  }
  if (slide == 3) {
    toChange = document.getElementById("shopButton");
    toChange.style.zIndex = 1;
    toChange = document.getElementById("taskManagerIcon");
    toChange.style.zIndex = 101;

    toChange = document.getElementById("introText");
    toChange.textContent =
      "This is the Task Manager. It shows how much memory your computer has left before you lose the game!";
    toChange.style.top = "25.5%";
  }
  if (slide == 4) {
    toChange = document.getElementById("taskManagerIcon");
    toChange.style.zIndex = 1;
    toChange = document.getElementById("taskManager");
    toChange.style.zIndex = 101;
    toChange.style.visibility = "visible";
    document.getElementById("memoryProgess").style.height = "15%";
    document.getElementById("taskManagerImage").src =
      "assets/img/desktop/windows/taskManager/taskManagerDarkened.png";
    toChange = document.getElementById("introText");
    toChange.textContent =
      "To check how much memory you have left, open the task manager and look at this bar. The less full it is the better.";
    toChange.style.width = "13.5%";
    toChange.style.top = "60%";
    toChange.style.left = "58%";
  }
  if (slide == 5) {
    toChange = document.getElementById("taskManager");
    toChange.style.zIndex = 1;
    document.getElementById("taskManagerImage").src =
      "assets/img/desktop/windows/taskManager/taskManager.png";
    toChange.style.visibility = "hidden";
    document.getElementById("taskManagerIcon").style.zIndex = 1;
    toChange = document.getElementsByClassName("virus");
    for (let elementToChange of toChange) {
      elementToChange.style.zIndex = 101;
    }
    toChange = document.getElementById("introText");
    toChange.textContent =
      "These are the viruses. They will create pop-ups that deplete memory! Clicking these will start the game, so make sure to do it once you have had a look around!";
    toChange.style.top = "41.5%";
    toChange.style.left = "7%";
    toChange.style.width = "17.5%";
  }
  if (slide == 6) {
    document.getElementById("introText").style.visibility = "hidden";
    document.getElementById("introNextText").style.visibility = "hidden";
    document.getElementById("introOverlay").style.visibility = "hidden";
    allowClick = true;
    allowHover = true;
    allowBuying = true;
    toChange = document.getElementsByClassName("virus");
    for (let elementToChange of toChange) {
      elementToChange.style.zIndex = 1;
    }
    requestAnimationFrame(trackMemoryProgess);
  }
}

let lastTimeStat = 0;
function updateStats(timeStamp) {
  const timeElapsedStat = timeStamp - lastTimeStat;
  if (timeElapsedStat >= 1000) {
    lastTimeStat = timeStamp;
    let toUpdate = document.getElementById("stat1");
    toUpdate.textContent =
      "Total Windows Closed: " + totalWindowsClosed.toString();
    toUpdate = document.getElementById("stat2");
    toUpdate.textContent =
      "Total Windows Ever: " +
      (currentWindows + currentMovingWindows).toString();
    toUpdate = document.getElementById("stat3");
    toUpdate.textContent = "Windows Open: " + currentOpenWindows.toString();
    toUpdate = document.getElementById("stat4");
    toUpdate.textContent =
      "Maximum Windows: " +
      (26 * shopBuffs.memoryIncrease).toString() +
      "  Windows";
    toUpdate = document.getElementById("stat5");
    toUpdate.textContent = "Total Money Spent: $" + totalMoneySpent.toString();
    toUpdate = document.getElementById("stat6");
    toUpdate.textContent =
      "Total Money Earned: $" + totalMoneyEarned.toString();
    toUpdate = document.getElementById("stat7");
    toUpdate.textContent = "Current Money: $" + money.toString();
    toUpdate = document.getElementById("stat8");
    toUpdate.textContent =
      "Store Upgrades Bought: " + shopItemsBought.toString();
    toUpdate = document.getElementById("stat9");
    toUpdate.textContent = "Current Phase: " + phaseNum.toString();
    toUpdate = document.getElementById("stat10");
    toUpdate.textContent = "Phases: " + phaseNum.toString() + "/5";
    if (windowsDefender == true) {
      toUpdate = document.getElementById("timeScanning");
      toUpdate.textContent = (
        Number(toUpdate.textContent.slice(6, 8)) + 1
      ).toString();
      if (Number(toUpdate.textContent.slice(6, 8) >= 55)) {
        stopAnimations("win");
      }
      if (Number(toUpdate.textContent) < 10) {
        toUpdate.textContent = "00:00:0" + toUpdate.textContent;
      } else {
        toUpdate.textContent = "00:00:" + toUpdate.textContent;
      }
      toUpdate = document.getElementById("objScanned");
      toUpdate.textContent = (
        Number(toUpdate.textContent) + Math.floor(Math.random() * 10)
      ).toString();
      if (Number(toUpdate.textContent) >= 170) {
        stopAnimations("win");
      }
    }
  }
  if (stopLoops != true) {
    requestAnimationFrame(updateStats);
  }
}
requestAnimationFrame(updateStats);

let lastTimeBomb = 0;
let bombAnimationFrame = 0;
function bombAnim(timeStamp) {
  const timeElapsedBomb = timeStamp - lastTimeBomb;
  if (timeElapsedBomb >= 100) {
    lastTimeBomb = timeStamp;
    bombAnimationFrame++;
    document.getElementById(bombClicked).src =
      "assets/img/desktop/popups/explosion/explosion" +
      bombAnimationFrame.toString() +
      ".png";
  }
  if (bombAnimationFrame <= 17) {
    requestAnimationFrame(bombAnim);
  } else {
    document.getElementById(bombClicked).remove();
  }
}

let cookies;
let cookieCounter = 0;
function readCookies() {
  cookies = document.cookie.split(";");
  while (cookieCounter < 3) {
    if (cookies[cookieCounter] != null && cookies[cookieCounter] != "") {
      if (cookies[cookieCounter].replace(" ", "").includes("downloads")) {
        settingsData.downloads =
          cookies[cookieCounter].replace(" ", "").substring(10) === "true"; // will pass true in boolean form only if text is "true". if it is anything else it will be false
      } else if (
        cookies[cookieCounter].replace(" ", "").includes("seenGuide")
      ) {
        document.getElementById("introText").style.visibility = "hidden";
        document.getElementById("introNextText").style.visibility = "hidden";
        document.getElementById("introOverlay").style.visibility = "hidden";
        document.getElementById("fileExplorer").style.zIndex = 1;
        allowClick = true;
        allowHover = true;
        allowBuying = true;
        requestAnimationFrame(trackMemoryProgess);
      } else {
        settingsData.sound =
          cookies[cookieCounter].replace(" ", "").substring(6) === "true";
      }
    }
    cookieCounter++;
  }
  if (settingsData.downloads == true) {
    document.getElementById("downloadToggle").src =
      "assets/img/desktop/windows/settings/downloads.png";
  } else {
    document.getElementById("downloadToggle").src =
      "assets/img/desktop/windows/settings/noDownloads.png";
  }
  if (settingsData.sound == true) {
    document.getElementById("soundToggle").src =
      "assets/img/desktop/windows/settings/sound.png";
  } else {
    document.getElementById("soundToggle").src =
      "assets/img/desktop/windows/settings/noSound.png";
  }
}
readCookies();
//document.cookie = "seenGuide";
