import { useEffect, useRef, useState } from "react";
import { useSong, useHour } from "../../hooks/suncalc";
import audio, { Interval } from "../../services/audio";
import suncalc from "../../services/suncalc";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Audio({ slide, play, onLoad }) {
  const prevHour = useRef();

  const song = useSong();
  const hour = useHour();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (song && !audio.initialized) {
      audio.initialize(song, () => {
        setInitialized(true);
        onLoad();
      });
    }
  }, [song]);

  useEffect(() => {
    if (!play) return;

    audio.play("base");
    audio.playSong(song);
    setInterval("birds", true);
    setInterval("insects", true);
    setInterval("wind", true);
    setInterval("chimes", true);
  }, [play]);

  const setInterval = (sound, first) => {
    const min = Interval[0] - (first ? 1 : 0);
    const max = Interval[1] - (first ? 1 : 0);
    const minutes = random(min, max);
    console.log(sound, (minutes * 60).toFixed(0));
    setTimeout(() => {
      audio.playSound(suncalc.moment.song, sound);
      setInterval(sound);
    }, minutes * 60 * 1000);
  };

  useEffect(() => {
    if (!play || !initialized) return;
    console.log(song);
  }, [play, song, initialized]);

  useEffect(() => {
    if (!play || !initialized) return;
    const currHour = hour ?? null;
    console.log(prevHour.current, hour);
    if (prevHour.current != null && currHour != null) {
      audio.chime();
    }
    prevHour.current = hour;
  }, [play, hour, initialized]);

  useEffect(() => {
    audio.volume(1 - slide / 100);
  }, [slide]);

  return null;
}
