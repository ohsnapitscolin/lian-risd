import React, { useState } from "react";

import usePixi from "../../hooks/pixi";
import Florets from "../../towel/florets";

import Towel from "../../components/Towel";

export default function FloretsTowel() {
  const [towel] = useState(new Florets());

  const { pixiRef } = usePixi(towel, {});

  return <Towel towel={towel} pixiRef={pixiRef} />;
}
