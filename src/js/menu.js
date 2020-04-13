export class Menu {
  constructor() {
    this.markup = `
      <div class="menu-btn">
        <div class="menu-btn__burger"></div>
      </div>`,
    this.state = 'close';
    this.domElement = this._createElement();
    this.menuBtn = this.domElement.querySelector('.menu-btn');
  }

  render(container) {
    this._bind();
    container.append(this.domElement);
  }
  burgerClickHandler() {
    this.state === 'close' ? this._open() : this._close();
  }
  _createElement() {
    const wrap = document.createElement('div');
    wrap.innerHTML = this.markup;
    return wrap;
  }
  _bind() {
    this.domElement.addEventListener('click', this.burgerClickHandler.bind(this));
  }
  _open() {
    this.menuBtn.classList.add('open');
    this.state = 'open';
  }
  _close() {
    this.menuBtn.classList.remove('open');
    this.state = 'close';
  }
}