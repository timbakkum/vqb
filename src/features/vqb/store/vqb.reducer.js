import { combineReducers } from "redux";
import blocks from "./vqb.blocks.reducer";
import collections from "./vqb.collections.reducer";

const vqb = combineReducers({
  blocks,
  collections,
});

export default vqb;
