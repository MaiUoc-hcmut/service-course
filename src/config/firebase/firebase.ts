// const serviceAccount = require('./creds.json');
const admin = require('firebase-admin');

require('dotenv').config();


let private_key = process.env.PRIVATE_KEY;

if (private_key !== undefined) {
    private_key = private_key.replace(/\\n/g, '\n');
}

const serviceAccount = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": private_key,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_CERT_URL,
    "universe_domain": process.env.UNIVERSE_DOMAIN
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {
    apiKey: "AIzaSyA9e8LElTTdOqQGgsNyfW4bAY50DzuWpPs",
    authDomain: "study365-a3ffe.firebaseapp.com",
    projectId: "study365-a3ffe",
    storageBucket: "study365-a3ffe.appspot.com",
    messagingSenderId: "594995981304",
    appId: "1:594995981304:web:05f3463e75d6a3bf18c40d",
    measurementId: "G-ZKNB53RPEY"
};

const storage = admin.storage();

module.exports = { storage, firebaseConfig };