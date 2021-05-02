import {
    SET_ANNOUNCEMENTS,
    LIKE_ANNOUNCEMENT,
    UNLIKE_ANNOUNCEMENT,
    LOADING_DATA,
    DELETE_ANNOUNCEMENT,
    POST_ANNOUNCEMENT,
    SET_ANNOUNCEMENT,
    SUBMIT_COMMENT, APPEND_IMAGEURL_TO_ANNOUNCEMENT
} from "../types";

const initialState = {
    announcements: [],
    announcement: {},
    loading: false
};

const reducers = function(state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case SET_ANNOUNCEMENTS:
            const topItems = action.payload.filter(e => !!e.pinToTop);
            const regularItems = action.payload.filter(e => !e.pinToTop);

            return {
                ...state,
                announcements: [
                    ...topItems,
                    ...regularItems
                ],
                loading: false
            };
        case SET_ANNOUNCEMENT:
            return {
                ...state,
                announcement: action.payload
            };
        case APPEND_IMAGEURL_TO_ANNOUNCEMENT:
            return {
                ...state,
                announcement: {
                    ...state.announcement,
                    body: `${state.announcement.body}\n\n![](${action.payload})`
                }
            };
        case LIKE_ANNOUNCEMENT:
        case UNLIKE_ANNOUNCEMENT:
            let index = state.announcements
                .findIndex((ann) => ann.announcementId === action.payload.announcementId);
            state.announcements[index] = action.payload;
            if(state.announcement.announcementId === action.payload.announcementId) {
                state.announcement = {
                    ...state.announcement,
                    ...action.payload
                }
            }
            return {
                ...state
            };
        case DELETE_ANNOUNCEMENT:
            let deleteIdx = state.announcements.findIndex(ann => ann.announcementId === action.payload);
            state.announcements.splice(deleteIdx, 1);
            return {
                ...state
            };
        case POST_ANNOUNCEMENT:
            return {
                ...state,
                announcements: [
                    action.payload,
                    ...state.announcements
                ]
            };
        case SUBMIT_COMMENT:
            return {
                ...state,
                announcement: {
                    ...state.announcement,
                    comments: [
                        action.payload,
                        ...state.announcement.comments
                    ]
                }
            };
        default:
            return state;
    }
}

export default reducers;