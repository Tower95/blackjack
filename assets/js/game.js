'use strict'
/**
 * C - Clubs
 * D - Dimond
 * H - Heart
 * S - Spades
 */

let deck = [];
const suits = ['C', 'D', 'H', 'S'];
const figures = ['A', 'J', 'Q', 'K'];

//html reference
const buttomDraw = document.querySelector('#btnDraw');
const buttomHalt = document.querySelector('#btnHalt');
const buttomNew = document.querySelector('#btnNew');

const points = document.querySelectorAll('span');
const divPlayerCards = document.querySelector('#player-cards');
const divCpuCards = document.querySelector('#cpu-cards');

//points
let playerPoints = 0,
  cpuPoints = 0;


const createDeck = (arr) => {
  for (let i = 2; i <= 10; i++) {
    for (const suit of suits) {
      deck.push(i + suit);
    }
  }
  for (const suit of suits) {
    for (const figure of figures) {
      deck.push(figure + suit);
    }
  }

}

const generateRandom = (base) => Math.floor(Math.random() * base)

const shuffle = (array) => {
  let currendId = array.length

  while (currendId != 0) {

    //generate random
    let randomId = generateRandom(currendId);
    currendId--;

    //swap
    let temporal = array[currendId];
    array[currendId] = array[randomId];
    array[randomId] = temporal;
  }

}

//draw
const drawOne = (array) => {
  let max = array.length

  if (max === 0) {
    throw 'not card left in deck';
  }

  let randomCard = generateRandom(max);
  let card = array[randomCard];

  array = array.splice(randomCard, 1);

  return card;
}

const cardValue = (card) => {
  let value = card.substring(0, card.length - 1);
  return (isNaN(value)) ?
    (value === 'A') ? 11 : 10
    : (value * 1);
}
// cpu turn
const cpuTurn = (pointsToWin) => {

  do {
    //calculate new value
    let card = drawOne(deck);
    cpuPoints += cardValue(card);

    //generate and render card
    points[1].innerText = cpuPoints;
    let newCard = document.createElement('img');
    newCard.src = `assets/cards/${card}.png`;
    newCard.classList.add('my-card');
    divCpuCards.append(newCard)

    if (pointsToWin > 21) {
      break;
    }


  } while ((cpuPoints < pointsToWin) && (pointsToWin <= 21));

  setTimeout(() => {

    let message = 'YOU WON!';
    if (playerPoints > 21 && cpuPoints < 21) {
      message = 'CPU WON!';
    } else if ((playerPoints < 21) && (cpuPoints < playerPoints)) {
      message = 'CPU WON';
    } else if (playerPoints == cpuPoints) {
      message = 'TIED';
    } else if (playerPoints < cpuPoints && cpuPoints <= 21) {
      message = 'CPU WON';
    }
    alert(message);
  }, 1500);
}

createDeck();
shuffle(deck);

//draw event
buttomDraw.addEventListener('click', () => {
  //calculate new value
  let card = drawOne(deck);
  playerPoints += cardValue(card);

  //generate and render card
  points[0].innerText = playerPoints;
  let newCard = document.createElement('img');
  newCard.src = `assets/cards/${card}.png`;
  newCard.classList.add('my-card');
  divPlayerCards.append(newCard)

  if (playerPoints > 21) {
    console.warn('You Lose');
    buttomDraw.disabled = true;
    buttomDraw.disabled = true;
    cpuTurn(playerPoints);

  } else if (playerPoints === 21) {
    console.warn('21, Great!');
    buttomDraw.disabled = true;
    cpuTurn(playerPoints);
  }
});

//Halt event
buttomHalt.addEventListener('click', () => {
  buttomHalt.disabled = true;
  buttomDraw.disabled = true;
  cpuTurn(playerPoints);
});

buttomNew.addEventListener('click', () => {
  console.clear();
  deck = [];
  createDeck()
  shuffle(deck);
  buttomDraw.disabled = false;
  buttomHalt.disabled = false;
  divPlayerCards.innerHTML = "";
  divCpuCards.innerHTML = "";
  cpuPoints = 0;
  playerPoints = 0;
  points[1].innerText = playerPoints;
  points[0].innerText = cpuPoints;
});