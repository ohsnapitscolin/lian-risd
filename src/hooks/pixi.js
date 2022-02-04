import { useCallback, useEffect, useRef, useState } from "react";
import { randColor } from "../utils/chance";

export default function usePixi(towel, initialState) {
  const pixiRef = useRef(null);

  const [app, setApp] = useState(null);
  const [loader, setLoader] = useState(null);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    async function initialize() {
      const { Application, Loader } = await import("pixi.js");

      if (!pixiRef) return;

      const app = new Application({
        width: 680,
        height: 1200,
        backgroundColor: `0x${randColor()}`
      });

      app.renderer.plugins.interaction.autoPreventDefault = false;

      // The application will create a canvas element for you that you
      // can then insert into the DOM.
      pixiRef.current.appendChild(app.view);

      setApp(app);
      setLoader(new Loader());
    }
    initialize();
  }, [pixiRef]);

  const updateState = useCallback(
    newState => {
      setState({ ...state, ...newState });
    },
    [state, setState]
  );

  useEffect(() => {
    if (!app || !loader) return;
    towel.initialize(app, loader);
  }, [towel, app, loader]);

  useEffect(() => {
    towel.setUpdateState(updateState);
  }, [towel, updateState]);

  return { pixiRef, state };
}
