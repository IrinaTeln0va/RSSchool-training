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
    const domElement = document.createElement('div');
    domElement.classList.add('statistic-wrap');
    domElement.innerHTML = `
      <div class='support-elements'>
        <div class='support-legend'>
          <h4 class='legend-title'>Обозначения категорий</h4>
          <ul class="legend">
            ${data.categories.map((category) => `
              <li class='category-title'>
                <em>${category}</em>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class='support-options'>
          <button class='btn-stat train-difficult'>Train difficult</button>
          <button class='btn-stat reset-stat'>Reset statistic</button>
        </div>
      </div>
      <table class='statistic'>
        <tr class='title'>
          <th><strong>№</strong></th>
          <th class='adaptive'><strong><span class='icon group' title='category'></span>Категория</strong></th>
          <th><strong>Слово</strong></th>
          <th><strong>Перевод</strong></th>
          <th class='adaptive'><strong><span class='icon train' title='train'></span></strong></th>
          <th class='adaptive'><strong><span class='icon play' title='play'></span></strong></th>
          <th class='adaptive'><strong><span class='icon error' title='error'></span></strong></th>
          <th class='adaptive'><strong><span class='icon percent' title='percent'></span></strong></th>
        </tr>
        ${this.currentData.map((word, index) => `
          <tr>
            <td>${index + 1}</td>
            <td><span class='category-title'>${word.category}</td>
            <td>${word.word}</span></td>
            <td>${word.translate}</td>
            <td>${word.trainClick}</td>
            <td>${word.playClick}</td>
            <td>${word.errors}</td>
            <td>${word.errors == 0 ? 0 : Math.round(word.errors / word.playClick * 100)}</td>
          </tr>`
        ).join('')}
      </table>`;

      const legendItem = domElement.querySelectorAll('.legend li');
      [...legendItem].forEach((item, index) => {
        item.style.borderLeftColor = data.categoryColors[index];
      });

    const wordItem = domElement.querySelectorAll('.category-title');
    [...wordItem].forEach((item) => {
      item.style.borderLeftColor = data.categoryColors[data.categories.findIndex((category) => category === item.innerText)];
    });

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