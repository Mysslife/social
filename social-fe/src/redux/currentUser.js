import { createSlice } from "@reduxjs/toolkit";

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    currentUser: JSON.parse(localStorage.getItem("socialUser")) || null,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isFetching = false;
      localStorage.setItem("socialUser", JSON.stringify(action.payload));
    },
    loginFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    logout: (state) => {
      state.currentUser = null;
      localStorage.setItem("socialUser", null);
    },

    // FOLLOW:
    followUserStart: (state) => {
      state.isFetching = true;
    },
    followUserSuccess: (state) => {
      state.isFetching = false;
    },
    followUserFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // UNFOLLOW:
    unfollowUserStart: (state) => {
      state.isFetching = true;
    },
    unfollowUserSuccess: (state) => {
      state.isFetching = false;
    },
    unfollowUserFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // ADD ONE FOLLOWINGS:
    addFollowings: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        followings: [...state.currentUser.followings, action.payload],
      };
      localStorage.setItem("socialUser", JSON.stringify(state.currentUser));
      state.isFetching = false;
      state.error = false;
    },
    // REMOVE ONE FOLLOWINGS:
    removeFollowings: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        followings: state.currentUser.followings.filter(
          (following) => following !== action.payload
        ),
      };
      localStorage.setItem("socialUser", JSON.stringify(state.currentUser));
      state.isFetching = false;
      state.error = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  followUserStart,
  followUserSuccess,
  followUserFailed,
  unfollowUserStart,
  unfollowUserSuccess,
  unfollowUserFailed,
  addFollowings,
  removeFollowings,
} = currentUserSlice.actions;
export default currentUserSlice.reducer;
