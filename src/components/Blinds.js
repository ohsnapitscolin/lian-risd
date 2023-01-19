import React from "react";
import styled from "styled-components";

const Phase = {
  nightEnd: { from: [52, 72, 98], to: "#011D41" },
  nauticalDawn: { from: [158, 162, 166], to: "#5B697B" },
  dawn: { from: [181, 181, 181], to: "#AAACAE" },
  sunrise: { from: [181, 181, 181], to: "#E1D9E1" },
  sunriseEnd: { from: [181, 181, 181], to: "#8B9CA5" },
  goldenHourEnd: { from: [181, 181, 181], to: "#C4D9D9" },
  solarNoon: { from: [227, 230, 204], to: "#D6D9C2" },
  goldenHour: { from: [227, 230, 204], to: "#CCD6C9" },
  sunsetStart: { from: [181, 181, 181], to: "#F2F3E3" },
  sunset: { from: [181, 181, 181], to: "#D9BECD" },
  dusk: { from: [158, 162, 166], to: "#AB8E84" },
  nauticalDusk: { from: [52, 72, 98], to: "#B1ADA9" },
  night: { from: [52, 72, 98], to: "#354962" },
  nadir: { from: [52, 72, 98], to: "#011D41" },
};

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
    opacity: p.slide / 400,
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

export default function Blinds({ slide, moment, momentProgress }) {
  if (!moment) return null;

  return (
    <>
      <Grid slide={slide}>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Blind key={i}>
              <BeforeBlind
                slide={slide}
                phase={Phase[moment.current.name]}
                transition={1 - momentProgress}
              />
              <AfterBlind
                slide={slide}
                phase={Phase[moment.next.name]}
                transition={momentProgress}
              />
              <Shade slide={slide} />
            </Blind>
          ))}
      </Grid>
    </>
  );
}
