const admin = require("firebase-admin");

const serviceAccount = require("./ticketing-e7d22-firebase-adminsdk-wmn1f-850e8e002b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
