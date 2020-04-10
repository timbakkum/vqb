import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
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

const HorizontalModifier = styled.div`
  /* some smart ass styles here? */
`;

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
  transition: background 0.3s ease;
  background: ${(props) =>
    props.isDragging ? "#F5A623" : colorMap[props.type]};
  height: 100%;
`;

const StyledBlock = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: ${(props) => (props.type === "nodes" ? "10px" : 0)};
`;

const getBlockData = createSelector(
  (state, type) => state.vqb.blocks[type],
  (_, __, id) => id,
  (blocksOfType, id) => blocksOfType[id]
);

export default function Block({ id, index, type }) {
  const blockData = useSelector((state) => getBlockData(state, type, id));
  console.log(type, id, blockData);
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <StyledBlock
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          type={type}
        >
          <BlockBody>
            <BlockLabel type={type} isDragging={snapshot.isDragging}>
              label: {blockData.label}, id: {id}
              {blockData.type === "modifiers" && (
                <p>
                  {blockData.operator} {blockData.variable}
                </p>
              )}
            </BlockLabel>
            {(blockData.type === "nodes" ||
              blockData.type === "relationships") && (
              <VerticalModifier>
                <Collection
                  id={blockData.modifierCollection}
                  type="modifiers"
                />
              </VerticalModifier>
            )}
          </BlockBody>

          {blockData.type === "nodes" && blockData.relationshipCollection && (
            <HorizontalModifier>
              <Collection
                id={blockData.relationshipCollection}
                type="relationships"
              />
            </HorizontalModifier>
          )}
          {blockData.type === "relationships" && (
            <HorizontalModifier>
              <Collection id={blockData.nodeCollection} type="nodes" />
            </HorizontalModifier>
          )}
        </StyledBlock>
      )}
    </Draggable>
  );
}
