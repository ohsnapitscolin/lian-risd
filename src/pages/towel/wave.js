import React, { useState } from "react";

import usePixi from "../../hooks/pixi";
import Wave from "../../towel/wave";

import Towel from "../../components/Towel";

export default function WaveTowel() {
  const [towel] = useState(new Wave());

  const { pixiRef } = usePixi(towel, {});

  return <Towel towel={towel} pixiRef={pixiRef} />;
}
