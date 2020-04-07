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
  /* border-width: 1px;
  border-style: solid;
  border-color: ${(props) => borderColorMap[props.type]}; */
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
    <StyledCollection type={type}>
      <Droppable droppableId={id} type={type}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {hasBlocks ? (
              items.map((id, i) => (
                <Block key={id} id={id} index={i} type={type} />
              ))
            ) : (
              <p>No blocks here yet! Maybe try adding a type of {type}</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </StyledCollection>
  );
}
