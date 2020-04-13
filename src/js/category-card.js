export class CategoryCard {
  constructor(word, img) {
    this.word = word,
    this.img = img,
    this.template = this._getTemplate(),
    this.domElement = this._createElement()
  }

  _getTemplate() {
    return `
      <div class="category-img-wrap">
        <img src="${this.img}" alt="${this.word}">
      </div>
      <div class="category-content">
        ${this.word}
      </div>`;
  }

  _createElement() {
    const domElement = document.createElement('li');
    domElement.classList.add('category');
    domElement.innerHTML = this.template;
    return domElement;
  }
}