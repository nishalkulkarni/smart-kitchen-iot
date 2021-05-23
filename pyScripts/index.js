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

var serviceAccount = require(__dirname + "/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://smart-kitchen-2100c-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "gs://smart-kitchen-2100c.appspot.com",
});

app.locals.bucket = admin.storage().bucket();

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
  await app.locals.bucket.file(fname).createWriteStream().end(req.file.buffer)
};

app.get("/", (req, res) => {
  //   res.send(dataToSend);
  runApp();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
