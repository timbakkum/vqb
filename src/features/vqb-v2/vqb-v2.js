import React from "react";
import { useDispatch } from 'react-redux'
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import styled from "styled-components";

import QueryToolbox from "./components/query-toolbox";
import QueryGrid from "./components/query-grid";
import QueryRow from "./components/query-row";
import NewQueryBlocks from "./new-components/new-query-blocks";
import CypherVisualizer from "./new-components/cypher-visualizer";
import { resetAll } from './store/vqb-v2.actions';
// import QueryColumn from "./components/query-column";

const VQBGrid = styled.main`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 100%;
  height: 100%;
`;

export default function VQBv2() {
  const dispatch = useDispatch()
  const handleResetAll = () => {
    dispatch(resetAll());
  };

  return (
    <DndProvider backend={Backend}>
      <VQBGrid>
        <QueryToolbox />
        <QueryGrid>
          <button style={{ background: 'lightblue', width: 200 }} onClick={() => handleResetAll()}>Reset all</button>
          <QueryRow>
            <NewQueryBlocks queryId="q1" />
          </QueryRow>
          <QueryRow>
            <CypherVisualizer />
          </QueryRow>
        </QueryGrid>
      </VQBGrid>
    </DndProvider>
  );
}
