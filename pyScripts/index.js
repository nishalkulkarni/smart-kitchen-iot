import express from "express";
const app = express();
const port = 3253;
import { StillCamera } from "pi-camera-connect";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import admin from "firebase-admin";
import { uuid } from "uuidv4";
import cors from "cors";

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var serviceAccount = {
  type: "",
  project_id: "smart-kitchen-2100c",
  private_key_id: "",
  private_key:
    "",
  client_email:
    "",
  client_id: "",
  auth_uri: "",
  token_uri: "",
  auth_provider_x509_cert_url: "",
  client_x509_cert_url:
    "",
};

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
    width: 1280,
    height: 720,
    delay: 4000,
  });
  const image = await stillCamera.takeImage();

  fs.writeFileSync(fname, image);
  const uuidCalc = uuid();
  return bucket
    .upload(fname, {
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: uuidCalc,
        },
      },
    })
    .then((data) => {
      let file = data[0];
      return Promise.resolve(
        "https://firebasestorage.googleapis.com/v0/b/" +
          bucket.name +
          "/o/" +
          encodeURIComponent(file.name) +
          "?alt=media&token=" +
          uuidCalc
      );
    });
};

app.get("/", (req, res) => {
  //   res.send(dataToSend);
  runApp().then((downloadURL) => {
    console.log(downloadURL);
	res.send(downloadURL);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
