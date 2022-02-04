import React, { useState, useEffect } from "react";

import Towel from "../../components/Towel";

export default function FloretsTowel() {
  const [towel, setTowel] = useState(null);

  useEffect(() => {
    async function importTowel() {
      const Florets = await import("../../towel/florets");
      setTowel(new Florets.default());
    }
    importTowel();
  }, []);

  return towel ? <Towel towel={towel} /> : null;
}
