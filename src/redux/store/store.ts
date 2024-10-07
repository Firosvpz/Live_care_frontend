import { configureStore } from "@reduxjs/toolkit";
import user_slice from "../slices/user_slice";
import sp_slice from "../slices/sp_slice";
import admin_slice from "../slices/admin_slice";

const store = configureStore({
  reducer: {
    user: user_slice,
    spInfo: sp_slice,
    adminInfo: admin_slice,
  },
});

console.log("reduxStore", store);

export type RootState = ReturnType<typeof store.getState>; //for use with `useSelector`
export type AppDispatch = typeof store.dispatch; // for use with `useDispatch`

export default store;
