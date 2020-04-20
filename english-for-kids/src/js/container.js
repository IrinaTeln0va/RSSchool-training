import appConfig from './app-config';
import WordsListTrain from './words-list-train';
import WordsListPlay from './words-list-play';
import CategoriesList from './categories-list';
import statistic from './statistic';

export default class Container {
  constructor() {
    this.domElement = document.querySelector('.container');
    this.onPageChange = this.onPageChange.bind(this);
    window.addEventListener('hashchange', this.onPageChange);
    this.currentPage = null;
  }

  onPageChange() {
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

    if (pageTo === '#difficult') {
      if (appConfig.mode !== 'train') {
        const toggler = appConfig.pageContainer.querySelector('.toggler-wrapper');
        const event = new Event('click');

        toggler.dispatchEvent(event);
      }

      content = new WordsListTrain('difficult');
    }

    this.header.menu.highlightLink(pageTo);
    this.switchScreen(content);
  }

  switchScreen(content) {
    this.removeContent();
    this.addContent(content);
  }

  addContent(content) {
    this.content = content;
    this.content.render();
    this.currentPage = this.content.pageName;
  }

  removeContent() {
    this.content.unrender();
    this.content = null;
  }

  addHeader(header) {
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
        this.switchScreen(content);
      }
    } else {
      this.domElement.classList.remove('play-mode');
      appConfig.mode = 'train';

      if (this.currentPage === appConfig.pages[2]) {
        content = new WordsListTrain(this.content.categoryId);
        this.switchScreen(content);
      }
    }
  }
}
