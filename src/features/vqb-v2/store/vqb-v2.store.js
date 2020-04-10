import { combineReducers } from "redux";
import blocks from "./vqb-v2.blocks.reducer";
import queries from "./vqb-v2.queries.reducer";

const vqbv2 = combineReducers({
  blocks,
  queries,
});

export default vqbv2;
