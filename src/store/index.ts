import {combineReducers, configureStore} from "@reduxjs/toolkit";
import postReducer from "./reducers/postReducer";
import authReducer from "./reducers/authReducer";

// const rootReducer = combineReducers({
//     posts: postReducer
// })
//
// export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({reducer:{posts:postReducer,auth:authReducer}})
 export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

// declare global {
//     type RootState = ReturnType<typeof store.getState>
// }
//
// // Thanks to that you will have ability to use useSelector hook with state value
// declare module 'react-redux' {
//     interface DefaultRootState extends RootState { }
// }