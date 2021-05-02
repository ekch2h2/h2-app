import {SET_ERRORS, CLEAR_ERRORS, LOADING_UI, STOP_LOADING_UI} from "../types";

const initalState = {
    loading: false,
    errors: null
};

const uiReducers = function (state = initalState, action) {
    switch (action.type) {
        default:
            return state;
        case SET_ERRORS:
            return {
                ...state,
                loading: false,
                errors: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                loading: false,
                errors: null
            };
        case LOADING_UI:
            return {
                ...state,
                loading: true
            };
        case STOP_LOADING_UI:
            return {
                ...state,
                loading: false
            };
    }
}

export default uiReducers;