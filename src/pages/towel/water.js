import React, { useState, useEffect } from "react";

import Towel from "../../components/Towel";

export default function WaterTowel() {
  const [towel, setTowel] = useState(null);

  useEffect(() => {
    async function importTowel() {
      const Water = await import("../../towel/water");
      setTowel(new Water.default());
    }
    importTowel();
  }, []);

  return towel ? <Towel towel={towel} /> : null;
}
