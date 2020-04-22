import {
  UPDATE_MODIFIER_GROUP,
  CREATE_MODIFIER_GROUP,
  REORDER_COLLECTION,
} from "./vqb-v2.actions";

const initialModifierGroups = {};

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

const reorderOrderArray = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);
  return result;
};

const modifierGroups = (state = initialModifierGroups, action) => {
  switch (action.type) {
    case CREATE_MODIFIER_GROUP: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: {
          id,
          blocks: [],
        },
      };
    }
    case UPDATE_MODIFIER_GROUP: {
      const {
        destination: { collectionId, index },
        blockId,
      } = action.payload;
      return {
        ...state,
        [collectionId]: {
          ...state[collectionId],
          blocks: addItem(state[collectionId].blocks, blockId, index),
        },
      };
    }
    case REORDER_COLLECTION: {
      const {
        // tODO use collectionType to make this more generic
        destination: { collectionId, collectionType, startIndex, endIndex },
      } = action.payload;
      console.log(state, collectionId);
      return {
        ...state,
        [collectionId]: {
          ...state[collectionId],
          blocks: reorderOrderArray(
            state[collectionId].blocks,
            startIndex,
            endIndex
          ),
        },
      };
    }
    default:
      return state;
  }
};

export default modifierGroups;
