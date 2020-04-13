import { CategoriesList } from "./categories-list";

class AppConfig {
    constructor() {
        this.mode = 'train',
        this.pageContainer = document.querySelector('.container'),
        this.currentPage = null,
        this.pages = ['categoriesList', 'wordsListTrain', 'wordsListPlay'];
    }
}

export const appConfig = new AppConfig();