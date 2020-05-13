export default function checkSearchLang(movieToSearch) {
  const CONTAIN_RUS_REG_EXP = /[А-я]+/g;
  const containRusLetters = CONTAIN_RUS_REG_EXP.test(movieToSearch);

  CONTAIN_RUS_REG_EXP.lastIndex = 0;

  if (containRusLetters) {
    return 'ru';
  }

  return 'eng';
}
