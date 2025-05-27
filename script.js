const board = document.getElementById('gameBoard');
const movesCounter = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');

const emojis = ['🍕', '🎮', '🚗', '🐱', '🎵', '🏀', '🌈', '🧠'];
let cardsArray = [...emojis, ...emojis]; // 16 cards
let flippedCards = [];
let matched = 0;
let moves = 0;
let timer;
let time = 0;

// Sound effects
const flipSound = new Audio('sounds/flip.mp3.wav');
const matchSound = new Audio('sounds/match.mp3.wav');
const wrongSound = new Audio('sounds/wrong.mp3.wav');
const winSound = new Audio('sounds/win.mp3.wav');

// Shuffle function
function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

// Start the timer
function startTimer() {
  timer = setInterval(() => {
    time++;
    timerDisplay.textContent = `Time: ${time}s`;
  }, 1000);
}

// Create the board
function createBoard() {
  cardsArray = shuffle(cardsArray);
  board.innerHTML = '';
  cardsArray.forEach((emoji) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${emoji}</div>
      </div>
    `;

    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (!timer) startTimer();

  if (
    flippedCards.length < 2 &&
    !this.classList.contains('flipped') &&
    !this.classList.contains('matched')
  ) {
    flipSound.play();
    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      checkMatch();
    }
  }
}

function checkMatch() {
  moves++;
  movesCounter.textContent = `Moves: ${moves}`;

  const [card1, card2] = flippedCards;
  if (card1.dataset.emoji === card2.dataset.emoji) {
    matchSound.play();
    card1.classList.add('matched');
    card2.classList.add('matched');
    matched += 2;

    if (matched === cardsArray.length) {
  clearInterval(timer);
  winSound.play();
  setTimeout(() => {
    document.getElementById('winStats').textContent = `You won in ${moves} moves and ${time} seconds!`;
    document.getElementById('winModal').style.display = 'flex';
  }, 500);
}


    flippedCards = [];
  } else {
    wrongSound.play();
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

function resetGame() {
  moves = 0;
  time = 0;
  matched = 0;
  flippedCards = [];
  document.getElementById('winModal').style.display = 'none';
  movesCounter.textContent = `Moves: 0`;
  timerDisplay.textContent = `Time: 0s`;
  clearInterval(timer);
  timer = null;
  createBoard();
}

createBoard();
