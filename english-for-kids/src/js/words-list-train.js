import appConfig from './app-config';
import data from './data';
import WordCardTrain from './word-card-train';
import statistic from './statistic';

export default class WordsListTrain {
  constructor(categoryId) {
    [, this.pageName] = appConfig.pages;
    this.categoryId = categoryId;
    this.domElement = this.constructor.createElement();
    this.cardsList = this.getCardsList();
    this.onCardsClick = this.onCardsClick.bind(this);
  }

  static createElement() {
    const domElement = document.createElement('ul');

    domElement.classList.add('cards-list');

    return domElement;
  }

  render() {
    this.fillWithContent();
    this.bind();
    appConfig.pageContainer.append(this.domElement);
  }

  unrender() {
    this.unbind();
    this.domElement.remove();
  }

  bind() {
    this.domElement.addEventListener('click', this.onCardsClick);
  }

  unbind() {
    this.domElement.removeEventListener('click', this.onCardClick);
  }

  onCardsClick({ target }) {
    if (!this.constructor.getTargetElement(target)) {
      return;
    }

    const { targetType, targetElement } = this.constructor.getTargetElement(target);

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

      const { cardId } = targetElement.dataset;
      const card = this.cardsList.find((x) => x.word === cardId);

      card.audioCardElement.play();
      statistic.changeStat(cardId, 'train');
    }
  }

  static getTargetElement(clickedElement) {
    const targetBtn = clickedElement.closest('.flip-card-btn');

    if (targetBtn) {
      return { targetType: 'button', targetElement: targetBtn };
    }

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

      return new WordCardTrain(cardsData);
    });

    return cardsList;
  }
}
