import { configureStore } from "@reduxjs/toolkit";
import user_slice from "../slices/user_slice";
import sp_slice from "../slices/sp_slice";

const store = configureStore({
  reducer: {
    userInfo: user_slice,
    spInfo:sp_slice
  },
});

export type RootState = ReturnType<typeof store.getState>; //for use with `useSelector`
export type AppDispatch = typeof store.dispatch; // for use with `useDispatch`

export default store;