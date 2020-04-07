const nodes = {
  "node-1": {
    id: "node-1",
    type: "nodes",
    label: "Person",
    value: "",
    relationshipCollection: "node-1",
    modifierCollection: "node-1-mod",
  },
  "node-2": {
    id: "node-2",
    type: "nodes",
    label: "Movie",
    value: "",
    relationshipCollection: "node-2",
    modifierCollection: "node-2-mod",
  },
  "node-3": {
    id: "node-3",
    type: "nodes",
    label: "Person",
    value: "",
    relationshipCollection: "node-3",
    modifierCollection: "node-3-mod",
  },
};

const relationships = {
  "rel-1": {
    id: "rel-1",
    type: "relationships",
    label: "ACTED_IN",
    modifierCollection: "rel-1-mod",
    nodeCollection: "rel-1-node",
  },
  "rel-2": {
    id: "rel-2",
    type: "relationships",
    label: "DIRECTED",
    modifierCollection: "rel-2-mod",
    nodeCollection: "rel-2-node",
  },
  "rel-3": {
    id: "rel-3",
    type: "relationships",
    label: "REVIEWED",
    modifierCollection: "rel-3-mod",
    nodeCollection: "rel-3-node",
  },
};

const modifiers = {
  "mod-1": {
    id: "mod-1",
    type: "modifiers",
    label: "name",
    operator: "=",
    variable: "Tom Hanks",
  },

  "mod-2": {
    id: "mod-2",
    type: "modifiers",
    label: "rating",
    operator: ">",
    variable: "5",
  },
};

const initialBlocks = {
  nodes,
  relationships,
  modifiers,
};

const ADD_BLOCK = "ADD_BLOCK";

const blocks = (state = initialBlocks, action) => {
  switch (action.type) {
    case ADD_BLOCK:
      return {
        ...state,
        [action.payload.blockType]: {
          ...state[action.payload.blockType],
          [action.payload.blockData.id]: {
            ...action.payload.blockData,
          },
        },
      };

    default:
      return state;
  }
};

export default blocks;
