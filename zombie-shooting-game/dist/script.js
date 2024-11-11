/* GLOBAL VARS */
const maxScore = 10;
let timerCount = 12;
let bullets = 11;
let timer;
let startTimerCount = 4;
let startTimer;
let gameStarted = false;
let score = 0;
let canShoot = false;

/* CAPTURED ELEMENTS */
const shootAudio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/26/audio_d0ed19ffb1.mp3?filename=gun_in_small_room_02-107590.mp3");
shootAudio.volume = 0.07;
const moneySound = new Audio("https://cryptogunner.online/wp-content/uploads/2023/05/coins.mp3");
moneySound.volume = 0.2;

const bulletsElementNum = document.querySelector("#bullets-num");
const scoreElementNum = document.querySelector("#score-num");
const timerElementNum = document.querySelector("#timer-num");
const cursor = document.querySelector(".cursor");
const container = document.querySelector(".container");
const bulletHole = document.querySelector(".bulletHole");
const bloodSpot = document.querySelector(".bloodSpot");
const button = document.querySelector(".button");
const zombie = document.createElement("img");
const startTimerElementNum = document.getElementById("start-timer");
const gameRules = document.querySelector(".game-rules");

/* ZOMBIE AND MUSIC SPAWN SETTINGS */
zombie.setAttribute("class", "zombie");
const randomNumber = Math.floor(Math.random() * 100);
let backgroundMusic;

// Random zombie music and image
zombie.setAttribute("src", "https://clipart-library.com/images_k/zombie-head-silhouette/zombie-head-silhouette-24.png");
if (randomNumber <= 33) {
    backgroundMusic = new Audio('https://cryptogunner.online/wp-content/uploads/2023/05/background-sound.mp3');
} else if (randomNumber <= 66) {
    backgroundMusic = new Audio('https://cryptogunner.online/wp-content/uploads/2023/04/Creepy-Action.mp3');
} else {
    backgroundMusic = new Audio('https://cryptogunner.online/wp-content/uploads/2023/04/Castle-of-Horrors.mp3');
}

const contHeight = container.offsetHeight;
const contWidth = container.offsetWidth;

setInterval(() => {
    const randTop = Math.random() * (contHeight - 100);
    const randLeft = Math.random() * (contWidth - 100);
    zombie.style.position = "absolute";
    zombie.style.top = randTop + "px";
    zombie.style.left = randLeft + "px";
}, 1000);

/* GAME INFO SCORE */
button.addEventListener("mousedown", startGame);
bulletsElementNum.innerHTML = bullets;
scoreElementNum.innerHTML = `${score} / ${maxScore}`;
timerElementNum.innerHTML = timerCount;

/* FUNCTIONS */
function abrirTelaCheia() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
}

async function startGame() {
    if (button.innerText === "START") {
        button.style.display = "none";
        gameRules.style.display = "none";
        abrirTelaCheia();

        // Timer before game start
        startTimer = setInterval(() => {
            startTimerCount--;
            startTimerElementNum.innerText = startTimerCount;
            if (startTimerCount <= -1) {
                clearInterval(startTimer);
                startTimerElementNum.innerText = "GO!";
                setTimeout(() => {
                    startTimerElementNum.style.display = "none";
                    initializeGame();
                    backgroundMusic.volume = 0.1;
                    backgroundMusic.play();
                }, 1000);
            }
        }, 1000);
    }
}

function initializeGame() {
    setTimeout(() => { canShoot = true; }, 420);
    gameStarted = true;
    document.body.style.cursor = "none";
    cursor.style.display = "block";
    container.appendChild(zombie);

    // Game timer countdown
    timer = setInterval(() => {
        if (timerCount <= 0) {
            clearInterval(timer);
            endGame();
        }
        timerElementNum.innerHTML = timerCount;
        timerCount--;
    }, 1000);
}

function endGame() {
    container.removeChild(zombie);
    button.innerText = "GAME OVER";
    gameStarted = false;
    document.body.style.cursor = "default";
    cursor.style.display = "none";

    const finalScore = (score / maxScore) * 100;
    let msg;
    if (finalScore < 33) msg = "Rank C: Zombie Novice - Keep practicing!";
    else if (finalScore < 66) msg = "Rank B: Undead Exterminator - Great job!";
    else if (finalScore < 100) msg = "Rank A: Zombie Slayer - Excellent!";
    else msg = "Rank S: Apocalypse Conqueror - You're a master!";

    container.innerHTML = `
        <div class="container-collect-cgun">
            <h2 style="color:white">${msg}</h2>
            <button id="collect-cgun-btn" onclick="collectCgun()">Click to collect ${score * 2} $CGUNs</button>
        </div>
    `;
}

async function collectCgun() {
    const collectCgunBtn = document.getElementById("collect-cgun-btn");
    if (collectCgunBtn.textContent === "GRATS! Come back tomorrow!") {
        collectCgunBtn.textContent = "You already collected your prize today!";
        setTimeout(() => { collectCgunBtn.disabled = true; }, 3000);
        return;
    }

    collectCgunBtn.textContent = "GRATS! Come back tomorrow!";
    moneySound.play();
    setTimeout(() => {
        alert("Congratulations! You have collected your prize.");
    }, 1000);
}

/* SHOOT FUNCTION */
function shoot(e) {
    if (canShoot) {
        canShoot = false;
        e.preventDefault();
        bulletHole.style.top = e.pageY + "px";
        bulletHole.style.left = e.pageX + "px";
        shootAudio.play();
        bullets--;
        bulletsElementNum.innerHTML = bullets;

        if (e.target === zombie) {
            score++;
            bloodSpot.style.top = e.pageY + "px";
            bloodSpot.style.left = e.pageX + "px";
            bloodSpot.style.display = "block";
            setTimeout(() => { bloodSpot.style.display = "none"; }, 415);
            if (score >= maxScore) endGame();
            else scoreElementNum.innerHTML = `${score} / ${maxScore}`;
        }
        if (bullets <= 0) endGame();
        setTimeout(() => { canShoot = true; }, 420);
    }
}

window.addEventListener("mousedown", (e) => {
    if (gameStarted) shoot(e);
});

window.addEventListener("mousemove", (e) => {
    cursor.style.top = e.pageY + "px";
    cursor.style.left = e.pageX + "px";
});
