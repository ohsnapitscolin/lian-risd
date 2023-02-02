import { useEffect, useState, useRef, useCallback } from "react";
import SunCalc, { Phase } from "../services/suncalc";
import isEqual from "lodash/isEqual";
import { progress } from "../utils/math";

export function useInitialize() {
  const requestRef = useRef();

  const tick = useCallback(() => {
    if (SunCalc.initialized) SunCalc.tick();
    requestRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(requestRef.current);
  }, [tick]); // Make sure the effect runs only once

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let date = params.get("d");
    let speed = params.get("s") || 1;
    const latitude = params.get("lat");
    const longitude = params.get("lon");

    let coords;
    if (latitude && longitude) {
      coords = {
        latitude,
        longitude,
      };
    }

    if (date) date = new Date(date);
    if (speed) speed = Number(speed);

    SunCalc.initialize(speed, date, coords);
  }, []);
}

export function useDate() {
  const [date, setDate] = useState(null);

  useEffect(() => {
    const sub = SunCalc.momentSubject.subscribe((moment) => {
      if (moment.date !== date) setDate(moment.date);
    });
    return () => sub.unsubscribe();
  }, [date]);

  return date;
}

export function useProgress() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const sub = SunCalc.momentSubject.subscribe((moment) => {
      const rounded = moment.progress.toFixed(3);
      if (rounded !== progress) setProgress(rounded);
    });
    return () => sub.unsubscribe();
  }, [progress]);

  return progress;
}

export function useSkyProgress() {
  const [skyProgress, setSkyProgress] = useState(null);

  useEffect(() => {
    const sub = SunCalc.momentSubject.subscribe((moment) => {
      const rounded = moment.skyProgress.toFixed(3);
      if (rounded !== skyProgress) setSkyProgress(rounded);
    });
    return () => sub.unsubscribe();
  }, [skyProgress]);

  return skyProgress;
}

export function useDayProgress() {
  const [dayProgress, setDayProgress] = useState(null);

  useEffect(() => {
    const sub = SunCalc.momentSubject.subscribe((moment) => {
      if (moment.dayProgress !== dayProgress)
        setDayProgress(moment.dayProgress);
    });
    return () => sub.unsubscribe();
  }, [dayProgress]);

  return dayProgress;
}

export function usePhases() {
  const [current, setCurrent] = useState(null);
  const [next, setNext] = useState(null);

  useEffect(() => {
    const sub = SunCalc.momentSubject.subscribe((moment) => {
      if (!isEqual(Phase[moment.current.name], current)) {
        setCurrent(Phase[moment.current.name]);
      }
      if (!isEqual(Phase[moment.next.name] !== current)) {
        setNext(Phase[moment.next.name]);
      }
    });
    return () => sub.unsubscribe();
  }, [current, next]);

  return { current, next };
}

export function useUI() {
  const [ui, setUI] = useState(null);

  useEffect(() => {
    const sub = SunCalc.momentSubject.subscribe((moment) => {
      if (!isEqual(moment.ui, ui)) setUI(moment.ui);
    });
    return () => sub.unsubscribe();
  }, [ui]);

  return ui;
}

export function useWatts(slide) {
  const [watts, setWatts] = useState(null);

  const phases = usePhases();

  useEffect(() => {
    const sub = SunCalc.momentSubject.subscribe((moment) => {
      const roundedWatts = moment.watts.toFixed(0);
      if (roundedWatts !== watts) setWatts(Number(roundedWatts));
    });
    return () => sub.unsubscribe();
  }, [watts]);

  if (!phases.current || !phases.next) return null;

  const adjustedWatts = progress(
    phases.current.watts[1],
    watts,
    1 - slide / 100
  );
  return adjustedWatts.toFixed(0);
}

export function useSong() {
  const [song, setSong] = useState(null);

  useEffect(() => {
    const sub = SunCalc.momentSubject.subscribe((moment) => {
      if (moment.song !== song) setSong(moment.song);
    });
    return () => sub.unsubscribe();
  }, [song]);

  return song;
}

export function useHour() {
  const [hour, setHour] = useState(null);

  useEffect(() => {
    const sub = SunCalc.momentSubject.subscribe((moment) => {
      if (moment.hour !== hour) setHour(moment.hour);
    });
    return () => sub.unsubscribe();
  }, [hour]);

  return hour;
}
