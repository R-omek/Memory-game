const cards = document.querySelectorAll('.memory-card');
const btnTryAgain = document.querySelector('.btn-try-again');
const result = document.querySelector('.result');
let videoElem = document.getElementById("video");



let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let i = 0;
let count = 0;


const NO_OF_HIGH_SCORES = 10;
const HIGH_SCORES = 'highScores';
const highScoreString = localStorage.getItem(HIGH_SCORES);
const highScores = JSON.parse(highScoreString) ?? [];













/* functions*/

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;

        return;
    }

    secondCard = this;
    count+=1;
    checkForMatch()
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === 
    secondCard.dataset.framework;


    isMatch ? disableCards() : unflipCards(); 
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
    i+=1; 
    if(i === 6){
        setTimeout (() => {
            btnTryAgain.style.display = 'flex';
            result.textContent += 'Your result: ' + count + ' efforts.';
            playVideo()
             
            checkHighScore(count);

           
        }, 500);
        
    }
}

async function playVideo() {
    await videoElem.play();
}

function unflipCards() {
    lockBoard = true;

    setTimeout (() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

    resetBoard();
    }, 700);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

function restartGame(){
    location.reload(false);
}


function checkHighScore(count) {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.count ?? 0;
    console.log(lowestScore);
    
    if (count < lowestScore) {
      saveHighScore(count, highScores);
      showHighScores();
    } else if (count > 0) {
      saveHighScore(count, highScores);
      showHighScores();
    }
  }


  function saveHighScore(count, highScores) {
    const name = prompt('You got a highscore! Enter name:');
    const newScore = { count, name };
    
    // 1. Add to list
    highScores.push(newScore);
  
    // 2. Sort the list
    highScores.sort((b, a) => b.count - a.count);
    
    // 3. Select new list
    highScores.splice(NO_OF_HIGH_SCORES);
    
    // 4. Save to local storage
    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
  };

  
  showHighScores();
  function showHighScores() {
      const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
      const highScoreList = document.getElementById(HIGH_SCORES);
      
      highScoreList.innerHTML = highScores
        .map((name) => `<li>${name.name} - ${name.count}`)
        .join('');
    }

  



 
btnTryAgain.addEventListener('click', restartGame);
cards.forEach(card => card.addEventListener('click', flipCard));