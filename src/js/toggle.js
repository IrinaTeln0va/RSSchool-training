import { appConfig } from './app-config.js';

export class Toggle {
  constructor() {
    this.markup = this._getMarkup(),
    this.domElement = this._createElement();
    this.trainLabel = this.domElement.querySelector('#filter-train');
    this.playLabel = this.domElement.querySelector('#filter-play');
    this.switcher = this.domElement.querySelector('#switcher');
  }
  _getMarkup() {
    return `
      <label class="toggler${(appConfig.mode === 'train') ? ` toggler--is-active` : ``}" id="filter-train">Train</label>
      <div class="toggle">
        <input type="checkbox" id="switcher" class="check">
        <b class="b switch"></b>
      </div>
      <label class="toggler${(appConfig.mode === 'play') ? ` toggler--is-active` : ``}" id="filter-play">Play</label>`;
  }
  render(container) {
    container.append(this.domElement);
    this._bind();
  }
  toggleClickHandler() {
    const mode = appConfig.mode;
    mode === 'train' ? this._toPlayState() : this._toTrainState();
    this.onModeChange(mode);
  }
  onModeChange() {
  }
  switchState() {
    this.toggleClickHandler();
  }
  _createElement() {
    const wrap = document.createElement('div');
    wrap.classList.add('toggler-wrapper');
    wrap.innerHTML = this.markup;
    return wrap;
  }
  _bind() {
    this.domElement.addEventListener('click', this.toggleClickHandler.bind(this));
  }
  _toPlayState() {
    this.switcher.checked = true;
    this.trainLabel.classList.remove('toggler--is-active');
    this.playLabel.classList.add('toggler--is-active');
  }
  _toTrainState() {
    this.switcher.checked = false;
    this.trainLabel.classList.add('toggler--is-active');
    this.playLabel.classList.remove('toggler--is-active');
  }
}