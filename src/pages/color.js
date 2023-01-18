import React, { useState, useRef, useEffect } from "react";

export default function MyColorfulComponent() {
  // Use the useState hook to maintain the current color of the component
  const [color, setColor] = useState("red");

  // Use the useRef hook to create a reference to the component
  const componentRef = useRef(null);

  // Use the useEffect hook to listen for changes in the component's visibility
  useEffect(
    () => {
      // Create a new IntersectionObserver to watch for when the component comes into view
      const observer = new IntersectionObserver((entries) => {
        // If the component has come into view, change the color to a random color
        if (entries[0].isIntersecting) {
          setColor(getRandomColor());
        }
      });

      // Start observing the component
      observer.observe(componentRef.current);

      // Clean up the observer when the component is unmounted
      return () => observer.disconnect();
    },
    [
      /* dependencies array */
    ]
  );

  return (
    <div ref={componentRef} style={{ color }}>
      This text will change colors when it comes into view!
    </div>
  );
}

function getRandomColor() {
  const colors = ["red", "green", "blue"];
  return colors[Math.floor(Math.random() * colors.length)];
}
