import React from "react";
import { useDrop } from "react-dnd";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import styled from "styled-components";

import GenericBlock from "./generic-block";
import { copyBlock, reorderQuery } from "./../store/vqb-v2.actions";
import { BlockTypes, DisplayModes } from "./constants/constants";

const QueryDropzone = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  min-height: 300px;
  overflow: auto;
  background: ${(props) =>
    props.canDrop && props.isOver ? "green" : "yellow"};
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  /* prevent children from stretching whole height of this component */
  align-items: center;
  align-content: baseline;
  justify-content: flex-start;
  padding: 10px;
`;

const InitialQueryDropzone = ({ queryId }) => {
  const dispatch = useDispatch();
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [BlockTypes.NODE, BlockTypes.REL],
    drop: (item, monitor) => {
      // dispatch copy block
      dispatch(
        copyBlock({
          destination: { queryId, index: 0 },
          blockData: item,
        })
      );
    },
    canDrop: (item, monitor) => {
      const { isPrototype } = item;
      return isPrototype;
    },
    collect: (monitor) => {
      return {
        isOver: !!monitor.isOver(), // is something dragging over this zone?
        canDrop: !!monitor.canDrop(), // can the current item being dragged over be dropped here?
        itemType: monitor.getItemType(), // get the item type of the current item being dragged over
      };
    },
  });

  return <QueryDropzone ref={drop} isOver={isOver} canDrop={canDrop} />;
};

const getQueryBlocks = createSelector(
  (_, queryId) => queryId,
  (state, queryId) => state.vqbv2.queries[queryId].blocks,
  (_, blocks) => blocks
);

export default function QueryBlocks({ queryId }) {
  // select query blocks
  const blocks = useSelector((state) => getQueryBlocks(state, queryId));
  const dispatch = useDispatch();

  // TODO keep 1 dropzone or just have an initial one to be able to drop?
  if (blocks.length === 0) {
    return <InitialQueryDropzone queryId={queryId} />;
  }

  const moveBlock = ({ dragIndex, hoverIndex }) => {
    dispatch(
      reorderQuery({
        destination: {
          queryId,
          startIndex: dragIndex,
          endIndex: hoverIndex,
        },
      })
    );
  };

  const updateQuery = ({ blockData, insertIndex }) => {
    dispatch(
      copyBlock({
        destination: { queryId, index: insertIndex },
        blockData,
      })
    );
  };

  return (
    <QueryDropzone>
      {blocks.map((id, index) => (
        <GenericBlock
          key={id}
          id={id}
          index={index}
          collectionCount={blocks.length}
          handleMoveBlock={moveBlock}
          handleUpdateQuery={updateQuery}
          collectionOrientation={DisplayModes.HORIZONTAL}
        />
      ))}
    </QueryDropzone>
  );
}
