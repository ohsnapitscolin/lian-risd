import React, { useState } from "react";
import styled from "styled-components";

import "../../style/index.css"

import generate from "../../utils/tree";
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
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  min-width: 100%;
`;

const ParentBox = styled.div`
  display: flex;
  justify-content: center;
`

const ChildrenBox = styled.div`
  display: flex;
  justify-content: center;
`;

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

export default function V2() {
  if (typeof window === "undefined") return null;

  const person = generate();

  return (
    <Container>
      <Wrapper>
        <Person person={person} />
      </Wrapper>
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

function Colors({ colors }) {
  return colors.map((c, i) => <Color key={i} color={c} />)
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
      <ChildrenBox>
        {person.children.map((child, i) => {
          return <Person key={i} person={child} />
        })}
      </ChildrenBox>
    </BorderBox>
  )
}
