import React from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import Block from "./block";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

const borderColorMap = {
  nodes: "#B3D9FF",
  relationships: "#C964FF",
  modifiers: "#00E3C9",
};

const StyledCollection = styled.div`
  /* min-height: ${(props) => (props.isDraggingOver ? "40px" : "0")}; */
  transition: background 0.3s ease;
  background: ${(props) =>
    props.isDraggingOver ? borderColorMap[props.type] : "white"};
`;

const getCollectionData = createSelector(
  (state, type) => state.collections[type],
  (_, __, id) => id,
  (collectionsOfType, id) => collectionsOfType[id]
);

export default function Collection({ type, id }) {
  const { order: items } = useSelector((state) =>
    getCollectionData(state, type, id)
  );
  const hasBlocks = items.length > 0;

  return (
    <Droppable droppableId={id} type={type}>
      {(provided, snapshot) => (
        <StyledCollection
          ref={provided.innerRef}
          {...provided.droppableProps}
          type={type}
          isDraggingOver={snapshot.isDraggingOver}
        >
          {hasBlocks
            ? items.map((id, i) => (
                <Block key={id} id={id} index={i} type={type} />
              ))
            : null}
          {provided.placeholder}
        </StyledCollection>
      )}
    </Droppable>
  );
}
