const admin = require('firebase-admin');

// Replace this with the path to your Firebase service account key file
const serviceAccount = require('/Users/hubert/Downloads/network-insider-firebase-adminsdk-4axco-ce029cd370.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://network-insider.firebaseio.com',
});

module.exports = admin;