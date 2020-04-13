import { appConfig } from './app-config.js';
import { Container } from './container.js';
import { CategoriesList } from './categories-list.js';
import { Header } from './header.js';

const container = new Container();
container._addHeader(new Header());
container.addContent(new CategoriesList());