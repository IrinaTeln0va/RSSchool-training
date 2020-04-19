import { appConfig } from './app-config.js';
import { data } from './data.js';
import { CategoryCard } from './category-card.js';

export class CategoriesList {
  constructor() {
    this.pageName = appConfig.pages[0];
    this.domElement = this._createElement();
    this.itemsArray = this._getItemsArray();
    this._onCategoryClick = this._onCategoryClick.bind(this);
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
    this.domElement.addEventListener('click', this._onCategoryClick);
  }

  unbind() {
    this.domElement.removeEventListener('click', this._onCategoryClick);
  }

  _onCategoryClick({ target }) {
    const targetCard = target.closest('.category');

    if (!targetCard) {
      return;
    }

    const category = targetCard.querySelector('.category-content').innerText;

    data.categories.forEach((categoryTitle, index) => {
      if (category === categoryTitle) {
        const cardsListId = index;

        window.location.hash = `category-${cardsListId}`;
      }
    });
  }

  _fillWithContent() {
    const templatesArray = this.itemsArray.forEach((objItem) => {
      this.domElement.append(objItem.domElement);
    });
  }

  _getItemsArray() {
    const itemsArray = new Array(data.categories.length).fill().map((item, index) => {
      const categoryName = data.categories[index];
      const categoryImage = data.cards[index][0].image;

      return new CategoryCard(categoryName, categoryImage);
    });

    return itemsArray;
  }
}
