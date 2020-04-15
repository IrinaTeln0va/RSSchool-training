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
    wrap.classList.add('menu');
    wrap.innerHTML = this.markup;
    return wrap;
  }
  _bind() {
    this.menuBtn.addEventListener('click', this.burgerClickHandler.bind(this));
  }
  _open() {
    this.domElement.classList.add('open');
    this.state = 'open';
  }
  _close() {
    this.domElement.classList.remove('open');
    this.state = 'close';
  }
}