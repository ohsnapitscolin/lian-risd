import React, { useEffect, useRef, useState, useCallback } from "react";
import styled, { createGlobalStyle } from "styled-components";

import Sky from "../components/Sky";
import Blinds from "../components/Blinds";
import sunCalc, { Transition } from "../services/suncalc";
import audio from "../services/audio";
import Draggable from "react-draggable";
import { progress } from "../utils/math";
import MusicIcon from "../svg/music-icon.svg";
import MuteIcon from "../svg/mute-icon.svg";
import SunStreamIcon from "../svg/sun-stream.svg";
import WOutline from "../svg/w-outline.svg";

import TapIn from "../components/TapIn";

import "../style/index.css";

const BodyStyle = createGlobalStyle`
  body {
    color: white;
    background-color: black !important;
    padding: 0 !important;
  }
`;

const Window = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;

  z-index: 1;
  overflow: hidden;
`;

const WindowContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const Sun = styled.div.attrs((p) => ({
  style: {
    width: `${p.progress}%`,
    paddingBottom: `${p.progress}%`,
  },
}))`
  height: 0;
  background: linear-gradient(180deg, #f9ffac 0%, rgba(249, 255, 172, 0) 100%);
  border-radius: 50%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  opacity: ${({ hide }) => (hide ? 0 : 1)};
  transition: opacity ${Transition}ms;
`;

const DragContainer = styled.div`
  width: 100%;
  height: 200%;
  position: absolute;
  bottom: 0;
  top: 50%;
  transform: translate(0, -50%);
  overflow: hidden;
`;

const Overlay = styled.div`
  width: 100%;
  height: 75%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: grab;
`;

const UIButton = styled.button`
  color: ${(p) => p.color};
  font-size: 18px;
  font-family: "MaisonNeue";

  opacity: ${({ hide }) => (hide ? 0 : 1)};
  transition: color 0.5s ease, opacity ${Transition}ms;
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  z-index: 5;
`;

const Watts = styled(UIButton)`
  z-index: 5;
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  color: ${(p) => p.color};

  width: 60px;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    position: absolute;
    width: 100%;
    height: 100%;
    & > * {
      stroke: ${(p) => p.color};
      transition: stroke: 0.5 ease;
    }
  }
`;

const MuteButton = styled(UIButton)`
  position: absolute;
  bottom: 25px;
  left: 30px;
  padding: 0;

  display: flex;
  align-item: flex-start;
  height: 25px;
  width: 40px;

  svg {
    path {
      fill: ${(p) => p.color};
      transition: fill: 0.5 ease;
    }
    &:nth-of-type(1) {
      width: 20px;
      height: 20px;
    }
    &:nth-of-type(2) {
      height: 50%;
      width: 10px;
      height: 10px;
    }
  }
`;

const AboutButton = styled(UIButton)`
  position: absolute;
  bottom: 25px;
  right: 30px;
  padding: 0;
`;

const Info = styled.p`
  position: absolute;
  top: 0;
  left: 20px;
`;

const LandingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  z-index: 10;
  overflow: hidden;

  opacity: ${({ hide }) => (hide ? 0 : 1)};
  transition: opacity ${Transition}ms;
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};

  &.hide {
    transition: visibility 0s linear ${Transition}ms, opacity ${Transition}ms;
  }

  cursor: pointer;
`;

const Landing = styled.div`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  background: linear-gradient(180deg, #867e73 0%, #4a4b49 100%);
  filter: blur(50px);
`;

const LandingContent = styled.div`
  position: relative;
  width: 100%;
  height 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    max-width: 60%;
  }
`;

const About = styled.div`
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: linear-gradient(180deg, #f2f6ba 0%, #ffffff 100%);

  opacity: ${({ hide }) => (hide ? 0 : 1)};
  transition: opacity ${Transition}ms;
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};

  &.hide {
    transition: visibility 0s linear ${Transition}ms, opacity ${Transition}ms;
  }
`;

const AboutContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  color: #4f4f4d;

  padding: 30px;
`;

const AboutBack = styled.button`
  position: absolute;
  left: 30px;
  bottom: 30px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(180deg, #757f8c 0%, #c1bfc1 100%);

  appearance: none;
  border: 0;
  padding: 0;
  cursor: pointer;
`;

const View = {
  Landing: 0,
  Resting: 1,
  TapIn: 2,
  About: 3,
};

export default function SunStream() {
  const [slide, setSlide] = useState(0);

  const [speed, setSpeed] = useState(1);
  const [moment, setMoment] = useState({});
  const [view, setView] = useState(View.Landing);
  const [muted, setMuted] = useState(false);
  const [info, setInfo] = useState(false);

  const prevHour = useRef();
  const requestRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let date = params.get("d");
    let speed = params.get("s");
    const latitude = params.get("lat");
    const longitude = params.get("lon");

    setInfo(params.get("i"));

    let coords;
    if (latitude && longitude) {
      coords = {
        latitude,
        longitude,
      };
    }

    if (date) date = new Date(date);
    if (speed) speed = Number(speed);
    setSpeed(speed);

    sunCalc.initialize(speed, date, coords);
    audio.initialize(() => {
      console.log("audio loaded");
    });
  }, []);

  useEffect(() => {
    console.log(moment.song);
  }, [moment.song]);

  useEffect(() => {
    const currHour = moment.hour ?? null;
    if (prevHour.current != null && currHour != null) {
      audio.chime();
    }
    prevHour.current = moment.hour;
  }, [moment.hour]);

  const tick = useCallback(() => {
    if (sunCalc.initialized) {
      sunCalc.tick();
      setMoment(sunCalc.getMoment());
    }
    requestRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(requestRef.current);
  }, [tick]); // Make sure the effect runs only once

  useEffect(() => {
    audio.volume(1 - slide / 100);
  }, [slide]);

  const drag = (e, data) => {
    if (typeof e.target.className !== "string") return;
    if (!e.target.className.includes("react-draggable")) return;
    const height = e.target.getBoundingClientRect().height;
    const offset = height / 3;
    const percent = data.y / offset;
    setSlide(percent * 100);
  };

  const startResting = () => {
    setView(View.Resting);
    audio.play("ambience");
    setTimeout(() => {
      audio.fade("ambience", "meadow", 5000);
    }, 5000);
  };

  const setTapIn = () => {
    setView(View.Tapin);
  };

  const setAbout = () => {
    setView(View.About);
  };

  const isLanding = view === View.Landing;
  const isResting = view === View.Resting;
  const isTapIn = view === View.Tapin;
  const isAbout = view === View.About;

  const mute = () => {
    audio.mute(!muted);
    setMuted(!muted);
  };

  return (
    <>
      <BodyStyle />

      {moment.progress && (
        <>
          {info && (
            <Info>
              {moment.date.toString()}
              <br />
              sky: {(moment.skyProgress * 100).toFixed(0)}%
              <br />
              day: {(moment.dayProgress * 100).toFixed(0)}%
              <br />
              moment: {moment.current.name} → {moment.next.name}{" "}
              {Math.round(moment.progress * 100).toFixed(0)}%
              <br />
              song: {moment.song}
              <br />
              slide: {slide.toFixed(0)}%
            </Info>
          )}

          <LandingContainer
            hide={!isLanding}
            className={!isLanding ? "hide" : ""}
            onClick={isLanding ? startResting : null}
          >
            <Landing>
              <Sun progress={progress(20, 80, moment.dayProgress, true)} />
            </Landing>
            <LandingContent>
              <SunStreamIcon />
            </LandingContent>
          </LandingContainer>

          <Window>
            <WindowContent>
              <Sky progress={moment.skyProgress} />
              <Sun
                hide={isLanding || isTapIn}
                progress={progress(20, 80, moment.dayProgress, true)}
              />
              <Blinds
                hide={!isResting}
                slide={slide}
                moment={moment}
                momentProgress={moment.progress}
              />
            </WindowContent>

            <DragContainer>
              <Draggable name="drag" axis={"y"} bounds="parent" onDrag={drag}>
                <Overlay />
              </Draggable>
            </DragContainer>
          </Window>

          <Watts onClick={setTapIn} hide={!isResting} color={moment.ui}>
            <WOutline />
            <span>{moment.watts.toFixed(0)}W</span>
          </Watts>
          <MuteButton hide={!isResting} color={moment.ui} onClick={mute}>
            <MusicIcon />
            {muted && <MuteIcon />}
          </MuteButton>
          <AboutButton hide={!isResting} color={moment.ui} onClick={setAbout}>
            About
          </AboutButton>

          <TapIn
            hide={!isTapIn}
            moment={moment}
            slide={slide}
            speed={speed}
            onBack={() => setView(View.Resting)}
          />

          <About hide={!isAbout} className={!isAbout ? "hide" : ""}>
            <AboutContent>
              <p>
                Sun Stream is a digital clock in the form of a 24-hour song that
                changes based on the amount of a visitor’s available light.
              </p>
              <p>
                Loosely based on the concept of Circadian Rhythms, 14 sun
                positions correspond to a selection of curated sound loops, with
                added encounters— each listening experience constantly evolving.
              </p>
              <p>
                Bells softly mark the passage of hours. Sun Stream was made over
                many moons by Lian Fumerton-Liu, Sam Kotrba, and Colin Dunn.
              </p>
              <span>Design: Lian Fumerton-Liu</span>
              <span>Sound: Sam Kotrba</span>
              <span>Development: Colin Dunn</span>
              <span>Words set in Superstudio by Lineto.</span>
              <span>v1.0</span>
              <span>© 2023</span>
            </AboutContent>
            <AboutBack onClick={() => setView(View.Resting)} />
          </About>
        </>
      )}
    </>
  );
}
