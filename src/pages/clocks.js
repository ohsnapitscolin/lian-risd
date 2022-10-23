import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Equations } from "../data/clocks";
import { randomValue } from "../utils/array";
import chance from "../utils/chance";
import { responsive } from "../utils/style";
import Cursor from "../components/Cursor";

import "../style/index.css";

const Container = styled.div`
  color: #fdff9e;
  background-color: #00022c;

  width: 100%;
  height: 100%;

  box-sizing: border-box;

  padding: 24px;

  ${responsive.md`
    padding: 100px;
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
  font-size: 22px;
  letter-spacing: -0.05em;
  text-transform: lowercase;

  opacity: ${(p) => p.percent};
  transition: opacity 1s linear;
`;

const Toggles = styled.div`
  display: flex;
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
  color: #fdff9e;
  font-size: 22px;
  line-height: 26px;
  padding-bottom: 4px;
  margin-right: 36px;

  &:last-of-type {
    margin-right: 0;
  }

  &:hover {
    opacity: 0.6;
    cursor: none;
  }

  &.active {
    border-bottom: 1px solid #fdff9e;
  }
`;

const CursorContent = styled.div`
  background-color: #fdff9e;
  width: 15px;
  height: 15px;
  border-radius: 50%;
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

  const parts = output.parts.map((part) => {
    const { key, value, percent } = part;
    return (
      <Part key={key} percent={percent}>
        {value || " "}
      </Part>
    );
  });

  return (
    <>
      <Container>
        <Cursor>
          <CursorContent />
        </Cursor>
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
