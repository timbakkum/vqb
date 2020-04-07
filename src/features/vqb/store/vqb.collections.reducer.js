const nodeCollections = {
  query: {
    id: "query",
    order: ["node-1", "node-2"],
  },
  "rel-1-node": {
    id: "rel-1-node",
    order: ["node-3"],
  },
  "rel-2-node": {
    id: "rel-2-node",
    order: [],
  },
  "rel-3-node": {
    id: "rel-3-node",
    order: [],
  },
};

const relationCollections = {
  "node-1": {
    id: "node-1",
    order: ["rel-1", "rel-2"],
  },
  "node-2": {
    id: "node-2",
    order: ["rel-3"],
  },
  "node-3": {
    id: "node-3",
    order: [],
  },
};

const modifierCollections = {
  "node-1-mod": {
    id: "node-1-mod",
    order: ["mod-1"],
  },
  "node-2-mod": {
    id: "node-2-mod",
    order: [],
  },
  "node-3-mod": {
    id: "node-3-mod",
    order: [],
  },
  "rel-1-mod": {
    id: "rel-1-mod",
    order: [],
  },
  "rel-2-mod": {
    id: "rel-2-mod",
    order: [],
  },
  "rel-3-mod": {
    id: "rel-3-mod",
    order: ["mod-2"],
  },
};

const unusedCollections = {
  unused: {
    id: "unused",
    order: [], // how to know what is what in here? to be able to look it up!
  },
};

const initialCollections = {
  nodes: nodeCollections,
  relationships: relationCollections,
  modifiers: modifierCollections,
  unused: unusedCollections,
};

const UPDATE_COLLECTION = "UPDATE_COLLECTION";
const UPDATE_COLLECTIONS = "UPDATE_COLLECTIONS";
// const REMOVE_FROM_COLLECTION = "REMOVE_FROM_COLLECTION";
// const ADD_TO_COLLECTION = "ADD_TO_COLLECTION";

const reorderOrderArray = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);
  return result;
};

const removeItemFromArray = (list, index) => {
  const result = Array.from(list);
  result.splice(index, 1);
  return result;
};

const addItemToArray = (list, item, insertIndex) => {
  const result = Array.from(list);
  result.splice(insertIndex, 0, item);
  return result;
};

// TODO abstract later
// const getCollection = (state, type, id) => {
//   return
// }

// const getCollectionType = (allCollections, type) => {
//   return allCollections[type] || {};
// }

// const getCollectionById = (collections, id) => {

// }

const collections = (state = initialCollections, action) => {
  switch (action.type) {
    case UPDATE_COLLECTION: {
      const {
        collectionType,
        collectionId,
        sourceIndex,
        destinationIndex,
      } = action.payload;
      return {
        ...state,
        [collectionType]: {
          ...state[collectionType],
          [collectionId]: {
            ...state[collectionType][collectionId],
            order: reorderOrderArray(
              state[collectionType][collectionId].order,
              sourceIndex,
              destinationIndex
            ),
          },
        },
      };
    }
    case UPDATE_COLLECTIONS: {
      const {
        itemId,
        collectionType,
        sourceCollectionId,
        sourceIndex,
        destinationCollectionId,
        destinationIndex,
      } = action.payload;
      return {
        ...state,
        [collectionType]: {
          ...state[collectionType],
          [sourceCollectionId]: {
            ...state[collectionType][sourceCollectionId],
            order: removeItemFromArray(
              state[collectionType][sourceCollectionId].order,
              sourceIndex
            ),
          },
          [destinationCollectionId]: {
            ...state[collectionType][destinationCollectionId],
            order: addItemToArray(
              state[collectionType][destinationCollectionId].order,
              itemId,
              destinationIndex
            ),
          },
        },
      };
    }
    default:
      return state;
  }
};

export default collections;
