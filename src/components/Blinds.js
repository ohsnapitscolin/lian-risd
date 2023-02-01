import React from "react";
import styled from "styled-components";
import { Phase } from "../services/suncalc";
import { progress } from "../utils/math";

import { Transition } from "../services/suncalc";

const Grid = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  display: grid;
  grid-template-row: repeat(5, 1fr);

  opacity: ${({ hide }) => (hide ? 0 : 1)};
  transition: opacity ${Transition}ms;
`;

const Blind = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

const Fill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const Slide = styled.div`
  position: absolute;
  top: -10px;
  right: 10px;
  width: 5px;
  height: ${(p) => p.slide}%;
  border-radius: 3px;
  background: linear-gradient(90deg, #ffffff 0%, #bababa 100%);

  opacity: ${({ hide }) => (hide ? 0 : 1)};
  transition: opacity ${Transition}ms;
`;

const BeforeBlind = styled(Fill).attrs((p) => ({
  style: {
    opacity: p.transition,
    background: getGradient(p.phase.from, p.phase.to, p.slide),
  },
}))``;

const AfterBlind = styled(Fill).attrs((p) => ({
  style: {
    opacity: p.transition,
    background: getGradient(p.phase.from, p.phase.to, p.slide),
  },
}))``;

const Shade = styled(Fill).attrs((p) => ({
  style: {
    opacity: p.slide / 600,
  },
}))`
  background-color: black;
`;

function getGradient(from, to, slide) {
  const rgba = `rgba(${from[0]}, ${from[1]}, ${from[2]}, ${
    (slide / 100) * 0.72
  })`;

  return `linear-gradient(
    0deg,
    ${rgba} ${Math.max(80 - slide, 20)}%,
    ${to} 100%)
  `;
}

export default function Blinds({ slide, moment, momentProgress, hide }) {
  if (!moment) return null;

  return (
    <>
      <Grid hide={hide} slide={slide}>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Blind key={i}>
              <BeforeBlind
                slide={slide}
                phase={Phase[moment.current.name].blinds}
                transition={1 - momentProgress}
              />
              <AfterBlind
                slide={slide}
                phase={Phase[moment.next.name].blinds}
                transition={momentProgress}
              />
              <Shade slide={slide} />
            </Blind>
          ))}
      </Grid>
      <Slide hide={hide} slide={progress(30, 75, slide / 100)} />
    </>
  );
}
