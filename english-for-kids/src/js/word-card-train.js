export class WordCardTrain {
  constructor(cardsData) {
    this.word = cardsData.word,
    this.img = cardsData.image,
    this.translation = cardsData.translation,
    this.audio = cardsData.audioSrc,
    this.template = this._getTemplate(),
    this.domElement = this._createElement(),
    this.audioCardElement = this._getAudioElement()
  }

  _getTemplate() {
    return `
      <div class="front">
        <div class="category-img-wrap">
          <img src="${this.img}" alt="${this.word}">
        </div>
        <div class="category-content">
          <span>${this.word}</span>
          <audio src="${this.audio}"></audio>
          <button type='button' class='btn flip-card-btn'></button>
        </div>
      </div>
      <div class="back">
        <div class="category-img-wrap">
          <img src="${this.img}" alt="${this.word}">
        </div>
        <div class="category-content">
          <span>${this.translation}</span>
        </div>
      </div>`;
  }

  _getAudioElement() {
    const audioCardElement = this.domElement.querySelector('audio');
    return audioCardElement;
  }

  _createElement() {
    const domElement = document.createElement('li');
    domElement.dataset.cardId = this.word;
    domElement.classList.add('category', 'word-card');
    domElement.innerHTML = this.template;
    return domElement;
  }
}