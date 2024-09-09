// sp_slice.ts
import { createSlice } from "@reduxjs/toolkit";

const sp_data = localStorage.getItem("spInfo");

const initialState = {
  spInfo: sp_data ? JSON.parse(sp_data) : null,
};

const sp_slice = createSlice({
  name: "spInfo",
  initialState,
  reducers: {
    setServiceProviderCredential: (state, action) => {
      state.spInfo = action.payload;
      localStorage.setItem("spInfo", JSON.stringify(action.payload));
    },
    removeServiceProviderCredential: (state) => {
      state.spInfo = null;
      localStorage.removeItem("spInfo");
    },
    updateServiceProviderInfo: (state, action) => {
      state.spInfo = {
        ...state.spInfo,
        ...action.payload,
      };
      localStorage.setItem("spInfo", JSON.stringify(state.spInfo));
    },
  },
});

export const {
  setServiceProviderCredential,
  removeServiceProviderCredential,
  updateServiceProviderInfo,
} = sp_slice.actions;
export default sp_slice.reducer;
