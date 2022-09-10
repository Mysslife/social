import { createSlice } from "@reduxjs/toolkit";

export const userFriendsListSlice = createSlice({
  name: "userFriends",
  initialState: {
    userFriends: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    // GET ALL USER'S FRIEND hay còn được hiểu là FOLLOWINGS:
    getAllUserFriendsStart: (state) => {
      state.isFetching = true;
    },
    getAllUserFriendsSuccess: (state, action) => {
      state.userFriends = action.payload;
      state.isFetching = false;
    },
    getAllUserFriendsFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getAllUserFriendsStart,
  getAllUserFriendsSuccess,
  getAllUserFriendsFailed,
} = userFriendsListSlice.actions;
export default userFriendsListSlice.reducer;
