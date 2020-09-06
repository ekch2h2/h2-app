const functions = require('firebase-functions');
const {
    getAllScreams,
    postOneScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream,
    updateAnnouncement
} = require('./handlers/screams');
const { signup, login, addUserDetails, getAuthenticatedUser, uploadImage,
    getUserDetails,
    markNotificationsRead
} = require('./handlers/users');
const express = require("express");
const FBAuth = require('./util/fbAuth');
const app = express();
const cors = require('cors');
const { db } = require('./util/admin');
const {
    logError
} = require('./util/common');

app.use(cors());
// Scream routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream);
app.get("/scream/:screamId", getScream);
app.post("/announcement/:announcementId", FBAuth, updateAnnouncement);
app.delete("/scream/:screamId", FBAuth, deleteScream);
app.get("/scream/:screamId/like", FBAuth, likeScream);
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);

// User routes
app.post("/user", FBAuth, addUserDetails);
app.post("/user/image", FBAuth, uploadImage);
app.get("/user", FBAuth, getAuthenticatedUser);
app.post("/signup", signup);
app.post("/login", login);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNoteficationOnLike = functions
    .region("us-central1")
    .firestore.document("likes/{id}")
    .onCreate((snapshot) => {
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: "like",
                        read: false,
                        screamId: doc.id
                    })
                }
            })
            .catch(logError);

    });

exports.deleteNotificationOnUnLike = functions.region("us-central1")
    .firestore.document("comments/{id}")
    .onDelete((snapshot) => {
        return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch(logError);
    });

exports.createNoteficationOnComment = functions
    .region("us-central1")
    .firestore.document("comments/{id}")
    .onCreate((snapshot) => {
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: "comment",
                        read: false,
                        screamId: doc.id
                    })
                }
            })
            .catch(logError);
    });

exports.onUserImageChange = functions.region("us-central1")
    .firestore.document("/user/{userId}")
    .onUpdate((change) => {
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            console.info("Image has changed");
            const batch = db.batch();
            return db.collection("screams")
                .where("userHandle", "==", change.after.data().handle).get()
                .then(data => {
                    data.forEach(doc => {
                        const scream = db.doc(`/screams/${doc.id}`);
                        batch.update(scream, {userImage: change.after.data().imageUrl});
                    });
                    return batch.commit()
                })
        } else {
            return true;
        }
    });


exports.onScreamDelete = functions.region("us-central1")
    .firestore.document("/scream/{screamId}")
    .onDelete((snapshot, context) => {
        const screamId = context.params.screamId;
        const batch = db.batch();
        return db.collection("comments").where("screamId", "==", screamId).get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`))
                });
                return db.collection("likes").where("screamId", "==", screamId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`))
                });
                return db.collection("notifications").where("screamId", "==", screamId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`))
                });
                return batch.commit();
            })
            .catch(logError)

    });