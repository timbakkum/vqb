import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import VQBv2 from "./features/vqb-v2/vqb-v2";

import * as serviceWorker from "./serviceWorker";
import Store from "./store/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={Store}>
      <VQBv2 />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
