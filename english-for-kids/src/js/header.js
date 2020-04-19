import { appConfig } from './app-config.js';
import { Menu } from './menu.js';
import { Toggle } from './toggle.js';

export class Header {
  constructor() {
    this.domElement = this.createDomElement();
    this.menu = new Menu();
    this.toggle = new Toggle();
  }

  createDomElement() {
    const domElement = document.createElement('header');

    return domElement;
  }

  render() {
    this.menu.render(this.domElement);
    this.toggle.render(this.domElement);
    appConfig.pageContainer.append(this.domElement);
  }
}
