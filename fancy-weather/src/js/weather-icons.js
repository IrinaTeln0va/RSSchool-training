const weatherIcons = {
  thunderstorm: `<svg class="icon" viewbox="0 0 100 100">
                  <use xlink:href="#grayCloud" class="small-cloud" fill="url(#gradGray)"/>
                  <use xlink:href="#grayCloud" x="25" y="10" class="reverse-small-cloud" fill="url(#gradDarkGray)"/>
                  <use xlink:href="#thunderBolt" x="30" y="61" class="lighting animated infinite flash"/>
                  <use xlink:href="#whiteCloud" x="7" />
                  <use xlink:href="#thunderBolt" x="45" y="56" class="lighting animated infinite flash delay-1s"/>
                </svg>`,
  lightRain: `<svg class="icon" viewbox="0 0 100 100">
                <use xlink:href="#sun" x="-12" y="-18"/>
                <use xlink:href="#grayCloud" class="small-cloud" fill="url(#gradGray)"/>
                <use xlink:href="#rainDrizzle" x="25" y="65"/>
                <use xlink:href="#rainDrizzle" x="40" y="65"/>
                <use xlink:href="#whiteCloud" x="7" />
              </svg>`,
  middleRain: `<svg class="icon" viewbox="0 0 100 100">
                <use xlink:href="#sun" x="-12" y="-18"/>
                <use xlink:href="#grayCloud" class="small-cloud" fill="url(#gradGray)"/>
                <use id="drop1" xlink:href="#rainDrop" x="25" y="65"/>
                <use id="drop3" xlink:href="#rainDrop" x="45" y="65"/>
                <use xlink:href="#whiteCloud" x="7" />
              </svg>`,
  rain: `<svg class="icon" viewbox="0 0 100 100">
            <use xlink:href="#grayCloud" x="25" y="10" class="reverse-small-cloud" fill="url(#gradDarkGray)"/>
            <use id="drop4" xlink:href="#rainDrop" x="15" y="65"/>
            <use id="drop1" xlink:href="#rainDrop" x="25" y="65"/>
            <use id="drop2" xlink:href="#rainDrop" x="37" y="65"/>
            <use id="drop3" xlink:href="#rainDrop" x="50" y="65"/>
            <use xlink:href="#whiteCloud" x="5" y="-7"/>
          </svg>`,
  lightSnow: `<svg class="icon" viewbox="0 0 100 100">
                <use xlink:href="#sun" x="-12" y="-18"/>
                <use xlink:href="#grayCloud" class="small-cloud" fill="url(#gradGray)"/>
                <use id="snowFlake2" xlink:href="#snowFlake" x="30" y="65"/>
                <use id="snowFlake4" xlink:href="#snowFlake" x="45" y="65"/>
                <use id="snowFlake5" xlink:href="#snowFlake" x="58" y="65"/>
                <use xlink:href="#whiteCloud" x="7" />
              </svg>`,
  snow: `<svg class="icon" viewbox="0 0 100 100">
          <use id="snowFlake1" xlink:href="#snowFlake" x="20" y="55"/>
          <use id="snowFlake2" xlink:href="#snowFlake" x="35" y="65"/>
          <use id="snowFlake3" xlink:href="#snowFlake" x="45" y="60"/>
          <use id="snowFlake4" xlink:href="#snowFlake" x="50" y="65"/>
          <use id="snowFlake5" xlink:href="#snowFlake" x="63" y="65"/>
          <use xlink:href="#whiteCloud" x="10" y="-15"/>
        </svg>`,
  rainSnow: `<svg class="icon" viewbox="0 0 100 100">
              <use xlink:href="#grayCloud" x="25" y="10" class="reverse-small-cloud" fill="url(#gradDarkGray)"/>
              <use id="snowFlake1" xlink:href="#snowFlake" x="20" y="55"/>
              <use id="snowFlake2" xlink:href="#snowFlake" x="35" y="65"/>
              <use id="snowFlake3" xlink:href="#snowFlake" x="45" y="60"/>
              <use id="snowFlake4" xlink:href="#snowFlake" x="50" y="65"/>
              <use id="snowFlake5" xlink:href="#snowFlake" x="63" y="65"/>
              <use xlink:href="#rainDrizzle" x="15" y="65"/>
              <use xlink:href="#rainDrizzle" x="25" y="65"/>
              <use xlink:href="#rainDrizzle" x="35" y="65"/>
              <use xlink:href="#rainDrizzle" x="45" y="65"/>
              <use xlink:href="#whiteCloud" x="5" y="-7"/>
            </svg>`,
  wind: `<svg class="icon wind" viewBox="0 0 100 100" id="wind">
          <path id="wind1" d="M 8,37 L 35,37"/>
          <path id="wind2" d="M 2,45 L 45,45 C65,45 64,25 52,25 C47,24 42,30 44,35"/>
          <path id="wind3" d="M 20,55 L 75,55 C90,53 90,35 80,32 C70,28 60,42 70,48 C80,50 80,40 78,41"/>
          <path id="wind4" d="M 12,65 L 65,65 C85,68 75,87 65,83 C60,81 60,78 61,76"/>
          <path id="wind5" d="M 5,75 L 48,75"/>
        </svg>`,
  fog: `<svg class="icon" viewbox="0 0 100 100">
          <use xlink:href="#grayCloud" class="small-cloud" fill="url(#gradDarkGray)" x="0" y="20"/>
          <use xlink:href="#grayCloud" x="30" y="30" class="reverse-small-cloud" fill="url(#gradGray)"/>
          <use id="mist" xlink:href="#mist" x="0" y="30"/>
        </svg>`,
  clear: `<svg class="icon" viewbox="0 0 100 100">
            <use xlink:href="#sun"/>
          </svg>`,
  fewClouds: `<svg class="icon" viewbox="0 0 100 100">
                <use xlink:href="#grayCloud" class="small-cloud" fill="url(#gradGray)"/>
                <use xlink:href="#whiteCloud" x="7" />
              </svg>`,
  darkCloud: `<svg class="icon" viewbox="0 0 100 100">
                <use xlink:href="#grayCloud" class="small-cloud" fill="url(#gradGray)"/>
                <use xlink:href="#grayCloud" x="25" y="10" class="reverse-small-cloud" fill="url(#gradDarkGray)"/>
                <use xlink:href="#whiteCloud" x="7" />
              </svg>`,
  unknown: `<svg class="icon" viewbox="0 0 100 100">
              <use xlink:href="#grayCloud" x="25" y="10" class="reverse-small-cloud" fill="url(#gradDarkGray)"/>
              <use id="ice4" xlink:href="#icePellet" x="25" y="65"/>
              <use id="ice1" xlink:href="#icePellet" x="35" y="65"/>
              <use id="ice2" xlink:href="#icePellet" x="47" y="65"/>
              <use id="ice3" xlink:href="#icePellet" x="60" y="65"/>
              <use xlink:href="#whiteCloud" x="5" y="-7"/>
            </svg>`,
};

export default {
  200: weatherIcons.thunderstorm,
  201: weatherIcons.thunderstorm,
  202: weatherIcons.thunderstorm,
  230: weatherIcons.thunderstorm,
  231: weatherIcons.thunderstorm,
  232: weatherIcons.thunderstorm,
  233: weatherIcons.thunderstorm,
  300: weatherIcons.lightRain,
  301: weatherIcons.lightRain,
  302: weatherIcons.middleRain,
  500: weatherIcons.middleRain,
  501: weatherIcons.middleRain,
  502: weatherIcons.rain,
  511: weatherIcons.rain,
  520: weatherIcons.rain,
  521: weatherIcons.rain,
  522: weatherIcons.rain,
  600: weatherIcons.lightSnow,
  601: weatherIcons.snow,
  602: weatherIcons.snow,
  610: weatherIcons.rainSnow,
  611: weatherIcons.snow,
  612: weatherIcons.snow,
  621: weatherIcons.snow,
  622: weatherIcons.snow,
  623: weatherIcons.wind,
  700: weatherIcons.fog,
  711: weatherIcons.fog,
  721: weatherIcons.fog,
  731: weatherIcons.fog,
  741: weatherIcons.fog,
  751: weatherIcons.fog,
  800: weatherIcons.clear,
  801: weatherIcons.fewClouds,
  802: weatherIcons.fewClouds,
  803: weatherIcons.darkCloud,
  804: weatherIcons.darkCloud,
  900: weatherIcons.unknown,
};
