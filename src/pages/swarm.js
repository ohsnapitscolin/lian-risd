import React, { useState } from "react"
import styled, { keyframes } from "styled-components"

import "../style/index.css"


const explode = keyframes`
  0% {
    font-variation-settings: "SWRM" 0;
  }

  50% {
    font-variation-settings: "SWRM" 100;
  }

  100% {
    font-variation-settings: "SWRM" 0;
  }
`;

const Main = styled.div`
  width: 100%;
  height: 100%;
`;

const TextArea = styled.div`
  width: 100%;
  height: 50px;
  margin-bottom: 32px;
  outline: none;

  font-size: 16px;
`;

const SpanArea = styled.span`
  white-space: normal;
  font-size: 64px;

  &.boom {
    animation: ${explode} 4s ease-in-out;
  }
`;

const Button = styled.button`
  position: fixed;
  bottom: 32px;
  left: 32px;
`;

const Char = styled.span`
  font-family: "Needle Work";
  display: inline-block;
  text-transform: uppercase;
  animation: ${explode} 4s ease-in-out;
`;

const Word = styled.span`
  display: inline-block;
`;

export default function Swarm() {
  const [text, setText] = useState("");
  const [boom, goBoom] = useState(false)
  
  function handleChange(e) {
    setText(e.target.innerText);
  }

  function renderText() {
    const length = text.length;
    const words = [];

    let wordCount = 0;
    [...text].forEach((char, index) => {
      const swarm = Math.min(length - (index + 1), 100)
      if (!words[wordCount]) words[wordCount] = [];
      if (char === ' ') {
        wordCount++;
        return;
      }
      words[wordCount].push(<Char swarm={swarm}>{char}</Char>)
    });
  
    return words.map((word, index) => {
      return (
        <>
          {index > 0 && <>&nbsp;</>}
          <Word>
            {word.map(char => char)}
          </Word>
        </>
      );
    });
  }

  return ( 
    <Main>
      <TextArea contentEditable onInput={handleChange}/>
      <Button onClick={() => goBoom(true)}>Boom</Button>
      <SpanArea className={boom && "boom"}>
        {renderText()}
      </SpanArea>
    </Main>
  );
}
