import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/database';

// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  var firebaseConfig = {
    apiKey: "AIzaSyBfLfJ3i37XQtRMF1rfh6rtvSRW_RfakIk",
    authDomain: "smart-kitchen-2100c.firebaseapp.com",
    projectId: "smart-kitchen-2100c",
    storageBucket: "smart-kitchen-2100c.appspot.com",
    messagingSenderId: "155436361699",
    appId: "1:155436361699:web:c01201c83ce4b568ec22d6",
    measurementId: "G-2RR1Z9N3KR",
    databaseURL:"https://smart-kitchen-2100c-default-rtdb.asia-southeast1.firebasedatabase.app"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore(); 
const projectDatabase = firebase.database();

const timestamp = firebase.firestore.FieldValue.serverTimeStamp

export {projectStorage,projectDatabase, projectFirestore, timestamp};