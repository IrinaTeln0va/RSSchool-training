import { appConfig } from './app-config.js';
import { data } from './data.js';
import { WordCardTrain } from './word-card-train.js';
import { statistic } from './statistic.js';

export class WordsListTrain {
  constructor(categoryId) {
    this.pageName = appConfig.pages[1];
    this.categoryId = categoryId;
    this.domElement = this._createElement();
    this.cardsList = this._getCardsList();
    this._onCardsClick = this._onCardsClick.bind(this);
  }

  _createElement() {
    const domElement = document.createElement('ul');
    domElement.classList.add('cards-list');
    return domElement;
  }

  render() {
    this._fillWithContent();
    this.bind();
    appConfig.pageContainer.append(this.domElement);
  }

  unrender() {
    this.unbind();
    this.domElement.remove();
  }

  bind() {
    this.domElement.addEventListener('click', this._onCardsClick);
  }

  unbind() {
    this.domElement.removeEventListener('click', this._onCardClick);
  }

  _onCardsClick({ target }) {
    if (this._getTargetElement(target) === false) {
      return;
    }

    const { targetType, targetElement } = this._getTargetElement(target);

    if (targetType === 'button') {
      const targetCard = target.closest('.word-card');
      targetCard.classList.add('active');

      targetCard.addEventListener('mouseleave', (evt) => {
        evt.target.classList.remove('active');
      }, { once: true });

      const word = targetElement.closest('.word-card').dataset.cardId;
      statistic.changeStat(word, 'train');
    }

    if (targetType === 'card') {
      if (targetElement.classList.contains('active')) {
        return;
      }
      const cardId = targetElement.dataset.cardId;
      const card = this.cardsList.find(x => x.word === cardId)
      card.audioCardElement.play();
      statistic.changeStat(cardId, 'train');
    }
  }

  _getTargetElement(clickedElement) {
    const targetBtn = clickedElement.closest('.flip-card-btn');
    if (targetBtn) {
      return {targetType: 'button', targetElement: targetBtn};
    }
    const targetCard = clickedElement.closest('.word-card');
    if (!targetCard) {
      return false;
    }
    return {targetType: 'card', targetElement: targetCard};
  }

  // _getCardFromDomElement(cardId) {
  //   return this.itemsArray.find(item => item.word === cardId);
  // }

  _fillWithContent() {
    this.cardsList.forEach((card) => {
      this.domElement.append(card.domElement);
    });
  }

  _getCardsList() {
    const cardsList = new Array(data.cards[this.categoryId].length).fill().map((card, index) => {
      const cardsData = data.cards[this.categoryId][index];
      return new WordCardTrain(cardsData);
    });
    return cardsList;
  }
}