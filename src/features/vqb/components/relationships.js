import React from "react";
import styled from "styled-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Block from "./block";

const StyledRelationships = styled.div`
  background: cyan;
  padding: 10px;
  border-width: 1px;
  border-style: solid;
  border-color: purple;
  margin-bottom: 10px;
  background: white;
`;

export default function Relationships({ blocks, blockOrder, id, to }) {
  const hasRelationships = blockOrder && blockOrder.length > 0;

  return (
    <StyledRelationships>
      <h2>Relationship for entity: {to}</h2>
      {/* TODO make this group/set of relationships draggable? */}
      <Droppable droppableId={`rel-to-${to}`} type="rel">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ padding: 20, border: "1px solid pink" }}
          >
            {hasRelationships ? (
              blockOrder.map((id, i) => (
                <Block key={id} id={id} index={i} data={blocks[id]} />
              ))
            ) : (
              <p>No blocks here yet! Maybe try adding an entity?</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </StyledRelationships>
  );
}
