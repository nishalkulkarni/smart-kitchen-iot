import express from "express";
const app = express();
const port = 3253;
import { StillCamera } from "pi-camera-connect";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import admin from "firebase-admin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var serviceAccount = {
  "type": "service_account",
  "project_id": "smart-kitchen-2100c",
  "private_key_id": "ed77a00f23c9b0db597aeca41d7f8d1f9b21a133",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCs0jjJ4X3txkrx\nY6mZq+eI/rEzahOwTN9sDB8Py3cZnj7tjKyJlxxjivdyZnkKrZcKyPtBPl1TR+5U\ns+Y2HmZVRboq4VpbXNAfP+Qm+3LVDwN/pBMlRckTE2y5u8++eTk8sh7Z20k6aWpP\ncYCX3zYvhSWb5rfFQBSHepj4X9H4V5n0abZzD5vQKiJ59iMQbPiQeyYvbhaitbmF\nFplrrVq9U9cNrpSOSk3o3UGqLxMhUaZJfHZc6zd2FEg8WzxHocaFRyZemXc9SxoX\n4watR0o7+PZ8kbZQsaTeM1aVyEHbNOuK8oVDyzVBYVxpnL1WL1otDGSJnalx/Q3q\nlma9XHGtAgMBAAECggEAO4sircvXS3kqkQi5gozL9VNrUj+WEQQrZlq2yQZdPqJb\nJBV3zOAXk+RpZS0RPzCX/ctJZi1KkksSPnTNOJA4yeCASA3kx92uh1XIEfZIlkfZ\n+LxbLFhi8wOaTlP7O7Egm1zzbDQ1gr6XNk/w8mKhlLXXQ2O2pWtyp0sCMXEyMtHK\no6ne0VygMEHDTZr4sQ+DEmnU4SyqffqhhPJ48R2uBCA6p/xPVRjqkKlltS97KkuL\nJc3GY/5mLD+8W2y4DpG2VGOrQh9UWXMEtqrQf8ZrZ7zbSBz7KH8AhOpA0HuKxXGv\nXPbZ2MvCXIKuSXs3gLLQ5uU7NgxdSygCwL0ervu4sQKBgQDgsCot1nJjf0uby73C\nB0olj77FPzWopUae9p7LqE0mDE+tHVS1vdiD6P+vc6wK+dycmua5pD8kqwVwaxVC\n+XJpTQg69iaaayCTWEs6sDuP4DyxwgZ6j3fk8HAHWcPqbGJTthOkkb8I3uxHu0kv\nmkH6e+1Dl22/Bcez/ZExMSc9cwKBgQDE567uHQ0gOaDDuoeUR9pDUArjJitTywmd\nzcbIJPv+EduuIZzcH2VSWUAiiEOg9ooQVUfS7DnbniPVSZMHdm+GJZWWT7QjbAAC\nTsSRDLQqql5+/gWBQmciKFLSfcUteRyj6O99P0tPWKZjxPBcwdd/PGmGIThEfjKQ\nM37YFJfMXwKBgQDRMfPzfYg/LxPcWFOyxUq5sh4yU+nHvSoFcyTiBS7fT/MXAQoP\ntFRUbKkyWAZEqeJHRMmw6kWIBFsqEelX1Bw8Ama5TtkeSMOprDlOySqLiIG6FyYl\nElLUqzADCAaqyoK54fpj7PbqcXOYTb2UPpFTf/KmTeT2R5Fp+ZonLNaWFQKBgHft\nVJIah6AU+WG8/k7F5J4S5k6rNMB4bYb7ihLk08ZPQimwt0Uqqh+Z1IIz1Fz5S+Xe\nyzwgPK0SiGijwzVMYWinA5DlQqZAZVECgJ6HykQiOCPIu7mapA4d2TPy/mFP3q3G\ndfcm0cumBtHFZVBZj9MjDHJxUUAGTO2fL6aUBFCpAoGAJHwmzhUhkSFLZKMzAAVD\nOmp73OgtTdQImCrZpdM8zHmTmhu+EhNmUVyTlqR6ijVS9WZEN+Lg2Z+cpOENN7FX\n6My8QKWBKICrSH6bAeXt4oDo6P05ZXPo9RYynXZBRP8PMMLgsCr8pK9OXJH86WPr\nYJIBvfkXF092iXOFiqMoxwg=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-9f7lc@smart-kitchen-2100c.iam.gserviceaccount.com",
  "client_id": "102316144751407014517",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9f7lc%40smart-kitchen-2100c.iam.gserviceaccount.com"
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://smart-kitchen-2100c-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "gs://smart-kitchen-2100c.appspot.com",
});

const bucket = admin.storage().bucket();

const runApp = async () => {
  var dt = new Date();
  var fname =
    __dirname +
    "/" +
    dt.getDate() +
    "" +
    (dt.getMonth() + 1) +
    "" +
    dt.getFullYear() +
    "" +
    dt.getHours() +
    ":" +
    dt.getMinutes() +
    ":" +
    dt.getSeconds() +
    ".jpg";
  console.log(fname);

  const stillCamera = new StillCamera({
    delay: 1000,
  });
  const image = await stillCamera.takeImage();

  fs.writeFileSync(fname, image);
  bucket.upload(fname);
};

app.get("/", (req, res) => {
  //   res.send(dataToSend);
  runApp();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
