import React from "react";
import styled from "styled-components";
import ClockOutline from "../svg/clock-outline.svg";
import SecondHand from "../svg/second-hand.svg";
import MinuteHand from "../svg/minute-hand.svg";
import HourHand from "../svg/hour-hand.svg";

const Content = styled.div`
  position: relative;
  width: 330px;
  height: 330px;
`;

const Outline = styled(ClockOutline)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Hand = styled.div.attrs((p) => ({
  style: {
    transform: `rotate(${p.angle}deg)`,
  },
}))`
  position: absolute;
  top: 50%;
  left: 0%;
  transform-origin: calc(100% - 2px) 50%;
  width: 50%;
  display: flex;
  justify-content: flex-end;
`;

export default function Clock({ date }) {
  const ms = date.getMilliseconds();
  const sec = date.getSeconds();
  const min = date.getMinutes();
  const hour = date.getHours();

  const secondsAngle = (sec / 60 + ms / 60000) * 360;
  const minutesAngle = (min / 60 + sec / 3600) * 360;
  const hourAngle = (hour / 12 + min / 720) * 360;

  return (
    <Content>
      <Outline />
      <Hand angle={secondsAngle + 90}>
        <SecondHand />
      </Hand>
      <Hand angle={minutesAngle + 90}>
        <MinuteHand />
      </Hand>
      <Hand angle={hourAngle + 90}>
        <HourHand />
      </Hand>
    </Content>
  );
}
