import React from "react";
import styled from "styled-components";

const Width = 3000;
const Height = 10000;

const SkySheet = styled.div.attrs((p) => ({
  style: {
    top: `${p.top}px`,
  },
}))`
  width: ${Width}px;
  height: ${Height}px;
  position: absolute;
  left: 0;

  background: linear-gradient(
    #0f0f0f 0%,
    #011d41 3.57%,
    #b5b5b5 11.06%,
    #e6dde6 16.22%,
    #b0c5ce 23.67%,
    #d4df91 33.01%,
    #eef4e7 38.57%,
    #ffffff 47.73%,
    #f9ffd3 54.16%,
    #f1f2e4 61.06%,
    #d8bfd8 69.51%,
    #f4c890 75.41%,
    #ae928c 81.48%,
    #b5b5b5 86.67%,
    #011d41 93.03%,
    #0f0f0f 99.79%
  );
`;

export default function Sky({ progress }) {
  if (!progress) return null;
  const top = (((progress / 100) * Height) % Height) * -1;

  return (
    <>
      <SkySheet top={top} />
      <SkySheet top={top + Height} />
    </>
  );
}
