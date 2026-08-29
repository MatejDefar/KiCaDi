import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB_udbih0twchg1jtl3gxCsNy2_n03CopU',
  authDomain: 'kicadi.firebaseapp.com',
  projectId: 'kicadi',
  storageBucket: 'kicadi.firebasestorage.app',
  messagingSenderId: '107346999464',
  appId: '1:107346999464:web:c49c3ddc690ba57239ea9d',
  measurementId: 'G-XWEKD395E1',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
