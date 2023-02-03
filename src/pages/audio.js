import React, { useState } from "react";
import styled from "styled-components";

import audio from "../services/audio";
import { progress } from "../utils/math";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
    margin-bottom: 8px;
  }
`;

const Row = styled.div`
  display: flex;
  & > * {
    margin-right: 8px;
  }
`;

export default function Audio() {
  return (
    <Container>
      {Object.entries(audio.howls).map(([name, howl]) => (
        <Sound key={name} name={name} howl={howl} />
      ))}
    </Container>
  );
}

function Sound({ name, howl }) {
  const [value, setValue] = useState(howl.maxVolume * 100);

  const play = () => {
    audio.play(name);
  };

  const pause = () => {
    audio.pause(name);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setValue(value);
    audio.songVolume(name, value / 100);
  };

  return (
    <Row>
      <span>{name}</span>
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
      <input
        type="range"
        min="1"
        max="100"
        value={value}
        onChange={handleChange}
      ></input>
      <span>{Number(value).toFixed(0)}</span>
    </Row>
  );
}
