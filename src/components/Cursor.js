import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

const Content = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);

  &.hidden {
    display: none;
  }
`;

export default function Cursor({ children }) {
  const cursorRef = useRef(null);
  const [hideCursor, setHideCursor] = useState(true);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.pageX + "px";
        cursorRef.current.style.top = e.pageY + "px";
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  useEffect(() => {
    const leaveDocument = () => {
      setHideCursor(true);
    };

    document.addEventListener("mouseleave", leaveDocument);

    return () => {
      document.removeEventListener("mouseleave", leaveDocument);
    };
  }, []);

  useEffect(() => {
    const enterDocument = () => {
      setHideCursor(false);
    };

    document.addEventListener("mouseenter", enterDocument);

    return () => {
      document.removeEventListener("mouseenter", enterDocument);
    };
  }, []);

  return (
    <Content className={hideCursor ? "hidden" : ""} ref={cursorRef}>
      {children}
    </Content>
  );
}
