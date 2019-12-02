import firebase from 'firebase/app';
import 'firebase/database';
    
const firebaseConfig = {
    apiKey: "AIzaSyB4l6v1OxOedceo75SzwzcNxeo4btSNeEk",
    authDomain: "music-playlist-7a6cb.firebaseapp.com",
    databaseURL: "https://music-playlist-7a6cb.firebaseio.com",
    projectId: "music-playlist-7a6cb",
    storageBucket: "music-playlist-7a6cb.appspot.com",
    messagingSenderId: "723948106867",
    appId: "1:723948106867:web:78d95adc49aa4c4583a606"
  };
  
  firebase.initializeApp(firebaseConfig);

  export default firebase;