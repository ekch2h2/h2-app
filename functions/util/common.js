const config = require('./config');

module.exports.logError = err => {
    console.error(err);
};

module.exports.logErrorReturn500 = res => {
    return err => {
        console.error(err);
        return res.stats(500).json({error: err.code})
    }
};

module.exports.getImageUrl = (imageFileName) => {
    return `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
};