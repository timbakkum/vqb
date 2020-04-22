import { CREATE_BLOCK } from "./vqb-v2.actions";

const initialBlocks = {};

const blocks = (state = initialBlocks, action) => {
  switch (action.type) {
    case CREATE_BLOCK: {
      const {
        id,
        type,
        label,
        modifierGroupId,
        predicateData,
      } = action.payload;
      return {
        ...state,
        [id]: {
          // TODO create new items more dynamically
          id,
          type,
          label,
          modifierGroupId,
          predicateData,
        },
      };
    }

    default:
      return state;
  }
};

export default blocks;
