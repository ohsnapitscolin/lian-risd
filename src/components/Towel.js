import React from "react";
import styled from "styled-components";

import download from "downloadjs";

const TowelContainer = styled.div`
  margin-bottom: 32px;
`;

export default function Towel({ towel, pixiRef }) {
  function exportCanvas() {
    const canvas = document.getElementsByTagName("canvas");
    const dataUrl = canvas[0].toDataURL("image/png");
    download(dataUrl, "towel.png");
  }

  return (
    <>
      <div id="export-id">
        <TowelContainer ref={pixiRef} />
      </div>
      <button onClick={exportCanvas}>Export</button>
    </>
  );
}
