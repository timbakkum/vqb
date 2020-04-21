import React from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import styled from "styled-components";

import QueryToolbox from "./components/query-toolbox";
import QueryGrid from "./components/query-grid";
import QueryRow from "./components/query-row";
import NewQueryBlocks from "./new-components/new-query-blocks";
// import QueryColumn from "./components/query-column";

const VQBGrid = styled.main`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 100%;
  height: 100%;
`;

export default function VQBv2() {
  return (
    <DndProvider backend={Backend}>
      <VQBGrid>
        <QueryToolbox />
        <QueryGrid>
          <QueryRow>
            <NewQueryBlocks queryId="q1" />
          </QueryRow>
        </QueryGrid>
      </VQBGrid>
    </DndProvider>
  );
}
