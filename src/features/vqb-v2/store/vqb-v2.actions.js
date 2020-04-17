import { v4 as uuidv4 } from "uuid";

export const COPY_BLOCK = "COPY_BLOCK"; // MOVE BLOCK FROM TOOLBOX TO QUERY
export const CREATE_BLOCK = "CREATE_BLOCK"; // ADD BLOCK TO STORE
export const UPDATE_QUERY = "UPDATE_QUERY"; // UPDATE THE QUERY DATA TO INCLUDE (NEW) BLOCK ID AT RIGHT POSITION IN DATA
export const UPDATE_BLOCK = "UPDATE_BLOCK"; // ADD A MODIFIER TO A QUERY?
export const UPDATE_MODIFIER_GROUP = "UPDATE_MODIFIER_GROUP"; // add a modifier to a modifier group
export const CREATE_MODIFIER_GROUP = "CREATE_MODIFIER_GROUP"; // create a new modifier group by id

export const updateModifierGroup = ({ destination, blockId }) => ({
  type: UPDATE_MODIFIER_GROUP,
  payload: {
    destination,
    blockId,
  },
});

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

export const createModifierGroup = ({ id }) => ({
  type: CREATE_MODIFIER_GROUP,
  payload: {
    id,
  },
});

export const copyModifierBlock = ({ destination, blockData }) => (
  dispatch,
  getState
) => {
  const { type, label } = blockData;

  const newBlockId = uuidv4();

  dispatch(
    createBlock({
      type,
      label,
      id: newBlockId,
    })
  );

  dispatch(updateModifierGroup({ destination, blockId: newBlockId }));
};

export const copyBlock = ({ destination, blockData }) => (
  dispatch,
  getState
) => {
  const { type, label } = blockData;
  const newBlockId = uuidv4();

  const newModifiersGroupId = uuidv4();

  dispatch(
    createModifierGroup({
      id: newModifiersGroupId,
    })
  );
  dispatch(
    createBlock({
      type,
      label,
      id: newBlockId,
      modifierGroupId: newModifiersGroupId,
    })
  );
  dispatch(updateQuery({ destination, blockId: newBlockId }));
};
