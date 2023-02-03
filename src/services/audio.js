import { Howl, Howler } from "howler";

import baselayer from "../audio/baselayer.wav";
import bell from "../audio/hourbell_3_2.wav";

// Songs
import nightLoop from "../audio/night_loop_1.wav";

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

const Required = ["base", "bell"];

export const Phase = {
  nightEnd: {
    song: "nightLoop",
    insects: { name: "insectsNight", frequency: 50 },
    displayName: "Astronomical Dawn",
  },
  nauticalDawn: {
    song: "nightLoop",
    birds: { name: "birdsInsect", frequency: 20 },
    displayName: "Nautical Dawn",
  },
  dawn: {
    song: "nightLoop",
    birds: { name: "birdsInsect", frequency: 50 },
    displayName: "Civil Dawn",
  },
  sunrise: {
    song: "nightLoop",
    birds: { name: "birdsMorning", frequency: 75 },
    displayName: "Sunrise",
  },
  sunriseEnd: {
    song: "nightLoop",
    birds: { name: "birdsMorning", frequency: 90 },
    displayName: "Sunrise End",
  },
  goldenHourEnd: {
    song: "nightLoop",
    birds: { name: "birdsSinging", frequency: 100 },
    displayName: "Morning Golden Hour",
  },
  solarNoon: {
    song: "nightLoop",
    birds: { name: "birdsSinging", frequency: 50 },
    wind: { name: "wind", frequency: 80 },
    chimes: { name: "chimes", frequency: 40 },
    displayName: "Solar Noon",
  },
  goldenHour: {
    song: "nightLoop",
    insects: { name: "insectsAfternoon", frequency: 50 },
    wind: { name: "wind", frequency: 50 },
    chimes: { name: "chimes", frequency: 100 },
    displayName: "Golden Hour",
  },
  sunsetStart: {
    song: "nightLoop",
    insects: { name: "insectsAfternoon", frequency: 65 },
    chimes: { name: "chimes", frequency: 50 },
    displayName: "Sunset",
  },
  sunset: {
    song: "nightLoop",
    insects: { name: "insectsAfternoon", frequency: 75 },
    displayName: "Sunset End",
  },
  dusk: {
    song: "nightLoop",
    insects: { name: "insectsAfternoon", frequency: 100 },
    displayName: "Civil Dusk",
  },
  nauticalDusk: {
    song: "nightLoop",
    insects: { name: "insectsAfternoon", frequency: 100 },
    displayName: "Nautical Dusk",
  },
  night: {
    song: "nightLoop",
    insects: { name: "insectsAfternoon", frequency: 100 },
    displayName: "Astronomical Dusk",
  },
  nadir: {
    song: "nightLoop",
    insects: { name: "insectsNight", frequency: 100 },
    displayName: "Nadir",
  },
};

const Scale = 3;

const Song = {
  base: {
    track: baselayer,
    max: 0.005,
    loop: true,
  },
  bell: {
    track: bell,
    max: 0.33,
  },
  // dayLoop: {
  //   track: dayLoop,
  //   max: 0.05,
  //   loop: true,
  // },
  nightLoop: {
    track: nightLoop,
    max: 0.07,
    loop: true,
  },
  birdsInsect: {
    track: birdsInsect,
    max: 0.19,
  },
  birdsSinging: {
    track: birdsSinging,
    max: 0.02,
  },
  birdsMorning: {
    track: birdsMorning,
    max: 0.27,
  },
  insectsAfternoon: {
    track: insectsAfternoon,
    max: 0.21,
  },
  insectsNight: {
    track: insectsNight,
    max: 0.17,
  },
  wind: {
    track: wind,
    max: 0.05,
  },
  chimes: {
    track: chimes,
    max: 0.03,
  },
};

export const Interval = [0.5, 1];

class AudioService {
  howls = {};
  loaded = [];

  initialize(phase, onRequiredLoad, onLoad) {
    this.start = new Date();

    this.required = [...Required, Phase[phase].song].filter(Boolean);

    this.onLoad = onLoad;
    this.onRequiredLoad = onRequiredLoad;
    this.calledRequired = false;

    this.loadRequire();

    this.initialized = true;
  }

  loadRequire() {
    this.required.forEach((name) => {
      const song = Song[name];
      this._addTrack(name, song.track, song.max, song.loop);
    });
  }

  loadAll() {
    Object.keys(Song)
      .filter((name) => !this.required.includes(name))
      .forEach((name) => {
        const song = Song[name];
        this._addTrack(name, song.track, song.max, song.loop);
      });
  }

  _handleLoad(name) {
    this.loaded.push(name);
    this._checkLoaded();
  }

  _checkLoaded() {
    if (this.required?.every((name) => this.loaded.includes(name))) {
      if (!this.calledRequired) {
        this.calledRequired = true;
        console.log("required loaded", new Date() - this.start, this.loaded);
        this.onRequiredLoad() && this.onRequiredLoad();
        this.loadAll();
      }
    }

    if (this.loaded.length === Object.keys(this.howls).length) {
      // unmute(Howler.ctx, true);
      this.onLoad && this.onLoad();
      console.log("loaded", new Date() - this.start, this.loaded);
    }
  }

  _addTrack(name, src, volume, loop = false) {
    volume = volume * Scale;
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

  pause(name) {
    this.howls[name].howl.pause();
  }

  songVolume(name, volume) {
    const howl = this.howls[name];
    howl.howl.volume(progress(0, 1, volume));
  }

  mute(mute) {
    Howler.mute(mute);
  }

  playSong(phase) {
    const name = Phase[phase].song;
    if (!name) return;
    this.howls[name].howl.play();
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

    const volume = howl.maxVolume;
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
