import checkSearchLang from './check-search-lang';

describe('checkSearchLang', () => {
  let lang;

  beforeEach(() => {
    lang = checkSearchLang('dream');
  });

  it('should return lang', () => {
    expect(lang).toBeDefined();
    expect(lang.length).toBeGreaterThan(0);
  });

  it('should return eng if empty line', () => {
    expect(checkSearchLang('')).toEqual('eng');
  });

  it('should return eng if not contains rus letters', () => {
    expect(checkSearchLang('MovieName')).toEqual('eng');
  });

  it('should return eng if contains digits', () => {
    expect(checkSearchLang('123')).toEqual('eng');
  });

  it('should return ru if contains at least one rus letter', () => {
    expect(checkSearchLang('ndsfbshfb!@#$#$%^&*&*&(&&^$%$## Ю')).toEqual('ru');
  });

  it('should return ru if contains only rus letters', () => {
    expect(checkSearchLang('Название фильма')).toEqual('ru');
  });

  it('should return eng if no arguments', () => {
    expect(checkSearchLang()).toEqual('eng');
  });

  it('should return ru if array with rus string', () => {
    expect(checkSearchLang([1, 2, 3, 'строка'])).toEqual('ru');
  });

  it('should return ru if array with not rus string', () => {
    expect(checkSearchLang([1, 2, 3, 'string'])).toEqual('eng');
  });

  it('should return eng if object', () => {
    expect(checkSearchLang({ one: 'строка' })).toEqual('eng');
  });
});
