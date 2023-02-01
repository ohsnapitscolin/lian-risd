import SunCalc from "suncalc";
import { progress } from "../utils/math";
import { Subject } from "rxjs";

export const Transition = 500;

export const UI = {
  light: {
    color: "#4F4F4C",
    background: "linear-gradient(180deg, #B0ACA6 0%, #837C71 100%)",
  },
  dark: {
    color: "white",
    background: "linear-gradient(180deg, #867E73 0%, #4A4B49 100%)",
  },
};

export const Phase = {
  nightEnd: {
    sky: 3.03,
    blinds: { from: [37, 59, 88], to: "#011D41" },
    watts: 125,
    ui: "dark",
    displayName: "Astronomical Dawn",
  },
  nauticalDawn: {
    sky: 6.95,
    blinds: { from: [37, 59, 88], to: "#011D41" },
    watts: 150,
    ui: "dark",
    displayName: "Nautical Dawn",
  },
  dawn: {
    sky: 10.73,
    blinds: { from: [170, 172, 174], to: "#675E67" },
    watts: 175,
    ui: "dark",
    displayName: "Civil Dawn",
  },
  sunrise: {
    sky: 15.08,
    blinds: { from: [182, 166, 151], to: "#AB8E84" },
    watts: 200,
    ui: "light",
    displayName: "Sunrise",
  },
  sunriseEnd: {
    sky: 21.78,
    blinds: { from: [196, 206, 215], to: "#7C8999" },
    watts: 225,
    ui: "light",
    displayName: "Sunrise End",
  },
  goldenHourEnd: {
    sky: 29.34,
    blinds: { from: [245, 238, 219], to: "#D5C2AD" },
    watts: 250,
    ui: "light",
    displayName: "Morning Golden Hour",
  },
  solarNoon: {
    sky: 48.79,
    blinds: { from: [242, 244, 227], to: "#E4E9C5" },
    watts: 400,
    ui: "light",
    displayName: "Solar Noon",
  },
  goldenHour: {
    sky: 56.97,
    blinds: { from: [245, 238, 219], to: "#D5C2AD" },
    watts: 250,
    ui: "light",
    displayName: "Golden Hour",
  },
  sunsetStart: {
    sky: 63.73,
    blinds: { from: [196, 206, 215], to: "#7C8999" },
    watts: 225,
    ui: "light",
    displayName: "Sunset",
  },
  sunset: {
    sky: 73.68,
    blinds: { from: [182, 166, 151], to: "#AB8E84" },
    watts: 200,
    ui: "dark",
    displayName: "Sunset End",
  },
  dusk: {
    sky: 81.44,
    blinds: { from: [170, 172, 174], to: "#675E67" },
    watts: 175,
    ui: "dark",
    displayName: "Civil Dusk",
  },
  nauticalDusk: {
    sky: 86.8,
    blinds: { from: [170, 172, 174], to: "#675E67" },
    watts: 150,
    ui: "dark",
    displayName: "Nautical Dusk",
  },
  night: {
    sky: 92.55,
    blinds: { from: [37, 59, 88], to: "#011D41" },
    watts: 125,
    ui: "dark",
    displayName: "Astronomical Dusk",
  },
  nadir: {
    sky: 100,
    blinds: { from: [37, 59, 88], to: "#011D41" },
    watts: 25,
    ui: "dark",
    displayName: "Nadir",
  },
};

class SunCalcService {
  moment = null;

  currentPhases = null;
  nextPhases = null;

  longitude = null;
  latitude = null;

  initialized = false;

  momentSubject = new Subject();

  async initialize(speed, date, coords) {
    this.speed = speed || 1;
    if (!date) date = new Date();
    this.date = date;
    this._cachedDate = new Date();

    if (!coords) {
      coords = await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          () =>
            resolve({
              latitude: 41.82399,
              longitude: -71.412834,
            })
        );
      });
    }

    this.latitude = coords.latitude;
    this.longitude = coords.longitude;

    this.tick();

    this.initialized = true;
  }

  tick() {
    const currentDate = new Date();
    const msDiff = new Date() - this._cachedDate;

    this.date = new Date(this.date.getTime() + msDiff * this.speed);
    this._cachedDate = currentDate;
    this.updateMoment();
    this.momentSubject.next(this.moment);
  }

  updateMoment() {
    if (!this.currentPhases) this.updatePhases();

    if (!this.moment || this.date >= this.moment.next.date) {
      const date = this.date;
      const allPhases = this.currentPhases.concat(this.nextPhases);

      const index = allPhases.findIndex((_, i) => {
        return allPhases[i]?.date <= date && allPhases[i + 1]?.date > date;
      });

      if (index < 0) {
        throw new Error("What's happening!!!");
      }

      if (index >= this.currentPhases.length) {
        this.updatePhases();
      }

      const current = allPhases[index];
      const next = allPhases[index + 1];

      this.moment = {
        date: this.date,
        current,
        next,
      };
    }

    const { current, next } = this.moment;
    const currPhase = Phase[current.name];
    const nextPhase = Phase[next.name];
    const momentProgress = this.getMomentProgress(current, next);
    const watts = progress(
      currPhase.watts,
      nextPhase.watts,
      this.getMomentProgress(current, next, momentProgress)
    );

    const song = momentProgress >= 0.5 ? next.name : current.name;
    const hour = this.date.getHours();

    this.moment = {
      date: this.date,
      current,
      next,
      progress: momentProgress,
      skyProgress: this.getSkyProgress(current, next),
      dayProgress: this.getDayProgress(),
      ui: UI[currPhase.ui],
      watts,
      song,
      hour,
    };
  }

  getSkyProgress(current, next) {
    const momentProgress = this.getMomentProgress(current, next);
    let currPercent = Phase[current.name].sky;
    const nextPercent = Phase[next.name].sky;
    if (nextPercent < currPercent) currPercent = 0;
    return ((nextPercent - currPercent) * momentProgress + currPercent) / 100;
  }

  getDayProgress() {
    const allPhases = this.currentPhases.concat(this.nextPhases);
    const primaryPhases = allPhases.filter((p, i) => p.name === "nadir");
    return (this.date.getTime() - primaryPhases[0].date) / 86400000;
  }

  getMomentProgress(current, next) {
    return (this.date - current.date) / (next.date - current.date);
  }

  getPrimaryMomentProgress() {
    const { primary } = this.moment;
    const { current, next } = primary;
    return (this.date - current.date) / (next.date - current.date);
  }

  getMoment() {
    return this.moment;
  }

  updatePhases(date = this.date) {
    const times = SunCalc.getTimes(date, this.latitude, this.longitude);
    const nextTimes = SunCalc.getTimes(
      this.getNextDay(date),
      this.latitude,
      this.longitude
    );

    this.currentPhases = sortSunTimes(times);
    this.nextPhases = sortSunTimes(nextTimes);
  }

  getNextDay(date) {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return next;
  }
}

function sortSunTimes(sunTimes) {
  return Object.entries(sunTimes)
    .map(([key, value]) => ({ name: key, date: value }))
    .sort((a, b) => a.date - b.date);
}

export function getPercentages(date) {
  const times = SunCalc.getTimes(date, 41.82399, -71.412834);
  const sunTimes = sortSunTimes(times);

  let sum = 0;
  const percentages = [];
  sunTimes.forEach(({ name, date }, i) => {
    const nextTime = sunTimes[i + 1]?.date;
    if (!nextTime) {
      percentages.push({
        name,
        percent: 1 - sum,
      });
    } else {
      const diff = nextTime - date;
      const percent = diff / 86400000;
      sum += percent;
      percentages.push({
        name,
        percent,
      });
    }
  });
  return percentages;
}

const service = new SunCalcService();
export default service;
