import * as firebase from 'firebase/app';
import 'firebase/auth';
import '@firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID
}

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth;

export const provider = new firebase.auth.GithubAuthProvider();

export const storage = firebase.storage();

export const signInWithGithub = () => {
    auth().signInWithPopup(provider);
};

export default firebase;