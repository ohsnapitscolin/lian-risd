import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import ClockOutline from "../svg/clock-outline.svg";
import SecondHand from "../svg/second-hand.svg";
import MinuteHand from "../svg/minute-hand.svg";
import HourHand from "../svg/hour-hand.svg";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Content = styled.div`
  position: relative;
  width: 330px;
  height: 330px;
  transform: rotate(90deg);
`;

const Outline = styled(ClockOutline)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  circle {
    stroke: ${(p) => p.color};
  }
`;

const Hand = styled.div`
  position: absolute;
  top: 50%;
  left: 0%;
  transform-origin: calc(100% - 2px) 50%;
  width: 50%;
  display: flex;
  justify-content: flex-end;

  animation-name: ${rotate};
  animation-duration: ${({ duration }) => duration}s;
  animation-delay: ${({ delay }) => delay}s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  svg {
    path {
      fill: ${(p) => p.color};
    }
  }
`;

export default function Clock({ moment, speed, hide }) {
  const [secondsOffset, setSecondsOffset] = useState(0);
  const [minutesOffset, setMinutesOffset] = useState(0);
  const [hourOffset, setHourOffset] = useState(0);

  useEffect(() => {
    if (!hide) {
      const ms = moment.date.getMilliseconds();
      const sec = moment.date.getSeconds();
      const min = moment.date.getMinutes();
      const hour = moment.date.getHours();

      setSecondsOffset(sec / 60 + ms / 60000);
      setMinutesOffset(min / 60 + sec / 3600);
      setHourOffset((hour % 12) / 12 + min / 720);
    }
  }, [hide]);

  const color = moment.ui.color;

  return (
    <Content>
      <Outline color={color} />
      <ClockHand duration={60 / speed} delay={secondsOffset} color={color}>
        <SecondHand />
      </ClockHand>
      <ClockHand duration={3600 / speed} delay={minutesOffset} color={color}>
        <MinuteHand />
      </ClockHand>
      <ClockHand duration={43200 / speed} delay={hourOffset} color={color}>
        <HourHand />
      </ClockHand>
    </Content>
  );
}

export function ClockHand({ duration, delay, color, children }) {
  delay = duration * (1 - delay) - duration;
  return (
    <Hand duration={duration} delay={delay} color={color}>
      {children}
    </Hand>
  );
}
