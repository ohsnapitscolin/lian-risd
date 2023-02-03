import { getPercentages } from "../services/suncalc";
import React, { useState, useEffect } from "react";
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

const Bars = styled.div`
  display: flex:
  flex-direction: column;
`;

const TimeBar = styled.div`
  width: 100%;
  height 50px;
  display: flex;
  margin-bottom: 16px;
`;

const SongBar = styled.div`
  width: 100%;
  height 23px;
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
      <SunTime date={new Date("2023-04-01")} />
      <SunTime date={new Date("2023-07-01")} />
      <SunTime date={new Date("2023-010-01")} />
    </>
  );
}

function SunTime({ date }) {
  const [percentages, setPercentages] = useState(null);
  const [songPercentages, setSongPercentages] = useState(null);
  const [timeInfo, setTimeInfo] = useState(null);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const _percentages = getPercentages(date);
    const _songPercentages = [];

    let prev = 0;
    let sum = 0;
    _percentages.forEach((time) => {
      const percent = prev + time.percent / 2;
      _songPercentages.push({
        name: time.name,
        percent,
      });
      prev = time.percent / 2;
      sum += percent;
    });

    const first = _percentages[0];
    _songPercentages.push({
      name: first.name,
      percent: 1 - sum,
    });

    setPercentages(_percentages);
    setSongPercentages(_songPercentages);
  }, []);

  const updateTimeInfo = (time, i) => {
    const next = percentages[i + 1] || percentages[0];
    setTimeInfo({
      name: time.name,
      percent: time.percent,
      next: next,
    });
  };

  const updateSongInfo = (time, i) => {
    setSongInfo({
      name: time.name,
      percent: time.percent,
    });
  };

  if (!percentages) return null;

  return (
    <div style={{ marginBottom: "32px" }}>
      <Info>
        <p>Date: {date.toString()}</p>
        <span>
          Phase: {timeInfo && `${timeInfo.name} - ${timeInfo.next.name}`}
        </span>
        <span>Percent: {timeInfo && (timeInfo?.percent * 100).toFixed(2)}</span>
      </Info>
      <Bars>
        <TimeBar>
          {percentages.map((time, i) => (
            <Time
              key={`time=${i}`}
              onClick={() => updateTimeInfo(time, i)}
              onMouseEnter={() => updateTimeInfo(time, i)}
              percent={time.percent}
              color={Phase[time.name]}
            />
          ))}
        </TimeBar>
        <Info>
          <span>Song: {songInfo && songInfo.name}</span>
          <span>
            Percent: {songInfo && (songInfo?.percent * 100).toFixed(2)}
          </span>
        </Info>
        <SongBar>
          {songPercentages.map((time, i) => (
            <Time
              key={`song=${i}`}
              onClick={() => updateSongInfo(time)}
              onMouseEnter={() => updateSongInfo(time)}
              percent={time.percent}
              color={Phase[time.name]}
            />
          ))}
        </SongBar>
      </Bars>
    </div>
  );
}
