const { validateAnnouncement, validateAnnouncementBody } = require("../util/validators");
const { db, admin } = require("../util/admin");

exports.getAllAnnouncements = (req, res) => {
    db.collection('announcements')
        .orderBy("createdAt", "desc")
        .get()
        .then(data => {
            let announcements = [];
            data.forEach(doc => {
                announcements.push({
                    announcementId: doc.id,
                    ...doc.data()
                })
            });
            return res.json(announcements);
        })
        .catch((err) => console.error(err));
};

exports.postOneAnnouncement = (req, res) => {
    const newAnnouncement = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    const {errors, valid} = validateAnnouncement(newAnnouncement);

    if (!valid) {
        return res.status(400).json(errors)
    }

    admin.firestore().collection('announcements').add(newAnnouncement)
        .then(doc => {
            const resAnnouncement = newAnnouncement;
            resAnnouncement.announcementId = doc.id;

            return res.json(resAnnouncement)
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: "Something went wrong"});
        })
};

exports.getAnnouncement = (req, res) => {
    let announcementData = {};
    db.doc(`/announcements/${req.params.announcementId}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: "Stream not found"})
            }
            announcementData = doc.data();
            announcementData.announcementId = doc.id;
            return db.collection("comments")
                .where("announcementId", "==", req.params.announcementId)
                .orderBy("createdAt", "desc")
                .get();
        })
        .then( data => {
            announcementData.comments = [];
            data.forEach( doc => {
                announcementData.comments.push(doc.data());
            });
            return res.json(announcementData);
        })
        .catch( err => {
            console.log(err);
            return res.status(500).json({error: err.code})
        });
};

exports.updateAnnouncement = (req, res) => {
    const announcementId = req.params.announcementId;
    const body = req.body.body;
    const { errors, valid } = validateAnnouncementBody(body);

    if (!valid) {
        return res.status(400).json(errors)
    }

    db.doc(`/announcements/${announcementId}`).update("body", body)
        .then(() => {
            return res.json({ message: "Announcement updated successfully"})
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err.code})
        });
};

exports.commentOnAnnouncement = (req, res) => {
    if (req.body.body.trim() === "") {
        return res.status(400).json({ error: "Must not be empty" });
    }

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        announcementId: req.params.announcementId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/announcements/${req.params.announcementId}`).get()
        .then( doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: "Announcement does not exist"})
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
            return db.collection("/comments").add(newComment);

        })
        .then( () => {
            return res.json(newComment)
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: err.code });
        })
};

exports.likeAnnouncement = (req, res) => {
    const likeDocument = db.collection("likes").where("userHandle", "==", req.user.handle)
        .where("announcementId", "==", req.params.announcementId).limit(1);

    const announcementDocument = db.doc(`/announcements/${req.params.announcementId}`);

    let announcementData = {};

    announcementDocument.get()
        .then( doc => {
            if (doc.exists) {
                announcementData = doc.data();
                announcementData.announcementId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({error: "Announcement not found"});
            }
        })
        .then(data => {
            if (data.empty) {
                return db.collection("likes")
                    .add({
                        announcementId: req.params.announcementId,
                        userHandle: req.user.handle
                    })
                    .then(() => {
                        announcementData.likeCount ++;
                        return announcementDocument.update({ likeCount: announcementData.likeCount } )
                    })
                    .then(() => {
                        return res.json(announcementData)
                    })
            } else {
                return res.status(400).json({error: "Announcement already liked"})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err.code})
        })

};

exports.unlikeAnnouncement = (req, res) => {
    const likeDocument = db.collection("likes").where("userHandle", "==", req.user.handle)
        .where("announcementId", "==", req.params.announcementId).limit(1);

    const announcementDocument = db.doc(`/announcements/${req.params.announcementId}`);

    let announcementData = {};

    announcementDocument.get()
        .then( doc => {
            if (doc.exists) {
                announcementData = doc.data();
                announcementData.announcementId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({error: "Announcement not found"});
            }
        })
        .then(data => {
            if (data.empty) {
                return res.status(400).json({error: "Announcement not liked"});
            } else {
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                    .then(() => {
                        announcementData.likeCount --;
                        return announcementDocument.update({ likeCount: announcementData.likeCount } )
                    })
                    .then(() => {
                        return res.json(announcementData)
                    })
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err.code})
        })
};

// Delete a announcement
exports.deleteAnnouncement = (req, res) => {
    const document = db.doc(`/announcements/${req.params.announcementId}`);

    document.get()
        .then( doc => {
            if (!doc.exists) {
                return res.status(404).json({error: "Announcement not found"})
            }

            if (doc.data().userHandle !== req.user.handle) {
                return res.status(403).json({error: "Unauthorized"})
            } else {
                return document.delete();
            }
        })
        .then(() => {
            return res.json({ message: "Announcement deleted successfully"})
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err.code})
        });
};