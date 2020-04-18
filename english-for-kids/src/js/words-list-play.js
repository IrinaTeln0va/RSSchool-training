import { appConfig } from './app-config.js';
import { data } from './data.js';
import { WordCardPlay } from './word-card-play.js';
import { Game } from './game.js';
import { statistic } from './statistic.js';

export class WordsListPlay {
  constructor(categoryId) {
    this.pageName = appConfig.pages[2];
    this.categoryId = categoryId;
    this.domElement = this._createElement();
    this.cardsList = this._getCardsList();
    this.gameControls = this._createGameControlsElement();
    this.ratingElement = this._createRatingElement();
    this.clickedCard = null;
    this._onCardsClick = this._onCardsClick.bind(this);
    this._startBtnClickHandler = this._startBtnClickHandler.bind(this);
  }

  _createElement() {
    const domElement = document.createElement('ul');
    domElement.classList.add('cards-list');
    return domElement;
  }

  render() {
    this._fillWithContent();
    this._bind();
    appConfig.pageContainer.append(this.domElement);
    if (this.categoryId === 'difficult' && statistic.difficultWords === false) {
      return;
    }
    appConfig.pageContainer.append(this.gameControls);
    this.domElement.append(this.ratingElement);
  }

  unrender() {
    this._unbind();
    this.domElement.remove();
    this.gameControls.remove();
    // this.ratingElement.remove();
  }

  _bind() {
    this.domElement.addEventListener('click', this._onCardsClick);
    this.gameControls.addEventListener('click', this._startBtnClickHandler, {once: true});
  }

  _unbind() {
    this.domElement.removeEventListener('click', this._onCardClick);
    this.gameControls.removeEventListener('click', this._startBtnClickHandler);
  }

  _onCardsClick({ target }) {
    if (this._getTargetElement(target) === false) {
      return;
    }
    const { targetType, targetElement } = this._getTargetElement(target);
    if (targetType === 'card') {
      const card = this.cardsList.find(x => x.word === targetElement.dataset.cardId);
    }
    const answer = targetElement.dataset.cardId;
    this.onAnswer(answer, targetElement);
  }

  onAnswer() { 
  }

  _getTargetElement(clickedElement) {
    const targetCard = clickedElement.closest('.word-card');
    if (!targetCard) {
      return false;
    }
    return { targetType: 'card', targetElement: targetCard };
  }

  _fillWithContent() {
    if (this.cardsList === false) {
      return;
    }
    this.cardsList.forEach((card) => {
      this.domElement.append(card.domElement);
    });
  }

  _createGameControlsElement() {
    const gameControlsElement = document.createElement('div');
    gameControlsElement.classList.add('game-btn-wrap');
    gameControlsElement.innerHTML = `
        <audio src="assets/audio/point.mp3"></audio>
        <button class='btn start-game-btn'></button>`;
    return gameControlsElement;
  }

  _createRatingElement() {
    const ratingElement = document.createElement('ul');
    ratingElement.classList.add('rating');
    return ratingElement;
  }

  _startBtnClickHandler() {
    new Game(this);
  }

  _getCardsList() {
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