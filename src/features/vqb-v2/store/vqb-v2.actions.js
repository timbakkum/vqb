import { v4 as uuidv4 } from "uuid";

export const COPY_BLOCK = "COPY_BLOCK"; // MOVE BLOCK FROM TOOLBOX TO QUERY
export const CREATE_BLOCK = "CREATE_BLOCK"; // ADD BLOCK TO STORE
export const UPDATE_QUERY = "UPDATE_QUERY"; // UPDATE THE QUERY DATA TO INCLUDE (NEW) BLOCK ID AT RIGHT POSITION IN DATA
export const UPDATE_BLOCK = "UPDATE_BLOCK"; // ADD A MODIFIER TO A QUERY?

export const createBlock = (props) => ({
  type: CREATE_BLOCK,
  payload: {
    ...props,
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
  const { type, label } = blockData;
  const newBlockId = uuidv4();

  dispatch(createBlock({ type, label, id: newBlockId }));
  dispatch(updateQuery({ destination, blockId: newBlockId }));
};
