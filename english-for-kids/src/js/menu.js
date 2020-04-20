import data from './data';

export default class Menu {
  constructor() {
    this.state = 'close';
    this.domElement = this.constructor.createElement();
    this.menuBtn = this.domElement.querySelector('.menu-btn');
    this.menuLinkHandler = this.menuLinkHandler.bind(this);
    this.linksList = this.domElement.querySelectorAll('.navigation-link');
  }

  render(container) {
    this.bind();
    container.append(this.domElement);
  }

  burgerClickHandler() {
    if (this.state === 'close') {
      this.open();
    } else {
      this.close();
    }
  }

  menuLinkHandler(target) {
    window.location.hash = target.attributes.href.value;
    this.close();
  }

  highlightLink(pageName) {
    let pageId = pageName;

    pageId = pageId.replace('#', '');
    let targetLink;

    [...this.linksList].forEach((link) => {
      const linkHref = link.attributes.href.value.replace('#', '');

      link.classList.remove('current-link');

      if (linkHref === pageId) {
        targetLink = link;
      }
    });

    if (pageId === 'difficult') {
      return;
    }

    targetLink.classList.add('current-link');
  }

  static createElement() {
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
        <li class='navigation-item'><a class='navigation-link' href='statistic'>Statistic</a></li>
      </ul>`;

    return wrap;
  }

  bind() {
    this.domElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      const { target } = evt;
      const clickedElement = this.constructor.getClickedElement(target);

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
          this.close();
          break;
        default:
          break;
      }
    });
  }

  static getClickedElement(target) {
    if (target.closest('.menu-btn')) {
      return 'button';
    }

    if (target.closest('.navigation-item')) {
      return 'pageLink';
    }

    if (target.closest('.navigation')) {
      return 'menu';
    }

    return 'overlay';
  }

  open() {
    this.domElement.classList.add('open');
    this.state = 'open';
  }

  close() {
    this.domElement.classList.remove('open');
    this.state = 'close';
  }
}
