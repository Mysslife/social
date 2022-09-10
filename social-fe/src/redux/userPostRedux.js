import { createSlice } from "@reduxjs/toolkit";

export const userPostSlice = createSlice({
  // tất cả post của user và bạn của user đang follows
  name: "userPosts",
  initialState: {
    userPosts: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    // GET ALL USER'S POSTS:
    getAllUserPostsStart: (state) => {
      state.isFetching = true;
    },
    getAllUserPostsSuccess: (state, action) => {
      state.userPosts = action.payload;
      state.isFetching = false;
    },
    getAllUserPostsFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // ADD ONE USER POST:
    addOnePostStart: (state) => {
      state.isFetching = true;
    },
    addOnePostSuccess: (state, action) => {
      state.isFetching = false;
      state.userPosts.push(action.payload);
    },
    addOnePostFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // UPDATE ONE USER POST:
    updatePostStart: (state) => {
      state.isFetching = true;
    },
    updatePostSuccess: (state, action) => {
      state.isFetching = false;
      state.userPosts[state.userPosts.findIndex(action.payload._id)] =
        action.payload;
    },
    updatePostFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getAllUserPostsStart,
  getAllUserPostsSuccess,
  getAllUserPostsFailed,
  addOnePostStart,
  addOnePostSuccess,
  addOnePostFailed,
  updatePostStart,
  updatePostSuccess,
  updatePostFailed,
} = userPostSlice.actions;
export default userPostSlice.reducer;
