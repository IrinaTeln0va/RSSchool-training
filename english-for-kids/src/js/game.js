import data from './data';
import appConfig from './app-config';
import statistic from './statistic';

export default class Game {
  constructor(wordsListPlay) {
    this.isGameStarted = false;
    this.wordsListPlay = wordsListPlay;
    this.startGameBtn = this.wordsListPlay.gameControls.querySelector('.btn');
    this.audioPlayer = this.wordsListPlay.gameControls.querySelector('audio');
    this.answersCheckList = [];
    this.currentQuestionIndex = 0;
    this.onStartedBtnChanged = this.onStartedBtnChanged.bind(this);
    this.initGame();
  }

  initGame() {
    this.startGameBtn.classList.add('repeat');
    this.startGameBtn.addEventListener('transitionend', this.onStartedBtnChanged);
    this.wordsListPlay.domElement.classList.add('started');
    this.startGameBtn.addEventListener('click', this.onRepeatBtnClick.bind(this));
    this.isGameStarted = true;
    this.questionsRandomList = this.getQuestionsRandomList();
    this.wordsListPlay.onAnswer = this.onAnswer.bind(this);
    this.askQuestion();
  }

  onStartedBtnChanged(evt) {
    if (evt.propertyName !== 'top') {
      return;
    }

    this.startGameBtn.style.position = 'static';
    this.startGameBtn.removeEventListener('transitionend', this.onStartedBtnChanged);
  }

  askQuestion(repeat) {
    if (repeat) {
      this.currentQuestionIndex -= 1;
    }

    if (this.currentQuestionIndex === this.questionsRandomList.length) {
      this.endGame();

      return;
    }

    const audioSrc = this.questionsRandomList[this.currentQuestionIndex].audio;

    this.audioPlayer.src = audioSrc;
    this.audioPlayer.play();
    this.currentQuestionIndex += 1;
  }

  getQuestionsRandomList() {
    const { categoryId } = this.wordsListPlay;

    const cardsOfCategory = (categoryId === 'difficult')
      ? statistic.difficultWords
      : data.cards[categoryId];

    const questionsList = cardsOfCategory.map((cardData) => ({
      audio: cardData.audioSrc,
      answer: cardData.word,
    }));

    return this.constructor.getShuffledQuestions(questionsList);
  }

  static getShuffledQuestions(questionsList) {
    return questionsList.sort(() => Math.random() - 0.5);
  }

  onRepeatBtnClick() {
    this.askQuestion(true);
  }

  endGame() {
    this.isGameStarted = false;
    this.startGameBtn.classList.remove('repeat');
    appConfig.pageContainer.classList.add(`${this.isWonGame() ? 'win-game' : 'lose-game'}`);
    const audioObj = new Audio();

    if (!this.isWonGame()) {
      this.loseGameMessage = document.createElement('div');
      this.loseGameMessage.classList.add('lose-game-message');
      this.loseGameMessage.innerHTML = `
      <span class='errors-count'>${this.calculateErrors()}</span>
      <span> ${this.calculateErrors() > 1 ? 'errors' : 'error'}</span>`;
      appConfig.pageContainer.append(this.loseGameMessage);
      audioObj.src = 'assets/audio/failure.mp3';
    } else {
      audioObj.src = 'assets/audio/success.mp3';
    }

    audioObj.play();
    const toggler = appConfig.pageContainer.querySelector('.toggler-wrapper');
    const event = new Event('click');

    toggler.dispatchEvent(event);

    setTimeout(() => {
      appConfig.pageContainer.classList.remove('win-game');
      appConfig.pageContainer.classList.remove('lose-game');

      if (this.loseGameMessage) {
        this.loseGameMessage.remove();
      }

      window.location.hash = '';
    }, 3000);
  }

  calculateErrors() {
    return this.answersCheckList.reduce((acc, item) => (item ? acc : acc + 1), 0);
  }

  isWonGame() {
    return this.answersCheckList.every((item) => item);
  }

  onAnswer(answer, targetElement) {
    if (!this.isGameStarted || targetElement.classList.contains('disabled')) {
      return;
    }

    const correctAnswer = this.questionsRandomList[this.currentQuestionIndex - 1].answer;
    const isCorrect = this.checkAnswer(answer, correctAnswer);

    statistic.changeStat(correctAnswer, 'play', isCorrect);

    this.audioPlayer.src = isCorrect
      ? 'assets/audio/correct.mp3'
      : 'assets/audio/error.mp3';

    if (isCorrect) {
      this.audioPlayer.addEventListener('ended', () => {
        setTimeout(() => {
          this.askQuestion();
        }, 200);
      }, { once: true });
      targetElement.classList.add('disabled');
    }

    this.addStar(isCorrect);
    this.audioPlayer.play();
  }

  addStar(isCorrect) {
    const container = this.wordsListPlay.domElement.querySelector('.rating');
    const starElement = document.createElement('div');

    starElement.classList.add('star');
    starElement.classList.add(`${isCorrect ? 'star-success' : 'star-loss'}`);
    container.append(starElement);
  }

  checkAnswer(answer, correctAnswer) {
    const isCorrect = answer === correctAnswer;

    this.answersCheckList.push(isCorrect);

    return isCorrect;
  }
}
