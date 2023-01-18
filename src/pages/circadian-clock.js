import React, { useEffect, useRef, useState, useCallback } from "react";
import ambience from "../audio/ambience.wav";
import meadow from "../audio/meadow.wav";
import styled, { createGlobalStyle } from "styled-components";
import Sky from "../components/Sky";
import Blinds from "../components/Blinds";
import SunCalc from "../utils/suncalc";
import Stars from "../components/Stars";

const BodyStyle = createGlobalStyle`
  body {
    color: white;
    background-color: black !important;
    padding: 0 !important;
  }
`;

const Wall = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  background-color: #f6f7ef;
  opacity: 1;
  z-index: -2;
`;

const Light = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  background-color: #011d41;
  opacity: ${({ slide }) => slide / 100};
  z-index: -1;
`;

const Window = styled.div`
  width: 80%;
  height: 80%;
  max-width: 400px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  // box-shadow: 0 0 ${(p) => 100 - p.slide}px ${(p) =>
    100 - p.slide}px #fffbd2;

  // border-radius: 16px;
  overflow: hidden;
`;

const WindowContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

// const WindowShadow = styled.div`
//   widthL 100%;
//   height: 100%;
//   position: absolute;
//   left: 0;
//   right: 0;
//   top: 0;
//   bottom: 0;
//   margin: auto;
//   box-shadow: inset -2px -2px 50px #ffffff, inset 12px 12px 15px black;

// `;

const Sun = styled.div`
  height: 0;
  width: 80%;
  padding-bottom: 80%;
  background: linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, #fffbd2 100%);
  border-radius: 50%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
`;

const Tracks = {
  Ambience: "ambience",
  Meadow: "meadow",
};

export default function Circadian() {
  const ambienceRef = useRef(null);
  const meadowRef = useRef(null);
  const [slide, setSlide] = useState(0);
  const [date, setDate] = useState(new Date());

  const readiedTracks = useRef({});

  const [moment, setMoment] = useState(null);
  const [momentProgress, setMomentProgress] = useState(null);
  const [skyProgress, setSkyProgress] = useState(null);

  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);

  const sun = useRef(
    new SunCalc(41.82399, -71.412834, 1, new Date("2023-01-19T17:30:00"))
  );

  const requestRef = useRef();

  const tick = useCallback(() => {
    sun.current.tick();
    setSkyProgress(sun.current.getTotalProgress());
    setMomentProgress(sun.current.getMomentProgress());
    setMoment(sun.current.getMoment());
    setDate(sun.current.date);
    requestRef.current = requestAnimationFrame(tick);
  });

  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(requestRef.current);
  }, [tick]); // Make sure the effect runs only once

  // useEffect(() => {
  //   const interval = window.setInterval(() => {
  //     if (!ambienceRef.current) return;
  //     const newVolumne = ambienceRef.current.volume + 0.1 * direction;
  //     console.log(newVolumne);

  //     if (newVolumne >= 1) {
  //       ambienceRef.current.volume = 1;
  //       setDirection(-1);
  //     } else if (newVolumne <= 0) {
  //       ambienceRef.current.volume = 0;
  //       setDirection(1);
  //     } else {
  //       ambienceRef.current.volume = newVolumne;
  //     }
  //   }, 1000);

  //   return () => {
  //     window.clearInterval(interval);
  //   };
  // }, [direction, setDirection]);

  const play = () => {
    if (meadowRef.current) {
      meadowRef.current.paused
        ? meadowRef.current.play()
        : meadowRef.current.pause();
    }
    if (ambienceRef.current) {
      ambienceRef.current.paused
        ? ambienceRef.current.play()
        : ambienceRef.current.pause();
    }
  };

  const handleSlide = (e) => {
    setSlide(e.target.value);
  };

  const handleCanPlayThrough = (e) => {
    const name = e.target.getAttribute("name");
    readiedTracks.current[name] = true;
    if (
      Object.keys(readiedTracks.current).length === Object.keys(Tracks).length
    ) {
      setReady(true);
    }
  };

  const handleEnter = () => {
    setEntered(true);
  };

  return (
    <>
      <audio
        name="ambience"
        ref={ambienceRef}
        src={ambience}
        loop={true}
        onCanPlayThrough={handleCanPlayThrough}
      ></audio>

      <audio
        name="meadow"
        ref={meadowRef}
        src={meadow}
        loop={true}
        onCanPlayThrough={handleCanPlayThrough}
      ></audio>

      <BodyStyle />
      <Wall />

      {!entered && <button onClick={handleEnter}>Enter</button>}
      {entered && !ready && <p>Loading...</p>}
      {entered && ready && (
        <>
          <Light slide={slide} />
          {/* <p>
        {date.toString()} {Math.round(skyProgress, 2)}{" "}
        {Math.round(momentProgress * 100, 2)} {moment?.current.name}{" "}
        {moment?.next.name}
      </p> */}
          <Window slide={slide}>
            <WindowContent>
              <Sky progress={skyProgress} />
              <Sun />
              {/* <Stars /> */}
              <Blinds
                slide={slide}
                moment={moment}
                momentProgress={momentProgress}
              />
            </WindowContent>
          </Window>
          <button onClick={play}>Play</button>
          <input
            type="range"
            min="1"
            max="100"
            value={slide}
            onChange={handleSlide}
          />
          <span>{slide}</span>
        </>
      )}
    </>
  );
}
