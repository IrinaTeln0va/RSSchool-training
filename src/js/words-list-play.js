import { appConfig } from './app-config.js';
import { data } from './data.js';
import { WordCardPlay } from './word-card-play.js';

export class WordsListPlay {
  constructor(categoryId) {
    this.pageName = appConfig.pages[2];
    this.categoryId = categoryId;
    this.domElement = this._createElement();
    this.cardsList = this._getCardsList();
    this.startGameBtn = this._createGameBtnElement();
    this.isGameStarted = false;
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
    appConfig.pageContainer.append(this.startGameBtn);
  }

  unrender() {
    this._unbind();
    appConfig.pageContainer.remove(this.domElement);
  }

  _bind() {
    this.domElement.addEventListener('click', this._onCardsClick);
    this.startGameBtn.addEventListener('click', this._startBtnClickHandler);
  }

  _unbind() {
    this.domElement.removeEventListener('click', this._onCardClick);
    this.startGameBtn.removeEventListener('click', this._startBtnClickHandler);
  }

  _onCardsClick({ target }) {
    if (this._getTargetElement(target) === false) {
      return;
    }

    const { targetType, targetElement } = this._getTargetElement(target);

    if (targetType === 'card') {
      const card = this.cardsList.find(x => x.word === targetElement.dataset.cardId)
      // card.audioCardElement.play();
    }
  }

  _getTargetElement(clickedElement) {
    // const targetBtn = clickedElement.closest('.flip-card-btn');
    // if (targetBtn) {
    //   return { targetType: 'button', targetElement: targetBtn };
    // }
    const targetCard = clickedElement.closest('.word-card');
    if (!targetCard) {
      return false;
    }
    return { targetType: 'card', targetElement: targetCard };
  }

  _fillWithContent() {
    this.cardsList.forEach((card) => {
      this.domElement.append(card.domElement);
    });
  }

  _createGameBtnElement() {
    const gameBtnWrapper = document.createElement('div');
    gameBtnWrapper.classList.add('game-btn-wrap');
    gameBtnWrapper.innerHTML = `<button class='btn start-game-btn'></button>`;
    // const startGameBtn = document.createElement('button');
    // startGameBtn.classList.add('btn', 'start-game-btn');
    return gameBtnWrapper;
  }

  _startBtnClickHandler() {
    this.isGameStarted = true;
  }

  _getCardsList() {
    const cardsList = new Array(data.cards[this.categoryId].length).fill().map((card, index) => {
      const cardsData = data.cards[this.categoryId][index];
      return new WordCardPlay(cardsData);
    });
    return cardsList;
  }
}