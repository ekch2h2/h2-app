const { admin, db } = require('../util/admin');

module.exports = (req, res, next) => {
    let idToken;
    if (req.headers.authentication && req.headers.authentication.startsWith("Bearer ")) {
        idToken = req.headers.authentication.split("Bearer ")[1]
    } else {
        console.error("No token found");
        return res.status(403).json({ error: "Unauthorized" });
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            console.log(decodedToken);
            return db.collection("users")
                .where("userId", "==", req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.handle = data.docs[0].data().handle;
            req.user.imageUrl = data.docs[0].data().imageUrl;
            return next()
        })
        .catch( err => {
            console.error("Authentication failed.", err);
            return res.status(403).json(err);
        })
};