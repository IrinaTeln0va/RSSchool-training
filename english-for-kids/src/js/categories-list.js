import appConfig from './app-config';
import data from './data';
import CategoryCard from './category-card';

export default class CategoriesList {
  constructor() {
    [this.pageName] = appConfig.pages;
    this.domElement = this.constructor.createElement();
    this.itemsArray = this.constructor.getItemsArray();
    this.onCategoryClick = this.constructor.onCategoryClick.bind(this);
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
    this.domElement.addEventListener('click', this.onCategoryClick);
  }

  unbind() {
    this.domElement.removeEventListener('click', this.onCategoryClick);
  }

  static onCategoryClick({ target }) {
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

  fillWithContent() {
    this.itemsArray.forEach((objItem) => {
      this.domElement.append(objItem.domElement);
    });
  }

  static getItemsArray() {
    const itemsArray = new Array(data.categories.length).fill().map((item, index) => {
      const categoryName = data.categories[index];
      const categoryImage = data.cards[index][0].image;

      return new CategoryCard(categoryName, categoryImage);
    });

    return itemsArray;
  }
}
