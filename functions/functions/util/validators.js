

const isEmpty = (s) => {
    return s.trim() === "";
};

const isEmail = (s) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!s.match(emailRegEx);

};

exports.validateSignupData = data => {

    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = "Must not be empty"
    } else if (!isEmail(data.email)) {
        errors.email = "Must be a valid email address"
    }

    if (isEmpty(data.password)) {
        errors.passowrd = "Must not be empty"
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords must match";
    }

    if (isEmpty(data.handle)) {
        errors.handle = "Must not be empty"
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }


};

exports.validateLoginData = data => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = "Must not be empty"
    } else if (!isEmail(data.email)) {
        errors.email = "Must be a valid email address"
    }

    if (isEmpty(data.password)) {
        errors.passowrd = "Must not be empty"
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
};

exports.reduceUserDetails = data => {
    let userDetails = {};
    if (!isEmpty(data.bio.trim())) {
        userDetails.bio = data.bio
    }

    if (!isEmpty(data.website.trim())) {
        if(data.website.trim().substring(0, 4) !== "http") {
            userDetails.website = `http://${data.website.trim()}`;
        } else {
            userDetails.website = data.website;
        }
    }

    if (!isEmpty(data.location.trim())) {
        userDetails.location = data.location;
    }

    return userDetails;
};

exports.validateScream = data => {
    let errors = {};

    if (isEmpty(data.body)) {
        errors.body = "Scream body must not be empty"
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
};

exports.validateAnnouncementBody = body => {
    let errors = {};

    if (isEmpty(body)) {
        errors.body = "Scream body must not be empty"
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
};