import { UPDATE_QUERY } from "./vqb-v2.actions";

const initialQueries = {
  q1: {
    id: "q1",
    // node -- rel -- node
    rootNodes: [],
    relationships: [],
    connectedNodes: [],
  },
};

const queries = (state = initialQueries, action) => {
  switch (action.type) {
    case UPDATE_QUERY: {
      const {
        destination: { query, collection },
        blockId,
      } = action.payload;
      return {
        ...state,
        [query]: {
          ...state[query],
          [collection]: [blockId],
        },
      };
    }
    default:
      return state;
  }
};

export default queries;
