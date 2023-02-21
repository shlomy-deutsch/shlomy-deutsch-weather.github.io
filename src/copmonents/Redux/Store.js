import { createStore } from "redux";
import { stateReducer } from "./GlobalState";

const store = createStore(stateReducer)

export default store;