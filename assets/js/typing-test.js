const errorTxt = document.querySelector(".error-ini");
const timerTxt = document.querySelector(".timer-ini");
const accTxt = document.querySelector(".acc-ini");
const errorsTitle = document.querySelector("#errors");
const timerTitle = document.querySelector("#timer");
const accTitle = document.querySelector("#acc");
const loading = document.querySelector(".loading");
const textContent = document.querySelector(".txt-content");
const textInput = document.querySelector("#textInputId");
const startBtn = document.querySelector("#start-btn");
const resetBtn = document.querySelector("#reset-btn");

let errors = 0;
let totalErrors = 0;
let timeLeft = 60;
let timePassed = 0;
let timer = null;
let letterTyped = 0;
let currentText = "";
let splittedTypedWord = [];
let wordpm = 0;
resetBtn.addEventListener('click', reset);
startBtn.addEventListener('click', startTimer);
textInput.addEventListener('focus', startTimer)
textInput.addEventListener('input', handlingUserTextInput);
textInput.addEventListener('keydown', (event) => {
    const key = event.keyCode;
    if (letterTyped > 0) {
        key === 8 || key === 46 ? letterTyped-- : null;
    }
});

function getTextContent() {
    // Fetch new text content from this api
    url = "https://api.chucknorris.io/jokes/random";
    fetch(url)
        .then((response) => response.json())
        .then(text => {
            if (text.value.length >= 70 && text.value.length < 120) {
                loading.style.display = "none";
                currentText = text.value;
                changeTextContent();
            } else {
                getTextContent();
            }
        });
}

function changeTextContent() {
    currentText.split("").map(letter => {
        const letterSpan = document.createElement('span');
        letterSpan.innerText = letter;
        textContent.appendChild(letterSpan);
    });
}

function handlingUserTextInput() {
    userInput = textInput.value;
    splittedUserInput = userInput.split('');
    letterTyped++;
    errors = 0;
    textSpan = textContent.querySelectorAll('span');
    textSpan.forEach((letter, index) => {
        let typed = splittedUserInput[index];
        if (typed == null) {
            letter.classList.remove("correct-letter");
            letter.classList.remove("incorrect-letter");
        } else if (typed === letter.innerText) {
            letter.classList.add("correct-letter");
            letter.classList.remove("incorrect-letter");
            splittedTypedWord = userInput.split(' ');
            errors > 0 ? () => {
                errors--;
                totalErrors--;
            } : null;

        } else if(typed != letter.innerText) {
            errors++;
            totalErrors = errors;
            letter.classList.add("incorrect-letter");
        }
    });

    errorTxt.innerText = errors;
    if (errors > 0) {
        document.querySelector(".errors-sec").classList.add('red-bg');
    } else {
        document.querySelector(".errors-sec").classList.remove('red-bg');
    }
    let correctLetters = letterTyped - (totalErrors + errors);
    let accData = (correctLetters / letterTyped) * 100;
    accTxt.innerText = `${Math.round(accData)}%`;

    if (textInput.value.length === currentText.length) {
        wordpm += splittedTypedWord.length;
        textContent.innerText = null;
        loading.style.display = "block";
        getTextContent();
        totalErrors += errors;
        textInput.value = "";
    }

}

function updateTimer() {
    timeLeft === 0 ? finishTyping() : null;
    if (timeLeft > 0) {
        timeLeft--;
        timePassed++;
        timerTxt.innerText = `${timeLeft}s`;
        timeLeft < 10 ? timerTxt.style.color = 'red' : null;
    }
}

function startTimer() {
    timer = setInterval(updateTimer, 1000);
    timerTxt.textContent = `${timeLeft}s`;
}

function finishTyping() {
    wordpm += splittedTypedWord.length;
    clearInterval(timer);
    textInput.disabled = true;
    textInput.value = "";
    errorsTitle.innerText = "Total errors";
    errorTxt.innerText = totalErrors;
    timerTitle.innerText = 'word p/m';
    timerTxt.style.color = "var(--text-dark)";
    timerTxt.innerText = wordpm;
}

function reset() {
    loading.style.display = 'block';
    errors = 0;
    totalErrors = 0;
    timeLeft = 60;
    timePassed = 0;
    letterTyped = 0;
    textContent.innerText = null;
    textInput.value = "";
    getTextContent();
    textInput.disabled = false;
    errorTxt.innerText = 0;
    errorsTitle.innerText = "Errors";
    timerTxt.innerText = `${timeLeft}s`;
    timerTxt.style.color = "var(--text-dark)";
    clearInterval(timer);

}

getTextContent();
