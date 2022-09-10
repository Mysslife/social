import { createSlice } from "@reduxjs/toolkit";

export const allUserSlice = createSlice({
  name: "allUser",
  initialState: {
    usersList: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    // GET ALL USERS:
    getAllUserStart: (state) => {
      state.isFetching = true;
    },
    getAllUserSuccess: (state, action) => {
      state.isFetching = false;
      state.usersList = action.payload;
    },
    getAltUserFailed: (state) => {
      state.error = true;
      state.isFetching = false;
    },
  },
});

export const { getAllUserStart, getAllUserSuccess, getAltUserFailed } =
  allUserSlice.actions;

export default allUserSlice.reducer;
