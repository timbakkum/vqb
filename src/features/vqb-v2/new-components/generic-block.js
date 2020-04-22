import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  BaseBlock,
  BaseBlockPlaceholder,
  BaseBlockWrapper,
} from "./base-block";
import BlockContents from "./base-block-contents";
import CollectionDropzone from "./new-modifier-dropzone";
import {
  getDragLocationByOrientation,
  shouldMoveBlock,
} from "./helpers/drag.helpers";

import {
  BlockTypes,
  DisplayModes,
  CollectionTypes,
  DragLocation,
} from "./constants/constants";

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
  collectionOrientation,
}) => {
  const ref = useRef(null);
  const [prototypeDragLocation, setPrototypeDragLocation] = useState();

  const blockData = useSelector((state) => getBlockData(state, id));
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
      handleUpdateQuery({
        // TODO make generic
        insertIndex:
          prototypeDragLocation === DragLocation.PREV ? index : index + 1,
        blockData: {
          type: item.type,
          label: item.label,
          predicateData: item.predicateData,
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
        const currentDragLocation = getDragLocationByOrientation(
          monitor,
          ref,
          collectionOrientation
        );
        if (currentDragLocation !== prototypeDragLocation) {
          // update the location of the prototype block
          setPrototypeDragLocation(currentDragLocation);
        }
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (
        shouldMoveBlock(
          monitor,
          ref,
          collectionOrientation,
          dragIndex,
          hoverIndex
        )
      ) {
        handleMoveBlock({ dragIndex, hoverIndex });
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        // TODO check if this has any side effects or if we can easily do this via manipulating our store state?
        // maybe avoiding this can avoid the return-to-wrong-index-animation when released?
        item.index = hoverIndex;
      }
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

  return (
    <BaseBlockWrapper ref={ref} orientation={collectionOrientation}>
      <BaseBlockPlaceholder
        shouldDisplay={
          isPrototypeHovering && prototypeDragLocation === DragLocation.PREV
        }
        type={prototypeType}
        orientation={collectionOrientation}
      />
      <BaseBlock
        type={blockData.type}
        orientation={collectionOrientation}
        isBeingDragged={isDragging}
        hasPrev={
          (index !== 0 && index <= collectionCount - 1) ||
          (isPrototypeHovering && prototypeDragLocation === DragLocation.PREV)
        }
        hasNext={
          index !== collectionCount - 1 ||
          (index === collectionCount - 1 &&
            isPrototypeHovering &&
            prototypeDragLocation === DragLocation.NEXT)
        }
      >
        <BlockContents {...blockData} />
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
        orientation={collectionOrientation}
      />
    </BaseBlockWrapper>
  );
};

export default GenericBlock;
