import axios from "axios";

export const setAuthorizationHeader = (token) => {
    axios.defaults.headers.common["Authentication"] = `Bearer ${token}`;
};