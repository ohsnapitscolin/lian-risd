import React from "react";
import styled from "styled-components";
import { useUI, useWatts } from "../../hooks/suncalc";

import MusicIcon from "../../svg/music-icon.svg";
import MuteIcon from "../../svg/mute-icon.svg";
import WOutline from "../../svg/w-outline.svg";

import { Transition } from "../../services/suncalc";

const UIButton = styled.button`
  color: ${(p) => p.color};
  font-size: 17px;
  font-family: "Superstudio";

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

export default function UI({ hide, muted, mute, setAbout, setTapIn }) {
  const ui = useUI();
  const watts = useWatts();

  if (!ui || !watts) return null;

  return (
    <>
      <Watts onClick={setTapIn} hide={hide} color={ui.color}>
        <WOutline />
        <span>{watts}W</span>
      </Watts>
      <MuteButton hide={hide} color={ui.color} onClick={mute}>
        <MusicIcon />
        {muted && <MuteIcon />}
      </MuteButton>
      <AboutButton hide={hide} color={ui.color} onClick={setAbout}>
        About
      </AboutButton>
    </>
  );
}
