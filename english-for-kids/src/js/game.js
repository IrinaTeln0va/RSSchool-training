import { data } from './data.js';
import { appConfig } from './app-config.js';
import { statistic } from './statistic.js';

export class Game {
  constructor(wordsListPlay) {
    this.isGameStarted = false;
    this.wordsListPlay = wordsListPlay;
    this.startGameBtn = this.wordsListPlay.gameControls.querySelector('.btn');
    this.audioPlayer = this.wordsListPlay.gameControls.querySelector('audio');
    this.wordsListPlay.onAnswer = this.onAnswer.bind(this);
    this.answersCheckList = [];
    this.currentQuestionIndex = 0;
    this._initGame();
  }

  _initGame() {
    this.startGameBtn.classList.add('repeat');
    this.startGameBtn.addEventListener('click', this._onRepeatBtnClick.bind(this));
    this.isGameStarted = true;
    this.questionsRandomList = this._getQuestionsRandomList();
    this._askQuestion();
  }

  _askQuestion(repeat) {
    if (repeat) {
      this.currentQuestionIndex -= 1;
    }
    if (this.currentQuestionIndex === this.questionsRandomList.length) {
      this._endGame();
      return;
    }
    const audioSrc = this.questionsRandomList[this.currentQuestionIndex].audio;
    this.audioPlayer.src = audioSrc;
    this.audioPlayer.play();
    this.currentQuestionIndex += 1;
  }

  _getQuestionsRandomList() {
    const categoryId = this.wordsListPlay.categoryId;
    const questionsList = data.cards[categoryId].map((cardData) => ({
      audio: cardData.audioSrc,
      answer: cardData.word
    }));
    return this._getShuffledQuestions(questionsList);
  }

  _getShuffledQuestions(questionsList) {
    return questionsList.sort((a, b) => Math.random() - 0.5);
  }

  _onRepeatBtnClick() {
    this._askQuestion(true);
  }

  _endGame() {
    this.isGameStarted = false;
    this.startGameBtn.classList.remove('repeat');
    appConfig.pageContainer.classList.add(`${this._isWonGame() ? 'win-game' : 'lose-game'}`);
    let audioObj = new Audio();
    if (!this._isWonGame()) {
      this.loseGameMessage = document.createElement('div');
      this.loseGameMessage.classList.add('lose-game-message');
      this.loseGameMessage.innerHTML = `
      <span class='errors-count'>${this._calculateErrors()}</span>
      <span> ${this._calculateErrors() > 1 ? 'errors' : 'error'}</span>`;
      appConfig.pageContainer.append(this.loseGameMessage);
      audioObj.src = 'assets/audio/failure.mp3';
    } else {
      audioObj.src = 'assets/audio/success.mp3';
    }
    audioObj.play();
    const toggler = appConfig.pageContainer.querySelector('.toggler-wrapper');
    let event = new Event("click");
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

  _calculateErrors() {
    return this.answersCheckList.reduce((acc, item) => item ? acc : acc += 1, 0)
  }

  _isWonGame() {
    return this.answersCheckList.every((item) => item);
  }

  onAnswer(answer, targetElement) {
    if (!this.isGameStarted || targetElement.classList.contains('disabled')) {
      return;
    }
    const correctAnswer = this.questionsRandomList[this.currentQuestionIndex - 1].answer;
    const isCorrect = this._checkAnswer(answer, correctAnswer);

    statistic.changeStat(correctAnswer, 'play', isCorrect);

    this.audioPlayer.src = isCorrect
    ? 'assets/audio/correct.mp3'
    : 'assets/audio/error.mp3';

    if (isCorrect) {
      this.audioPlayer.addEventListener('ended', () => {
        setTimeout(() => {
          this._askQuestion();
        }, 200);
      }, { once: true });
      targetElement.classList.add('disabled');
    }
    this._addStar(isCorrect);
    this.audioPlayer.play();
  }

  _addStar(isCorrect) {
    const container = this.wordsListPlay.domElement.querySelector('.rating');
    const starElement = document.createElement('div');
    starElement.classList.add('star');
    starElement.classList.add(`${isCorrect ? 'star-success' : 'star-loss'}`);
    container.append(starElement);
  }

  _checkAnswer(answer, correctAnswer) {
    const isCorrect = answer === correctAnswer;
    this.answersCheckList.push(isCorrect);
    return isCorrect;
  }
}