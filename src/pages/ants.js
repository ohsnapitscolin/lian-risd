import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { ColorGenerator } from "../utils/chance";
import { Helmet } from "react-helmet";
import ant from "../images/ant.png";
import { groupBy } from "../utils/array";
import Modal from "react-modal";

const StorageKey = "ants";

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 48px;
`;

const Title = styled.h1`
  margin: 0;
`;

const Ant = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;

  margin-right: 16px;
  padding: 16px;

  &:last-of-type {
    margin-right: 0;
  }

  color: ${(p) => p.color};
  background-color: #${(p) => p.background};
`;

const Colony = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  overflow-x: scroll;

  margin-bottom: 32px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const ModalContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ModalCopy = styled.span`
  color: white;
`;

const ModelCloseButton = styled.button`
  position: absolute;
  right: 32px;
  top: 32px;
  color: white;
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
    backgroundColor: "green",
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
        <Title>Lian's Title</Title>
        <button onClick={openModal}>Ant</button>
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
                  <span>{date.format("HH:mm:ss")}</span>
                  <span>{date.format("ddd")}</span>
                  <span>{date.format("MM/DD/YY")}</span>
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
          <ModalCopy>Ants have a collection memory.</ModalCopy>
        </ModalContent>
      </Modal>
    </>
  );
}

const Colors = [
  { background: "606c52", text: "black" },
  { background: "826ca5", text: "black" },
  { background: "d88727", text: "black" },
  { background: "441f00", text: "black" },
  { background: "8ec0e7", text: "black" },
  { background: "edf3ce", text: "black" },
  { background: "e3c6d4", text: "black" },
  { background: "edf3ce", text: "black" },
  { background: "606c52", text: "black" },
  { background: "e3c6d4", text: "black" },
  { background: "dec982", text: "black" },
  { background: "a26f5b", text: "black" },
  { background: "f8cd99", text: "black" },
  { background: "525e28", text: "black" },
  { background: "899aa1", text: "black" },
  { background: "8ca871", text: "black" },
  { background: "5f6e8b", text: "black" },
  { background: "863f77", text: "black" },
  { background: "c8c260", text: "black" },
  { background: "a26f5b", text: "black" },
  { background: "7eb7c0", text: "black" },
  { background: "72593b", text: "black" },
  { background: "82824a", text: "black" },
  { background: "aebf94", text: "black" },
  { background: "385234", text: "black" },
  { background: "f0e07d", text: "black" },
  { background: "aaab5c", text: "black" },
  { background: "a89074", text: "black" },
  { background: "2e6255", text: "black" },
  { background: "ce9c83", text: "black" },
  { background: "e7763a", text: "black" },
  { background: "a78b45", text: "black" },
  { background: "df9498", text: "black" },
  { background: "f7cfcc", text: "black" },
  { background: "e0b75b", text: "black" },
  { background: "293d60", text: "black" },
  { background: "3b678c", text: "black" },
  { background: "a6b5c8", text: "black" },
  { background: "edc987", text: "black" },
  { background: "c9545b", text: "black" },
];
