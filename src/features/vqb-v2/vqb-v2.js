import React from "react";
import { DndProvider, useDrop } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import styled from "styled-components";

import QueryToolbox from "./components/query-toolbox";
import QueryGrid from "./components/query-grid";
import QueryRow from "./components/query-row";
import QueryColumn from "./components/query-column";
import Block, { BlockTypes } from "./components/block";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { copyBlock } from "./store/vqb-v2.actions";

const VQBGrid = styled.main`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 100%;
  height: 100%;
`;

const getItems = createSelector(
  (state) => state.vqbv2.queries["q1"],
  (_, collectionType) => collectionType,
  (query, collectionType) => query[collectionType]
  // make more dynamic
);

// make props more dynamic
const Dropzone = ({ acceptType, queryId, collectionType }) => {
  const items = useSelector((state) => getItems(state, collectionType));
  const dispatch = useDispatch();

  const [{ isOver }, drop] = useDrop({
    accept: acceptType,
    drop: (item, monitor) => {
      console.log("dropped", item, monitor);
      dispatch(
        copyBlock({
          destination: { query: queryId, collection: collectionType },
          blockData: item,
        })
      );
    },
    canDrop: (item, monitor) => {
      return items.length === 0;
    },
    collect: (monitor) => {
      console.log(monitor);
      return {
        isOver: !!monitor.isOver(), // is something dragging over this zone?
      };
    },
  });

  console.log(items);

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
      <h3 style={{ color: "white" }}>I accept 1 {acceptType}</h3>
      {items.map((item, index) => (
        <Block type={acceptType} id={item} key={index} />
      ))}
    </div>
  );
};

export default function VQBv2() {
  return (
    <DndProvider backend={Backend}>
      <VQBGrid>
        <QueryToolbox />
        <QueryGrid>
          <QueryRow>
            <QueryColumn>
              <Dropzone
                acceptType={BlockTypes.NODE}
                queryId={"q1"}
                collectionType="rootNodes"
              />
            </QueryColumn>
            <QueryColumn>
              <Dropzone
                acceptType={BlockTypes.REL}
                queryId={"q1"}
                collectionType="relationships"
              />
            </QueryColumn>
            <QueryColumn>
              <Dropzone
                acceptType={BlockTypes.NODE}
                queryId={"q1"}
                collectionType="connectedNodes"
              />
            </QueryColumn>
          </QueryRow>
        </QueryGrid>
      </VQBGrid>
    </DndProvider>
  );
}
