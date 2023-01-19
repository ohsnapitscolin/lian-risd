import SunCalc from "suncalc";

const Phase = {
  nightEnd: 3.8,
  nauticalDawn: 7.06,
  dawn: 10.2,
  sunrise: 12.8,
  sunriseEnd: 22,
  goldenHourEnd: 32.2,
  solarNoon: 43.3,
  goldenHour: 55.4,
  sunsetStart: 63.8,
  sunset: 75.6,
  dusk: 89.6,
  nauticalDusk: 92.2,
  night: 95.3,
  nadir: 100,
};

const PrimaryPhases = ["nadir", "sunset", "sunrise", "solarNoon"];

export default class Sun {
  moment = null;

  currentPhases = null;
  nextPhases = null;

  longitude = null;
  latitude = null;
  offset = 0;
  interval = null;

  constructor(longitude, latitude, accelerant, date) {
    this.longitude = longitude;
    this.latitude = latitude;
    this.accelerant = accelerant;
    this.initialDate = date || new Date();

    this.tick();
  }

  destruct() {
    if (this.interval) clearInterval(this.interval);
  }

  tick() {
    if (this.accelerant) {
      this.offset += this.accelerant;
    }
    this.updateMoment();
  }

  updateMoment() {
    if (!this.currentPhases) this.updatePhases();
    if (this.moment && this.date < this.moment.next.date) {
      return this.moment;
    }

    const date = this.date;
    const allPhases = this.currentPhases.concat(this.nextPhases);

    const index = allPhases.findIndex((_, i) => {
      return allPhases[i]?.date <= date && allPhases[i + 1]?.date > date;
    });

    const primaryPhases = allPhases.filter((p, i) =>
      PrimaryPhases.includes(p.name)
    );
    const primaryIndex = primaryPhases.findIndex((_, i) => {
      return (
        primaryPhases[i]?.date <= date && primaryPhases[i + 1]?.date > date
      );
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
      current,
      next,
      primary: {
        current: primaryPhases[primaryIndex],
        next: primaryPhases[primaryIndex + 1],
      },
    };
  }

  getTotalProgress() {
    const { primary } = this.moment;
    const momentProgress = this.getPrimaryMomentProgress();

    let currPercent = Phase[primary.current.name];
    const nextPercent = Phase[primary.next.name];
    if (nextPercent < currPercent) {
      currPercent = 0;
    }

    return (nextPercent - currPercent) * momentProgress + currPercent;
  }

  getMomentProgress() {
    const { current, next } = this.moment;

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
    const times = SunCalc.getTimes(date, this.longitude, this.latitude);
    const nextTimes = SunCalc.getTimes(
      this.getNextDay(date),
      this.longitude,
      this.latitude
    );

    this.currentPhases = this.sortSunTimes(times);
    this.nextPhases = this.sortSunTimes(nextTimes);
  }

  sortSunTimes(sunTimes) {
    return Object.entries(sunTimes)
      .map(([key, value]) => ({ name: key, date: value }))
      .sort((a, b) => a.date - b.date);
  }

  get date() {
    if (this.offset) {
      return new Date(this.initialDate.getTime() + this.offset);
    }
    return new Date();
  }

  getNextDay(date) {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return next;
  }
}
