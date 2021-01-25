import {
    SET_ANNOUNCEMENTS,
    LOADING_DATA,
    LIKE_ANNOUNCEMENT,
    UNLIKE_ANNOUNCEMENT,
    DELETE_ANNOUNCEMENT,
    CLEAR_ERRORS,
    SET_ERRORS,
    LOADING_UI,
    POST_ANNOUNCEMENT,
    SET_ANNOUNCEMENT,
    STOP_LOADING_UI,
    SUBMIT_COMMENT,
    LOADING_USER,
    APPEND_IMAGEURL_TO_ANNOUNCEMENT
} from "../types";
import axios from 'axios';

export const getAnnouncements = () => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get("/announcements")
        .then(res => {
            dispatch({
                type: SET_ANNOUNCEMENTS,
                payload: res.data.map(s => ({...s, announcementId: s.announcementId}))
            })
        })
        .catch(err => {
            dispatch({
                type: SET_ANNOUNCEMENTS,
                payload: []
            })

        })
};

export const getAnnouncement = (announcementId) => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.get(`/announcement/${announcementId}`)
        .then(res => {
            dispatch({
                type: SET_ANNOUNCEMENT,
                payload: {...res.data, announcementId: res.data.announcementId}
            });
            dispatch({
                type: STOP_LOADING_UI
            })
        })
        .catch(err => {
            console.log(err);
        })
};

export const postAnnouncement = (newAnnouncement) => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.post("/announcement", newAnnouncement)
        .then(res => {
            dispatch({
                type: POST_ANNOUNCEMENT,
                payload: {...res.data, announcementId: res.data.announcementId}
            });
            dispatch(clearErrors())
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
};

export const updateAnnouncement = (announcementId, body) => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.post(`/announcement/${announcementId}`, { body: body })
        .then(() => {
            dispatch(getAnnouncements());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
};

export const likeAnnouncement = (announcementId) => dispatch => {
    axios.get(`/announcement/${announcementId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_ANNOUNCEMENT,
                payload: {...res.data, announcementId: res.data.announcementId}
            })
        })
        .catch(err => console.log(err))
};

export const unlikeAnnouncement = (announcementId) => dispatch => {
    axios.get(`/announcement/${announcementId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_ANNOUNCEMENT,
                payload: {...res.data, announcementId: res.data.announcementId}
            })
        })
        .catch(err => console.log(err))
};

export const deleteAnnouncement = (announcementId) => dispatch => {
    axios.delete(`/announcement/${announcementId}`)
        .then(() => {
            dispatch({
                type: DELETE_ANNOUNCEMENT, payload: announcementId
            })
        })
        .catch(err => console.log(err));
};

export const archiveAnnouncement = (announcementId) => dispatch => {
    axios.post(`/announcement/${announcementId}`, { isArchived: true })
        .then(() => {
            dispatch(getAnnouncements());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        });
};

export const pinAnnouncement = (announcementId, pinToTop) => dispatch => {
    axios.post(`/announcement/${announcementId}`, { pinToTop })
        .then(() => {
            dispatch(getAnnouncements());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        });
};

export const submitComment = (announcementId, commentData) => dispatch => {
    axios.post(`/announcement/${announcementId}/comment`, commentData)
        .then(res => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
};

export const getUserData = (userHandle) => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get(`/user/${userHandle}`)
        .then((res) => {
            dispatch({
                type: SET_ANNOUNCEMENTS,
                payload: res.data.announcements
            })
        })
        .catch(() => {
            dispatch({
                type: SET_ANNOUNCEMENTS,
                payload: null
            });
        });
};

export const clearErrors = () => dispatch => {
    dispatch({ type: CLEAR_ERRORS })
};

export const uploadImageForPost = (announcementId, formData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post(`/announcement/${announcementId}/image`, formData)
        .then(res => {
            dispatch({
                type: APPEND_IMAGEURL_TO_ANNOUNCEMENT,
                payload: res.data.imageUrl
            })
        })
        .catch(err => console.log(err))
};
