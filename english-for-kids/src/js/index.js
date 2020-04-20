import Container from './container';
import CategoriesList from './categories-list';
import Header from './header';

window.location.hash = '';
const container = new Container();

container.addHeader(new Header());
container.addContent(new CategoriesList());
