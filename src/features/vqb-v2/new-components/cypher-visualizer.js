import React from "react";
import { BlockTypes } from "./constants/constants";
import { useSelector } from "react-redux";

const queryData = {
  blocks: {
    "b3e4281a-9828-4cb8-984b-7653645c04d4": {
      id: "b3e4281a-9828-4cb8-984b-7653645c04d4",
      type: "node",
      label: "Person",
      modifierGroupId: "302dbe53-4602-4623-a3cd-1680e6c1d63a",
    },
    "74f92640-264b-45a1-99c3-fba1fed068a1": {
      id: "74f92640-264b-45a1-99c3-fba1fed068a1",
      type: "node",
      label: "Movie",
      modifierGroupId: "89691440-7d98-4eb5-b5e9-af805e3c0c48",
    },
    "9d2e7ed5-7206-4f36-96a3-be18d372266d": {
      id: "9d2e7ed5-7206-4f36-96a3-be18d372266d",
      type: "relationship",
      label: "ACTED_IN",
      modifierGroupId: "88779992-3164-49cc-8eb6-877bb2328400",
    },
    "a27b15f9-77b5-4ec9-a7d5-0cfda7699dc9": {
      id: "a27b15f9-77b5-4ec9-a7d5-0cfda7699dc9",
      type: "modifier",
      label: "property",
      predicateData: {
        type: "property",
        propertyValue: "name",
        propertyType: "string",
        operatorValue: "CONTAINS",
        value: "Goodman",
      },
    },
  },
  queries: {
    q1: {
      id: "q1",
      blocks: [
        "b3e4281a-9828-4cb8-984b-7653645c04d4",
        "9d2e7ed5-7206-4f36-96a3-be18d372266d",
        "74f92640-264b-45a1-99c3-fba1fed068a1",
      ],
    },
  },
  modifierGroups: {
    "302dbe53-4602-4623-a3cd-1680e6c1d63a": {
      id: "302dbe53-4602-4623-a3cd-1680e6c1d63a",
      blocks: ["a27b15f9-77b5-4ec9-a7d5-0cfda7699dc9"],
    },
    "89691440-7d98-4eb5-b5e9-af805e3c0c48": {
      id: "89691440-7d98-4eb5-b5e9-af805e3c0c48",
      blocks: [],
    },
    "88779992-3164-49cc-8eb6-877bb2328400": {
      id: "88779992-3164-49cc-8eb6-877bb2328400",
      blocks: [],
    },
  },
};

const mapBlocksToCypher = (queryBuilderStore, queryId) => {
  let cypherQuery = {
    MATCH: [],
    WHERE: [],
    RETURN: [],
  };

  const queryBlocks = queryBuilderStore.queries[queryId].blocks;

  if (queryBlocks && queryBlocks.length) {
    const queryLength = queryBlocks.length;

    queryBlocks.map((currentBlockId, index) => {
      const getNodeMatch = (block) =>
        `(v${block.id.substring(0, 3)}:${block.label})`;
      const getRelMatch = (block) =>
        `[v${block.id.substring(0, 3)}:${block.label}]`;
      const getWhere = (block, parentId) => {
        return (
          (block.predicateData.type === "boolean" &&
            block.predicateData.operatorValue) ||
          (block.predicateData.type === "property" &&
            `v${parentId.substring(0, 3)}.${
              block.predicateData.propertyValue
            } ${block.predicateData.operatorValue} "${
              block.predicateData.value
            }"`) ||
          ""
        );
      };

      const block = queryBuilderStore.blocks[currentBlockId];

      const mappers = {
        [BlockTypes.NODE]: (block) => {
          cypherQuery.MATCH.push(getNodeMatch(block));
          cypherQuery.RETURN.push(`v${block.id.substring(0, 3)}`);
          if (block.modifierGroupId) {
            const modifierBlocks =
              queryBuilderStore.modifierGroups[block.modifierGroupId].blocks;
            modifierBlocks.forEach((modifierId) => {
              const currentModifier = queryBuilderStore.blocks[modifierId];
              cypherQuery.WHERE.push(getWhere(currentModifier, block.id));
            });
          }
        },
        [BlockTypes.REL]: (block) => {
          cypherQuery.MATCH.push(getRelMatch(block));
          cypherQuery.RETURN.push(`v${block.id.substring(0, 3)}`);
        },
      };

      mappers[block.type](block);
      if (index < queryLength - 1) {
        cypherQuery.MATCH.push("-");
        cypherQuery.RETURN.push(", ");
      }
    });
  }

  return cypherQuery;
};

export default function CypherVisualizer({ queryId = "q1" }) {
  const queryData = useSelector((s) => s.vqbv2);
  const q = mapBlocksToCypher(queryData, queryId);
  const renderValue = (v) => <span>{v}</span>;
  const renderValues = (values) => values.map(renderValue);

  return (
    <div
      style={{
        width: "100%",
        padding: "10px",
      }}
    >
      <h3>Cypher query visualizer</h3>
      <div>
        {q.MATCH.length > 0 ? (
          Object.keys(q).map((key) => {
            if (q[key].length > 0) {
              return (
                <div>
                  {renderValue(key)}
                  <span> </span>
                  {renderValues(q[key])}
                </div>
              );
            }
          })
        ) : (
          <p>
            Nothing to visualize yet, build a query in the zone above first!
          </p>
        )}
      </div>
    </div>
  );
}
