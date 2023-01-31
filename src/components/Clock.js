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
  const secondsAngle = (date.getSeconds() / 60) * 360;
  const minutesAngle = (date.getMinutes() / 60) * 360;
  const hourAngle = (date.getHours() / 12) * 360;

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
