import {
    CLEAR_ERRORS,
    LOADING_UI,
    LOADING_USER,
    MARK_NOTIFCATIONS_READ,
    SET_ERRORS,
    SET_UNAUTHENTICATED,
    SET_USER
} from "../types";
import axios from "axios";
import firebase from "firebase/app";

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    firebase.auth().signInWithEmailAndPassword(userData.email, userData.password)
        .then(res => {
            const data = res.user;
            firebase.auth().updateCurrentUser(res.user);
            return data.getIdToken(true)
        })
        .then(idToken => {
            setAuthorizationHeader(idToken);
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        });
};

export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.get('/user')
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data
            })
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
};

export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signup', newUserData)
        .then(res => {
            const data = res.data;
            setAuthorizationHeader(data.token);
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
};

export const logoutUser = () => (dispatch) => {
    firebase.auth().signOut().then(() => {
        dispatch({ type: SET_UNAUTHENTICATED })
    })
};

const setAuthorizationHeader = (token) => {
    axios.defaults.headers.common["Authentication"] = `Bearer ${token}`;
};

export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post("/user/image", formData)
        .then(res => {
            dispatch(getUserData())
        })
        .catch(err => console.log(err))
};

export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post("/user", userDetails)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.log(err));
};

export const markNotificationsRead = (notificationIds) => dispatch => {
    axios.post("/notifications", notificationIds)
        .then(res => {
            dispatch({
                type: MARK_NOTIFCATIONS_READ
            });
        })
        .catch(err => {
            console.log(err);
        })

};