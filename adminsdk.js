require('dotenv').config();
module.exports = {
  vars: {
    "type": "service_account",
    "project_id": "kilembe-school",
    "private_key_id": process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    "private_key": (process.env.FIREBASE_ADMIN_PRIVATE_KEY).replace(/\\n/g, '\n'),
    "client_email": "firebase-adminsdk-1canj@kilembe-school.iam.gserviceaccount.com",
    "client_id": "104742052484276817005",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1canj%40kilembe-school.iam.gserviceaccount.com"
  }
};
