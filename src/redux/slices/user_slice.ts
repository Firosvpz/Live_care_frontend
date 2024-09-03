import { createSlice } from "@reduxjs/toolkit";

const user_data = localStorage.getItem("user_info");

const initialState = {
  user_info: user_data ? JSON.parse(user_data) : null,
};

const user_slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    set_user_credential: (state, action) => {
      state.user_info = action.payload;
      localStorage.setItem("user_info", JSON.stringify(action.payload));
    },
    remove_user_credential: (state) => {
      state.user_info = null;
      localStorage.removeItem("user_info");
    },
  },
});

export const { set_user_credential, remove_user_credential } =
  user_slice.actions;

export default user_slice.reducer;
