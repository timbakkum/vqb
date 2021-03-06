import React from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";

const borderColorMap = {
  node: "#B3D9FF",
  relationship: "#C964FF",
  modifier: "#00E3C9",
};

const colorMap = {
  node: "#EBF5FF",
  relationship: "#F8EBFF",
  modifier: "#94FFF3",
};

const StyledBlock = styled.div`
  display: block;
  padding: 10px;
  font-size: 12px;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => borderColorMap[props.type]};
  border-radius: 6px;
  transition: background 0.3s ease;
  background: ${(props) => colorMap[props.type]};
  opacity: ${(props) => (props.isDragging ? ".5" : "1")};
`;

export const BlockTypes = {
  NODE: "node",
  REL: "relationship",
  MOD: "modifier",
};

export default function Block({ type, id, label }) {
  const [collectedProps, drag] = useDrag({
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
    </StyledBlock>
  );
}
