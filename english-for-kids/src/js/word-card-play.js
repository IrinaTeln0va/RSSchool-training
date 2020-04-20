export default class WordCardPlay {
  constructor(cardsData) {
    this.word = cardsData.word;
    this.img = cardsData.image;
    this.translation = cardsData.translation;
    this.audio = cardsData.audioSrc;
    this.template = this.getTemplate();
    this.domElement = this.createElement();
    this.audioCardElement = this.getAudioElement();
  }

  getTemplate() {
    return `
      <div class="category-img-wrap">
        <img src="${this.img}" alt="${this.word}">
      </div>
      <div class="category-content">
      </div>`;
  }

  getAudioElement() {
    const audioCardElement = this.domElement.querySelector('audio');

    return audioCardElement;
  }

  createElement() {
    const domElement = document.createElement('li');

    domElement.dataset.cardId = this.word;
    domElement.classList.add('category', 'word-card');
    domElement.innerHTML = this.template;

    return domElement;
  }
}
