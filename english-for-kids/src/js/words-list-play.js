import appConfig from './app-config';
import data from './data';
import WordCardPlay from './word-card-play';
import Game from './game';
import statistic from './statistic';

export default class WordsListPlay {
  constructor(categoryId) {
    [, , this.pageName] = appConfig.pages;
    this.categoryId = categoryId;
    this.domElement = this.constructor.createElement();
    this.cardsList = this.getCardsList();
    this.gameControls = this.constructor.createGameControlsElement();
    this.ratingElement = this.constructor.createRatingElement();
    this.clickedCard = null;
    this.onCardsClick = this.onCardsClick.bind(this);
    this.startBtnClickHandler = this.startBtnClickHandler.bind(this);
  }

  static createElement() {
    const domElement = document.createElement('ul');

    domElement.classList.add('cards-list', 'game-disabled');

    return domElement;
  }

  render() {
    this.fillWithContent();
    this.bind();
    appConfig.pageContainer.append(this.domElement);

    if (this.categoryId === 'difficult' && statistic.difficultWords === false) {
      return;
    }

    appConfig.pageContainer.append(this.gameControls);
    this.domElement.append(this.ratingElement);
  }

  unrender() {
    this.unbind();
    this.domElement.remove();
    this.gameControls.remove();
  }

  bind() {
    this.domElement.addEventListener('click', this.onCardsClick);
    this.gameControls.addEventListener('click', this.startBtnClickHandler, { once: true });
  }

  unbind() {
    this.domElement.removeEventListener('click', this.onCardClick);
    this.gameControls.removeEventListener('click', this.startBtnClickHandler);
  }

  onCardsClick({ target }) {
    if (!this.constructor.getTargetElement(target)) {
      return;
    }

    const { targetType, targetElement } = this.constructor.getTargetElement(target);

    if (targetType !== 'card') {
      return;
    }

    const answer = targetElement.dataset.cardId;

    this.onAnswer(answer, targetElement);
  }

  onAnswer() {
    if (!this.isGameStarted) {
      return false;
    }

    return false;
  }

  static getTargetElement(clickedElement) {
    const targetCard = clickedElement.closest('.word-card');

    if (!targetCard) {
      return false;
    }

    return { targetType: 'card', targetElement: targetCard };
  }

  fillWithContent() {
    if (this.cardsList === false) {
      return;
    }

    this.cardsList.forEach((card) => {
      this.domElement.append(card.domElement);
    });
  }

  static createGameControlsElement() {
    const gameControlsElement = document.createElement('div');

    gameControlsElement.classList.add('game-btn-wrap');
    gameControlsElement.innerHTML = `
        <audio src="assets/audio/point.mp3"></audio>
        <button class='btn start-game-btn'></button>`;

    return gameControlsElement;
  }

  static createRatingElement() {
    const ratingElement = document.createElement('ul');

    ratingElement.classList.add('rating');

    return ratingElement;
  }

  startBtnClickHandler() {
    const game = new Game(this);

    this.isGameStarted = true;

    return game;
  }

  getCardsList() {
    if (this.categoryId === 'difficult' && statistic.difficultWords === false) {
      this.domElement.classList.add('empty-page');

      return false;
    }

    let cardsDataList;

    if (this.categoryId === 'difficult') {
      cardsDataList = statistic.difficultWords;
    } else {
      cardsDataList = data.cards[this.categoryId];
    }

    const cardsList = new Array(cardsDataList.length).fill().map((card, index) => {
      const cardsData = cardsDataList[index];

      return new WordCardPlay(cardsData);
    });

    return cardsList;
  }
}
