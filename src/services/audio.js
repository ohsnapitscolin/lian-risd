import { Howl, Howler } from "howler";

import baselayer from "../audio/baselayer.wav";
import nightLoop from "../audio/night_loop_1.wav";
import bell from "../audio/hourbell_3_2.wav";

// Sounds
import birdsInsect from "../audio/birds/birds-insects.wav";
import birdsSinging from "../audio/birds/birds-singing.wav";
import birdsMorning from "../audio/birds/birds-morning.wav";
import chimes from "../audio/chimes/chimes.wav";
import insectsAfternoon from "../audio/insects/afternoon.wav";
import insectsNight from "../audio/insects/night.wav";
import wind from "../audio/wind/wind.wav";

import { progress } from "../utils/math";

// import unmute from "../vendor/unmute";

export const Phase = {
  nightEnd: {
    insects: { name: "insectsNight", volume: 5, frequency: 50 },
    displayName: "Astronomical Dawn",
  },
  nauticalDawn: {
    birds: { name: "birdsInsect", volume: 1, frequency: 20 },
    displayName: "Nautical Dawn",
  },
  dawn: {
    birds: { name: "birdsInsect", volume: 2, frequency: 50 },
    displayName: "Civil Dawn",
  },
  sunrise: {
    birds: { name: "birdsMorning", volume: 4, frequency: 75 },
    displayName: "Sunrise",
  },
  sunriseEnd: {
    birds: { name: "birdsMorning", volume: 5, frequency: 90 },
    displayName: "Sunrise End",
  },
  goldenHourEnd: {
    birds: { name: "birdsSinging", volume: 7, frequency: 100 },
    displayName: "Morning Golden Hour",
  },
  solarNoon: {
    birds: { name: "birdsSinging", volume: 5, frequency: 50 },
    wind: { name: "wind", volume: 6, frequency: 80 },
    chimes: { name: "chimes", volume: 4, frequency: 75 },
    displayName: "Solar Noon",
  },
  goldenHour: {
    insects: { name: "insectsAfternoon", volume: 3, frequency: 50 },
    wind: { name: "wind", volume: 4, frequency: 50 },
    chimes: { name: "chimes", volume: 5, frequency: 100 },
    displayName: "Golden Hour",
  },
  sunsetStart: {
    insects: { name: "insectsAfternoon", volume: 4, frequency: 65 },
    chimes: { name: "chimes", volume: 4, frequency: 50 },
    displayName: "Sunset",
  },
  sunset: {
    insects: { name: "insectsAfternoon", volume: 5, frequency: 75 },
    displayName: "Sunset End",
  },
  dusk: {
    insects: { name: "insectsAfternoon", volume: 6, frequency: 100 },
    displayName: "Civil Dusk",
  },
  nauticalDusk: {
    insects: { name: "insectsAfternoon", volume: 7, frequency: 100 },
    displayName: "Nautical Dusk",
  },
  night: {
    insects: { name: "insectsAfternoon", volume: 7, frequency: 100 },
    displayName: "Astronomical Dusk",
  },
  nadir: {
    insects: { name: "insectsNight", volume: 7, frequency: 100 },
    displayName: "Nadir",
  },
};

class AudioService {
  howls = {};
  loaded = [];

  onLoaded = null;
  start;

  constructor() {
    this.start = new Date();
    this._addTrack("base", baselayer, true, 0.02);
    this._addTrack("nightLoop", nightLoop, true);
    this._addTrack("bell", bell, false);

    // birds
    this._addTrack("birdsInsect", birdsInsect);
    this._addTrack("birdsSinging", birdsSinging);
    this._addTrack("birdsMorning", birdsMorning);

    // insects
    this._addTrack("insectsAfternoon", insectsAfternoon);
    this._addTrack("insectsNight", insectsNight);

    // wind
    this._addTrack("wind", wind);

    // chimes
    this._addTrack("chimes", chimes);
  }

  initialize(onLoaded) {
    this.onLoaded = onLoaded;
    this._checkLoaded();
  }

  _handleLoad(name) {
    this.loaded.push(name);
    this._checkLoaded();
  }

  _checkLoaded() {
    if (this.loaded.length === Object.keys(this.howls).length) {
      // unmute(Howler.ctx, true);
      this.onLoaded && this.onLoaded();
      console.log("loaded", new Date() - this.start, this.loaded);
    }
  }

  _addTrack(name, src, loop = false, volume = 1) {
    this.howls[name] = {
      howl: new Howl({
        src,
        loop,
        volume,
        onload: () => this._handleLoad(name),
      }),
      maxVolume: volume,
    };
  }

  play(name) {
    this.howls[name].howl.play();
  }

  mute(mute) {
    Howler.mute(mute);
  }

  paySong(song) {
    this.howls[song].howl.play();
  }

  playSound(phase, sound) {
    const config = Phase[phase][sound];
    if (!config) return;

    const odds = Math.random();
    if (odds > config.frequency / 100) {
      console.log("skipped", sound, odds.toFixed(2));
      return;
    }

    const howl = this.howls[config.name];

    const volume = progress(0, howl.maxVolume, config.volume / 10);
    console.log("playSound", config.name, volume);

    howl.howl.fade(0, volume, 3000);
    howl.howl.play();
    setTimeout(() => {
      howl.howl.fade(volume, 0, 3000);
    }, howl.howl.duration() * 1000 - 3000);
  }

  volume(volume) {
    Howler.volume(volume);
  }

  chime() {
    this.howls["bell"].howl.play();
  }

  fade(name1, name2, duration) {
    const howl1 = this.howls[name1];
    const howl2 = this.howls[name2];

    if (!howl1.howl.playing()) {
      console.error(new Error(`${name1} is not playing!`));
    }

    if (!howl2.howl.playing()) {
      howl2.howl.play();
    }

    howl1.howl.fade(howl1.maxVolume, 0, duration);
    howl2.howl.fade(0, howl2.maxVolume, duration);

    setTimeout(() => {
      howl1.howl.pause();
    }, duration);
  }
}

const audio = new AudioService();
export default audio;
