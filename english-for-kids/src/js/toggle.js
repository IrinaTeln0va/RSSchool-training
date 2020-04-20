import appConfig from './app-config';

export default class Toggle {
  constructor() {
    this.markup = this.constructor.getMarkup();
    this.domElement = this.createElement();
    this.trainLabel = this.domElement.querySelector('#filter-train');
    this.playLabel = this.domElement.querySelector('#filter-play');
    this.switcher = this.domElement.querySelector('#switcher');
  }

  static getMarkup() {
    return `
      <label class="toggler${(appConfig.mode === 'train') ? ' toggler--is-active' : ''}" id="filter-train">Train</label>
      <div class="toggle">
        <input type="checkbox" id="switcher" class="check">
        <b class="b switch"></b>
      </div>
      <label class="toggler${(appConfig.mode === 'play') ? ' toggler--is-active' : ''}" id="filter-play">Play</label>`;
  }

  render(container) {
    container.append(this.domElement);
    this.bind();
  }

  toggleClickHandler() {
    const { mode } = appConfig;

    if (mode === 'train') {
      this.toPlayState();
    } else {
      this.toTrainState();
    }

    this.onModeChange(mode);
  }

  // onModeChange() {
  //   console.log(this);
  // }

  switchState() {
    this.toggleClickHandler();
  }

  createElement() {
    const wrap = document.createElement('div');

    wrap.classList.add('toggler-wrapper');
    wrap.innerHTML = this.markup;

    return wrap;
  }

  bind() {
    this.domElement.addEventListener('click', this.toggleClickHandler.bind(this));
  }

  toPlayState() {
    this.switcher.checked = true;
    this.trainLabel.classList.remove('toggler--is-active');
    this.playLabel.classList.add('toggler--is-active');
  }

  toTrainState() {
    this.switcher.checked = false;
    this.trainLabel.classList.add('toggler--is-active');
    this.playLabel.classList.remove('toggler--is-active');
  }
}
