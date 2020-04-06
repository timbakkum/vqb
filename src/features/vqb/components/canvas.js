import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Query from "./query";

const relationshipsData = {
  blocks: {
    "rel-1": {
      id: "rel-1",
      type: "relationship",
      label: "ACTED_IN",
      modifiers: [],
    },
  },
  blockOrder: ["rel-1"],
};

const testData = {
  queries: [
    // TODO: this should just be an object like the structure down below
    {
      blocks: {
        "block-1": {
          id: "block-1",
          type: "node",
          label: "Person",
          value: "",
          relationships: relationshipsData,
          modifiers: [],
        },
        "block-2": {
          id: "block-2",
          type: "node",
          label: "Movie",
          value: "",
          relationships: {
            blocks: {},
            blockOrder: [],
          },
          modifiers: [],
        },
      },
      blockOrder: ["block-1", "block-2"],
      queryId: "query-1",
    },
  ],
  queryOrder: ["query-1"], // in case of multiple query (when we query by source at first?)
};

const reorderOrderArray = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);
  return result;
};

const addToOrderArray = (list, endIndex, newItem) => {
  const result = Array.from(list);
  result.splice(endIndex, 0, newItem);
  return result;
};

export default function Canvas() {
  const [state, setState] = useState(testData);

  function onDragEnd(result) {
    console.log(result);
    if (!result.destination) {
      return;
    }
    if (
      result.type === "query" &&
      result.destination.droppableId.includes("query")
    ) {
      if (result.destination.index === result.source.index) {
        // this check needs improving too, see below?
        return;
      }

      const blockOrder = reorderOrderArray(
        state.queries[0].blockOrder,
        result.source.index,
        result.destination.index
      );

      const newQueries = [{ ...state.queries[0], blockOrder }];
      setState({ ...state, queries: newQueries });
    }

    if (
      result.type === "rel" &&
      result.destination.droppableId.includes("rel")
    ) {
      if (result.destination.droppableId !== result.source.droppableId) {
        const destinationBlockId = result.destination.droppableId.split(
          "rel-to-"
        )[1]; // MEH
        const sourceBlockId = result.source.droppableId.split("rel-to-")[1]; // MEH
        const destinationArray = state.queries[0][destinationBlockId];
        const originalRelationshipBlock = {
          ...state.queries[0].blocks[sourceBlockId].relationships.blocks[
            result.draggableId
          ],
        };
        console.log(
          destinationBlockId,
          result.draggableId,
          originalRelationshipBlock
        );
        setState({
          ...state,
          queries: [
            {
              ...state.queries[0],
              blocks: {
                ...state.queries[0].blocks,
                [sourceBlockId]: {
                  ...state.queries[0].blocks[sourceBlockId],
                  relationships: {
                    blocks: {
                      ...state.queries[0].blocks[sourceBlockId].relationships
                        .blocks,
                    },
                    blockOrder: state.queries[0].blocks[
                      sourceBlockId
                    ].relationships.blockOrder.filter(
                      (r) => r !== result.draggableId
                    ),
                  },
                },
                [destinationBlockId]: {
                  ...state.queries[0].blocks[destinationBlockId],
                  relationships: {
                    blocks: {
                      ...state.queries[0].blocks[destinationBlockId]
                        .relationships.blocks,
                      [result.draggableId]: originalRelationshipBlock,
                    },
                    blockOrder: addToOrderArray(
                      state.queries[0].blocks[destinationBlockId].relationships
                        .blockOrder,
                      result.destination.index,
                      result.draggableId
                    ),
                  },
                },
              },
            },
          ],
        });
      }
      if (result.destination.index !== result.source.index) {
      }
    }
    return;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Query query={state.queries[0]} />
    </DragDropContext>
  );
}
