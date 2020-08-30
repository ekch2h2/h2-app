import {
    SET_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_UNAUTHENTICATED,
    LOADING_USER, MARK_NOTIFCATIONS_READ
} from "../types";
import axios from "axios";


export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/login', userData)
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
    localStorage.removeItem("FBIdToken");
    delete axios.defaults.headers.common["Authentication"];
    dispatch({ type: SET_UNAUTHENTICATED })
};

const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authentication"] = FBIdToken;
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

}