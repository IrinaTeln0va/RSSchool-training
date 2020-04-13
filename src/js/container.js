import { appConfig } from './app-config.js';
import { WordsListTrain } from './words-list-train.js';
// import { PageNavigator } from './page-navigator.js';

export class Container {
  constructor() {
    this.domElement = document.querySelector('.container');
    this._onPageChange = this._onPageChange.bind(this);
    this.domElement.addEventListener('changePage', this._onPageChange);
  }

  _onPageChange(evt) {
    const pageFrom = evt.detail.triggerObj.pageName;
    let content;
    if (pageFrom === 'categoriesList') {
      content = new WordsListTrain(evt.detail.cardsListId);
    }
    this._removeContent();
    this.addContent(content);
  }

  addContent(content) {
    this.content = content;
    this.content.render();
  }

  _removeContent() {
    this.content.unrender();
    this.content = null;
  }

  _addHeader(header) {
    this.header = header;
    this.header.render();
    this.header.toggle.onModeChange = this.changeMode.bind(this);
  }

  changeMode() {
    if (appConfig.mode === 'train') {
      this.domElement.classList.add('play-mode');
      appConfig.mode = 'play';
    } else {
      this.domElement.classList.remove('play-mode');
      appConfig.mode = 'train';
    }
  } 
}