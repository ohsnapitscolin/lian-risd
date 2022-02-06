import React, { useState, useEffect } from "react";

import Towel from "../../components/Towel";

export default function WaveTowel() {
  const [towel, setTowel] = useState(null);

  useEffect(() => {
    async function importTowel() {
      const Wave = await import("../../towel/wave2");
      setTowel(new Wave.default());
    }
    importTowel();
  }, []);

  return towel ? <Towel towel={towel} /> : null;
}
