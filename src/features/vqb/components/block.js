import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import Relationships from "./relationships";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import Collection from "./collection";

const borderColorMap = {
  nodes: "#B3D9FF",
  relationships: "#C964FF",
  modifiers: "#00E3C9",
};

const colorMap = {
  nodes: "#EBF5FF",
  relationships: "#F8EBFF",
  modifiers: "#94FFF3",
};

const HorizontalModifier = styled.div``;

const VerticalModifier = styled.div`
  flex-grow: 1;
`;

const BlockBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  min-width: 250px;
`;

const BlockLabel = styled.span`
  display: block;
  padding: 10px;
  font-size: 12px;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => borderColorMap[props.type]};
  border-radius: 6px;
  background: ${(props) => colorMap[props.type]};
  height: 100%;
`;

const StyledBlock = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const getBlockData = createSelector(
  (state, type) => state.blocks[type],
  (_, __, id) => id,
  (blocksOfType, id) => blocksOfType[id]
);

export default function Block({ id, index, type }) {
  const blockData = useSelector((state) => getBlockData(state, type, id));
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <StyledBlock
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <BlockBody>
            <BlockLabel type={type}>
              label: {blockData.label}, id: {id}
            </BlockLabel>
            {/* <VerticalModifier>vertical modifier here</VerticalModifier> */}
          </BlockBody>

          {blockData.type === "nodes" && blockData.relationshipCollection && (
            // TODO render to the side
            <HorizontalModifier>
              {/* <p>relationship zone</p> */}
              <Collection
                id={blockData.relationshipCollection}
                type={"relationships"}
              />
              {/* <Relationships {...blockData.relationships} to={blockData.id} /> */}
            </HorizontalModifier>
          )}
          {/* Do same for node/relationship modifiers and render below*/}
        </StyledBlock>
      )}
    </Draggable>
  );
}
