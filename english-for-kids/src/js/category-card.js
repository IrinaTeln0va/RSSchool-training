export default class CategoryCard {
  constructor(word, img) {
    this.word = word;
    this.img = img;
    this.template = this.getTemplate();
    this.domElement = this.createElement();
  }

  getTemplate() {
    return `
      <div class="category-img-wrap">
        <img src="${this.img}" alt="${this.word}">
      </div>
      <div class="category-content">
        ${this.word}
      </div>`;
  }

  createElement() {
    const domElement = document.createElement('li');

    domElement.classList.add('category');
    domElement.innerHTML = this.template;

    return domElement;
  }
}
