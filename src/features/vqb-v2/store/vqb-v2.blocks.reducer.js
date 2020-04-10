import { COPY_BLOCK, ADD_BLOCK } from "./vqb-v2.actions";

const initialBlocks = {};

const blocks = (state = initialBlocks, action) => {
  switch (action.type) {
    case ADD_BLOCK: {
      const { blockData } = action.payload;
      return {
        ...state,
        [blockData.id]: {
          ...blockData,
        },
      };
    }

    default:
      return state;
  }
};

export default blocks;
