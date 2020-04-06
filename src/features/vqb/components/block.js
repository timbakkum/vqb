import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import Relationships from "./relationships";

const HorizontalModifier = styled.div``;

const VerticalModifier = styled.div`
  flex-grow: 1;
`;

const BlockBody = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
`;

const BlockLabel = styled.h3``;

const StyledBlock = styled.div`
  padding: 10px;
  border-width: 4px;
  border-style: solid;
  border-color: ${(props) => (props.type === "node" ? "lightblue" : "cyan")};
  margin-bottom: 10px;
  background: white;
  display: flex;
  flex-wrap: nowrap;
`;

export default function Block({ data, id, index }) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <StyledBlock
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          type={data.type}
        >
          <BlockBody>
            <BlockLabel>{data.label}</BlockLabel>
            <VerticalModifier>vertical modifier here</VerticalModifier>
          </BlockBody>

          {data.type === "node" && data.relationships && (
            // TODO render to the side
            <HorizontalModifier>
              <Relationships {...data.relationships} to={data.id} />
            </HorizontalModifier>
          )}
          {/* Do same for node/relationship modifiers and render below*/}
        </StyledBlock>
      )}
    </Draggable>
  );
}
