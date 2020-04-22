import appConfig from './app-config';
import data from './data';

class Statistic {
  constructor() {
    this.pageName = 'statistic';
    this.initialData = this.constructor.getWordsList();
    this.init();
  }

  init() {
    if (!localStorage.statistic) {
      localStorage.setItem('statistic', JSON.stringify(this.initialData));
      this.currentData = this.constructor.getWordsList();
    }

    this.currentData = JSON.parse(localStorage.getItem('statistic'));
  }

  changeStat(word, mode, check) {
    const wordItem = this.currentData.find((item) => item.word === word);

    switch (mode) {
      case 'train':
        wordItem.trainClick += 1;
        break;
      case 'play':
        wordItem.playClick += 1;

        if (!check) {
          wordItem.errors += 1;
        }

        break;
      default: break;
    }
    localStorage.statistic = JSON.stringify(this.currentData);
  }

  resetStatistic() {
    localStorage.statistic = JSON.stringify(this.initialData);
    this.currentData = this.constructor.getWordsList();
  }

  render(statData) {
    this.domElement = this.createDomElement(statData);
    this.resetBtn = this.domElement.querySelector('.reset-stat');
    this.toDifficultBtn = this.domElement.querySelector('.train-difficult');
    this.tableCaptions = this.domElement.querySelector('tr.title');
    appConfig.pageContainer.append(this.domElement);
    this.bind();
  }

  unrender() {
    this.domElement.remove();
  }

  bind() {
    this.resetBtn.addEventListener('click', this.resetBtnClickHandler.bind(this));
    this.toDifficultBtn.addEventListener('click', this.toDifficultBtnClick.bind(this));
    this.tableCaptions.addEventListener('click', this.sortStatisticHandler.bind(this));
  }

  resetBtnClickHandler() {
    this.resetStatistic();
    this.unrender();
    this.render();
  }

  toDifficultBtnClick() {
    this.difficultWords = this.getDifficultWords();
    window.location.hash = '#difficult';
  }

  sortStatisticHandler(evt) {
    evt.preventDefault();
    const { target } = evt;

    if (!evt.target.classList.contains('sort')) {
      return;
    }

    const targetTitle = target.closest('.sort-btn');
    const sortTitle = targetTitle.dataset.title;
    const isUpSort = target.classList.contains('sort-up');

    if (targetTitle.classList.contains('active') && target.classList.contains('reset')) {
      this.resetSort();

      return;
    }

    const sortedList = this.getSortedList(sortTitle, isUpSort);

    this.unrender();
    this.render(sortedList);
    document.querySelector(`[data-title=${sortTitle}]`).classList.add('active');
  }

  resetSort() {
    const sortedList = this.getSortedList('index', true);

    this.unrender();
    this.render(sortedList);
    [...document.querySelectorAll('.sort-btn')].forEach((elem) => {
      elem.classList.remove('active');
    });
  }

  getSortedList(sortTitle, isUpSort) {
    const statData = [...this.currentData];

    if (isUpSort) {
      switch (sortTitle) {
        case 'index':
          return statData.sort((a, b) => (statData.indexOf(a) > statData.indexOf(b) ? 1 : -1));
        case 'percent':
          return statData.sort((a, b) => {
            const percentage1 = a.playClick === 0 ? 0 : a.errors / a.playClick;
            const percentage2 = b.playClick === 0 ? 0 : b.errors / b.playClick;

            return percentage1 > percentage2 ? 1 : -1;
          });
        default:
          return statData.sort((a, b) => (a[sortTitle] > b[sortTitle] ? 1 : -1));
      }
    } else {
      switch (sortTitle) {
        case 'index':
          return statData.sort((a, b) => (statData.indexOf(b) > statData.indexOf(a) ? 1 : -1));
        case 'percent':
          return statData.sort((a, b) => {
            const percentage1 = a.playClick === 0 ? 0 : a.errors / a.playClick;
            const percentage2 = b.playClick === 0 ? 0 : b.errors / b.playClick;

            return percentage1 < percentage2 ? 1 : -1;
          });
        default:
          return statData.sort((a, b) => (a[sortTitle] < b[sortTitle] ? 1 : -1));
      }
    }
  }

  createDomElement(statData = this.currentData) {
    const domElement = document.createElement('div');

    domElement.classList.add('statistic-wrap');
    domElement.innerHTML = `
      <div class='support-elements'>
        <div class='support-legend'>
          <h4 class='legend-title'>Legend</h4>
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
          <th data-title='index' class='sort-btn'>
            <strong>№</strong>
            <ul>
                <li><a class='sort sort-up' href="#">in ascending order</a></li>
                <li><a class='sort sort-down' href="#">in descending order</a></li>
                <li><a class='sort sort-down reset' href="#">reset filters</a></li>
            </ul>
          </th>
          <th data-title='category' class='adaptive sort-btn'>
            <strong>
              <span class='icon group' title='category'></span>
              Category
            </strong>
            <ul>
                <li><a class='sort sort-up' href="#">in ascending order</a></li>
                <li><a class='sort sort-down' href="#">in descending order</a></li>
                <li><a class='sort sort-down reset' href="#">reset filters</a></li>
            </ul>
          </th>
          <th data-title='word' class='sort-btn'>
            <strong>
              Word
            </strong>
            <ul>
                <li><a class='sort sort-up' href="#">in ascending order</a></li>
                <li><a class='sort sort-down' href="#">in descending order</a></li>
                <li><a class='sort sort-down reset' href="#">reset filters</a></li>
            </ul>
          </th>
          <th data-title='translate' class='sort-btn'>
            <strong>
              Translation
            </strong>
            <ul>
                <li><a class='sort sort-up' href="#">in ascending order</a></li>
                <li><a class='sort sort-down' href="#">in descending order</a></li>
                <li><a class='sort sort-down reset' href="#">reset filters</a></li>
            </ul>
          </th>
          <th data-title='trainClick' class='adaptive sort-btn'>
            <strong>
              <span class='icon train' title='train'>
              </span>
            </strong>
            <ul>
                <li><a class='sort sort-up' href="#">in ascending order</a></li>
                <li><a class='sort sort-down' href="#">in descending order</a></li>
                <li><a class='sort sort-down reset' href="#">reset filters</a></li>
            </ul>
          </th>
          <th data-title='playClick' class='adaptive sort-btn'>
            <strong>
              <span class='icon play' title='play'>
              </span>
            </strong>
            <ul>
                <li><a class='sort sort-up' href="#">in ascending order</a></li>
                <li><a class='sort sort-down' href="#">in descending order</a></li>
                <li><a class='sort sort-down reset' href="#">reset filters</a></li>
            </ul>
          </th>
          <th data-title='errors' class='adaptive sort-btn'>
            <strong>
              <span class='icon error' title='errors amount'>
              </span>
            </strong>
            <ul>
                <li><a class='sort sort-up' href="#">in ascending order</a></li>
                <li><a class='sort sort-down' href="#">in descending order</a></li>
                <li><a class='sort sort-down reset' href="#">reset filters</a></li>
            </ul>
          </th>
          <th data-title='percent' class='adaptive sort-btn'>
            <strong>
              <span class='icon percent' title='percentage of error'>
              </span>
            </strong>
            <ul>
                <li><a class='sort sort-up' href="#">in ascending order</a></li>
                <li><a class='sort sort-down' href="#">in descending order</a></li>
                <li><a class='sort sort-down reset' href="#">reset filters</a></li>
            </ul>
          </th>
        </tr>
        ${statData.map((word, index) => `
          <tr>
            <td>${index + 1}</td>
            <td><span class='category-title'>${word.category}</td>
            <td>${word.word}</span></td>
            <td>${word.translate}</td>
            <td>${word.trainClick}</td>
            <td>${word.playClick}</td>
            <td>${word.errors}</td>
            <td>${word.errors === 0 ? 0 : Math.round((word.errors / word.playClick) * 100)}</td>
          </tr>`).join('')}
      </table>`;

    const legendItem = domElement.querySelectorAll('.legend li');

    [...legendItem].forEach((item, index) => {
      const elem = item;

      elem.style.borderLeftColor = data.categoryColors[index];
    });

    const wordItem = domElement.querySelectorAll('.category-title');

    [...wordItem].forEach((item) => {
      const categoryKey = item;
      const arr = data.categoryColors;
      const color = arr[data.categories.findIndex((category) => category === item.innerText)];

      categoryKey.style.borderLeftColor = color;
    });

    return domElement;
  }

  static getWordsList() {
    const wordsList = [];

    for (let i = 0; i < data.cards.length; i += 1) {
      const categoryWordsList = data.cards[i];

      for (let j = 0; j < categoryWordsList.length; j += 1) {
        const wordData = categoryWordsList[j];

        wordsList.push({
          category: data.categories[i],
          word: wordData.word,
          translate: wordData.translation,
          trainClick: 0,
          playClick: 0,
          errors: 0,
        });
      }
    }

    return wordsList;
  }

  getDifficultWords() {
    let errorWords = this.currentData.filter((wordItem) => (wordItem.errors > 0));

    errorWords.sort((a, b) => (b.errors / b.playClick) - (a.errors / a.playClick));

    if (errorWords.length === 0) {
      return false;
    }

    errorWords = errorWords.filter((item, index) => (index < 8));

    const cardList = errorWords.map((statisticWordItem) => {
      for (let i = 0; i < data.cards.length; i += 1) {
        const category = data.cards[i];

        for (let j = 0; j < category.length; j += 1) {
          const wordItem = category[j];

          if (wordItem.word === statisticWordItem.word) {
            return wordItem;
          }
        }
      }
      return false;
    });

    return cardList;
  }
}

export default new Statistic();
