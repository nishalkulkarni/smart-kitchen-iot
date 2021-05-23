import express from "express";
const app = express();
const port = 3253;
import {StillCamera} from  "pi-camera-connect";
import * as fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import firebase from 'firebase';
import '@firebase/storage';

var firebaseConfig = {
  apiKey: "AIzaSyBfLfJ3i37XQtRMF1rfh6rtvSRW_RfakIk",
  authDomain: "smart-kitchen-2100c.firebaseapp.com",
  databaseURL: "https://smart-kitchen-2100c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-kitchen-2100c",
  storageBucket: "smart-kitchen-2100c.appspot.com",
  messagingSenderId: "155436361699",
  appId: "1:155436361699:web:c01201c83ce4b568ec22d6",
  measurementId: "G-2RR1Z9N3KR"
}

firebase.initializeApp(firebaseConfig);

var storage = firebase.storage();
var storageRef = firebase.storage().ref();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runApp = async () => {
	var dt = new Date();
	var fname = __dirname +"/"+ dt.getDate() +""+(dt.getMonth()+1)+""+dt.getFullYear()+""+dt.getHours()+":"
		+dt.getMinutes()+":"+dt.getSeconds()+ ".jpg";
	console.log(fname);

	const stillCamera = new StillCamera({
		delay: 1000,
	});
	const image = await stillCamera.takeImage();

	fs.writeFileSync(fname, image);
  var imageRef = storageRef.child(fname);
  const fileToUpload = fs.readFileSync(fname);
  const metadata = { contentType: 'image/jpeg; charset=utf-8' }
  imageRef.put(fileToUpload,metadata).then((snapshot) => {
    console.log('Uploaded an array!', snapshot)
  })
};

app.get("/", (req, res) => {
	//   res.send(dataToSend);
	runApp();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
