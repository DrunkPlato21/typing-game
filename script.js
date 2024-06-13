document.addEventListener('DOMContentLoaded', () => {
    const textToType = document.getElementById('textToType');
    const userInput = document.getElementById('userInput');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('startButton');

    let score = 0;
    let timeLeft = 60;
    let timer;
    let textArray = [];

    // Function to fetch phrases from the text file
    function loadPhrases() {
        fetch('phrases.txt')
            .then(response => response.text())
            .then(data => {
                textArray = data.split('\n').map(phrase => phrase.trim()).filter(phrase => phrase.length > 0);
                console.log('Phrases loaded:', textArray);
            })
            .catch(error => console.error('Error loading phrases:', error));
    }

    function startGame() {
        if (textArray.length === 0) {
            alert('No phrases loaded. Please check the phrases file.');
            return;
        }
        score = 0;
        timeLeft = 60;
        updateScore();
        updateTime();
        userInput.value = '';
        userInput.focus();
        textToType.innerHTML = getHighlightedText(getRandomText(), '');
        clearInterval(timer);
        timer = setInterval(countdown, 1000);
        userInput.addEventListener('input', checkInput);
    }

    function countdown() {
        if (timeLeft > 0) {
            timeLeft--;
            updateTime();
        } else {
            endGame();
        }
    }

    function updateTime() {
        timerDisplay.textContent = `Time: ${timeLeft}`;
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function getRandomText() {
        return textArray[Math.floor(Math.random() * textArray.length)];
    }

    function getHighlightedText(text, typedText) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            if (i < typedText.length) {
                if (text[i] === typedText[i]) {
                    result += `<span class="correct">${text[i]}</span>`;
                } else {
                    result += `<span class="incorrect">${text[i]}</span>`;
                }
            } else {
                result += `<span>${text[i]}</span>`;
            }
        }
        return result;
    }
    
    function checkInput() {
        const typedText = userInput.value;
        const targetText = textToType.textContent;
    
        textToType.innerHTML = getHighlightedText(targetText, typedText);
    
        const spans = textToType.querySelectorAll('span');
    
        for (let i = 0; i < typedText.length; i++) {
            if (typedText[i] === targetText[i]) {
                spans[i].classList.add('jump');
                spans[i].classList.remove('shake');
            } else {
                spans[i].classList.add('shake');
                spans[i].classList.remove('jump');
            }
        }
    
        if (typedText === targetText) {
            score++;
            updateScore();
            userInput.value = '';
            textToType.innerHTML = getHighlightedText(getRandomText(), '');
        }
    }

    startButton.addEventListener('click', startGame);

    // Load phrases when the page loads
    loadPhrases();
});
