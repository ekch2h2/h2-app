const admin = require("firebase-admin");

const serviceAccount = require("../h2-app-firebase-adminsdk-2hynj-7e9bbf266d.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://h2-app.firebaseio.com",
    storageBucket: "h2-app.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };