import { CREATE_BLOCK, UPDATE_BLOCK } from "./vqb-v2.actions";
import produce from "immer";

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
    case UPDATE_BLOCK: {
      const { id, field, newValue } = action.payload;
      const nextState = produce(state, (draftState) => {
        console.log(draftState);
        draftState[id].predicateData[field] = newValue;
      });

      return nextState;
    }

    default:
      return state;
  }
};

export default blocks;
