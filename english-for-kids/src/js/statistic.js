import { appConfig } from './app-config.js';
import { data } from './data.js';

class Statistic {
  constructor() {
    this.pageName = 'statistic';
    this.initialData = this._getWordsList();
    this.currentData;
    this.init();
  }

  init() {
    if (!localStorage.statistic) {
      localStorage.setItem('statistic', JSON.stringify(this.initialData));
      this.currentData = this.initialData;
    }
    this.currentData = JSON.parse(localStorage.getItem('statistic'));
  }
  changeStat(word, mode, check) {
    // const statistic = this.currentData;
    const wordItem = this.currentData.find((item) => item.word === word);
    switch(mode) {
      case 'train':
        wordItem.trainClick += 1;
        break;
      case 'play':
        wordItem.playClick += 1;
        if (!check) {
          wordItem.errors += 1;
        }
        break;
    }
    localStorage.statistic = JSON.stringify(this.currentData);
  }
  _resetStatistic() {
    localStorage.statistic = JSON.stringify(this.initialData);
    this.currentData = this.initialData;
  }
  render() {
    this.domElement = this._createDomElement();
    appConfig.pageContainer.append(this.domElement);
  }
  unrender() {
    this.domElement.remove();
  }
  _createDomElement() {
    const domElement = document.createElement('table');
    domElement.classList.add('statistic');
    domElement.innerHTML = `
      <tr class='title'>
        <th><strong>№</strong></th>
        <th><strong>Категория</strong></th>
        <th><strong>Слово</strong></th>
        <th><strong>Перевод</strong></th>
        <th><strong>Тренировки</strong></th>
        <th><strong>Угадывания</strong></th>
        <th><strong>Ошибки</strong></th>
      </tr>
      ${this.currentData.map((word, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${word.category}</td>
          <td>${word.word}</td>
          <td>${word.translate}</td>
          <td>${word.trainClick}</td>
          <td>${word.playClick}</td>
          <td>${word.errors}</td>
        </tr>`
      ).join('')}`;

    return domElement;
  }

  _getWordsList() {
    const wordsList = [];
    for (let i = 0; i < data.cards.length; i++) {
      const categoryWordsList = data.cards[i];
      for (let j = 0; j < categoryWordsList.length; j++) {
        const wordData = categoryWordsList[j];
        wordsList.push({
          category: data.categories[i],
          word: wordData.word,
          translate: wordData.translation,
          trainClick: 0,
          playClick: 0,
          errors: 0
        });
      }
    }
    return wordsList;
  }
}

export const statistic = new Statistic();