const { logErrorReturn500 } = require("../util/common");
const { getImageUrl } = require("../util/common");
const { admin, db } = require('../util/admin');
const config = require('../util/config');

const firebase = require("firebase");
firebase.initializeApp(config);
const {validateSignupData, validateLoginData, reduceUserDetails} = require('../util/validators');

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const {errors, valid} = validateSignupData(newUser);

    if (!valid) {
        return res.status(400).json(errors)
    }
    let token, userId;

    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ handle: "This handle is already taken"})
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(( data ) => {
            userId = data.user.uid;
            return data.user.getIdToken()
        })
        .then(( tokenId ) => {
            token = tokenId;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId,
                imageUrl: getImageUrl("noImage.png")
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then((data) => {
            return res.status(201).json({ token })
        })
        .catch((err) => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                return res.status(400).json( {email: "Email is already in use"} )
            }
            return res.status(500).json({ error: err.code } )
        })
};

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const {errors, valid} = validateLoginData(user);

    if (!valid) {
        return res.status(400).json(errors);
    }

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken()
        })
        .then(token => {
            return res.json({token})
        })
        .catch(err => {
            console.error("Error sign in", err);
            if (err.code === "auth/wrong-password") {
                return res.status(403).json({general: "Wrong password, please try again."})
            }
            return res.status(500).json({error: err.code});
        })
};

exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);
    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({message: "Details added successfully"});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code})
        })
};

exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.user = doc.data()
                return db.collection('announcements').where('userHandle', '==', req.params.handle)
                    .orderBy('createdAt', 'desc')
                    .get();
            } else {
                return res.status(404).json({error: "User not found"})
            }
        })
        .then(data => {
            userData.announcements = [];
            data.forEach(doc => {
                userData.announcements.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userHandle: doc.data().userHandle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    announcementId: doc.id
                })
            });
            return res.json(userData)
        })
        .catch(logErrorReturn500(res))
};

exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return db.collection('likes').where('userHandle', "==", req.user.handle).get();
            }
        })
        .then(data => {
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data());
            });
            return db.collection('notifications')
                .where('recipient', "==", req.user.handle)
                .orderBy('createdAt', 'desc')
                .limit(10).get();
        })
        .then(data => {
            userData.notifications = [];
            data.forEach(doc => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    announcementId: doc.data().announcementId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationId: doc.id
                })
            });
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        })
};

exports.uploadImage = (req, res) => {
    const BusyBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busyboy = new BusyBoy({headers: req.headers});

    let imageFileName;
    let imageToBeUploaded = {};

    busyboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({ error: 'Wrong file type submitted'});
        }

        const filenameParts = filename.split('.');
        const imageExt = filenameParts[filenameParts.length - 1];
        imageFileName = `${Math.round(Math.random() * 10000000000)}.${imageExt}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));
    });

    busyboy.on('finish', () => {
       admin.storage().bucket()
           .upload(imageToBeUploaded.filepath, {
               resumable: false,
               metadata: {
                   metadata: {
                       contentType: imageToBeUploaded.mimetype
                   }
               }
            })
           .then(() => {
               const imageUrl = getImageUrl(imageFileName);
               return db.doc(`/users/${req.user.handle}`).update({imageUrl})
           })
           .then(() => {
               return res.json({message: 'Image uploaded successfully'})
           })
           .catch((err) => {
               console.error(err);
               return res.status(500).json({ error: err.code });
           })
    });

    busyboy.end(req.rawBody)
};


exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, {read: true})
    });
    batch.commit()
        .then(() => {
            return res.json({message: 'Notifications marked read'})
        })
        .catch(logErrorReturn500(res))
};