// TODO make generic dropzone that is also used for query dropzone?
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useDrop } from "react-dnd";
import {
  copyModifierBlock,
  copyBlockToCollection,
  reorderCollection,
} from "./../store/vqb-v2.actions";
import styled, { css } from "styled-components";
import GenericBlock from "./generic-block";

export const blockBorderColorMap = {
  // node: "#B3D9FF",
  // relationship: "#C964FF",
  modifierGroups: "#00E3C9",
};

export const blockColorMap = {
  // node: "#EBF5FF",
  // relationship: "#F8EBFF",
  modifierGroups: "#94FFF3",
  // empty: "lightgrey",
};
export const CollectionTypes = {
  QUERY: "queries",
  MOD: "modifierGroups", // TODO rename
  // REL groups?
};

export const DisplayModes = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
};
export const BaseDropzone = styled.div`
  transition-property: min-height, opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  min-width: 100px;
  max-width: 100%;
  min-height: ${(props) => (props.shouldDisplay ? "40px" : "0")};
  padding: 5px;

  background: ${(props) => blockColorMap[props.type]};
  border-color: ${(props) => blockBorderColorMap[props.type]};
  border-width: 1px;
  border-style: solid;
  border-radius: 6px;
  margin: 0px;
  opacity: ${(props) => (props.shouldDisplay ? 1 : 0)};
  ${(props) =>
    props.displayMode === DisplayModes.VERTICAL
      ? css`
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
        `
      : css`
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
        `}
`;

const getCollectionData = createSelector(
  (state) => state.vqbv2,
  (_, collectionId) => collectionId,
  (_, __, collectionType) => collectionType,
  (qbState, collectionId, collectionType) =>
    qbState[collectionType][collectionId]
);

const CollectionDropzone = ({
  collectionType,
  collectionId,
  acceptTypes,
  displayMode,
  itemDraggedOverParent,
}) => {
  const collectionData = useSelector((state) =>
    getCollectionData(state, collectionId, collectionType)
  );
  const dispatch = useDispatch();
  const hasItems = collectionData.blocks.length > 0;

  const [{ isOver, canDrop, itemType }, drop] = useDrop({
    accept: acceptTypes,
    drop: (item, monitor) => {
      console.log(item);
      dispatch(
        copyModifierBlock({
          destination: { collectionId, index: 0 }, // TODO make more dynamic
          blockData: item,
        })
      );
    },
    canDrop: (item, monitor) => {
      const { isPrototype } = item;
      return isPrototype & !hasItems; // TODO adapt
    },
    collect: (monitor) => {
      return {
        isOver: !!monitor.isOver(), // is something dragging over this zone?
        canDrop: !!monitor.canDrop(), // can the current item being dragged over be dropped here?
        itemType: monitor.getItemType(), // get the item type of the current item being dragged over
      };
    },
  });

  if (!collectionData) {
    return null; // bail if something goes wrong TODO change this/remove
  }

  const updateCollection = ({ blockData, insertIndex }) => {
    dispatch(
      copyBlockToCollection({
        destination: { collectionType, collectionId, index: insertIndex },
        blockData,
      })
    );
  };

  const moveBlock = ({ collectionType, dragIndex, hoverIndex }) => {
    dispatch(
      reorderCollection({
        destination: {
          collectionType,
          collectionId,
          startIndex: dragIndex,
          endIndex: hoverIndex,
        },
      })
    );
  };

  return (
    <BaseDropzone
      ref={drop}
      type={collectionType}
      shouldDisplay={
        hasItems ||
        (itemDraggedOverParent &&
          acceptTypes.includes(itemDraggedOverParent.type))
      }
      displayMode={displayMode}
      isOver={isOver}
    >
      {hasItems &&
        collectionData.blocks.map((id, index) => (
          <GenericBlock
            key={id}
            id={id}
            index={index}
            collectionCount={collectionData.blocks.length}
            handleMoveBlock={moveBlock}
            handleUpdateQuery={updateCollection}
            collectionOrientation={DisplayModes.VERTICAL}
          >
            modifier id {id}
          </GenericBlock>
        ))}
    </BaseDropzone>
  );
};

export default CollectionDropzone;
