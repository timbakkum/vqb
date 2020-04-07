import { createStore, compose } from "redux";
import rootReducer from "./vqb.reducer";

const Store = createStore(
  rootReducer,
  compose(
    //applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default Store;
