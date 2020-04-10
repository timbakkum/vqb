export const COPY_BLOCK = "COPY_BLOCK"; // MOVE BLOCK FROM TOOLBOX TO QUERY
export const ADD_BLOCK = "ADD_BLOCK"; // ADD BLOCK TO STORE
export const UPDATE_QUERY = "UPDATE_QUERY"; // UPDATE THE QUERY DATA TO INCLUDE (NEW) BLOCK ID AT RIGHT POSITION IN DATA
export const UPDATE_BLOCK = "UPDATE_BLOCK"; // ADD A MODIFIER TO A QUERY?

export const addBlock = (blockData) => ({
  type: ADD_BLOCK,
  payload: {
    blockData,
  },
});

export const updateQuery = ({ destination, blockId }) => ({
  type: UPDATE_QUERY,
  payload: {
    destination,
    blockId,
  },
});

export const copyBlock = ({ destination, blockData }) => (
  dispatch,
  getState
) => {
  dispatch(addBlock(blockData));
  dispatch(updateQuery({ destination, blockId: blockData.id }));
};
