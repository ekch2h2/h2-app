const functions = require('firebase-functions');
const {
    getAllAnnouncements,
    postOneAnnouncement,
    getAnnouncement,
    commentOnAnnouncement,
    likeAnnouncement,
    unlikeAnnouncement,
    deleteAnnouncement,
    updateAnnouncement
} = require('./handlers/announcements');
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
// Announcement routes
app.get("/announcements", getAllAnnouncements);
app.post("/announcement", FBAuth, postOneAnnouncement);
app.get("/announcement/:announcementId", getAnnouncement);
app.post("/announcement/:announcementId", FBAuth, updateAnnouncement);
app.delete("/announcement/:announcementId", FBAuth, deleteAnnouncement);
app.get("/announcement/:announcementId/like", FBAuth, likeAnnouncement);
app.get("/announcement/:announcementId/unlike", FBAuth, unlikeAnnouncement);
app.post("/announcement/:announcementId/comment", FBAuth, commentOnAnnouncement);

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
        return db.doc(`/announcements/${snapshot.data().announcementId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: "like",
                        read: false,
                        announcementId: doc.id
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
        return db.doc(`/announcements/${snapshot.data().announcementId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: "comment",
                        read: false,
                        announcementId: doc.id
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
            return db.collection("announcements")
                .where("userHandle", "==", change.after.data().handle).get()
                .then(data => {
                    data.forEach(doc => {
                        const announcement = db.doc(`/announcements/${doc.id}`);
                        batch.update(announcement, {userImage: change.after.data().imageUrl});
                    });
                    return batch.commit()
                })
        } else {
            return true;
        }
    });


exports.onAnnouncementDelete = functions.region("us-central1")
    .firestore.document("/announcement/{announcementId}")
    .onDelete((snapshot, context) => {
        const announcementId = context.params.announcementId;
        const batch = db.batch();
        return db.collection("comments").where("announcementId", "==", announcementId).get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`))
                });
                return db.collection("likes").where("announcementId", "==", announcementId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`))
                });
                return db.collection("notifications").where("announcementId", "==", announcementId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`))
                });
                return batch.commit();
            })
            .catch(logError)

    });