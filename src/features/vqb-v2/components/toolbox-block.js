import React from "react";
import { useDrag } from "react-dnd";

import { StyledBlock } from "./block";

export default function ToolboxBlock({ type, label }) {
  const [collectedProps, drag] = useDrag({
    item: { type, label, isPrototype: true },
    collect: (monitor) => ({
      // collect some props to return to the component
      isDragging: !!monitor.isDragging(), // is the current item being dragged?
    }),
  });

  return (
    <StyledBlock ref={drag} type={type} isDragging={collectedProps.isDragging}>
      <p>{label}</p>
      <p>{type}</p>
    </StyledBlock>
  );
}
