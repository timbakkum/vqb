import React from "react";
import Block, { BlockTypes } from "./block";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { copyBlock } from "./../store/vqb-v2.actions";
import { useDrop } from "react-dnd";
import { EmptyBlock } from "./block";

const getBlockData = createSelector(
  (state) => state.vqbv2.blocks,
  (_, blockId) => blockId,
  (blocks, blockId) => {
    return blockId ? blocks[blockId] : null;
  }
);

const getAcceptType = (blockType) => {
  console.log(blockType);
  if (!blockType) {
    return Object.values(BlockTypes);
  }
  return blockType;
};

// make props more dynamic
const Dropzone = ({ queryId, blockId, index }) => {
  const blockData = useSelector((state) => getBlockData(state, blockId));
  // console.log(queryId, blockId, index, blockData);
  const dispatch = useDispatch();

  const blockType = blockData ? blockData.type : null;

  const [{ isOver }, drop] = useDrop({
    accept: getAcceptType(blockType),
    drop: (item, monitor) => {
      console.log("dropped item ", item, "on", blockId, monitor);
      const { type, isPrototype } = item;
      if (isPrototype && !blockId) {
        dispatch(
          copyBlock({
            destination: { queryId, index },
            blockData: item,
          })
        );
      }
    },
    canDrop: (item, monitor) => {
      const { index: sourceIndex } = item;
      return !blockId;
      // return items.length === 0;
    },
    collect: (monitor) => {
      // console.log(monitor);
      return {
        isOver: !!monitor.isOver(), // is something dragging over this zone?
      };
    },
  });

  return (
    <div
      ref={drop}
      style={{
        position: "relative",
        minWidth: "300px",
        minHeight: "100px",
        background: isOver ? "green" : "blue",
      }}
    >
      {blockData ? <Block data={blockData} /> : <EmptyBlock />}
    </div>
  );
};

export default Dropzone;
