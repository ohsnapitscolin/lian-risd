import { getPercentages } from "../utils/suncalc";
import React, { useState } from "react";
import styled from "styled-components";

import "../style/index.css";

const Phase = {
  nightEnd: "07172C",
  nauticalDawn: "495A6F",
  dawn: "A8AAAD",
  sunrise: "D0CBD0",
  sunriseEnd: "D1D4DD",
  goldenHourEnd: "DFE4C2",
  solarNoon: "FFFFFF",
  goldenHour: "F0E8DE",
  sunsetStart: "E7DEE5",
  sunset: "AF938D",
  dusk: "ACA8B6",
  nauticalDusk: "93989F",
  night: "112B4B",
  nadir: "0A1420",
};

const Bar = styled.div`
  width: 100%;
  height 50px;
  display: flex;
`;

const Time = styled.button`
  width: ${(p) => p.percent * 100}%;
  height: 100%;
  background-color: ${(p) => `#${p.color}`};

  padding: 0;
  border: none;

  &:hover {
    border: 0.5px solid #000;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function SunTimes() {
  return (
    <>
      <SunTime date={new Date("2023-01-01")} />
      <SunTime date={new Date("2023-03-01")} />
      <SunTime date={new Date("2023-06-01")} />
      <SunTime date={new Date("2023-09-01")} />
    </>
  );
}

function SunTime({ date }) {
  const percentages = getPercentages(date);
  const [time, setTime] = useState(null);
  const [nextTime, setNextTime] = useState(null);

  return (
    <div style={{ marginBottom: "32px" }}>
      <Info>
        <span>Date: {date.toString()}</span>
        <span>Phase: {time && `${time.name} - ${nextTime.name}`}</span>
        <span>Percent: {time && (time?.percent * 100).toFixed(2)}</span>
      </Info>
      <Bar>
        {percentages.map((time, i) => (
          <Time
            onClick={() => {
              setTime(time);
              setNextTime(percentages[i + 1] || percentages[0]);
            }}
            onMouseEnter={() => {
              setTime(time);
              setNextTime(percentages[i + 1] || percentages[0]);
            }}
            percent={time.percent}
            color={Phase[time.name]}
          />
        ))}
      </Bar>
    </div>
  );
}
