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
        const currentIndex = typedText.length - 1;

        if (currentIndex >= 0) {
            const currentSpan = spans[currentIndex];
            if (typedText[currentIndex] === targetText[currentIndex]) {
                currentSpan.classList.remove('jump');
                void currentSpan.offsetWidth;  // Trigger reflow
                currentSpan.classList.add('jump');
                console.log(`Jump animation added to ${currentSpan.textContent}`);
            } else {
                currentSpan.classList.remove('shake');
                void currentSpan.offsetWidth;  // Trigger reflow
                currentSpan.classList.add('shake');
                console.log(`Shake animation added to ${currentSpan.textContent}`);
            }
        }

        if (typedText === targetText) {
            score++;
            updateScore();
            userInput.value = '';
            textToType.innerHTML = getHighlightedText(getRandomText(), '');
        }
    }

    function endGame() {
        clearInterval(timer);
        userInput.removeEventListener('input', checkInput);
        alert(`Game over! Your score is ${score}`);
    }

    startButton.addEventListener('click', startGame);

    loadPhrases();
});
