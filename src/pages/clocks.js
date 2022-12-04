import React, { useCallback, useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Equations } from "../data/clocks";
import { randomValue } from "../utils/array";
import chance from "../utils/chance";
import { responsive } from "../utils/style";
// import ClockCursor from "../components/cursors/ClockCursor";

import "../style/index.css";

const IndexMap = {
  0: { row: 1, column: 1, align: "left" },
  1: { row: 2, column: 3, align: "left" },
  2: { row: 3, column: 2, align: "left" },
  3: { row: 4, column: 4, align: "right" },
  4: { row: 5, column: 5, align: "right" },
  5: { row: 6, column: 6, align: "right" },
};

const BodyStyle = createGlobalStyle`
  body {
    color: #8CA455 !important;
    background-color: #F5F5F5 !important;

    ${responsive.md`
      padding: 55px 70px !important;
    `}
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;

  position: relative;
`;

const Grid = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: ${({ size }) => `repeat(${size}, calc(100% / ${size}))`};
  grid-template-columns: ${({ size }) =>
    `repeat(${size}, calc(100% / ${size}))`};
`;

const Part = styled.div`
  display: flex;
  align-items: center;

  &:first-of-type {
    align-items: start;
  }

  &:last-of-type {
    align-items: end;
  }

  font-family: "Plaid";
  font-size: 24px;
  letter-spacing: 0.1em;

  ${responsive.md`
    font-size: 48px;
  `}

  opacity: ${(p) => p.percent};
  transition: opacity 1s linear;

  min-height: 0;
  white-space: nowrap;

  grid-row: ${({ index }) => IndexMap[index].row};
  grid-column: ${({ index }) => IndexMap[index].column};
  justify-self: ${({ index }) => IndexMap[index].align};
`;

const Toggles = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;

  display: flex;
  flex-direction: column;

  ${responsive.md`
    flex-direction: row;
  `}
`;

const Toggle = styled.button`
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;

  color: #8ca455;
  border-bottom: 2px solid transparent;

  font-size: 14px;
  margin-bottom: 16px;

  &:last-of-type {
    margin-bottom: 0;
  }

  ${responsive.md`
    font-size: 20px;
    margin: 0 24px 0 0;

    &:last-of-type {
      margin-right: 0;
    }
  `}

  &:hover {
    opacity: 0.56;
  }

  &.active {
    border-color: #8ca455;
  }
`;

export default function Clocks() {
  const [equation, setEquation] = useState(randomValue(Equations));
  const [output, setOutput] = useState(generateOutput(equation));

  function generateOutput(equation, output = { parts: [] }) {
    const newOutput = {
      parts: [{ key: "prefix", value: equation.prefix, interval: null }],
    };

    equation.order.forEach((obj) => {
      const { key, odds, interval } = obj;
      const list = equation[key];
      if (!list) return;

      const part = output.parts.find((p) => p.key === key);

      let newPart;

      if (!part || part.interval <= 0) {
        const hide = odds > 0 && !chance(odds);

        newPart = {
          key,
          value: hide ? "" : randomValue(list),
          interval: interval,
          percent: 1,
        };
      } else {
        const newInterval = part.interval - 1;
        newPart = {
          ...part,
          interval: newInterval,
          percent: newInterval / interval,
        };
      }

      newOutput.parts.push(newPart);
    });

    return newOutput;
  }

  const tick = useCallback(() => {
    const newOutput = generateOutput(equation, output);
    setOutput(newOutput);
  }, [equation, output]);

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [tick]);

  const toggle = (index) => {
    const newEquation = Equations[index];
    setEquation(newEquation);
    setOutput(generateOutput(newEquation));
  };

  const parts = output.parts.map((part, index) => {
    const { key, value, percent } = part;
    if (!value) return null;
    return (
      <Part key={key} index={index} percent={percent}>
        {value || " "}
        {index === output.parts.length - 1 ? "." : ""}
      </Part>
    );
  });

  return (
    <>
      <BodyStyle />
      <Container>
        {/* <ClockCursor /> */}
        <Content>
          <Toggles>
            {Equations.map((e, index) => {
              return (
                <Toggle
                  key={index}
                  className={`${e === equation ? "active" : ""}`}
                  onClick={() => toggle(index)}
                >
                  {index + 1}
                </Toggle>
              );
            })}
          </Toggles>
          <Grid size={parts.length}>{parts}</Grid>
        </Content>
      </Container>
    </>
  );
}
