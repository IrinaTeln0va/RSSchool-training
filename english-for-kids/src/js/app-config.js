class AppConfig {
  constructor() {
    this.mode = 'train';
    this.pageContainer = document.querySelector('.container');
    this.pages = ['categoriesList', 'wordsListTrain', 'wordsListPlay'];
  }
}

export default new AppConfig();
