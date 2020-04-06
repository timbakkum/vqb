import React from "react";
import styled from "styled-components";
import Panel from "./components/panel";
import Canvas from "./components/canvas";

// @TODO add node and relationship properties in a later stage
const schema = {
  nodes: [
    {
      label: "Person",
    },
    {
      label: "Movie",
    },
  ],
  relations: [
    {
      relationshipType: "ACTED_IN",
    },
    {
      relationshipType: "DIRECTED",
    },
    {
      relationshipType: "PRODUCED",
    },
    {
      relationshipType: "WROTE",
    },
    {
      relationshipType: "FOLLOWS",
    },
    {
      relationshipType: "REVIEWED",
    },
  ],
};

const VQBGrid = styled.main`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 100%;
  height: 100%;
`;

export default function VQB() {
  return (
    <VQBGrid>
      <Panel schema={schema} />
      <Canvas />
    </VQBGrid>
  );
}
