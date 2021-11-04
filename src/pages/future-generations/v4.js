import React, { useState } from "react";
import styled from "styled-components";

import generate from "../../utils/tree";
import FlowerRound from '../../svg/flower-round.svg';

import Export from "../../components/Export";

const SCALE = 1;
const SIZE = 60;

const Container = styled.div`
  width: 100%;
  overflow-x: scroll;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

const BorderBox = styled.div`
  flex-direction: column;
  &.guidelines {
    border: 0.5px solid black;
    padding: 2px;
    margin: 2px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  min-width: 100%;
`;

const ParentBox = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 1px;
`

const ChildrenBox = styled.div`
  display: flex;
  justify-content: center;
`;

const PersonBox = styled.div`
  display: flex;
  position: relative;
  width: ${p => `${SIZE * (1 - (p.depth * SCALE) / 10)}px`};
  height: ${p => `${SIZE * 4 * (1 - (p.depth * SCALE) / 10) }px`};
  cursor: pointer;

  svg {
    fill: ${p => `#${p.color}`}
  }
`

const InfoBox = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  background-color: white;
  border: 1px solid black;
  z-index: 1;
  padding: 5px;

  p {
    white-space: nowrap;
    margin: 0;
  }
`

const Color = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${p => `#${p.color}`};
`

const GuidelinesButton = styled.button`
  position: fixed;
  top: 16px;
  left: 16px;
`;

// const ColorGrid = styled.div`
//   display: grid;
//   width: 100%;
//   height: 100%;
//   /* grid-template-rows: ${p => `repeat(${p.grid}, 1fr)`}; */
//   grid-template-columns: ${p => `repeat(${p.grid}, 1fr)`};
// `;

export default function V4() {
  if (typeof window === "undefined") return null;

  const [person] = useState(generate());
  const [guidelines, setGuidelines] = useState(false);

  function toggleGuidlines() {
    setGuidelines(!guidelines);
  }

  return (
    <Container>
      <Wrapper>
        <Person person={person} guidelines={guidelines}/>
      </Wrapper>
      <GuidelinesButton onClick={toggleGuidlines}>
        Toggle Guidlines
      </GuidelinesButton>
      <Export />
    </Container>
  );
}

function Single({ person }) {
  const [hovered, setHovered] = useState(false);

  function onMouseEnter() {
    setHovered(true)
  }

  function onMouseLeave() {
    setHovered(false)
  }

  const { gender, children, partner, colors, depth } = person;

  return (
    <PersonBox
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      gender={gender}
      depth={depth}
    >
      <Colors colors={colors} />
      {hovered &&
        <InfoBox>
          <p>Gender: {gender ? "Female" : "Male"}</p>
          <p>Partner: {partner ? "Yes" : "No"}</p>
          <p>Children: {children ? children.length : 0}</p>
        </InfoBox>}
    </PersonBox>
  )
}

function SinglePartner({ person }) {
  const [hovered, setHovered] = useState(false);

  function onMouseEnter() {
    setHovered(true)
  }

  function onMouseLeave() {
    setHovered(false)
  }

  const { gender, children, partner, colors, depth } = person;

  return (
    <PersonBox
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      color={colors[0]}
      gender={gender}
      depth={depth}
    > 
      <FlowerRound />
      {hovered &&
        <InfoBox>
          <p>Gender: {gender ? "Female" : "Male"}</p>
          <p>Partner: {partner ? "Yes" : "No"}</p>
          <p>Children: {children ? children.length : 0}</p>
        </InfoBox>}
    </PersonBox>
  )
}

function Colors({ colors }) {
  return colors.map((c, i) => <Color key={i} color={c} />);

  // const grid = Math.ceil(Math.sqrt(colors.length));

  // return (
  //   <ColorGrid grid={grid}>
  //     {colors.map((c, i) => <Color key={i} color={c} />)}
  //   </ColorGrid>
  // );
}

function Person({ person, guidelines }) {
  if (!person) return null;

  const { depth } = person

  return (
    <BorderBox
      id={!depth ? "export-id" : undefined}
      className={guidelines && "guidelines"}
      depth={depth}
    >
      <ParentBox> 
        <Single person={person} />
        {person.partner && <SinglePartner person={person.partner} />}
      </ParentBox> 
      <ChildrenBox>
        {person.children.map((child, i) => {
          return <Person key={i} person={child} guidelines={guidelines} />
        })}
      </ChildrenBox>
    </BorderBox>
  )
}
