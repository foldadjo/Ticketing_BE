const admin = require("firebase-admin");

const serviceAccount = require("./ticketing-e7d22-firebase-adminsdk-wmn1f-f38bd955a7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
