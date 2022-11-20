import React, { useCallback, useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Equations } from "../data/clocks";
import { randomValue } from "../utils/array";
import chance from "../utils/chance";
import { responsive } from "../utils/style";
import ClockCursor from "../components/cursors/ClockCursor";

import "../style/index.css";

const BodyStyle = createGlobalStyle`
  body {
    color: #008BB7 !important;
    background-color: #F5F5F5  !important;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;

  position: relative;

  // cursor: none;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;

  position: relative;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const Part = styled.div`
  display: flex;
  align-items: center;
  font-family: "Grey";
  font-size: 220px;
  letter-spacing: -0.05em;

  opacity: ${(p) => p.percent};
  transition: opacity 1s linear;
  white-space: nowrap;
  min-height: 0;
  vertical-align: middle;
`;

const Toggles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
`;

const Toggle = styled.button`
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;

  width: 40px;
  height: 40px;
  border-radius: 50%;

  background-color: #d9d9d9;
  margin-bottom: 32px;

  &:last-of-type {
    margin-botton: 0;
  }

  &:hover {
    opacity: 0.56;
  }

  &.active {
    background-color: #008bb7;
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
      <Part key={key} percent={percent}>
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
                />
              );
            })}
          </Toggles>
          <Grid columns={parts.length}>{parts}</Grid>
        </Content>
      </Container>
    </>
  );
}
