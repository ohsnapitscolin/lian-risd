import { useEffect, useRef } from "react";
import { useSong, useHour } from "../../hooks/suncalc";
import audio from "../../services/audio";
import suncalc from "../../services/suncalc";

const Interval = [2, 10];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function Audio({ slide }) {
  const prevHour = useRef();

  const song = useSong();
  const hour = useHour();

  useEffect(() => {
    const start = new Date();

    audio.initialize(() => {
      const finish = new Date();
      console.log("audio initialized", finish - start);
    });
    setInterval();
  }, []);

  const setInterval = (sound) => {
    const minutes = random(Interval[0], Interval[1]);
    setTimeout(() => {
      console.log("check sound", suncalc.moment.song);
      setInterval(sound);
    }, minutes * 60 * 1000);
  };

  useEffect(() => {
    console.log(song);
  }, [song]);

  useEffect(() => {
    const currHour = hour ?? null;
    console.log(prevHour.current, hour);
    if (prevHour.current != null && currHour != null) {
      audio.chime();
    }
    prevHour.current = hour;
  }, [hour]);

  useEffect(() => {
    audio.volume(1 - slide / 100);
  }, [slide]);

  return null;
}
