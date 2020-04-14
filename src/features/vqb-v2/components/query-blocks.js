import React from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import Dropzone from "./dropzone";

const getQueryBlocks = createSelector(
  (_, queryId) => queryId,
  (state, queryId) => state.vqbv2.queries[queryId].blocks,
  (_, blocks) => blocks
);

export default function QueryBlocks({ queryId }) {
  // select query blocks
  const blocks = useSelector((state) => getQueryBlocks(state, queryId));
  // render placeholder based on blocks length
  const hasBlocks = blocks.length > 0;
  if (!hasBlocks) {
    return <Dropzone block={null} queryId={queryId} key={-1} index={0} />;
  }
  return (
    <>
      <Dropzone blockId={null} queryId={queryId} key={-1} index={0} />
      {blocks.map((blockId, index) => (
        <Dropzone
          blockId={blockId}
          queryId={queryId}
          key={index}
          index={index}
        />
      ))}
      <Dropzone
        blockId={null}
        queryId={queryId}
        key={blocks.length + 1}
        index={blocks.length + 1}
      />
    </>
  );
}
