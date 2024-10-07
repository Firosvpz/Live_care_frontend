import { createSlice } from "@reduxjs/toolkit";

const user_data = localStorage.getItem("userInfo");

const initialState = {
  userInfo: user_data ? JSON.parse(user_data) : null,
};

const user_slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredential: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    removeUserCredential: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    updateUserInfo: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
      localStorage.setItem("spInfo", JSON.stringify(state.userInfo));
    },
  },
});

export const { setUserCredential, removeUserCredential, updateUserInfo } =
  user_slice.actions;

export default user_slice.reducer;
