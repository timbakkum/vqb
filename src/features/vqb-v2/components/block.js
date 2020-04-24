import React from "react";
import { useDrag } from "react-dnd";
import styled, { css } from "styled-components";
import ModifierDropzone from "./modifier-dropzone";

const borderColorMap = {
  node: "#B3D9FF",
  relationship: "#C964FF",
  modifier: "#00E3C9",
  empty: "grey",
};

const colorMap = {
  node: "#EBF5FF",
  relationship: "#F8EBFF",
  modifier: "#94FFF3",
  empty: "lightgrey",
};

export const StyledBlock = styled.div`
  display: block;
  /* padding: 10px; */
  font-size: 12px;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => borderColorMap[props.type]};
  border-radius: 6px;
  transition: background 0.3s ease;
  background: ${(props) => colorMap[props.type]};
  opacity: ${(props) =>
    props.type === EMPTY_BLOCK_TYPE ? "0" : props.isDragging ? ".5" : "1"};

  ${(props) =>
    props.isOver &&
    props.canDrop &&
    css`
      transition-property: background, opacity;
      opacity: 0.8;
      box-shadow: 0px 0px 3px 3px rgba(20, 255, 20, 0.4);
      background: ${(props) => colorMap[props.itemType]};
      border-color: ${(props) => borderColorMap[props.itemType]};
    `}
`;

export const BlockTypes = {
  NODE: "node",
  REL: "relationship",
  MOD: "modifier",
};

export const EMPTY_BLOCK_TYPE = "empty";

export function EmptyBlock({ isOver, canDrop, itemType }) {
  return (
    <StyledBlock
      type={EMPTY_BLOCK_TYPE}
      isDragging={false}
      isOver={isOver}
      canDrop={canDrop}
      itemType={itemType}
    >
      <p>Empty placeholder block</p>
    </StyledBlock>
  );
}

export default function Block({ data }) {
  const { type, id, label, modifierGroupId } = data;

  const [collectedProps, drag] = useDrag({
    canDrag: false,
    item: { id, type, label },
    collect: (monitor) => ({
      // collect some props to return to the component
      isDragging: !!monitor.isDragging(), // is the current item being dragged?
    }),
  });

  return (
    <StyledBlock ref={drag} type={type} isDragging={collectedProps.isDragging}>
      <p>{label}</p>
      <span>{`block ${type}-${id}`}</span>
      {type === BlockTypes.NODE && (
        <ModifierDropzone modifierGroupId={modifierGroupId} />
      )}
    </StyledBlock>
  );
}
