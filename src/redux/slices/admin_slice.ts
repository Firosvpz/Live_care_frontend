import { createSlice } from "@reduxjs/toolkit";

const admin_data = localStorage.getItem("adminInfo");
const initialState = {
  adminInfo: admin_data ? JSON.parse(admin_data) : null,
};

const admin_slice = createSlice({
  name: "adminInfo",
  initialState,
  reducers: {
    setAdminCredential: (state, action) => {
      state.adminInfo = action.payload;
      localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    adminLogout: (state) => {
      state.adminInfo = null;
      localStorage.removeItem("adminInfo");
    },
  },
});

export const { setAdminCredential, adminLogout } = admin_slice.actions;
export default admin_slice.reducer;
