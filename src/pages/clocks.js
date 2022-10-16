import React, { useCallback, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Equations } from "../data/clocks";
import { randomValue } from "../utils/array";
import chance from "../utils/chance";

import "../style/index.css";

const Container = styled.div`
  color: white;
  background-color: black;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
`;

const Part = styled.span`
  display: inline-block;
  font-family: ui-monospace;
  text-transform: uppercase;
  font-weight: 200;
  opacity: ${(p) => p.percent};
  transition: opacity 1s linear;
  font-size: 32px;
`;

export default function Clocks() {
  const equation = useRef(randomValue(Equations));
  const [output, setOutput] = useState({ parts: [] });

  const generateOutput = useCallback(() => {
    const newOutput = {
      parts: [
        { key: "prefix", value: equation.current.prefix, interval: null },
      ],
    };

    equation.current.order.forEach((obj) => {
      const { key, odds, interval } = obj;
      const list = equation.current[key];
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
  }, [output]);

  const tick = useCallback(() => {
    setOutput(generateOutput());
  }, [generateOutput]);

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [tick]);

  const parts = output.parts.map((part) => {
    const { key, value, percent } = part;
    if (!part.value) return null;
    return (
      <Part key={key} percent={percent}>
        {value}&nbsp;
      </Part>
    );
  });

  return (
    <Container>
      <Content>{parts}</Content>
    </Container>
  );
}
