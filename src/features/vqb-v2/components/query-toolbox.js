import React from "react";
import Block, { BlockTypes } from "./block";
import ToolboxBlock from "./toolbox-block";

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

const modifiers = {
  boolean: [
    {
      label: "AND",
    },
    {
      label: "NOT",
    },
    {
      label: "OR",
    },
    {
      label: "XOR",
    },
  ],
  property: [
    {
      label: "property",
      property: "", // one of the available properties
      propertyType: "", // string | number
      operator: "", // equals, contains etc
      value: "", // value to filter property by
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
        <ToolboxBlock type={BlockTypes.NODE} key={i} label={node.label} />
      ))}
      <hr />
      <h3>Relationships</h3>
      {schema.relations.map((rel, i) => (
        <ToolboxBlock
          type={BlockTypes.REL}
          key={i}
          label={rel.relationshipType}
        />
      ))}
      <h3>Modifiers/Filters</h3>
      <h4>Boolean</h4>
      {modifiers.boolean.map((mod, i) => (
        <ToolboxBlock type={BlockTypes.MOD} key={i} label={mod.label} />
      ))}
      <h4>Property</h4>
      {modifiers.property.map((mod, i) => (
        <ToolboxBlock type={BlockTypes.MOD} key={i} label={mod.label} />
      ))}
    </div>
  );
}
