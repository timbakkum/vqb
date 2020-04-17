import { combineReducers } from "redux";
import blocks from "./vqb-v2.blocks.reducer";
import queries from "./vqb-v2.queries.reducer";
import modifierGroups from "./vqb-v2.modifier-groups.reducer";

const vqbv2 = combineReducers({
  blocks,
  queries,
  modifierGroups,
});

export default vqbv2;
