import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { ColorGenerator } from "../utils/chance";
import { Helmet } from "react-helmet";
import ant from "../images/ant.gif";
import { groupBy } from "../utils/array";
import Modal from "react-modal";

import "../style/index.css"

const StorageKey = "ants";

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: 300;
  font-size: 16px;
  letter-spacing: 5px;
`;

const Colony = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-right: -20px;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  margin-bottom: 0px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const Ant = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: start;

  margin-right: 2px;
  margin-bottom: 2px;
  padding: 10px;
  padding-left: 8px;
  width: 50px;

  span {
    font-size: 9px;
  }

  color: ${(p) => p.color};
  background-color: #${(p) => p.background};
  border-radius: 8px;
`;

const AntButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  width: 20px;
  height: 20px;

  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`

const ModalContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-weight: 300;
  font-size: 14px;
`;

const ModalCopy = styled.span`
  color: #EDE6D3;
  text-align: center;
  line-height: 20px;
  letter-spacing: 5px;
`;

const ModelCloseButton = styled.button`
  position: absolute;
  right: 32px;
  top: 32px;
  color: #EDE6D3;
  border: none;
  appearance: none;
  background: none;
  padding: 16px;
  z-index: 1;
`;

const modalStyles = {
  content: {
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "#525e28",
    border: "none",
  },
};

export default function Ants() {
  const [ants, setAnts] = useState([]);
  const [colors] = useState(new ColorGenerator(Colors));
  const [modalIsOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    let storedAnts = JSON.parse(window.localStorage.getItem(StorageKey)) || [];
    storedAnts = storedAnts.map((ant) => {
      return {
        ...ant,
        date: new Date(ant.date),
      };
    });

    const { background, text } = colors.randColor();

    const updatedAnts = storedAnts.slice();
    updatedAnts.unshift({ date: new Date(), background, text });

    window.localStorage.setItem(StorageKey, JSON.stringify(updatedAnts));
    setAnts(updatedAnts);
  }, [colors]);

  const groupedAnts = groupBy(ants, ({ date }) => {
    return dayjs(date).format("MM/DD/YY");
  });

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Helmet>
        <title>&lrm;</title>
        <link rel="icon" href={ant} />
      </Helmet>

      <Header>
        <Title>new tab colony</Title>
        <AntButton onClick={openModal}>
          <img src={ant}/>
        </AntButton>
      </Header>

      <Colony>
        {Object.entries(groupedAnts).map(([key, value]) => (
          <Row key={key}>
            {value.map((ant) => {
              const date = dayjs(ant.date);
              return (
                <Ant
                  key={date.toISOString()}
                  color={ant.text}
                  background={ant.background}
                >
                  <span>{date.format("h:mma")}</span>
                  <span>{date.format("ddd").toLowerCase()}</span>
                  <span>{date.format("MMM D").toLowerCase()}</span>
                </Ant>
              );
            })}
          </Row>
        ))}
      </Colony>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Modal"
      >
        <ModelCloseButton onClick={closeModal}>X</ModelCloseButton>
        <ModalContent>
          <ModalCopy>An ant colony has memories<br></br>that its individual members don’t have.</ModalCopy>
        </ModalContent>
      </Modal>
    </>
  );
}

const Colors = [
  { background: "606c52", text: "#EDE6D3" },
  { background: "826ca5", text: "#EDE6D3" },
  { background: "d88727", text: "black" },
  { background: "441f00", text: "#EDE6D3" },
  { background: "8ec0e7", text: "black" },
  { background: "edf3ce", text: "black" },
  { background: "e3c6d4", text: "black" },
  { background: "dec982", text: "black" },
  { background: "a26f5b", text: "#EDE6D3" },
  { background: "f8cd99", text: "black" },
  { background: "525e28", text: "#EDE6D3" },
  { background: "899aa1", text: "black" },
  { background: "8ca871", text: "black" },
  { background: "5f6e8b", text: "#EDE6D3" },
  { background: "c8c260", text: "black" },
  { background: "7eb7c0", text: "black" },
  { background: "72593b", text: "#EDE6D3" },
  { background: "82824a", text: "#EDE6D3" },
  { background: "aebf94", text: "black" },
  { background: "385234", text: "#EDE6D3" },
  { background: "f0e07d", text: "black" },
  { background: "aaab5c", text: "black" },
  { background: "a89074", text: "black" },
  { background: "ce9c83", text: "black" },
  { background: "e7763a", text: "black" },
  { background: "a78b45", text: "black" },
  { background: "df9498", text: "black" },
  { background: "f7cfcc", text: "black" },
  { background: "e0b75b", text: "black" },
  { background: "293d60", text: "#EDE6D3" },
  { background: "3b678c", text: "#EDE6D3" },
  { background: "a6b5c8", text: "black" },
  { background: "edc987", text: "black" },
];
