const nodes = {
  "node-1": {
    id: "node-1",
    type: "nodes",
    label: "Person",
    value: "",
    relationshipCollection: "node-1",
    modifierCollection: null,
  },
  "node-2": {
    id: "node-2",
    type: "nodes",
    label: "Movie",
    value: "",
    relationshipCollection: "node-2",
    modifierCollection: null,
  },
};

const relationships = {
  "rel-1": {
    id: "rel-1",
    type: "relationships",
    label: "ACTED_IN",
    modifierCollection: null,
  },
  "rel-2": {
    id: "rel-2",
    type: "relationships",
    label: "DIRECTED",
    modifierCollection: null,
  },
  "rel-3": {
    id: "rel-2",
    type: "relationships",
    label: "REVIEWED",
    modifierCollection: null,
  },
};

const modifiers = {
  // 1: {
  //   // some data
  // },
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
