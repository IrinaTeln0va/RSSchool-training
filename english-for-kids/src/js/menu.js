import { data } from './data.js';

export class Menu {
  constructor() {
    this.state = 'close';
    this.domElement = this._createElement();
    this.menuBtn = this.domElement.querySelector('.menu-btn');
    this.menuLinkHandler = this.menuLinkHandler.bind(this);
    this.linksList = this.domElement.querySelectorAll('.navigation-link');
  }

  render(container) {
    this._bind();
    container.append(this.domElement);
  }
  burgerClickHandler() {
    this.state === 'close' ? this._open() : this._close();
  }
  menuLinkHandler(target) {
    window.location.hash = target.attributes.href.value;
    this._close();
  }
  highlightLink(pageName) {
    pageName = pageName.replace('#', '');
    let targetLink;
    [...this.linksList].forEach((link) => {
      const linkHref = link.attributes.href.value.replace('#', '');
      link.classList.remove('current-link');
      if (linkHref === pageName) {
        targetLink = link;
      }
    });
    targetLink.classList.add('current-link');
  }
  _createElement() {
    const wrap = document.createElement('div');
    wrap.classList.add('menu');
    wrap.innerHTML = `
      <div class="menu-overlay"></div>
      <div class="menu-btn">
        <div class="menu-btn__burger"></div>
      </div>
      <ul class='navigation'>
        <li class='navigation-item'><a class='navigation-link current-link' href='#'>Main page</a></li>
        ${data.categories.map((category, index) => `
          <li class='navigation-item'>
            <a class='navigation-link' href='category-${index}'>${category}</a>
          </li>
        `).join('')}
      </ul>`;
    return wrap;
  }
  _bind() {
    this.domElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      const target = evt.target;
      const clickedElement = this._getClickedElement(target);
      switch (clickedElement) {
        case 'button':
          this.burgerClickHandler();
          break;
        case 'pageLink':
          this.menuLinkHandler(target);
          break;
        case 'menu':
          return;
        case 'overlay':
          this._close();
      }
    });
  }
  _getClickedElement(target) {
    if (target.closest('.menu-btn')) {
      return 'button';
    } else if (target.closest('.navigation-item')) {
      return 'pageLink';
    } else if (target.closest('.navigation')) {
      return 'menu';
    } else {
      return 'overlay';
    }
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