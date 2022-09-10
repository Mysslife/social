import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./currentUser";
import allUserReducer from "./allUserRedux";
import userPostsReducer from "./userPostRedux";
import userFriendsReducer from "./userFriendListRedux";

export const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    allUser: allUserReducer,
    userPosts: userPostsReducer,
    userFriends: userFriendsReducer,
  },
});
