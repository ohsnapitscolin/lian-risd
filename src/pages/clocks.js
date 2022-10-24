import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Equations } from "../data/clocks";
import { randomValue } from "../utils/array";
import chance from "../utils/chance";
import { responsive } from "../utils/style";
import ClockCursor from "../components/cursors/ClockCursor";

import "../style/index.css";

const Container = styled.div`
  color: #fcf1a4;
  background-color: #00022c;

  width: 100%;
  height: 100%;

  box-sizing: border-box;

  padding: 24px;

  ${responsive.md`
    padding: 50px 75px;
  `}

  position: relative;
  overflow: hidden;

  cursor: none;
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

  grid-template-row: repeat(${(p) => p.columns}, 1fr);

  ${responsive.md`
    grid-template-columns: 2fr repeat(${(p) => p.columns - 1}, 1fr);
  `}
`;

const Part = styled.span`
  font-family: "Bradford";
  font-size: 20px;
  letter-spacing: -0.05em;

  opacity: ${(p) => p.percent};
  transition: opacity 1s linear;
`;

const Toggles = styled.div`
  display: flex;
  align-items: flex-start;
  position: absolute;
  top: 0;
  left: 0;
`;

const Toggle = styled.button`
  appearance: none;
  background: none;
  border: 0;
  padding: 0;

  font-family: "Grey";
  color: #fcf1a4;
  font-size: 18px;
  line-height: 26px;
  padding-bottom: 4px;
  margin-right: 36px;

  &:last-of-type {
    margin-right: 0;
  }

  &:hover {
    cursor: none;
  }

  &.active {
    border-bottom: 1.5px solid #fcf1a4;
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
    return (
      <Part key={key} percent={percent}>
        {value || " "}
        {index === output.parts.length - 1 ? "." : ""}
      </Part>
    );
  });

  return (
    <>
      <Container>
        <ClockCursor />
        <Content>
          <Toggles>
            {Equations.map((e, index) => {
              return (
                <Toggle
                  key={index}
                  className={`${e === equation ? "active" : ""}`}
                  onClick={() => toggle(index)}
                >
                  clock {index + 1}
                </Toggle>
              );
            })}
          </Toggles>
          <Grid columns={parts.length}>{parts}</Grid>
        </Content>
      </Container>
    </>
  );
}
