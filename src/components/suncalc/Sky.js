import React from "react";
import styled from "styled-components";
import { useSkyProgress } from "../../hooks/suncalc";

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
    #e6dde6 18.05%,
    #b6c8d1 26.28%,
    #d3d9ad 34.75%,
    #f0f3de 44.58%,
    #ffffff 48.75%,
    #f3eadc 54.85%,
    #e6dde6 64.16%,
    #ae928c 73.17%,
    #a8a1b7 79.4%,
    #b5b5b5 84.94%,
    #011d41 93.03%,
    #0f0f0f 99.79%
  );
`;

export default function Sky() {
  const progress = useSkyProgress();

  if (!progress) return null;
  const top = ((progress * Height) % Height) * -1;

  return (
    <>
      <SkySheet top={top} />
      <SkySheet top={top + Height} />
    </>
  );
}
