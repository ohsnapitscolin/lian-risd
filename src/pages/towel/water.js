import React, { useState } from "react";

import usePixi from "../../hooks/pixi";
import Water from "../../towel/water";

import Towel from "../../components/Towel";

export default function WaterTowel() {
  const [towel] = useState(new Water());

  const { pixiRef } = usePixi(towel, {});

  return <Towel towel={towel} pixiRef={pixiRef} />;
}
