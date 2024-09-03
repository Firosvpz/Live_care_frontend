import { createSlice } from "@reduxjs/toolkit";

const sp_data = localStorage.getItem("sp_info");

const initialState = {
  sp_info: sp_data ? JSON.parse(sp_data) : null,
};

const sp_slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    set_sp_credential: (state, action) => {
      state.sp_info = action.payload;
      localStorage.setItem("sp_info", JSON.stringify(action.payload));
    },
    remove_sp_credential: (state) => {
      state.sp_info = null;
      localStorage.removeItem("sp_info");
    },
  },
});

export const { set_sp_credential, remove_sp_credential } =
  sp_slice.actions;

export default sp_slice.reducer;
