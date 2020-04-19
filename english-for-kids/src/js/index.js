import { Container } from './container.js';
import { CategoriesList } from './categories-list.js';
import { Header } from './header.js';

window.location.hash = '';
const container = new Container();

container._addHeader(new Header());
container.addContent(new CategoriesList());
