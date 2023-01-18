import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const Width = 10000;
const Height = 10000;

const rotate = keyframes`{
  from { transform: translate(-50%) rotate(-360deg); }
  to { transform: translate(-50%) rotate(360deg); }
}`;

const Background = styled.div`
  width: ${Width}px;
  height: ${Height}px;
  position: absolute;
  top: -120px;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, 0);
  display: flex;
  align-items: center;
  justify-content: center;

  animation: ${rotate} 6000s linear infinite;
`;

const StarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Star = styled.div`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  transform: rotate(${({ rotation }) => rotation}deg);

  // background: radial-gradient(
  //   50% 50% at 50% 50%,
  //   #ffffff 0%,
  //   #ffffff 27.6%,
  //   rgba(232, 232, 232, 0) 72.4%
  // );
  border-radius: 50%;
  background: linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, #fffbd2 100%);
`;

export default function Stars() {
  const generateStars = () => {
    return Array(1000)
      .fill(0)
      .map(() => {
        const size = Math.random() * 400 + 100;
        return {
          top: Math.random() * Width,
          left: Math.random() * Height,
          width: size,
          height: size,
          rotation: 0,
        };
      });
  };

  const [stars] = useState(generateStars());

  return (
    <Background>
      <StarContainer>
        {stars.map((star, i) => (
          <Star
            key={i}
            top={star.top}
            left={star.left}
            width={star.width}
            height={star.height}
            rotation={star.rotation}
          />
        ))}
      </StarContainer>
    </Background>
  );
}
