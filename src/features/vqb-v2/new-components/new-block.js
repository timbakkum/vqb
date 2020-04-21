import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import styled, { css } from "styled-components";

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

export const BlockTypes = {
  NODE: "node",
  REL: "relationship",
  MOD: "modifier",
};

const baseConnectorCss = css`
  content: "";
  position: absolute;
  /* vary based on horizontal/vertical */
  top: 50%;
  transform: translateY(-50%);
  display: block;
  width: 6px;
  height: 12px;
  /* vary based on horizontal/vertical */
  border-width: 1px;
  border-style: solid;
`;

export const BaseBlockWrapper = styled.div`
  display: flex;
  /* make dynamic based on list/collection direction */
  flex-direction: row;
  flex-wrap: nowrap;
  height: auto;
`;

export const BaseBlock = styled.div`
  display: block;
  position: relative;
  min-width: 125px;
  max-width: 250px;
  min-height: 40px;
  padding: 10px;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  background: ${(props) => colorMap[props.type]};
  border-color: ${(props) => borderColorMap[props.type]};
  border-width: 1px;
  border-style: solid;
  border-radius: 6px;
  margin: 0px;
  opacity: ${(props) => (props.isBeingDragged ? 0 : 1)};

  &::before,
  &::after {
    /* vary based on type */
    background: ${(props) => colorMap[props.type]};
    border-color: ${(props) => borderColorMap[props.type]};
  }

  /* previous connection */
  /* TODO make generic css generation function (horizontal/vertical, type, hasNext, hasPrevious) */
  &::before {
    ${(props) =>
      props.hasPrev &&
      css`
        ${baseConnectorCss}
        left: -6px;
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
        /* vary based on horizontal/vertical */
        border-right: 0;
      `}
  }

  /* next connection */
  &::after {
    ${(props) =>
      props.hasNext &&
      css`
        ${baseConnectorCss}
        right: -6px;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        /* vary based on horizontal/vertical */
        border-left: 0;
      `}
  }
`;

export const BaseBlockPlaceholder = styled(BaseBlock)`
  transition: opacity 0.3s ease;
  display: ${(props) => (props.shouldDisplay ? "block" : "none")};
  opacity: ${(props) => (props.shouldDisplay ? 1 : 0)};
`;

// const getVerticalDragLocation = (monitor, ref) => {
//   if (!monitor.isOver()) return null;
//   const hoverBoundingRect = ref.current.getBoundingClientRect();
//   const clientOffset = monitor.getClientOffset();
//   const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
//   const hoverClientY = clientOffset.y - hoverBoundingRect.top;
//   console.log("hoverMiddleY; ", hoverMiddleY, "hoverClientY; ", hoverClientY);
//   if (hoverClientY < hoverMiddleY) {
//     return "top";
//   }
//   if (hoverClientY >= hoverMiddleY) {
//     return "bottom";
//   }
// };

const getHorizontalDragLocation = (monitor, ref) => {
  if (!monitor.isOver()) return null;
  const hoverBoundingRect = ref.current.getBoundingClientRect();
  console.log(hoverBoundingRect);
  const clientOffset = monitor.getClientOffset();
  const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
  const hoverClientX = clientOffset.x - hoverBoundingRect.left;
  console.log("hoverMiddleX; ", hoverMiddleX, "hoverClientX; ", hoverClientX);
  if (hoverClientX < hoverMiddleX) {
    return "prev";
  }
  if (hoverClientX >= hoverMiddleX) {
    return "next";
  }
};

const getBlockData = createSelector(
  (state) => state.vqbv2.blocks,
  (_, blockId) => blockId,
  (blocks, blockId) => {
    return blockId ? blocks[blockId] : null;
  }
);

const NewBlock = ({
  id,
  index,
  collectionCount,
  handleMoveBlock,
  handleUpdateQuery,
}) => {
  const ref = useRef(null);
  const [prototypeDragLocation, setPrototypeDragLocation] = useState();

  const blockData = useSelector((state) => getBlockData(state, id));
  // const dispatch = useDispatch();

  const [{ isPrototypeHovering, prototypeType }, drop] = useDrop({
    accept: [BlockTypes.NODE, BlockTypes.REL], // TODO only accept based on type
    drop(item) {
      if (!item.isPrototype) {
        return; // only allow dropping of prototype blocks on (adjacent to) this block
      }
      console.log("dropped a prototype block", item);
      handleUpdateQuery({
        insertIndex: prototypeDragLocation === "prev" ? index : index + 1,
        blockData: {
          type: item.type,
          label: item.label,
        },
        // TODO handle moving NODES and RELS moves between queries?
      });
    },
    hover(item, monitor) {
      if (!ref.current) {
        // bail if ref is not attached to dom node
        return;
      }

      if (item.isPrototype) {
        // update prototype drag location state whenever we're dragging a prototype over this block
        const currentDragLocation = getHorizontalDragLocation(monitor, ref);
        if (currentDragLocation !== prototypeDragLocation) {
          // update the location of the prototype block
          setPrototypeDragLocation(currentDragLocation);
        }
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // check if we need to reorder items within the list
      // NOTE this assumes drag and reorder within the SAME list
      // TODO implement dragging from list to another

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get horizontal middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      // Only perform the move when the mouse has crossed half of the items width
      // When dragging right, only move when the cursor is past 50%
      // When dragging left, only move when the cursor is before 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      // Time to actually perform the action
      handleMoveBlock({ dragIndex, hoverIndex });
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // TODO check if this has any side effects or if we can easily do this via manipulating our store state?
      item.index = hoverIndex;
    },
    collect(monitor) {
      const itemBeingDraggedOver = monitor.getItem();

      return {
        isPrototypeHovering:
          monitor.isOver() && // bail fast because this runs for every item whenever something is dragging!
          itemBeingDraggedOver &&
          itemBeingDraggedOver.isPrototype !== undefined &&
          itemBeingDraggedOver.isPrototype === true,
        prototypeType: monitor.isOver() ? itemBeingDraggedOver.type : null,
      };
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { ...blockData, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <BaseBlockWrapper ref={ref}>
      <BaseBlockPlaceholder
        shouldDisplay={isPrototypeHovering && prototypeDragLocation === "prev"}
        type={prototypeType}
      />
      <BaseBlock
        type={blockData.type}
        isBeingDragged={isDragging}
        hasPrev={
          (index !== 0 && index <= collectionCount - 1) ||
          (isPrototypeHovering && prototypeDragLocation === "prev")
        }
        hasNext={
          index !== collectionCount - 1 ||
          (index === collectionCount - 1 &&
            isPrototypeHovering &&
            prototypeDragLocation === "next")
        }
      >
        {blockData.label}, id: ${blockData.id.substring(0, 5)}
      </BaseBlock>
      <BaseBlockPlaceholder
        shouldDisplay={isPrototypeHovering && prototypeDragLocation === "next"}
        type={prototypeType}
      />
    </BaseBlockWrapper>
  );
};

export default NewBlock;
