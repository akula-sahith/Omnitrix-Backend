// firebaseConfig.js
const admin = require("firebase-admin");
const path = require("path");

// Load Firebase service account JSON
const serviceAccount = require(path.resolve(__dirname, "firebaseServiceAccount.json"));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "fitness-bea26.appspot.com", // replace with your bucket name
});

// Export the bucket for uploads
const bucket = admin.storage().bucket();
module.exports = bucket;
