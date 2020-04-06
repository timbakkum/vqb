import React from "react";

export default function Panel({ schema: { nodes, relations } }) {
  return (
    <div style={{ border: "1px solid grey" }}>
      <h2>Entiteiten</h2>
      {nodes.length &&
        nodes.map((node, i) => (
          <button onClick={() => null} key={node.label}>
            {node.label}
          </button>
        ))}
      <hr />
      <h2>Relaties</h2>
      {relations.length &&
        relations.map((rel, i) => (
          <button onClick={() => null} key={rel.relationshipType}>
            {rel.relationshipType}
          </button>
        ))}
    </div>
  );
}
