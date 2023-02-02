import { Howl, Howler } from "howler";

import baselayer from "../audio/baselayer.wav";
import nightLoop from "../audio/night_loop_1.wav";
import bell from "../audio/hourbell_3_2.wav";

import birdsInsect from "../audio/birds/birds-insects.wav";
import birdsSinging from "../audio/birds/birds-singing.wav";
import parkMorningBirds from "../audio/birds/park-morning-birds.wav";

// import unmute from "../vendor/unmute";

class AudioService {
  howls = {};
  loaded = [];

  onLoaded = null;

  constructor() {
    this._addTrack("base", baselayer, true, 0.1);
    this._addTrack("nightLoop", nightLoop, true);
    this._addTrack("bell", bell, false);

    this._addTrack("birdsInsect", birdsInsect);
    this._addTrack("birdsSinging", birdsSinging);
    this._addTrack("parkMorningBirds", parkMorningBirds);
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
    console.log(this.loaded, Object.keys(this.howls).length);
    if (this.loaded.length === Object.keys(this.howls).length) {
      // unmute(Howler.ctx, true);
      this.onLoaded && this.onLoaded();
    }
  }

  _addTrack(name, src, loop, volume = 1) {
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
