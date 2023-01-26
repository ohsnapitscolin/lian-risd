import { Howl, Howler } from "howler";
import unmute from "../vendor/unmute";
import ambience from "../audio/base.wav";
import meadow from "../audio/meadow.wav";
import bell from "../audio/hourbell_2_1.mp3";

class AudioService {
  howls = {};
  loaded = [];

  onLoaded = null;

  constructor() {
    this._addTrack("ambience", ambience, true, 0.25);
    this._addTrack("meadow", meadow, true);
    this._addTrack("bell", bell, false);
  }

  initialize(onLoaded) {
    this.onLoaded = onLoaded;
    this._checkLoaded();
    unmute(Howler.ctx, true);
  }

  _handleLoad(name) {
    this.loaded.push(name);
    this._checkLoaded();
  }

  _checkLoaded() {
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
