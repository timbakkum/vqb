import React from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import Block from "./block";

const StyledQuery = styled.div`
  margin: 20px;
  padding: 20px;
  border: 1px solid dodgerblue;
`;

export default function Query({ query }) {
  const hasBlocks = Object.keys(query.blocks).length > 0;
  return (
    <StyledQuery>
      <h2>My Query: {query.queryId}</h2>
      <Droppable droppableId={query.queryId} type="query">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ padding: 20, border: "1px solid pink" }}
          >
            {hasBlocks ? (
              query.blockOrder.map((id, i) => (
                <Block key={id} id={id} index={i} data={query.blocks[id]} />
              ))
            ) : (
              <p>No blocks here yet! Maybe try adding an entity?</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </StyledQuery>
  );
}
