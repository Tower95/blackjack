//use model pattern
const miModulo = (() => {
  'use strict'


  let deck = [];

  //html reference
  const buttomDraw = document.querySelector('#btnDraw'),
    buttomHalt = document.querySelector('#btnHalt'),
    buttomNew = document.querySelector('#btnNew');

  //html div cards sections
  const points = document.querySelectorAll('span'),
    divCardsPlayers = document.querySelectorAll('.divCard');


  //points
  let playersPoints = [];

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

    return array;
  }

  // this function start the new deck
  const startGame = (numPlayers = 2) => {
    deck = createDeck()
    playersPoints = [];
    for (let i = 0; i < numPlayers; i++) {
      playersPoints.push(0);
    }
    points.forEach(point => point.innerHTML = 0);
    divCardsPlayers.forEach(div => div.innerHTML = "");

    buttomHalt.disabled = false;
    buttomDraw.disabled = false;

    console.log({ playersPoints });
  }

  const createDeck = () => {

    const suits = ['C', 'D', 'H', 'S'],
      figures = ['A', 'J', 'Q', 'K'];


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

    return shuffle(deck);

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

  // turn: 0 = first player, last turn it's the cpu
  const addPoint = (card, turn) => {
    playersPoints[turn] += cardValue(card);
    points[turn].innerText = playersPoints[turn];
    return playersPoints[turn];
  }

  const renderCard = (card, turn) => {

    let newCard = document.createElement('img');
    newCard.src = `assets/cards/${card}.png`;
    newCard.classList.add('my-card');
    divCardsPlayers[turn].append(newCard)

  }
  const getWinner = () => {

    const [minPoints, cpuPoints] = playersPoints;
    setTimeout(() => {

      let message = 'YOU WON!';
      if (minPoints > 21 && cpuPoints < 21) {
        message = 'CPU WON!';
      } else if ((minPoints < 21) && (cpuPoints < minPoints)) {
        message = 'CPU WON';
      } else if (minPoints == cpuPoints) {
        message = 'TIED';
      } else if (minPoints < cpuPoints && cpuPoints <= 21) {
        message = 'CPU WON';
      }
      alert(message);
    }, 1500);
  }

  // cpu turn
  const cpuTurn = (pointsToWin) => {

    let cpuPoints = 0;
    do {
      //calculate new value
      let card = drawOne(deck);

      //generate and render card
      cpuPoints = addPoint(card, playersPoints.length - 1);

      renderCard(card, playersPoints.length - 1);

      if (pointsToWin > 21) {
        break;
      }


    } while ((cpuPoints < pointsToWin) && (pointsToWin <= 21));

    getWinner();
  }


  //draw event
  buttomDraw.addEventListener('click', () => {
    //calculate new value
    let card = drawOne(deck);
    //generate and render card
    let playerPoints = addPoint(card, 0);

    renderCard(card, 0);

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
    cpuTurn(playersPoints[0]);
  });


  return {
    newGame : startGame 
  };

})();
