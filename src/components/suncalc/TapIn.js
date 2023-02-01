import React from "react";
import styled from "styled-components";
import Clock from "./Clock";
import { Transition, Phase } from "../../services/suncalc";

const TapInContainer = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  opacity: ${({ hide }) => (hide ? 0 : 1)};
  transition: opacity ${Transition}ms;
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};

  &.hide {
    transition: visibility 0s linear ${Transition}ms, opacity ${Transition}ms;
  }

  overflow: hidden;
`;

const TapInBackgroundWrapper = styled.div`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;

  filter: blur(30px);
`;

const TapInBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #867e73 0%, #4a4b49 100%);
  mask-image: radial-gradient(
    circle at center,
    transparent 0%,
    transparent 185px,
    black 185px,
    black 100%
  );
`;

const TapInContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TapInBack = styled.button`
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

const TapInCopy = styled.p`
  position: absolute;
  top: 0;
  left: 0;
  padding: 40px 30px;
  margin: 0;
`;

export default function TapIn({ hide, moment, slide, onBack, speed }) {
  let time;
  let light;
  let name;

  if (moment.progress < 0.1 || moment.progress > 0.9) {
    time = "at";
    name = moment.current.name;
  } else if (moment.progress < 0.3) {
    time = "just past";
    name = moment.current.name;
  } else {
    time = "approaching";
    name = moment.next.name;
  }

  if (slide < 0.33) {
    light = "streaming through";
  } else if (light < 0.67) {
    light = "filtered by";
  } else {
    light = "hidden behind";
  }

  console.log(moment.next);
  console.log(moment.current);

  return (
    <TapInContainer hide={hide} className={hide ? "hide" : ""}>
      <TapInBackgroundWrapper>
        <TapInBackground hide={hide} className={hide ? "hide" : ""} />
      </TapInBackgroundWrapper>
      <TapInContent>
        <TapInCopy>
          The Sun is {time} {name} and light is {light} your blinds.
        </TapInCopy>
        <Clock hide={hide} speed={speed} />
        <TapInBack onClick={onBack} />
      </TapInContent>
    </TapInContainer>
  );
}
