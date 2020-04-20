import appConfig from './app-config';
import Menu from './menu';
import Toggle from './toggle';

export default class Header {
  constructor() {
    this.domElement = this.constructor.createDomElement();
    this.menu = new Menu();
    this.toggle = new Toggle();
  }

  static createDomElement() {
    const domElement = document.createElement('header');

    return domElement;
  }

  render() {
    this.menu.render(this.domElement);
    this.toggle.render(this.domElement);
    appConfig.pageContainer.append(this.domElement);
  }
}
