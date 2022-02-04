import React, { useState } from "react";
import styled from "styled-components";

import "../../style/index.css"

import { flatten } from "../../utils/tree";
import Export from "../../components/Export";

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
  margin: 5px;
`;

const Generation = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  min-width: 100%;
`;

const Generations = styled.div`
  display: flex;
  flex-direction: column;
`

const ParentBox = styled.div`
  display: flex;
  justify-content: center;
`

const PersonBox = styled.div`
  display: flex;
  position: relative;
  width: ${p => `${40 / ((p.depth + 1) / 3)}px`};
  height: ${p => `${40 / ((p.depth + 1) / 3)}px`};
  cursor: pointer;
  margin: 1px;
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

export default function V3() {
  if (typeof window === "undefined") return null;

  const people = flatten();

  return (
    <Container>
      <Wrapper>
        <Generations>
          {people.map(p => <Row people={p} />)}
        </Generations>
      </Wrapper>
      <Export name="future-generations.png" />
    </Container>
  );
}

function Row({ people }) {
  return (
    <Generation>
      {people.map(p => <Person person={p} />)}
    </Generation>
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

function Colors({ colors }) {
  return colors.map(c => <Color color={c} />)
}

function Person({ person }) {
  if (!person) return null;

  const { depth } = person

  return (
    <BorderBox id={!depth ? "export-id" : undefined} depth={depth}>
      <ParentBox> 
        <Single person={person} />
        {person.partner && <Single person={person.partner} small={true} />}
      </ParentBox> 
    </BorderBox>
  )
}
