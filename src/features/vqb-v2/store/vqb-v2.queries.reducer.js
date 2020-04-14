import { UPDATE_QUERY } from "./vqb-v2.actions";

const initialQueries = {
  q1: {
    id: "q1",
    blocks: [],
  },
};

const addItem = (list, item, index) => {
  if (typeof index !== "number") {
    return list;
  }
  if (index > list.length) {
    return addItemToArrayEnd(list, item);
  }
  return addItemToArray(list, item, index);
};

const addItemToArray = (list, item, insertIndex) => {
  const result = Array.from(list);
  result.splice(insertIndex, 0, item);
  return result;
};

const addItemToArrayEnd = (list, item) => {
  const result = Array.from(list);
  result.push(item);
  return result;
};

// const reorderOrderArray = (list, startIndex, endIndex) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);

//   result.splice(endIndex, 0, removed);
//   return result;
// };

// const removeItemFromArray = (list, index) => {
//   const result = Array.from(list);
//   result.splice(index, 1);
//   return result;
// };

const queries = (state = initialQueries, action) => {
  switch (action.type) {
    case UPDATE_QUERY: {
      const {
        destination: { queryId, index },
        blockId,
      } = action.payload;
      return {
        ...state,
        [queryId]: {
          ...state[queryId],
          blocks: addItem(state[queryId].blocks, blockId, index),
        },
      };
    }
    default:
      return state;
  }
};

export default queries;
