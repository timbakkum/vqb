import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import vqb from "./../features/vqb/store/vqb.store";
import vqbv2 from "./../features/vqb-v2/store/vqb-v2.store";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  vqb,
  vqbv2,
});

const Store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default Store;
