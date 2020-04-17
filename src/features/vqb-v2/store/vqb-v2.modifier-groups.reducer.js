import { UPDATE_MODIFIER_GROUP, CREATE_MODIFIER_GROUP } from "./vqb-v2.actions";

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
        destination: { modifierGroupId, index },
        blockId,
      } = action.payload;
      return {
        ...state,
        [modifierGroupId]: {
          ...state[modifierGroupId],
          blocks: addItem(state[modifierGroupId].blocks, blockId, index),
        },
      };
    }
    default:
      return state;
  }
};

export default modifierGroups;
