import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import Collection from "./collection";
import styled from "styled-components";

const QueryWrapper = styled.div`
  padding: 20px;
`;

const selectQueryCollection = createSelector(
  (state) => state.collections.nodes,
  (nodeCollections) => nodeCollections["query"]
);

export default function Canvas() {
  const queryCollection = useSelector((state) => selectQueryCollection(state));
  const dispatch = useDispatch();

  function onDragEnd(result) {
    console.log("result of onDragEnd", result);

    if (!result.destination) {
      // user didn't drop anywhere valid
      // return block to previous position
      return;
    }

    if (result.destination.droppableId === result.source.droppableId) {
      // if destination and source are the same
      // check if order array needs to be updated
      // and update source array if necessary
      if (result.destination.index !== result.source.index) {
        dispatch({
          type: "UPDATE_COLLECTION",
          payload: {
            collectionType: result.type,
            collectionId: result.destination.droppableId, // or source? does it ever matter?
            sourceIndex: result.source.index,
            destinationIndex: result.destination.index,
          },
        });
      }
    }

    if (result.destination.droppableId !== result.source.droppableId) {
      // if dest and source are different
      // update both collection array
      dispatch({
        type: "UPDATE_COLLECTIONS",
        payload: {
          itemId: result.draggableId,
          collectionType: result.type,
          sourceCollectionId: result.source.droppableId,
          sourceIndex: result.source.index,
          destinationCollectionId: result.destination.droppableId,
          destinationIndex: result.destination.index,
        },
      });
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <QueryWrapper>
        {queryCollection ? (
          <Collection id={queryCollection.id} type="nodes" />
        ) : (
          "No data"
        )}
      </QueryWrapper>
    </DragDropContext>
  );
}
