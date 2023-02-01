import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  useDate,
  useProgress,
  useSkyProgress,
  useDayProgress,
  usePhases,
  useSong,
} from "../../hooks/suncalc";

const Content = styled.p`
  position: absolute;
  top: 0;
  left: 20px;
  z-index: 20;
`;

export default function Info({ slide }) {
  const [show, setShow] = useState(false);

  const date = useDate();
  const progress = useProgress();
  const skyProgress = useSkyProgress();
  const dayProgress = useDayProgress();
  const { current, next } = usePhases();
  const song = useSong();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setShow(params.get("i"));
  });

  if (!show) return null;

  return (
    <>
      <Content>
        {date?.toString()}
        <br />
        sky: {(skyProgress * 100).toFixed(0)}%
        <br />
        day: {(dayProgress * 100).toFixed(0)}%
        <br />
        moment: {current?.displayName} → {next?.displayName}{" "}
        {Math.round(progress * 100).toFixed(0)}%
        <br />
        song: {song}
        <br />
        slide: {slide.toFixed(0)}%
      </Content>
    </>
  );
}
