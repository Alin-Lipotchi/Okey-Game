import { cardsArr } from "./cards.js";

window.addEventListener("contextmenu", e => e.preventDefault());

// Variables

let currentCardsArr = [];

const cardPlaceOne = document.querySelector("#card-place-1");
const cardPlaceTwo = document.querySelector("#card-place-2");
const cardPlaceThree = document.querySelector("#card-place-3");
const cardPlaceFour = document.querySelector("#card-place-4");
const cardPlaceFive = document.querySelector("#card-place-5");

const sessionPlaceOne = document.querySelector("#session-place-1");
const sessionPlaceTwo = document.querySelector("#session-place-2");
const sessionPlaceThree = document.querySelector("#session-place-3");

const sessionScore = document.querySelector("#session-score");
const cardsLeft = document.querySelector("#cards-left");
const totalScoreElement = document.querySelector("#total-score")

const cardSetOne = document.querySelector("#card-set-1");
const cardSetTwo = document.querySelector("#card-set-2");
const cardSetThree = document.querySelector("#card-set-3");
const cardSetFour = document.querySelector("#card-set-4");

const successOverlay = document.querySelector(".success-overlay");
const successText = document.querySelector(".success-text");
const fireworks = document.querySelector(".fireworks");
const startBtn = document.querySelector("#start-button");

const infoBtn = document.querySelector("#info-button");
const infoBox = document.querySelector(".info-box");
infoBox.style.display = "none";
const highscoresOverlay = document.querySelector(".highscores");

const finalScoreOverlay = document.querySelector(".final-score");
const finalScore = document.querySelector(".final-score-value");
const closeButton = document.querySelector(".close-button");
const hiScoreBtn = document.querySelector("#high-scores-button");

const gameWindow = document.querySelector(".game-window");
const loadingScreen = document.querySelector(".loading-screen");
const cardsPreloader = document.querySelector(".cards-preloader")

let totalScore = 0;
let overallTotalScore = 0;
let sessionCardsValues = {}; 
let fiveCardsInLine = false;
let gameIsStarted = false;
let highScores = [];
let isHighscoresDisplayed = false;
let isFinalScoreDisplayed = false;

// Functions

const hideLoadingScreen = () => {
    setTimeout(() => {
        loadingScreen.style.opacity = "0";
        gameWindow.style.filter = "blur(0)";
    }, 2000)
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 2500)
    loadingScreen.style.transition = "ease-in-out .5s all";
}

hideLoadingScreen();

const preloadCards = () => {
    createCards();
    setTimeout(() => {
        currentCardsArr.forEach(card => {
            cardsPreloader.innerHTML += card;
        },100);
    });
}


const startGame = e => {
    e.preventDefault();
    if(e.target.textContent === "Start") {
        createCards();
        createNewCardInPlace(cardPlaceOne);
        createNewCardInPlace(cardPlaceTwo);
        createNewCardInPlace(cardPlaceThree);
        createNewCardInPlace(cardPlaceFour);
        createNewCardInPlace(cardPlaceFive);

        e.target.textContent = "End";
        fiveCardsInLine = true;
        gameIsStarted = true;

        finalScoreOverlay.style.transform = "scale(0)";
        finalScore.textContent = 0;
        isFinalScoreDisplayed = false;
    } else {
        gameIsStarted = false;
        cardsLeft.textContent = 24;
        removeCardInPlace(cardPlaceOne);
        removeCardInPlace(cardPlaceTwo);
        removeCardInPlace(cardPlaceThree);
        removeCardInPlace(cardPlaceFour);
        removeCardInPlace(cardPlaceFive);

        removeCardInSession(null, false);

        cardSetOne.style.display = "block";
        cardSetTwo.style.display = "block";
        cardSetThree.style.display = "block";
        cardSetFour.style.display = "block";

        isFinalScoreDisplayed = true;
        displayTotalScore(totalScore);
        updateHighscoresList();

        finalScoreOverlay.style.color = "#eee"
        totalScoreElement.textContent = "0";
        fiveCardsInLine = false;
        overallTotalScore += totalScore;
        localStorage.setItem("overallTotalScore", overallTotalScore);
        totalScore = 0;
        e.target.textContent = "Start";
    }
}


const createCards = () => {
    currentCardsArr = cardsArr.map(card => {
        return `<div class="card" style="background: url('${card.location}')" data-number="${card.number}" data-color="${card.color}"></div>`
    });
}


preloadCards();


const handleCardClick = (e) => {
    e.preventDefault();
    if(e.type === "click") {
        if(e.target.parentElement.dataset.place === "card-line") {
            putCardInSession(e.target);
        } else {
            removeCardInSession(e.target, true);
        }
    } else {
        if(e.target.parentElement.dataset.place === "card-line") {
            removeCardInPlace(e.target.parentElement);
        } else {
            removeCardInSession(e.target, true);
        }
    }
}


const createNewCardInPlace = (e) => {
    let i = Math.floor(Math.random() * currentCardsArr.length);
    let el = currentCardsArr.splice(i, 1);
    cardsLeft.textContent = currentCardsArr.length;
    e.innerHTML = el[0];
    e.children[0].addEventListener("click", handleCardClick);
    e.children[0].addEventListener("contextmenu", handleCardClick);
}


const removeCardInPlace = (card) => {
    card.innerHTML = "";
    fiveCardsInLine = false;
}


const putCardInSession = (card) => {
    if(!sessionPlaceOne.innerHTML) {
        sessionPlaceOne.appendChild(card);
    } else if(!sessionPlaceTwo.innerHTML){
        sessionPlaceTwo.appendChild(card);
    } else {
        sessionPlaceThree.appendChild(card);
        checkSessionCards();
    }
}


const removeCardInSession = (card, back) => {
    if(back) {
        if(!cardPlaceOne.innerHTML) cardPlaceOne.appendChild(card);
        else if(!cardPlaceTwo.innerHTML) cardPlaceTwo.appendChild(card);
        else if(!cardPlaceThree.innerHTML) cardPlaceThree.appendChild(card);
        else if(!cardPlaceFour.innerHTML) cardPlaceFour.appendChild(card);
        else if(!cardPlaceFive.innerHTML) cardPlaceFive.appendChild(card);
        
    } else {
        sessionPlaceOne.innerHTML = "";
        sessionPlaceTwo.innerHTML = "";
        sessionPlaceThree.innerHTML = "";
    }
}


const addCardFromPack = () => {
    if(gameIsStarted && !fiveCardsInLine && !sessionPlaceOne.innerHTML) {
        fiveCardsInLine = true;
        if(!cardPlaceOne.innerHTML && currentCardsArr.length) createNewCardInPlace(cardPlaceOne);
        if(!cardPlaceTwo.innerHTML && currentCardsArr.length) createNewCardInPlace(cardPlaceTwo);
        if(!cardPlaceThree.innerHTML && currentCardsArr.length) createNewCardInPlace(cardPlaceThree);
        if(!cardPlaceFour.innerHTML && currentCardsArr.length) createNewCardInPlace(cardPlaceFour);
        if(!cardPlaceFive.innerHTML && currentCardsArr.length) createNewCardInPlace(cardPlaceFive);

        if(currentCardsArr.length < 16) cardSetFour.style.display = "none";
        if(currentCardsArr.length < 11) cardSetThree.style.display = "none";
        if(currentCardsArr.length < 6) cardSetTwo.style.display = "none";
        if(currentCardsArr.length < 1) cardSetOne.style.display = "none";
    }
    
}


const checkSessionCards = () => {
    sessionCardsValues.firstNumber = sessionPlaceOne.children[0].dataset.number;
    sessionCardsValues.firstColor = sessionPlaceOne.children[0].dataset.color;
    sessionCardsValues.secondNumber = sessionPlaceTwo.children[0].dataset.number;
    sessionCardsValues.secondColor = sessionPlaceTwo.children[0].dataset.color;
    sessionCardsValues.thirdNumber = sessionPlaceThree.children[0].dataset.number;
    sessionCardsValues.thirdColor = sessionPlaceThree.children[0].dataset.color;

    let isValid = true;
    let takeCardsBackInLine = true;
    let isConsecutive = true;
    let isSameColor = false;

    let numArr = [sessionCardsValues.firstNumber, sessionCardsValues.secondNumber, sessionCardsValues.thirdNumber].sort();

    for(let i = 0; i < 2; i++) {
        if(numArr[i+1] - numArr[i] !== 1) isValid = false;
    }
    if(numArr[0] === numArr[1] && numArr[0] === numArr[2]) {isValid = true; isConsecutive = false;}
    if(isConsecutive) {
        if(sessionCardsValues.firstColor === sessionCardsValues.secondColor && sessionCardsValues.firstColor === sessionCardsValues.thirdColor) isSameColor = true;
    }
    if(isValid) takeCardsBackInLine = false;

    if(takeCardsBackInLine) {
        removeCardInSession(sessionPlaceOne.children[0], true);
        removeCardInSession(sessionPlaceTwo.children[0], true);
        removeCardInSession(sessionPlaceThree.children[0], true); 
    } else {
        calculateSessionCards(numArr[0], isConsecutive, isSameColor);
        removeCardInSession(sessionPlaceOne.children[0], false);
        removeCardInSession(sessionPlaceTwo.children[0], false);
        removeCardInSession(sessionPlaceThree.children[0], false); 
    }
}


const calculateSessionCards = (firstNum, isCons, isSameClr) => {
    if(isCons && isSameClr) {
        sessionScore.textContent = firstNum * 10 + 40;
        totalScore += firstNum * 10 + 40;
    } else if(isCons && !isSameClr) {
        sessionScore.textContent = firstNum * 10;
        totalScore += firstNum * 10;
    } else {
        sessionScore.textContent = firstNum * 10 + 10;
        totalScore += firstNum * 10 + 10;
    }
    successOverlay.style.display = "block";
    setTimeout(()=> {
        successText.style.opacity = "1";
        fireworks.style.opacity = "1";
    },10);
    setTimeout(()=> {
        successText.style.opacity = "0";
        fireworks.style.opacity = "0";
    },2000);
    setTimeout(() => {
        sessionScore.textContent = "0";
        successOverlay.style.display = "none";
    },2300)
    totalScoreElement.textContent = totalScore;
    fiveCardsInLine = false;
}


const showInfo = (e) => {
    e.preventDefault();
    if(infoBox.style.display === "none") {
        infoBox.style.display = "block";
        setTimeout(() => {infoBox.style.opacity = "1"}, 100);
    } else {
        infoBox.style.opacity = "0";
        setTimeout(() => {infoBox.style.display = "none";}, 100);
    }
}


const displayTotalScore = (totalScore) => {
    if(totalScore) increaseTotalScore(totalScore, 0);
    finalScoreOverlay.style.transform = "scale(1)";
}


const increaseTotalScore = (totalScore, startScore) => {
    startScore++;
    if(finalScore.textContent > 400) finalScoreOverlay.style.color = "#FFE140";
    finalScore.textContent = startScore;
    if(isFinalScoreDisplayed && startScore < totalScore) {
        setTimeout(() => {
            increaseTotalScore(totalScore, startScore);
        },10);
    } else if(!isFinalScoreDisplayed) finalScore.textContent = 0;
}


const updateHighscoresList = () => {
    if(highScores.length < 10) {
        highScores.push(totalScore);
        highScores.sort((a, b) => b - a);
        localStorage.setItem("highScores", JSON.stringify(highScores));
    } else if(totalScore > highScores[9]) {
        highScores.pop();
        highScores.push(totalScore);
        highScores.sort((a, b) => b - a);
        localStorage.setItem("highScores", JSON.stringify(highScores));
    }
} 

if(!localStorage.getItem("highScores")) {
    localStorage.setItem("highScores", JSON.stringify(highScores));
}
highScores = JSON.parse(localStorage.getItem("highScores"));

if(!localStorage.getItem("overallTotalScore")) {
    localStorage.setItem("overallTotalScore", overallTotalScore);
}
overallTotalScore = +localStorage.getItem("overallTotalScore");


const displayHighscores = (e) => {
    e.preventDefault();
    if(isHighscoresDisplayed) {
        highscoresOverlay.style.transformOrigin = "center";
        highscoresOverlay.style.transform = "scale(0) translateY(40px) translateX(50px)";
        isHighscoresDisplayed = false;
    } else {
        highscoresOverlay.style.transformOrigin = "80% 100%";
        highscoresOverlay.style.transform = "scale(1) translateY(0) translateX(0)";
        isHighscoresDisplayed = true;
    }
    highscoresOverlay.innerHTML = "";
    highscoresOverlay.innerHTML = "<h3>Highscores</h3>";
    highScores.forEach((score, index) => {
        highscoresOverlay.innerHTML += `<div class="highscore-container"><h4 class="black-bg-score">${index + 1}</h4><span>-</span>
        <h4 class="black-bg-score">${score}</h4></div>`;
    });
    highscoresOverlay.innerHTML += `<div class="overall-total-score"><p>Total Score</p>
    <h4 class="black-bg-score">${overallTotalScore}</h4></div>`;
}

// Event Listeners

startBtn.addEventListener("click", startGame);
cardSetOne.addEventListener("click", addCardFromPack);
cardSetTwo.addEventListener("click", addCardFromPack);
cardSetThree.addEventListener("click", addCardFromPack);
cardSetFour.addEventListener("click", addCardFromPack);
infoBtn.addEventListener("click", showInfo);
closeButton.addEventListener("click", () => {finalScoreOverlay.style.transform = "scale(0)"; isFinalScoreDisplayed = false; finalScore.textContent = 0;})
hiScoreBtn.addEventListener("click", displayHighscores);
