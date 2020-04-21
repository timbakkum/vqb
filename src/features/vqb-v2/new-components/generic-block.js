import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  BaseBlock,
  BaseBlockPlaceholder,
  BaseBlockWrapper,
} from "./base-block";
import CollectionDropzone, {
  DisplayModes,
  CollectionTypes,
} from "./new-modifier-dropzone";

export const BlockTypes = {
  NODE: "node",
  REL: "relationship",
  MOD: "modifier",
};

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
  const clientOffset = monitor.getClientOffset();
  const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
  const hoverClientX = clientOffset.x - hoverBoundingRect.left;
  if (hoverClientX < hoverMiddleX) {
    return "prev"; // TODO use constants here
  }
  if (hoverClientX >= hoverMiddleX) {
    return "next";
  }
};

const getAcceptTypes = (blockType) => {
  switch (blockType) {
    case BlockTypes.MOD:
      return BlockTypes.MOD;
    case BlockTypes.NODE:
    case BlockTypes.REL:
      return [BlockTypes.NODE, BlockTypes.REL, BlockTypes.MOD];
    default:
      return [];
  }
};

const getBlockData = createSelector(
  (state) => state.vqbv2.blocks,
  (_, blockId) => blockId,
  (blocks, blockId) => {
    return blockId ? blocks[blockId] : null;
  }
);

const GenericBlock = ({
  id,
  index,
  collectionCount,
  handleMoveBlock,
  handleUpdateQuery,
  orientation,
}) => {
  const ref = useRef(null);
  const [prototypeDragLocation, setPrototypeDragLocation] = useState();

  const blockData = useSelector((state) => getBlockData(state, id));
  // const dispatch = useDispatch();
  const acceptTypes = getAcceptTypes(blockData.type);
  const [
    { isPrototypeHovering, prototypeType, isOver, itemOver },
    drop,
  ] = useDrop({
    accept: acceptTypes, // TODO only accept based on type
    drop(item) {
      if (!item.isPrototype) {
        return; // only allow dropping of prototype blocks on (adjacent to) this block
      }
      if (Array.isArray(acceptTypes) && item.type === BlockTypes.MOD) {
        return; // TODO remove once query dropzone has MOD as accept
      }
      console.log("dropped a prototype block", item);
      handleUpdateQuery({
        // TODO make generic
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
      if (Array.isArray(acceptTypes) && item.type === BlockTypes.MOD) {
        setPrototypeDragLocation(null);
        return; // TODO remove once query dropzone has MOD as accept
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
      console.log("item over parent? ", monitor.isOver(), monitor.getItem());
      return {
        isPrototypeHovering:
          monitor.isOver() && // bail fast because this runs for every item whenever something is dragging!
          itemBeingDraggedOver &&
          itemBeingDraggedOver.isPrototype !== undefined &&
          itemBeingDraggedOver.isPrototype === true,
        prototypeType: monitor.isOver() ? itemBeingDraggedOver.type : null,
        isOver: monitor.isOver(),
        itemOver: itemBeingDraggedOver,
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
  console.log(index, collectionCount);

  return (
    <BaseBlockWrapper ref={ref} orientation={orientation}>
      <BaseBlockPlaceholder
        shouldDisplay={isPrototypeHovering && prototypeDragLocation === "prev"}
        type={prototypeType}
        orientation={orientation}
      />
      <BaseBlock
        type={blockData.type}
        orientation={orientation}
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
        <span>
          {blockData.label}, id: ${blockData.id.substring(0, 5)}
        </span>
        {blockData.type === BlockTypes.NODE && (
          <CollectionDropzone
            collectionType={CollectionTypes.MOD}
            collectionId={blockData.modifierGroupId}
            acceptTypes={BlockTypes.MOD}
            displayMode={DisplayModes.VERTICAL}
            itemDraggedOverParent={isOver ? itemOver : null}
          />
        )}
      </BaseBlock>
      <BaseBlockPlaceholder
        shouldDisplay={isPrototypeHovering && prototypeDragLocation === "next"}
        type={prototypeType}
        orientation={orientation}
      />
    </BaseBlockWrapper>
  );
};

export default GenericBlock;
