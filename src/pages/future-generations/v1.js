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
  padding: 10px 2px 2px;
  border: 0.5px solid black;
`;

const Wrapper = styled.div`
  display: flex;
  min-width: 100%;
`;

const ParentBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
`

const ChildrenBox = styled.div`
  display: flex;
  justify-content: center;
`;

const PersonBox = styled.div`
  position: relative;
  border: 1px solid black;
  padding: 5px;
  margin: 2px;
  background-color: ${p => p.gender ? "pink" : "lightblue"};
  cursor: pointer;
  border-radius: 50%;
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

export default function V1() {
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

  const { gender, children, partner } = person;

  return (
    <PersonBox
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      gender={gender}
    >
      {hovered &&
        <InfoBox>
          <p>Gender: {gender ? "Female" : "Male"}</p>
          <p>Partner: {partner ? "Yes" : "No"}</p>
          <p>Children: {children ? children.length : 0}</p>
        </InfoBox>}
    </PersonBox>
  )
}

function Person({ person }) {
  if (!person) return null;

  const { depth } = person;

  return (
    <BorderBox id={!depth ? "export-id" : undefined}>
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
