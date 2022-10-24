import React from "react";
import styled, { keyframes } from "styled-components";

import Cursor from "../Cursor";

// const pulse = keyframes`
//   from {
//     width: 15px;
//     height: 15px;
//   }

//   to {
//     width: 250px;
//     height: 250px;
//   }
// `;

// animation: ${pulse} 5s linear infinite;
// animation-direction: alternate;

const CursorContent = styled.div`
  background-color: #fcf1a4;
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;

export default function ClockCursor() {
  return (
    <Cursor>
      <CursorContent />
    </Cursor>
  );
}
