import { appConfig } from './app-config.js';
import { WordsListTrain } from './words-list-train.js';
import { WordsListPlay } from './words-list-play.js';
import { CategoriesList } from './categories-list.js';
import { statistic } from './statistic.js';

export class Container {
  constructor() {
    this.domElement = document.querySelector('.container');
    this._onPageChange = this._onPageChange.bind(this);
    window.addEventListener('hashchange', this._onPageChange);
    this.currentPage = null;
  }

  _onPageChange(evt) {
    this.domElement.classList.remove('stat-page');
    // const pageFrom = this.currentPage;
    let content;
    const pageTo = window.location.hash;

    if (pageTo.startsWith('#category')) {
      content = (appConfig.mode === 'train')
      ? new WordsListTrain(window.location.hash.slice(10))
      : new WordsListPlay(window.location.hash.slice(10));
    }
    if (pageTo === '#statistic') {
      content = statistic;
      this.domElement.classList.add('stat-page');
    } 
    if (pageTo === '' || pageTo === '#') {
      content = new CategoriesList();
    }

    this.header.menu.highlightLink(pageTo);
    this._switchScreen(content);
    // if (this.currentPage === appConfig.pages[0]) {
    //   content = (appConfig.mode === 'train')
    //   ? new WordsListTrain(window.location.hash.slice(10))
    //   : new WordsListPlay(window.location.hash.slice(10));
    // }
    // if (this.currentPage === appConfig.pages[1] || this.currentPage === appConfig.pages[2]) {
    //   content = new CategoriesList();
    // }
    // this._switchScreen(content);
  }

  _switchScreen(content) {
    this._removeContent();
    this.addContent(content);
  }

  addContent(content) {
    this.content = content;
    this.content.render();
    this.currentPage = this.content.pageName;
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
    let content;
    if (appConfig.mode === 'train') {
      this.domElement.classList.add('play-mode');
      appConfig.mode = 'play';

      if (this.currentPage === appConfig.pages[1]) {
        content = new WordsListPlay(this.content.categoryId);
        this._switchScreen(content);
      }
    } else {
      this.domElement.classList.remove('play-mode');
      appConfig.mode = 'train';

      if (this.currentPage === appConfig.pages[2]) {
        content = new WordsListTrain(this.content.categoryId);
        this._switchScreen(content);
      }
    }
  } 
}