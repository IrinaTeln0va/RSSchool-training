const LANGS = ['EN', 'RU', 'BE'];
const DEFAULT_VOICE_VALUE = 1;

const MESSAGE_PHRASES = {
  startMessage: {
    en: 'Today temperature,',
    ru: 'Температура воздуха сегодня,',
    be: 'Тэмпература паветра сёння,',
  },
  expected: {
    en: 'expected',
    ru: 'ожидается',
    be: 'чакаецца',
  },
  feelsTemp: {
    en: 'Feels like',
    ru: 'Ощущается',
    be: 'Tэмпература адчуваецца як',
  },
  degrees: {
    en: 'degrees',
    ru: 'градусов',
    be: 'градусаў',
  },
  windUnits: {
    en: 'meter per second',
    ru: 'метров в секунду',
    be: 'метраў у секунду',
  },
}

export default class Voice {
  constructor() {
    this.msg = this.init();
  }

  init() {
    const msg = new SpeechSynthesisUtterance();
    // const langs = speechSynthesis.getVoices();
    const langs = new Promise((resolve) => {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        resolve(speechSynthesis.getVoices());
      }, { once: true });
      speechSynthesis.getVoices();
    })
      .then((voices) => {
        this.voiceLangs = {};
        LANGS.forEach((lang) => {
          let langItem = lang;
          if (langItem === LANGS[2]) {
            [, langItem] = LANGS;
          }
          const item = voices.find((voiceItem) => voiceItem.lang.startsWith(langItem.toLocaleLowerCase()));
          this.voiceLangs[lang] = item;
        });
        msg.voice = this.voiceLangs[LANGS[0]];
      });
    msg.volume = DEFAULT_VOICE_VALUE;
    msg.rate = DEFAULT_VOICE_VALUE;
    msg.pitch = DEFAULT_VOICE_VALUE;
    this.msg = msg;
    return msg;
  }

  speak(lang) {
    this.msg.text = this.constructor.createMessage(lang);
    this.msg.voice = this.voiceLangs[lang];
    window.speechSynthesis.speak(this.msg);
  }

  static createMessage(lang) {
    const language = lang.toLowerCase();
    const elemsWithInfo = document.querySelectorAll('[data-voice]');
    const messageFromPage = [...elemsWithInfo].map((elem) => elem.innerText);

    // ["13", "FOG", "FEELS LIKE: ", "12", "WIND: ", "2", "HUMIDITY: 93 %"]
    const message = `${MESSAGE_PHRASES.startMessage[language]} ${messageFromPage[0]} ${MESSAGE_PHRASES.degrees[language]}, ${MESSAGE_PHRASES.expected[language]} ${messageFromPage[1]}, ${messageFromPage[2]} ${messageFromPage[3]} ${MESSAGE_PHRASES.degrees[language]}, ${messageFromPage[4]} - ${messageFromPage[5]} ${MESSAGE_PHRASES.windUnits[language]}, ${messageFromPage[6]}`;

    return message;
  }
}