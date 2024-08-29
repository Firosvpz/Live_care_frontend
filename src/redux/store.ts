
import { configureStore } from "@reduxjs/toolkit";
import auth_reducer from "./slice/auth_slice";

const store = configureStore({
    reducer : {
        auth:auth_reducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store