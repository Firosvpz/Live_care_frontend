import { configureStore } from "@reduxjs/toolkit";
import sp_slice from "../slices/user_slice";

const store = configureStore({
  reducer: {
    sp_info: sp_slice,
  },
});

export type RootState = ReturnType<typeof store.getState>; //for use with `useSelector`
export type AppDispatch = typeof store.dispatch; // for use with `useDispatch`

export default store;
