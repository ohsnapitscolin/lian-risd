
import React, { useState } from "react";
import styled from "styled-components";

import * as htmlToImage from 'html-to-image';
import download from "downloadjs";

const Button = styled.button`
  margin-top: 32px;
`;

export default function Export({ options = {} }) {
  const [exporting, setExporting] = useState(false)

  function exportImage() {
    setExporting(true);

    htmlToImage.toPng(
      document.getElementById("export-id"), 
      {
        pixelRatio: 10,
        ...options
      }
    ).then((dataUrl) => {
      download(dataUrl, 'future-generations.png');
      setExporting(false);
    });
  }

  return (
    <Button onClick={exportImage} disabled={exporting}>
      Export
    </Button>
  );
}
