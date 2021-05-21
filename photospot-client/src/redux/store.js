import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

// Reducers
import userReducer from "./reducers/userReducer";
import dataReducer from "./reducers/dataReducer";
import UIReducer from "./reducers/UIReducer";
import paymentReducer from "./reducers/paymentReducer";
import vaultReducer from "./reducers/vaultReducer";

const intialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  user: userReducer,
  data: dataReducer,
  UI: UIReducer,
  payment: paymentReducer,
  vault: vaultReducer,
});

const store = createStore(
  reducers,
  intialState,
  //compose(applyMiddleware(...middleware)) - enable to develop
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
