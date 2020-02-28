import React, { useReducer } from "react";
import axios from "axios";
import GithubContext from "./githubContext";
import GithubReducer from "./githubReducer";
import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS
} from "../types";

let githubClientId;
let githubClientSecret;

if (process.env.NODE_ENV !== "production") {
  console.log("Running on production");
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  console.log("Running on localenv");
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
}

const GithubState = props => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search Users
  const searchUsers = async text => {
    console.log("INSIDE searchUsers");
    setLoading();
    const res = await axios.get("https://api.github.com/search/users", {
      params: {
        q: text,
        client_id: githubClientId,
        client_secret: githubClientSecret
      }
    });

    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items
    });
  };

  // Get User
  const getUser = async username => {
    console.log("INSIDE getUser");
    setLoading();

    const res = await axios.get(`https://api.github.com/users/${username}`, {
      params: {
        client_id: githubClientId,
        client_secret: githubClientSecret
      }
    });

    dispatch({
      type: GET_USER,
      payload: res.data
    });
  };
  // Get Repos
  const getUserRepos = async username => {
    console.log("INSIDE getUserRepos");
    setLoading(true);

    const res = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        params: {
          client_id: githubClientId,
          client_secret: githubClientSecret,
          per_page: "5",
          sort: "created:as"
        }
      }
    );
    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  };

  // Clear Users
  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
