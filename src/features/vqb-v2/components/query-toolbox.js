import React from "react";
import Block, { BlockTypes } from "./block";

// @TODO add node and relationship properties in a later stage
const schema = {
  nodes: [
    {
      label: "Person",
    },
    {
      label: "Movie",
    },
  ],
  relations: [
    {
      relationshipType: "ACTED_IN",
    },
    {
      relationshipType: "DIRECTED",
    },
    {
      relationshipType: "PRODUCED",
    },
    {
      relationshipType: "WROTE",
    },
    {
      relationshipType: "FOLLOWS",
    },
    {
      relationshipType: "REVIEWED",
    },
  ],
};

export default function QueryToolBox() {
  return (
    <div style={{ border: "1px solid black", height: "100%" }}>
      <h2>Toolbox</h2>
      <hr />
      <h3>Nodes</h3>
      {schema.nodes.map((node, i) => (
        <Block type={BlockTypes.NODE} id={i} label={node.label} />
      ))}
      <hr />
      <h3>Relationships</h3>
      {schema.relations.map((rel, i) => (
        <Block type={BlockTypes.REL} id={i} label={rel.relationshipType} />
      ))}
    </div>
  );
}
