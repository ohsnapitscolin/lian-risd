import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

import { Transition } from "../services/suncalc";
import audio from "../services/audio";

import Draggable from "react-draggable";
import SunStreamIcon from "../svg/sun-stream.svg";

import Sky from "../components/suncalc/Sky";
import Blinds from "../components/suncalc/Blinds";
import Ui from "../components/suncalc/UI";
import TapIn from "../components/suncalc/TapIn";
import Info from "../components/suncalc/Info";
import Audio from "../components/suncalc/Audio";

import { useInitialize } from "../hooks/suncalc";

import "../style/index.css";

const LandingTransition = 3000;

const BodyStyle = createGlobalStyle`
  body {
    color: white;
    font-size: 17px;
    font-family: "Superstudio" !important;
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

const Sun = styled.div`
  height: 0;
  width: 330px;
  padding-bottom: 330px;
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

const LandingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  z-index: 10;
  overflow: hidden;

  opacity: ${({ hide }) => (hide ? 0 : 1)};
  transition: opacity ${LandingTransition}ms;
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};

  &.hide {
    transition: visibility 0s linear ${LandingTransition}ms,
      opacity ${LandingTransition}ms;
  }

  cursor: pointer;
`;

const Landing = styled.div`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  background: linear-gradient(180deg, #b0aca6 0%, #837c71 100%);
  filter: blur(30px);
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
    padding-bottom: 45px
  }

  span {
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translate(-50%, 0);
  }
`;

const About = styled.div`
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  z-index: 10;

  opacity: ${({ hide }) => (hide ? 0 : 1)};
  transition: opacity ${Transition}ms;
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};

  &.hide {
    transition: visibility 0s linear ${Transition}ms, opacity ${Transition}ms;
  }
`;

const AboutContent = styled.div`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  color: #4f4f4d;

  padding: 30px;
  background: linear-gradient(180deg, #f2f6ba 0%, #ffffff 100%);
  min-height: 100%;

  a {
    color: #4f4f4d;
  }
`;

const AboutBack = styled.button`
  position: absolute;
  left: 30px;
  bottom: 30px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(180deg, #b0aca6 0%, #837c71 100%);

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
  const [loaded, setLoaded] = useState(false);

  const [view, setView] = useState(View.Landing);
  const [muted, setMuted] = useState(false);

  const moment = {};

  useInitialize();

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
      <Audio slide={slide} play={!isLanding} onLoad={() => setLoaded(true)} />

      <LandingContainer
        hide={!isLanding}
        className={!isLanding ? "hide" : ""}
        onClick={isLanding && loaded ? startResting : null}
      >
        <Landing>
          <Sun />
        </Landing>
        <LandingContent>
          <SunStreamIcon />
          <span>{loaded ? "Tap to listen" : "Warming up..."}</span>
        </LandingContent>
      </LandingContainer>

      <Info slide={slide} />

      <Window>
        <WindowContent>
          <Sky />
          <Sun hide={isLanding || isTapIn} />
          <Blinds
            hide={!isResting}
            slide={slide}
            moment={moment}
            momentProgress={moment?.progress}
          />
        </WindowContent>

        <DragContainer>
          <Draggable name="drag" axis={"y"} bounds="parent" onDrag={drag}>
            <Overlay />
          </Draggable>
        </DragContainer>
      </Window>

      <TapIn
        hide={!isTapIn}
        slide={slide}
        onBack={() => setView(View.Resting)}
      />

      <Ui
        hide={!isResting}
        slide={slide}
        setAbout={setAbout}
        setTapIn={setTapIn}
        mute={mute}
        muted={muted}
      />

      <About hide={!isAbout} className={!isAbout ? "hide" : ""}>
        <AboutContent>
          <p>
            Sun Stream is a digital clock in the form of a 24-hour song that
            shifts based on the amount of a visitor’s “available light.”
          </p>
          <p>
            Loosely inspired by the concept of Circadian Rhythms, 14 sun
            positions are mapped to 14 audio loops. Additional sound layers are
            generated in real time, while bells softly mark the passage of
            hours.
          </p>
          <span>
            Design: <a href="https://lian.land">Lian Fumerton-Liu</a>
          </span>
          <span>
            Sound: <a href="https://samkotrba.com">Sam Kotrba</a>
          </span>
          <span>Development: Colin Dunn</span>
          <span>
            Type is Superstudio by{" "}
            <a href="https://lineto.com/typefaces/superstudio">Lineto</a>.
          </span>
          <span>
            Data provided by{" "}
            <a href="https://www.npmjs.com/package/suncalc">SunCalc</a>.
          </span>
          <span>© v1.0 2023</span>
        </AboutContent>
        <AboutBack onClick={() => setView(View.Resting)} />
      </About>
    </>
  );
}
