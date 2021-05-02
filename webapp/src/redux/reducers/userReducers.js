import {
    SET_USER,
    LOADING_USER,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    LIKE_ANNOUNCEMENT,
    UNLIKE_ANNOUNCEMENT,
    MARK_NOTIFCATIONS_READ
} from "../types";

const initialState = {
    authenticated: false,
    credentials: {},
    likes: [],
    notifications: [],
    loading: false
};

const userReducers = function(state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                loading: false,
                authenticated: true,
                ...action.payload
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            };
        case LIKE_ANNOUNCEMENT:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        announcementId: action.payload.announcementId
                    }
                ]
            };
        case UNLIKE_ANNOUNCEMENT:
            return {
                ...state,
                likes: state.likes.filter(like => like.announcementId !== action.payload.announcementId)
            };
        case MARK_NOTIFCATIONS_READ:
            state.notifications.forEach(n => n.read = true);
            return {...state};
        default:
            return state
    }
}

export default userReducers;