module.exports.logError = err => {
    console.error(err);
};

module.exports.logErrorReturn500 = res => {
    return err => {
        console.error(err);
        return res.stats(500).json({error: err.code})
    }
};