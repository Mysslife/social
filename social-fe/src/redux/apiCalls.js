import {
  loginStart,
  loginSuccess,
  loginFailed,
  followUserStart,
  followUserSuccess,
  followUserFailed,
  unfollowUserStart,
  unfollowUserSuccess,
  unfollowUserFailed,
} from "./currentUser";
import { publicRequest, userRequest } from "./requestMethods";
import {
  getAllUserStart,
  getAllUserSuccess,
  getAltUserFailed,
} from "./allUserRedux";

import {
  getAllUserPostsStart,
  getAllUserPostsSuccess,
  getAllUserPostsFailed,
  addOnePostStart,
  addOnePostSuccess,
  addOnePostFailed,
  updatePostStart,
  updatePostSuccess,
  updatePostFailed,
} from "./userPostRedux";

import {
  getAllUserFriendsStart,
  getAllUserFriendsSuccess,
  getAllUserFriendsFailed,
} from "./userFriendListRedux";

// LOGIN:
export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailed());
  }
};

// GET ALL USERS:
export const getAllUser = async (dispatch) => {
  dispatch(getAllUserStart());
  try {
    const res = await userRequest.get("/users");
    dispatch(getAllUserSuccess(res.data));
  } catch (err) {
    dispatch(getAltUserFailed());
  }
};

// GET ALL POSTS OF ONE USER:
export const getAllPostsOfOneUser = async (dispatch, username, userId) => {
  dispatch(getAllUserPostsStart());
  try {
    const res = (await username)
      ? await userRequest.get(`/posts/profile/${username}`)
      : await userRequest.get(`/posts/timeline/${userId}`);

    dispatch(
      getAllUserPostsSuccess(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      )
    );
  } catch (err) {
    dispatch(getAllUserPostsFailed());
  }
};

// ADD ONE POST:
export const addOnePost = async (dispatch, userId, newPost) => {
  dispatch(addOnePostStart());
  try {
    const res = await userRequest.post(`/posts/${userId}`, newPost);
    dispatch(addOnePostSuccess(res.data));
  } catch (err) {
    dispatch(addOnePostFailed());
  }
};

// GET ALL FRIENDS OF ONE USER:
export const getAllFriendsOfOneUser = async (dispatch, username) => {
  dispatch(getAllUserFriendsStart());
  try {
    const res = await userRequest.get(`/users/friends/${username}`);
    dispatch(getAllUserFriendsSuccess(res.data.reverse()));
  } catch (err) {
    dispatch(getAllUserFriendsFailed());
  }
};

// FOLLOW AN USER:
export const followAnUser = async (dispatch, currentUserId, targetUserId) => {
  dispatch(followUserStart());
  try {
    const res = await userRequest.put(`/users/${targetUserId}/follow`, {
      userId: currentUserId,
    });
    dispatch(followUserSuccess());
  } catch (err) {
    dispatch(followUserFailed());
  }
};

// UNFOLLOW AN USER:
export const unfollowAnUser = async (dispatch, currentUserId, targetUserId) => {
  dispatch(unfollowUserStart());
  try {
    const res = await userRequest.put(`/users/${targetUserId}/unfollow`, {
      userId: currentUserId,
    });
    dispatch(unfollowUserSuccess());
  } catch (err) {
    dispatch(unfollowUserFailed());
  }
};

// UPDATE ONE POST:
export const updatePost = async (dispatch, updateInfo) => {
  const { postId, ...rest } = updateInfo;

  dispatch(updatePostStart());
  try {
    const res = await userRequest.put(`/posts/${postId}`, rest);
    dispatch(updatePostSuccess(res.data));
  } catch (err) {
    dispatch(updatePostFailed());
  }
};
