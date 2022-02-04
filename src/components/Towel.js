import React from "react";
import styled from "styled-components";

import usePixi from "../hooks/pixi";

import download from "downloadjs";

const TowelContainer = styled.div`
  margin-bottom: 32px;
`;

export default function Towel({ towel }) {
  function exportCanvas() {
    const canvas = document.getElementsByTagName("canvas");
    const dataUrl = canvas[0].toDataURL("image/png");
    download(dataUrl, "towel.png");
  }

  const { pixiRef } = usePixi(towel, {});

  return (
    <>
      <div id="export-id">
        <TowelContainer ref={pixiRef} />
      </div>
      <button onClick={exportCanvas}>Export</button>
    </>
  );
}
