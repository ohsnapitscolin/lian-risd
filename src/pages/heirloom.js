import React, { useState } from "react";
import styled from "styled-components";
import "../style/index.css";

const TextArea = styled.div`
  width: 100%;
  height: 600px;

  font-size: 128px;
  font-family: "Heirloom ${(p) => p.family}";
  margin-bottom: 24px;
`;

const ButtonWrapper = styled.div`
  display: flex;
`;

export default function Heirloom() {
  const [family, setFamily] = useState("Garden");

  return (
    <>
      <TextArea contentEditable family={family} />
      <ButtonWrapper>
        <button onClick={() => setFamily("Garden")}>Garden</button>
        <button onClick={() => setFamily("Home")}>Home</button>
        <button onClick={() => setFamily("Seaside")}>Seaside</button>
      </ButtonWrapper>
    </>
  );
}
