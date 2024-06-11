"use strict";

const board = document.querySelector(".board");
const cards = document.querySelectorAll(".card");
const musicBtn = document.querySelector("#mute");
const clocks = document.querySelectorAll(".time");
const restartBtns = document.querySelectorAll(".restart");
const recordTimes = document.querySelectorAll(".record");
const winBtn = document.querySelector("#win");
const restartBtn = document.querySelector("#restart");

const audio = {
    open: new Audio("audio/open.mp3"),
    inactive: new Audio("audio/inactive.mp3"),
    click: new Audio("audio/click.mp3"),
    win: new Audio("audio/win.mp3"),
    bg: new Audio("audio/adhesivewombat-night-shade.mp3"),
};

let card1, card2;
let clicks = 0;
let block = false;
let seconds = 0;
let minutes = 0;
let myRecord = 0;
let stopTime;

function loadRecord() {
    if (localStorage.getItem("record")) {
        recordTimes.forEach((recordTime) => {
            recordTime.textContent = localStorage.getItem("record");
        });
    }
}

function playMusic() {
    audio.bg.loop = true;
    audio.bg.play();
}

function mixCards() {
    const cardsArray = Array.from(board.children);
    for (let i = cardsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
    }
    board.innerHTML = "";
    cardsArray.forEach((card) => board.appendChild(card));
}

function formatTime(value) {
    return value < 10 ? "0" + value : value;
}

function updateTime() {
    stopTime = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        clocks.forEach((clock) => {
            clock.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
        });
    }, 1000);
}

function flipCard(e) {
    if (block) return;
    const card = e.target.parentNode;
    card.style.transform = "rotateY(180deg)";
    audio.open.play();
    clicks++;
    if (clicks === 1) {
        card1 = card;
    } else if (clicks === 2) {
        block = true;
        card2 = card;
        setTimeout(() => {
            card1.style.transform = "rotateY(0deg)";
            card2.style.transform = "rotateY(0deg)";
            clicks = 0;
            block = false;
            checkMatch();
        }, 1000);
    }
}

function checkMatch() {
    if (card1.dataset.carta == card2.dataset.carta && card1.dataset.number !== card2.dataset.number) {
        audio.inactive.play();
        card1.classList.add("inactive");
        card2.classList.add("inactive");
        checkWin();
    }
}

function checkWin() {
    if ([...cards].every((card) => card.classList.contains("inactive"))) {
        audio.win.play();
        clearInterval(stopTime);
        saveTime();
        setTimeout(() => {
            winBtn.classList.add("active");
            document.body.style.overflow = "hidden";
        }, 1000);
    }
}

function saveTime() {
    clocks.forEach((clock) => {
        let myRecord = "99:99";

        if (+clock.textContent.replace(":", "") <= +myRecord.replace(":", "")) {
            myRecord = clock.textContent;
        }

        recordTimes.forEach((recordTime) => {
            if (+clock.textContent.replace(":", "") <= +recordTime.textContent.replace(":", "")) {
                recordTime.textContent = myRecord;
                localStorage.setItem("record", myRecord);
            }
        });
    });
}

function restart() {
    audio.click.play();
    setTimeout(() => {
        location.reload();
    }, 600);
}

function controlMusic() {
    audio.click.play();
    if (audio.bg.paused) {
        audio.bg.play();
        musicBtn.firstElementChild.src = "img/play.png";
    } else {
        audio.bg.pause();
        musicBtn.firstElementChild.src = "img/muted.png";
    }
}

window.addEventListener("load", () => {
    playMusic();
    updateTime();
    loadRecord();
    mixCards();
});

cards.forEach((card) => {
    card.addEventListener("click", flipCard);
});

restartBtns.forEach((restartBtn) => {
    restartBtn.addEventListener("click", restart);
});

musicBtn.addEventListener("click", controlMusic);
